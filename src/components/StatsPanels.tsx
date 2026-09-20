import { useGameStore } from '../store/useGameStore';
import { useStatsStore, type PlayerStats, type StatKind } from '../store/useStatsStore';

export const STAT_KINDS: { kind: StatKind; label: string; icon: string }[] = [
  { kind: 'exen', label: 'Gext', icon: '🍻' },
  { kind: 'getraenke', label: 'Getränke', icon: '🥤' },
  { kind: 'shots', label: 'Shots', icon: '🥃' },
];

const EMPTY: PlayerStats = { exen: 0, getraenke: 0, shots: 0 };

/** Alle bekannten Spieler: aktuelle Spieler plus alle, die schon Statistik haben. */
function useAllNames(): string[] {
  const teams = useGameStore((s) => s.teams);
  const pool = useGameStore((s) => s.pool);
  const stats = useStatsStore((s) => s.stats);
  return Array.from(new Set([...teams.A.players, ...teams.B.players, ...pool, ...Object.keys(stats)]));
}

/** Overlay zum manuellen Erfassen: pro Spieler +/- fuer Gext, Getraenke, Shots. */
export function StatsSheet({ onClose }: { onClose: () => void }) {
  const names = useAllNames();
  const stats = useStatsStore((s) => s.stats);
  const adjust = useStatsStore((s) => s.adjust);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-base-950">
      <div className="page">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">📊 Statistik erfassen</h2>
          <button onClick={onClose} className="btn-ghost text-sm">
            Schließen ✕
          </button>
        </div>

        {names.length === 0 ? (
          <p className="text-white/50">Noch keine Spieler eingetragen.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {names.map((name) => {
              const s = stats[name] ?? EMPTY;
              return (
                <li key={name} className="card">
                  <p className="mb-2 font-bold">{name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {STAT_KINDS.map(({ kind, label, icon }) => (
                      <div key={kind} className="flex flex-col items-center gap-1 rounded-xl bg-base-800 p-2">
                        <span className="text-xs text-white/60">
                          {icon} {label}
                        </span>
                        <span className="text-2xl font-black">{s[kind]}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => adjust(name, kind, -1)}
                            className="h-9 w-9 rounded-lg bg-base-900 text-lg active:scale-90"
                            aria-label={`${name} ${label} minus`}
                          >
                            −
                          </button>
                          <button
                            onClick={() => adjust(name, kind, 1)}
                            className="h-9 w-9 rounded-lg bg-neon-pink text-lg font-bold text-base-950 active:scale-90"
                            aria-label={`${name} ${label} plus`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button onClick={onClose} className="btn-primary mt-6">
          Fertig
        </button>
      </div>
    </div>
  );
}

/** Abschlussuebersicht: Gext, Getraenke und Shots pro Spieler plus Gesamtsummen. */
export function StatsSummary() {
  const names = useAllNames();
  const stats = useStatsStore((s) => s.stats);

  const rows = names
    .map((name) => ({ name, s: stats[name] ?? EMPTY }))
    .sort((a, b) => total(b.s) - total(a.s) || a.name.localeCompare(b.name));

  const sums = rows.reduce(
    (acc, r) => ({
      exen: acc.exen + r.s.exen,
      getraenke: acc.getraenke + r.s.getraenke,
      shots: acc.shots + r.s.shots,
    }),
    { ...EMPTY }
  );

  if (rows.length === 0) {
    return <p className="text-white/50">Noch keine Spieler eingetragen.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {STAT_KINDS.map(({ kind, label, icon }) => (
          <div key={kind} className="card flex flex-col items-center !p-3">
            <span className="text-2xl">{icon}</span>
            <span className="text-3xl font-black">{sums[kind]}</span>
            <span className="text-xs text-white/60">{label} gesamt</span>
          </div>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {rows.map(({ name, s }) => (
          <li key={name} className="card">
            <p className="mb-2 font-bold">{name}</p>
            <div className="grid grid-cols-3 gap-2">
              {STAT_KINDS.map(({ kind, label, icon }) => {
                const max = Math.max(...rows.map((r) => r.s[kind]));
                const spitze = max > 0 && s[kind] === max;
                return (
                  <div
                    key={kind}
                    className={`flex flex-col items-center rounded-xl p-2 ${
                      spitze ? 'bg-neon-pink/20 ring-1 ring-neon-pink' : 'bg-base-800'
                    }`}
                  >
                    <span className="text-xs text-white/60">
                      {icon} {label}
                    </span>
                    <span className="text-2xl font-black">
                      {s[kind]}
                      {spitze && ' 👑'}
                    </span>
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function total(s: PlayerStats) {
  return s.exen + s.getraenke + s.shots;
}
