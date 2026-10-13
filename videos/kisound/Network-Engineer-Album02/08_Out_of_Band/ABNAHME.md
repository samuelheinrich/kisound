# Out of Band · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Nachweise

- **10/10 Modell- und Timeline-Tests**: Quelle/Dauer, 64 Startzeiten gleich der Vorlage, Orte und Kamera gleich dem überarbeiteten Drehbuch, alle 44
  Events und 52 Lyrics im Drehbuch-Shot, Basseinsätze/Lücken/Fade, Uplink von 0 bis 147,88 s geschlossen und keine
  In-band-Antwort, Kanal 7 endet am Console-Port,
  Kabel getrennt (OOB und Console hinten, Produktion vorne/über Kopf, nirgends näher als 0,9 m), Fahrten wechseln Richtung und Route, Reihenfolge no shutdown → Link → Line Protocol → Route → P-O1 → speichern, P-O2 als neuer Test mit Antwort auf dem
  Produktionspfad, Seitenregeln, Reveal-Zeiten, Wörter, Adressen, Log-Abstand, Determinismus.
- **Browsercheck bestanden**: 78 Standbilder, 458 Zeitpositionen, 12 pixelgleiche Wiederholungen, Player, 4K-Still,
  `FRAMES` 15 865; Wiedergabe lokal 60,1–61,6 fps.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.

## Visuelle Kontrolle

Fassung «Rechenzentrum» (5.10.2026, nach Rückmeldung «zu dunkel und surreal»): Welt neu als helle Datenhalle mit
realem Layout, Engineer am Boden mit Laptop, Fahrten zu ihm hin und von ihm weg. Alle 64 Einstellungen über
Kontaktbögen gesichtet. Korrigiert: Laufwerksschächte erschienen blau (Füllfarbe), Nahaufnahme klebte am Kopf,
Fahrten blickten an Ecken auf leere Wände (Blick weiter voraus, Klimaschränke an den Seitenwänden), Verfolgungskamera
geriet in Racks (bleibt jetzt in den Gängen), Rückblicke durch Rackreihen, CON-Port und Ports passten nicht zur
Kabelführung, NOC-Display zu nah. Blender wurde nicht eingesetzt: die Halle ist prozedural in Three.js gebaut
(Instancing, Canvas-Texturen), ohne Abhängigkeit von anderen Projekten.

Zweite Durchsicht: Laptop war verkehrt herum (Bildschirm zum Rack) – jetzt Scharnier auf der fernen Seite, Bildschirm
zum Engineer, Hände auf der Tastatur (aus dem Laptop-Koordinatensystem berechnet). Gegen Wiederholungen: Zoom aus der
Stadt durch das Gebäude und die vier Rechenzentren hinein (S001) und wieder hinaus (S061–S062), fünf neue Überflüge
(S006, S023, S042, S046, S057). Wiedergabe auch im Zoom 60 fps.

## Grenzen

Lyric-Zeiten automatisch, keine Hörprüfung. Zeitstempel, Paketzeiten und Terminalausgaben sind Szenariowerte.
