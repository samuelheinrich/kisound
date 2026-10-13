# Last Hop — codebasiertes Musikvideo

Track 09 von *Network Engineer* (Album 01), Samuel Heinrich. 294.721 s, 60 fps, 17 684 Frames.
Der Ton wird **nicht** erzeugt: die Release-WAV aus dem Musik-Repository ist die verbindliche Zeitachse.

Das Drehbuch steht in [`DREHBUCH.md`](DREHBUCH.md) — Leitidee, die neun Hops, die vier Mechaniken
und der Szenenplan mit Zeiten. Diese Datei beschreibt nur den Code.

## Schnellstart

```sh
npm install
npm run prepare-audio     # WAV + Transkript aus dem Musik-Repo einlesen, Beat-Raster messen
npm run serve             # Player auf http://127.0.0.1:8125/
```

Weiter: `npm run stills` (Kontrollbilder), `npm run preview` (1080p), `npm run final` (4K, x264 slow).

Der Player nimmt `?res=720|1080|1440`, `?animatic=1` zeigt die Szenenkarten.
Ein Einzelbild ohne Player: `?w=1920&h=1080&t=145`.

## Aufbau

```
src/render/
  index.html main.js      Bootstrap; setzt window.FILM / renderFrame / renderTime für den Renderer
  config.js               ALLES Track-Spezifische: Palette, HOPS, SHOTS, MESSAGES, abgeleiteter Zustand
  timeline.js             Beat-Raster, Hüllkurven, Kicks; snapShots() rastet die Schnitte
  film.js                 wählt pro t die Einstellung, aktualisiert die Zone, Post, Overlay
  route.js                der Flugpfad: neun Hops mit Richtungswechsel, Zeit → Bogenlänge
  zones/cyber.js          die Bühne: Welt + Route + Held, MOOD gibt jedem Kapitel seinen Charakter
  space.js                die Machine City entlang des Pfads: Rippen, Mainframe, Fasern, Streaks
  traffic.js              der übrige Verkehr: zweigt an Knoten ab, zerbirst an der Firewall
  props.js                Setpieces: Firewall, Routing-Wand, Monolith, Layer-Stack, Stadt, Raum
  assets.js               lädt die Blender-Sets (GLB + Anker)
  overlay/text.js         2D-Ebene: Traceroute, Syslog, HUD, Titel, Schlusskarte
  frame.js                der Held: ein Ethernet-Frame mit lesbaren Feldern
  core.js world.js        Mathe, Rauschen, Kamerapfade, Materialien, HDR-Post — generisch
  player.js serve.mjs     Browser-Player und statischer Server
  render.mjs              4 Zeilen, ruft ../../../../tools/render.mjs
src/tools/prepare.mjs     WAV → Analyse; sha256-Prüfung gegen das Transkript
```

## Die drei Regeln, die dieses Projekt tragen

**1. Jedes Bild ist eine reine Funktion von `t`.** Keine Zustandsakkumulation, keine Live-Audioanalyse.
Teilrenderings, Parallelläufe und Stills liefern identische Bilder. `film.js` ruft `zone.camera()`
pro Frame **zweimal** (einmal bei `t`, einmal bei `t + 1/FPS`, für die Geschwindigkeits-Aberration) —
eine Kamerafunktion darf deshalb keinen Zustand verändern.

**2. Nichts Gesungenes erscheint im Bild.** Das Transkript dieses Tracks besteht aus 54 gesungenen
Zeilen und sonst nichts — anders als bei `02-trustsec`, wo Systemmeldungen als eigene Segmente
darinstanden. Der Bildtext wird deshalb in `config.MESSAGES` **geschrieben**, nicht abgeleitet. Das
Transkript liefert nur Zeitanker. Es *kann* keine Lyric ins Bild rutschen, weil keine je als
anzeigbar markiert wird.

**3. Schnitte rasten auf gemessene Kicks, nicht auf das Raster.** Siehe unten.

## Der Flugpfad

`route.js` ist das Rückgrat der Bewegung. Die Route ist keine Gerade in Z, sondern eine Kurve mit
festen seitlichen Versätzen an jedem Hop. Daraus folgt dreierlei:

- **ein Hop ist ein Richtungswechsel** — der Frame fliegt in einen Knoten hinein und auf einer
  anderen Bahn wieder heraus, was ihn als Ereignis lesbar macht statt als vorbeiziehenden Ring;
