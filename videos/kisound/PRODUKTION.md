# kisound · Produktionshandbuch Live-Code-Stücke und kisound.ch

Stand: 14. Oktober 2026, ergänzt um den Codefilm 01 „Vibecoder“. Dieses Dokument beschreibt,
wie die drei Ordner zusammenhängen, wie die codebasierten Stücke gebaut werden, welche Quellen sie lesen
und wie die Website kisound.ch entsteht und hochgeladen wird. Ziel: reproduzierbare Ergebnisse, auch in
einer neuen Sitzung ohne Vorwissen.

Ergänzende Dokumente (nicht doppelt gepflegt):

- `videos/kisound/README.md` – Videoexport (MP4 1080p/4K, `kisound-render`, `tools/export-video.mjs`).
- `videos/kisound/<Album>/<Track>/README.md` und `ABNAHME.md` – pro Stück: Start, Einstiege, Bildwelt, Nachweise.
- `videos/kisound/Network-Engineer-Album01/_audio_analysis/README.md` – ASTRA-Audioanalyse (Python).
- `web/kisound/README.md` – Website-Build im Detail.
- `music/kisound/CLAUDE.md` und `agent.md` – Regeln des Musik-Repos (Autorität für Dateihygiene, Tags, Release).

---

## 1. Die drei Ordner und ihr Zusammenhang

Alle Bereiche liegen im gemeinsamen `kisound/`-Repository:

```
kisound/
├── music/kisound/        Quelle der Wahrheit für Musik
│   └── <Album>/NN_Track/ WAVs, finaler Prompt *_1.0.txt, Transkript, Cover, Lizenz-PDF, NN_Track_Video.md
├── videos/kisound/       Analysen, Drehbücher, Code der Live-Code-Stücke, lokale Exporte
│   ├── tools/            gemeinsamer Renderer und Export (kisound-render, render.mjs, export-video.mjs)
│   └── <Album>/<NN_Track>/   ein Node/Three.js-Projekt pro Stück
└── web/kisound/          Website-Build → dist/ → kisound.ch
```

Datenfluss (nur lesend, nie zurückschreibend):

```
music/kisound  ──(WAV, Prompt, Transkript, Cover, album.yml)──►  videos/kisound/_audio_analysis  ──►  ASTRA-AUDIO-ANALYSE.json/.md/.png + ASTRA-DREHBUCH.md
music/kisound  ──(WAV per SHA-256, Transkript, Prompt)────────►  videos/kisound/<Album>/<Track>   (npm run prepare kopiert das WAV nach assets/audio)
music/kisound + videos/kisound  ─────────────────────────────►  web/kisound (npm run build) ──► dist/ ──(FTPS)──► kisound.ch
```

Regeln:

- Der Musikbereich ist die einzige Quelle für Audio, Lyrics, Cover und Metadaten. Video- und Webprojekte lesen
  es per relativem Pfad und schreiben nie hinein – mit einer Ausnahme: die Pointer-Datei
  `NN_Track_Video.md` im Trackordner (siehe 2.3).
- Die Video-Ordner spiegeln die Musik-Ordner: `videos/kisound/<Album>/<NN_Track>/`. Ausnahmen aus der Zeit vor
  dieser Konvention: `09-last-hop`, `Network-Engineer-Album02/02-trustsec`. Die Website ordnet über die
  führende Tracknummer zu (`videos.mjs`, Regex `^\d\d[_-]`), daher funktionieren beide Schreibweisen.
- Die Website liest beide Bäume, kopiert aber nur abgeleitete Dateien (MP3, WebP, gebündeltes JS) nach `dist/`.

## 2. Musik-Repo (`music/kisound`)

### 2.1 Was ein Live-Code-Stück daraus liest

Pro Track im Ordner `<Album>/NN_Track/`:

| Datei | Verwendung |
| --- | --- |
| `NN_Track_1.0.txt` | finaler Prompt. `TRACK: NN - Titel`, `RELEASE AUDIO: <wav>`, `LYRIC PROMPT:` (Website-Lyrics), `THEMA`, optional `SPRACHE:` |
| `NN_Track_<ver>-<var>.wav` | die im Prompt unter `RELEASE AUDIO` genannte WAV, 48 kHz Stereo 16 Bit. Einzige Tonquelle. |
| `NN_Track_Transkript.json` | automatisches Transkript mit Zeiten; enthält `source_audio_sha256` der WAV |
| `NN_Track_cover.png` | Cover (Referenz für Farben/Bildsprache; Website-Cover) |
| `album.yml` | Albumtext, pro Track `genre`, `theme`, `style`, `tags` (Englisch) |

`prepare.mjs` jedes Projekts prüft: Release-Auswahl im Prompt = `SOURCE_WAV`, SHA-256 der WAV = Analyse/Config,
Transkript-SHA = Analyse (bzw. Config bei 08 MTU), und kopiert die WAV nach `assets/audio/<slug>.wav`
(git-ignoriert in den Projekten). Danach `assets/manifest.json` mit allen Hashes.

### 2.2 Konventionen, die das Video berühren

- Nur `*_1.0.txt` ist final. `_0.3-1`-Suffixe sind intern und erscheinen nie in Titeln.
- Lyrics-Sprache pro Album: Album 01 Englisch, **Album 02 Deutsch mit englischen Fachbegriffen**
  (`SPRACHE:`-Header im Prompt; die Website erkennt Deutsch über diesen Header).
