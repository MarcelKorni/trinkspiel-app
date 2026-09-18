import { useState } from 'react';
import type { GameComponentProps, GameDefinition } from '../../types/game';

const KATEGORIEN = [
  'Biersorten',
  'Länder Europas',
  'Filme mit Tom Hanks',
  'Fast-Food-Ketten',
  'Superhelden',
  'Automarken',
  'Pizza-Beläge',
  'Cocktails',
  '90er-Jahre-Serien',
  'Vornamen mit A',
  'Fußballvereine',
  'Eissorten',
  'Berufe',
  'Musikinstrumente',
  'Farben',
  'Tiere im Zoo',
  'Studiengänge',
  'Süßigkeiten',
  'Handymarken',
  'Getränke ohne Alkohol',
  'Berge',
  'Flüsse',
  'Comicfiguren',
  'Sportarten',
  'Gewürze',
  'Hauptstädte',
  'Weihnachtslieder',
  'Star-Wars-Charaktere',
];

function zieheKategorie(ausschluss: string | null): string {
  const kandidaten = ausschluss ? KATEGORIEN.filter((k) => k !== ausschluss) : KATEGORIEN;
  return kandidaten[Math.floor(Math.random() * kandidaten.length)];
}

function KategorienGame({ onExit }: GameComponentProps) {
  const [aktuelle, setAktuelle] = useState(() => zieheKategorie(null));

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-white/50">
        Reihum abwechselnd einen Begriff zur Kategorie nennen. Wem nichts mehr einfällt oder wer sich
        wiederholt, trinkt.
      </p>

      <div className="card flex flex-col items-center gap-2 py-10">
        <span className="text-sm text-white/50">Kategorie</span>
        <span className="text-center text-3xl font-black text-neon-amber">{aktuelle}</span>
      </div>

      <button onClick={() => setAktuelle((a) => zieheKategorie(a))} className="btn-primary text-xl">
        🔀 Nächste Kategorie
      </button>

      <button onClick={onExit} className="btn-ghost">
        Fertig – zurück zum Dashboard
      </button>
    </div>
  );
}

export const kategorienGame: GameDefinition = {
  id: 'kategorien',
  name: 'Kategorien',
  kategorie: 'tisch',
  beschreibung: 'Zu einer vorgegebenen Kategorie abwechselnd Begriffe nennen - wem nichts mehr einfällt, trinkt.',
  minSpieler: 4,
  icon: '📋',
  brauchtTeams: true,
  component: KategorienGame,
};
