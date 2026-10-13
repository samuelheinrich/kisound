# MTU · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 08: ein PMTUD-Black-Hole. Host A lädt `report.pdf` zu Server B hoch;
volle 1500-Byte-Segmente mit DF=1 sterben am Eingang eines IPsec-Tunnels (MTU 1400), das ICMP
„fragmentation needed“ verschluckt die Firewall, Ping geht trotzdem. Nach der gezielten Freigabe lernt
der Host Path MTU 1400 und sendet dieselben Daten in passenden Paketen; das Tor bleibt gleich gross.
Zwei Räume: der nächtliche **Pfad** und eine helle **Messhalle**. 11 Kapitel, 62 Einstellungen
(11 POV-Fahrten, 20 in der Messhalle), 122 Paketflüge, unverändertes Originalaudio.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album01/08_MTU"
npm ci            # nur falls node_modules fehlt
npm run prepare   # prüft WAV/Transkript per SHA-256 und kopiert das Audio nach assets/audio
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8138/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Anderer Port: `npm run preview -- 8139`. `npm run serve` öffnet nichts.

Einstiege:

- `?t=3.9` erster Drop in der Pegellücke · `?t=7.4` ICMP stirbt an der Firewall
- `?t=16` Ping durch den Tunnel · `?t=23.3` 1400 gegen 1401 Bytes · `?t=35.6` Upload steht
- `?t=40.7` tracepath · `?t=42.5` das Tor erscheint · `?t=43.7` 100 Bytes Überstand
- `?t=48` erster Chorus (scheitert) · `?t=61.6` Hook · `?t=76` Tunnelhülle · `?t=85.5` ICMP verfolgen
- `?t=90.5` Break: 1400 / 1500 / Jumbo / Path MTU · `?t=98.9` Firewall-Freigabe · `?t=102.6` Neuaufbau
- `?t=104.9` Final Chorus (passt) · `?t=116.8` Upload fertig · `?t=133.2` Titel und letztes Paket
- `?res=720` kleinere Vorschau · `?debug=1` Kapitel-, Shot-, Event- und Lyric-IDs
- `?w=1920&h=1080&t=80` Einzelbild ohne Player (QA)

Tasten: Leertaste Play/Pause, Pfeile ±1 s, Shift+Pfeil ein Bild, Home/End, 1–9 Kapitel,
L/M/F/D Schleife/Stumm/Vollbild/Cues.

## Bildwelt

Pfad von links nach rechts: Host A (Upload-Fenster, Sendewarteschlange) → Firewall 192.0.2.1 → R1
203.0.113.1 → R2 203.0.113.2 mit dem Tor → IPsec-Tunnel → R3 198.51.100.1 → Server B 198.51.100.20 mit
Mosaik. Hinweg blau, Rückweg orange. Paket: Höhe = Bytes × 0,0021, Glaskörper mit magentafarbenem Kern,
Header, orange DF-Klammer, violette Tunnelhülle. Pings cyan, Replies grün, ICMP bernsteinfarben.
Das Tor (Öffnung genau 1400 Bytes) wird bei 42,5 s sichtbar; M-T-U darüber rot vor, grün nach der Lösung.

Messhalle: gleicher Byte-Massstab ×1,6, Lineal 0–1600 Bytes, Tunnel-Rahmen 1400, Link-Rahmen 1500,
Rahmenreihe für die Path MTU, eigene Jumbo-Bahn (MTU 9000). Terminal links im Pfad, Upload-Dialog,
kinetische Wörter für Hook und Break, maximal drei Log-Zeilen. Schriften samt OFL-Lizenzen unter
`assets/fonts`. Prozedurale Three.js-Geometrie, keine externen Modelle.

## Quellen und Timing

- Finale WAV laut `08_MTU_1.0.txt`: `08_MTU_0.2-2.wav`,
  SHA-256 `23491387e4f9c2740fafcc48bde924377e5de66f63fc423ae743d02fde03e75d`.
