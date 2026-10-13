# Network Engineer 02 · Track 03 „Cisco TrustSec“ – Musikvideo

Codebasiertes Musikvideo (Three.js, 16:9, 60 fps, 4:48) zum fertigen Track aus Tad.ai. Den Ton erzeugt dieses Projekt
nicht, es nimmt das MP3 aus dem Musik-Repository. Das technische Gerüst stammt aus einem früheren Filmprojekt: Zonen,
Shot-Liste, HDR-Nachbearbeitung, Live-Player und frame-genauer Renderer.

**Stand:** Phase 3, alle Szenen gebaut. Sechs 3D-Zonen tragen 42 Shots. Die Schnitte liegen auf den Vokaleinsätzen
oder exakt auf den Drops. Der Animatic-Modus bleibt als Werkzeug erhalten: `?animatic=1` blendet die Shot-Karte ein.

## Quelle: das Musik-Repository

```
0004_git/music/kisound/Network-Engineer-Album02/03_TrustSec/
  03_TrustSec_0.1.mp3             Audio (Master-Uhr des Films)
  03_TrustSec_Transkript.json    Zeitgenaues Transkript mit Abschnitten und sha256 der MP3
```

`npm run prepare-audio` liest beide Dateien und erzeugt daraus die abgeleiteten Dateien (git-ignoriert):

| Datei | Inhalt |
|---|---|
| `assets/audio/trustsec.wav` | dekodiertes MP3, 48 kHz – Ton für Player und Render |
| `assets/audio/analysis.json` | Tempo (140,3 BPM), Taktraster, Kick-Zeitpunkte, Hüllkurven pro Frame (gesamt / Bass / Höhen) |
| `assets/lyrics/transcript.json` | Kopie des Transkripts |

Das Skript bricht ab, wenn der sha256 im Transkript nicht zur MP3 passt, also wenn nur eine der beiden Dateien
erneuert wurde. Nach jeder Änderung an MP3 oder Transkript das Skript erneut ausführen. Die Analyse wird einmal
vorab berechnet und nicht live im Browser. Damit bleibt jeder Frame eine reine Funktion der Zeit.

## Starten

```bash
npm install
npm run prepare-audio
npm run serve          # Live-Player mit Ton: http://127.0.0.1:8124/
```

Player-Tasten: Leertaste Play/Pause · ←/→ ±1 s (mit Shift: 1 Frame) · 1–9 Kapitel · L Loop · M Ton · F Vollbild.
URL-Optionen: `?res=720|1080|1440` · `?animatic=1` blendet die Shot-Karte mit Zeit, Takt und Szenenbeschreibung ein.

Rendern (erst nach Freigabe):

| Befehl | Ergebnis | Dauer (M3) |
|---|---|---|
| `npm run stills` | Standbilder in `output/stills/` | Sekunden |
| `npm run poster` | Posterbild `output/still_219.60s_1920x1080.png` (Final Hook) | Sekunden |
| `npm run preview` | 1080p60, VideoToolbox, Bewegungsunschärfe 4× | ca. 33 min (gemessen 8,8 fps auf M3) |
| `npm run final` | 2160p60, x264 slow, Bewegungsunschärfe 8× | mehrere Stunden (geschätzt 4–6 h) |

## Ablieferung

Das fertige MP4 gehört nach `music/kisound/Network-Engineer-Album02/xx_youtube/` (dort git-ignoriert, wie alle
`xx_*`-Ordner). Es ersetzt für diesen Track das Cover-Video aus `script/build_album_videos.rb`; Titel, Beschreibung
und Kapitel kommen weiterhin aus `album.yml` über `script/build_youtube_metadata.rb`. Die Untertitel lassen sich aus
`03_TrustSec_Transkript.srt` im Musik-Repo hochladen.

## Text im Bild: nur die Computerstimme

Gesungene Zeilen (deutsche Strophen und Hook) erscheinen nie im Bild. `timeline.js → classify()` ordnet jedes
Transkript-Segment einer Art zu:

- `title`: „Cisco TrustSec.“ wird zum grossen Titel, der sich aus Hex-Zeichen dekodiert.
- `system`: englische Statusmeldungen werden zu IOS-artigen Logzeilen unten links, z. B.
  `02:52.10  %ISE-4-QUERY: Who are you?`. Die Zeilen tippen sich synchron zur Stimme, Farbe nach Status
  (permit grün, deny rot, Frage gelb).
- `hook`, `lyric`: nicht sichtbar.

