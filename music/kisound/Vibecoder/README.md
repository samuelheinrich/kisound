# Vibecoder

Arbeitsstand 13. Oktober 2026 · Samuel Heinrich · 2026

**VIBECODER hat jetzt finale WAVs in Deutsch und Englisch.** Die Quelltexte der Fassung 0.1 bleiben als Lyrics- und Stilreferenz erhalten. Der aktuelle Stil ist Peak-Time Tech House / Dark Electro: rollender Bass, tiefe raue Stimme und ein sofortiger Hook-Ruf im Club-Drop. **TOKEN BURN und SHIP IT sind ebenfalls in Deutsch und Englisch final.** Die Tracks 04–06 bleiben vorerst auf ihrem bisherigen Stand.

Sechs Tracks über agentisches Programmieren, schnelle Entwicklung und die neue Arbeitswelt mit LLMs. Jeder Track hat eine deutsche und eine eigenständige englische Fassung. Die Reihenfolge führt vom euphorischen Hype-Einstieg über den Entwicklungsrausch und den harten Release-Höhepunkt zur fröhlichen Überproduktion, dann zu Zweifel und einem melancholischen Abschluss.

## Reihenfolge und Klang

BPM und Dauer sind Produktionsziele. Tatsächliche Tempi, Dauer, Stimmwechsel und musikalische Übergänge werden an den erzeugten Audios geprüft.

| Nr. | Track | Stil | BPM-Ziel | Dauer-Ziel | Stimme und Stimmung |
| --- | --- | --- | --- | --- | --- |
| 01 | VIBECODER | Peak-Time Tech House / Dark Electro | 132 | DE 3:36.240 · EN 4:04.760 | Sehr tiefer rauer Männerbass; harter Club-Mix ohne langes Intro. |
| 02 | TOKEN BURN | Acid Techno | 136 | 4:00 | Rhythmische männliche Stimme; Beschleunigung und nächtlicher Schaffensrausch. |
| 03 | SHIP IT | Hard Phonk / Industrial Bass | 140 | DE 2:35.960 · EN 2:00.680 | Eine tiefe raue Stimme; COMMIT IT. SHIP IT., Release von Album drei. |
| 04 | AI SLOP | Electro House / French-House-Funk | 144 | 3:50 | Helle weibliche Stimme; fröhlich, tanzbar, selbstironisch. |
| 05 | HALLUCINATION | Dark Trip-Hop / Downtempo Electronica | 108 | 3:45 | Naher männlicher Bariton; ruhiger, fragend, zunehmend skeptisch. |
| 06 | CONTEXT WINDOW | Ambient Electronica / Downtempo | 88 | 4:15 | Weiblicher Alt; melancholisch, mit langem ausklingendem Outro. |

## Kopierfertige Suno-Felder

Je Sprachfassung `lyrics.txt` in das Lyrics-Feld und `style.txt` in das Styles-Feld kopieren. Die danebenliegende `settings.txt` enthält editierbare Suno-Einstellungen; diese Werte werden separat in der Oberfläche eingetragen. Diese Dateien enthalten nur den jeweiligen Feldinhalt. Stilbeschreibungen sind entsprechend der Repository-Konvention auf Deutsch; die Gesangssprache wird darin ausdrücklich festgelegt. Die Titel bleiben in beiden Sprachfassungen gleich. VIBECODER bleibt die öffentliche Schreibweise; die aktuelle EN-Lyric verwendet einen englischen Hook. Der ältere EN-Stiltext erwähnt noch einen deutschen Ruf und ist als historische Vorgabe zu lesen.

Die Zahlen zählen den gesamten Dateiinhalt einschliesslich Tags, Leerzeichen und abschliessendem Zeilenumbruch. Zählung als UTF-16-Codeeinheiten, passend zu JavaScript-Zeichenlängen. Die verwendeten Texte ergeben dieselben Zahlen bei der Zählung von Unicode-Codepunkten.

