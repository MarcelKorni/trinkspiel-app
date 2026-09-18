import { useEffect, useRef, useState } from 'react';
import { useGameStore, type TeamId } from '../store/useGameStore';

interface RaceStopwatchProps {
  onExit: () => void;
  hinweis: string;
}

/**
 * Wiederverwendbare Wettrennen-Stoppuhr: Start druecken, sobald ein Team
 * fertig ist auf den eigenen Button tippen - stoppt die Zeit und kuert den
 * Sieger. Fuer Spiele wie Flunkyball oder Flip the Cup, bei denen die App
 * das eigentliche Spiel nicht kennt, nur die Zeit misst.
 */
export function RaceStopwatch({ onExit, hinweis }: RaceStopwatchProps) {
  const teams = useGameStore((s) => s.teams);
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
    setStartZeit(Date.now());
    setVergangeneMs(0);
    setGewinner(null);
    setLaeuft(true);
  }

  function teamFertig(teamId: TeamId) {
    if (!laeuft || gewinner) return;
    setLaeuft(false);
    setGewinner(teamId);
  }

  function neustart() {
    setLaeuft(false);
    setStartZeit(null);
    setVergangeneMs(0);
    setGewinner(null);
  }

  const sekunden = (vergangeneMs / 1000).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-white/50">{hinweis}</p>

      <div className="card flex flex-col items-center gap-1">
        <span className="text-5xl font-black tabular-nums">{sekunden}s</span>
        <span className="text-xs text-white/40">{laeuft ? 'läuft...' : gewinner ? 'beendet' : 'bereit'}</span>
      </div>

      {!laeuft && !gewinner && (
        <button onClick={starten} className="btn-primary text-xl">
          ▶️ Start
        </button>
      )}

      {laeuft && (
        <div className="grid grid-cols-2 gap-3">
          {(['A', 'B'] as const).map((teamId) => {
            const team = teams[teamId];
            return (
              <button
                key={teamId}
                onClick={() => teamFertig(teamId)}
                className="flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-6 font-bold transition active:scale-95"
                style={{ borderColor: team.color, color: team.color }}
              >
                <span className="text-2xl">🏁</span>
                <span>{team.name} fertig!</span>
              </button>
            );
          })}
        </div>
      )}

      {gewinner && (
        <div className="card border-2 text-center" style={{ borderColor: teams[gewinner].color }}>
          <p className="font-bold" style={{ color: teams[gewinner].color }}>
            🏆 {teams[gewinner].name} gewinnt in {sekunden}s!
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
