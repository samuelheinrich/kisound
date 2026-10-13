# Destination Unreachable · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 04: eine Traceroute-Ermittlung durch einen nächtlichen Backbone. Ein
Probe-Host erreicht 203.0.113.45 nicht: R4 verwirft Site B lautlos über eine vergessene Blackhole-Route
nach Null0 (wächst von /32 auf /24), R2 fehlt das Präfix von Site C und meldet Destination Unreachable.
Zwei Räume: der **Backbone** mit dem schwarzen Loch und die **Nebelkarte** mit Beweiszetteln.
10 Kapitel, 85 Einstellungen (20 an der Karte, 21 POV-Fahrten), 150 Paketflüge, 78 Pakete in Null0,
36 empfangene Meldungen, unverändertes Originalaudio.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album01/04_Destination_Unreachable"
npm ci            # nur falls node_modules fehlt
npm run prepare   # prüft WAV/Transkript per SHA-256 und kopiert das Audio nach assets/audio
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8141/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Anderer Port: `npm run preview -- 8142`. `npm run serve` öffnet nichts.

Einstiege:

- `?t=3.7` erstes Unreachable · `?t=6.5` Time Exceeded · `?t=9.7` Fall in Null0 · `?t=17.9` TTL läuft ab
- `?t=30.7` ein Signal in den Kern · `?t=45.4` Hook · `?t=55.2` Blackhole wächst · `?t=58.4` Pause und Drop
- `?t=81.7` Traceroute · `?t=87` Firewall still · `?t=101.4` Metrikwechsel · `?t=105` R4-Tabelle
- `?t=110.2` Break · `?t=132.3` Final Hook · `?t=163.8` Finale · `?t=172.5` Befunde · `?t=241` Titel
- `?res=720` kleinere Vorschau · `?debug=1` Kapitel-, Shot-, Event- und Lyric-IDs
- `?w=1920&h=1080&t=80` Einzelbild ohne Player (QA)

Tasten: Leertaste Play/Pause, Pfeile ±1 s, Shift+Pfeil ein Bild, Home/End, 1–9 Kapitel,
L/M/F/D Schleife/Stumm/Vollbild/Cues.

## Bildwelt

Türme: Probe-Host 192.0.2.10 → R1 192.0.2.1 → R2 198.18.0.2 → R3 198.18.0.3 (ab 101,4 s R3b 198.18.0.13)
→ R4 198.18.0.4 → R5 → Firewall B 203.0.113.1 → Server 203.0.113.45 / 203.0.113.80; Abzweig von R2 zu Site C
198.51.100.0/24 (rot gestrichelt, Route fehlt). Neben R4 das schwarze Loch mit rotem Gegenlicht und
Partikelring. Echo Request cyan, Reply grün, Traceroute-Probe weiss mit TTL-Anzeige, Time-Exceeded-Zettel
weiss, Unreachable-Zettel rot. Kartentisch mit Nebel, Hop-Nummern, `* * *`, ICMP-Zetteln, Tabellen von R2
und R4, Firewall-Log, Befund-Akte und Terminal. Schriften samt OFL-Lizenzen unter `assets/fonts`.

## Quellen und Timing

- Finale WAV laut `04_Destination_Unreachable_1.0.txt`: `04_Destination_Unreachable_0.3-1.wav`,
  SHA-256 `883d8e9f06995b5c82548cfb54a74ecf08ae89f825a1f92ab8613dd1807ef9c3`.
- 48 kHz, 12 470 447 Samples je Kanal = **259,800979167 s**; 60 fps = 15 589 Bilder.
- Transkript-SHA-256 `94773efae00f3623833f4ff13f5a21bc3d23e7742a419357ab4ea11e4c1974a2`.
- Analyse `ASTRA-AUDIO-ANALYSE.json` (unverändert), 132 BPM geschätzt, mittlere Sicherheit.
- Drehbuch: `ASTRA-DREHBUCH.md` ist die überarbeitete Fassung, das Original liegt unter `_revisions/`.
- Schnittliste, Traceroutes und empfangene Meldungen: `UMSETZUNG-CUES.md`/`.json` (`npm run cues`).

Sub-Bass-Einsätze (im Test geprüft): 58,75 · 73,35 · 95,15 · 124,25 · 131,95 · 160,55 · 175,15 · 187,85 ·
198,75 · 209,45 · 220,55 · 233,35 · 236,95 · 246,55 s. Pegellücke 58,45 s vor dem ersten Drop.
Blende ab 256,6 s.

## Fachliche Leitplanken

`src/render/model.js` ist ein redaktionelles Szenario, kein Mitschnitt:

- Null0 (RTBH) verwirft ohne ICMP; Unreachable kommt nur von R2 (fehlende Route), Test.
- Traceroute: Hops 1–4 antworten mit Time Exceeded (R4 auf TTL 4 noch selbst), ab Hop 5 `* * *`.
- Die Nebelkarte lichtet sich nur, wo eine Antwort ankam; R5, Firewall B, der Server und Site C bleiben im Nebel.
- RTBH /32 → /24 auf „The blackhole grows“; Metrikwechsel auf „Metrics shift“.
- Zeiten verdichtet, Adressen aus Benchmark- und Dokumentationsbereichen.

## Architektur

`config.js` (Zeiten, Bass, Kapitel, Schnitte), `model.js` (Knoten, Kabel, Weiterleitung über die Zeit, Ping,
Traceroute, ICMP, Beweise, Routing-Tabellen, Logs), `timeline.js`, `zones/backbone.js`, `zones/map.js`,
`overlay.js`, `film.js`, `player.js`. Schnittstellen: `window.renderTime(t)`, `window.renderFrame(n)`,
`window.FILM`, `window.__ready`, `window.__error`, `window.player.seek(t)`.

## Prüfen

```sh
npm run check           # 12 Modell- und Timeline-Tests
npm run check:browser   # Standbilder aller Einstellungen, Schnittgrenzen, Determinismus, Player, 4K-Still
node src/tools/stills.mjs 59.9 246   # einzelne Bilder nach output/qa/stills
```

## Video exportieren (erst nach Freigabe)

```sh
kisound-render 4k --check    # nur prüfen, rendert nichts
kisound-render 1080p         # oder: npm run export:1080p
kisound-render 4k            # oder: npm run export:4k
```

Ausgabe unter `output/04_Destination_Unreachable_<auflösung>_<UTC-Zeitstempel>.mp4` mit Log und JSON-Prüfbericht.
