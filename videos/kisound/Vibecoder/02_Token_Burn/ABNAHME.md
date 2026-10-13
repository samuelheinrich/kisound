# TOKEN BURN · Abnahme Live-Code

Stand 9. Oktober 2026. Code und Browservorschau, kein MP4.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run prepare` | DE und EN: finaler Prompt → RELEASE AUDIO, WAV-SHA-256, Transkript-SHA = Analyse, Analyse = SOURCE-MANIFEST |
| `npm run check` | 28 Tests bestanden (je Fassung 14): Dauer/Raster, 58 Startzeiten = Drehbuch, Zuordnung aller Events und Lyrics wie TIMELINE.json, sechs Titel ≥ 0,9 s, Lücken/Blende gemessen, Auftragsfolge, Bassfehler, Export-Vergleich, Uhr, Tabs, Nutzung kumuliert (27,58 Credits nach P05, ≤ 39,18 am Ende), Versionsgleichheit S050, Determinismus |
| `npm run check:browser` | bestanden, beide Fassungen: 58 Standbilder je Fassung, ~430 Zeitpunkte mit endlicher Kamera, 12 Determinismus-Vergleiche je Fassung, Player (Play/Pause, Kapitel), ~60 fps bei 720p (Headless), 4K-Standbild |
| Kontaktbögen | `output/qa/contact-de/`, `output/qa/contact-en/` (alle 58 Einstellungen gesichtet) |

Offen: Hörprüfung der markierten ASR-Anker (vor allem DE H04 und die letzten EN-Refrains, siehe
`variants/*/TRANSKRIPT-PRUEFUNG.md`); MP4-Export erst nach Freigabe.
