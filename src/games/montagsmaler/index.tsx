import type { GameComponentProps, GameDefinition } from '../../types/game';
import { BegriffRaten } from '../../components/BegriffRaten';

const BEGRIFFE = [
  'Sonnenbrille',
  'Regenschirm',
  'Ampel',
  'Pizza',
  'Roboter',
  'Dinosaurier',
  'Rakete',
  'Gitarre',
  'Schneemann',
  'Kaktus',
  'Pinguin',
  'Vulkan',
  'Leuchtturm',
  'Fahrrad',
  'Kamera',
  'Krone',
  'Anker',
  'Schmetterling',
  'Zug',
  'Burg',
  'Drache',
  'Pirat',
  'Ufo',
  'Palme',
  'Igel',
  'Zahnbürste',
  'Handtasche',
  'Wolkenkratzer',
  'Segelboot',
  'Windmühle',
  'Glühbirne',
  'Herz',
  'Stern',
  'Mond',
  'Krake',
  'Karotte',
  'Zelt',
  'Trompete',
  'Brille',
  'Uhr',
];

function MontagsmalerGame({ onExit }: GameComponentProps) {
  return (
    <BegriffRaten
      onExit={onExit}
      begriffe={BEGRIFFE}
      timerSekunden={90}
      hinweis="Eine Person aus dem aktiven Team zeichnet den Begriff (keine Buchstaben, keine Zahlen) - der Rest des Teams muss ihn erraten."
    />
  );
}

export const montagsmalerGame: GameDefinition = {
  id: 'montagsmaler',
  name: 'Montagsmaler',
  kategorie: 'tisch',
  beschreibung: 'Eine Person zeichnet einen Begriff, das eigene Team muss ihn erraten - gegen die Zeit.',
  minSpieler: 4,
  icon: '🎨',
  brauchtTeams: true,
  component: MontagsmalerGame,
};
