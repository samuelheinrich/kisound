# Firewall State Table · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 07: eine zustandsbehaftete Firewall als Mauer mit Mandala-Tor aus
Policy-Ringen, State Table über dem Tor, NAT-Prisma, DPI-Strahl und Logsäule, dazu ein Kontrollraum mit
sechs lesbaren Tafeln. 11 Kapitel, 93 Einstellungen (25 im Kontrollraum, 21 POV-Fahrten), 24 Sessions,
216 Paketflüge, 25 verworfene Pakete, unverändertes Originalaudio.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album01/07_Firewall_State_Table"
npm ci            # nur falls node_modules fehlt
npm run prepare   # prüft WAV/Transkript per SHA-256 und kopiert das Audio nach assets/audio
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8137/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Anderer Port: `npm run preview -- 8140`. `npm run serve` öffnet nichts.

Einstiege:

- `?t=9.9` erste Session · `?t=20` einzelnes Paket stirbt · `?t=24.4` Bass, Verkehr
- `?t=50.6` default deny · `?t=54` Regelkette · `?t=64.5` Handshake · `?t=65.6` UDP ohne Antwort
- `?t=70.7` Source NAT · `?t=72.8` Destination NAT · `?t=74.6` DPI
- `?t=78.6` Drop it · Log it · Block it · `?t=92.1` ACK ohne Session · `?t=95.4` Regel 0
- `?t=113.9` Least privilege · `?t=133.7` Hairpin-NAT · `?t=138.5` DPI: sauber / EICAR
- `?t=146.9` Break · `?t=183.1` Lock it · `?t=206.6` Sessions schliessen · `?t=242` Titel
- `?res=720` kleinere Vorschau · `?debug=1` Kapitel-, Shot-, Event- und Lyric-IDs
- `?w=1920&h=1080&t=80` Einzelbild ohne Player (QA)

Tasten: Leertaste Play/Pause, Pfeile ±1 s, Shift+Pfeil ein Bild, Home/End, 1–9 Kapitel,
L/M/F/D Schleife/Stumm/Vollbild/Cues.

## Bildwelt

Mauer (x = 0) mit Ziegelfugen in Orange, Tor mit fünf Regelringen, rote Deny-Membranen, Blocklist-Ring
(ab 96 s), bernsteinfarbener State-Fast-Path, NAT-Prisma vor der Aussenseite, DPI-Ring im Tor. Inside:
Laptop 10.0.0.23, Phone 10.0.0.31, Workstation 10.0.0.45, Syslog-Quelle 10.0.0.12, DMZ-Webserver
172.16.0.80. Outside: Web 198.51.100.20 (https) und 198.51.100.40 (http), DNS 192.0.2.53, Syslog-Collector
192.0.2.14, externer Client 192.0.2.77, Scanner 198.51.100.66. Boden mit zwei Punktspiralen im
142-BPM-Raster. Kontrollraum: Tafeln STATE TABLE, POLICY, PACKET, TCP HANDSHAKE, LOG, NAT im Halbkreis.
Schriften samt OFL-Lizenzen unter `assets/fonts`. Prozedurale Three.js-Geometrie, keine externen Modelle.

## Quellen und Timing

- Finale WAV laut `07_Firewall_State_Table_1.0.txt`: `07_Firewall_State_Table_0.4-2.wav`,
  SHA-256 `6fcc83f53b3146a4754354b9dfd7c8644de53bf57c992aadb76a9fc9a62f754d`.
- 48 kHz, 12 447 407 Samples je Kanal = **259,320979167 s**; 60 fps = 15 560 Bilder.
- Transkript-SHA-256 `f4b5839e4691fc9a09338a6f99475d08dddab08fd4720317a9f7613d708712ff`.
- Analyse `ASTRA-AUDIO-ANALYSE.json` (unverändert), 142 BPM geschätzt, mittlere Sicherheit.
- Drehbuch: `ASTRA-DREHBUCH.md` ist die überarbeitete Fassung, das Original liegt unter `_revisions/`.
- Schnittliste, Sessions und Drops: `UMSETZUNG-CUES.md`/`.json`, erzeugt mit `npm run cues`.

Bass-Einsätze aus den 100-ms-Zeilen (im Test geprüft): 24,95 · 45,65 · 84,95 · 105,25 · 126,35 · 167,75 ·
195,25 · 215,55 · 229,05 s. Pegellücke 228,35–228,45 s. Blende ab 256,8 s (nach dem Fade-Kandidaten 253,4 s).

## Fachliche Leitplanken

`src/render/model.js` ist ein redaktionelles Szenario, kein Mitschnitt:

- Das erste Paket jeder Session wird gegen die Policy geprüft (first match, implizites Deny zuletzt),
  alle weiteren nehmen den State-Pfad. Unaufgeforderte Pakete und ein ACK ohne Session werden verworfen.
- TCP-Zustände in der Reihenfolge SYN_SENT → SYN_RECV → ESTABLISHED → FIN_WAIT → TIME_WAIT; UDP ohne
  Handshake mit 30-s-Timeout (Syslog UNREPLIED, DNS REPLIED).
- PAT auf 203.0.113.10; DNAT 203.0.113.10:443 → 172.16.0.80:443; Hairpin mit DNAT plus SNAT.
  Inside-Adressen erscheinen ausserhalb des Prismas nie (Test).
- IPS: EICAR-Testsignatur im HTTP-Download → Drop im DPI-Ring, Reset beider Seiten.
- Zeiten verdichtet, Adressen aus Dokumentationsbereichen.

## Architektur

`config.js` (Zeiten, Bass-Struktur, Kapitel, Schnitte), `model.js` (Hosts, Routen durchs Tor, Sessions,
Flüge, Policy, State Table, NAT, Logs), `timeline.js`, `zones/gate.js`, `zones/ledger.js`, `overlay.js`
(Titel, Wörter, Kopfzeile, Log), `film.js`, `player.js`. Schnittstellen: `window.renderTime(t)`,
`window.renderFrame(n)`, `window.FILM`, `window.__ready`, `window.__error`, `window.player.seek(t)`.

## Prüfen

```sh
npm run check           # 14 Modell- und Timeline-Tests
npm run check:browser   # Standbilder aller Einstellungen, Schnittgrenzen, Determinismus, Player, 4K-Still
node src/tools/stills.mjs 23.15 148.8   # einzelne Bilder nach output/qa/stills
```

## Video exportieren (erst nach Freigabe)

```sh
kisound-render 4k --check    # nur prüfen, rendert nichts
kisound-render 1080p         # oder: npm run export:1080p
kisound-render 4k            # oder: npm run export:4k
```

Ausgabe unter `output/07_Firewall_State_Table_<auflösung>_<UTC-Zeitstempel>.mp4` mit Log und JSON-Prüfbericht.
