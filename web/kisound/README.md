# kisound.ch – Website-Build

Statische Website aus den beiden Quellbereichen. Kein Server-Code, kein CMS: `npm run build` erzeugt
`dist/`, das auf jeden Webserver kopiert werden kann.

```
0004_git/kisound/
  music/kisound/    Musik: Prompts, lokale Release-WAVs, Cover, album.yml, Transkripte
  videos/kisound/   Videoprojekte, ASTRA-Analysen, Drehbücher, lokale Renders
  web/kisound/      dieser Ordner: Build, Vorlagen, Player → dist/
```

Die Daten fliessen nur in eine Richtung: `music` → `videos` → `web`. Der Build liest beide Ordner und
schreibt ausschliesslich in `web/kisound/dist` und `web/kisound/.cache`. **Was öffentlich wird, steht
allein in `site.config.json`** – ein Album erscheint erst mit `"publish": true`, ein interaktives Video
erst mit einem Eintrag unter `interactive`.

## Befehle

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/web/kisound"
npm ci               # einmalig
npm run build        # dist/ erzeugen (Transcodes und Bilder werden in .cache/ wiederverwendet)
npm run check -- --only vibecoder/03-ship-it   # nur das Geänderte prüfen (~1,5 min), siehe unten
npm run check        # alles prüfen (~10 min) – nur wenn sich Gemeinsames geändert hat
npm run serve        # dist/ lokal: http://127.0.0.1:8140/
npm run deploy       # Probelauf des Uploads (nichts wird übertragen)
npm run deploy -- --test    # nur anmelden und den Zielordner auflisten
npm run deploy -- --live    # hochladen (Assets zuerst, HTML zuletzt)
```

`npm run check -- --all-audio` misst den Versatz aller Tracks, nicht nur der interaktiven.

## Prüfen: nur, was sich geändert hat

Es werden keine Tests mehr für Unverändertes gemacht, das schon live ist. Der volle Lauf
(`npm run check` ohne Option: alle Seiten, alle Audio-Messungen, alle 22 Live-Code-Stücke, ~10 min)
ist nur nötig, wenn sich etwas ändert, das jedes Stück betrifft: der öffentliche Player (`player/`),
`src/lib/interactive.mjs`, die Bündelung oder die three.js-Version.

| Änderung | Prüfung |
| --- | --- |
| neues oder geändertes Stück, neue Aufnahme | `npm run build && npm run check -- --only <album>/<track>` (z. B. `vibecoder/03-ship-it`) |
| mehrere Tracks eines Albums | `--only vibecoder` oder `--only vibecoder/02-token-burn,vibecoder/03-ship-it` |
| Vorlagen, CSS, Texte (`src/lib/html.mjs`, `site/`, `i18n/`) | `--only` mit einem beliebigen Stück: die Seiten werden immer alle geprüft (schnell) |
| Player, Bündelung, three.js | `npm run check` (voll) |

`--only` beschränkt Audio-Versatz, Live-Code-Stücke und Fassungsumschalter; Seiten, Audio-Dock und Sprachen
laufen immer. Vor dem Hochladen zeigt `npm run deploy` (Probelauf), welche Dateien sich wirklich ändern:
Live-Code-Bundles, die dort nicht auftauchen, sind unverändert live und brauchen keinen neuen Test.

## Was gebaut wird

| Seite | Inhalt |
| --- | --- |
| `/` | interaktive Musikvideos (Standbilder aus dem Film), Alben |
| `/<album>/` | Cover im Originalformat, Beschreibung, Trackliste mit „Hören“ und „Video“, Video-Karten |
| `/<album>/<NN-titel>/` | Cover oder interaktives Video, Wellenform mit Abschnitten zum Anspringen, Text, Thema, Stil, Tags, Genre, Dauer, Tempo und Lautheit aus der ASTRA-Analyse, Analysebild, vor/zurück |
| `/<album>/<NN-titel>/video/` | interaktives Video als ganze Seite (auch im Iframe der Trackseite) |
| `/impressum/` | Impressum und Datenschutz |

Quellen je Track: finaler Prompt `NN_*_1.0.txt` (Titel, Text, Release-WAV), `album.yml` (Genre, Thema,
Stil, Tags, Albumtext), `NN_*_cover.png`, ASTRA-Analyse aus `videos/<Album>/<NN…>/`. Tracks ohne finalen
Prompt oder WAV erscheinen als „In Arbeit“ ohne Audio. Videoordner werden über Album und Tracknummer
zugeordnet, damit abweichende Namen wie `09-last-hop` nicht stören.

Audio: aus der Release-WAV (nicht aus `xx_mp3`) als MP3 192 kbit/s ohne Tags transkodiert. Gemessen in
Chrome: alle zehn Tracks von Album 01 liegen sample-genau auf der WAV (0 Samples Versatz, gleiche
Dauer). Der gemessene Versatz steht in `audio-offsets.json` und wird dem Player übergeben; ändert er
sich, meldet `npm run check`, dass neu gebaut werden muss. Safari und Firefox sind nicht automatisch
gemessen, nur Chrome.

Alle Asset-Dateien tragen einen Inhalts-Hash im Namen (`audio.3f2c1a9b0e.mp3`) und dürfen beliebig lange
gecacht werden; HTML wird immer neu geprüft.

## Interaktive Videos

`src/lib/interactive.mjs` bündelt `src/render/main.js` des Videoprojekts mit esbuild (three.js
inklusive) und ersetzt beim Bündeln dessen `player.js` durch `player/player.js`. Das Videoprojekt
bleibt lokal unverändert lauffähig; es braucht nur die Web-Schnittstelle in `main.js`
(`window.KISOUND_PAGE`, siehe `videos/kisound/README.md`).

Freigeschaltet: 00 Network Engineers, 01 Layer 2, 02 OSPF Neighbors, 05 WiFi Roaming, 06 Multicast, 09 Last Hop.

Ein weiteres Video freischalten:

1. Im Videoprojekt `main.js` um die Web-Schnittstelle ergänzen (drei Zeilen, wie bei 06_Multicast).
2. In `site.config.json` unter `interactive` eintragen: `"05": {"project": "05_WiFi_Roaming", "label": "…", "poster": 91.6}`.
3. `npm run build && npm run check`.

`poster` ist die Filmzeit für das Standbild (Video-Karten, Hintergrund des Startbilds). Weitere Felder:
`analysis: false` (Projekt bringt eine eigene Analyse mit), `copy` (zusätzliche Projektdateien, die der Film
zur Laufzeit lädt; `assets/sets` wird automatisch kopiert), `page` (zusätzliche Werte für
`window.KISOUND_PAGE`, z. B. `{"animatic": false}` bei Last Hop). Der Player versteht beide
Player-Verträge der Projekte (`startPlayer({film,width,height,initialTime})` und den älteren von Last Hop).

### Sprachfassungen (DE/EN)

Ab dem Album Vibecoder kann ein Track zwei gesungene Fassungen haben: `final/de/` und `final/en/` im Trackordner
des Musik-Repos (bzw. `album.yml → release_variants`). Der Build erzeugt dann je Fassung Audio, Wellenform,
Lyrics-Zeiten und Analyse; das Live-Code-Projekt liest seine Fassung aus `KISOUND_PAGE.lang`. Auf der Trackseite
schaltet „Fassung / Version“ zwischen Deutsch und Englisch (Text, Wellenform, Fakten, eingebetteter Live-Code),
im Player ein DE/EN-Schalter (Taste V). Die Wahl wird als `kisound.version` gespeichert; ohne Wahl gilt die
Seitensprache. Wer eine Fassung wählt (Trackseite oder Player), wählt damit auch die Sprache der Bedienung und der
Seite (`kisound.lang`): englische Fassung, englische Knöpfe. `poster`/`poster_en` in `site.config.json` setzen die Standbildzeit je Fassung.

### Wellenform und Abschnitte

Für jeden Track berechnet der Build eine Wellenform in drei Bändern (Bass < 200 Hz blau, Mitten cyan,
Höhen > 2 kHz hell) aus der Release-WAV und die Abschnitte (Intro, Verse, Chorus, Bridge …) aus dem
Transkript im Musik-Repo. Der Website-Player (Leiste unten mit Cover, ±10 s, Wellenform zum Spulen,
„Video ansehen“), die Wellenform auf den Trackseiten und der Video-Player zeigen dieselben Daten.

### Player

- **Einfach** (Standard): Startbild mit Play, Leiste blendet sich beim Abspielen aus, Wellenform mit
  Abschnitten zum Spulen, ±10 s, Kapitelname, Lautstärke, Vollbild. Oben (blendet mit aus): „Alben & Tracks“
  (Übersicht aller Alben/Tracks als Schublade von links, Taste A; erste Zeile „← KISOUND Startseite“) und
  „ⓘ Track-Details“ (Schublade von rechts, Taste I): Thema, Fakten, Stil, Tags, Audioanalyse und Text der
  laufenden Fassung, unten der Link zur ganzen Trackseite. Der Film läuft dabei weiter. Inhalt:
  `details.<hash>.json` je Live-Code-Track (`trackDetails()` in `html.mjs`, dieselben Bausteine wie die Trackseite),
  erst beim Öffnen geladen.
- **Autoplay** (in der Übersicht, Standard an, gemerkt): am Ende „Als Nächstes“ mit 8-s-Countdown, dann die
  nächste Live-Code-Seite mit `?autoplay=1` (über Albumgrenzen in Seitenreihenfolge, ⏭ / Taste N). Blockiert
  der Browser Ton ohne neue Geste, wartet das Startbild auf einen Tipp. Daten: `assets/catalog.<hash>.json`
  (nach allen Alben geschrieben, Platzhalter `__KISOUND_CATALOG__` in den Live-Seiten).
- **Text** (Knopf oder Taste T, gemerkt): eine dezente Zeile mit dem Liedtext zur Transkriptzeit
  (`lyrics.<hash>.json` je Track aus `*_Transkript.json`), unten mittig, über der Leiste solange sie sichtbar ist.
- Eingebettet auf der Trackseite gibt es nur den Text-Knopf, keine Übersicht und kein Autoplay.
- **Experte** (Knopf oder Taste E, wird im Browser gemerkt, `?expert=1`): Kapitelwahl, Tempo
  0,25–1×, Auflösung 540/720/1080p, Schleife, Cue-Diagnose, bildgenaue Zeit, alle Tasten der Vorschau.
- **⚙ Technik** (im Expertenmodus, Knopf oder Taste X; `player/tech.js`) zeigt, dass das Bild ein laufendes Programm ist.
  Generisch für alle Stücke: Der Player umhüllt `film.render` und `renderer.render` und findet so Szene, Kamera und
  Zeichenstatistik jedes Bildes, ohne das Projekt zu kennen. Alles aus = Bild unverändert (Multiplikatoren 1, kein Tausch).
  - *Ansicht:* Bild · Drahtgitter · Normalen (aus den Bildschirm-Ableitungen, unabhängig von Vertex-Normalen) ·
    Tiefe (logarithmisch); jeweils Material-Tausch nur bei Meshes, Linien behalten ihres, Sprites sind in Normalen/Tiefe
    aus, Bloom ist in den Analyse-Ansichten aus. *Bounding Boxes* (nicht „Collision Boxes“: kein Stück nutzt Kollisionen).
  - *Objektinspektor:* Klick ins Bild → Name, Pfad, Typ/Instanz, Geometrie, Material, Canvas-Textur, Werte bei
    t − 0,5 s · t · t + 0,5 s (das Stück wird dafür neu berechnet) und „Steuerung im Code“ aus
    `object.userData.inspect(t)`, wenn das Stück sie liefert (SHIP IT: `station(i,t)`, `packet(t)`, `enterPress(t)` …).
  - *Live-Szenenkonfiguration:* Audio-Reaktion (`tl.sample()`-Werte `*_drive`, `sub`, `high`, `energy`, dazu
    `attack/drop/accent`), Bloom-Stärke, Nebel (`FogExp2.density` bzw. `Fog.far`), Belichtung
    (`toneMappingExposure`). Nur aktiv, wo das Stück den Parameter hat (Last Hop und TrustSec: eigene Postproduktion).
  - *Leistung:* Bilder/s, Rechenzeit pro Bild, Draw Calls, Dreiecke, Linien, Geometrien, Texturen, Shader-Programme.
  Neue Stücke: wichtige Objekte mit `name` versehen und `userData.inspect=t=>({…})` setzen (die Funktionen des Modells,
  die das Objekt zur Zeit t steuern). Das ändert das Bild nicht.
- Startauflösung nach Anzeigegrösse (Touch-Geräte höchstens 720p). Läuft das Video unter 42 fps, bietet
  der Player einmalig eine niedrigere Auflösung an.
- Deep-Links: `video/?t=135.7`. Auf dem iPhone (kein Vollbild für Webseiten) öffnet der Vollbild-Knopf
  im eingebetteten Player die ganze Videoseite. Mediensteuerung und Sperrbildschirm über Media Session.

## Webserver

Jeder statische Webserver mit HTTPS genügt. `dist/.htaccess` konfiguriert Apache (Typen, Kompression,
Cache, HTTPS-Weiterleitung), `server/nginx.conf.example` zeigt dasselbe für nginx. Byte-Ranges müssen
aktiv sein (Standard bei beiden), sonst lässt sich in Audio nicht spulen.

Deploy (cyon, FTP-Konto `agent_rsync@kisound.ch` auf `s077.cyon.net`, Kontowurzel = Website-Wurzel): Das
Skript lädt über FTPS (FTP mit TLS) hoch; SFTP lässt cyon für FTP-Konten nicht zu. Das Passwort liegt im macOS-Schlüsselbund,
Dienst `kisound.ch-deploy`, Konto `agent_rsync@kisound.ch`; ändern mit
`security add-generic-password -U -s kisound.ch-deploy -a agent_rsync@kisound.ch -w` (fragt nach dem
Passwort). Hochgeladen werden neue und geänderte Dateien, HTML zuletzt. Gelöscht wird nur mit `--prune`
und nur alte Build-Dateien mit Hash im Namen; fremde Dateien auf dem Server bleiben unberührt.

## Vor der Veröffentlichung offen

- Impressum: E-Mail und Adresse in `site.config.json` → `site.contact` (der Build warnt, solange sie fehlen).
  `site.repo` setzt den Link „See how it’s built …“ (öffentliches GitHub-Repo `samuelheinrich/kisound`).
- YouTube-/SoundCloud-Links sind abgeschaltet (`links`), die YouTube-Uploads sind noch privat.
- Echte Geräte testen: Safari (macOS/iOS), Firefox, ein Android-Handy – Ton, Synchronität, Bildrate.
- Rechte: Die Audiodateien sind im Browser abgreifbar (wie bei jedem Streaming ohne DRM).

## Lokale Projektstatistik

`npm run stats` inventarisiert die Musik-, Video- und Webordner und erzeugt
`projekt-stats.html` sowie `projekt-stats.json` im Webprojekt. Die HTML-Datei lässt
sich direkt im Browser öffnen; Daten und interaktive Auswertungen sind eingebettet.
Sie zeigt Dateien, Dateitypen, logische Grössen, eigene Codezeilen, Medien,
Node-Abhängigkeiten, Testdateien und Kennzahlen pro Track. Projektbestand,
Exporte, Archive, installierte Abhängigkeiten, Caches und Git-Verwaltung werden
getrennt gezählt.

Der Bericht ist eine lokale Momentaufnahme und wird vom Website-Build nicht
in `dist/` übernommen. Die Statistik verändert keine Musik- oder Videoquellen.
