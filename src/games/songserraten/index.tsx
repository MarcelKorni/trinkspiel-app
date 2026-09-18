import type { GameComponentProps, GameDefinition } from '../../types/game';
import { PlatzhalterHinweis } from '../../components/PlatzhalterHinweis';

function SongsErratenGame({ onExit }: GameComponentProps) {
  return (
    <PlatzhalterHinweis
      text="Hier kommt später die Logik hin: ein Songschnipsel wird abgespielt, Teams raten Titel und/oder Interpret - richtige Antwort gewinnt die Runde."
      onExit={onExit}
    />
  );
}

export const songsErratenGame: GameDefinition = {
  id: 'songs-erraten',
  name: 'Songs erraten',
  kategorie: 'tisch',
  beschreibung: 'Ein kurzer Songschnipsel läuft - welches Team errät zuerst Titel oder Interpret?',
  minSpieler: 2,
  icon: '🎵',
  brauchtTeams: true,
  component: SongsErratenGame,
};
