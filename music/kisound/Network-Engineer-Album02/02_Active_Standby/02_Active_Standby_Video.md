# 02 Active / Standby – Musikvideo-Quellen

**Status:** Live-Code-Stück als Browservorschau umgesetzt und technisch geprüft; kein MP4-Export.
Die Aufnahme ist in der finalen `*_1.0.txt` über `RELEASE AUDIO` ausgewählt.

Videoprojekt: `0004_git/videos/kisound/Network-Engineer-Album02/02_Active_Standby/`
(Node/Three.js, Port 8152; README und ABNAHME dort).

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/02_Active_Standby"
npm run prepare   # prüft WAV und Transkript per SHA-256, kopiert das Audio
npm run preview   # http://127.0.0.1:8152/
```

Website: `kisound.ch/network-engineer-02/02-active-standby/live/`.

## Dateien und Zeitbezug

| Datei | Rolle |
|---|---|
| [02_Active_Standby_1.0.wav](02_Active_Standby_1.0.wav) | Verbindliche Zeitachse dieser Transkriptfassung; unveränderte Release-Aufnahme. |
| [02_Active_Standby_Transkript.json](02_Active_Standby_Transkript.json) | Gesangszeilen, Abschnittsgrenzen und Audio-SHA-256. |
| [02_Active_Standby_Transkript.srt](02_Active_Standby_Transkript.srt) | Untertitel mit derselben Zeitachse. |
| [02_Active_Standby_Transkript.txt](02_Active_Standby_Transkript.txt) | Lesbares Transkript mit Zeitmarken. |
| [02_Active_Standby_1.0.txt](02_Active_Standby_1.0.txt) | Beibehaltene Lyrics und Stilvorgaben; kein Nachweis der tatsächlich gesungenen Reihenfolge. |
| [02_Active_Standby_1.0_cover.png](02_Active_Standby_1.0_cover.png) | Trackcover. |

Audio-SHA-256: `42750eb28bf676ef697bc26cddb9c28ec62390336e462783111b69db2446c86c`.
Transkript-JSON-SHA-256: `a3a1ccaba0e3d7604a47d5f666becbde8d2052ddc68a89b1cb2b0526e7ca71dc`.
Gemessene Gesamtdauer: 00:03:23.174.
Alle Zeitmarken beziehen sich auf den Dateianfang bei 0 Sekunden, ohne Beschnitt oder Versatz.

## Grundlage für die Bildfolge

Zwei Geräte mit festen Rollen. Heartbeat als Monitor-Puls; Flatline beim Verlust des Heartbeat-Links, während der Datenpfad von Voice A aktiv bleibt. Split Brain, Isolation und Rollenwechsel anhand der Gesangszeiten zeigen. Sprecherangaben aus dem Prompt sind Soll-Rollen, keine akustische Sprechererkennung.

Die Abschnittsnamen werden nicht als gesungener Text behandelt. Tempo (134 BPM, geschätzt) und
Bass-Einsätze stammen aus der ASTRA-Analyse; ein Monitor-Ton um 555 Hz ist messbar, ein dominanter
Flatline-Dauerton nicht – das Video zeigt die Flatline deshalb als fehlenden Heartbeat-Empfang.

## Transkriptprüfung und spätere Vorbereitung

Die neuen Zeitmarken stammen aus lokalem Whisper-ASR mit Wortzeiten und einem Abgleich
gegen den Lyric-Prompt. Keine manuelle Hörprüfung. Unsichere Textstellen, Modellkonflikte
und nicht zugeordnete Prompt-Zeilen stehen in
[TRANSKRIPT-PRUEFUNG.md](../TRANSKRIPT-PRUEFUNG.md).

Vor Verwendung im Video Audio und Transkript mit den obigen Hashes prüfen. Bei einer neuen
Aufnahme alle drei Transkriptformate neu erstellen und die Quellen hier aktualisieren.
Bei Umbenennungen auch die Quellenpfade des Videoprojekts anpassen (`src/tools/prepare.mjs`,
`src/render/config.js`).
