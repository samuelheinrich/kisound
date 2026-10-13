# 04 Broadcast Storm – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Die Aufnahme ist in der finalen `*_1.0.txt` über `RELEASE AUDIO` ausgewählt.

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/04_Broadcast_Storm/`
(Node/Three.js, Port 8154; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/04_Broadcast_Storm"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8154/
```

Website: `kisound.ch/network-engineer-02/04-broadcast-storm/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [04_Broadcast_Storm_1.0.wav](04_Broadcast_Storm_1.0.wav) | Verbindliche Zeitachse dieser Transkriptfassung; unveränderte Release-Aufnahme. |
| [04_Broadcast_Storm_Transkript.json](04_Broadcast_Storm_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [04_Broadcast_Storm_Transkript.srt](04_Broadcast_Storm_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [04_Broadcast_Storm_Transkript.txt](04_Broadcast_Storm_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [04_Broadcast_Storm_1.0.txt](04_Broadcast_Storm_1.0.txt) | Beibehaltene Lyrics und Stilvorgaben; kein Nachweis der tatsächlich gesungenen Reihenfolge. |
| [04_Broadcast_Storm_1.0_cover.png](04_Broadcast_Storm_1.0_cover.png) | Trackcover. |

Audio-SHA-256: `00a640de0f76551e27719ad0c4c0f106133fd26c4d33f4f7e3d5b71cbadec352`.
Transkript-JSON-SHA-256: `22c0798101f354447cd67b1858d417fdf0c4e98018d92e879034fdbc499225d2`.
Gemessene Gesamtdauer: 00:03:28.814.
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Grundlage für die Bildfolge

Layer-2-Loop mit sich vervielfachenden Frames, steigender Switch-Last und dem entscheidenden Port-down. Schnelle Bildfolge zum Drum-and-Bass-Charakter; keine erfundenen BPM- oder Kick-Marken.

Die Abschnittsnamen werden nicht als gesungener Text behandelt. Instrumentale Abschnitte
haben keine Untertitel. Tempo (175 BPM, geschätzt), Bass-Einsätze und der Pegelabfall nach «Zieh das Kabel» stammen aus
der ASTRA-Analyse; ein harter Schnitt bei «Ein Port down» ist nicht messbar.

## Transkriptprüfung und spätere Vorbereitung

Die neuen Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich
gegen den Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen, Modellkonflikte
und nicht zugeordnete Prompt-Zeilen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md).

Vor Verwendung im Video Audio und Transkript mit den obigen Hashes prüfen. Bei einer neuen
Aufnahme alle drei Transkriptformate neu erstellen und die Quellen hier aktualisieren.
Bei Umbenennungen auch die späteren Quellenpfade des Videoprojekts anpassen.

