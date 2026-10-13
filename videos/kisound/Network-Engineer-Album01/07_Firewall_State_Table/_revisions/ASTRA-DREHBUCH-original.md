# 07 Firewall State Table – ASTRA-DREHBUCH

## Leitidee und emotionaler Verlauf

Eine Sicherheitsarchitektur entscheidet anhand von Regel, Richtung und Verbindungszustand. Das Tor merkt sich erlaubte Sessions und erkennt unpassende Rückkehrer.

**Verlauf:** geschlossene Grenze → geregelter Einlass → komplexere Übersetzung → Bedrohungsdruck → nachvollziehbarer Zustand.

## Bildsprache und wiederkehrende Motive

**Farbe und Material:** Obsidian, klares Weiss für Regeln, Bernstein für erlaubte Zustände, knappes Rot für Deny.

**Motive:** Transparente Zustandskarten, Regelzeilen, Eingangs- und Ausgangstore, Protokollspuren.

**Kamera:** Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

## Grundlage und Synchronisation

Originalaudio `07_Firewall_State_Table_0.4-2.wav`, SHA-256 `6fcc83f53b3146a4754354b9dfd7c8644de53bf57c992aadb76a9fc9a62f754d`. Dauer 00:04:19.321. Die zugehörige Analyse misst -13.2 LUFS, -1.8 dBTP und empfiehlt ein geschätztes Raster von 142.0 BPM mit mittlerer Sicherheit.

Gesangszeiten stammen unverändert aus dem vorhandenen automatisch erzeugten Transkript. Eine manuelle Hörprüfung wird nicht behauptet. Gemessene Ereignisse und redaktionelle Bildideen bleiben im JSON durch `origin` unterscheidbar. Keine sichtbaren Firmenzeichen oder ASTRA-Marke im Film.

## Vollständige Szenenübersicht

| Szene | Start–Ende | Bildhandlung | Audio- und Textanker | Event-IDs |
| --- | --- | --- | --- | --- |
| 01 | 00:00:00.000–00:00:24.000 | Eine geschlossene Grenzlinie zeigt «default deny» als Ausgangslage. | Session open. / State is known. | E002, E003, E004, E005 |
| 02 | 00:00:24.000–00:00:50.600 | Ein erster Verbindungswunsch erhält einen Regelentscheid. | Instrumental, keine Textzeile belegt | E007, E008, E009, E010 |
| 03 | 00:00:50.600–00:01:10.740 | Die Grenze bleibt geschlossen, bis eine explizite Regel einen Weg öffnet. | Default deny in the security zone, / policy chain decides what can be known. | E011, E012, E013, E014 |
| 04 | 00:01:10.740–00:01:36.460 | Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid. | Source NAT hides the inside name. / Destination NAT redirects the frame. | E015, E016, E017, E018 |
| 05 | 00:01:36.460–00:01:51.240 | Erlaubte Session legt eine Zustandskarte an; passende Rückpakete können zugeordnet werden. | Instrumental, keine Textzeile belegt | E020, E021, E022 |
| 06 | 00:01:51.240–00:02:03.500 | Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid. | Trust no packet in the night, / least privilege, hold the line. | E023 |
| 07 | 00:02:03.500–00:02:26.920 | Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid. | A-C-L cuts through the stream, / NAT reflection bends the scene. | E024, E025, E026 |
| 08 | 00:02:26.920–00:02:44.780 | Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid. | SYN. / ACK. | E027 |
| 09 | 00:02:44.780–00:03:03.100 | Im Chorus tritt Least Privilege als wenige präzise geöffnete Wege auf. | Instrumental, keine Textzeile belegt | E028, E029, E030 |
| 10 | 00:03:03.100–00:03:15.000 | Die Zustandskarten werden lesbar in einer zeitlich geordneten Tabelle geführt. | State table. Lock it. / Packet hits. Stop it. | E031, E032, E033 |
| 11 | 00:03:15.000–00:03:34.500 | SYN und ACK erscheinen in korrekter Reihenfolge einer TCP-Sitzung. | Instrumental, keine Textzeile belegt | E034, E036 |
| 12 | 00:03:34.500–00:03:48.100 | Die finale Hook zeigt eine wachsende, aber lesbare State Table. | Instrumental, keine Textzeile belegt | E037, E038 |
| 13 | 00:03:48.100–00:04:08.100 | Die finale Hook zeigt eine wachsende, aber lesbare State Table. | Instrumental, keine Textzeile belegt | E039, E040, E041 |
| 14 | 00:04:08.100–00:04:19.321 | Das instrumentale Ende führt aktive Sessions und Logs bis zum Audioende fort. | Instrumental, keine Textzeile belegt | E042, E043 |