- Abschnittsnamen (Intro, Verse, Hook …) werden nie gesungen und nie als Lyric gezeigt.

### 2.3 Pointer-Datei `NN_Track_Video.md`

Jeder Trackordner mit Live-Code-Stück enthält `NN_Track_Video.md`: Projektpfad, finale WAV + SHA-256,
Transkript + SHA-256, Coverreferenz, Startbefehle, Port. Quellen nicht umbenennen oder verschieben, ohne die
Pointer-Datei und das Videoprojekt anzupassen. Stand: Pointer für 01–04, 06–09 (Album 01) und 02 TrustSec
(Album 02) liegen im Repo, **noch nicht committet** (`git status` zeigt sie als `??`).

## 3. Audioanalyse und Drehbuch (ASTRA)

Werkzeug: `videos/kisound/Network-Engineer-Album01/_audio_analysis/` (`analyse.py`, `screenplay.py`,
`validate.py`, `.venv`, Python 3.14, numpy/scipy/soundfile/matplotlib). Aufruf siehe dortiges README.

- Ausgabe pro Track im Videoordner: `ASTRA-AUDIO-ANALYSE.json` (Schema `astra.audio.analysis.v1`),
  `ASTRA-AUDIO-ANALYSE.md`, `ASTRA-AUDIO-ANALYSE.png`, `ASTRA-DREHBUCH.md`.
- **Album 02 – Analyse vorbereitet (4. Oktober 2026):** eigene Pipeline unter
  `Network-Engineer-Album02/_audio_analysis/`, abgeleitet von Album 01. Acht aktuelle Trackordner
  `01_On_Call` bis `08_Out_of_Band`, pro Track JSON/Markdown/PNG im aktuellen v1-Format;
  `validate.py` schreibt Manifest und `ASTRA-ALBUM-UEBERSICHT.md`. Keine neuen Drehbücher oder Videos.
  Auf ausdrücklichen Nutzerauftrag werden die **aktuellen Kandidaten** analysiert: sieben WAVs und
  TrustSec als lokal decodierte MP3. Noch keine finalen `*_1.0.txt` oder gefüllten `RELEASE AUDIO`-Felder.
  Quelle ist `source_audio` im Transkript, abgesichert mit Audio-SHA-256 und decodierter Dauer;
  Kandidatenstatus und ASR-Prüfmarkierungen bleiben im JSON erhalten. Für eine spätere neue Aufnahme
  Transkript und Analyse neu erstellen. Die historische Umsetzung `02-trustsec/` bleibt bestehen;
  aktuelle TrustSec-Analysen liegen entsprechend der Musiknummerierung unter `03_TrustSec/`.
- JSON-Felder, die der Code nutzt: `source.sha256`, `summary.duration_s`, `tempo`, `events[]`
  (`id, time_s, type`), `onsets[]` (`time_s, strength`), `lyrics.segments[]` (`id, start_s, end_s, text,
  section`), `features_100ms.columns/rows` (u. a. `rms_dbfs`, `sub_20_60_drive`, `high_6000_12000_drive`).
- **Frühes v1-Format (nur 08 MTU):** `lyrics` als Liste ohne `section`, Events mit `kind` statt `type`,
  kein Transkript-Hash. `08_MTU/src/render/timeline.js` normalisiert beim Laden (`normalizeAnalysis`),
  Abschnitte kommen aus `LYRIC_SECTIONS` in `config.js`; die Website-Funktion `slimAnalysis` akzeptiert beide
  Formen. Neue Analysen sollten das aktuelle Format haben.
- Die ASTRA-Drehbücher sind **Vorschläge** und waren durchgehend schwach (wiederholte Szenenaktionen,
  Bilder neben den Textzeilen, generische Ursachen). Sie werden pro Stück überarbeitet; das Original bleibt
  unter `_revisions/ASTRA-DREHBUCH-original.md`.

## 4. Aufbau eines Live-Code-Stücks

Ein Stück ist ein Node-Projekt (ESM, `three` 0.180.0, `puppeteer-core` 24.43.1). Jedes Bild ist eine reine
Funktion der absoluten Zeit; es gibt keinen Zustand zwischen Frames und kein `Math.random`.

```
<NN_Track>/
  package.json  package-lock.json  .gitignore  render-export.json
  ASTRA-AUDIO-ANALYSE.json/.md/.png      (aus der Analyse, unverändert)
  ASTRA-DREHBUCH.md                       (überarbeitete Fassung)   _revisions/ASTRA-DREHBUCH-original.md
  README.md  ABNAHME.md  UMSETZUNG-CUES.md/.json (aus dem Code erzeugt)
  assets/fonts/ (Michroma, Space Grotesk, JetBrains Mono + OFL)   assets/audio/ (von prepare)   assets/manifest.json
  src/render/  config.js  model.js  timeline.js  world.js  zones/<a>.js  zones/<b>.js  overlay.js  film.js
               main.js  player.js  index.html  serve.mjs  render.mjs
  src/tools/   prepare.mjs  stills.mjs  check-browser.mjs  write-cues.mjs
  tests/<name>.test.mjs
  output/qa/   (Browsercheck-Berichte und Bilder)   output/*.mp4 (nur nach Freigabe)
```

