# SHIP IT · Der letzte Unterstrich

Astra-Drehbuch für die beiden finalen V3-Aufnahmen. Die DE- und EN-Fassung erzählen dieselbe Veröffentlichung, haben aber eigene Schnitte, Wortanker und Musikereignisse. Die [Schnittliste](SCHNITTLISTE.md) und die sprachgetrennten Zeitlisten sind Teil dieses Drehbuchs.

## 1. Geschichte

Eine Nacht am Rechner. Album drei ist vorbereitet: Tracks, Cover, Audio und Lyrics liegen in den richtigen Ordnern. Der Build läuft. Beim Check steht genau eine rote Zeile: Ein Cover wird unter dem erwarteten Dateinamen nicht gefunden. Im Dateivergleich ist ein zusätzlicher Unterstrich zu sehen. Die Person korrigiert ihn, startet denselben Check erneut und sieht null Fehler. Erst jetzt entsteht der Release-Commit.

Die Hook macht aus diesem kleinen, präzisen Vorgang einen grossen Ruf: **COMMIT IT. SHIP IT.** Drei Tore stehen für **Build. Check. Live.** Beim ersten Refrain ist „Live“ ein Ausblick. Die wirkliche Veröffentlichung kommt in Strophe zwei. Der Upload transportiert Cover, Audio und Texte. Die Browseransicht zeigt zunächst noch den alten Cache-Stand. Ein harter Reload holt die neue Seite; Album drei erscheint. Die Person prüft erst Deutsch, dann Englisch. Das Layout wechselt die Sprache, die Songtexte bleiben in der Sprache der jeweiligen Aufnahme. Erst danach wird der Link geteilt und Play gedrückt.

Im letzten Refrain wird die gesamte Kette als eine einzige durchgehende Bewegung gezeigt. Der Release ist fertig, aber die Arbeit hört nicht auf: Im Outro liegt der nächste Commit als neue, noch offene Aufgabe am Rand des Bildes. Der Film schliesst auf dem tatsächlichen Ende der jeweiligen WAV.

## 2. Bildwelt

Der Film beginnt an einem realen, stilisierten Arbeitsplatz im Dunkeln. Auf dem Tisch liegen Tastatur, Laptop und die Covervorschau. Vom Bildschirm wächst eine **Release-Schiene** in den Raum: fünf klar beschriftete Stationen `TRACKS`, `BUILD`, `CHECK`, `DEPLOY`, `LIVE`. Sie ist kein generischer Förderbanddekor. Jede Station zeigt denselben konkreten Albumstand und verändert ihren Zustand erst, wenn die entsprechende Handlung stattgefunden hat. Die Schiene übernimmt die orange Linienführung des Covers; grosse helle Buchstaben und dunkles Blau-Schwarz kommen ebenfalls daraus.

Die Kamera wechselt zwischen drei Ansichten:

| Ebene | Inhalt | Aufgabe |
| --- | --- | --- |
| **Schreibtisch · 3D** | Person als Silhouette, Hände, Tastatur, Monitor, Fenster, Cover. | Körper und Entscheidung zeigen; der Fehler ist klein, der Release persönlich. |
| **Bildschirm · 2D** | Terminal, Dateivergleich, Website-Vorschau, Upload, Sprachumschalter, Player. | Technische Ursache und Ergebnis lesbar halten. |
| **Release-Schiene · hybrid** | Die fünf realen Zustände als räumliche Tore und Pakete. | Die Hook gross machen und den Ablauf zusammenbinden. |

Der Fehler bekommt einen eigenen, ruhigen Nahblick: links die referenzierte Coverdatei, rechts der tatsächliche Name. Nur der zusätzliche Unterstrich leuchtet rot. Danach verschwindet genau dieses Zeichen. Der zweite Check verwendet dieselbe Bildschirmposition; der Zuschauer kann den Unterschied selbst sehen.

Die ersten beiden Refrains benutzen dieselbe Grundform: `COMMIT IT` in warmem Weiss, `SHIP IT` in Orange. Im ersten ist das LIVE-Tor noch eine Projektion hinter der Schiene. Im zweiten ist es ein echtes Browserfenster mit geladener Seite. Im dritten öffnet die Schrift die ganze Kette und macht den abgeschlossenen Release sichtbar. Gleiche Form, weitergeführter Zustand.

## 3. Fachliche Zustände

