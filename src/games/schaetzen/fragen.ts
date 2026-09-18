export interface SchaetzFrage {
  id: number;
  frage: string;
  antwort: string;
}

/**
 * Pool von 100 Schaetzfragen. Pro Spielsession werden 8 zufaellige,
 * eindeutige Fragen daraus gezogen (siehe index.tsx).
 * Werte sind grobe/kursierende Trivia-Schaetzwerte, keine wissenschaftlich
 * exakten Angaben - fuer den Partyspiel-Zweck voellig ausreichend.
 */
export const fragenPool: SchaetzFrage[] = [
  // Geografie
  { id: 1, frage: 'Wie viele Länder sind aktuell Mitglied der Europäischen Union?', antwort: '27' },
  { id: 2, frage: 'Wie viele Bundesländer hat Deutschland?', antwort: '16' },
  { id: 3, frage: 'Wie hoch ist der Mount Everest ungefähr, in Metern?', antwort: 'ca. 8.849 m' },
  { id: 4, frage: 'Wie lang ist der Nil ungefähr, in Kilometern?', antwort: 'ca. 6.650 km' },
  { id: 5, frage: 'Wie viele Zeitzonen hat Russland?', antwort: '11' },
  { id: 6, frage: 'Wie viele Inseln hat Indonesien ungefähr?', antwort: 'über 17.000' },
  { id: 7, frage: 'Wie tief ist der Marianengraben ungefähr, in Metern?', antwort: 'ca. 10.935 m' },
  { id: 8, frage: 'Wie viele Länder grenzen direkt an Deutschland?', antwort: '9' },
  { id: 9, frage: 'Wie viele Einwohner hat Deutschland ungefähr, in Millionen?', antwort: 'ca. 84 Millionen' },
  { id: 10, frage: 'Wie groß ist die Sahara ungefähr, in Millionen Quadratkilometern?', antwort: 'ca. 9,2 Mio. km²' },

  // Natur & Tiere
  { id: 11, frage: 'Wie viele Herzen hat ein Oktopus?', antwort: '3' },
  { id: 12, frage: 'Wie schnell kann ein Gepard maximal laufen, in km/h?', antwort: 'ca. 110–120 km/h' },
  { id: 13, frage: 'Wie lang kann ein Blauwal werden, in Metern?', antwort: 'bis zu 33 m' },
  { id: 14, frage: 'Wie viele Beine hat eine Spinne?', antwort: '8' },
  { id: 15, frage: 'Wie alt kann eine Galapagos-Riesenschildkröte werden, in Jahren?', antwort: 'über 150 Jahre' },
  { id: 16, frage: 'Wie viele Liter Wasser trinkt ein Elefant ungefähr pro Tag?', antwort: 'ca. 150–200 Liter' },
  { id: 17, frage: 'Wie oft schlägt ein Kolibri pro Sekunde mit den Flügeln?', antwort: 'ca. 50 Mal' },
  { id: 18, frage: 'Wie viele Ameisenarten gibt es weltweit ungefähr?', antwort: 'über 12.000' },
  { id: 19, frage: 'Wie viele Tage kann ein Kamel ohne Wasser auskommen?', antwort: 'bis zu 10 Tage' },
  { id: 20, frage: 'Wie viele Zähne wachsen einem Hai im Laufe seines Lebens ungefähr nach?', antwort: 'mehrere Tausend' },

  // Körper & Gesundheit
  { id: 21, frage: 'Wie viele Knochen hat ein erwachsener Mensch?', antwort: '206' },
  { id: 22, frage: 'Wie oft schlägt ein menschliches Herz ungefähr pro Tag?', antwort: 'ca. 100.000 Mal' },
  { id: 23, frage: 'Wie viele Liter Blut hat ein erwachsener Mensch ungefähr im Körper?', antwort: 'ca. 5 Liter' },
  { id: 24, frage: 'Wie lang ist der Dünndarm eines Menschen ungefähr, in Metern?', antwort: 'ca. 6–7 m' },
  { id: 25, frage: 'Wie viele Muskeln hat der menschliche Körper ungefähr?', antwort: 'ca. 650' },
  { id: 26, frage: 'Wie viele Kopfhaare hat ein Mensch durchschnittlich?', antwort: 'ca. 100.000–150.000' },
  { id: 27, frage: 'Wie viele Geschmacksknospen hat die menschliche Zunge ungefähr?', antwort: 'ca. 10.000' },
  { id: 28, frage: 'Wie schnell kann ein Niesen ungefähr sein, in km/h?', antwort: 'bis zu 160 km/h' },
  { id: 29, frage: 'Wie viele Liter Luft atmet ein Mensch ungefähr pro Tag?', antwort: 'ca. 11.000–15.000 Liter' },
  { id: 30, frage: 'Wie viele Zähne hat ein erwachsener Mensch normalerweise?', antwort: '32' },

  // Sport
  { id: 31, frage: 'Wie viele Spieler stehen bei einem Fußballteam gleichzeitig auf dem Feld?', antwort: '11' },
  { id: 32, frage: 'Wie lang ist ein Marathon, in Kilometern?', antwort: '42,195 km' },
  { id: 33, frage: 'Wie viele Ringe hat das Olympische Symbol?', antwort: '5' },
  { id: 34, frage: 'Wie hoch hängt ein Basketballkorb, in Metern?', antwort: '3,05 m' },
  { id: 35, frage: 'Wie viele Spieler hat ein Volleyballteam auf dem Feld?', antwort: '6' },
  { id: 36, frage: 'Wie lange dauert ein Fußballspiel inklusive Halbzeitpause, in Minuten?', antwort: '105 Minuten' },
  { id: 37, frage: 'Wie schwer ist ein olympischer Diskus für Männer, in Kilogramm?', antwort: '2 kg' },
  { id: 38, frage: 'Wie viele Bahnen hat eine Standard-Olympia-Laufbahn?', antwort: '8' },
  { id: 39, frage: 'Wie viele Spieler hat ein Handballteam auf dem Feld?', antwort: '7' },
  { id: 40, frage: 'Wie hoch ist ein Tennisnetz in der Mitte ungefähr, in Metern?', antwort: 'ca. 0,91 m' },

  // Geschichte
  { id: 41, frage: 'In welchem Jahr fiel die Berliner Mauer?', antwort: '1989' },
  { id: 42, frage: 'Wie viele Jahre dauerte der Zweite Weltkrieg?', antwort: '6 Jahre' },
  { id: 43, frage: 'Wie alt sind die Pyramiden von Gizeh ungefähr, in Jahren?', antwort: 'über 4.500 Jahre' },
  { id: 44, frage: 'In welchem Jahr wurde das World Wide Web für die Öffentlichkeit freigegeben?', antwort: '1991' },
  { id: 45, frage: 'Wie viele Jahre regierte Königin Elisabeth II.?', antwort: '70 Jahre' },
  { id: 46, frage: 'In welchem Jahr betrat der Mensch zum ersten Mal den Mond?', antwort: '1969' },
  { id: 47, frage: 'Über wie viele Jahre erstreckte sich der Bau der Chinesischen Mauer insgesamt ungefähr?', antwort: 'über 2.000 Jahre' },
  { id: 48, frage: 'In welchem Jahr wurde die Bundesrepublik Deutschland gegründet?', antwort: '1949' },
  { id: 49, frage: 'Wie alt ist die älteste bekannte Zivilisation ungefähr, in Jahren?', antwort: 'über 5.000 Jahre' },
  { id: 50, frage: 'In welchem Jahr endete ungefähr der Kalte Krieg?', antwort: '1991' },

  // Weltraum
  { id: 51, frage: 'Wie viele Planeten hat unser Sonnensystem?', antwort: '8' },
  { id: 52, frage: 'Wie viele Minuten braucht das Sonnenlicht ungefähr bis zur Erde?', antwort: 'ca. 8 Minuten' },
  { id: 53, frage: 'Wie viele Monde hat der Jupiter mindestens, nach heutigem Kenntnisstand?', antwort: 'über 90' },
  { id: 54, frage: 'Wie viele Tage dauert eine Erdumkreisung der Sonne?', antwort: '365 Tage' },
  { id: 55, frage: 'Wie schnell dreht sich die Erde am Äquator ungefähr, in km/h?', antwort: 'ca. 1.670 km/h' },
  { id: 56, frage: 'Wie weit ist der Mond von der Erde entfernt ungefähr, in Kilometern?', antwort: 'ca. 384.000 km' },
  { id: 57, frage: 'Wie heiß ist die Oberfläche der Sonne ungefähr, in Grad Celsius?', antwort: 'ca. 5.500 °C' },
  { id: 58, frage: 'Wie viele Stunden dauert ein Marstag ungefähr?', antwort: 'ca. 24,6 Stunden' },
  { id: 59, frage: 'Wie viele Sterne enthält die Milchstraße ungefähr, in Milliarden?', antwort: '100–400 Milliarden' },
  { id: 60, frage: 'Wie schnell fliegt die Internationale Raumstation ISS ungefähr, in km/h?', antwort: 'ca. 28.000 km/h' },

  // Technik & Internet
  { id: 61, frage: 'Wie viele Menschen nutzen weltweit ungefähr das Internet, in Milliarden?', antwort: 'über 5 Milliarden' },
  { id: 62, frage: 'In welchem Jahr wurde das erste iPhone vorgestellt?', antwort: '2007' },
  { id: 63, frage: 'Wie viele WhatsApp-Nachrichten werden weltweit ungefähr pro Tag verschickt, in Milliarden?', antwort: 'über 100 Milliarden' },
  { id: 64, frage: 'Wie viele Google-Suchanfragen gibt es weltweit ungefähr pro Sekunde?', antwort: 'über 90.000' },
  { id: 65, frage: 'In welchem Jahr wurde YouTube gegründet?', antwort: '2005' },
  { id: 66, frage: 'Wie viele aktive Nutzer hat Instagram ungefähr, in Milliarden?', antwort: 'über 2 Milliarden' },
  { id: 67, frage: 'Wie viele Transistoren hat ein moderner High-End-Prozessor ungefähr, in Milliarden?', antwort: 'über 50 Milliarden' },
  { id: 68, frage: 'In welchem Jahr wurde Google gegründet?', antwort: '1998' },
  { id: 69, frage: 'Wie viele E-Mails werden weltweit ungefähr pro Tag verschickt, in Milliarden?', antwort: 'über 300 Milliarden' },
  { id: 70, frage: 'Wie viele Apps gibt es ungefähr im Google Play Store, in Millionen?', antwort: 'über 2 Millionen' },

  // Essen & Trinken
  { id: 71, frage: 'Wie viele Liter Bier trinkt ein Deutscher im Schnitt pro Jahr ungefähr?', antwort: 'ca. 90 Liter' },
  { id: 72, frage: 'Wie viele Kalorien hat eine durchschnittliche Pizza Margherita ungefähr?', antwort: 'ca. 800 kcal' },
  { id: 73, frage: 'Wie viele Liter Kaffee trinkt ein Deutscher im Schnitt pro Jahr ungefähr?', antwort: 'ca. 160 Liter' },
  { id: 74, frage: 'Wie viele verschiedene Käsesorten gibt es in Frankreich ungefähr?', antwort: 'über 1.000' },
  { id: 75, frage: 'Wie viele Kilogramm Schokolade isst ein Deutscher im Schnitt pro Jahr ungefähr?', antwort: 'ca. 9 kg' },
  { id: 76, frage: 'Wie viele Monate dauert es ungefähr, eine Flasche Wein von der Traube bis zur Abfüllung herzustellen?', antwort: 'ca. 6–12 Monate' },
  { id: 77, frage: 'Wie viele Liter Wein produziert Frankreich ungefähr pro Jahr, in Milliarden Litern?', antwort: 'ca. 4–5 Milliarden Liter' },
  { id: 78, frage: 'Wie viele Gläser Wasser sollte ein Mensch am Tag ungefähr trinken?', antwort: 'ca. 6–8 Gläser' },
  { id: 79, frage: 'Wie hoch ist der Alkoholgehalt von normalem Bier ungefähr, in Prozent?', antwort: 'ca. 5 %' },
  { id: 80, frage: 'Wie viele Kilogramm Kartoffeln isst ein Deutscher im Schnitt pro Jahr ungefähr?', antwort: 'ca. 55 kg' },

  // Alltag & Kurioses
  { id: 81, frage: 'Wie viele Jahre seines Lebens verbringt ein Mensch im Schnitt ungefähr mit Schlafen?', antwort: 'ca. 25 Jahre' },
  { id: 82, frage: 'Wie viele Wörter spricht ein Mensch im Schnitt ungefähr pro Tag?', antwort: 'ca. 16.000' },
  { id: 83, frage: 'Wie viele Stunden schaut ein Mensch im Schnitt pro Tag ungefähr auf sein Handy?', antwort: 'ca. 3–4 Stunden' },
  { id: 84, frage: 'Wie viele Schritte macht ein Mensch im Schnitt ungefähr pro Tag?', antwort: 'ca. 5.000–7.000' },
  { id: 85, frage: 'Wie viele verschiedene Lieder hört ein Mensch ungefähr im Laufe seines Lebens?', antwort: 'mehrere Zehntausend' },
  { id: 86, frage: 'Wie viele Minuten dauert es im Schnitt ungefähr, bis ein Mensch einschläft?', antwort: 'ca. 10–20 Minuten' },
  { id: 87, frage: 'Wie viele Emojis werden weltweit ungefähr pro Tag verschickt, in Milliarden?', antwort: 'über 10 Milliarden' },
  { id: 88, frage: 'Wie oft lacht ein Mensch im Schnitt ungefähr pro Tag?', antwort: 'ca. 15–20 Mal' },
  { id: 89, frage: 'Wie viele Kleidungsstücke besitzt ein durchschnittlicher Mensch in Deutschland ungefähr?', antwort: 'ca. 95 Stück' },
  { id: 90, frage: 'Wie viele Jahre seines Lebens verbringt ein Mensch im Schnitt ungefähr mit Warten (z.B. Schlangestehen)?', antwort: 'ca. 2–3 Jahre' },

  // Film, Musik & Pop-Kultur
  { id: 91, frage: 'Wie viele Hauptfilme umfasst die "Star Wars"-Skywalker-Saga?', antwort: '9' },
  { id: 92, frage: 'Wie viele Grammy Awards hat Beyoncé ungefähr gewonnen?', antwort: 'über 30' },
  { id: 93, frage: 'Wie viele Minuten dauert der längste "Der Herr der Ringe"-Film in der Extended Edition ungefähr?', antwort: 'über 250 Minuten' },
  { id: 94, frage: 'Wie viele Folgen hat "Die Simpsons" ungefähr?', antwort: 'über 750' },
  { id: 95, frage: 'Wie viele Milliarden US-Dollar hat der Film "Avatar" ungefähr weltweit eingespielt?', antwort: 'über 2,9 Milliarden' },
  { id: 96, frage: 'Wie viele Studioalben haben "The Beatles" veröffentlicht?', antwort: '12' },
  { id: 97, frage: 'Wie viele Oscars hat der Film "Titanic" gewonnen?', antwort: '11' },
  { id: 98, frage: 'Wie viele Hauptfilme umfasst die "Harry Potter"-Filmreihe?', antwort: '8' },
  { id: 99, frage: 'Wie alt war Michael Jackson ungefähr, als sein Album "Thriller" erschien?', antwort: '24 Jahre' },
  { id: 100, frage: 'Wie viele James-Bond-Hauptfilme gibt es ungefähr, Stand heute?', antwort: 'über 25' },
];