| Datei | Inhalt |
| --- | --- |
| `config.js` | `FPS=60`, `SAMPLES` (aus der Analyse), `DURATION=SAMPLES/48000`, `FRAMES=ceil(DURATION·FPS)`, `SOURCE_WAV`, `SOURCE_SHA256`, `SEED`, `PALETTE`, `DROPS`, Pausen/Lücken, `FADE_START`, `TITLES`, `CHAPTERS` (Titel, Start, Handlung), `SHOTS` aus `cuts` `[start, zone, kamera, modus, ziel]` |
| `model.js` | das redaktionelle Fachszenario: Knoten, Pakete/Flüge mit Keyframes, Zustände über die Zeit, Terminal-/Log-Texte, kinetische Wörter (`KINETIC_SECTIONS`, `word()`, `WORD_NOTE`) – alles als Funktion von `t` |
| `timeline.js` | lädt die Analyse, ordnet Events und Lyrics den Shots zu, 100-ms-Merkmale geglättet (`sample`), Onset-Impulse (`attack`), Drop-Impulse (`drop`), Ein-/Ausblendung (`visibility`) |
| `world.js` | gemeinsame Three.js-Helfer (Materialien, Labels mit `fitLabels`, `instanced`, `dynamicTexture`, `monoLines`, Router/Switch/Server-Objekte, Polarboden) |
| `zones/*.js` | zwei Bildräume pro Stück, je `update(t,a,tl,shot)` und `camera(shot,t)` |
| `overlay.js` | 2D-Canvas: Kopfzeile, Terminal/Dock, kinetische Wörter, Log, Titel |
| `film.js` | Renderer + Bloom + FXAA, wählt die Zone pro Shot, `lastState` für QA |
| `main.js` | Einstieg; Web-Schnittstelle `window.KISOUND_PAGE {analysis, defaultRes, sets, animatic}`; setzt `window.renderFrame(n)`, `renderTime(t)`, `FILM`, `__ready`, `__error` |
| `player.js` | lokaler Browserplayer (wird auf der Website durch den öffentlichen Player ersetzt) |

Schnittstelle für Renderer, Website und QA: `window.renderFrame(n)`, `window.renderTime(t)`, `window.FILM {FPS, FRAMES, W, H}`,
`window.__ready`, `window.__error`, `window.player.seek(t)`. Abfragen: `?t=`, `?res=540|720|1080`, `?debug=1`,
`?w=&h=&t=` (Einzelbild ohne Player).

### 4.1 Gemeinsame Regeln (in allen Stücken eingehalten)

- **60 fps**, Originalton unverändert; nie aufs Beat-Raster stretchen. Lyric-Zeiten aus `lyrics.segments`
  unverändert (automatisch, nicht manuell geprüft); ausgeschlossene Segmente nie zeigen.
- **Drops** = Wiedereinsätze des Sub-Bass aus den 100-ms-Zeilen: mittlerer `sub_20_60_drive` vor dem Einsatz
  (−1,6…−0,3 s) < 0,2, mindestens ein Peak danach (−0,1…+0,6 s) > 0,55 und ein deutlich höherer mittlerer
  Wert im Nachfenster. Wird im Test geprüft. Pegellücken (`rms_dbfs < −30…−45`)
  und gemessene Endabfälle bestimmen Blackouts und Blende – keine geschätzten Fades.
- **Fachlich korrekt** als redaktionelles Szenario mit verdichteten Zeiten; die wichtigen Regeln sind als
  Tests formuliert (z. B. Root pro TLD einmal, keine Fragmentierung, Null0 ohne ICMP, Policy nur fürs erste
  Paket einer Session).
- **Adressen nur aus Dokumentations-/Testbereichen:** 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24,
  2001:db8::/32, 198.18.0.0/15 (Benchmark), private 10/8 und 172.16/12 für Inside/DMZ.
- **Keine Firmennamen, Logos oder ASTRA-Branding** im Bild. Titel: Tracktitel + SAMUEL HEINRICH in Michroma.
- **Kinetische Wörter** nur für Hook/Break/Chant-Abschnitte, jeweils mit einer Zeile Erklärung (`WORD_NOTE`).
- **Kein MP4-Export ohne ausdrückliche Freigabe** des Nutzers. Abgegeben wird Code + Browservorschau.

### 4.2 Vorgehen für ein neues Stück („gleiches Vorgehen wie bei Multicast“)

1. **Lesen:** Prompt (`*_1.0.txt` inkl. STYLE PROMPT – Genre/Stimmung prägen die Bildwelt), Transkript,
   `ASTRA-AUDIO-ANALYSE.md/json`, `ASTRA-DREHBUCH.md`, Cover (verkleinert ansehen: Farben, Motive, oft
   nutzbare Details wie Adressen).
2. **Messen** (Python über die JSON): Pegellücken (`rms_dbfs < −30`), Bass-an/aus-Segmente (geglätteter
   `sub_20_60_drive > 0,3`), Drop-Kandidaten nach dem Kriterium oben, Events, Lyric-Abschnitte.
3. **Drehbuch überarbeiten:** eine konkrete, fachlich stimmige Geschichte; jede Textzeile mit eigenem
   Bild; Musikstruktur (Breakdowns, Drops, Stille, hartes Ende) als Wendepunkte. Original nach `_revisions/`.
4. **Gerüst kopieren** vom jüngsten Projekt (z. B. `07_Firewall_State_Table`): `package.json`/Lock (Name
   ändern), `.gitignore`, `assets/fonts`, `src/render/{render.mjs, player.js, index.html, serve.mjs, main.js,
   world.js, timeline.js}`, `src/tools/{stills.mjs, prepare.mjs, check-browser.mjs}`; dann ersetzen:
   Port in `serve.mjs` (freien wählen, siehe 6), Titel in `index.html`/`player.js`, Audio-Dateiname in
   `player.js`/`prepare.mjs`/`render-export.json`, Quellpfade in `prepare.mjs`, Ladetext in `main.js`.
   `npm ci --ignore-scripts` (sonst startet `prepare` zu früh), danach `npm run prepare`.
