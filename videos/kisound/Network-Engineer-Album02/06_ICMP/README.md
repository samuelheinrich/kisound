# ICMP · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 06 von Network Engineer 02: ICMP ist mehr als ein Ping – an realen Orten. Ein
Laptop in einem Büro in Zürich pingt einen Server im Rechenzentrum in New York. Auf dem Desktop laufen Terminal und
tcpdump (jedes Paket im echten tcpdump-Format), auf der Weltkugel fliegen die Pakete über Frankfurt (Tunnel mit MTU
1400) und den Atlantik. Fünf Vorgänge: Echo (8/0 → 0/0, 92,4 ms), PMTUD (1500-Byte-DF-Datagramm in Frankfurt verworfen,
3/4 mit MTU 1400, neues 1400-Byte-Datagramm), Traceroute (11/0 vom Heimrouter im Regal und aus Frankfurt), Port
Unreachable (3/3 vom Server in New York) und Host Redirect (5/1 im Büro-LAN, Gateway 192.0.2.2). Jede Fehlerantwort
trägt ein Zitat ihres Originals.

Räume: **Büro Zürich**, **Laptop-Desktop**, **Weltkugel**, **Rechenzentrum New York**, **Headerkarten**.
12 Kapitel, 81 Einstellungen. Küstenlinien: Natural Earth 1:110m (gemeinfrei).

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album02/06_ICMP"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare
npm run preview           # http://127.0.0.1:8158/
```

Einstiege: `?t=2` Büro · `?t=9` Desktop · `?t=13` Weltkugel · `?t=27` ping · `?t=30` Echo Reply über den Atlantik ·
`?t=46` Rechenzentrum New York · `?t=84.2` Drop in Frankfurt · `?t=89` 3/4 zurück · `?t=117` TTL läuft am Heimrouter ab ·
`?t=126` Frankfurt 11/0 · `?t=128` Port Unreachable in New York · `?t=148` P-M2 durch den Tunnel · `?t=158` Redirect im Regal ·
`?t=160` tcpdump · `?t=213` zurück zum Fenster.

## Quellen

- Finale WAV `06_ICMP_1.0.wav`, SHA-256 `1acad3bf8ff6addcf656e2b92cb0273c123230c70dfb2ce3b36f1a5b780ac823`; 216,7735 s,
  13 007 Bilder. Analyse unverändert. Drehbuch `ASTRA-DREHBUCH.md` (Schnittliste aus `python3 src/tools/shotlist.py`), Original unter `_revisions/`.

## Prüfen und Export

```sh
npm run check           # 12 Modell- und Timeline-Tests
npm run check:browser
kisound-render 4k --check
```
