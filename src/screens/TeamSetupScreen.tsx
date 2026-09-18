import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, type TeamId } from '../store/useGameStore';
import { PageHeader } from '../components/PageHeader';

const COLOR_OPTIONS = ['#ff2fa0', '#22d3ee', '#a3e635', '#fbbf24', '#8b5cf6', '#f97316'];

interface TeamSetupScreenProps {
  /** True, wenn die Komponente innerhalb eines anderen Screens (GameScreen)
   * eingebettet ist - dann kein eigener page-Wrapper/Header und `onComplete`
   * wird statt der Standard-Navigation zur Spielauswahl aufgerufen. */
  embedded?: boolean;
  onComplete?: () => void;
}

export default function TeamSetupScreen({ embedded = false, onComplete }: TeamSetupScreenProps) {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState('');

  const pool = useGameStore((s) => s.pool);
  const teams = useGameStore((s) => s.teams);
  const addPlayerToPool = useGameStore((s) => s.addPlayerToPool);
  const removePlayerFromPool = useGameStore((s) => s.removePlayerFromPool);
  const assignPlayer = useGameStore((s) => s.assignPlayer);
  const unassignPlayer = useGameStore((s) => s.unassignPlayer);
  const autoAssignTeams = useGameStore((s) => s.autoAssignTeams);
  const setTeamName = useGameStore((s) => s.setTeamName);
  const setTeamColor = useGameStore((s) => s.setTeamColor);
  const finishSetup = useGameStore((s) => s.finishSetup);

  const totalPlayers = pool.length + teams.A.players.length + teams.B.players.length;
  const canStart = totalPlayers >= 2 && teams.A.players.length > 0 && teams.B.players.length > 0;

  function handleAddPlayer() {
    if (!nameInput.trim()) return;
    addPlayerToPool(nameInput);
    setNameInput('');
  }

  function handleStart() {
    finishSetup();
    if (onComplete) onComplete();
    else navigate('/games');
  }

  const content = (
    <>
      {/* Spieler hinzufuegen */}
      <div className="card mb-4">
        <label className="mb-2 block text-sm font-semibold text-white/70">Spieler hinzufuegen</label>
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Name eingeben..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <button onClick={handleAddPlayer} className="btn-primary shrink-0 !px-5">
            +
          </button>
        </div>
      </div>

      {/* Unzugeteilter Pool */}
      {pool.length > 0 && (
        <div className="card mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-white/70">Noch nicht zugeteilt</span>
            <button onClick={autoAssignTeams} className="btn-ghost !p-0 text-sm text-neon-teal">
              🎲 Automatisch aufteilen
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {pool.map((name) => (
              <div key={name} className="flex items-center gap-1 rounded-full bg-base-800 py-1 pl-3 pr-1">
                <span className="text-sm">{name}</span>
                <button
                  onClick={() => assignPlayer(name, 'A')}
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: teams.A.color }}
                  aria-label={`${name} zu ${teams.A.name}`}
                >
                  A
                </button>
                <button
                  onClick={() => assignPlayer(name, 'B')}
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: teams.B.color }}
                  aria-label={`${name} zu ${teams.B.name}`}
                >
                  B
                </button>
                <button
                  onClick={() => removePlayerFromPool(name)}
                  className="px-1 text-white/40"
                  aria-label={`${name} entfernen`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams */}
      <div className="grid grid-cols-1 gap-4">
        {(['A', 'B'] as const).map((teamId) => (
          <TeamCard
            key={teamId}
            teamId={teamId}
            name={teams[teamId].name}
            color={teams[teamId].color}
            players={teams[teamId].players}
            onNameChange={(name) => setTeamName(teamId, name)}
            onColorChange={(color) => setTeamColor(teamId, color)}
            onRemovePlayer={(name) => unassignPlayer(name, teamId)}
          />
        ))}
      </div>

      <div className="mt-6 flex-1" />

      <button onClick={handleStart} disabled={!canStart} className="btn-primary disabled:opacity-30">
        {embedded ? 'Weiter →' : 'Weiter zur Spielauswahl →'}
      </button>
      {!canStart && (
        <p className="mt-2 text-center text-xs text-white/40">
          Jedes Team braucht mindestens 1 Spieler.
        </p>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <div className="page">
      <PageHeader title="Team-Setup" subtitle="Spieler eintragen & Teams bilden" />
      {content}
    </div>
  );
}

interface TeamCardProps {
  teamId: TeamId;
  name: string;
  color: string;
  players: string[];
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onRemovePlayer: (name: string) => void;
}

function TeamCard({ name, color, players, onNameChange, onColorChange, onRemovePlayer }: TeamCardProps) {
  return (
    <div className="card border-2" style={{ borderColor: color }}>
      <input
        className="mb-3 w-full bg-transparent text-lg font-bold outline-none"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        style={{ color }}
      />
      <div className="mb-3 flex gap-2">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className="h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-base-900"
            style={{ backgroundColor: c, ringColor: c === color ? c : 'transparent' } as never}
            aria-label={`Farbe ${c}`}
          />
        ))}
      </div>
      {players.length === 0 ? (
        <p className="text-sm text-white/40">Noch keine Spieler zugeteilt.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {players.map((p) => (
            <li key={p} className="flex items-center gap-1 rounded-full bg-base-800 py-1 pl-3 pr-1 text-sm">
              {p}
              <button onClick={() => onRemovePlayer(p)} className="px-1 text-white/40" aria-label={`${p} entfernen`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
