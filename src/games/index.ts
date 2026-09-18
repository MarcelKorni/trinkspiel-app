import type { GameDefinition } from '../types/game';
import { schaetzenGame } from './schaetzen';
import { bierpongGame } from './bierpong';
import { flunkyballGame } from './flunkyball';
import { ragecageGame } from './ragecage';
import { flipcupGame } from './flipcup';
import { werZuerstLeerGame } from './werzuerstleer';
import { kategorienGame } from './kategorien';
import { staffellaufGame } from './staffellauf';
import { songsErratenGame } from './songserraten';
import { pantomimeGame } from './pantomime';
import { montagsmalerGame } from './montagsmaler';

/**
 * Zentrale Spiele-Registry.
 *
 * Neues Spiel hinzufuegen:
 * 1. Neuen Ordner unter src/games/<dein-spiel>/index.tsx anlegen.
 * 2. Darin eine GameComponentProps-Komponente + ein GameDefinition-Objekt
 *    exportieren (siehe src/games/schaetzen oder src/games/bierpong als Vorlage).
 * 3. Hier unten importieren und in das Array eintragen.
 *
 * Das ist die EINZIGE Stelle im Rest der App, die dafuer angefasst werden muss -
 * Dashboard, Spielauswahl und Navigation lesen ausschliesslich aus diesem Array.
 */
export const games: GameDefinition[] = [
  schaetzenGame,
  bierpongGame,
  flunkyballGame,
  ragecageGame,
  flipcupGame,
  werZuerstLeerGame,
  kategorienGame,
  staffellaufGame,
  songsErratenGame,
  pantomimeGame,
  montagsmalerGame,
];