1. `SOURCE_READY`: Tracks, Cover, Audio und Lyrics liegen bereit. Die Website-Vorschau zeigt den vorherigen Stand.
2. `BUILD_PASS`: `npm run build` beendet sich erfolgreich. Das ist noch keine bestandene Inhaltsprüfung.
3. `CHECK_FAIL`: `npm run check` findet genau einen fehlenden Coverpfad. Der Build bleibt grün, der Check ist rot.
4. `PATH_FIXED`: Der überzählige Unterstrich wird aus dem Dateinamen entfernt; Referenz und Datei stimmen überein.
5. `CHECK_PASS`: Derselbe Check meldet null Fehler. Erst danach wird ein Commit aus dem korrigierten Stand gezeigt.
6. `DEPLOY_DONE`: Cover, Audio und Texte sind übertragen. Die Website ist noch nicht am Browser bestätigt.
7. `CACHE_OLD`: Normaler Reload zeigt den alten Stand. Das ist kein fehlgeschlagener Upload.
8. `LIVE_VERIFIED`: Harter Reload zeigt Album drei; DE und EN wurden einzeln geprüft. Der Link kann geteilt und Play gedrückt werden.
9. `NEXT_OPEN`: Der aktuelle Release bleibt fertig. Eine neue Aufgabe beziehungsweise ein nächster Commit ist erst vorbereitet.

Die Reihenfolge ist verbindlich. Kein früheres grünes Tor behauptet einen späteren Zustand. Ein Chorus darf die spätere Live-Seite als klaren Ausblick zeigen, aber die tatsächliche Veröffentlichung bleibt im Hauptablauf der zweiten Strophe. Es werden keine echten Zugangsdaten, privaten Pfade oder Provider-Dashboards eingeblendet. Eine fiktive, klar erkennbare Demo-Oberfläche reicht.

Die DE- und EN-Seiten behalten die Songtexte in der Originalsprache. Sprachwechsel betrifft Navigation, Beschreibung und Bedienelemente. Der Player erhält im Film keine eigene Tonspur: Ausschliesslich die unveränderte finale WAV der gewählten Filmfassung ist zu hören.

## 4. Typografie, Bewegung und Lesbarkeit

**COMMIT IT. SHIP IT.** erscheint als grosse zweiteilige Titelmarke. Die beiden Teile stehen zuerst frontal und mindestens ungefähr eine Sekunde ruhig lesbar. Räumliche Tiefe und Bassimpuls folgen auf das Erkennen. Die Ausrufe können als gleichbleibende Form mehrfach zurückkehren; die Titel dürfen die technische Handlung nicht verdecken. `Build. Check. Live.` erscheint als drei kurze Wörter an den entsprechenden Toren. `Album drei` beziehungsweise `Album three` bildet den Abschluss der Phrase.

Für Code und Status: JetBrains Mono, auf 1080p mindestens etwa 32 px für die entscheidende Zeile. Für grosse Hook-Wörter: Space Grotesk, hoher Schnittkontrast; Michroma nur klein für Interpret und Album. Bildsafe-Area 8 %. Pro Einstellung gibt es höchstens eine dominante Textaussage. Untertitel werden wegen der markierten ASR-Stellen bis zur Hörprüfung nicht fest ins Bild geschrieben.

Palette: Hintergrund `#10141C`, helle Typografie `#F4F3EA`, Release-Orange `#FF6534`, Fehlerrot `#F04D4D`, bestandenes Ergebnis `#D1F85D`. Rot und Grün werden immer mit `FAIL` und `PASS` beschriftet. Der alte Browserstand bleibt entsättigt; nach dem harten Reload gewinnt das Cover seine Orangefläche zurück. Die Orangefläche darf dunkle Codezeilen nicht überstrahlen.

Kamerawege sind geplante Fahrten und Haltepunkte. RMS darf Material und Licht dezent bewegen, Subbass nur einzelne tiefe Impulse. Gemessene Onsets können Schiene oder Titel kurz anstossen. Eine Uploadzahl, ein Check-Ergebnis und ein Dateiname ändern sich nur bei ihrem erzählerischen Ereignis, nie auf jedem Beat. Alle Zustände sind Funktionen der absoluten Filmzeit; ein Sprung zu einem Zeitpunkt muss dasselbe Bild liefern wie kontinuierliche Wiedergabe.

## 5. Musik und Schnitt

