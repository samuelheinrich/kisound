# Network Engineers · Browservorschau

Vollständiges codebasiertes Musikvideo zu Track 00: eine Nachtcrew hält eine Stadt erreichbar.
Zwölf Kapitel, 32 Einstellungen, vier 3D-Welten und unverändertes Originalaudio.
Neben der interaktiven Browserfassung steht ein Export für 1080p mit 60 fps bereit.

Die genaue Montage steht in [UMSETZUNG-CUES.md](UMSETZUNG-CUES.md), der geprüfte Stand in
[ABNAHME.md](ABNAHME.md).

## Starten

Voraussetzungen: Node.js mit npm und ein aktueller Chrome mit WebGL2. Die Entwicklung wurde mit
Node 26.10.0, Three.js 0.180.0 und Puppeteer Core 24.43.1 geprüft. Abhängigkeiten sind im Lockfile fixiert.

```sh
npm ci
npm run preview
```

`npm ci` führt automatisch das lokale `prepare`-Skript aus. Es prüft die Quelle und kopiert WAV und
gemeinsame 3D-Sets. Bereits installierte Projekte können `npm run prepare` separat ausführen.
Die Schriften samt OFL-Lizenzen liegen im Projekt. Es gibt keine CDN-Imports und keine Audio-Uploads.

Standardadresse: **http://127.0.0.1:8126/**. Der Befehl öffnet Google Chrome und lässt den Server laufen.
Wiedergabe mit der Play-Taste starten; zum Beenden des Servers im Terminal `Ctrl+C` drücken.
Alternativer Port: `npm run preview -- 8127`. Ohne automatisches Öffnen: `npm run serve`.

- `/?res=720` / `/?res=1080`: Vorschauauflösung, standardmässig 1080p.
- `/?t=178.6&debug=1`: an einer Stelle starten und Cue-Diagnose anzeigen.
- `/?w=1920&h=1080&t=80`: deterministisches Einzelbild ohne Player.
- `preview` öffnet weiterhin nur den Browser. `npm run export:1080p` erzeugt das MP4.

## Export und Titelfassung

```sh
npm run export:1080p
npm run check:export
```

Ausgabe: `output/00_Network_Engineers_1080p60.mp4`, 1920 × 1080, 60 fps, H.264 (VideoToolbox,
Qualität 85), BT.709 und AAC-Stereo mit 320 kbit/s. Vier lokale Renderprozesse erzeugen temporäre
ProRes-Abschnitte, die anschliessend zusammengefügt und einmal nach H.264 kodiert werden.
Der gemeinsame lokale Renderer komponiert
WebGL und Textcanvas bildgenau; die Quelle für die Tonspur bleibt das unveränderte WAV.
AAC ist die komprimierte Exportfassung. Die MP4-Bildspur kann durch das feste 60-fps-Raster bis
zum nächsten vollständigen Frame reichen (207,533333 s); die Originalaudiozeit bleibt unverändert.
`check:export` prüft Format, Bildanzahl und Dauer, dekodiert sämtliche Bild- und Audiodaten und
erstellt `output/export-manifest.json` mit Prüfsummen. Einzelbilder aus der tatsächlichen MP4-Datei
landen unter `output/export-check/`.

Die weissen Kopfaufsätze wurden bei allen Figuren entfernt. Der Anfangstitel erscheint von 0,65 bis
8,4 s; der Schlusstext ab 198,6 s. Beide zeigen «NETWORK ENGINEERS» und «SAMUEL HEINRICH».
Am Ende bleiben Stadt und Datenbewegung aktiv; Bild und Text blenden gemeinsam erst ab 206,1 s aus.