5. **Code schreiben:** `config.js` → `model.js` (zuerst mit Node gegen Ziele/Zeiten prüfen) → Zonen →
   `overlay.js` → `film.js`.
6. **Sichten:** `node src/tools/stills.mjs --w 800 --out <ordner> <zeiten…>` (Mitte jeder Einstellung), mit
   PIL zu Kontaktbögen montieren und **alle** Einstellungen ansehen; korrigieren, wiederholen. Typische
   Fehler: zu dunkel/zu grell, Kamera in Geometrie oder Paket, Labels überlappen, Text auf hellem Grund
   unlesbar, Kinetik-Wort kollidiert mit Plakat.
7. **Tests** `tests/<name>.test.mjs` (`npm run check`): Quelle/Dauer/FRAMES, lückenlose Shots/Kapitel, jedes
   Event und jede Lyric genau einmal zugeordnet, Drops/Lücken gegen die Analyse, Fachregeln, Kameraziele
   aktiv, Adressbereiche, Log-Abstand ≥ 0,4 s, Zeitdeterminismus.
8. **Browsercheck** `src/tools/check-browser.mjs` anpassen (Screenshot-Zeiten, Determinismus-Zeiten,
   Kapitelwert, `FRAMES`, 4K-Standbild-Frame) → `npm run check:browser`.
8b. **Inspektor:** wichtige Objekte mit `name` versehen und `userData.inspect=t=>({…})` setzen (die Modellfunktionen,
   die das Objekt zur Zeit t steuern). Der Website-Player zeigt das im Expertenmodus unter „⚙ Technik“ (siehe
   `web/kisound/README.md`). Vorbild: `Vibecoder/03_SHIP_IT/src/render/room.js → annotate()`.
9. **Cues** `src/tools/write-cues.mjs` → `npm run cues`. **Exportprüfung** `node ../../tools/kisound-render.mjs 4k --check`.
10. **Doku:** `ASTRA-DREHBUCH.md` (überarbeitet), `README.md`, `ABNAHME.md`; Pointer `NN_Track_Video.md` im
    Musik-Repo.
11. **Website:** Eintrag in `web/kisound/site.config.json` → `interactive` (siehe 7.2), `npm run build`,
    `npm run check`. Hochladen nur auf Wunsch.

Kontaktbögen (`src/tools/contact.sh`) brauchen ein Python mit Pillow; das System-Python hat es nicht (Stand 12.10.2026): eine
Venv mit `pip install pillow` anlegen und als `PY=<venv>/bin/python src/tools/contact.sh de` übergeben.

Shell-Fallen aus der Sitzung: zsh teilt `$T` nicht → `${=T}`; kein `timeout`-Befehl auf macOS; lange
Hintergrundprozesse werden nach 30 min bzw. 2 h beendet (Vorschauserver dann selbst im Terminal starten);
Python-Patches mit `assert a in s` abbrechen lassen, statt still nichts zu ersetzen; Kommentare nie in
dieselbe Zeile vor weiteren Code schreiben.

## 5. Album 01 – Stand der zehn Stücke

Alle als Code + Browservorschau fertig und technisch geprüft; MP4 vorhanden nur bei 00 (2) und 05 (1).

| Nr | Projekt | Port | Länge | Bildwelt / Konzept | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 00 | `00_Network_Engineers` | 8126 | 3:28 | Nachtcrew einer Stadt | – | vor dieser Sitzung |
| 01 | `01_Layer_2` | 8128 | 3:30 | Adressen, VLANs, Schleife | – | vor dieser Sitzung |
| 02 | `02_OSPF_Neighbors` | 8130 | 3:01 | Netzwerkatlas, Nachbarn | – | vor dieser Sitzung |
| 03 | `03_Its_Always_DNS` | 8133 | 4:21 | „Fall #4040“: Stadt (Resolver, Cache, Root, TLD, Split Horizon) + Noir-Schreibtisch | 15 | diese Sitzung |
| 04 | `04_Destination_Unreachable` | 8141 | 4:20 | leerer Backbone: RTBH-Null0 bei R4 (/32→/24), fehlendes Präfix bei R2; Nebelkarte | 12 | diese Sitzung |
| 05 | `05_WiFi_Roaming` | 8127 | 2:57 | Roaming durchs Bürogebäude (Referenzprojekt) | – | vor dieser Sitzung |
| 06 | `06_Multicast` | 8136 | 4:21 | V2 Stadion (288 Clients, PIM-SM, IGMP, SPT); V1 unter `_revisions/code-v1-arena.tar.gz` | 17 | diese Sitzung |
| 07 | `07_Firewall_State_Table` | 8137 | 4:19 | Mauer + Mandala-Tor aus Policy-Ringen, State Table, NAT, DPI/EICAR; Kontrollraum | 14 | diese Sitzung |
| 08 | `08_MTU` | 8138 | 2:19 | PMTUD-Black-Hole: IPsec-Tunnel MTU 1400, ICMP 3/4 gefiltert; helle Messhalle | 16 | diese Sitzung |
| 09 | `09-last-hop` | 8125 | 4:55 | Fassung «Starship»: der Frame als Raumschiff, Warp mit Cockpit-Displays (Syslog/Traceroute/TTL), Nebel, Station, Sternentor, Ringplaneten, Pulsar, Wurmloch, 3-Sonnen-System, Lichtstrahl ins Fenster, Raum im Morgenlicht (ältere Struktur, `npm run serve` = Port 8125) | – | online (5.10.2026, Fassung «Starship») |

