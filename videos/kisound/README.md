# kisound – codebasierte Musikvideos

> **Gesamtzusammenhang, Vorgehen pro Stück und kisound.ch:** siehe [`PRODUKTION.md`](PRODUKTION.md).
> Dieses README beschreibt vor allem den MP4-Export.

Musikvideos zu den Tracks aus `../../music/kisound`. Den Ton liefert jeweils die fertige Audiodatei aus dem
Musikbereich, der Code erzeugt nur das Bild. Die Technik stammt aus einem frueheren Filmprojekt desselben Autors.

| Ordner | Video |
|---|---|
| `Network-Engineer-Album02/02-trustsec/` | Bestehende historische Umsetzung „Cisco TrustSec“ (aktuell Track 03; 4:48, 60 fps) |
| [`Network-Engineer-Album02/`](Network-Engineer-Album02/README.md) | Acht aktuelle Trackordner mit Audioanalysen; neue Videoumsetzung folgt separat |

`tools/render.mjs` ist der gemeinsame frame-genaue Renderer: Rohframes aus Headless Chrome direkt in ffmpeg
(VideoToolbox, x264 oder ProRes). Er ist aus jenem Projekt uebernommen. Jedes Video ruft ihn über
`src/render/render.mjs` auf.

Die Ordnerstruktur spiegelt das Musik-Repository: `<Album>/<NN-track>/`.

## Gemeinsamer Export: 1080p und 4K

`tools/export-video.mjs` ist der wiederverwendbare Export-Einstieg für die codebasierten Songs.
Es ruft den bestehenden Renderer auf, bettet danach das Originalaudio als AAC ein und prüft
Auflösung, Bildrate, Bildzahl und Audiodauer. Alle Schritte laufen lokal.

Für WiFi Roaming sind die Song-Konfiguration und `npm`-Befehle bereits eingerichtet. Im Songordner:

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album01/05_WiFi_Roaming"
```

Full HD starten:

```sh
npm run export:1080p
```

Oder 4K UHD starten:

```sh
npm run export:4k
```

Diese Befehle **starten den vollständigen Videoexport**. Der Browserplayer muss nicht offen sein.
Die Bildrate stammt aus dem Film; bei WiFi Roaming sind es 60 fps. Die Auflösungen sind
1920 × 1080 beziehungsweise 3840 × 2160; 4K wird direkt in dieser Auflösung gerendert.

### Erst prüfen, ohne zu rendern

```sh
npm run export:check -- --resolution 1080p
npm run export:check -- --resolution 4k
```

Der Prüfmodus kontrolliert die lokalen Dateien, Chrome, Puppeteer, FFmpeg-Encoder und das
Verhältnis von Film- und Audiodauer. Er startet keinen Browser, codiert kein Video und legt keine
Exportdateien an. Die tatsächliche GPU-Funktion und Bildgestaltung prüft er nicht.

### Ausgabe und Einstellungen

Das Skript erzeugt im `output`-Ordner des Songs beispielsweise:

```text
05_WiFi_Roaming_1080p60_<UTC-Zeitstempel>.mp4
05_WiFi_Roaming_1080p60_<UTC-Zeitstempel>.mp4.log
05_WiFi_Roaming_1080p60_<UTC-Zeitstempel>.mp4.json
```

Die MP4 enthält H.264-Bild und AAC-Ton mit 320 kbit/s und 48 kHz. Die Originalaudiodatei bleibt
unverändert; der Exportton ist AAC-komprimiert. Die JSON-Datei enthält die technischen Prüfwerte
sowie SHA-256 von Audioquelle und Export. Diese Metadatenprüfung ersetzt keine vollständige
visuelle Kontrolle oder Decodierprüfung. Bereits vorhandene Zieldateien werden nicht überschrieben.

Ein bestimmter Dateiname, relativ zum Songordner:

```sh
npm run export:4k -- --out "output/WiFi_Roaming_V3_4K.mp4"
```

Auf macOS ist VideoToolbox (`vt`) der Standard. 1080p nutzt standardmässig zwei Prozesse,
4K einen Prozess, um Speicher und temporäre Daten zu begrenzen. Optional:

```sh
npm run export:4k -- --jobs 2 --quality 90
```

Bei mehreren Prozessen entstehen ProRes-Zwischenfilme; dafür muss viel freier lokaler
Speicher vorhanden sein. Der Qualitätswert betrifft den VideoToolbox-Encoder, keine Bitrate.
Für CPU-Encoding mit x264:

```sh
npm run export:4k -- --encoder x264 --jobs 1 --crf 14 --preset slow
```

Ein kleinerer CRF-Wert erhöht in der Regel Qualität und Dateigrösse. Standardwerte sind CRF 16
bei 1080p und CRF 14 bei 4K. Die Render-Bildzahl wird vollständig übernommen; beim Einbetten des
Tons wird bewusst kein `-shortest` verwendet, damit das letzte Videobild nicht verloren geht.

Temporäre Dateien liegen standardmässig im lokalen System-Temp und werden nach Erfolg gelöscht.
Ein anderer bereits vorhandener Arbeitsordner lässt sich wählen:

```sh
npm run export:4k -- --temp-dir "/Volumes/RenderSSD/kisound-temp"
```

Mit `--keep-temp` bleiben Arbeitsdateien auch nach Erfolg erhalten. `Ctrl+C` bricht ab; bei einem
Fehler bleiben Log und Arbeitsordner zur Diagnose erhalten. Das Skript nennt den Pfad. Solche
Arbeitsordner können nach der Diagnose manuell gelöscht werden. Ein neuer Start rendert erneut
von Anfang an; es gibt keine automatische Fortsetzung ab dem letzten Frame.

### Für einen weiteren Song verwenden

Der Song benötigt die bestehende kisound-Renderstruktur:

- `src/render/index.html`, `#stage` mit den Canvas-Ebenen, `window.renderFrame(frame)`,
  `window.FILM` und `window.__ready`/`window.__error`.