Anpassungen in `config.js`: `KIND_OVERRIDES` ändert die Einteilung pro Segment-ID, `TEXT_FIX` korrigiert
Transkriptionsfehler, `LOG_TAGS` legt die Syslog-Tags fest. Korrigiert: Segment 83 lautet im Transkript
„Access defined.“ (4:05.6), gesungen wird „Access denied.“ (nachgehört, in `TEXT_FIX` eingetragen).

## Storyboard

Die Shot-Liste steht in `config.js` (`SHOTS`). Vokal-geführte Grenzen rasten beim Laden auf den nächsten Beat ein
(`snapShots`). Die Drops sind mit `bar(n)` exakt auf Taktgrenzen gesetzt: 0:29.18, 1:10.23, 2:04.97, 3:37.35 und das
Finale ab 4:33.80. Der Einschlag in Hook 2 sitzt einen Takt nach dem Schnitt, auf Takt 75 (2:06.68). Die Taktgrenzen stammen aus dem gemessenen Raster (`GRID`: 140,298 BPM, beat0 0,0962 s).
`prepare-audio` warnt, wenn eine neue Messung davon abweicht.

| Zeit | Szene (Zone · Modus) | Bild |
|---|---|---|
| 0:00–0:08 | switch · intro | Dunkles Rack, eine LED wartet amber, Titel dekodiert sich |
| 0:08–0:12 | switch · connect | Stecker rastet auf dem Beat in Port 7, Link-LED grün, EAPOL-Puls |
| 0:12–0:27 | ise · request / scan / card | Puls zum Monolithen, Scan-Ringe, frontal bei „Who are you?“, ID-Karte Zeile für Zeile |
| 0:27–0:29 | closeup · tag | SGT-Band schwebt und schnappt exakt auf den ersten Drop |
| 0:29–0:41 | fabric · launch | Tiefflug durch Rack-Canyons |
| 0:41–0:55 | ise · triangle / profile | 802.1X: Supplicant – Authenticator – Policy Server. Das EAP-TLS-Zertifikat erscheint beim Client, reist über RADIUS zum Server, wird dort gescannt; der Access-Accept färbt Port und Gerät grün und setzt das SGT-Band. Danach rastet das Profil ein |
| 0:55–1:10 | closeup · ip / stamps | IP rattert, SGT bleibt; vier Siegel mit Schockwellen, Rückzug in den Drop |
| 1:10–1:30 | closeup · hook, fabric · devices, matrix · teaser | Hook-Tunnel, vier Geräte bekommen ihre Farbe, Matrix-Vorschau |
| 1:30–1:52 | fabric · groups, closeup · inline, fabric · islands | Inseln steigen auf, Frame mit CMD/SGT, Brücke mit Policy-Checkpoints |
| 1:52–2:05 | matrix · permit | Zeile → Spalte → Zelle → Gate öffnet |
| 2:05–2:26 | closeup · hook (Einschlag 2:06.68), fabric · flow, matrix · traffic | Verkehr sortiert sich bei „Identität bestimmt den Ort“ nach Farbe |
| 2:26–2:52 | ise · unknown, matrix · nomatch / deny | Farbe weicht, Scan-Ringe brechen, Unknown zerschellt am roten Gate |
| 2:52–3:06 | ise · dialog, switch · outside | Verhör mit Glitch, Abstoss bei „Access denied“, Port 19 rot |
| 3:06–3:29 | ise · known, fabric · return, matrix · gate | Farbe kehrt zurück, Route leuchtet, IP bleibt am Gate zurück |
| 3:29–3:37 | overview · build | Status-Panel, Kamera steigt |
| 3:37–4:10 | overview · final / deny | Das Netz zündet, Flows nur entlang erlaubter Paare, Unknown prallt zweimal ab |
| 4:10–4:27 | fabric · victory, matrix · allgreen | Siegesrunde, Matrix schaltet sich kaskadiert ein |
| 4:27–4:34 | closeup · title | Paket allein im Dunkeln, Titel |
| 4:34–4:44 | Montage, 1 Schnitt pro Takt | Hook, Flug, Matrix, ISE, Switch, Rückzug über das Netz |
| 4:44–4:48 | void | Musik stoppt, Endcard auf Schwarz |

**Szenen-Beschriftungen** (SGT-Nummern, Frame-Felder, Gruppennamen, Portnummern) sind Bildelemente wie die
Portnummern in film3, keine Lyrics.

**Farben:** Jede Security Group hat eine Farbe (Employee Cyan, Server Amber, Printer Pink, Phone Violett, Unknown
Grau). Grün und Rot sind reserviert für permit und deny.

**Blitze:** Nur an `dive`-Schnitten, nie im Beat-Takt und nie vollflächig rot. Die Kick moduliert Helligkeit und
Grösse, erzeugt aber keine Stroboskop-Effekte.

