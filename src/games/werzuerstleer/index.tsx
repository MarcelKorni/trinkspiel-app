import { useState } from 'react';
import type { GameComponentProps, GameDefinition } from '../../types/game';
import { useGameStore, type TeamId } from '../../store/useGameStore';

const STANDARD_ANZAHL = 5;

function WerZuerstLeerGame({ onExit }: GameComponentProps) {
  const teams = useGameStore((s) => s.teams);
  const [ziel, setZiel] = useState(STANDARD_ANZAHL);
  const [gestartet, setGestartet] = useState(false);
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [gewinner, setGewinner] = useState<TeamId | null>(null);

  function trinken(teamId: TeamId) {
    if (gewinner) return;
    const aktuell = teamId === 'A' ? countA : countB;
    const naechster = Math.min(ziel, aktuell + 1);
    if (teamId === 'A') setCountA(naechster);
    else setCountB(naechster);
    if (naechster >= ziel) setGewinner(teamId);
  }

  function neustart() {
    setCountA(0);
    setCountB(0);
    setGewinner(null);
  }

  if (!gestartet) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-sm text-white/50">Wie viele Shots bzw. Getränke muss jedes Team leeren?</p>
        <div className="card flex items-center justify-center gap-4">
          <button
            onClick={() => setZiel((z) => Math.max(1, z - 1))}
            className="h-12 w-12 rounded-xl bg-base-800 text-2xl active:scale-95"
          >
            −
          </button>
          <span className="w-16 text-center text-4xl font-black">{ziel}</span>
          <button
            onClick={() => setZiel((z) => z + 1)}
            className="h-12 w-12 rounded-xl bg-base-800 text-2xl active:scale-95"
          >
            +
          </button>
        </div>
        <button onClick={() => setGestartet(true)} className="btn-primary text-xl">
          Los geht's
        </button>
        <button onClick={onExit} className="btn-ghost">
          Spiel abbrechen
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-white/50">
        Nach jedem Schluck/Shot antippen. Wer zuerst bei {ziel} ist, gewinnt.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {(['A', 'B'] as const).map((teamId) => {
          const team = teams[teamId];
          const count = teamId === 'A' ? countA : countB;
          return (
            <button
              key={teamId}
              onClick={() => trinken(teamId)}
              disabled={gewinner !== null}
              className="card flex flex-col items-center gap-2 border-2 py-6 transition active:scale-95 disabled:opacity-60"
              style={{ borderColor: team.color }}
            >
              <span className="text-sm font-semibold" style={{ color: team.color }}>
                {team.name}
              </span>
              <span className="text-4xl font-black">
                {count} / {ziel}
              </span>
              <span className="text-xs text-white/40">antippen für +1</span>
            </button>
          );
        })}
      </div>

      {gewinner && (
        <div className="card border-2 text-center" style={{ borderColor: teams[gewinner].color }}>
          <p className="font-bold" style={{ color: teams[gewinner].color }}>
            🏆 {teams[gewinner].name} ist zuerst leer!
          </p>
        </div>
      )}

      {gewinner ? (
        <>
          <button onClick={neustart} className="btn-secondary">
            🔄 Nochmal
          </button>
          <button onClick={onExit} className="btn-primary">
            Zurück zum Dashboard
          </button>
        </>
      ) : (
        <button onClick={onExit} className="btn-ghost">
          Spiel abbrechen
        </button>
      )}
    </div>
  );
}

export const werZuerstLeerGame: GameDefinition = {
  id: 'wer-zuerst-leer',
  name: 'Wer hat zuerst leer?',
  kategorie: 'aktiv',
  beschreibung: 'Beide Teams bekommen die gleiche Anzahl an Shots oder Getränken - welches Team ist zuerst komplett leer?',
  minSpieler: 2,
  icon: '🏁',
  brauchtTeams: true,
  component: WerZuerstLeerGame,
};
