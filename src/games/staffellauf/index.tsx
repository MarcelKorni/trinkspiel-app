import { useEffect, useRef, useState } from 'react';
import type { GameComponentProps, GameDefinition } from '../../types/game';
import { useGameStore, type TeamId } from '../../store/useGameStore';

function StaffellaufGame({ onExit }: GameComponentProps) {
  const teams = useGameStore((s) => s.teams);

  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);
  const [laeuft, setLaeuft] = useState(false);
  const [startZeit, setStartZeit] = useState<number | null>(null);
  const [vergangeneMs, setVergangeneMs] = useState(0);
  const [gewinner, setGewinner] = useState<TeamId | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!laeuft || startZeit === null) return;

    function tick() {
      setVergangeneMs(Date.now() - startZeit!);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [laeuft, startZeit]);

  function starten() {
    setIndexA(0);
    setIndexB(0);
    setStartZeit(Date.now());
    setVergangeneMs(0);
    setGewinner(null);
    setLaeuft(true);
  }

  function naechsterLaeufer(teamId: TeamId) {
    if (!laeuft || gewinner) return;
    const team = teams[teamId];
    const index = teamId === 'A' ? indexA : indexB;
    const next = index + 1;

    if (teamId === 'A') setIndexA(next);
    else setIndexB(next);

    if (next >= team.players.length) {
      setGewinner(teamId);
      setLaeuft(false);
    }
  }

  const sekunden = (vergangeneMs / 1000).toFixed(1);

  if (!laeuft && !gewinner) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-sm text-white/50">
          Die Reihenfolge ist die Team-Liste von vorne nach hinten. Start drücken, dann trinkt Läufer 1 pro
          Team leer und tippt auf "Nächster dran", bis das ganze Team durch ist.
        </p>
        <button onClick={starten} className="btn-primary text-xl">
          ▶️ Start
        </button>
        <button onClick={onExit} className="btn-ghost">
          Spiel abbrechen
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col items-center gap-1">
        <span className="text-4xl font-black tabular-nums">{sekunden}s</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['A', 'B'] as const).map((teamId) => {
          const team = teams[teamId];
          const index = teamId === 'A' ? indexA : indexB;
          const fertig = index >= team.players.length;
          const aktuellerLaeufer = team.players[index];
          return (
            <div
              key={teamId}
              className="card flex flex-col items-center gap-2 border-2"
              style={{ borderColor: team.color }}
            >
              <span className="text-sm font-semibold" style={{ color: team.color }}>
                {team.name}
              </span>
              <span className="text-lg font-bold">{fertig ? '🏁 Fertig!' : aktuellerLaeufer}</span>
              <span className="text-xs text-white/40">
                {Math.min(index, team.players.length)} / {team.players.length}
              </span>
              {!fertig && laeuft && (
                <button
                  onClick={() => naechsterLaeufer(teamId)}
                  className="btn-secondary !px-4 !py-2 text-sm"
                >
                  Nächster dran
                </button>
              )}
            </div>
          );
        })}
      </div>

      {gewinner && (
        <div className="card border-2 text-center" style={{ borderColor: teams[gewinner].color }}>
          <p className="font-bold" style={{ color: teams[gewinner].color }}>
            🏆 {teams[gewinner].name} gewinnt in {sekunden}s!
          </p>
        </div>
      )}

      {gewinner ? (
        <>
          <button onClick={starten} className="btn-secondary">
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

export const staffellaufGame: GameDefinition = {
  id: 'staffellauf',
  name: 'Staffellauf',
  kategorie: 'aktiv',
  beschreibung: 'Eine Person pro Team läuft los und trinkt ihr Getränk leer, dann ist die nächste dran - Staffel-Wettrennen zwischen den Teams.',
  minSpieler: 4,
  icon: '🏃',
  brauchtTeams: true,
  component: StaffellaufGame,
};
