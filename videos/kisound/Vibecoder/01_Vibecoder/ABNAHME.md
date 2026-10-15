# VIBECODER · technische Abnahme des Codefilms

## Veröffentlichung auf kisound.ch · 15. Oktober 2026

Beide Fassungen sind unter
[`/vibecoder/01-vibecoder/live/`](https://kisound.ch/vibecoder/01-vibecoder/live/)
veröffentlicht. Der Website-Build erzeugte 50 Seiten. Der gezielte Web-Check
bestand mit 29 Seiten, zwei Audio-Messungen (je 0 ms Versatz), beiden
Live-Code-Fassungen, mobiler und eingebetteter Ansicht sowie dem
DE/EN-Szenenwechsel. Öffentlich geprüft wurden beide Fassungen mit jeweils
72 Shots, die Audiodauern 216,24 und 244,76 s und laufende Wiedergabe.
Der FTPS-Deploy übertrug 138 neue oder geänderte Dateien ohne Bereinigung alter
Build-Assets. Ein MP4 ist für diese Live-Code-Veröffentlichung nicht nötig.

## Erster Ruf, Achterbahngesten und Kapuzenrand · 15. Oktober 2026

Beim ersten VIBECODER-Ruf heben sich in beiden Fassungen beide Hände: DE ab
51,121 s, EN ab 61,581 s. Die Achterbahn verwendet zehn DE- beziehungsweise
elf EN-Einsätze aus der Audioanalyse. Doppelte Armgesten und einzelne
Armstösse wechseln, auch in der Fahrersicht; der Laptop bleibt dort sichtbar.
Der vordere Kapuzenrand ist ringsum mit der Stoffhülle verbunden. Eine matte
Innenblende und ein abgedunkelter Ansatz verdecken die untere Öffnung, sodass
aus der Frontalansicht weder Himmel noch helle Kragenflächen durchscheinen.

`npm run check` bestand mit 23 Tests. Die vollständige Browserprüfung bestand
für DE und EN mit je 72 Einstellungen, 434 beziehungsweise 462 Zeitpunkten,
zwölf Bilddeterminismus-Vergleichen und den neuen Gestenprüfungen ohne
Browserfehler. Die Kapuze wurde zusätzlich frontal im Park und auf der Fahrt
als Nahansicht gesichtet.

## Café, Wetter und Bassgesten · 15. Oktober 2026

Das Café besitzt jetzt vier Wände und eine Decke. Service- und Espressotheke,
Gebäckvitrine, Menütafeln, Sitznische, zusätzliche Tische und Gäste, Fenster,
Wandbilder, Regale und Leuchten füllen auch die Blickrichtungen vor der Figur.
Die schwebenden Beweiskarten und die grosse HUD-Tafel sind im Café und auf dem
stürmischen Berg ausgesetzt; ihre Inhalte bleiben auf Laptop und 2D-Flächen.

Park und Berg haben getrennte, aus Code erzeugte Himmelsprojektionen. Im Park
ziehen Wolken vor blauem Himmel. Am Berg bewegen sich dunkle Wolken und Regen;
kurze Blitze treffen mit Lichtimpulsen zusammen. Aus gemessenen Bass-Einsätzen
werden je Fassung wenige Jubelgesten gewählt. Beide Arme gehen hoch und
kehren danach zur Tastatur zurück. Die Bewegung ist bei beliebiger
Abspielreihenfolge reproduzierbar.

`npm run check` bestand mit 23 Tests. Die vollständige Browserprüfung bestand
für DE und EN mit je 72 Standbildern, 434 beziehungsweise 462 Zeitpunkten,
zwölf Bilddeterminismus-Vergleichen je Fassung, Playerprüfung und ohne
Browserfehler. Zusätzlich wurden Jubelpose und Gewitterblitz in beiden
Fassungen als Einzelbilder geprüft.

## Bildfassung V4 · 15. Oktober 2026

Die [V4-Regie](ASTRA-DREHBUCH-v4.md) setzt die neue Kapuzenfigur, die
bewegte Parkbevölkerung, den zusammenhängenden Wald/Berg-Ort und den
Vergnügungspark mit projiziertem Nachthimmel um. Die Kamera umrundet die
Figur schneller und schneidet während der Achterbahn länger in ihre Sicht.
Der Laptop bleibt in der Fahrersicht sichtbar; die räumlichen Titel stehen
seitlich vor dem Bild, sodass die Figur dahinter lesbar bleibt.
Die Kapuze ist nun auch auf der Rückseite geschlossen. Dekorative
orangefarbene Linien auf Café-, Park-, Wald- und Jahrmarktböden sind entfernt.
Die vordere Kapuzenöffnung hat nun eine matte, nach innen enger werdende
Wand und eine tief zurückgesetzte schwarze Fläche ohne Gesicht oder Reflex.
Beide Hände und einzelne Finger tippen versetzt; Unterarme und Bündchen
folgen der Bewegung. Die Fahrersicht zeigt die tippenden Hände ebenfalls.
Die Gondelfahrt reicht von S053 bis S065; ab S054 bewegt sich der Zug.
S059 und S061 zeigen Kamerafahrten um die Figur, S064 den letzten Titel.
S062 ist während der gesamten Achterbahnfahrt der einzige 2D-Wechsel.

`npm run check` bestand mit 22 Tests. Die vollständige Browserprüfung
bestand für DE und EN mit je 72 Standbildern, 434 beziehungsweise 462
Zeitpunkten, zwölf Bilddeterminismus-Vergleichen je Fassung, Playerprüfung
und ohne Browserfehler. Die neue Titelkamera bei S064, die Kapuze aus
mehreren Winkeln und die sechs aktualisierten Kontaktbögen wurden gesichtet.
Es wurde kein MP4 exportiert und nichts am Webauftritt verändert.

## Bildfassung V3 · 15. Oktober 2026

Die [V3-Regie](ASTRA-DREHBUCH-v3.md) wurde im Monorepo übernommen und lokal
geprüft. `npm run check` bestand mit 20 Tests. Der vollständige Browsercheck
bestand für DE und EN mit je 72 Standbildern, 434 beziehungsweise 462
Zeitpunkten, zwölf Bilddeterminismus-Vergleichen je Fassung, Playerprüfung und
ohne Browserfehler. Die Orts- und Laptop-Prüfungen im Browser bestanden ebenfalls.

Nach Sichtung der Kontaktbögen wurde die Gondelsicht korrigiert: Die Kamera
liegt ausserhalb des Kopfmodells, bleibt im Loop aufrecht, und der Laptop
sitzt am unteren Bildrand. Gleitende Lichter und Bodenmaterial machen die
Strecke sichtbar. Die korrigierten DE- und EN-Bilder wurden erneut geprüft;
die sechs Kontaktbögen liegen unter `output/qa/contact-<lang>/`.

Die technische Browserprüfung ersetzt noch keine vollständige Echtzeit-Sichtung
mit Ton. MP4-Export und Website-Integration wurden nicht gestartet.

## Frühere Schauplatz-Fassung V2 · 14. Oktober 2026

Stand 14. Oktober 2026. **Schauplatz-Fassung V2: Code und Browservorschau DE/EN geprüft.**
MP4-Export und Website-Integration sind eigene spätere Schritte.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run prepare` | Beide im finalen Prompt benannten 48-kHz-WAVs geprüft; Audio-, Transkript-, Analyse-, Prompt- und Cover-SHA-256 entsprechen `SOURCE-MANIFEST.json`; Audio unverändert lokal kopiert. |
| `npm run check` | 16 Tests bestanden: Originalquelle, Laufzeit und Framezahl, 72 lückenlose Schnitte je Fassung, 41 DE- beziehungsweise 42 EN-Events und 47 beziehungsweise 46 Lyrics genau einmal zugeordnet, V2-Ortsfolge, Zustandsfolge, Tagesuhr, Bass-Einsätze, letzte Stimme, offene Folgeidee, Determinismus. |
| `npm run check:browser` | Beide V2-Fassungen bestanden: 72 Standbilder je Fassung, 434 DE- beziehungsweise 462 EN-Zeitpunkte, 12 Bilddeterminismus-Vergleiche je Fassung, Play/Pause und Kapitelwahl, benannte 3D-Artefakte und mobiles Display mit Status für den Inspektor, je Schnitt nur der vorgesehene 3D-Ort aktiv, Gerät auf der Fahrt weg und am Ausstieg wieder sichtbar, keine Browserfehler. Ein DE-Standbild bei 3840 × 2160 gerendert. |
| `src/tools/contact.sh de` und `en` | Je drei Kontaktbögen mit allen 72 Einstellungen erstellt und gesichtet; Auszüge, Hybridbilder, Bridge, Schluss und beide Sprachen geprüft. Die Dateien liegen lokal unter `output/qa/contact-<lang>/`. |
| `npm run export:check` und `npm run export:check:en` | DE und EN bestanden: je 1920 × 1080 bei 60 fps, passende getrennte WAV und Timeline. Kein Render gestartet. |

Der Film zeigt den ersten Katalogerfolg, den gescheiterten zweiten Exportfall,
den eigenen Vier-Reihen-Beat, den verlorenen Reload und den korrigierten
Speicherschlüssel erst nach ihrem jeweiligen Beweis. Die 3D-Karten lesen
dieselben Zustände wie die 2D-Tafeln. Die Hardcoder-Bridge und die letzte
Viererformel sind an ihre Transkriptfenster gebunden; ausserhalb der
Gesangsfenster bleiben die Ergebnisse sichtbar. EN 03:23,740–03:27,700
enthält keinen ungeprüften wörtlichen Lyric-Text.

Die V2-Browservorschau benutzt prozedurale 3D-Bühnen für Café, Park, Wald,
Berg, Jahrmarkt, Achterbahn und Ausgang. Nach S015 erscheint das Café nicht
mehr; ein Zimmermonitor wird nicht verwendet. Auf der Fahrt ist das mobile
Gerät weggepackt, die drei geprüften Karten bleiben als lesbare Filmobjekte
sichtbar. Das Gerät erscheint erst am Ausstieg wieder. Die Kontaktbögen wurden
nach der letzten Kamerakorrektur für DE und EN neu erstellt.

**Noch offen:** Die markierten ASR-Stellen in den
`final/<lang>/TRANSKRIPT-PRUEFUNG.md`-Dateien an den Original-WAVs manuell
abhören, bevor Untertitel oder präzise Wortanimationen freigegeben werden.
Die lokale Browserprüfung ersetzt keine vollständige Echtzeit-Sichtung mit
Ton. Gemäss `videos/kisound/PRODUKTION.md` wurde kein MP4 ohne ausdrückliche
Freigabe exportiert. An `web/kisound/` wurde nichts verändert.