## Regie, Kamera und Übergänge

### Szene 01 · 00:00:00.000–00:00:24.000

**Aktion:** Eine geschlossene Grenzlinie zeigt «default deny» als Ausgangslage.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Session open. / State is known. Weitere Zeilen: Every packet. / stands alone.

**Struktur-Cues:** E002 bei 00:00:01.700: Geglätteter RMS-Verlauf ändert sich über 1 s um -7.5 dB. Regelzeile und Deny-Tor in Nahaufnahme isolieren; E003 bei 00:00:09.940: Beginn Intro; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E004 bei 00:00:13.100: Geglätteter RMS-Verlauf ändert sich über 1 s um +5.0 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E006 bei 00:00:23.151 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:00:24.000 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 02 · 00:00:24.000–00:00:50.600

**Aktion:** Ein erster Verbindungswunsch erhält einen Regelentscheid.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E007 bei 00:00:24.000: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E009 bei 00:00:43.800: Geglätteter RMS-Verlauf ändert sich über 1 s um +5.1 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E008 bei 00:00:30.761 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:00:50.600 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 03 · 00:00:50.600–00:01:10.740

**Aktion:** Die Grenze bleibt geschlossen, bis eine explizite Regel einen Weg öffnet.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Default deny in the security zone, / policy chain decides what can be known. Weitere Zeilen: Source and destination, port and state, / one wrong packet hits the gate. / T-C-P handshake, sequence aligned,

**Struktur-Cues:** E011 bei 00:00:50.600: Beginn Verse; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E012 bei 00:00:52.731 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:10.740 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 04 · 00:01:10.740–00:01:36.460

**Aktion:** Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Source NAT hides the inside name. / Destination NAT redirects the frame. Weitere Zeilen: Deep inspection reads what flows, / permit or deny, the firewall knows. / Drop it.

**Struktur-Cues:** E015 bei 00:01:10.740: Beginn Pre-Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E017 bei 00:01:18.640: Beginn Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E018 bei 00:01:24.800: Geglätteter RMS-Verlauf ändert sich über 1 s um +4.9 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E016 bei 00:01:15.131 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:36.460 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 05 · 00:01:36.460–00:01:51.240

**Aktion:** Erlaubte Session legt eine Zustandskarte an; passende Rückpakete können zugeordnet werden.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E020 bei 00:01:36.460: Beginn Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E022 bei 00:01:41.100: Geglätteter RMS-Verlauf ändert sich über 1 s um +5.5 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E021 bei 00:01:40.481 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:51.240 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 06 · 00:01:51.240–00:02:03.500

**Aktion:** Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Trust no packet in the night, / least privilege, hold the line. Weitere Zeilen: Source to destination, / port to application, / every session leaves a sign.

**Struktur-Cues:** E023 bei 00:01:51.240: Beginn Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:02:03.500 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 07 · 00:02:03.500–00:02:26.920

**Aktion:** Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** A-C-L cuts through the stream, / NAT reflection bends the scene. Weitere Zeilen: Inside local, outside global, / translation keeps the traffic mobile. / Deep packet inspection in the flow,

**Struktur-Cues:** E024 bei 00:02:03.500: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E025 bei 00:02:04.900: Geglätteter RMS-Verlauf ändert sich über 1 s um +6.5 dB. Erlaubte Verbindungswege der Halle öffnen; E026 bei 00:02:10.440: Beginn Verse 2; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:02:26.920 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 08 · 00:02:26.920–00:02:44.780

**Aktion:** Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** SYN. / ACK. Weitere Zeilen: Session match. / Deny. / Permit.

**Struktur-Cues:** E027 bei 00:02:26.920: Beginn Break; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:02:44.780 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 09 · 00:02:44.780–00:03:03.100

**Aktion:** Im Chorus tritt Least Privilege als wenige präzise geöffnete Wege auf.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E028 bei 00:02:44.780: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E029 bei 00:02:47.100: Geglätteter RMS-Verlauf ändert sich über 1 s um +7.4 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E030 bei 00:02:48.931 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:03.100 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 10 · 00:03:03.100–00:03:15.000

**Aktion:** Die Zustandskarten werden lesbar in einer zeitlich geordneten Tabelle geführt.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** State table. Lock it. / Packet hits. Stop it. Weitere Zeilen: No match. Knock it. / Write rule. Lock it.

**Struktur-Cues:** E031 bei 00:03:03.100: Beginn Final Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E033 bei 00:03:12.700: Geglätteter RMS-Verlauf ändert sich über 1 s um -5.1 dB. Regelzeile und Deny-Tor in Nahaufnahme isolieren.

**Einzelimpuls:** E032 bei 00:03:12.171 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:15.000 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 11 · 00:03:15.000–00:03:34.500

