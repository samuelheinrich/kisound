# SHIP IT · Der letzte Unterstrich

Status: finale DE/EN-Musik, Transkripte und Audioanalysen; Astra-Drehbuch mit **34 Einstellungen je Sprache**. Renderer und MP4 stehen noch aus.

- [Drehbuch](ASTRA-DREHBUCH.md): Geschichte, Bildwelt, technische Zustände, Typografie und Musikregie.
- [Schnittliste](SCHNITTLISTE.md): dieselben 34 Handlungen mit eigenen DE- und EN-Zeiten.
- [Regiedaten](REGIE-CUES.json): Einstellungen als maschinenlesbare Vorlage.
- [Quellenmanifest](SOURCE-MANIFEST.json): Originalpfade, SHA-256, Dauer und 60-fps-Bildzahl.

| Fassung | Dauer | Zeitliste | Produktionsdaten | ASR-Prüfung |
| --- | ---: | --- | --- | --- |
| Deutsch | 2:35.960 | [SHOTLIST](variants/de/SHOTLIST.md) | [TIMELINE](variants/de/TIMELINE.json) · [KEYWORDS](variants/de/KEYWORDS.json) · [Audioanalyse](variants/de/ASTRA-AUDIO-ANALYSE.md) | [Prüfbericht](variants/de/TRANSKRIPT-PRUEFUNG.md) |
| Englisch | 2:00.680 | [SHOTLIST](variants/en/SHOTLIST.md) | [TIMELINE](variants/en/TIMELINE.json) · [KEYWORDS](variants/en/KEYWORDS.json) · [Audioanalyse](variants/en/ASTRA-AUDIO-ANALYSE.md) | [Prüfbericht](variants/en/TRANSKRIPT-PRUEFUNG.md) |

Die Musikquellen bleiben unter `music/kisound/Vibecoder/03_SHIP_IT/final/`. DE und EN verwenden ihre eigenen Original-WAVs. `SOURCE-MANIFEST.json` referenziert die spätere Projektposition `videos/kisound/Vibecoder/03_SHIP_IT`; die Analysen und Prüfberichte unter `variants/` sind identische Schnappschüsse aus dem Musikordner.

Die ASR hat Hook und DE-Bridge nur teilweise verständlich erkannt. `KEYWORDS.json` setzt gestaltete Titelanker aus den finalen Lyrics, enthält die rohe ASR-Zeile und markiert die Hörprüfung. DE S031 ist ein **visuelles** Schlussrefrainbild ohne bestätigten vollständigen Hook-Wortanker. Vollständige Untertitel bleiben bis zur Hörprüfung ausgeschaltet.

`src/render/`, `src/tools/` und `assets/` sind für die spätere Codevideo-Umsetzung vorbereitet. `generate_handoff.py` baut die Schnittdaten und Kopien aus den finalen Musikquellen neu. Es gibt hier noch keinen `npm run dev` und keine gerenderte Videodatei.
