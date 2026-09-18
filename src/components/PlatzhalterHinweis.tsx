interface PlatzhalterHinweisProps {
  text: string;
  onExit: () => void;
}

/** Wiederverwendbarer Platzhalter-Inhalt fuer Spiele, deren eigentliche
 * Spiellogik noch nicht gebaut ist - nur zum Testen der Navigation. */
export function PlatzhalterHinweis({ text, onExit }: PlatzhalterHinweisProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <p className="text-sm text-white/60">🚧 {text}</p>
      </div>
      <button onClick={onExit} className="btn-primary">
        Fertig – zurück zum Dashboard
      </button>
    </div>
  );
}
