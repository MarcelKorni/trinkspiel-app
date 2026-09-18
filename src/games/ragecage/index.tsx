import { useState } from 'react';
import type { GameComponentProps, GameDefinition } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';

function RageCageGame({ onExit }: GameComponentProps) {
  const pool = useGameStore((s) => s.pool);
  const teams = useGameStore((s) => s.teams);
  const allePlayers = [...pool, ...teams.A.players, ...teams.B.players];

  const [aktuelle, setAktuelle] = useState<string | null>(null);
  const [verlauf, setVerlauf] = useState<string[]>([]);

  function naechstePerson() {
    if (allePlayers.length === 0) return;
    const kandidaten =
      allePlayers.length > 1 && aktuelle ? allePlayers.filter((p) => p !== aktuelle) : allePlayers;
    const gewaehlt = kandidaten[Math.floor(Math.random() * kandidaten.length)];
    setAktuelle(gewaehlt);
    setVerlauf((v) => [gewaehlt, ...v].slice(0, 5));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-white/50">
        Alle sitzen im Kreis um den Becherturm. Wer dran ist, versucht den Ball in den mittleren Becher zu
        treffen - trifft die Person, muss sie den Becher schnell wieder aufbauen, bevor sie selbst getroffen
        wird.
      </p>

      {allePlayers.length === 0 ? (
        <p className="card text-center text-white/50">
          Noch keine Spieler eingetragen. Lege welche im Team-Setup an (Dashboard → Teams bearbeiten).
        </p>
      ) : (
        <>
          <div className="card flex flex-col items-center gap-2 py-10">
            <span className="text-sm text-white/50">Ist dran:</span>
            <span className="text-4xl font-black text-neon-amber">{aktuelle ?? '?'}</span>
          </div>

          <button onClick={naechstePerson} className="btn-primary text-xl">
            🎲 Nächste Person auslosen
          </button>

          {verlauf.length > 1 && (
            <p className="text-center text-xs text-white/40">Zuletzt dran: {verlauf.slice(1).join(', ')}</p>
          )}
        </>
      )}

      <button onClick={onExit} className="btn-ghost">
        Fertig – zurück zum Dashboard
      </button>
    </div>
  );
}

export const ragecageGame: GameDefinition = {
  id: 'ragecage',
  name: 'Rage Cage',
  kategorie: 'aktiv',
  beschreibung: 'Alle sitzen im Kreis um einen Becherturm und werfen reihum - kein festes Team, jeder spielt für sich.',
  minSpieler: 4,
  icon: '🥤',
  brauchtTeams: false,
  component: RageCageGame,
};
