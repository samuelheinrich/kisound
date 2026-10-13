# Layer 2 · Abnahme der Browserfassung

Stand: 2026-09-30T19:12:13+00:00.

**Code und Browserfassung fertig. Kein Musikvideoexport gestartet.**

## Ergebnis

- 13 Node-Prüfungen bestanden: Quellenidentität, genaue Dauer, vollständige Timeline, Cue-Herkunft, Interpolation, ARP/FDB, MAC moves, VLAN-Grenzen, STP, 802.1Q, L2TPv3, LLDP/LACP und direkte Zeitsprünge.
- Vollprüfung im lokalen Chrome: **430 Zeitpunkte und Schnittgrenzen** ohne JavaScript-Fehler.
- **9 Pixelvergleiche** nach beliebigen Zeitsprüngen bestanden.
- Player geprüft: Audio-/Bildstart, Pause, Kapitel, Einzelbild, Geschwindigkeit, Stumm, Scrubbing, tatsächlicher Schleifenübergang, Diagnose, Vollbild, Auflösungswechsel und exaktes Ende.
- Native 4K-Einzelbildprüfung: 3840 × 2160, 60 fps, 12’598 Frames in der Renderer-Schnittstelle.
- Abschliessende Browserprüfung nach Layoutkorrekturen bestanden; **33 repräsentative Standbilder** aktualisiert.
- Globale Vorprüfung für 1080p und 4K bestanden; sie startet keine Videocodierung.
- E-/L-/V-Referenzen von Cue-Dateien und 73 Einstellungen konsistent.

## Visuelle Kontrolle

Der Kontaktbogen sowie vergrösserte Standbilder wurden visuell betrachtet: Titel, ARP Request/Reply, Tagging, MAC move, BPDU-Root, Tunneltransport und Ziel, rote Loop-Kopien, LLDP, LACP und Schluss. Die 3D-Beschriftungen wurden vergrössert und ihre Hintergründe reduziert; Tunnelbeschriftungen treten in Nahaufnahmen zurück. VLANs erhalten im Chorus ein eigenes Panel. Die Frame-Instanzen behalten ihre korrekten Farben.

Die Hauptpanels stehen links mit 510/1920 = 26,5625 % Bildbreite. Das 3D-Geschehen wird nach rechts projiziert. Unwichtige Hintergrundlinien können hinter dem Panel liegen; der demonstrierte Frame oder Zustand ist in den kontrollierten Bildern sichtbar.

## Dateien

- `output/qa/browser-report.json`: vollständiger technischer Browserbericht.
- `output/qa/browser-report-quick.json`: abschliessende Browser-/Layoutprüfung.
- `output/qa/contact-sheet.jpg`: Übersicht der aktuellen Standbilder.
- `output/qa/title-4k.png`: natives 4K-Titelbild.
- `UMSETZUNG-CUES.md` und JSON: vollständige Montage, Ereignis- und Textbezüge.
- `assets/manifest.json`: lokale Quellen- und Schriftprüfsummen.

## Grenzen

Die Gesangszeiten bleiben automatisch erzeugte Quellzeiten. Keine zusätzliche manuelle Hörprüfung und keine Behauptung einer menschlichen Sichtung sämtlicher Frames. Die Signal-/Transkriptgrundlagen bleiben unverändert. Netzwerkszenario und Protokolltimer sind für die Inszenierung vorgegeben und verdichtet.

Die gemessenen Wiedergaberaten in den fünf kurzen lokalen Headless-Stichproben liegen bei rund 60 fps; sie garantieren keine Geschwindigkeit auf anderer Hardware. Der 4K-Test erzeugt ein Standbild, keinen vollständigen Export und keine Belastungsprüfung über die ganze Filmdauer.

Der Originalton dauert 209,960166667 s. Nach der letzten transkribierten Stimme bei 171,760 s sind die verbleibenden 38,200166667 s vollständig gestaltet. Die Schlussgestaltung bleibt bis zum letzten Rasterbild aktiv.

## Vorschau

http://127.0.0.1:8128/?v=1

Der Server läuft lokal. Play startet die Originaltonspur. Nach Beendigung des Servers: `npm run preview` im Songordner. Ein vollständiger Export benötigt weiterhin ausdrückliche Freigabe.
