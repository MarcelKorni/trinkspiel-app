import type { GameComponentProps, GameDefinition } from '../../types/game';
import { RaceStopwatch } from '../../components/RaceStopwatch';

function FlipCupGame({ onExit }: GameComponentProps) {
  return (
    <RaceStopwatch
      onExit={onExit}
      hinweis="Start drücken, dann trinkt die erste Person pro Team leer und flippt den Becher um - erst wenn er auf dem Kopf steht, ist die nächste Person dran. Team, das zuerst komplett durch ist, tippt auf seinen Button."
    />
  );
}

export const flipcupGame: GameDefinition = {
  id: 'flipcup',
  name: 'Flip the Cup',
  kategorie: 'aktiv',
  beschreibung: 'Staffel-Wettrennen: leer trinken, Becher umflippen, nächste Person ist dran. Team, das zuerst durch ist, gewinnt.',
  minSpieler: 4,
  icon: '🥛',
  brauchtTeams: true,
  component: FlipCupGame,
};
