import type { ComponentType } from 'react';

export type GameCategory = 'tisch' | 'aktiv';

/**
 * Props, die jedes Spiel-Modul von der App bekommt.
 * Zugriff auf die Teams laeuft NICHT ueber Props, sondern ueber den
 * globalen Store (useGameStore) - so kann jedes Spiel unabhaengig auf
 * Team-/Spielernamen zugreifen, ohne dass die App etwas davon wissen muss.
 * Es gibt keinen spielübergreifenden Punktestand - jedes Spiel ist in sich
 * abgeschlossen.
 */
export interface GameComponentProps {
  /** Vom Spiel aufrufen, wenn die Runde fertig ist -> zurück zur Spielauswahl. */
  onExit: () => void;
}

export interface GameDefinition {
  /** Eindeutige ID, wird auch als Routen-Segment genutzt (z.B. "schaetzen"). */
  id: string;
  name: string;
  kategorie: GameCategory;
  beschreibung: string;
  minSpieler: number;
  /** Emoji als simples Icon - kein Icon-Set-Setup notwendig. */
  icon: string;
  /**
   * Ob das Spiel ueberhaupt Teams braucht (false z.B. bei Rage Cage).
   * Wenn true, lost GameScreen vor JEDEM Start automatisch frische,
   * zufaellige Teams aus - es gibt keine dauerhafte Team-Auswahl mehr.
   */
  brauchtTeams: boolean;
  /**
   * Nur relevant wenn brauchtTeams true ist. Wenn true, zeigt GameScreen nach
   * dem Auslosen NUR die Team-Aufstellung (kein eigener Spiel-Screen, kein
   * "One for the Team"-Alarm) - fuer Spiele wie Bierpong/Flunkyball, die
   * komplett analog ohne App-Unterstuetzung gespielt werden.
   */
  nurTeamAuslosen?: boolean;
  /** Optional, wenn nurTeamAuslosen true ist - dann wird kein Screen gerendert. */
  component?: ComponentType<GameComponentProps>;
}