- **der Frame rückt durchgehend vor**, mit einer stückweise linearen Abbildung von Zeit auf
  Bogenlänge, verankert an den Hop-Zeiten. Deshalb kommt die Welt entgegen, statt seitlich
  vorbeizuziehen — der Unterschied zwischen Fliegen und Stillstehen;
- **der Korridor folgt derselben Kurve**, weil `space.js` seine Rippen, Fasern und Mainframe-Blöcke
  entlang dieses Pfads aufbaut.

Die Versätze sind fest, nicht zufällig: Dieselbe Route muss in der Vorausberechnung des ersten
Chorus und im Final Chorus identisch aussehen (DREHBUCH.md §4.5).

Die Kamera reitet den Pfad mit und **umkreist** den Frame in der Ebene quer zur Fahrtrichtung.
Nur die Setpieces, die quer zur Route stehen (Firewall, Routing-Wände, Monolith), werden von hinten
den Korridor hinunter gerahmt — `MOOD[mode].view`.

## Das Tempo — warum hier anders gemessen wird

`02-trustsec` bestimmt das Tempo mit einem Comb-Filter. Auf diesem Track **versagt das**: der Sub-Bass
läuft durchgehend, jedes Kandidaten-Raster fängt eine ähnliche mittlere Energie ein, und die
Score-Kurve kommt flach heraus (bester Wert 0.294 gegen 0.283 auf Platz acht — kein Peak). Das Argmax
landete bei 143.5 BPM, zwölf BPM daneben.

Gemessen wird stattdessen per **Autokorrelation der Onset-Hüllkurve bei 100 Hz**. Dort gibt es einen
breiten, sauberen Fundamentalpeak mit Oberwellen bei 2× und 3×. Die Onset-Rate ist wesentlich: bei
400 Hz ist dieselbe ACF verrauscht (ein schmaler Spike bei 134 BPM zwischen negativen Nebenkeulen),
bei 100 und 200 Hz zeigt sie übereinstimmend denselben Peak.

Ergebnis: **131.746 BPM, beat0 0.3623 s**, ACF-Schärfe 0.858, Peakbreite 4.2 BPM.

Und daraus folgt die dritte Regel: die Peakbreite von 4.2 BPM und die gemessene Abweichung der Kicks
vom Raster (Median 44 ms, nur 35 % innerhalb von 30 ms) heissen, dass dieser Track **atmet**. Ein
konstantes Raster ist als Schnittwerkzeug zu ungenau. `snapShots()` rastet deshalb auf die nächste
**gemessene Kick-Onset-Zeit** (±160 ms) und fällt nur dort aufs Raster zurück, wo keine Kick in der
Nähe liegt. `GRID` in `config.js` bleibt für den Taktzähler und `bar()`, ist aber nur ein Richtwert.

## Der Held

Ein Ethernet-Frame, kein leuchtender Körper: ein langer flacher Block, der nasenvoran fliegt und in
seine echten Felder segmentiert ist — DST MAC, SRC MAC, 0800, IPv4, **TTL**, SRC IP, DST IP, TCP,
PAYLOAD, FCS. Darum drei verschachtelte Käfige für L2, L3 und L4.

Zwei Regeln, ohne die er nicht funktioniert:

- **Der Körper blendet normal, nicht additiv.** Additiv addiert er sich zum Hintergrund, der Bloom
  drückt ihn nach Weiss und die Feldbeschriftung verschwindet. Dunkle Zellen mit heller Schrift und
  leuchtenden Kanten ist die Fassung, die lesbar bleibt.
- **Die Kamera steht auf der Breitseite.** Stirnseitig kollabiert er zum Klumpen. `MOOD[mode].view`
  wählt zwischen `broadside` und dem Blick den Korridor hinunter (`down` / `back`); die Setpieces
  stehen quer zur Route und sind von der Breitseite unsichtbar.

## Stand

