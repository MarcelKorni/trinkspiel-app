import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { games } from '../games';
import { PageHeader } from '../components/PageHeader';
import { OneForTheTeamAlarm } from '../components/OneForTheTeamAlarm';
import { useGameStore } from '../store/useGameStore';
import TeamSetupScreen from './TeamSetupScreen';

type LocalPhase = 'confirm' | 'playing';

// Der "One for the Team"-Alarm taucht einmal irgendwann mitten im Spiel auf
// (nicht mehr direkt am Anfang), zufaellig irgendwann in diesem Zeitfenster.
const ALARM_MIN_MS = 20_000;
const ALARM_MAX_MS = 45_000;

export default function GameScreen() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const teams = useGameStore((s) => s.teams);
  const setupComplete = useGameStore((s) => s.setupComplete);
  const autoAssignTeams = useGameStore((s) => s.autoAssignTeams);
  const [phase, setPhase] = useState<LocalPhase>('confirm');
  const [zeigtAlarm, setZeigtAlarm] = useState(false);
  const alarmTimerRef = useRef<number | null>(null);

  const game = games.find((g) => g.id === gameId);

  // Bei jedem (Wieder-)Eintritt in ein Team-Spiel: lokale Phase zuruecksetzen
  // und die Teams frisch auslosen. Dadurch braucht es keine Team-Auswahl mehr
  // vorab auf der Startseite der App - jedes Team-Spiel lost neu aus.
  useEffect(() => {
    setPhase('confirm');
    setZeigtAlarm(false);
    if (game?.brauchtTeams && setupComplete) {
      autoAssignTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, setupComplete]);

  // Waehrend des Spiels (ausser bei reinen Auslosungs-Spielen wie Bierpong)
  // taucht der Alarm einmal zufaellig mitten im Spiel als Overlay auf.
  useEffect(() => {
    if (phase !== 'playing' || !game?.brauchtTeams || game.nurTeamAuslosen) return;

    const verzoegerung = ALARM_MIN_MS + Math.random() * (ALARM_MAX_MS - ALARM_MIN_MS);
    alarmTimerRef.current = window.setTimeout(() => setZeigtAlarm(true), verzoegerung);

    return () => {
      if (alarmTimerRef.current) window.clearTimeout(alarmTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, gameId]);

  if (!game) {
    return (
      <div className="page">
        <PageHeader title="Spiel nicht gefunden" backTo="/games" />
        <p className="text-white/60">
          Das Spiel "{gameId}" ist nicht registriert. Pruefe src/games/index.ts.
        </p>
      </div>
    );
  }

  // Braucht das Spiel Teams, aber es wurde noch nie ein Spieler eingetragen -
  // dann erst einmalig Spieler erfassen (Team-Zuordnung ist danach egal,
  // sie wird sowieso vor jedem Spiel neu ausgelost).
  if (game.brauchtTeams && !setupComplete) {
    return (
      <div className="page">
        <PageHeader title={game.name} subtitle="Erst Spieler eintragen" backTo="/games" />
        <TeamSetupScreen embedded onComplete={() => {}} />
      </div>
    );
  }

  if (game.brauchtTeams && phase === 'confirm') {
    return (
      <div className="page">
        <PageHeader title={game.name} backTo="/games" />
        <p className="mb-4 text-sm text-white/60">{game.beschreibung}</p>

        <p className="mb-3 text-sm font-semibold text-white/70">Frisch ausgeloste Teams:</p>
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

        <div className="flex-1" />

        {game.nurTeamAuslosen ? (
          <button onClick={() => navigate('/games')} className="btn-primary mt-6">
            Fertig
          </button>
        ) : (
          <button onClick={() => setPhase('playing')} className="btn-primary mt-6">
            Los geht's →
          </button>
        )}
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="page">
      <PageHeader title={game.name} backTo="/games" />
      {GameComponent && <GameComponent onExit={() => navigate('/games')} />}

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
