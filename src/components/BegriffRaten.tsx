import { useEffect, useRef, useState } from 'react';
import { useGameStore, type TeamId } from '../store/useGameStore';

interface BegriffRatenProps {
  onExit: () => void;
  begriffe: string[];
  timerSekunden: number;
  hinweis: string;
}

type Phase = 'bereit' | 'timer' | 'ausgewertet';

function zieheBegriff(pool: string[], ausschluss: string | null): string {
  const kandidaten = ausschluss ? pool.filter((b) => b !== ausschluss) : pool;
  return kandidaten[Math.floor(Math.random() * kandidaten.length)];
}

/**
 * Wiederverwendbarer Rate-Rundenablauf fuer Pantomime & Montagsmaler:
 * Team ist am Zug -> Begriff wird erst nach "Start" aufgedeckt -> Timer
 * laeuft -> "Erraten!" oder "Zeit um" beendet die Runde -> naechstes Team
 * ist dran mit neuem Begriff. Lokale Rundensiege, kein globaler Punktestand.
 */
export function BegriffRaten({ onExit, begriffe, timerSekunden, hinweis }: BegriffRatenProps) {
  const teams = useGameStore((s) => s.teams);
  const [aktivesTeam, setAktivesTeam] = useState<TeamId>('A');
  const [begriff, setBegriff] = useState(() => zieheBegriff(begriffe, null));
  const [phase, setPhase] = useState<Phase>('bereit');
  const [sekundenLeft, setSekundenLeft] = useState(timerSekunden);
  const [punkte, setPunkte] = useState<Record<TeamId, number>>({ A: 0, B: 0 });
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== 'timer') return;

    intervalRef.current = window.setInterval(() => {
      setSekundenLeft((s) => {
        if (s <= 1) {
          setPhase('ausgewertet');
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [phase]);

  function starteRunde() {
    setSekundenLeft(timerSekunden);
    setPhase('timer');
  }

  function beendeRunde(erraten: boolean) {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (erraten) setPunkte((p) => ({ ...p, [aktivesTeam]: p[aktivesTeam] + 1 }));
    setPhase('ausgewertet');
  }

  function naechsteRunde() {
    const naechstesTeam: TeamId = aktivesTeam === 'A' ? 'B' : 'A';
    setAktivesTeam(naechstesTeam);
    setBegriff((b) => zieheBegriff(begriffe, b));
    setPhase('bereit');
  }

  const team = teams[aktivesTeam];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-white/50">{hinweis}</p>

      <div className="flex items-center justify-between text-sm text-white/50">
        <span>
          Am Zug: <span className="font-bold" style={{ color: team.color }}>{team.name}</span>
        </span>
        <span>
          🏆 {punkte.A} : {punkte.B}
        </span>
      </div>

      {phase === 'bereit' && (
        <>
          <div className="card py-10 text-center">
            <p className="text-sm text-white/50">Bereit? Der Begriff wird erst nach "Start" gezeigt.</p>
          </div>
          <button onClick={starteRunde} className="btn-primary text-xl">
            ▶️ Start ({timerSekunden}s)
          </button>
        </>
      )}

      {phase === 'timer' && (
        <>
          <div className="card flex flex-col items-center gap-2 border-2" style={{ borderColor: team.color }}>
            <span className="text-center text-2xl font-black">{begriff}</span>
          </div>
          <div className="card flex flex-col items-center gap-1">
            <span
              className="text-5xl font-black tabular-nums"
              style={{ color: sekundenLeft <= 10 ? '#ff2fa0' : undefined }}
            >
              {sekundenLeft}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => beendeRunde(true)} className="btn-primary !bg-neon-lime !text-base-950">
              ✅ Erraten!
            </button>
            <button onClick={() => beendeRunde(false)} className="btn-secondary">
              ❌ Zeit um
            </button>
          </div>
        </>
      )}

      {phase === 'ausgewertet' && (
        <>
          <div className="card text-center">
            <p className="text-white/70">
              Begriff war: <span className="font-bold text-white">{begriff}</span>
            </p>
          </div>
          <button onClick={naechsteRunde} className="btn-primary text-xl">
            Nächste Runde →
          </button>
        </>
      )}

      <button onClick={onExit} className="btn-ghost mt-2">
        Fertig – zurück zum Dashboard
      </button>
    </div>
  );
}
