# VIBECODER · technische Abnahme des Codefilms

Stand 14. Oktober 2026. **Code und Browservorschau DE/EN geprüft.**
MP4-Export und Website-Integration sind eigene spätere Schritte.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run prepare` | Beide im finalen Prompt benannten 48-kHz-WAVs geprüft; Audio-, Transkript-, Analyse-, Prompt- und Cover-SHA-256 entsprechen `SOURCE-MANIFEST.json`; Audio unverändert lokal kopiert. |
| `npm run check` | 14 Tests bestanden: Originalquelle, Laufzeit und Framezahl, 72 lückenlose Schnitte je Fassung, 41 DE- beziehungsweise 42 EN-Events und 47 beziehungsweise 46 Lyrics genau einmal zugeordnet, Zustandsfolge, Tagesuhr, Bass-Einsätze, letzte Stimme, offene Folgeidee, Determinismus. |
| `npm run check:browser` | Beide Fassungen bestanden: 72 Standbilder je Fassung, 434 DE- beziehungsweise 462 EN-Zeitpunkte, 12 Bilddeterminismus-Vergleiche je Fassung, Play/Pause und Kapitelwahl, benannte 3D-Objekte mit Status für den Inspektor, keine Browserfehler. Ein DE-Standbild bei 3840 × 2160 gerendert. |
| `src/tools/contact.sh de` und `en` | Je drei Kontaktbögen mit allen 72 Einstellungen erstellt und gesichtet; Auszüge, Hybridbilder, Bridge, Schluss und beide Sprachen geprüft. Die Dateien liegen lokal unter `output/qa/contact-<lang>/`. |
| `kisound-render 4k --check` | DE und EN bestanden: je 3840 × 2160 bei 60 fps, passende getrennte WAV und Timeline. Kein Render gestartet. |
| Gemeinsamer Renderer, EN-Einzelbild | `--lang en --stills 238` ergab ein sichtbares EN-Bild nach dem Ende der DE-WAV; die Sprachwahl erreicht den Exportbrowser. Kein MP4 erzeugt. |
| Gemeinsamer Exporter | 9 Tests bestanden, einschliesslich Weitergabe von `--lang` an den Browserrenderer. |

Der Film zeigt den ersten Katalogerfolg, den gescheiterten zweiten Exportfall,
den eigenen Vier-Reihen-Beat, den verlorenen Reload und den korrigierten
Speicherschlüssel erst nach ihrem jeweiligen Beweis. Die 3D-Karten lesen
dieselben Zustände wie die 2D-Tafeln. Die Hardcoder-Bridge und die letzte
Viererformel sind an ihre Transkriptfenster gebunden; ausserhalb der
Gesangsfenster bleiben die Ergebnisse sichtbar. EN 03:23,740–03:27,700
enthält keinen ungeprüften wörtlichen Lyric-Text.

**Noch offen:** Die markierten ASR-Stellen in den
`final/<lang>/TRANSKRIPT-PRUEFUNG.md`-Dateien an den Original-WAVs manuell
abhören, bevor Untertitel oder präzise Wortanimationen freigegeben werden.
Die lokale Browserprüfung ersetzt keine vollständige Echtzeit-Sichtung mit
Ton. Gemäss `videos/kisound/PRODUKTION.md` wurde kein MP4 ohne ausdrückliche
Freigabe exportiert. An `web/kisound/` wurde nichts verändert.
