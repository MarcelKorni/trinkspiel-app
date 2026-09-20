import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore, type TeamId } from './useGameStore';

export type StatKind = 'exen' | 'getraenke' | 'shots';

export interface PlayerStats {
  exen: number;
  getraenke: number;
  shots: number;
}

export interface OneForTheTeamResult {
  teamId: TeamId;
  ausgeloster: string | null;
  geschafft: boolean | null;
}

interface StatsState {
  stats: Record<string, PlayerStats>;
  /** True solange der Zufallsmodus offen ist - nur dann erfassen die Alarme automatisch. */
  recording: boolean;

  setRecording: (value: boolean) => void;
  adjust: (name: string, kind: StatKind, delta: number) => void;
  recordShotAlarm: () => void;
  recordOneForTheTeam: (results: OneForTheTeamResult[]) => void;
  resetStats: () => void;
}

const empty = (): PlayerStats => ({ exen: 0, getraenke: 0, shots: 0 });

function withDelta(
  stats: Record<string, PlayerStats>,
  name: string,
  kind: StatKind,
  delta: number
): Record<string, PlayerStats> {
  const current = stats[name] ?? empty();
  return { ...stats, [name]: { ...current, [kind]: Math.max(0, current[kind] + delta) } };
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: {},
      recording: false,

      setRecording: (value) => set({ recording: value }),

      adjust: (name, kind, delta) => set((s) => ({ stats: withDelta(s.stats, name, kind, delta) })),

      recordShotAlarm: () => {
        if (!get().recording) return;
        const { teams, pool } = useGameStore.getState();
        const everyone = [...teams.A.players, ...teams.B.players, ...pool];
        set((s) => ({ stats: everyone.reduce((acc, p) => withDelta(acc, p, 'shots', 1), s.stats) }));
      },

      recordOneForTheTeam: (results) => {
        if (!get().recording) return;
        const { teams } = useGameStore.getState();
        set((s) => {
          let next = s.stats;
          for (const r of results) {
            if (r.ausgeloster) next = withDelta(next, r.ausgeloster, 'getraenke', 1);
            if (r.geschafft === false) {
              for (const p of teams[r.teamId].players) next = withDelta(next, p, 'exen', 1);
            }
          }
          return { stats: next };
        });
      },

      resetStats: () => set({ stats: {} }),
    }),
    { name: 'trinkspiel-stats', partialize: (s) => ({ stats: s.stats }) }
  )
);