**Aktion:** SYN und ACK erscheinen in korrekter Reihenfolge einer TCP-Sitzung.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E034 bei 00:03:15.000: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E036 bei 00:03:24.001 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:34.500 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 12 · 00:03:34.500–00:03:48.100

**Aktion:** Die finale Hook zeigt eine wachsende, aber lesbare State Table.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E037 bei 00:03:34.500: Geglätteter RMS-Verlauf ändert sich über 1 s um +6.8 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E038 bei 00:03:35.411 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:48.100 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 13 · 00:03:48.100–00:04:08.100

**Aktion:** Die finale Hook zeigt eine wachsende, aber lesbare State Table.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E039 bei 00:03:48.100: Geglätteter RMS-Verlauf ändert sich über 1 s um +7.4 dB. Erlaubte Verbindungswege der Halle öffnen.

**Einzelimpuls:** E041 bei 00:03:48.511 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:04:08.100 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 14 · 00:04:08.100–00:04:19.321

**Aktion:** Das instrumentale Ende führt aktive Sessions und Logs bis zum Audioende fort.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E042 bei 00:04:13.400: Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB. Schlussblende frühestens hier einsetzen; E043 bei 00:04:17.900: Geglätteter RMS-Verlauf ändert sich über 1 s um -30.3 dB. Regelzeile und Deny-Tor in Nahaufnahme isolieren.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:04:19.321 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

## Instrumentale Passagen und tatsächliches Ende

Die letzte übernommene Gesangszeile endet bei 00:03:15.000. Der Tonträger läuft bis 00:04:19.321. Zwischen Gesangsabschnitten und danach bleiben die Bildhandlungen der jeweiligen Szenen aktiv; keine pauschale Schlussblende am letzten Wort.

Späte Mess-Cues: E037 00:03:34.500 energy_rise; E039 00:03:48.100 energy_rise; E042 00:04:13.400 fade_candidate; E043 00:04:17.900 energy_fall; E044 00:04:19.321 end. Schlussbild erst bei einem nachgewiesenen Endabfall auflösen; sonst bis kurz vor das Audioende aktiv halten.

## Assets und wiederverwendbare Module

Torarchitektur, Policy-Tafel, State-Karten, NAT-Prismen, Log-Schrift, TCP-Sitzungsmarker.

Wiederverwendbare Code-Module: Szenenkamera mit vorgegebenem Pfad, Audio-Kurven-Interpolator, Event-Trigger, Text-/Status-Overlay, deterministisches Partikelfeld und Abschlussblende. Die Geometrie, Farben und Metaphern bleiben trackspezifisch.

## Technische Leitplanken

Stateful Inspection ordnet Verkehr einer Verbindung zu; ACL und State Table sind unterschiedliche Konzepte. NAT, Policy und Logging getrennt darstellen. Eine SYN/ACK-Folge nicht als generelle Regel für jedes Protokoll ausgeben.

Lyrics sind gestalterische Quelle, keine automatische fachliche Wahrheit. Textzitate nur aus den im Analyse-JSON enthaltenen `lyrics.segments` verwenden; dort ausgeschlossene Quellsegmente nicht ins Bild übernehmen. Messwerte nicht als sichtbare Netzwerk-Telemetrie ausgeben.

## Deterministisches Rendering

Videozeit `t = frame_index / fps`, empfohlen 30 fps bei konstantem Raster. Audio bleibt unverändert und beginnt bei t=0. Für jeden Frame 100-ms-Steuerwerte linear interpolieren; schnelle Impulse aus `events` oder `onsets` nur einmal bei `round(time_s*fps)` auslösen. Zufall ausschliesslich aus festem Track-Seed und stabilen Objekt-IDs ableiten. Bewegungszustände aus absoluter Zeit berechnen, damit Reihenfolge und Parallelisierung identische Frames ergeben. Bei der finalen Audioeinbettung das Original-WAV und seine volle Dauer behalten.

## Abnahme

- Szene 1 beginnt bei 00:00:00.000; die letzte Szene endet exakt bei 00:04:19.321.
- Alle Tabellen-Event-IDs existieren im Analyse-JSON und ihre Zeiten liegen innerhalb der Szene.
- Gesungene Zitate stammen aus den zugeordneten Transkriptsegmenten; überlappende oder als Abschnittsname markierte Segmente erscheinen nicht.
- Grosse Wechsel folgen anhaltenden Energie- oder Abschnitts-Cues; einzelne Onsets steuern nur einzelne Aktionen.
- Die technische Darstellung folgt den obigen Leitplanken, ohne Firmenwerbung oder Logos.
- Das instrumentale Ende bleibt bis zur gemessenen Schlussentwicklung gestaltet.
