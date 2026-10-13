# 08 Out of Band – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Die Aufnahme ist in der finalen `*_1.0.txt` über `RELEASE AUDIO` ausgewählt.

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/08_Out_of_Band/`
(Node/Three.js, Port 8162; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/08_Out_of_Band"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8162/
```

Website: `kisound.ch/network-engineer-02/08-out-of-band/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [08_Out_of_Band_1.0.wav](08_Out_of_Band_1.0.wav) | Verbindliche Zeitachse dieser Transkriptfassung; unveränderte Release-Aufnahme. |
| [08_Out_of_Band_Transkript.json](08_Out_of_Band_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [08_Out_of_Band_Transkript.srt](08_Out_of_Band_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [08_Out_of_Band_Transkript.txt](08_Out_of_Band_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [08_Out_of_Band_1.0.txt](08_Out_of_Band_1.0.txt) | Beibehaltene Lyrics und Stilvorgaben; kein Nachweis der tatsächlich gesungenen Reihenfolge. |
| [08_Out_of_Band_1.0_cover.png](08_Out_of_Band_1.0_cover.png) | Trackcover. |

Audio-SHA-256: `9139796abf25839d0b7a85ee57042ebe0e1f524d5f8c0f61073e9b2b42a2427c`.
Transkript-JSON-SHA-256: `31d96fedd52205614f68229e8c240f75923552c7686090b5169584051ff00497`.
Gemessene Gesamtdauer: 00:04:24.414.
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Grundlage für die Bildfolge

Vom ausgefallenen Produktionspfad zum getrennten Console-Zugang. Kontrollierter Rollback, anschließender Service-Test und ruhiger Schluss verbinden den Track mit On Call.

Die Abschnittsnamen werden nicht als gesungener Text behandelt. Instrumentale Abschnitte
haben keine Untertitel. Tempo (126 BPM, geschätzt), Basseinsätze, Pegellücken und der Fade ab 258,5 s stammen aus
der ASTRA-Analyse.

## Transkriptprüfung und spätere Vorbereitung

Die neuen Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich
gegen den Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen, Modellkonflikte
und nicht zugeordnete Prompt-Zeilen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md).

Vor Verwendung im Video Audio und Transkript mit den obigen Hashes prüfen. Bei einer neuen
Aufnahme alle drei Transkriptformate neu erstellen und die Quellen hier aktualisieren.
Bei Umbenennungen auch die späteren Quellenpfade des Videoprojekts anpassen.
