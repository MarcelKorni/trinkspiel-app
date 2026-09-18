import type { GameDefinition } from '../../types/game';

/**
 * Flunkyball wird komplett analog gespielt - die App wird nur genutzt, um vor
 * dem Spiel schnell zwei zufaellige Teams auszulosen (siehe GameScreen).
 * Kein Score, kein eigener Spiel-Screen noetig.
 */
export const flunkyballGame: GameDefinition = {
  id: 'flunkyball',
  name: 'Flunkyball',
  kategorie: 'aktiv',
  beschreibung: 'Team-Wettrennen: Flasche mit dem Ball umwerfen, dann Getränk leer trinken, bevor das andere Team die Flasche wieder aufstellt.',
  minSpieler: 4,
  icon: '🍾',
  brauchtTeams: true,
  nurTeamAuslosen: true,
};
