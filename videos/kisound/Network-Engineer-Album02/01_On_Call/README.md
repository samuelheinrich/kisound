# On Call · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 01 von Network Engineer 02. 02:17 Uhr, die Seestadt schläft, ein einziges
Fenster leuchtet: Die Bereitschaftsperson macht aus „Alles ist weg“ eine präzise Diagnose. In Zeitlupe folgt
das Bild einem einzelnen SYN durch den Router R-EDGE bis an Regel 10 der fälschlich an Gi0/0/1 gebundenen ACL
QUARANTINE. Route, Binding, Counter und Log stimmen überein; bei 146,82 s wird genau diese Bindung entfernt,
derselbe Test liefert HTTP 200 auf dem Wiedereinsatz des Basses.

Vier Räume: **Stadt**, **Schreibtisch**, **Display** und **R-EDGE innen** (mit Rackgang). 11 Kapitel,
60 Einstellungen nach dem Drehbuch, 268 Paketflüge (22 benannte Test-/Diagnosepakete), unverändertes Originalaudio.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/01_On_Call"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare           # prüft WAV/Transkript per SHA-256 und kopiert das Audio nach assets/audio
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8150/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Anderer Port: `npm run preview -- 8151`. `npm run serve` öffnet nichts.

Einstiege:

- `?t=0` Nacht · `?t=8.3` durchs Fenster · `?t=16.6` Display wird hell · `?t=22.6` INCIDENT-2042
- `?t=37.3` Rackgang bis R-EDGE · `?t=58.7` Ticket wird präzise · `?t=62.7` TEST-A (Timeout) · `?t=69.2` Pfade
- `?t=81.4` Vorher-Snapshot · `?t=84.8` Diagnose-SYN F-A1 · `?t=101.8` Präfixplatten · `?t=106.3` Verwerfung an Regel 10
- `?t=120.1` Belege · `?t=122.4` Gateway-Vergleich · `?t=129.9` Counter 40→41 · `?t=140.9` Beweiskarte
- `?t=143` Vorschau · `?t=146.8` Binding entfernt · `?t=148.8` derselbe Test · `?t=163.9` GET erreicht APP-A
- `?t=165.6` Antwortfahrt, HTTP 200 bei 169,7 · `?t=177.5` APP-B/C/CTRL-D · `?t=187.5` Ticket geschlossen · `?t=199` Schluss
- `?res=720` kleinere Vorschau · `?debug=1` Kapitel-, Shot-, Event- und Lyric-IDs
- `?w=1920&h=1080&t=108.3` Einzelbild ohne Player (QA)

Tasten: Leertaste Play/Pause, Pfeile ±1 s, Shift+Pfeil ein Bild, Home/End, 1–9 Kapitel,
L/M/F/D Schleife/Stumm/Vollbild/Cues.

## Quellen und Timing

- **Finale Release-WAV** laut `01_On_Call_1.0.txt`: `01_On_Call_1.0.wav` (bitgleich mit dem früheren Kandidaten
  `0.2`, auf dem das Stück entstand). `prepare.mjs` nimmt `RELEASE AUDIO`; ohne `_1.0.txt` `source_audio` des Transkripts.
  SHA-256 `6d10bbfdf8af4a390e4e12e9775a93b1bea7f2838d68f7bd75046ca0a290bcd1`.
- 48 kHz, 10 405 128 Samples je Kanal = **216,7735 s**; 60 fps = 13 007 Bilder.
- Transkript-SHA-256 `72957da7db3e4b2f723ca723e740254ab849618b97b4352e6d2e2746a381187c` (nach der Umbenennung;
  Zeiten und Texte unverändert, Analyse neu berechnet und identisch bis auf die Dateiverweise).
- Analyse `ASTRA-AUDIO-ANALYSE.json/.md/.png` (unverändert), 127,4 BPM geschätzt, mittlere Sicherheit.
- Drehbuch: `ASTRA-DREHBUCH.md` (Präzisierungen), Original unter `_revisions/ASTRA-DREHBUCH-original.md`.
- Schnittliste, Pakete, Bildschirmtexte und Logs: `UMSETZUNG-CUES.md`/`.json` (`npm run cues`).

Sub-Bass-Einsätze (im Test geprüft): 30,5 · 90,8 · 120,9 · 169,7 · 199,6 s. Pegellücken 29,95–30,4 s und
197,75–199,5 s. Blende ab 210,8 s.

## Fachliche Leitplanken

`src/render/model.js` ist ein redaktionelles Szenario mit simulierten Werten:

- Regel 10 verwirft jeden Verkehr ins Servernetz, solange die Bindung besteht – und nach 146,82 s nichts mehr (Test).
- CTRL-D hinter Gi0/0/2 und der Ping an die Router-Adresse 198.51.100.1 laufen nie durch die ACL (Test).
- F-A1: ein SYN (Port 51000, 0 Byte Nutzlast), Counter 40→41, passendes Log; F-A2: neue Verbindung (Port 51001).
- Ergebnisse erscheinen erst nach ihrem Test: HTTP 200 bei Ankunft (169,7 s), Dienste einzeln, Ticket danach.
- Adressen aus Dokumentationsbereichen (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24), Management 10.99.0.0/24.

## Architektur

`config.js` (Zeiten, Bass, Lücken, Kapitel, Schnitte), `model.js` (Topologie, Flüge, ACL, Counter, Dienste,
Bildschirmtexte, Logs), `display.js` (Monitorinhalt als Funktion der Zeit), `timeline.js`, `zones/city.js`,
`zones/desk.js`, `zones/screen.js`, `zones/router.js`, `overlay.js`, `film.js`, `player.js`.
Schnittstellen: `window.renderTime(t)`, `window.renderFrame(n)`, `window.FILM`, `window.__ready`, `window.__error`,
`window.player.seek(t)`; Web: `window.KISOUND_PAGE`.

## Prüfen

```sh
npm run check           # 12 Modell- und Timeline-Tests
npm run check:browser   # Standbilder aller Einstellungen, Schnittgrenzen, Determinismus, Player, 4K-Still
node src/tools/stills.mjs 108.3 169.75   # einzelne Bilder nach output/qa/stills
```

## Video exportieren (erst nach Freigabe)

```sh
kisound-render 4k --check    # nur prüfen, rendert nichts
kisound-render 1080p         # oder: npm run export:1080p
kisound-render 4k            # oder: npm run export:4k
```
