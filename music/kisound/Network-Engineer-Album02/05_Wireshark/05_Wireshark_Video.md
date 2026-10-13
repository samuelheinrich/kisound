# 05 Wireshark – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Die Aufnahme ist in der finalen `*_1.0.txt` über `RELEASE AUDIO` ausgewählt.

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/05_Wireshark/`
(Node/Three.js, Port 8156; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album02/05_Wireshark"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8156/
```

Website: `kisound.ch/network-engineer-02/05-wireshark/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [05_Wireshark_1.0.wav](05_Wireshark_1.0.wav) | Verbindliche Zeitachse dieser Transkriptfassung; unveränderte Release-Aufnahme. |
| [05_Wireshark_Transkript.json](05_Wireshark_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [05_Wireshark_Transkript.srt](05_Wireshark_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [05_Wireshark_Transkript.txt](05_Wireshark_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [05_Wireshark_1.0.txt](05_Wireshark_1.0.txt) | Beibehaltene Lyrics und Stilvorgaben; kein Nachweis der tatsächlich gesungenen Reihenfolge. |
| [05_Wireshark_1.0_cover.png](05_Wireshark_1.0_cover.png) | Trackcover. |

Audio-SHA-256: `243d6ab2160abfa883bfb86a53a73019e406f6f63986de0ebb3659570e83128c`.
Transkript-JSON-SHA-256: `88d442750d556a6aa98d11264ca41502f3c514b62d699e8fc477e01d636470c0`.
Gemessene Gesamtdauer: 00:03:15.734.
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Grundlage für die Bildfolge

Capture, Stream und sichtbare Header schrittweise untersuchen. Retransmission und Reset als Hinweise zeigen; verschlüsselten TLS-Inhalt ohne Secrets nicht als lesbare Nachricht darstellen.

Die Abschnittsnamen werden nicht als gesungener Text behandelt. Instrumentale Abschnitte
haben keine Untertitel. Tempo (108 BPM, geringe Sicherheit), Bass-Einsätze und die Pegellücke auf «dann Stille»
stammen aus der ASTRA-Analyse.

## Transkriptprüfung und spätere Vorbereitung

Die neuen Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich
gegen den Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen, Modellkonflikte
und nicht zugeordnete Prompt-Zeilen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md).

Vor Verwendung im Video Audio und Transkript mit den obigen Hashes prüfen. Bei einer neuen
Aufnahme alle drei Transkriptformate neu erstellen und die Quellen hier aktualisieren.
Bei Umbenennungen auch die späteren Quellenpfade des Videoprojekts anpassen.