Die konkreten Wortzeiten in den Transkripten sind automatische Anker. Schnitte und Titelhaltezeiten sind redaktionell; sie werden für DE und EN einzeln gesetzt. Die Audioanalysen messen Pegel, Frequenzbänder, Onsets und mögliche Energieübergänge. Ein starker Onset ist kein Beweis für eine bestimmte Kick oder Snare; ein Bass-Drop wird nur an einem gemessenen Subbass-Wiedereinsatz benannt. Die jeweilige WAV beginnt bei Sample 0 und bleibt in Länge und Geschwindigkeit unverändert.

| Fassung | Originaldauer | Bilder bei 60 fps | Tempo-Schätzung | Lautheit | True Peak |
| --- | ---: | ---: | ---: | ---: | ---: |
| DE | 155,960 s | 9 358 | 70,0 BPM, Halftime; 140,0 BPM als Doppeltempo-Alternative | −14,8 LUFS | −2,9 dBTP |
| EN | 120,680 s | 7 241 | 140,0 BPM | −15,7 LUFS | −3,4 dBTP |

Die DE-Tempoausgabe ist kein Nachweis, dass die beiden Sprachfassungen verschieden schnell gespielt wurden. Der Onset-Algorithmus kann denselben Groove halb oder doppelt zählen. Das Bild folgt daher der Originalzeit und den gemessenen Akzenten, nicht einem künstlich synchronisierten Taktraster.

**Belastbare musikalische Wendepunkte:** DE erhält bei 51,0 s einen gemessenen Pegelanstieg am ersten Hook. Nach einer kurzen Lücke um 65,2 s setzt das Band 60–250 Hz deutlich stärker ein; die Release-Schiene kann dort räumlich aufgehen. Bei 112,7 s steigt die Energie vor der Bridge, bei 126,5 s fällt sie wieder. Ein erneuter Anstieg um 140,1 s trägt die lange Schlussfläche. Der Endabfall beginnt als Kandidat um 150,0 s; die letzte belegte ASR-Phrase endet erst um 154,0 s. Das Bild schliesst bei 155,960 s. EN hat einen kräftigen Anstieg bei 14,5 s am Beginn der ersten Strophe, einen weiteren um 69,9 s vor dem zweiten Refrain und um 84,5 s in der Bridge. Auf eine Lücke bei 95,6 s folgt der grösste späte Anstieg um 97,7 s. Ein Endabfall wird ab 114,7 s gemessen, aber die letzte übernommene Stimme reicht bis 120,08 s; Audioende ist bei 120,680 s. Die Bildblende darf keine dieser späten Zeilen abschneiden.

Der Refrain beginnt in beiden Fassungen teils **vor** dem tiefen Bass. Ein Titel kann an der Stimme einsetzen; der räumliche Impuls folgt dem Bandwert. In DE fehlt für die lange Schlussfläche 126–150 s ein belastbarer vollständiger Hook-Wortlaut. Die grosse Titelmarke in S031 ist dort eine redaktionelle Bildentscheidung und kein als exakt gesungen behaupteter Untertitel. Die Bridge-Wörter sind in DE ebenfalls nur teilweise verständlich; ihre Karten erhalten Schnittzeiten, aber keine erfundenen Silbengrenzen.

Die [Schnittliste](SCHNITTLISTE.md) nennt jede Einstellung mit Kamera, Handlung und Übergang. [REGIE-CUES.json](REGIE-CUES.json), [SOURCE-MANIFEST.json](SOURCE-MANIFEST.json) und die sprachgetrennten `TIMELINE.json`/`KEYWORDS.json` machen die Zuordnung zur Quelle prüfbar. Markierte Wörter und unzugeordnete Promptzeilen bleiben in `TRANSKRIPT-PRUEFUNG.md` sichtbar; die Bildhandlung trägt die unklaren Stellen.

## 6. Produktionsprüfung

Zuerst ein Animatic der Zustandswechsel und der grossen Titel: Fehlervergleich, zweiter Check, erster Chorus, Upload, alter Cache, harter Reload, DE/EN-Prüfung, Schlussrefrain und letzter Commit. Dann Kontaktbögen aus der Mitte jeder Einstellung für beide Sprachen. Die Check-Meldung und der Unterstrich müssen auch bei 540p erkennbar sein. Die fünf Stationen müssen ihre Reihenfolge behalten. Die letzte Einstellung bewegt sich bis zum gemessenen Audioende und endet ohne zusätzliche Musik oder vorgezogenen schwarzen Nachlauf.

Das Paket ist ein Drehbuch mit Produktionsdaten. `src/` und `assets/` bleiben bis zur späteren Codevideo-Umsetzung vorbereitet; es liegt noch kein Renderer oder MP4 vor.
