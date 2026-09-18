import type { GameDefinition } from '../../types/game';

/**
 * Bierpong wird komplett analog gespielt - die App wird nur genutzt, um vor
 * dem Spiel schnell zwei zufaellige Teams auszulosen (siehe GameScreen).
 * Kein Score, kein eigener Spiel-Screen noetig.
 */
export const bierpongGame: GameDefinition = {
  id: 'bierpong',
  name: 'Bierpong',
  kategorie: 'aktiv',
  beschreibung: 'Klassiker: Baelle in gegnerische Becher werfen. Team mit mehr getroffenen Bechern gewinnt.',
  minSpieler: 2,
  icon: '🏓',
  brauchtTeams: true,
  nurTeamAuslosen: true,
};
