# VIBECODER · Codefilm

Stand 14. Oktober 2026. DE und EN sind als codebasierte Browservorschau
umgesetzt und lokal geprüft. Kein MP4 exportiert; kein Website-Eintrag geändert.

Projekt: [videos/kisound/Vibecoder/01_Vibecoder](../../../../videos/kisound/Vibecoder/01_Vibecoder/README.md).

```sh
cd videos/kisound/Vibecoder/01_Vibecoder
npm ci --ignore-scripts
npm run prepare
npm run preview               # 8174, DE; EN unter ?lang=en
```

| Fassung | Finaler Prompt | Original-WAV | SHA-256 | Transkript |
| --- | --- | --- | --- | --- |
| DE | [1.0](final/de/01_Vibecoder_1.0.txt) | [WAV](final/01_Vibecoder_suno-0.1_50_50_exakt_off_DE.wav) | `2a32ee2e01c429f1a051cfe913448576d7e6615930567220aca48feada845d97` | [JSON](final/de/01_Vibecoder_Transkript.json) |
| EN | [1.0](final/en/01_Vibecoder_1.0.txt) | [WAV](final/01_Vibecoder_suno-0.1_50_50_exakt_off_EN.wav) | `0ec442b9fa84de0a6b0e781f625597192015839555d1c27d60e649df6463d514` | [JSON](final/en/01_Vibecoder_Transkript.json) |

Cover: [01_Vibecoder_cover.png](01_Vibecoder_cover.png). Das Videoprojekt
liest die Musikdateien nur; `npm run prepare` prüft die Quellen gegen
`SOURCE-MANIFEST.json`. Wenn sich eine finale Aufnahme oder das Transkript
ändert, sind Analyse, Cue-Zeiten und Filmfassung erneut zu prüfen. Die
unsichere EN-Zeile bei 03:23,740–03:27,700 ist bis zur Hörfreigabe nicht
wörtlich im Bild zu sehen.
