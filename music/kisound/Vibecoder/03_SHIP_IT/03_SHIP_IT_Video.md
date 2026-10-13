# SHIP IT · Codevideo

Stand: 12. Oktober 2026. **Live-Code in zwei Fassungen (DE/EN) umgesetzt**, geprüft und auf kisound.ch
mit Fassungswahl online: https://kisound.ch/vibecoder/03-ship-it/ (12.10.2026). Kein MP4 gerendert.

Projekt: `/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Vibecoder/03_SHIP_IT/`
([README](../../../../videos/kisound/Vibecoder/03_SHIP_IT/README.md)).

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Vibecoder/03_SHIP_IT"
npm run prepare && npm run preview      # Port 8172, deutsche Fassung; englisch: http://127.0.0.1:8172/?lang=en
```

| Fassung | Finaler Prompt | Audio | SHA-256 | Transkript |
| --- | --- | --- | --- | --- |
| DE | [final/de/03_SHIP_IT_1.0.txt](final/de/03_SHIP_IT_1.0.txt) | [03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav](final/03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav) | `689d662c3d10ba9bd08c787315635ff4bba6d97f8a5db54343486dd4c7958259` | [JSON](final/de/03_SHIP_IT_Transkript.json) |
| EN | [final/en/03_SHIP_IT_1.0.txt](final/en/03_SHIP_IT_1.0.txt) | [03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav](final/03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav) | `fd70e12809ce18389d194a1f3829c98deced25b1c24ade5a24ae81ecf2b05408` | [JSON](final/en/03_SHIP_IT_Transkript.json) |

Cover: [03_SHIP_IT_cover.png](03_SHIP_IT_cover.png) (Referenz für Pressen, Enter-Taste, Schiene, Farben). Das Projekt
liest diese Dateien nur (Prüfung per SHA-256 in `npm run prepare`). Wird eine Aufnahme oder ein Transkript ersetzt,
müssen Analyse, Zeitliste und Schnittzeiten der betroffenen Fassung neu erstellt werden. Die Analysen unter
`final/<lang>/ASTRA-AUDIO-ANALYSE.*` sind die Quelle der Kopien in `variants/<lang>/` des Projekts.