- 48 kHz, 6 672 008 Samples je Kanal = **139,000166667 s**; 60 fps = 8341 Bilder.
- Transkript-SHA-256 `e4e28e0e9c421c226e84999da448e9714cdcd7ad11caccd4cf5cabe9813ac1da` (in `config.js`
  festgelegt; die frühe Analyse enthält keinen Transkript-Hash, `prepare` prüft zusätzlich die WAV-Prüfsumme
  im Transkript).
- Analyse `ASTRA-AUDIO-ANALYSE.json` (unverändert, frühes v1-Format: Lyrics als Liste ohne Abschnitte,
  Events mit `kind`). `timeline.js` normalisiert beim Laden; Abschnitte kommen aus den Transkript-Sektionen
  (`LYRIC_SECTIONS` in `config.js`, im Test gegen das Transkript geprüft). 135 BPM geschätzt.
- Drehbuch: `ASTRA-DREHBUCH.md` ist die überarbeitete Fassung, das Original liegt unter `_revisions/`.
- Schnittliste: `UMSETZUNG-CUES.md`/`.json`, erzeugt mit `npm run cues`.

Strukturelle Einsätze aus den Events: 16,01 · 48,0 · 104,88 · 122,64 s. Pegellücke 5,15–5,25 s
(100-ms-RMS −54 dBFS): erster Drop. Blende ab 137,8 s, letztes Paket am Tor auf 137,69 s.

## Fachliche Leitplanken

`src/render/model.js` ist ein redaktionelles Szenario, kein Mitschnitt:

- IPv4. Pakete über 1400 Bytes mit DF sterben am Tunneleingang; kein Router fragmentiert.
- Jeder Drop erzeugt genau ein ICMP Type 3 / Code 4 mit mtu 1400. Vor der Freigabe (99,3 s) verwirft die
  Firewall alle, danach erreicht das nächste den Host (101,11 s), der Path MTU 1400 lernt.
- Ping (84 Bytes) und ein 1400-Byte-Ping mit DF funktionieren immer; das ist das typische Symptom.
- Nach dem Lernen gehen nur noch Pakete ≤ 1400 Bytes raus (MSS 1360). Die Datei hat 42 920 Bytes in 32
  Segmenten; im Test wird nachgerechnet, dass kein Byte verloren geht.
- Retransmits folgen der Musik, nicht dem echten RTO-Backoff. Adressen stammen aus den Dokumentationsbereichen.

## Architektur

`config.js` (Zeiten, Kapitel, Schnitte), `model.js` (Pfad, Flüge, Drops, ICMP, PMTU, Upload, Terminaltexte),
`timeline.js` (Normalisierung der Analyse, Cues, Blende), `zones/path.js`, `zones/lab.js`, `overlay.js`
(Titel, Terminal, Wörter, Upload-Dialog, Log), `film.js`, `player.js`. Schnittstellen: `window.renderTime(t)`,
`window.renderFrame(n)`, `window.FILM`, `window.__ready`, `window.__error`, `window.player.seek(t)`.

## Prüfen

```sh
npm run check           # 16 Modell- und Timeline-Tests
npm run check:browser   # Standbilder aller Einstellungen, Schnittgrenzen, Determinismus, Player, 4K-Still
node src/tools/stills.mjs 5.2 107.4   # einzelne Bilder nach output/qa/stills
```

## Video exportieren (erst nach Freigabe)

```sh
kisound-render 4k --check    # nur prüfen, rendert nichts
kisound-render 1080p         # oder: npm run export:1080p
kisound-render 4k            # oder: npm run export:4k
```

Ausgabe unter `output/08_MTU_<auflösung>_<UTC-Zeitstempel>.mp4` mit Log und JSON-Prüfbericht.
Optionen und Wiederaufnahme: zentrales README unter `videos/kisound/README.md`.
