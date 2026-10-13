# SHIP IT · Abnahme Live-Code

Stand 12. Oktober 2026. Code und Browservorschau, kein MP4.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run prepare` | DE und EN: finaler Prompt → RELEASE AUDIO, WAV-SHA-256, Transkript-SHA = Analyse, Analyse = SOURCE-MANIFEST |
| `npm run check` | 30 Tests bestanden (je Fassung 15): Dauer/Raster, 34 Startzeiten = Drehbuch, Zuordnung aller Events und Lyrics wie TIMELINE.json (EN: ein von der Analyse ausgeschlossenes Überlappungssegment), Hooks an ihren ASR-Ankern und ≥ 0,9 s lesbar, Lücken/Drops/Blende gemessen, Reihenfolge der Release-Zustände, keine Station vor ihrem Zustand, Unterstrich-Fall, Upload, Cache/harter Reload, Lyrics aus dem finalen Prompt, Bridge-Karten, sechs Enter, Kapitel, Determinismus |
| `npm run check:browser` | bestanden, beide Fassungen: 34 Standbilder je Fassung, 259 (DE) / 224 (EN) Zeitpunkte mit endlicher Kamera, 13 Determinismus-Vergleiche je Fassung, Player (Play/Pause, Kapitel), ~60 fps bei 720p (Headless), 4K-Standbild |
| `kisound-render 4k --check` | bestanden (DE, 3840 × 2160, 60 fps); kein Render gestartet |
| Kontaktbögen | `output/qa/contact-de/`, `output/qa/contact-en/` (alle 34 Einstellungen je Fassung gesichtet) |

Offen: Hörprüfung der markierten ASR-Anker (Hooks beider Fassungen, DE-Bridge, DE-Schlussfläche; siehe
`variants/*/TRANSKRIPT-PRUEFUNG.md`); MP4-Export erst nach Freigabe.
