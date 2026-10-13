# Destination Unreachable · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Geliefert

10 Kapitel, 85 Einstellungen (20 an der Nebelkarte, 21 POV-Fahrten inkl. Fall in Null0), zwei
prozedurale 3D-Räume (Backbone, Kartentisch), Browserplayer mit Originalaudio. Szenario mit 150
Paketflügen: Echo Requests, sechs Traceroutes, 78 Pakete in Null0 bei R4, Unreachables von R2, Time
Exceeded von Hop 1–4, ein Server, der vor dem Wachsen der Blackhole-Route antwortet und danach verschwindet,
Metrikwechsel über R3b. Kartentisch mit Nebel, Hop-Nummern, `* * *`, ICMP-Zetteln, Routing-Tabellen,
Firewall-Log und Befund-Akte.

## Nachweise

- **12/12 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster, lückenlose Schnitte
  und Kapitel, alle 42 Events und 51 Lyric-Segmente genau einmal zugeordnet, Sub-Bass-Einsätze und
  Pegellücke gegen die Analyse, Null0 ohne ICMP und Unreachable nur von R2, Traceroute-Ergebnis Hop 1–4 /
  `* * *`, Blackhole /32 → /24 auf der Zeile und Fall auf „Watch it fall“, Metrikwechsel, Nebel nur wo
  geantwortet wurde, jede gesungene ICMP-Meldung auf einem echten Ereignis, kinetische Wörter,
  Kameraziele, Adressbereiche, Log-Abstand, Zeitdeterminismus.
- **Browsercheck bestanden** (`npm run check:browser`): 93 Standbilder (Mitte jeder Einstellung plus
  Schlüsselmomente), 516 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne Fehler,
  12 pixelgleiche Wiederholungen nach Zeitsprüngen, Player (Play/Pause, Kapitel, Einzelbild, Tempo,
  Stumm, Schleife am Ende, Debug, Vollbild, Scrubbing, Auflösungswechsel mit Positionserhalt), natives
  3840 × 2160-Standbild, `FRAMES` 15 589.
- Fünf kurze Wiedergabeproben (720p) lokal bei **60,3–61,9 fps**; keine Zusage für andere Geräte oder den Export.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.
- SHA-256 von WAV, Audiokopie und Transkript gegen die Analyse geprüft (`npm run prepare`).

## Visuelle Kontrolle

Alle 85 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Backbone zu dunkel (Nebel, Licht,
Turmkanten, Kabel), schwarzes Loch unsichtbar vor schwarzem Himmel (jetzt rotes Gegenlicht als
Finsternis), Kartennebel zu deckend und Draufsicht zu weit, Fall-Kamera blieb nach dem Sturz im Schwarz
(zieht jetzt zurück), Turm-Kamera in der Partikelscheibe, Schlusstitel über leerem Bild.

## Grenzen

Lyric-Zeiten sind automatisch erzeugt; **keine neue Hörprüfung**. Standbilder und Signalprüfungen
ersetzen keine audiovisuelle Abnahme in Echtzeit. Das Geschehen ist ein redaktionelles Szenario mit
verdichteten Zeiten, kein Mitschnitt.

**Musikvideoexport erst nach ausdrücklicher Freigabe.**
