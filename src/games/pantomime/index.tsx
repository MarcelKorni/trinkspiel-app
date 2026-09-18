import type { GameComponentProps, GameDefinition } from '../../types/game';
import { BegriffRaten } from '../../components/BegriffRaten';

const BEGRIFFE = [
  'Zähne putzen',
  'Skifahren',
  'Ein Selfie machen',
  'Angeln',
  'Staubsaugen',
  'Klavier spielen',
  'Fallschirmspringen',
  'Kellner',
  'Feuerwehrmann',
  'Zauberer',
  'Roboter',
  'Superman',
  'Weihnachtsmann',
  'Ballett tanzen',
  'Boxen',
  'Schwimmen',
  'Auto waschen',
  'Gitarre spielen',
  'Kaffee kochen',
  'Yoga machen',
  'Fußball spielen',
  'Ei braten',
  'Schlafwandeln',
  'Seil springen',
  'Baum fällen',
  'Wäsche aufhängen',
  'Zelt aufbauen',
  'Fahrrad reparieren',
  'Karten spielen',
  'Tauchen',
  'Reiten',
  'Kuchen backen',
  'Rasen mähen',
  'Fenster putzen',
  'Trampolin springen',
  'Ballon aufblasen',
  'Schach spielen',
  'Fotografieren',
  'Wie ein Roboter tanzen',
  'Ein Bild geraderücken',
];

function PantomimeGame({ onExit }: GameComponentProps) {
  return (
    <BegriffRaten
      onExit={onExit}
      begriffe={BEGRIFFE}
      timerSekunden={60}
      hinweis="Eine Person aus dem aktiven Team stellt den Begriff stumm dar (keine Worte, keine Buchstaben) - der Rest des Teams muss ihn erraten."
    />
  );
}

export const pantomimeGame: GameDefinition = {
  id: 'pantomime',
  name: 'Pantomime',
  kategorie: 'tisch',
  beschreibung: 'Eine Person stellt einen Begriff stumm dar, das eigene Team muss ihn erraten - gegen die Zeit.',
  minSpieler: 4,
  icon: '🎭',
  brauchtTeams: true,
  component: PantomimeGame,
};
