# 01 On Call – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Es nutzt die finale Release-WAV aus `01_On_Call_1.0.txt` (bitgleich mit dem früheren Kandidaten 0.2).

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/01_On_Call/`
(Node/Three.js, Port 8150; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album02/01_On_Call"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8150/
```

Website: `kisound.ch/network-engineer-02/01-on-call/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [01_On_Call_1.0.wav](01_On_Call_1.0.wav) | Finale Release-WAV laut `RELEASE AUDIO`; verbindliche Zeitachse und einzige Tonquelle des Videos. |
| [01_On_Call_Transkript.json](01_On_Call_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [01_On_Call_Transkript.srt](01_On_Call_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [01_On_Call_Transkript.txt](01_On_Call_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [01_On_Call_1.0.txt](01_On_Call_1.0.txt) | Finaler Prompt: Lyrics (Website-Text) und Stilvorgaben. |
| [01_On_Call_1.0_cover.png](01_On_Call_1.0_cover.png) | Cover; Referenz für Farben und Bildwelt. |
| [ASTRA-DREHBUCH.md](ASTRA-DREHBUCH.md) | Vorlage; überarbeitete Fassung und Original im Videoprojekt. |

Audio-SHA-256: `6d10bbfdf8af4a390e4e12e9775a93b1bea7f2838d68f7bd75046ca0a290bcd1`.
Transkript-JSON-SHA-256: `72957da7db3e4b2f723ca723e740254ab849618b97b4352e6d2e2746a381187c`.
Gemessene Gesamtdauer: 00:03:36.774 (10 405 128 Samples bei 48 kHz).
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Transkriptprüfung

Die Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich gegen den
Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md). Quellen nicht umbenennen oder verschieben,
ohne diese Datei und das Videoprojekt (`src/tools/prepare.mjs`, `src/render/config.js`) anzupassen.
