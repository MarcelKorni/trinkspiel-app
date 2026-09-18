import { useEffect, useRef, useState } from 'react';
import type { GameComponentProps, GameDefinition } from '../../types/game';
import { useGameStore, type TeamId } from '../../store/useGameStore';
import { ShotAlarm } from '../../components/ShotAlarm';
import { fragenPool, type SchaetzFrage } from './fragen';

const ANZAHL_RUNDEN = 8;
const TIMER_SEKUNDEN = 90;

function ziehezufaelligeFragen(count: number): SchaetzFrage[] {
  const shuffled = [...fragenPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

type Phase = 'timer' | 'aufloesung' | 'shotalarm' | 'fertig';

interface Spielergebnis {
  rundenSiegeA: number;
  rundenSiegeB: number;
  gewinner: TeamId | null;
}

/**
 * Ablauf pro Runde: Frage wird angezeigt und der 90-Sekunden-Timer startet
 * sofort -> danach Aufloesung mit Rundensieg-Auswahl -> naechste Runde
 * startet automatisch, bis alle ANZAHL_RUNDEN gespielt sind. Kein globaler
 * Punktestand - am Ende wird nur angezeigt, welches Team die meisten
 * Rundensiege hatte.
 */
function SchaetzenGame({ onExit }: GameComponentProps) {
  const teams = useGameStore((s) => s.teams);

  const [runden] = useState(() => ziehezufaelligeFragen(ANZAHL_RUNDEN));
  const [rundenIndex, setRundenIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('timer');
  const [sekundenLeft, setSekundenLeft] = useState(TIMER_SEKUNDEN);
  const [vergebenAn, setVergebenAn] = useState<TeamId | null>(null);
  const [ergebnis, setErgebnis] = useState<Spielergebnis | null>(null);

  const intervalRef = useRef<number | null>(null);
  // Ref statt State fuer die Rundensiege, damit der Endstand beim Abschliessen
  // der letzten Runde garantiert aktuell ist (kein stale closure durch setTimeout).
  const rundenSiegeRef = useRef<Record<TeamId, number>>({ A: 0, B: 0 });
  const aktuelleFrage = runden[rundenIndex];

  // Timer startet sofort, sobald eine neue Runde beginnt (Frage wird nicht
  // mehr vorgelesen, nur noch als Text angezeigt).
  useEffect(() => {
    setPhase('timer');
    setSekundenLeft(TIMER_SEKUNDEN);
    setVergebenAn(null);
  }, [aktuelleFrage]);

  // 90-Sekunden-Timer, laeuft nur waehrend Phase "timer"
  useEffect(() => {
    if (phase !== 'timer') return;

    intervalRef.current = window.setInterval(() => {
      setSekundenLeft((s) => {
        if (s <= 1) {
          setPhase('aufloesung');
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [phase]);

  function spielAbschliessen() {
    const { A, B } = rundenSiegeRef.current;
    const gewinner: TeamId | null = A > B ? 'A' : B > A ? 'B' : null;
    setErgebnis({ rundenSiegeA: A, rundenSiegeB: B, gewinner });
    // Nach der letzten Runde des ersten Spiels: Shotalarm fuer alle Teams.
    setPhase('shotalarm');
  }

  function rundeGewinnen(teamId: TeamId) {
    if (vergebenAn) return;
    rundenSiegeRef.current = {
      ...rundenSiegeRef.current,
      [teamId]: rundenSiegeRef.current[teamId] + 1,
    };
    setVergebenAn(teamId);

    const istLetzteRunde = rundenIndex + 1 >= runden.length;
    setTimeout(() => {
      if (istLetzteRunde) {
        spielAbschliessen();
      } else {
        setRundenIndex((i) => i + 1);
      }
    }, 900);
  }

  function timerUeberspringen() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setPhase('aufloesung');
  }

  if (phase === 'shotalarm') {
    return <ShotAlarm onContinue={() => setPhase('fertig')} />;
  }

  if (phase === 'fertig') {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <p className="text-3xl">🎉</p>
        <p className="text-xl font-bold">Schätzen ist fertig gespielt!</p>

        {ergebnis && (
          <div className="card w-full">
            <p className="mb-2 text-sm font-semibold text-white/60">Rundensiege</p>
            <p className="text-lg font-bold">
              {teams.A.name} {ergebnis.rundenSiegeA} : {ergebnis.rundenSiegeB} {teams.B.name}
            </p>
            {ergebnis.gewinner ? (
              <p className="mt-3 font-bold" style={{ color: teams[ergebnis.gewinner].color }}>
                🏆 {teams[ergebnis.gewinner].name} gewinnt das Spiel!
              </p>
            ) : (
              <p className="mt-3 text-white/60">Unentschieden!</p>
            )}
          </div>
        )}

        <button onClick={onExit} className="btn-primary w-full">
          Zurück zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-white/50">
        <span>
          Runde {rundenIndex + 1} / {runden.length}
        </span>
        <span>
          🏆 {rundenSiegeRef.current.A} : {rundenSiegeRef.current.B}
        </span>
        {phase === 'timer' && <span>⏱ {sekundenLeft}s</span>}
      </div>

      <div className="card">
        <p className="mb-1 text-sm font-semibold text-white/60">Frage</p>
        <p className="text-xl font-bold">{aktuelleFrage.frage}</p>
      </div>

      {phase === 'timer' && (
        <div className="card flex flex-col items-center gap-2">
          <div
            className="text-6xl font-black tabular-nums"
            style={{ color: sekundenLeft <= 10 ? '#ff2fa0' : undefined }}
          >
            {sekundenLeft}
          </div>
          <p className="text-sm text-white/50">Sekunden Zeit zum Schätzen & Diskutieren</p>
          <button onClick={timerUeberspringen} className="btn-ghost mt-1 text-sm">
            Timer überspringen → Auflösung
          </button>
        </div>
      )}

      {phase === 'aufloesung' && (
        <div className="flex flex-col gap-4">
          <div className="card border-2 border-neon-lime">
            <p className="mb-1 text-sm font-semibold text-white/60">Antwort</p>
            <p className="text-lg font-bold text-neon-lime">{aktuelleFrage.antwort}</p>
          </div>

          <p className="text-sm font-semibold text-white/70">Welches Team lag näher dran?</p>
          <div className="grid grid-cols-2 gap-3">
            {(['A', 'B'] as const).map((teamId) => {
              const team = teams[teamId];
              const hatRundeGewonnen = vergebenAn === teamId;
              return (
                <button
                  key={teamId}
                  onClick={() => rundeGewinnen(teamId)}
                  disabled={vergebenAn !== null}
                  className="flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-5 font-bold transition active:scale-95 disabled:opacity-50"
                  style={{ borderColor: team.color, color: team.color }}
                >
                  <span className="text-2xl">{hatRundeGewonnen ? '✅ Runde' : '🏆 Runde'}</span>
                  <span className="text-sm">{team.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={onExit} className="btn-ghost mt-2">
        Spiel abbrechen
      </button>
    </div>
  );
}

export const schaetzenGame: GameDefinition = {
  id: 'schaetzen',
  name: 'Schätzen',
  kategorie: 'tisch',
  beschreibung: `${ANZAHL_RUNDEN} Runden, je eine Frage wird angezeigt, dann ${TIMER_SEKUNDEN}s Zeit zum Schätzen.`,
  minSpieler: 2,
  icon: '🤔',
  brauchtTeams: true,
  component: SchaetzenGame,
};
