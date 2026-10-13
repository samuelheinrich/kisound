# Vibecoder · Codebasierte Musikvideos

Stand: 12. Oktober 2026. Geplanter Ort:
`/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Vibecoder/`.

**TOKEN BURN ist als Drehbuch mit 58 Einstellungen pro Sprache ausgearbeitet.**
Deutsch und Englisch haben eigene Zeitlisten, sechs grosse TOKEN-BURN-Einsätze,
identisch übernommene Audioanalysen und Verweise auf ihre finalen Musikquellen.
**SHIP IT** hat ein eigenes Drehbuch mit 34 Einstellungen je Sprache, Zeitlisten und SHA-gesicherten Quellen. Die vier übrigen Tracks besitzen vorbereitete Ordner für ihre spätere Produktion.

| Track | Stand | Einstieg |
| --- | --- | --- |
| 01 · VIBECODER | Archivierter Video-Platzhalter; DE/EN-Audio inzwischen final, Transkript und Analyse in `music/kisound/Vibecoder/01_Vibecoder/final/` | [Projekt](01_Vibecoder/README.md) |
| 02 · TOKEN BURN | Drehbuch und Produktionsdaten für DE/EN, noch kein Renderer | [Drehbuch](02_Token_Burn/ASTRA-DREHBUCH.md) · [Projekt](02_Token_Burn/README.md) |
| 03 · SHIP IT | DE/EN final; Drehbuch und Produktionsdaten, noch kein Renderer | [Drehbuch](03_SHIP_IT/ASTRA-DREHBUCH.md) · [Projekt](03_SHIP_IT/README.md) |
| 04 · AI SLOP | Platzhalter; Überarbeitung offen | [Projekt](04_AI_Slop/README.md) |
| 05 · HALLUCINATION | Platzhalter; Überarbeitung offen | [Projekt](05_Hallucination/README.md) |
| 06 · CONTEXT WINDOW | Platzhalter; Überarbeitung offen | [Projekt](06_Context_Window/README.md) |

```text
Vibecoder/
├── README.md
├── 01_Vibecoder/
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

Die vier Platzhalter enthalten `README.md`, `variants/de`, `variants/en`,
`assets/audio`, `assets/fonts`, `src/render`, `src/tools` und `output/qa`.
Leere Sprachordner legen keine finale Release-Auswahl fest.

Die Musikquellen bleiben unter `music/kisound/Vibecoder`. Der Videoordner spiegelt
deren Tracknamen einschliesslich **03_SHIP_IT**. Die bestehende Codevideo-Struktur
und die 60-fps-Schnittstelle aus `videos/kisound/PRODUKTION.md` gelten für die
spätere Umsetzung. Dieses Paket legt keine Website-Einträge oder Exportaufträge an.
