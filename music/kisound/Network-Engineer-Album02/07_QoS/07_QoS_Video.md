# 07 QoS – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Die Aufnahme ist in der finalen `*_1.0.txt` über `RELEASE AUDIO` ausgewählt.

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/07_QoS/`
(Node/Three.js, Port 8160; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/07_QoS"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8160/
```

Website: `kisound.ch/network-engineer-02/07-qos/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [07_QoS_1.0.wav](07_QoS_1.0.wav) | Verbindliche Zeitachse dieser Transkriptfassung; unveränderte Release-Aufnahme. |
| [07_QoS_Transkript.json](07_QoS_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [07_QoS_Transkript.srt](07_QoS_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [07_QoS_Transkript.txt](07_QoS_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [07_QoS_1.0.txt](07_QoS_1.0.txt) | Beibehaltene Lyrics und Stilvorgaben; kein Nachweis der tatsächlich gesungenen Reihenfolge. |
| [07_QoS_1.0_cover.png](07_QoS_1.0_cover.png) | Trackcover. |

Audio-SHA-256: `2eb5c953db38d50aaeba2bb4d1c6fd761c8764dc961b52581308b7684e30c73f`.
Transkript-JSON-SHA-256: `ec3d44d4d358ee75abe64e2c712dc00e4507fb719f5d841e11ed93065239b9a9`.
Gemessene Gesamtdauer: 00:03:59.054.
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Grundlage für die Bildfolge

Echtzeitverkehr und Bulk-Transfer teilen denselben Engpass. Zwei Queues, DSCP/Policy, Policing als Grenzentscheidung und Shaping als geglätteter Abfluss. Sprecherrollen aus dem Prompt bleiben Soll-Rollen; keine ungeprüfte akustische Zuordnung.

Die Abschnittsnamen werden nicht als gesungener Text behandelt. Instrumentale Abschnitte
haben keine Untertitel. Tempo (129 BPM, geschätzt), Bass-Einsätze, Pegellücken und der Fade ab 233,1 s stammen aus
der ASTRA-Analyse.

## Transkriptprüfung und spätere Vorbereitung

Die neuen Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich
gegen den Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen, Modellkonflikte
und nicht zugeordnete Prompt-Zeilen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md).

Vor Verwendung im Video Audio und Transkript mit den obigen Hashes prüfen. Bei einer neuen
Aufnahme alle drei Transkriptformate neu erstellen und die Quellen hier aktualisieren.
Bei Umbenennungen auch die späteren Quellenpfade des Videoprojekts anpassen.