**Fassung «Starship» (5.10.2026):** Die Reise spielt im Weltraum (`zones/cosmos.js`): Warp-Sprünge mit Sternstreifen,
Cockpit-POV mit Syslog/Traceroute/TTL auf den Displays, Nebel, Raumstation, Gasriese, Sternentor (Firewall),
Ringplaneten, Pulsar (Kehre), massives Wurmloch mit Tunnel, 3-Sonnen-System, Zielplanet mit Lichtstrahl ins Fenster
und ein Raum im Morgenlicht als Ende. Alle Szenen laufen dort; `zones/cyber.js` bleibt im Code, wird aber nicht mehr
benutzt. Nach dem Laden rendert `main.js` einige Bilder vor (Shader und Display-Texturen), damit das erste Bild jedem
späteren Rendern desselben Zeitpunkts gleicht. Die Absätze unten beschreiben die frühere Korridor-Fassung.


Alle 16 Szenen und 58 Einstellungen laufen über die volle Länge, in der gebauten Welt: Korridor,
Datenwände, Fasern mit laufenden Pulsen, Skyline, Streaks, plus die sechs Setpieces. Traceroute-Aufbau,
TTL-Verlauf mit Kehre und Rückblenden-Tod, Farbumschlag, Raum am Ende, Schlusskarte.

**Alle acht Blender-Sets stehen** und sind eingebaut: `port-macro` und `switch-48p` bei Hop 1 und 8,
`router-core` an der Routing-Wand, `rack-aisle` beim Aufstieg und im Build, `city-block` dreifach
gekachelt für Stadt und Rückzug, `ap-ceiling` an der Funkstrecke, `office` und `laptop` im Finale.

Die Raumszenen werden aus den **Kamera-Ankern der Modelle** gerahmt (`office:cam.over`,
`laptop:cam.screen` …) statt aus der Korridor-Kamera — das ist der Grund, warum es die Anker gibt.
Der lebende Bildschirminhalt hängt als Kind am `laptop`-Set an dessen `screen`-Anker, also besitzt
das Modell die Platzierung und der Code nur die Animation.

**Noch offen:** Feinschliff der Materialien und die endgültigen Renderläufe.
`DREHBUCH.md` §6 hält fest, welche Module aus `public/globivonnairobi/tools/blender` übernommen
werden und welche nicht — und dass die dortige `BASIS`-Matrix wegfällt, weil sie für Babylons
Linkshänder-System X spiegelt, während Three.js wie glTF rechtshändig ist.

## Quellen im Musik-Repo

`music/kisound/Network-Engineer-Album01/09_Last_Hop/` — `09_Last_Hop_0.1-1.wav` (die Release-WAV,
**nicht** die MP3 in `xx_mp3/`: der sha256 im Transkript ist der Hash der WAV) und
`09_Last_Hop_Transkript.json`. `prepare.mjs` bricht ab, wenn der Hash nicht passt.
`09_Last_Hop_Video.md` im Track-Ordner ist der Zeiger zurück auf dieses Projekt.

<!-- global-kisound-render -->
## Globaler Videoexport: bestehende und neue Projekte

In jedem fertig eingerichteten Songordner (auch in dessen Unterordnern):

```sh
kisound-render 1080p
```

oder:

```sh
kisound-render 4k
```

Nur prüfen, ohne einen Render zu starten:

```sh
kisound-render 4k --check
```

Ein beliebiges Projekt von einem anderen Ordner aus wählen:

```sh
kisound-render 4k --project "/Pfad/zum/Video-Song" --check
```

Der globale Befehl braucht keine neuen npm-Einträge pro Song. Er findet den Projektordner
an `src/render/index.html` und `src/render/render.mjs`. Er übernimmt eine vorhandene
`render-export.json`; ohne diese Datei erkennt er genau eine Audiodatei in `assets/audio`.
Bei mehreren Fassungen muss die Quelle eindeutig gewählt werden:

```sh
kisound-render 4k --audio "assets/audio/finale.wav"
```

Die Quelle wird nicht geändert. Bildrate und Bildzahl stammen aus dem Film. Auflösungen:
1920 × 1080 oder 3840 × 2160. Standardmässig erhält jeder Export im Song-Unterordner `output/`
einen Zeitstempel sowie ein Log und einen JSON-Prüfbericht. Bestehende Dateien werden nicht
überschrieben. Optional sind `--out`, `--jobs`, `--encoder`, `--crf`, `--chrome` und `--temp-dir`.
Details: `kisound-render --help` und das zentrale `tools/export-video.mjs`.