Lokale Vorschau eines Stücks: `cd <Projekt> && npm run preview` (öffnet Chrome) oder `npm run serve`.
Alle zugleich: pro Projekt `node src/render/serve.mjs <port>`; beenden mit `pkill -f "src/render/serve.mjs"`.

## 6. Ports

Belegt: 8125 (09), 8126 (00), 8127 (05), 8128 (01), 8130 (02), 8133 (03), 8134 (03 alt), 8136 (06), 8137 (07),
8138 (08), 8139 (08 alt), 8140 (Website `npm run serve`, auch 07 alt), 8141 (04), 8142 (04 alt). Album 02:
**8150 (01 On Call)**, 8151 (01 alt), **8152 (02 Active / Standby)**, 8153 (02 alt), **8154 (04 Broadcast Storm)**, 8155 (04 alt), geplant 8156 (05), 8158 (06), 8160 (07), 8162 (08). Vibecoder: **8170 (02 Token Burn)**, **8172 (03 SHIP IT)**, **8174 (01 Vibecoder)**, weitere ab 8176.

## 7. kisound.ch

### 7.1 Repo `web/kisound`

```
site.config.json   Site, Quellen, Deploy, Audioformat, Alben, interactive-Einträge
i18n/content.json  zweite Sprache für Texte aus den Quellen (Tagline, Albumtext, Theme/Style DE, Kapitel EN)
src/build.mjs      liest music + videos, schreibt dist/
src/lib/           music.mjs (Album/Prompt/Lyrics), videos.mjs (Analyse, slimAnalysis), media.mjs (Cache,
                   MP3, WebP, Wellenform, JPEG), sections.mjs (Abschnitte aus Transkript), interactive.mjs
                   (bündelt ein Stück), posters.mjs (Standbilder), share.mjs (Link-Vorschauen), html.mjs (Seiten)
player/            öffentlicher Player (player.js, player.css, live.html) – ersetzt den Projekt-Player
site/              site.js (Audio-Dock, Wellenform, Sprachschalter), site.css, wave.js, fonts, icon.svg
server/htaccess    → dist/.htaccess (Caching, HTTPS, Redirect /video/ → /live/)
src/check.mjs      Prüfung in Headless Chrome     src/deploy.mjs  Upload     src/serve.mjs  lokale Vorschau (8140)
audio-offsets.json gemessene Versätze Web-Audio ↔ WAV (vom Check geschrieben, vom Build genutzt; alle 0,00 ms)
```

Befehle (im Ordner `web/kisound`): `npm run build` → `npm run check` → `npm run deploy` (Probelauf) →
`npm run deploy -- --live [--prune]`. Lokal ansehen: `npm run serve` → http://127.0.0.1:8140/.

### 7.2 `site.config.json`

- `site`: name `kisound`, url `https://kisound.ch`, lang `de-CH`, tagline (DE), artist, contact
  (`info@samuel-heinrich.ch`; **Postadresse fehlt** – Build warnt, für ein Schweizer Impressum üblich).
- `sources`: `../../music/kisound`, `../../videos/kisound`.
- `deploy`: host `s077.cyon.net`, user `agent_rsync@kisound.ch`, protocol `ftps` (cyon-FTP-Konten können
  kein SFTP), root `/`, keychain `kisound.ch-deploy`.
- `audio`: MP3 192k. `albums[]`: `dir`, `slug`, `publish` (Album 01 true, **Album 02 false**), `links`
  (YouTube/SoundCloud aus, die Uploads sind privat).
- `interactive."NN"`: `project` (Ordnername im Videobaum), `label` (DE), `label_en`, `poster` (Zeitpunkt des
  Standbilds – ohne Kinetik-Wort wählen), optional `analysis:false`, `copy:[…]`, `page:{…}` (nur 09 Last Hop).

### 7.3 Build-Ergebnis

- Seiten: Start, Album, Track, `…/live/` (das Stück), Impressum; `sitemap.xml`, `robots.txt`, `.htaccess`.
- Assets mit Inhalts-Hash im Namen (`name.<10 hex>.ext`, ein Jahr cachebar); HTML immer revalidieren.
- Pro Stück: esbuild bündelt `src/render/main.js` mit three.js, ersetzt `./player.js` durch
  `player/player.js` und `kisound:config` durch die Projekt-`config.js`; Analyse wird verschlankt
  (`slimAnalysis`). `KISOUND_PAGE` liefert Audio, Versatz, Wellenform, Titel, Kicker {de,en},
  `chapterNames`, `codeBytes`.
- Standbilder: Headless Chrome rendert `?w=1280&h=720&t=<poster>` (gecacht nach Bundle-Hash + Zeit).
- **Link-Vorschauen** (`share.mjs`): JPEG 1200×630 – Startseite/Album/Impressum: Collage aller Standbilder
  mit „KISOUND · Live code, not video / Live-Code statt Video“; jede Trackseite: eigenes Standbild + Titel +
  Codegrösse. Dazu `og:image:width/height/type/alt`, `og:site_name`, `og:locale` de_CH + en_US,
  zweisprachige `og:description`. **Telegram-Cache** nach Änderungen über den Bot **@WebpageBot**
  (URL schicken) erneuern.
