import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { games } from '../games';
import { useGameStore } from '../store/useGameStore';
import type { GameCategory } from '../types/game';

const CATEGORY_LABELS: Record<GameCategory, string> = {
  tisch: '🪑 Tischspiele',
  aktiv: '🏃 Aktive Spiele',
};

export default function GameSelectionScreen() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const resetEverything = useGameStore((s) => s.resetEverything);

  const categories: GameCategory[] = ['tisch', 'aktiv'];

  function handleResetEverything() {
    if (confirm('Wirklich alle Spieler zuruecksetzen? Das kann nicht rueckgaengig gemacht werden.')) {
      resetEverything();
      setSettingsOpen(false);
    }
  }

  return (
    <div className="page">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">🍻 Trinkspiel-Abend</h1>
          <p className="text-sm text-white/60">Wähle ein Spiel für die nächste Runde</p>
        </div>
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-800 text-xl active:scale-95"
          aria-label="Einstellungen"
        >
          ⚙️
        </button>
      </div>

      {settingsOpen && (
        <div className="card mb-6 flex flex-col gap-2">
          <span className="mb-1 text-sm font-semibold text-white/70">Einstellungen</span>
          <button onClick={() => navigate('/setup')} className="btn-secondary">
            👥 Spieler bearbeiten
          </button>
          <button onClick={handleResetEverything} className="btn-secondary border-red-500/50 text-red-400">
            ⚠️ Alles zurücksetzen
          </button>
        </div>
      )}

      {categories.map((category) => {
        const gamesInCategory = games.filter((g) => g.kategorie === category);
        if (gamesInCategory.length === 0) return null;

        return (
          <div key={category} className="mb-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {gamesInCategory.map((game) => (
                <button
                  key={game.id}
                  onClick={() => navigate(`/games/${game.id}`)}
                  className="card flex items-center gap-4 text-left active:scale-95"
                >
                  <span className="text-4xl">{game.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-lg font-bold">{game.name}</div>
                    <p className="line-clamp-2 text-sm text-white/60">{game.beschreibung}</p>
                    <p className="mt-1 text-xs text-white/40">
                      ab {game.minSpieler} Spielern · {game.brauchtTeams ? '👥 Team-Spiel' : '🙋 ohne feste Teams'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {games.length === 0 && (
        <p className="mt-8 text-center text-white/40">
          Noch keine Spiele registriert. Lege eine neue Datei in src/games/ an.
        </p>
      )}
    </div>
  );
}