Neue Projekte müssen die vorhandene kisound-Renderer-Schnittstelle verwenden: lokale
Node-Abhängigkeiten inklusive `puppeteer-core`, `#stage`-Canvas, `window.renderFrame`,
`window.FILM`, `window.__ready`/`window.__error`, sowie `FPS`, `FRAMES`, `DURATION` im
Timeline-Modul. Ein Ordner mit nur Analyse/Lyrics lässt sich noch nicht als Video rendern.
Abweichende Pfade und Titel/Interpret können in `render-export.json` konfiguriert werden.

Für vorhandene, bei der Einrichtung gefundene Projekte funktionieren zusätzlich
`npm run export:1080p`, `npm run export:4k` und `npm run export:check -- --resolution 4k`.
Bei künftigen Projekten direkt `kisound-render` verwenden oder die Einrichtung erneut starten,
um auch die optionalen npm-Kurzbefehle hinzuzufügen. Der globale Befehl ist eine zsh-Funktion;
neue Terminalfenster laden sie aus `.zshrc`. Das Einrichtungsprogramm zeigt den `source`-Befehl
für das bereits offene Terminal. Es startet selbst nie einen Videoexport.

<!-- kisound-render-checkpoints -->
### Wiederaufnahme nach einem Chrome-Abbruch

Der globale Export rendert standardmässig in Abschnitten von 20 Sekunden mit einem
Chrome-Prozess. Jeder Abschnitt wird geprüft und als Checkpoint gespeichert. Chrome
startet für jeden Abschnitt neu. Ein fehlgeschlagener Abschnitt wird bis zu zweimal
wiederholt. Bildnummern beziehen sich stets auf die gesamte Timeline.

Nach einem Abbruch den ausgegebenen Arbeitsordner verwenden, von jedem Ordner aus:

```sh
kisound-render --resume "/Pfad/zum/kisound-export-ABC123"
```

Optional zuerst `--check` ergänzen. Bei `--resume` weder `4k`/`1080p` noch neue
Renderparameter angeben: Einstellungen, Song und Ausgabe stammen aus dem Checkpoint.
Geprüfte Abschnitte werden übernommen; beschädigte Abschnitte werden erneut gerendert.
`--check` prüft Quellen/Einstellungen, aber decodiert keine Abschnitte.
Änderungen an Quellcode, Assets oder Renderer verhindern die Wiederaufnahme; dann einen
neuen Export starten. Während eines Exports die Projektdateien nicht bearbeiten.

Neue Exporte erlauben `--chunk-seconds 5..60` (Standard 20) und `--retries 0..5`
(Standard 2). `--jobs 1` ist nun für beide Auflösungen Standard. Beispiel:

```sh
kisound-render 4k --chunk-seconds 10
```

Fertige Abschnitte werden ohne erneute Bildcodierung zusammengefügt. Das Originalaudio
wird einmal vollständig eingebettet. Bildzahl, FPS, Auflösung, Audiodauer und vollständige
Videodecodierung werden vor der Ausgabe geprüft. Fehlerlogs enthalten Browser-Abbruch-
ereignisse, soweit Chrome diese noch meldet. Nach Erfolg wird der Arbeitsordner gelöscht,
mit `--keep-temp` bleibt er erhalten. Bei Fehlern bleibt er immer erhalten. Er kann gross
werden; `--temp-dir` wählt bei neuen Exporten einen anderen lokalen Datenträger.

Die Wiederaufnahme benötigt `checkpoint.json` aus dieser Version. Alte abgebrochene
Exporte ohne Checkpoint, beispielsweise `kisound-export-Rf2zLF`, müssen neu gestartet
werden. Ihre Dateien bleiben unberührt. Die Änderung verhindert nicht jede mögliche
GPU-/Chrome-Störung, begrenzt aber den verlorenen Fortschritt auf einen Abschnitt.

Neue Szenen müssen `renderFrame(n)` auch direkt mit beliebigen absoluten Bildnummern
aufrufen können. Animationen müssen aus der Zeit berechnet werden, ohne vom zuletzt
gerenderten Frame abzuhängen. Quellprüfsummen umfassen `src/`, `assets/`, Audio,
JSON-/Code-Dateien im Projektstamm (inklusive Audioanalyse), Konfiguration,
Paket-/Lockdateien sowie die gemeinsamen Renderer. Externe dynamische
Ressourcen oder manuelle Änderungen in `node_modules` sind damit nicht abgesichert.
<!-- /kisound-render-checkpoints -->