- Wellenform 3-bandig mit Abschnitten aus dem Transkript; Audio-Dock mit ±10 s.

### 7.4 Zweisprachigkeit (DE/EN)

- Jede Seite enthält beide Sprachen: `L(de,en)` schreibt `<span data-l="de">…</span><span data-l="en">…</span>`,
  CSS zeigt nach `html[data-lang]`; Attribute über `data-i18n` (JSON). Ein Skript im `<head>` setzt die
  Sprache vor dem ersten Bild: gespeicherte Wahl (`localStorage 'kisound.lang'`), sonst Browsersprache
  (`de*` → Deutsch, alles andere → Englisch). Schalter **DE | EN** in der Kopfzeile.
- Eingebettete Stücke folgen live über das `storage`-Event; der Player hat ein eigenes Wörterbuch,
  Kapitelnamen werden über `i18n/content.json → chapters` übersetzt; die deutschen Ladetexte der Projekte
  übersetzt ein Beobachter in `live.html`.
- **Lyrics werden nie übersetzt** (Hinweis „Originaltext auf …, nicht übersetzt“; Sprache aus `SPRACHE:`).
- Texte im Bild der Stücke (Overlays) bleiben, wie sie im jeweiligen Projekt programmiert sind.
- Neue Inhalte: Album 02 braucht in `i18n/content.json` die Übersetzungen (Albumtext, Theme/Style, Kapitel)
  und in `site.config.json` `label`/`label_en`.

### 7.5 Begriff: „Live-Code“ statt „Video“

Die Stücke heissen auf der Seite nie „Video“: „Live-Code“ / „Live code“, Buttons „▶ Code ansehen“ /
„▶ Watch the code“, Band „Kein Video. Das ist Code.“, Plakette `</> 617 KB Code · 0 B Video`. URL-Pfad
`/<album>/<track>/live/`; alte `/video/`-Links leitet `.htaccess` mit 301 weiter.

### 7.6 Prüfung (`npm run check`)

Audioversatz Web-MP3 ↔ WAV per Kreuzkorrelation (3 Stellen), alle Seiten ohne Fehler und mit decodierten
Bildern, Audio-Dock, Inline-Wellenform, jedes Stück: Start, Wiedergabe, +10 s, Expertenmodus, fps,
Mobilansicht, eingebettet; Sprachen (en-US → EN, Schalter → DE, Iframe folgt, Wahl bleibt, Lyrics unverändert).
Bericht `.cache/check/report.json`. Dauer etwa 10 min bei zehn Stücken; der Build ~5–300 s (Standbilder).
**Nur Geändertes prüfen** (Regel seit 12.10.2026): `npm run check -- --only <album>/<track>` (~1,5 min); der volle Lauf
nur bei Änderungen am Player, an der Bündelung oder an three.js. Details: `web/kisound/README.md`, Abschnitt „Prüfen“.

### 7.7 Hochladen

`src/deploy.mjs`: FTPS zu cyon; Passwort **nur** aus dem macOS-Schlüsselbund (Dienst `kisound.ch-deploy`,
Konto `agent_rsync@kisound.ch`) oder `KISOUND_DEPLOY_PASSWORD`, nie auf Platte, nie ausgeben. Ohne `--live`
nur Plan; `--live` lädt neue/geänderte Dateien (Assets vor HTML); `--prune` löscht nur alte Dateien mit Hash
im Namen. Hochladen nur auf ausdrücklichen Wunsch des Nutzers. Letzter Upload: 13.10.2026, zweiter Stand (Player: „← KISOUND Startseite“ in der Übersicht, aufklappbare „ⓘ Track-Details“ ohne Unterbruch des Live-Codes, Fassungswahl DE/EN stellt auch die Bedienung um; Impressum mit GitHub-Link „See how it’s built …“; 197 Dateien). Davor: 13.10.2026 (Player mit Technik-Bereich „⚙ Technik“ in allen 22 Live-Code-Stücken: Ansichten, Objektinspektor, Live-Szenenkonfiguration, Leistung; 176 Dateien). Davor: 12.10.2026 (03 SHIP IT als Live-Code DE/EN; 01, 04, 05, 06 als Platzhalter mit Song-Cover und „In Arbeit …“/„Coming soon …“; `album.yml` Track 03 final). Davor: 9.10.2026 (Album Vibecoder als erstes Album: 01 VIBECODER Audio, 02 TOKEN BURN Live-Code DE/EN, 03–06 in Arbeit). Davor: 5.10.2026 (Album 02 veröffentlicht mit
01 On Call, 02 Active / Standby, 03 TrustSec, 04 Broadcast Storm, 05 Wireshark, 06 ICMP, 07 QoS und 08 Out of Band als Live-Code; Album 02 steht auf der Startseite vor Album 01; TrustSec erscheint mit seiner neuen finalen WAV, Analyse dazu noch aus der alten MP3).

## 8. Album 02 – was vor dem Start zu klären ist

- Musik: `music/kisound/Network-Engineer-Album02/` (acht Tracks, `01_On_Call` … `08_Out_of_Band`).
  Pro Track gibt es einen Lyric-Prompt und einen Audio-Kandidaten mit Versionsnummer im Dateinamen.
  Es fehlen finale `*_1.0.txt` mit `RELEASE AUDIO`, Release-WAVs und neue Transkripte; TrustSec liegt
  unter `03_TrustSec` als `03_TrustSec_0.1.mp3` mit bestehenden Transkripten.
