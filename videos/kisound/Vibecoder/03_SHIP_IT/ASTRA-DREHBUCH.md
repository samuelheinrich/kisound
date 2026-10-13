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

Die Live-Code-Umsetzung (12. Oktober 2026) steht in Abschnitt 7. Ein MP4 wird erst nach Freigabe gerendert.

## 7. Umsetzung als Live-Code (12. Oktober 2026)

Die Schnittzeiten der [Schnittliste](SCHNITTLISTE.md) gelten unverändert für beide Fassungen (34 Einstellungen, Tests gegen
`_revisions/REGIE-CUES-original.json` und `variants/<lang>/TIMELINE.json`). Inhalt, Kamera und Zustände sind im Code
konkretisiert; die aus dem Code erzeugten Cue-Listen stehen unter `variants/<lang>/UMSETZUNG-CUES.md`.

**Ort.** Das Zimmer aus TOKEN BURN in einer späteren Nacht: dunkler, nur Nacht, Fenster zur Strasse, Haus gegenüber,
ferne Türme mit einzelnen hellen Fenstern. Auf dem Tisch stehen Laptop, Becher, Lampe und die Pflanze auf dem Fenstersims.
Dazu kommen die Motive des Covers:
- die **grosse Enter-Taste**, ein Ein-Tasten-Makropad mit orangem Pfeil, das bei jedem Enter mit einem Lichtring einrastet;
- die **Release-Schiene** aus fünf gefrästen Miniaturpressen `TRACKS · BUILD · CHECK · DEPLOY · LIVE`, jede mit Statuslampe, Schild und Pressstempel;
- das **Release-Paket**, ein leuchtender Würfel auf der Schiene;
- der **Commit-Graph** als Kabel von der Enter-Taste zur Schiene: drei ältere Commits, der Release-Commit, am Ende der offene Ring des nächsten Commits.

Die schematische Person tippt rechts am Laptop und drückt links die Enter-Taste.

**Der Fehler, konkret.** `npm run check` meldet
`✗ Cover fehlt · Vibecoder/05_Hallucination/05_Hallucination_cover.png`. Im Ordner liegt `05_Hallucination__cover.png`.
Bis Spalte 16 sind beide Namen gleich, in Spalte 17 steht der zusätzliche Unterstrich. Der Vergleich (S007) läuft
Zeichen für Zeichen bis zu dieser Stelle. Die Makroansicht (S008) zeigt `ation_cov` über `ation__cov`. Dann folgt
`mv 05_Hallucination__cover.png 05_Hallucination_cover.png`, das Zeichen fällt heraus, und derselbe Check läuft
noch einmal (S009). Schon die Dateiliste in S004 zeigt den falschen Namen, ohne dass er markiert ist.

**Zustände** (`src/render/model.js`, als Tests formuliert). Jedes Ereignis liegt in seiner Einstellung. Die Stationen
gehen nie vor ihrer Vorgängerin auf PASS, BUILD bleibt grün, während CHECK rot ist, und DEPLOY startet erst nach dem
Commit. LIVE ist im ersten Refrain eine orange Projektion („Ausblick“). Nach dem Deploy „wartet“ LIVE, nach dem harten
Reload „läuft“ es, und erst nach der DE- und EN-Prüfung steht es auf PASS.

Zwischen dem harten Reload und der Sprachprüfung gibt es zusätzlich den Zwischenzustand `LIVE_CHECK`.

Der Upload zählt Cover 6, Audio 12 und Texte 12 (30 Dateien) und zeigt dazu „Browser noch nicht geprüft“.
Zugangsdaten und Provider sind nie zu sehen.

**Website.** Gezeigt wird der echte öffentliche Ort `kisound.ch` mit `kisound.ch/vibecoder/03-ship-it/`.
- Der alte Stand ist die Startseite mit *Network Engineer 02* oben.
- Der neue Stand zeigt *Vibecoder* mit den sechs Covern, im Stil der Albumserie gezeichnet, nicht als Bilddatei.
- Für die Lyrics-Prüfung (S021) wechselt die UI-Sprache, die gezeigte Lyric-Zeile ist dabei eine Zeile des finalen Prompts dieser Fassung:
  - DE: „Ein Unterstrich zu viel, ich benenn die Datei zurück,“
  - EN: „One underscore too many, I rename it back,“

**Titelmarke.** `COMMIT IT.` (warmweiss) über `SHIP IT.` (orange), mit einer kleinen dritten Zeile:
`BUILD. CHECK. LIVE.`, `ALBUM DREI`/`ALBUM THREE` oder `ALBUM DREI GEHT RAUS`.
- **Gesungene Hooks** beginnen an ihrem ASR-Anker aus `KEYWORDS.json`: DE H01–H04, EN H01–H09.
- **Redaktionelle Titel ohne Anker:** DE S002, S012, S024, S031 und EN S024.
- **Lesbarkeit:** Jeder Titel steht nach 120 ms Eintritt mindestens 0,9 s ruhig, bevor die Kamera weiterfährt.
- **Wechsel in den Raum:** In EN läuft H03 aus dem 1,04-s-Titelbild S010 in die Tore von S011 weiter. Die Marke steht dort als Ebenenstapel vor der Schiene.
- **Haltezeit:** DE H02 und H04 halten kürzer als das ASR-Fenster (bis 56,9 s bzw. 104,3 s), weil die Kamera danach die Tore zeigt.
- **Kein Untertitel:** Weil alle Hook-Stellen zur Hörprüfung markiert sind, ist die Marke ein Titel und nie ein Untertitel.
- **2D-Titel:** Starke gemessene Onsets geben nur ein schwaches seitliches Echo dünner Streifen. Die Schrift selbst bleibt sauber.

**Musik.**
- **Pegellücken:** Gemessene Lücken dunkeln das Bild kurz ab: DE bei 62,8 und 65,2 s. In EN sind es die Tape-Stopps unter −45 dBFS, 18 Fenster, darunter die Hook-Chops im Intro.
- **Sub-Bass-Wiedereinsätze** (Kriterium aus dem Handbuch) geben den Pressen, dem Paket und dem Licht einen Impuls:
  - DE 113,35 und 140,55 s (Schwelle 0,55);
  - EN 71,35, 84,95, 98,65, 105,45 und 113,95 s (Schwelle 0,45, weil der EN-Mix den Sub nach der Normierung tiefer führt).
- **Blende:** Sie beginnt am Ende der letzten transkribierten Stimme, nicht am Fade-Kandidaten, damit „Nächster Commit“ bzw. „Album three“ nicht abgeschnitten wird: DE 154,0 → 155,96 s, EN 120,08 → 120,68 s.

**Bridge.** Die acht Karten stehen der Reihe nach über der Schiene.
- **EN:** sieben Karten auf den ASR-Wortanfängen; „Album three“ wird in der EN-Bridge nicht gesungen.
- **DE:** Tracks und Covers auf den ASR-Wörtern, die übrigen Karten redaktionell an den Schnitten. Die DE-Bridge ist nur teilweise verständlich.
- **S028:** Unter CHECK steht die korrigierte Referenz als kleiner Beleg.

**Ende.** S033 zeigt die Notiz „Nächstes Album / Nächster Commit“, den offenen Ring neben der Enter-Taste und
`git commit -m "` mit blinkendem Cursor im Terminal. S034 fährt aus dem Fenster zurück; im Laptop läuft der Player.
Der Credit SAMUEL HEINRICH · SHIP IT · VIBECODER steht ab S033 und am Anfang der DE-Fassung.

