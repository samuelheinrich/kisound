# Vibecoder · Codebasierte Musikvideos

Stand: 14. Oktober 2026. Projektort:
`/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Vibecoder/`.

**VIBECODER ist als Codefilm in beiden Fassungen (DE/EN) umgesetzt:**
72 Einstellungen je Fassung, Original-WAVs mit eigenen Laufzeiten, lokal
geprüfte Browserfassung. Kein MP4 und noch kein Website-Eintrag.
**TOKEN BURN ist als Live-Code in beiden Fassungen (DE/EN) umgesetzt.**
Deutsch und Englisch haben eigene Zeitlisten, sechs grosse TOKEN-BURN-Einsätze,
identisch übernommene Audioanalysen und Verweise auf ihre finalen Musikquellen.
**SHIP IT ist als Live-Code in beiden Fassungen (DE/EN) umgesetzt** (34 Einstellungen je Sprache, Port 8172), online seit 12.10.2026. Die vier übrigen Tracks besitzen vorbereitete Ordner für ihre spätere Produktion.

| Track | Stand | Einstieg |
| --- | --- | --- |
| 01 · VIBECODER | Codefilm DE/EN, 72 Einstellungen je Fassung, Browservorschau geprüft (Port 8174); Web-Integration und MP4 offen | [Drehbuch](01_Vibecoder/ASTRA-DREHBUCH.md) · [Projekt](01_Vibecoder/README.md) |
| 02 · TOKEN BURN | Live-Code DE/EN, online auf kisound.ch mit Fassungswahl (Port 8170) | [Drehbuch](02_Token_Burn/ASTRA-DREHBUCH.md) · [Projekt](02_Token_Burn/README.md) |
| 03 · SHIP IT | Live-Code DE/EN, online mit Fassungswahl (Port 8172, 12.10.2026) | [Drehbuch](03_SHIP_IT/ASTRA-DREHBUCH.md) · [Projekt](03_SHIP_IT/README.md) |
| 04 · AI SLOP | Platzhalter; Überarbeitung offen | [Projekt](04_AI_Slop/README.md) |
| 05 · HALLUCINATION | Platzhalter; Überarbeitung offen | [Projekt](05_Hallucination/README.md) |
| 06 · CONTEXT WINDOW | Platzhalter; Überarbeitung offen | [Projekt](06_Context_Window/README.md) |

```text
Vibecoder/
├── README.md
├── 01_Vibecoder/  # Filmcode, DE/EN-Cues, Analysen, Quellenmanifest
├── 02_Token_Burn/
│   ├── ASTRA-DREHBUCH.md
│   ├── SCHNITTLISTE.md
│   ├── REGIE-CUES.json
│   ├── SOURCE-MANIFEST.json
│   ├── variants/de/
│   ├── variants/en/
│   ├── assets/{audio,fonts}/
│   ├── src/{render,tools}/
│   └── output/qa/
├── 03_SHIP_IT/
├── 04_AI_Slop/
├── 05_Hallucination/
└── 06_Context_Window/
```

Die drei Platzhalter enthalten `README.md`, `variants/de`, `variants/en`,
`assets/audio`, `assets/fonts`, `src/render`, `src/tools` und `output/qa`.
Leere Sprachordner legen keine finale Release-Auswahl fest.

Die Musikquellen bleiben unter `music/kisound/Vibecoder`. Der Videoordner spiegelt
deren Tracknamen einschliesslich **03_SHIP_IT**. Die Codevideo-Struktur und die
60-fps-Schnittstelle aus `videos/kisound/PRODUKTION.md` gelten für alle
Umsetzungen. Der VIBECODER-Film legt keine Website-Einträge oder Exportdateien an.