- `src/render/config.js` mit den Exporten `FPS`, `FRAMES` und `DURATION`.
- `src/render/render.mjs` als Einstieg in den gemeinsamen Renderer.
- Lokale Projektabhängigkeiten, insbesondere `puppeteer-core`, und das fertig vorbereitete Audio.

Im Songordner eine `render-export.json` anlegen und die tatsächlichen Namen einsetzen:

```json
{
  "schema": "kisound.render-export.v1",
  "outputName": "09_Last_Hop",
  "title": "Last Hop",
  "artist": "Samuel Heinrich",
  "audio": "assets/audio/lasthop.wav",
  "timelineModule": "src/render/config.js",
  "renderer": "src/render/render.mjs"
}
```

`outputName` darf Buchstaben, Ziffern, Unterstriche und Bindestriche enthalten. Audio, Timeline
und Renderer werden relativ zum Songordner aufgelöst. `title` und `artist` sind MP4-Metadaten;
sie verändern keine Titel im Bild. Bei abweichender Ordnerstruktur die drei Pfade anpassen.
Die vorhandenen Referenzprojekte wurden durch die Einrichtung dieses Skripts nicht geändert.

Vom `kisound`-Videostamm aus zuerst prüfen:

```sh
node tools/export-video.mjs --project "Network-Engineer-Album01/09-last-hop" --resolution 4k --check
```

Nach Vorbereitung und eigener Freigabe exportieren:

```sh
node tools/export-video.mjs --project "Network-Engineer-Album01/09-last-hop" --resolution 4k
```

Für die gleiche `npm`-Bedienung können Songs zwei Ebenen unter diesem Stamm folgende Einträge
in ihre `package.json` übernehmen:

```json
{
  "scripts": {
    "export:1080p": "node ../../tools/export-video.mjs --resolution 1080p",
    "export:4k": "node ../../tools/export-video.mjs --resolution 4k",
    "export:check": "node ../../tools/export-video.mjs --check"
  }
}
```

Voraussetzungen: Node.js 20 oder neuer, `ffmpeg` und `ffprobe` im PATH, Google Chrome und die
installierten Song-Abhängigkeiten. Für WiFi Roaming sind sie lokal vorhanden; das Exportskript
installiert nichts. Bei anderem Chrome-Pfad `--chrome "/Pfad/zu/Chrome"` oder `CHROME_PATH`
verwenden. Parallele ProRes-Jobs und VideoToolbox sind auf macOS ausgelegt; für andere Systeme
`--encoder x264 --jobs 1` und den passenden Chrome-Pfad wählen.

Hilfe und Tests des gemeinsamen Einstiegsskripts:

```sh
node tools/export-video.mjs --help
node --test tools/tests/export-video.test.mjs
```

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

<!-- kisound-web -->
## Web-Schnittstelle (kisound.ch)

Die Website wird in `../../web/kisound` gebaut (siehe dortiges README). Sie liest
aus diesem Ordner die ASTRA-Analysen aller Tracks und bündelt freigeschaltete Videoprojekte als
interaktive Webseite. Dafür braucht ein Projekt in `src/render/main.js` nur eine kleine Schnittstelle;
lokal ändert sich dadurch nichts:

```js
const PAGE=window.KISOUND_PAGE||{},q=new URLSearchParams(location.search),isPlayer=!q.has('w'),RES=[540,720,1080];
const wanted=Number(q.get('res')||PAGE.defaultRes||1080),height=isPlayer?(RES.includes(wanted)?wanted:1080):Number(q.get('h')||540);
// …
const res=await fetch(PAGE.analysis||'/ASTRA-AUDIO-ANALYSE.json');
```

Beim Bündeln ersetzt der Web-Build `./player.js` durch den öffentlichen Player und liest `FPS`,
`DURATION`, `CHAPTERS` aus `src/render/config.js`. `startPlayer({film,width,height,initialTime})` und
`film.render(t)`, `film.tl` (Kapitel, 100-ms-Zeilen) und `film.debug` bilden den Vertrag. Umgesetzt in
`Network-Engineer-Album01/06_Multicast`. Ordner, Analysen oder `config.js` nicht umbenennen, ohne
`web/kisound/site.config.json` anzupassen.
<!-- /kisound-web -->