- Video: bisher nur `Network-Engineer-Album02/02-trustsec` (ältere Struktur aus dem früheren Filmprojekt).
- Reihenfolge pro Track: finale WAV + `_1.0.txt` → Transkript → ASTRA-Analyse/Drehbuch (Pipeline auf
  Album 02 umstellen) → Stück nach Abschnitt 4.2 → Website (`publish: true` erst, wenn bereit).
- Deutsche Lyrics: Kinetik-Wörter bleiben im Original; `WORD_NOTE` darf erklären; die Website erkennt
  Deutsch über `SPRACHE:`.

### 8.1 Album 02 – Stand der Stücke

| Nr | Projekt | Port | Länge | Bildwelt / Konzept | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | `01_On_Call` | 8150 | 3:37 | Seestadt (Cover), Bereitschaftsplatz, Display, R-EDGE innen in Zeitlupe: QUARANTINE fälschlich an Gi0/0/1, Eingriff 146,82 s, HTTP 200 auf dem Bass-Einsatz | 12 | Code + Vorschau, online (5.10.2026), finale WAV `1.0` |
| 02 | `02_Active_Standby` | 8152 | 3:23 | Rechenzentrumshalle (Cover): zwei FortiGates, ha1-Tunnel mit Heartbeat/Sync, Adressring, Split Brain, Fencing von A, Wahl B, Resync; Session-Archive; lokale Consoles | 14 | Code + Vorschau, online (5.10.2026) |
| 03 | `03_TrustSec` | 8124 | 4:48 | Bestehendes Projekt (ältere Struktur wie Last Hop: Transkript + `assets/audio/analysis.json`, `copy` in site.config); finale WAV `1.0` | – | Code + Vorschau, online (5.10.2026) |
| 04 | `04_Broadcast_Storm` | 8154 | 3:29 | Switchdreieck mit Fehlpatch SW3/24↔SW1/24, VLAN 120 ohne STP: 611 Broadcasts → 1222 endlos kreisende Ringkopien, Queues, MAC-Flaps, serielle Console, shutdown Gi1/0/24 | 12 | Code + Vorschau, online (5.10.2026) |
| 05 | `05_Wireshark` | 8156 | 3:16 | Rackraum mit SPAN vor/hinter dem 100-Mbit/s-Uplink, Analysefenster, BEFORE/AFTER, Protokollschichten; O-101 an der Queue verloren, Versuch Bulk 95→20 Mbit/s | 10 | Code + Vorschau, online (5.10.2026) |
| 06 | `06_ICMP` | 8158 | 3:37 | Realwelt: Büro in Zürich (Laptop, Regal mit Switch, Heimrouter G1, Labor-Router G2), Laptop-Desktop mit Terminal und tcpdump, Weltkugel Zürich → Frankfurt (Tunnel MTU 1400) → New York, Rechenzentrum New York; Echo 92,4 ms, PMTUD, Traceroute, Port Unreachable, Redirect | 12 | Code + Vorschau, online (5.10.2026, Fassung «Realwelt») |
| 07 | `07_QoS` | 8160 | 3:59 | MQC-Maschinenhalle (Cover-Farben RTP blau / Bulk orange): Classify, Mark EF/46, Policer mit Drop-Kante (Q-RX), Priority- und endliche Bulk-Queue, CHILD-Scheduler, PARENT-Shaper 100 Mbit/s; deterministische Warteschlangen-Simulation | 12 | Code + Vorschau, online (5.10.2026) |
| 08 | `08_Out_of_Band` | 8162 | 4:24 | Helle, reale Datenhalle (Doppelboden, Warm-/Kaltgänge, Kabeltrassen, gelbe Glasfasertrasse, CRAC): Zoom aus der Stadt durch ein Bürogebäude (6 schematische Etagen) zu vier Rechenzentren und zurück; Engineer am Boden hinter Rack C06 mit Laptop am OOB-Netz, Console-Server Kanal 7 → CON; Fahrten durch die Gänge zum Engineer hin und weg, Überflüge; Laptop-Bildschirm | 10 | Code + Vorschau, online (5.10.2026, Fassung «Rechenzentrum») |

Album 02 wird gerade finalisiert (On Call und TrustSec haben seit 4./5.10. ein `*_1.0.txt`). `prepare.mjs` nimmt
`RELEASE AUDIO`, solange kein `_1.0.txt` existiert `source_audio` des Transkripts (SHA-geprüft). Bei einer
Umbenennung mit bitgleicher WAV genügt: `SOURCE_WAV` anpassen, Analyse für den Track neu rechnen (`analyse.py NN_…`). Auf der Website steuert `site.config.json → albums[].candidates`
(z. B. `["01"]`), welche Tracks vor der Release-Auswahl mit ihrem Kandidaten erscheinen; sie tragen den Hinweis
„Vorabfassung“. `music.mjs` erkennt Album-02-Lyrics mit `[Abschnitt]`-Labels und Cover `*-cover.png`.
**Wird eine andere Aufnahme final, müssen Transkript, Analyse und die Zeiten des Stücks neu erstellt werden.**

## 8a. Album „Vibecoder“ – Sprachfassungen DE/EN

