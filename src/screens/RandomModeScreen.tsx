import { useEffect, useRef, useState } from 'react';
import { games } from '../games';
import { PageHeader } from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { OneForTheTeamAlarm } from '../components/OneForTheTeamAlarm';
import { StatsSheet, StatsSummary } from '../components/StatsPanels';
import { useGameStore, type TeamId } from '../store/useGameStore';
import { useStatsStore } from '../store/useStatsStore';

type Phase = 'setup' | 'playing' | 'summary';

const ALARM_MIN_MS = 20_000;
const ALARM_MAX_MS = 45_000;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RandomModeScreen() {
  const navigate = useNavigate();
  const setRecording = useStatsStore((s) => s.setRecording);
  const resetStats = useStatsStore((s) => s.resetStats);
  const [statsOpen, setStatsOpen] = useState(false);
  const teams = useGameStore((s) => s.teams);
  const pool = useGameStore((s) => s.pool);
  const addPlayerToPool = useGameStore((s) => s.addPlayerToPool);
  const assignPlayer = useGameStore((s) => s.assignPlayer);
  const unassignPlayer = useGameStore((s) => s.unassignPlayer);
  const autoAssignTeams = useGameStore((s) => s.autoAssignTeams);
  const finishSetup = useGameStore((s) => s.finishSetup);

  // Jedes Spiel kommt einmal pro Durchgang dran, danach wird neu gemischt
  // (das letzte Spiel wird dabei nicht direkt wiederholt).
  const queueRef = useRef<string[]>([]);
  function drawGameId(lastId: string | null): string {
    if (queueRef.current.length === 0) {
      const q = shuffle(games.map((g) => g.id));
      if (q.length > 1 && q[0] === lastId) [q[0], q[q.length - 1]] = [q[q.length - 1], q[0]];
      queueRef.current = q;
    }
    return queueRef.current.shift() as string;
  }

  const [gameId, setGameId] = useState<string | null>(() => (games.length ? drawGameId(null) : null));
  const [phase, setPhase] = useState<Phase>('setup');
  const [teamMode, setTeamMode] = useState(false);
  const [zeigtAlarm, setZeigtAlarm] = useState(false);
  const [gespielt, setGespielt] = useState(0);
  const [nameInput, setNameInput] = useState('');

  const game = games.find((g) => g.id === gameId);
  const allPlayers = [...teams.A.players, ...teams.B.players, ...pool];
  const teamsValid = teams.A.players.length > 0 && teams.B.players.length > 0;

  // Solange der Zufallsmodus offen ist, erfassen Shot-/One-for-the-Team-Alarm automatisch.
  useEffect(() => {
    setRecording(true);
    return () => setRecording(false);
  }, [setRecording]);

  // Bei jedem neuen Spiel: Team-Schalter auf den Standard des Spiels setzen
  // und, falls Spieler vorhanden sind, direkt frische Teams auslosen.
  useEffect(() => {
    if (!game) return;
    setPhase('setup');
    setZeigtAlarm(false);
    setTeamMode(game.brauchtTeams);
    if (game.brauchtTeams && allPlayers.length >= 2) autoAssignTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gespielt]);

  useEffect(() => {
    if (phase !== 'playing' || !teamMode || !game?.component) return;
    const t = window.setTimeout(
      () => setZeigtAlarm(true),
      ALARM_MIN_MS + Math.random() * (ALARM_MAX_MS - ALARM_MIN_MS)
    );
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, gameId, gespielt]);

  function naechstesSpiel(zaehlen: boolean) {
    setGameId(drawGameId(gameId));
    if (zaehlen) setGespielt((n) => n + 1);
  }

  function toggleTeamMode(value: boolean) {
    setTeamMode(value);
    if (value && allPlayers.length >= 2 && !teamsValid) autoAssignTeams();
  }

  function handleAddPlayer() {
    if (!nameInput.trim()) return;
    addPlayerToPool(nameInput);
    finishSetup();
    setNameInput('');
  }

  function toggleAssign(name: string, teamId: TeamId) {
    if (teams[teamId].players.includes(name)) unassignPlayer(name, teamId);
    else assignPlayer(name, teamId);
  }

  if (!game) {
    return (
      <div className="page">
        <PageHeader title="Zufallsmodus" backTo="/games" />
        <p className="text-white/60">Keine Spiele registriert.</p>
      </div>
    );
  }

  const GameComponent = game.component;

  const statsFab = (
    <>
      <button
        onClick={() => setStatsOpen(true)}
        className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-neon-pink text-2xl shadow-lg active:scale-95"
        aria-label="Statistik erfassen"
      >
        📊
      </button>
      {statsOpen && <StatsSheet onClose={() => setStatsOpen(false)} />}
    </>
  );

  if (phase === 'summary') {
    return (
      <div className="page">
        <PageHeader title="🏁 Übersicht" subtitle={`${gespielt} Spiele gespielt`} />
        <StatsSummary />
        <div className="flex-1" />
        <button onClick={() => setPhase('setup')} className="btn-primary mt-6">
          ← Zurück zum Zufallsmodus
        </button>
        <button
          onClick={() => {
            if (confirm('Statistik löschen und Abend beenden?')) {
              resetStats();
              navigate('/games');
            }
          }}
          className="btn-secondary mt-2 border-red-500/50 text-red-400"
        >
          Statistik löschen & beenden
        </button>
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div className="page">
        {statsFab}
        <PageHeader title={game.name} subtitle={`Zufallsmodus · Spiel ${gespielt + 1}`} backTo="/games" />

        {GameComponent ? (
          <GameComponent key={`${gameId}-${gespielt}`} onExit={() => naechstesSpiel(true)} />
        ) : (
          <>
            <p className="mb-4 text-sm text-white/60">{game.beschreibung}</p>
            {teamMode && <TeamOverview teams={teams} />}
            <div className="flex-1" />
            <button onClick={() => naechstesSpiel(true)} className="btn-primary mt-6">
              Spiel beendet – nächstes Spiel 🎲
            </button>
          </>
        )}

        {GameComponent && (
          <button onClick={() => naechstesSpiel(true)} className="btn-ghost mt-6 text-sm">
            Spiel überspringen →
          </button>
        )}

        {zeigtAlarm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-base-950">
            <div className="page">
              <OneForTheTeamAlarm onContinue={() => setZeigtAlarm(false)} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      {statsFab}
      <PageHeader title="🎲 Zufallsmodus" subtitle={`Nächstes Spiel · Runde ${gespielt + 1}`} backTo="/games" />

      <div className="card mb-4 flex items-center gap-4">
        <span className="text-5xl">{game.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-xl font-bold">{game.name}</div>
          <p className="text-sm text-white/60">{game.beschreibung}</p>
        </div>
      </div>

      <div className="card mb-4">
        <p className="mb-3 text-sm font-semibold text-white/70">Ist das ein Teamspiel?</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleTeamMode(true)}
            className={teamMode ? 'btn-primary' : 'btn-secondary'}
          >
            👥 Ja, Teams
          </button>
          <button
            onClick={() => toggleTeamMode(false)}
            className={!teamMode ? 'btn-primary' : 'btn-secondary'}
          >
            🙋 Nein
          </button>
        </div>
      </div>

      {teamMode && (
        <div className="card mb-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white/70">Teams wählen</span>
            <button
              onClick={autoAssignTeams}
              disabled={allPlayers.length < 2}
              className="btn-ghost !p-0 text-sm text-neon-teal disabled:opacity-30"
            >
              🎲 Zufällig auslosen
            </button>
          </div>

          <div className="mb-3 flex gap-2">
            <input
              className="input-field"
              placeholder="Spieler hinzufügen..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            />
            <button onClick={handleAddPlayer} className="btn-primary shrink-0 !px-5">
              +
            </button>
          </div>

          {allPlayers.length === 0 ? (
            <p className="text-sm text-white/40">Noch keine Spieler eingetragen.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {allPlayers.map((name) => (
                <li key={name} className="flex items-center justify-between gap-2 rounded-xl bg-base-800 px-3 py-2">
                  <span className="truncate text-sm">{name}</span>
                  <div className="flex shrink-0 gap-2">
                    {(['A', 'B'] as const).map((teamId) => {
                      const aktiv = teams[teamId].players.includes(name);
                      const color = teams[teamId].color;
                      return (
                        <button
                          key={teamId}
                          onClick={() => toggleAssign(name, teamId)}
                          className="rounded-full border-2 px-3 py-1 text-xs font-bold active:scale-95"
                          style={{
                            borderColor: color,
                            color: aktiv ? '#0b0b10' : color,
                            backgroundColor: aktiv ? color : 'transparent',
                          }}
                          aria-label={`${name} ${aktiv ? 'aus' : 'in'} ${teams[teamId].name}`}
                        >
                          {teams[teamId].name}
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {pool.length > 0 && (
            <p className="mt-2 text-xs text-white/40">Ohne Team: {pool.join(', ')} (setzen aus)</p>
          )}
          {!teamsValid && (
            <p className="mt-2 text-xs text-amber-400">Jedes Team braucht mindestens 1 Spieler.</p>
          )}
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={() => setPhase('playing')}
        disabled={teamMode && !teamsValid}
        className="btn-primary mt-4 disabled:opacity-30"
      >
        Los geht's →
      </button>
      <button onClick={() => naechstesSpiel(false)} className="btn-ghost mt-2 text-sm">
        🎲 Anderes Spiel würfeln
      </button>
      <button onClick={() => setPhase('summary')} className="btn-secondary mt-2 mb-16">
        🏁 Abend beenden – Übersicht
      </button>
    </div>
  );
}

function TeamOverview({ teams }: { teams: ReturnType<typeof useGameStore.getState>['teams'] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['A', 'B'] as const).map((teamId) => {
        const team = teams[teamId];
        return (
          <div key={teamId} className="card border-2" style={{ borderColor: team.color }}>
            <p className="font-bold" style={{ color: team.color }}>
              {team.name}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {team.players.length > 0 ? team.players.join(', ') : 'keine Spieler'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