| Track | Deutsch: Lyrics / Stil | Zeichen Lyrics / Stil | Englisch: Lyrics / Stil | Zeichen Lyrics / Stil |
| --- | --- | --- | --- | --- |
| VIBECODER | [Lyrics](01_Vibecoder/suno-0.1/de/lyrics.txt) · [Stil](01_Vibecoder/suno-0.1/de/style.txt) | 1511 / 848 | [Lyrics](01_Vibecoder/suno-0.1/en/lyrics.txt) · [Stil](01_Vibecoder/suno-0.1/en/style.txt) | 1630 / 874 |
| TOKEN BURN | [Lyrics](02_Token_Burn/suno-0.1/de/lyrics.txt) · [Stil](02_Token_Burn/suno-0.1/de/style.txt) | 1570 / 723 | [Lyrics](02_Token_Burn/suno-0.1/en/lyrics.txt) · [Stil](02_Token_Burn/suno-0.1/en/style.txt) | 1542 / 720 |
| SHIP IT | [Lyrics](03_SHIP_IT/suno-V3/de/lyrics.txt) · [Stil](03_SHIP_IT/suno-V3/de/style.txt) | 1285 / 987 | [Lyrics](03_SHIP_IT/suno-V3/en/lyrics.txt) · [Stil](03_SHIP_IT/suno-V3/en/style.txt) | 1304 / 947 |
| AI SLOP | [Lyrics](04_AI_Slop/suno-0.1/de/lyrics.txt) · [Stil](04_AI_Slop/suno-0.1/de/style.txt) | 1503 / 759 | [Lyrics](04_AI_Slop/suno-0.1/en/lyrics.txt) · [Stil](04_AI_Slop/suno-0.1/en/style.txt) | 1505 / 722 |
| HALLUCINATION | [Lyrics](05_Hallucination/suno-0.1/de/lyrics.txt) · [Stil](05_Hallucination/suno-0.1/de/style.txt) | 1443 / 757 | [Lyrics](05_Hallucination/suno-0.1/en/lyrics.txt) · [Stil](05_Hallucination/suno-0.1/en/style.txt) | 1398 / 754 |
| CONTEXT WINDOW | [Lyrics](06_Context_Window/suno-0.1/de/lyrics.txt) · [Stil](06_Context_Window/suno-0.1/de/style.txt) | 1484 / 777 | [Lyrics](06_Context_Window/suno-0.1/en/lyrics.txt) · [Stil](06_Context_Window/suno-0.1/en/style.txt) | 1525 / 767 |

### Einheitliches Prompt-Schema und Suno-Einstellungen

Alle Stilprompts dieses Albums, einschliesslich der älteren Varianten und der finalen Fassungen, verwenden `Genre:`, `Tempo:`, `Sound:`, `Vocals:`, `Vibe:` und `Mood:`. Bei Bedarf ergänzt `Ablauf:` die Songstruktur; `Hinweise:` enthält Aussprache und die bisherigen Schlussanweisungen. Musikalische Ziele und tatsächlich gemessene WAV-Dauern bleiben getrennt.

Neben jedem Stilprompt steht eine `settings.txt` mit diesen frei editierbaren Platzhaltern:

```text
Weirdness: 50%
Style Influence: 50%
variety: exakt
max mode: off
```

Darüber steht unter `Titel:` ein kopierbarer Songname nach dem Muster `Track_Version_Weirdness_StyleInfluence_variety_maxmode_SPRACHE`, z. B. `05_Hallucination_suno-v1_50_50_exakt_off_DE`; Ersatztracks ohne Versionsteil, z. B. `E4_Git_Bisect_50_50_exakt_off_DE`. Wird ein Wert geändert, den Titel mit anpassen. Dies sind Platzhalter für spätere Einträge, keine bestätigten Einstellungen der bestehenden Aufnahmen. Vorgesehene Auswahl für variety: exact style, balanced, distinct, bold, unreasonble; max mode: off/on. Die Schreibweise der Auswahl stammt aus der Nutzervorgabe. Bei finalen Gesamtdokumenten stehen dieselben Werte in einem separaten Abschnitt `SUNO OPTIONS (PLATZHALTER)` vor den Lyrics; `STYLE PROMPT` bleibt ausschliesslich der kopierbare Stiltext. [VIBECODER-Einstellungen](01_Vibecoder/suno-0.1/de/settings.txt).

