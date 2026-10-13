# Broadcast Storm · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 04 von Network Engineer 02: Ein falsch gestecktes Patchkabel SW3/24 ↔ SW1/24
schliesst bei 15,58 s einen Ring in VLAN 120, Spanning Tree ist dort deaktiviert. Der ARP-Broadcast B-001 kreist ohne
Ende, jeder weitere Broadcast kreist mit – Links voll, Queues verwerfen, die H1-MAC springt, Management weg. Über die
serielle Console wird Gi1/0/24 identifiziert und bei 163,0 s abgeschaltet; die Flut zieht ab.

Drei Räume: **Switchdreieck**, **SW3 innen** (Queues, MAC-Tafel, CPU) und **Console**. 12 Kapitel, 58 Einstellungen.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/04_Broadcast_Storm"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare
npm run preview           # http://127.0.0.1:8154/
```

Einstiege: `?t=0` offene Kette · `?t=10.4` Kabel · `?t=15.6` Ring geschlossen · `?t=22.3` B-001 · `?t=36.7` MAC-Tafel ·
`?t=44` Ringrunde · `?t=60.1` Queues voll · `?t=86.5` Broadcast Storm · `?t=110.5` Loop/Flood · `?t=130.1` Zieh das Kabel
· `?t=131.7` Suchlicht · `?t=142.5` SSH-Timeout, Console · `?t=153.8` Gi1/0/24 · `?t=161.4` shutdown · `?t=166.6` Flut zieht
ab · `?t=186.7` Prüfung · `?t=194.1` Unicast-Test.

## Quellen

- Finale WAV `04_Broadcast_Storm_1.0.wav`, SHA-256 `00a640de0f76551e27719ad0c4c0f106133fd26c4d33f4f7e3d5b71cbadec352`;
  208,8135 s, 12 529 Bilder bei 60 fps. Analyse unverändert (175 BPM geschätzt).
- Drehbuch `ASTRA-DREHBUCH.md` (Präzisierungen), Original unter `_revisions/`; Cues `UMSETZUNG-CUES.md`/`.json`.

## Prüfen und Export

```sh
npm run check           # 12 Modell- und Timeline-Tests
npm run check:browser   # Standbilder, Schnittgrenzen, Determinismus, Player, 4K-Still
kisound-render 4k --check
```
