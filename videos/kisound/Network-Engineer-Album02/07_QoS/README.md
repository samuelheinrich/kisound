# QoS · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 07 von Network Engineer 02: zwei Flows, ein Draht. Eine MQC-Maschine (IOS XE)
klassifiziert und markiert RTP als EF/46 und das Backup als Best Effort/0, policet einen RTP-Burst (1,2 Mbit/s
angeboten, 1,0 konform, Überschuss endgültig verworfen), bedient EF strikt zuerst, lässt Bulk in seiner endlichen Queue
warten und gibt alles über einen 100-Mbit/s-Parent-Shaper an den gemeinsamen 1-Gbit/s-Port.

Ein Raum: die **Maschinenhalle** mit sieben Kamerastationen. 10 Kapitel, 57 Einstellungen.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album02/07_QoS"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare
npm run preview           # http://127.0.0.1:8160/
```

Einstiege: `?t=14` Chorus · `?t=41` Q-R1 · `?t=60` Q-B17 im gespeicherten Fenster · `?t=65.4` Tail-Drop ·
`?t=68.6` Q-B18 · `?t=89` Policer-Burst · `?t=90.6` Q-RX · `?t=104.2` Q-BS wartet · `?t=114` Q-BS geht ·
`?t=126.1` Classify · `?t=141.1` Schedule · `?t=173` Ergebnisse · `?t=222.3` Passt.

## Quellen

- Finale WAV `07_QoS_1.0.wav`, SHA-256 `2eb5c953db38d50aaeba2bb4d1c6fd761c8764dc961b52581308b7684e30c73f`; 239,0535 s,
  14 344 Bilder. Analyse: [ASTRA-AUDIO-ANALYSE.md](ASTRA-AUDIO-ANALYSE.md). Drehbuch `ASTRA-DREHBUCH.md`, Original unter
  `_revisions/`. Cue-Liste `UMSETZUNG-CUES.md` (`npm run cues`).

## Prüfen und Export

```sh
npm run check           # 12 Modell- und Timeline-Tests
npm run check:browser
kisound-render 4k --check
```

Gemeinsames Vorgehen: [PRODUKTION.md](../../PRODUKTION.md).
