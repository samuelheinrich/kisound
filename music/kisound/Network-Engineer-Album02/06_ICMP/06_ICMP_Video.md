# 06 ICMP – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Die Aufnahme ist in der finalen `*_1.0.txt` über `RELEASE AUDIO` ausgewählt.

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/06_ICMP/`
(Node/Three.js, Port 8158; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album02/06_ICMP"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8158/
```

Website: `kisound.ch/network-engineer-02/06-icmp/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [06_ICMP_1.0.wav](06_ICMP_1.0.wav) | Verbindliche Zeitachse dieser Transkriptfassung; unveränderte Release-Aufnahme. |
| [06_ICMP_Transkript.json](06_ICMP_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [06_ICMP_Transkript.srt](06_ICMP_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [06_ICMP_Transkript.txt](06_ICMP_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [06_ICMP_1.0.txt](06_ICMP_1.0.txt) | Beibehaltene Lyrics und Stilvorgaben; kein Nachweis der tatsächlich gesungenen Reihenfolge. |
| [06_ICMP_1.0_cover.png](06_ICMP_1.0_cover.png) | Trackcover. |

Audio-SHA-256: `1acad3bf8ff6addcf656e2b92cb0273c123230c70dfb2ce3b36f1a5b780ac823`.
Transkript-JSON-SHA-256: `307f7d74211d6f678b22e307048704a6d42ffd8b2801b95ddee0cb0e248a007f`.
Gemessene Gesamtdauer: 00:03:36.774.
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Grundlage für die Bildfolge

ICMP als Kontroll- und Fehlermeldungen des Netzes: Echo, MTU-Grenze, Time Exceeded und Redirect. Den einzelnen Meldungen die zugehörigen Transkriptzeiten zuweisen.

Die Abschnittsnamen werden nicht als gesungener Text behandelt. Instrumentale Abschnitte
haben keine Untertitel. Tempo (128 BPM, geschätzt), Bass-Einsätze und Pegellücken stammen aus der ASTRA-Analyse;
der Track endet hart ohne gemessenen Fade.

## Transkriptprüfung und spätere Vorbereitung

Die neuen Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich
gegen den Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen, Modellkonflikte
und nicht zugeordnete Prompt-Zeilen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md).

Vor Verwendung im Video Audio und Transkript mit den obigen Hashes prüfen. Bei einer neuen
Aufnahme alle drei Transkriptformate neu erstellen und die Quellen hier aktualisieren.
Bei Umbenennungen auch die späteren Quellenpfade des Videoprojekts anpassen.

