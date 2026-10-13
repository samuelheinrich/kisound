# It’s Always DNS · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Geliefert

15 Kapitel, 100 Einstellungen (20 POV-Fahrten mit 20 verschiedenen Transaktionen, 27 am Schreibtisch),
zwei prozedurale 3D-Räume (Stadt, Schreibtisch), Browserplayer mit Originalaudio. DNS-Szenario mit 33
Transaktionen, Resolver-Cache mit TTL-Sanduhren, Split Horizon auf `ns1`, drei Tickets (#4040 App,
#4041 CNAME-Kette, #4042 Drucker). Enthalten: rekursive Auflösung über Root/TLD/autoritativ,
Negativ-Cache, alter Client-Cache (TTL 86400), Reverse-Lookup ohne PTR, CNAME-Ketten,
Flush · Query · Dig · Fix, Timeout in der digitalen Stille, Licht aus im Blackout, Ablauf kurzer TTLs,
Fallwand, Titel und harter Schluss.

## Nachweise

- **15/15 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster, lückenlose Schnitte
  und Kapitel, alle 74 Events und 64 Lyric-Segmente genau einmal zugeordnet, Timeout und Blackout auf
  gemessener Stille, zusammenhängende Hops, Root genau einmal pro TLD und keine Domain zweimal an ihrer TLD,
  Fall #4040 (Negativ-Cache, Flush allein hilft nicht, Fix in der internen View), NXDOMAIN ≠ Timeout,
  zonenübergreifende CNAME-Ketten, TTL-Ablauf, kinetische Wörter aus den Lyrics, dig-Ausgaben,
  Log-Abstand, Zeitdeterminismus.
- **Browsercheck bestanden** (`npm run check:browser`): 107 Standbilder (Mitte jeder Einstellung plus
  Schlüsselmomente), 562 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne Fehler,
  11 pixelgleiche Wiederholungen nach Zeitsprüngen, Player (Play/Pause, Kapitel, Einzelbild, Tempo, Stumm,
  Schleife am Ende, Debug, Vollbild, Scrubbing, Auflösungswechsel mit Positionserhalt), natives
  3840 × 2160-Standbild, `FRAMES` 15 673.
- Fünf kurze Wiedergabeproben (720p) lokal bei **60,1–61,2 fps**; keine Zusage für andere Geräte oder den Export.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.
- SHA-256 von WAV, Audiokopie und Transkript gegen die Analyse geprüft (`npm run prepare`).

Berichte und Bilder: `output/qa/browser-report.json`, `output/qa/frame-*.png`, `output/qa/title-4k.png`,
`output/qa/browser-player.png`.

## Visuelle Kontrolle

Alle 100 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Stadt heller (Key-Light, farbige
Akzentlichter am Resolver, Root-Ring und ns1), Hochhäuser weiter nach aussen, Totalen und Ride-Kamera
näher bzw. höher, Paketkarten kleiner, Neonschild auf Breite eingepasst, Monitor-Einstellungen mit
ganzem Terminal, Stempel ohne doppeltes Overlay-Wort, Fallwand und Tassenschrift im Dunkeln aus.

## Grenzen

Lyric-Zeiten sind automatisch erzeugt; **keine neue Hörprüfung**. Standbilder und Signalprüfungen
ersetzen keine audiovisuelle Abnahme in Echtzeit. Das DNS-Geschehen ist ein redaktionelles Szenario
mit verdichteten Zeiten, kein Mitschnitt.

**Musikvideoexport erst nach ausdrücklicher Freigabe.**