**Marken:** „Cisco TrustSec“ erscheint nur als Schrift, es gibt keine Hersteller-Logos.

**Kameraachse in der ISE-Kammer:** Alle Nahaufnahmen am Podest (Scan, ID-Karte, Profil, Unknown, Verhör-Antwort,
Rückkehr) stehen auf der Seite des Monolithen und blicken von ihm weg. Wir sehen die Prüfung also durch das Auge des
Policy Servers, und der Monolith steht nie als helle Fläche hinter dem Client. Der Turm selbst erscheint nur in den
weiten Einstellungen (Anflug, 802.1X-Dreieck, Verhör-Totale), wo er mit Sockel und Auge als Bauwerk lesbar ist. Die
ID-Karte ist entsprechend zur ISE-Seite gedreht. Wer eine dieser Kameras verschiebt, prüft das mit, sonst kehrt der
Rahmen zurück.

**Lesbarkeit von Beschriftungen:** Knotennamen stehen auf Bodenhöhe unter ihrem Knoten, Protokollnamen neben ihrem
Strahl. Alle Beschriftungen im 802.1X-Bild drehen sich pro Frame zur Kamera (`lookAt`), damit kein Text schräg oder
von einem Strahl durchschnitten steht. Die Zeiten des 802.1X-Ablaufs stehen zentral in `IseZone.triTimes()`.

## Architektur

```
src/tools/prepare.mjs   MP3 + Transkript aus dem Musik-Repo → WAV, Analyse, Transkript-Kopie
src/render/
  config.js       FPS, Dauer, Palette, SHOTS, Kapitel, Text-Regeln, Übergänge
  timeline.js     Transkript-Einteilung, Taktraster, Kick-Puls, Hüllkurven, Beat-Snapping der Shots
  film.js         Orchestrator: Shot → Zone → Kamera → HDR-Post → Text-Layer; Bewegungsunschärfe per Subframes
  overlay/text.js Logzeilen, Titel, Endcard, Animatic-Karte (2D-Canvas über WebGL)
  world.js        gemeinsame Bausteine: 3D-Text, Glow-Ringe/-Röhren, Gerätesilhouetten, Bodengitter, Rauschen
  packet.js       das Paket (aus film3) + SGT-Band + IP-Label
  zones/
    switch.js     Access-Switch im Rack (cm): Ports, LEDs, Patchkabel, Stecker
    ise.js        ISE-Kammer: Monolith, Scan-Ringe, ID-Karte, 802.1X-Dreieck mit EAP-TLS-Zertifikat, Verhör
    closeup.js    Nahaufnahme Paket: Tag-Snap, IP-Scramble, Stempel, Hook-Tunnel, Inline-Frame, Titel
    fabric.js     Endlose Fabric: Bahnen-Shader, Rack-Türme (instanziert), Flüge, Inseln, Brücke
    matrix.js     SGACL-Matrix 5×5 + Egress-Gate, Policy aus config.js (POLICY)
    overview.js   Totale: Core, vier Inseln, erlaubte Flows, Perimeter, Status-Panel
    sketch.js     Animatic-Bühne für neue Shots ohne eigene Zone
  core.js player.js serve.mjs    aus dem früheren Filmprojekt übernommen (Post um Glitch und Sättigung erweitert)
  render.mjs      Wrapper für ../../tools/render.mjs (gemeinsamer Renderer aller kisound-Videos)
assets/fonts/     JetBrains Mono (Logs) und Space Grotesk (Titel), beide SIL OFL 1.1 – Lizenzen daneben
```

**Neue Zone:** Die Zone `zones/<name>.js` braucht `update(t, shot, tl, index)` und `camera(shot, tl, index)`. Sie wird
in `film.js` registriert, danach in `SHOTS` bei den passenden Shots `zone: '<name>'` eintragen. Beat-Kopplung läuft
über `timeline.kick(t)`, `timeline.beat(t)` und `timeline.env('low'|'rms'|'high', t)`. Ereignisse an die Stimme
koppeln geht mit `timeline.seg(id).start`, wobei `id` die Segment-ID aus dem Transkript ist. Die Zone kann pro Frame
`this.fx = { sat, glitch, exposure, ca, vignette, punch, shake }` setzen. Kick-Punch und Kamerawackeln skalieren mit
`e` (Energie) des Shots.

**Policy:** `GROUPS` und `POLICY` in `config.js` bestimmen die Matrix, die erlaubten Flows in der Totale und die
roten Fehlversuche. Eine Änderung dort wirkt in allen Szenen.

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