Ab Vibecoder hat ein Track **zwei finale Fassungen**: `music/kisound/Vibecoder/NN_Track/final/de/` und `final/en/`
(Gross-/Kleinschreibung egal), je mit finalem Prompt `*_1.0.txt` (STATUS: Final, `RELEASE AUDIO` relativ zum
Prompt-Ordner), Transkript und Audioanalyse; `album.yml → tracks.NN.release_variants` nennt Prompt und Audio.
Daraus folgen **zwei Live-Code-Fassungen pro Track** in **einem** Projekt:

- Videoprojekt `videos/kisound/Vibecoder/NN_Track/` mit `variants/<lang>/` (Analyse, TIMELINE, KEYWORDS, Cues).
  `config.js` wählt die Fassung einmal beim Laden: `window.KISOUND_PAGE.lang` (Website), `?lang=` (Vorschau),
  eine projektspezifische Umgebungsvariable wie `TOKEN_BURN_LANG` oder `VIBECODER_LANG` (Tests). Schnittzeiten, Lücken, Blende und Titelanker je Fassung; Geometrie und Geschichte
  gemeinsam; Bildschirmtexte lokalisiert. Tests laufen je Fassung (`tests/de.test.mjs`, `tests/en.test.mjs`).
- Website: `music.mjs` liest die Fassungen (`readVersions`), `build.mjs` erzeugt je Fassung MP3, Wellenform,
  Lyrics-Zeiten und Analyse (`audio-de.*.mp3`, `audio-en.*.mp3` …), `interactive.mjs` schreibt sie in
  `KISOUND_PAGE.versions`. `live.html` wählt vor dem Laden: `?v=` → gespeicherte Wahl `kisound.version` →
  Seitensprache. Der Player zeigt einen DE/EN-Schalter (Startbild und Leiste, Taste V); beim Wechsel bleibt die
  Szene erhalten (Shot-Starts aus `variants/<lang>/TIMELINE.json`, stückweise linear). Die Trackseite hat den
  Schalter „Fassung / Version“ und zeigt Text, Wellenform, Fakten und Analyse der gewählten Fassung; Album- und
  Kartenlisten tragen die Plakette „DE · EN“. Die Wahl gilt für alle Tracks und setzt auch die Sprache der
  Bedienung und der Seite (englische Fassung → englische Knöpfe).
- `site.config.json → interactive.NN`: `poster` (Zeit in der DE-Fassung) und `poster_en`.
- `npm run check` misst den Audioversatz je Fassung, prüft beide Live-Fassungen und den Umschalter.

| Nr | Projekt | Port | Länge DE / EN | Bildwelt / Konzept | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | `Vibecoder/01_Vibecoder` | 8174 | 3:36 / 4:05 | Export bei 99 %, eigener Vier-Reihen-Beat, Track-Tool mit Reload-Fehler; Agentmitte als Blackbox, drei gemeinsame 2D/3D-Artefakte und orange Schiene, 08:00 → 12:00 → 20:00 → 22:00 | 14 | Code + Vorschau, 72 Einstellungen je Fassung geprüft; Website und MP4 offen (14.10.2026) |
| 02 | `Vibecoder/02_Token_Burn` | 8170 | 4:06 / 4:11 | Nächtliches Zimmer mit Fenster zur Strasse, Laptop mit Sequencer-Demo, Uhr 01:00 → Morgen; Bassfehler nach Reload, Export ohne Bass, Nutzungsjournal (fiktiv), sechs TOKEN-BURN-Titel 2D/3D, Fassade am Anfang und Ende | 28 | Code + Vorschau, online mit DE/EN-Wahl (9.10.2026) |
| 03 | `Vibecoder/03_SHIP_IT` | 8172 | 2:36 / 2:01 | Dasselbe Zimmer, eine spätere Nacht; Release-Schiene aus fünf Pressen (TRACKS · BUILD · CHECK · DEPLOY · LIVE) und Enter-Makropad wie auf dem Cover; Build grün, Check rot: `05_Hallucination__cover.png` (ein Unterstrich zu viel), `mv`, derselbe Check grün, Commit, Upload 6/12/12, alter Cache, harter Reload, DE/EN mit Lyrics im Original, Link, Play, offener nächster Commit; Titelmarke COMMIT IT. / SHIP IT. 2D/3D | 30 | Code + Vorschau, online mit DE/EN-Wahl (12.10.2026) |

## 9. Offene Punkte

- Audio, Lizenz-PDFs und Renderdateien liegen lokal ausserhalb von Git; ihr Inventar steht
  im Repository-Stamm. Vor Änderungen an `web/kisound/` bestätigt der zuständige Web-Build-Agent die Übergabe.
- MP4-Exporte von 01–04, 06–09 nicht gerendert (Freigabe ausstehend; `kisound-render 4k --check` jeweils bestanden).
- Impressum ohne Postadresse.
- Lyric-Zeiten aller Stücke stammen aus automatischen Transkripten ohne Hörprüfung.
- Vibecoder (Stand 12.10.2026): `01_Vibecoder` hat keinen `final/`-Ordner mehr, auf der Albumseite ist sein Play-Knopf
  stumm. `web/kisound/src/check.mjs` klickt deshalb den ersten abspielbaren Knopf (`.row-play:not(.muted)`).
  Der Fassungstest prüft seit 12.10. allgemein, dass 90 s DE in derselben Einstellung der EN-Fassung landen (vorher fest
  auf TOKEN BURN, 100–115 s).
  Tracks ohne finale Aufnahme erscheinen als Platzhalter (Song-Cover, „In Arbeit …“ / „Coming soon …“) in Trackliste
  und Live-Code-Bereichen.
