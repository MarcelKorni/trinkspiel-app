import { useEffect, useRef, useState } from 'react';
import { useGameStore, type TeamId } from '../store/useGameStore';
import { useStatsStore } from '../store/useStatsStore';

interface OneForTheTeamAlarmProps {
  onContinue: () => void;
}

const AUDIO_SRC = '/oneForTheTeam.mp3';

type Phase = 'laeuft' | 'ausgewertet';

function zufaelligerSpieler(players: string[]): string | null {
  if (players.length === 0) return null;
  return players[Math.floor(Math.random() * players.length)];
}

/**
 * "One for the Team"-Alarm: pro Team wird eine zufaellige Person ausgelost,
 * die ihr Getraenk leer trinken muss, bevor der Sound endet - schafft sie es
 * nicht, muss das ganze Team exen. Kein Bezug zum Punktesystem, reine
 * Trink-Challenge zwischen den Schaetzen-Runden.
 */
export function OneForTheTeamAlarm({ onContinue }: OneForTheTeamAlarmProps) {
  const teams = useGameStore((s) => s.teams);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = useState<Phase>('laeuft');
  const [ergebnis, setErgebnis] = useState<Record<TeamId, boolean | null>>({ A: null, B: null });

  // Pro Team einmal zufaellig auslosen - bleibt fuer die gesamte Challenge fix.
  const [ausgeloste] = useState<Record<TeamId, string | null>>(() => ({
    A: zufaelligerSpieler(teams.A.players),
    B: zufaelligerSpieler(teams.B.players),
  }));

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audioRef.current = audio;
    audio.onended = () => setPhase('ausgewertet');

    audio.play().catch(() => {
      // Datei fehlt oder Autoplay blockiert -> Challenge trotzdem direkt auswertbar machen.
      setPhase('ausgewertet');
    });

    return () => {
      audio.pause();
    };
  }, []);

  function ueberspringen() {
    audioRef.current?.pause();
    setPhase('ausgewertet');
  }

  function markiere(teamId: TeamId, geschafft: boolean) {
    setErgebnis((prev) => ({ ...prev, [teamId]: geschafft }));
  }

  const alleAusgewertet = ergebnis.A !== null && ergebnis.B !== null;

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="animate-pulse text-7xl">🍺</div>
      <p className="text-3xl font-black text-neon-amber">ONE FOR THE TEAM!</p>
      <p className="text-lg text-white/80">
        Diese Personen trinken jetzt ihr Getränk komplett leer – bevor der Sound endet!
      </p>

      <div className="grid w-full grid-cols-2 gap-3">
        {(['A', 'B'] as const).map((teamId) => {
          const team = teams[teamId];
          const name = ausgeloste[teamId];
          return (
            <div
              key={teamId}
              className="card flex flex-col items-center gap-1 border-2"
              style={{ borderColor: team.color }}
            >
              <span className="text-xs font-semibold text-white/50">{team.name}</span>
              <span className="text-lg font-black" style={{ color: team.color }}>
                {name ?? 'kein Spieler'}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-white/50">Schafft eine Person es nicht rechtzeitig, muss das ganze Team exen. 🍻</p>

      {phase === 'laeuft' && (
        <button onClick={ueberspringen} className="btn-ghost text-sm">
          Sound überspringen → Auswertung
        </button>
      )}

      {phase === 'ausgewertet' && (
        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-semibold text-white/70">Wer hat es geschafft?</p>
          <div className="grid grid-cols-2 gap-3">
            {(['A', 'B'] as const).map((teamId) => {
              const team = teams[teamId];
              const name = ausgeloste[teamId];
              const status = ergebnis[teamId];
              return (
                <div key={teamId} className="flex flex-col gap-2">
                  <p className="text-sm font-semibold" style={{ color: team.color }}>
                    {name ?? team.name}
                  </p>
                  <button
                    onClick={() => markiere(teamId, true)}
                    className="rounded-2xl border-2 px-3 py-3 text-sm font-bold transition active:scale-95"
                    style={{
                      borderColor: team.color,
                      color: status === true ? '#0b0b10' : team.color,
                      backgroundColor: status === true ? team.color : 'transparent',
                    }}
                  >
                    ✅ Geschafft
                  </button>
                  <button
                    onClick={() => markiere(teamId, false)}
                    className="rounded-2xl border-2 px-3 py-3 text-sm font-bold transition active:scale-95"
                    style={{
                      borderColor: '#ef4444',
                      color: status === false ? '#0b0b10' : '#ef4444',
                      backgroundColor: status === false ? '#ef4444' : 'transparent',
                    }}
                  >
                    ❌ Team exen
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              useStatsStore.getState().recordOneForTheTeam(
                (['A', 'B'] as const).map((teamId) => ({
                  teamId,
                  ausgeloster: ausgeloste[teamId],
                  geschafft: ergebnis[teamId],
                }))
              );
              onContinue();
            }}
            disabled={!alleAusgewertet}
            className="btn-primary mt-2 disabled:opacity-30"
          >
            Weiter zur nächsten Runde
          </button>
        </div>
      )}
    </div>
  );
}
