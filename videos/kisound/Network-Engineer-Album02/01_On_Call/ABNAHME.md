# On Call · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**
Audio ist die finale Release-WAV `01_On_Call_1.0.wav` (während der Umsetzung aus dem bitgleichen Kandidaten
`0.2` umbenannt; Transkriptzeiten unverändert, Analyse mit den finalen Verweisen neu berechnet).

## Geliefert

11 Kapitel, 60 Einstellungen (Schnittliste des Drehbuchs), vier prozedurale 3D-Räume (Stadt, Schreibtisch,
Display, R-EDGE innen mit Rackgang), Browserplayer mit Originalaudio. Szenario mit 268 Paketflügen: TEST-A vor
und nach dem Eingriff, Diagnose-SYN F-A1 in Zeitlupe bis zur Verwerfung an Regel 10, Gateway-Vergleich,
zwei markierte Replays, vollständige TCP/TLS/HTTP-Sitzung F-A2, Prüfungen APP-B/APP-C/CTRL-D, normaler
Verkehr. Display mit Ticket, Terminal (B01–B07, P0, P1), Live-Spur, Monitoring, Diff, Beweiskarte, Ursache,
Anhängen und Abschluss.

## Nachweise

- **12/12 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster, lückenlose Schnitte und
  Kapitel, alle 60 Startzeiten gleich der Drehbuch-Schnittliste, alle 41 Events und 52 Lyric-Segmente genau
  einmal und im Drehbuch-Shot, Bass-Einsätze/Pegellücken/Blende gegen die Analyse, ACL verwirft genau den
  Serververkehr bis 146,82 s und danach nichts, CTRL-D und Router-eigene Adresse ohne ACL, F-A1/F-A2
  (Ports, Zeitpunkte auf L022/L039/L040, kein Wiederauftauchen), Counter 40→41→unverändert, Reveal-Regeln
  (Antwort nach Ankunft, Dienste einzeln, Befund nach Beleg, Vorschau bis Enter), Seiten ≤ 6 Zeilen und ≥ 4 s,
  kinetische Wörter, Kameraziele, Adressbereiche, Log-Abstand, Zeitdeterminismus.
- **Browsercheck bestanden** (`npm run check:browser`): 70 Standbilder (Mitte jeder Einstellung plus
  Schlüsselmomente), 398 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne Fehler,
  12 pixelgleiche Wiederholungen nach Zeitsprüngen, Player (Play/Pause, Kapitel, Einzelbild, Tempo, Stumm,
  Schleife am Ende, Debug, Vollbild, Scrubbing, Auflösungswechsel mit Positionserhalt), natives
  3840 × 2160-Standbild, `FRAMES` 13 007.
- Fünf kurze Wiedergabeproben lokal bei **60,4–62,3 fps**; keine Zusage für andere Geräte oder den Export.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.
- SHA-256 von WAV, Audiokopie und Transkript gegen die Analyse geprüft (`npm run prepare`).

## Visuelle Kontrolle

Alle 60 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Tischplatte 2 cm zu hoch (Telefon und Tasse
steckten darin), Schreibtisch-Kameras zu nah (Kopf füllte das Bild), Fahrt durchs Fenster zu dunkel und
frontal aufs Gesicht, Telefonlicht überstrahlte den Tisch, Regelblätter spiegelverkehrt, Stadt zu dunkel und
ohne See/Berge, Mond überstrahlt, Fensterbild verfehlte das Fenster, Lichtkeil im Rackgang, Kamera in S045
verpasste F-A2.

## Grenzen

Lyric-Zeiten sind automatisch erzeugt; **keine Hörprüfung**. Die Person ist bewusst eine stilisierte
Silhouette ohne Gesicht. Standbilder und Signalprüfungen ersetzen keine audiovisuelle Abnahme in Echtzeit.
Das Geschehen ist ein redaktionelles Szenario mit verdichteten Zeiten, kein Mitschnitt.

**Musikvideoexport erst nach ausdrücklicher Freigabe.**