### Format und Recherche

Arbeitsgrenzen dieser Entwürfe: **900 Zeichen für Styles, 3000 Zeichen für Lyrics**. Recherche: 5. Oktober 2026.

- Suno empfiehlt eckige Struktur-Tags wie `[Intro]`, `[Verse 1]`, `[Chorus]` und `[Bridge]`. Die Entwürfe verwenden zusätzlich `[Pre-Chorus]` und `[Outro]`; Sunos Glossar beschreibt die entsprechenden musikalischen Abschnitte. [Schreibanleitung](https://suno.com/hub/how-to-make-a-song), [Musikglossar](https://help.suno.com/en/articles/9010177).
- Das öffentlich ausgelieferte Frontend definiert `MAX_STYLE_CHARS_LONG = 1000` und `MAX_CUSTOM_PROMPT_CHARS_LONGEST = 5000`. Gleichzeitig liest es Limits aus der Modellkonfiguration. Die Konstanten sind daher keine Zusage für jedes Modell und jeden Eingabemodus. [Konstanten](https://suno.com/_next/static/immutable/chunks/3nj9vbzjwnyda.js), [modellabhängige Limits](https://suno.com/_next/static/immutable/chunks/2hf4p08kww7fv.js).
- Die Lyrics enthalten nur performten Text und Abschnittsmarkierungen. Refrains sind vollständig ausgeschrieben. Instrumente, Stimmrollen, Builds und Instrumentalpassagen stehen im Stilprompt.
- Suno führt aktuell die v6-Familie; die Entwürfe sind für selbst eingegebene Lyrics im Advanced-/Custom-Modus gedacht. [Aktuelle Modelle](https://help.suno.com/en/articles/13924737).
- Bei Solotracks kann die gewünschte Gesangsstimme zusätzlich über Vocal Gender gewählt werden. SHIP IT verwendet durchgehend eine einzige Stimme; die Hook wird von derselben Stimme gedoppelt. [Stimmwahl](https://help.suno.com/en/articles/10153473).

## Neue Varianten und Ersatztracks

Für VIBECODER, SHIP IT, AI SLOP, HALLUCINATION und CONTEXT WINDOW gibt es je drei Varianten `suno-V1` bis `suno-V3` (Deutsch und Englisch). SHIP IT V3 ist für beide Sprachen final ausgewählt. Zehn mögliche Ersatztracks E1–E10 liegen archiviert unter
`../xx_archive/Vibecoder/`. Genres, Hooks und Bildmotive stehen in der [Variantenübersicht](VARIANTEN.md).

## Cover

Alle Trackcover folgen dem Stil von [TOKEN BURN](02_Token_Burn/02_Token_Burn_cover.png): derselbe nächtliche
Arbeitsplatz als 3D-Miniatur, zweizeiliger extrudierter Titel (Off-White / Glutorange), Credit unten mittig,
Palette Anthrazit, Off-White, Orange #FF6534 und wenig Cyan. Erzeugt am 10. Oktober 2026 mit dem integrierten
Bildgenerator über `codex exec`, mit TOKEN BURN als Referenzbild. Jeder Prompt liegt neben dem Bild.
Frühere abweichende Fassungen liegen unter `archive/covers/`.

| Track | Cover | Motiv |
| --- | --- | --- |
| VIBECODER | [Bild](01_Vibecoder/01_Vibecoder_cover.png) · [Prompt](01_Vibecoder/01_Vibecoder_cover_prompt.txt) | 22:00, Terminal, schwebende Prototypen (Pi mit Kamera und Servos, 3D-Haus aus Grundriss, Roboter, Upload-Fenster), Switch mit Patchkabeln. |
| TOKEN BURN | [Bild](02_Token_Burn/02_Token_Burn_cover.png) · [Prompt](02_Token_Burn/02_Token_Burn_cover_prompt.txt) | 03:00, Laptop mit Sequencer, fliegende Token-Fragmente. |
| SHIP IT | [Bild](03_SHIP_IT/03_SHIP_IT_cover.png) · [Prompt](03_SHIP_IT/03_SHIP_IT_cover_prompt.txt) | Enter-Taste, Commit-Schiene mit Branch, vier Stationen (Branch, Build, Paket, Upload), Laptop mit Haken. |
| AI SLOP | [Bild](04_AI_Slop/04_AI_Slop_cover.png) · [Prompt](04_AI_Slop/04_AI_Slop_cover_prompt.txt) | Laptop spuckt fast identische Cover-, Wellenform- und App-Karten; eine eigene Karte cyan markiert. |
| HALLUCINATION | [Bild](05_Hallucination/05_Hallucination_cover.png) · [Prompt](05_Hallucination/05_Hallucination_cover_prompt.txt) | Switch mit hellblauem Konsolenkabel, Terminal mit Caret-Fehler, zerfallendes Antwortpanel, Command Reference. |
| CONTEXT WINDOW | [Bild](06_Context_Window/06_Context_Window_cover.png) · [Prompt](06_Context_Window/06_Context_Window_cover_prompt.txt) | Morgengrauen, halb geschlossener Laptop, oranger Rahmen mit Kartenstapel, oben zerfallende Karten, Skizzenzettel. |

## Gemeinsame Geschichte und Video-Motive

VIBECODER hat noch kein neues Videokonzept. Die neuen Lyrics zeigen einen Alltag mit kleinem Hilfsskript, selbst erzeugter Musik und einer passenden App. SHIP IT zeigt den Release von Album drei auf der eigenen Website: Build, Coverpfad-Fehler, Check, Deploy und Browserprüfung. Die übrigen Videoentwürfe arbeiten bisher mit einer Sequencer-Demo mit vier Spuren und sechzehn Schritten je Spur. Ihre Motive werden bei der jeweiligen Track-Überarbeitung neu abgestimmt. Die Demo ist Bildhandlung; die gewählte Songaufnahme liefert den Originalton.

| Track | Szenenkonzept |
| --- | --- |
| VIBECODER | Neues Videokonzept nach Auswahl einer Aufnahme. |
| TOKEN BURN | [Die Session bis zum Tageslicht](02_Token_Burn/02_Token_Burn_Video_Konzept.md) |
| SHIP IT | [Album drei veröffentlichen](03_SHIP_IT/03_SHIP_IT_Video_Konzept.md) |
| AI SLOP | [Feed, Varianten und eigener Song](04_AI_Slop/04_AI_Slop_Video_Konzept.md) |
| HALLUCINATION | [Behauptung, Dokumentation und Test](05_Hallucination/05_Hallucination_Video_Konzept.md) |
| CONTEXT WINDOW | [Gespeicherte Geschichte, verkürzter Kontext](06_Context_Window/06_Context_Window_Video_Konzept.md) |

Die Konzepte ordnen Abschnitten Objekte und Handlungen zu. Bei finalen Tracks stammen Zeitmarken und gemessene Akzente aus Transkript und Analyse. Bewegungen werden später aus der absoluten Filmzeit berechnet, entsprechend dem bestehenden Codevideo-Workflow.

### Fachliche Leitlinien

TOKEN BURN beschreibt wachsende Nutzung, wiederholte Eingaben und Antworten. Der Nutzungszähler visualisiert verarbeitete Tokens; er setzt Tokens nicht mit ganzen Wörtern gleich. Kosten und Zeit stehen in getrennten Anzeigen. Feste Preise oder reale Kontostände werden nicht behauptet.

SHIP IT erzählt aus meiner Perspektive: Albumdateien prüfen, einen falsch benannten Coverpfad korrigieren, Build und Check bestehen, hochladen, den Browsercache umgehen und DE/EN einzeln prüfen. Die Hook ist ein wiederkehrender Release-Slogan. Die Strophen unterscheiden zwischen erfolgreichem Build, bestandener Prüfung und sichtbarer Live-Seite.

HALLUCINATION handelt von einem erfundenen Aufruf innerhalb einer fiktiven, versionierten Demo-API. Der Fehler wird durch Dokumentation und einen Test dieser Version eingegrenzt. Ein fehlender Link allein entscheidet die Funktionsfrage nicht.

CONTEXT WINDOW zeigt eine Zusammenfassung, die einzelne Entscheidungsgründe auslässt. Der vollständige gespeicherte Verlauf und die Projektdateien bleiben erhalten. Der Erzähler ergänzt die fehlende Erklärung im aktiven Kontext. [Kontextfenster und Zusammenfassung](https://platform.claude.com/docs/en/build-with-claude/context-windows).

## Prüfung und weiterer Produktionsstand

Die aktuellen Prompt-Fassungen wurden auf Zeichenlänge, Abschnittsformat, Refrainwiederholungen, sprachliche Natürlichkeit, Reime, technische Aussagen und die zugehörigen Szenen geprüft. Die englischen Fassungen sind eigenständige Adaptionen derselben Handlungsbögen.

Beim Anhören der weiteren Suno-Kandidaten werden besonders Verständlichkeit, tatsächliche Länge, die Entwicklung der Energie über 01–03, die helle Stimmung bei unverändertem Tempo in 04 und der Ausklang 05–06 geprüft. Für SHIP IT müssen die einzelne Stimme, die kurze Hook und die harten Bass-Drops tragen; für CONTEXT WINDOW muss das lange Outro hörbar ausklingen.

`album.yml` enthält Album- und Trackmetadaten sowie die beiden finalen TOKEN-BURN-Aufnahmen. Die neuen finalen VIBECODER-WAVs sind im jeweiligen `final/<Sprache>/01_Vibecoder_1.0.txt` dokumentiert; `album.yml` wurde für den Albumexport noch nicht auf sie umgestellt. Die Sprachfolge für die Albumveröffentlichung bleibt offen; YouTube-Sprachdefaults stehen vorläufig auf Deutsch. Die bestehenden Release-Skripte lesen einen finalen Prompt je Track direkt aus dem Trackordner. Die bestätigten Sprachfassungen liegen getrennt unter `final/de/` und `final/en/` und werden nicht automatisch als zwei gleichnamige Albumtracks exportiert. Vor dem Albumexport wird die gewünschte Sprachfolge in die üblichen Track-Prompts übernommen.

### TOKEN BURN · Final 1.0

Das gemeinsame [Trackcover für DE und EN](02_Token_Burn/02_Token_Burn_cover.png)
zeigt den nächtlichen Coding-Arbeitsplatz um 03:00 Uhr mit grossem TOKEN-BURN-Schriftzug.
Erstellt mit dem integrierten Bildgenerator; der [Bildprompt](02_Token_Burn/02_Token_Burn_cover_prompt.txt)
liegt für spätere Varianten daneben.

Beide Sprachfassungen am 6. Oktober 2026 bestätigt. Lyrics und Audio bleiben unverändert; die musikalischen Vorgaben sind im neuen Stil-Schema dargestellt. Die Dauer wurde aus den WAVs gelesen. Final-Prompts enthalten Sprache, Audioverweis und SHA-256.

| Sprache | Final-Prompt | Aufnahme | Tatsächliche Dauer |
| --- | --- | --- | --- |
| Deutsch | [Prompt 1.0](02_Token_Burn/final/de/02_Token_Burn_1.0.txt) | [WAV](<02_Token_Burn/suno-0.1/de/Token Burn - DE.wav>) | 4:05.9335 |
| Englisch | [Prompt 1.0](02_Token_Burn/final/en/02_Token_Burn_1.0.txt) | [WAV](<02_Token_Burn/suno-0.1/en/Token Burn - EN.wav>) | 4:10.8000 |

Transkripte und Audioanalysen vom 9. Oktober 2026 liegen neben den finalen
Sprachprompts. Jede WAV hat eigene Zeitmarken ab Sample 0:

| Sprache | Transkript | Audioanalyse |
| --- | --- | --- |
| Deutsch | [JSON](02_Token_Burn/final/de/02_Token_Burn_Transkript.json) · [SRT](02_Token_Burn/final/de/02_Token_Burn_Transkript.srt) · [TXT](02_Token_Burn/final/de/02_Token_Burn_Transkript.txt) | [Bericht](02_Token_Burn/final/de/ASTRA-AUDIO-ANALYSE.md) · [JSON](02_Token_Burn/final/de/ASTRA-AUDIO-ANALYSE.json) · [Grafik](02_Token_Burn/final/de/ASTRA-AUDIO-ANALYSE.png) |
| Englisch | [JSON](02_Token_Burn/final/en/02_Token_Burn_Transkript.json) · [SRT](02_Token_Burn/final/en/02_Token_Burn_Transkript.srt) · [TXT](02_Token_Burn/final/en/02_Token_Burn_Transkript.txt) | [Bericht](02_Token_Burn/final/en/ASTRA-AUDIO-ANALYSE.md) · [JSON](02_Token_Burn/final/en/ASTRA-AUDIO-ANALYSE.json) · [Grafik](02_Token_Burn/final/en/ASTRA-AUDIO-ANALYSE.png) |

Die ASR-Zeitmarken sind automatisch erzeugt; Wortlaut und unsichere Stellen
sind in den sprachgetrennten `TRANSKRIPT-PRUEFUNG.md` dokumentiert und vor der
Video-Endabnahme nachzuhören. Beide finalen WAVs bleiben unverändert.
[Lokaler Workflow](./_audio_analysis/README.md).

Das [TOKEN-BURN-Drehbuch „Nur noch diese eine Änderung“](_video_handoff/Vibecoder/02_Token_Burn/ASTRA-DREHBUCH.md)
ist mit 58 Einstellungen pro Sprache ausgearbeitet. Die
[vorbereitete Video-Albumstruktur](_video_handoff/Vibecoder/README.md) enthält
Zeitlisten, Keyword-Cues und Analyseschnappschüsse für TOKEN BURN und SHIP IT sowie vier weitere Track-Platzhalter.
Die Videoumsetzung steht noch aus; [Ablage und Kopierbefehl](_video_handoff/README.md).

### VIBECODER · finale Audios aus Entwurf 0.1

Beide Sprachfassungen erzählen denselben Alltag als eigenständige Texte: ein Skript löst ein kleines Problem, der Erzähler erzeugt Musik für seine Stimmung und lässt eine passende App bauen. Der Hook ruft auf Deutsch **„Ich bin Vibecoder!“** und auf Englisch **„I am a Vibecoder!“**. Die Bridge nimmt die Skepsis eines Hardcoders auf. Der Stil ist **Peak-Time Tech House / Dark Electro** mit 132-BPM-Ziel, rollendem Basslauf und längeren instrumentalen Groovepassagen. Die finalen WAVs liegen unter `01_Vibecoder/final/`; die 1.0-Dateien in `final/de/` und `final/en/` halten die genaue Audiozuordnung und die aktuellen Referenztexte fest. Gesungene Abweichungen werden im Transkript markiert.

[Deutsch: Lyrics](01_Vibecoder/suno-0.1/de/lyrics.txt) · [Englisch: Lyrics](01_Vibecoder/suno-0.1/en/lyrics.txt) · [Stil Deutsch](01_Vibecoder/suno-0.1/de/style.txt) · [Stil Englisch](01_Vibecoder/suno-0.1/en/style.txt) · [Suno-Platzhalter](01_Vibecoder/suno-0.1/de/settings.txt).

| Fassung | Finalbeleg | Transkript | Analyse | Prüfung |
| --- | --- | --- | --- | --- |
| DE | [1.0 und Audiozuordnung](01_Vibecoder/final/de/01_Vibecoder_1.0.txt) | [JSON](01_Vibecoder/final/de/01_Vibecoder_Transkript.json) · [SRT](01_Vibecoder/final/de/01_Vibecoder_Transkript.srt) | [Bericht](01_Vibecoder/final/de/ASTRA-AUDIO-ANALYSE.md) | [ASR-Prüfstellen](01_Vibecoder/final/de/TRANSKRIPT-PRUEFUNG.md) |
| EN | [1.0 und Audiozuordnung](01_Vibecoder/final/en/01_Vibecoder_1.0.txt) | [JSON](01_Vibecoder/final/en/01_Vibecoder_Transkript.json) · [SRT](01_Vibecoder/final/en/01_Vibecoder_Transkript.srt) | [Bericht](01_Vibecoder/final/en/ASTRA-AUDIO-ANALYSE.md) | [ASR-Prüfstellen](01_Vibecoder/final/en/TRANSKRIPT-PRUEFUNG.md) |

### SHIP IT · Finaler Track 03

SHIP IT ersetzt FRONTIER BATTLE vollständig. Die finale Suno-V3-Fassung veröffentlicht Album drei auf der eigenen Website: `npm run build`, ein fehlender Coverpfad in `npm run check`, ein überzähliger Unterstrich, erneuter Check, Deploy, harter Reload und DE/EN-Prüfung. Hook: **COMMIT IT. SHIP IT. / Build. Check. Live. / COMMIT IT. SHIP IT. / Album drei / three.** Stil: Hard Phonk / Industrial Bass, 140-BPM-Ziel.

| Sprache | Final-Prompt | Aufnahme | Transkript und Analyse |
| --- | --- | --- | --- |
| Deutsch | [Prompt 1.0](03_SHIP_IT/final/de/03_SHIP_IT_1.0.txt) | [WAV](03_SHIP_IT/final/03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav) · 2:35.960 | [Transkript](03_SHIP_IT/final/de/03_SHIP_IT_Transkript.json) · [Audioanalyse](03_SHIP_IT/final/de/ASTRA-AUDIO-ANALYSE.md) · [ASR-Prüfung](03_SHIP_IT/final/de/TRANSKRIPT-PRUEFUNG.md) |
| Englisch | [Prompt 1.0](03_SHIP_IT/final/en/03_SHIP_IT_1.0.txt) | [WAV](03_SHIP_IT/final/03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav) · 2:00.680 | [Transkript](03_SHIP_IT/final/en/03_SHIP_IT_Transkript.json) · [Audioanalyse](03_SHIP_IT/final/en/ASTRA-AUDIO-ANALYSE.md) · [ASR-Prüfung](03_SHIP_IT/final/en/TRANSKRIPT-PRUEFUNG.md) |

Das [Astra-Drehbuch „Der letzte Unterstrich“](_video_handoff/Vibecoder/03_SHIP_IT/ASTRA-DREHBUCH.md) hat 34 Einstellungen pro Sprache, eigene Zeitlisten und ein SHA-gesichertes Quellenmanifest. Die stark verfremdete Hook und die deutsche Bridge sind im Prüfbericht ausdrücklich als unsicher markiert. Das frühere Battle-Konzept liegt unter `archive/03_Frontier_Battle/`.
