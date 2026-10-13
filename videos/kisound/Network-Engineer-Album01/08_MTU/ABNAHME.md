# MTU · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Geliefert

11 Kapitel, 62 Einstellungen (11 POV-Fahrten, 20 in der Messhalle), zwei prozedurale 3D-Räume (Pfad,
Messhalle), Browserplayer mit Originalaudio. Netzszenario mit 122 Paketflügen: 10 verworfene
1500-Byte-Segmente, 10 ICMP „fragmentation needed“ (9 an der Firewall verworfen, 1 nach der Freigabe
zugestellt), Pings und Replies, 84 neue Pakete ≤ 1400 Bytes nach dem Lernen der Path MTU. Enthalten:
stiller Drop in der Pegellücke, 1400 gegen 1401 Bytes, Header/Nutzlast, DF-Klammer, Upload bei 0 %,
tracepath, 1400er-Ping, Tor mit Lineal, M-T-U rot/grün, Tunnelhülle, IPsec und MPLS als Beispiele,
schwarzer Riss, Jumbo-Bahn, Path-MTU-Rahmenreihe, Firewall-Freigabe, Neuaufbau aus 20-Byte-Modulen,
Final Chorus mit Durchflug, Upload fertig mit Mosaik, Titel, letztes Paket auf dem letzten Impuls.

## Nachweise

- **16/16 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster (8341 Bilder),
  lückenlose Schnitte und Kapitel, Normalisierung der frühen Analyse, Lyric-Abschnitte gegen das Transkript,
  alle 28 Events und 58 Lyric-Zeilen genau einmal zugeordnet, Tor = Tunnel-MTU = kleinster Link, keine
  Fragmentierung, jeder Drop mit genau einem ICMP (verworfen vor, zugestellt nach der Freigabe), Pings
  funktionieren, nach dem Lernen nur passende Pakete und kein Datenverlust (Datei und Neuaufbau
  nachgerechnet), erster Chorus scheitert und Final Chorus passiert auf derselben Zeile, letztes Paket auf
  137,69 s, erster Drop in der gemessenen Pegellücke, Kameraziele, Terminaltexte, kinetische Wörter,
  Log-Abstand, Zeitdeterminismus.
- **Browsercheck bestanden** (`npm run check:browser`): 69 Standbilder (Mitte jeder Einstellung plus
  Schlüsselmomente), 326 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne Fehler,
  12 pixelgleiche Wiederholungen nach Zeitsprüngen, Player (Play/Pause, Kapitel, Einzelbild, Tempo, Stumm,
  Schleife am Ende, Debug, Vollbild, Scrubbing, Auflösungswechsel mit Positionserhalt), natives
  3840 × 2160-Standbild, `FRAMES` 8341.
- Fünf kurze Wiedergabeproben (720p) lokal bei **60,2–61,7 fps**; keine Zusage für andere Geräte oder den Export.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.
- SHA-256 von WAV, Audiokopie und Transkript geprüft (`npm run prepare`).

Berichte und Bilder: `output/qa/browser-report.json`, `output/qa/frame-*.png`, `output/qa/title-4k.png`,
`output/qa/browser-player.png`.

## Visuelle Kontrolle

Alle 62 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Paketkörper und Kerne weniger grell,
Tunnelrippen und Punktflüsse zurückgenommen, Host-Monitor zur Kamera gedreht, Firewall schlanker und
Kamera weiter weg, DF-Klammer in der Messhalle als Rahmen statt Block, Nahaufnahmen aus dem Paket heraus,
Tor-Kamera neben die Fahrspur, kinetische Wörter und Kopfzeile in der hellen Halle dunkel bzw. mit Band,
Label-Überlagerungen, grössere tracepath-Marken, deutlicherer schwarzer Riss, 3D-Buchstaben unter dem
Schlusstitel ausgeblendet.

## Grenzen

Lyric-Zeiten stammen aus dem automatischen Transkript (nicht forced-aligned); **keine neue Hörprüfung**.
Standbilder und Signalprüfungen ersetzen keine audiovisuelle Abnahme in Echtzeit. Das Netz ist ein
redaktionelles Szenario mit verdichteten Zeiten, kein Mitschnitt.

**Musikvideoexport erst nach ausdrücklicher Freigabe.**
