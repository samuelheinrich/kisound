# Wireshark · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 05 von Network Engineer 02: „Bei mir geht’s“ – „Bei mir nicht“. Zwei SPAN-Mitschnitte
vor und hinter einem 100-Mbit/s-Uplink zeigen, dass Seq=12001 SW-A erreicht, SW-B aber nie; nur die Retransmission
kommt an. +18 Output-Drops am SW-A-Uplink und null Capture-Drops lokalisieren den Verlust unter Konkurrenzlast. Der
kontrollierte Versuch (Bulk 95 → 20 Mbit/s) bestätigt: derselbe Test, neue Verbindung, HTTP 200. TLS bleibt verschlüsselt.

Vier Räume: **Rack/Pfad**, **Analysefenster**, **BEFORE | AFTER**, **Protokollschichten**. 12 Kapitel, 61 Einstellungen.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/05_Wireshark"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare
npm run preview           # http://127.0.0.1:8156/
```

Einstiege: `?t=0` Rack · `?t=17.4` M-B101 zum Analyzer · `?t=25` Capture läuft · `?t=44.5` erster Vergleich · `?t=70.3`
Displayfilter · `?t=73.5` tcp.stream == 7 · `?t=89.3` Hook · `?t=105.9` O-101 verliert sich · `?t=108.8` Retransmission ·
`?t=122.1` zweiter Capture grenzt ein · `?t=124.7` TLS · `?t=137.3` Befund · `?t=139.8` Versuch · `?t=142.7` neuer Test ·
`?t=157.3` HTTP 200 · `?t=168.2` Capture STOPPED · `?t=193.3` Warum.

## Quellen

- Finale WAV `05_Wireshark_1.0.wav`, SHA-256 `243d6ab2160abfa883bfb86a53a73019e406f6f63986de0ebb3659570e83128c`;
  195,7335 s, 11 745 Bilder. Analyse unverändert. Drehbuch `ASTRA-DREHBUCH.md`, Original unter `_revisions/`.

## Prüfen und Export

```sh
npm run check           # 10 Modell- und Timeline-Tests
npm run check:browser
kisound-render 4k --check
```
