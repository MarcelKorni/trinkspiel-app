import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TeamId = 'A' | 'B';

export interface Team {
  id: TeamId;
  name: string;
  color: string;
  players: string[];
}

const DEFAULT_COLORS: Record<TeamId, string> = {
  A: '#ff2fa0',
  B: '#22d3ee',
};

interface GameStoreState {
  /** Spieler-Pool waehrend des Setups, bevor sie einem Team zugeteilt sind. */
  pool: string[];
  teams: Record<TeamId, Team>;
  setupComplete: boolean;

  addPlayerToPool: (name: string) => void;
  removePlayerFromPool: (name: string) => void;

  assignPlayer: (name: string, teamId: TeamId) => void;
  unassignPlayer: (name: string, teamId: TeamId) => void;
  autoAssignTeams: () => void;

  setTeamName: (teamId: TeamId, name: string) => void;
  setTeamColor: (teamId: TeamId, color: string) => void;

  finishSetup: () => void;

  resetEverything: () => void;
}

const initialTeams: Record<TeamId, Team> = {
  A: { id: 'A', name: 'Team Rot', color: DEFAULT_COLORS.A, players: [] },
  B: { id: 'B', name: 'Team Blau', color: DEFAULT_COLORS.B, players: [] },
};

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      pool: [],
      teams: initialTeams,
      setupComplete: false,

      addPlayerToPool: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed || state.pool.includes(trimmed)) return state;
          return { pool: [...state.pool, trimmed] };
        }),

      removePlayerFromPool: (name) =>
        set((state) => ({ pool: state.pool.filter((p) => p !== name) })),

      assignPlayer: (name, teamId) =>
        set((state) => {
          const otherTeamId: TeamId = teamId === 'A' ? 'B' : 'A';
          return {
            pool: state.pool.filter((p) => p !== name),
            teams: {
              ...state.teams,
              [teamId]: {
                ...state.teams[teamId],
                players: [...state.teams[teamId].players.filter((p) => p !== name), name],
              },
              [otherTeamId]: {
                ...state.teams[otherTeamId],
                players: state.teams[otherTeamId].players.filter((p) => p !== name),
              },
            },
          };
        }),

      unassignPlayer: (name, teamId) =>
        set((state) => ({
          pool: [...state.pool, name],
          teams: {
            ...state.teams,
            [teamId]: {
              ...state.teams[teamId],
              players: state.teams[teamId].players.filter((p) => p !== name),
            },
          },
        })),

      autoAssignTeams: () =>
        set((state) => {
          const allPlayers = [
            ...state.pool,
            ...state.teams.A.players,
            ...state.teams.B.players,
          ];
          const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
          const half = Math.ceil(shuffled.length / 2);
          return {
            pool: [],
            teams: {
              A: { ...state.teams.A, players: shuffled.slice(0, half) },
              B: { ...state.teams.B, players: shuffled.slice(half) },
            },
          };
        }),

      setTeamName: (teamId, name) =>
        set((state) => ({
          teams: { ...state.teams, [teamId]: { ...state.teams[teamId], name } },
        })),

      setTeamColor: (teamId, color) =>
        set((state) => ({
          teams: { ...state.teams, [teamId]: { ...state.teams[teamId], color } },
        })),

      finishSetup: () => set({ setupComplete: true }),

      resetEverything: () =>
        set({
          pool: [],
          teams: initialTeams,
          setupComplete: false,
        }),
    }),
    { name: 'trinkspiel-storage' }
  )
);