Die breite geometrische Schrift **Michroma** ähnelt der Covertypografie. Weiss-/Cyan-Verläufe,
weite Namensspationierung und zwei bernsteinfarbene Linien greifen die Covergestaltung auf.
Schriftquelle: [Google Fonts / Michroma](https://github.com/google/fonts/tree/main/ofl/michroma),
lokal eingebunden mit SIL-OFL-Lizenz unter `assets/fonts/OFL-Michroma.txt`.

## Bedienung

| Bedienung | Wirkung |
| --- | --- |
| Leertaste | Play/Pause |
| Links/Rechts | Eine Sekunde zurück/vor |
| Shift + Links/Rechts | Ein Bild auf dem 60-fps-Raster |
| Home / End | Originalanfang / exaktes Audioende |
| 1–9 | Kapitel 1–9; alle zwölf Kapitel sind im Auswahlfeld verfügbar |
| L / M / F / D | Schleife / Stumm / Vollbild / Cue-Diagnose |
| Zeitleiste | Scrubbing; zeigt den gemessenen RMS-Verlauf und Kapitelmarken |

Geschwindigkeit: 0.25×, 0.5× oder 1×; Lautstärke ist regelbar. Der Auflösungswechsel erhält die
Abspielposition und pausiert. Stille Dateien werden nicht ersatzweise abgespielt: fehlendes oder
unpassendes Audio führt zu einer sichtbaren Fehlermeldung. Die Schleife ist zunächst ausgeschaltet.

## Quellen und unveränderte Grundlagen

- Audio: `00_Network_Engineers_0.4-1.wav`, 48 kHz, Stereo, 9 960 968 Samples pro Kanal.
- SHA-256: `f898d546962be52a08ffac6af68f08f550975de15956fe06c4a9e8c6b33dd5b5`.
- Dauer: **207,520166667 s**. Zeitnull ist der Anfang der Originaldatei.
- Die finale WAV ist im vorhandenen Musikprompt als Release Audio bezeichnet.
- Transkript-SHA-256: `433578173207120bd02923f642dec6cd6b2d4c601fe07931eb3db150ec973fa6`.
- Messgrundlage: `ASTRA-AUDIO-ANALYSE.json`, Schema `astra.audio.analysis.v1`.
- Dramaturgische Grundlage: `ASTRA-DREHBUCH.md`; redaktionelle Präzisierungen sind unten erklärt.

Das Vorbereitungsskript sucht die Musik im parallelen `music/kisound`-Repository. Bei einer anderen
Installation kann `NETWORK_ENGINEERS_SOURCE` auf den Trackordner zeigen. Die Prüfsummen müssen
weiterhin passen. `assets/manifest.json` dokumentiert Audio, Transkript, Analyse und GLB-Herkunft.
Originaldateien, ASTRA-Ergebnisse, gemeinsame Sets und Referenzprojekte werden nicht überschrieben.
Es werden keine `.bak`-Serien erstellt.

## Architektur

- `src/render/config.js`: Kapitel, Einstellungen, Event- und Lyric-Zuordnungen, kreative Aktionen.
- `timeline.js`: Adapter für die bestehende Analyse; Abtastung, Hüllkurven und erzählerischer Netzzustand.
- `film.js`: Szenenwahl, Kamera, Nachbearbeitung und ausschliesslich redaktionelle Systemanzeigen.
- `zones/`: Leitwarte und Nutzersicht, Stadt, Hardware, räumliche Topologie.
- `world.js`: Geometrie, stilisierte Figuren, Bildschirmtexturen und unabhängig geklonte Materialien.
- `assets.js`: SetLibrary aus dem Last-Hop-Projekt; GLB-Geometrie und benannte Anker.
- `main.js`, `player.js`, `serve.mjs`: Laden, Browserplayer und lokaler Server.
- `src/tools/prepare.mjs`: geprüfte lokale Zuordnung der Quellen und gemeinsame Assets.

Die Architektur folgt TrustSec und Last Hop. Geometrie stammt teilweise aus der gemeinsamen
Blender-Pipeline: Büro, Laptop, Stadtblock, Rack, Switch, Router und Access Point. Die Quellen der
einzelnen Modelle stehen im Manifest. Kamera, Beleuchtung, Animation und Montage laufen in Three.js.
Die gemeinsamen Werkzeuge und beide Referenzfilme wurden nicht geändert.

### Öffentliche Vorschau-Schnittstellen

```js
window.renderTime(178.6);       // Absolute Originalaudiozeit; liefert Bildzustand
window.renderFrame(10716);     // Frame / 60, anschliessend GPU-Synchronisation
window.FILM;                   // { FPS, FRAMES, W, H, DURATION }
window.__ready;                // Alle Assets geladen, Player gegebenenfalls bereit
window.__error;                // Fehler beim Laden, sonst undefined
window.player.seek(132.16);    // Nur im Player: Ton und Bild zusammen positionieren
```

Die Originaldauer wird nicht auf ganze Sekunden aufgerundet. 60 fps ergeben 12 452 mögliche Bilder;
das letzte Rasterbild liegt bei 207,516667 s. Der Player kann zusätzlich das exakte Endbild zeigen.

### Audioabhängige Bewegung

`Timeline.sample(t)` interpoliert anhand der gespeicherten **Fenstermitten**, einschliesslich des
letzten kürzeren Fensters. Das JSON wird nicht in ein vermeintliches 60-fps-Audioraster umgedeutet.
Die sieben Band-Drives sind bereits je Band am 95. Perzentil normiert und mit dem RMS-Gate der
Analyse versehen. Nur diese Animationswerte erhalten einen vorab berechneten, vorwärts/rückwärts
angewendeten Tiefpass mit 100 ms Zeitkonstante. Messwerte selbst bleiben unverändert.

- Bass: Intensität der städtischen Lichtverbindungen.
- Mitten: Leitwartenlicht und Fensterintensität.
- Präsenz: Grösse der kleinen Verkehrspunkte.
- Höhen: sparsame Bloom-Modulation und abstrahierte Funkringe.
- Kuratierte Transienten: einzelne Lichtakzente oder Kameraschnitte; keine Instrumentenbehauptung.
- Energie- und Abschnitts-Cues: Szenenöffnung, Wechsel der Perspektive und finale Kranfahrt.

`event(id)` und `lyric(id)` behalten die vorhandenen Quellen und Unsicherheiten bei. Impulse werden
analytisch als Funktion der Zeit seit einem Cue berechnet; es gibt keine zustandsabhängigen
Einmal-Trigger. Alle Bewegungen, Partikelpositionen und Kameras sind reine Funktionen der Zeit.
Zufall verwendet einen festen Seed. Keine Live-FFT, Physiksimulation oder frameweise Integration.

Die gemessenen Onsets werden nicht als «Kicks» bezeichnet. Die 126 BPM haben mittlere Sicherheit;
das optionale `beat(t)` ist ausdrücklich synthetisch. Es steuert keine Schnitte. Eine Taktart wird
nicht behauptet und der Player zeigt keine abgeleiteten Taktzahlen.

## Redaktionelle Präzisierungen

1. Die Referenzprojekte verwenden 60 fps. Diese Umsetzung ersetzt damit die 30-fps-Empfehlung des Drehbuchs.
2. Szene 3 zeigt zuerst den vorbereiteten Reservepfad; bei «main path cracks» folgt die Störung.
   Die Crew korreliert Meldungen und bestätigt die Erreichbarkeit. Nach der Wiederherstellung
   tragen alternative Verbindungen den Verkehr; die spätere Topologieszene prüft dessen Stabilität.
3. Szene 8 ist die zweite Strophe mit dem Wechsel zwischen Nutzersicht und Leitwarte.
4. Die letzte Gesangszeile endet bei 163,18 s. Bis zum Audioende verbleiben 44,340167 s aktive Musik.
5. E038 bei 201,6 s ist nur ein Fade-Kandidat. Die RMS-Werte bleiben danach hoch, beispielsweise
   −11,13 dBFS bei 205,05 s. E038 wird deshalb nicht für die Schlussblende verwendet.
   Die Blende beginnt redaktionell an E040 bei 206,1 s und endet exakt mit dem Audio.
6. Gesungene Texte erscheinen nicht als Untertitel im Bild. Neben Titel und Urheberangabe sind
   sichtbare Texte knappe Systemanzeigen; Zahlen aus der Audioanalyse werden nicht als
   Netzwerk-Telemetrie ausgegeben.

Der Lichtfaden und die Funkringe sind Metaphern. Ein Alarm ist keine Ursache; Failover setzt einen
vorhandenen Alternativpfad voraus. Der defekte Primärpfad bleibt isoliert. Verlorene Pakete werden
nicht rückwirkend wiederhergestellt. Figuren sind bewusst abstrahiert, ohne Lippenanimation.

Keine Firmenwerbung, keine Logos und kein sichtbares ASTRA-Branding.

## Prüfungen und Grenzen

```sh
npm run check
npm run check:browser
```

Die Node-Tests prüfen Quellenidentität, genaue Dauer, vollständige Schnittabdeckung,
Cue-Zuordnung, Interpolation, deterministische Zustände und späte Schlussblende.
Der Browsertest verwendet lokal installiertes Chrome; ein anderer Pfad lässt sich mit `CHROME_PATH`
angeben. Er prüft alle Sekunden der Timeline und Schnittgrenzen, Pixelgleichheit nach beliebigen
Zeitsprüngen sowie Play/Pause, Scrubbing, Einzelbilder, Kapitel, Rate, Mute, Schleife, exaktes Ende
und Auflösungswechsel. Ergebnisse und Standbilder stehen unter `output/qa/`.

Die dort gemessenen Millisekunden pro Bild sind lokale Headless-Chrome-Stichproben mit
GPU-Synchronisation, keine garantierten Wiedergabe-fps auf jedem Rechner. Der Player zeigt seine
tatsächliche Bildrate. Für schwächere Hardware steht 720p bereit.

Die Gesangszeiten bleiben automatische, lokal gegengeprüfte Transkriptzeiten. Diese Umsetzung
behauptet keine zusätzliche menschliche Hörverifizierung. Die technische Prüfung des
AudioPlayers kann das Gehör des Nutzers bei der finalen Regiebeurteilung nicht ersetzen.

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
