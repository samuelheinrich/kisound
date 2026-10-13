# 04 Destination Unreachable – ASTRA-DREHBUCH

## Leitidee und emotionaler Verlauf

Ein Signal verschwindet auf dem Weg zum Ziel. Ein visuelles Ermittlungsprotokoll zeigt jeden gemessenen Hop und die Grenzen dessen, was ein fehlender Reply beweist.

**Verlauf:** Sendung → Schweigen → Spurensuche → mehrere mögliche Ursachen → offenes, präzises Ende.

## Bildsprache und wiederkehrende Motive

**Farbe und Material:** Graphit, Nebelgrau, kaltes Cyan; Fehlermeldungen nur als kurze rote Zeichen.

**Motive:** Wachsende Hop-Nummern, verblassende Wegmarken, schwarzer leerer Kartenraum, unvollständige Antwortzettel.

**Kamera:** Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

## Grundlage und Synchronisation

Originalaudio `04_Destination_Unreachable_0.3-1.wav`, SHA-256 `883d8e9f06995b5c82548cfb54a74ecf08ae89f825a1f92ab8613dd1807ef9c3`. Dauer 00:04:19.801. Die zugehörige Analyse misst -13.5 LUFS, -1.7 dBTP und empfiehlt ein geschätztes Raster von 132.0 BPM mit mittlerer Sicherheit.

Gesangszeiten stammen unverändert aus dem vorhandenen automatisch erzeugten Transkript. Eine manuelle Hörprüfung wird nicht behauptet. Gemessene Ereignisse und redaktionelle Bildideen bleiben im JSON durch `origin` unterscheidbar. Keine sichtbaren Firmenzeichen oder ASTRA-Marke im Film.

## Vollständige Szenenübersicht

| Szene | Start–Ende | Bildhandlung | Audio- und Textanker | Event-IDs |
| --- | --- | --- | --- | --- |
| 01 | 00:00:00.000–00:00:20.000 | Ein Time-Exceeded-Zettel markiert einen antwortenden Hop. | Destination unreachable. / Time exceeded. | E002, E003, E004, E005 |
| 02 | 00:00:20.000–00:00:30.740 | ICMP-Meldungen und fehlende Antworten werden als verschiedene Karten abgelegt. | Trace the path. / Hop by hop. | — |
| 03 | 00:00:30.740–00:00:45.360 | ICMP-Meldungen und fehlende Antworten werden als verschiedene Karten abgelegt. | I sent a signal into the core. / It crossed the edge and vanished. | E007, E008 |
| 04 | 00:00:45.360–00:01:09.360 | Die Nebelkarte lässt den Pfad an der ungeklärten Stelle offen. | Where did the packet go? / Nobody knows. | E009, E010, E011 |
| 05 | 00:01:09.360–00:01:21.720 | Ein Paket überquert bekannte Knoten und verschwindet hinter einer Grenze. | Instrumental, keine Textzeile belegt | E012, E013 |
| 06 | 00:01:21.720–00:01:41.720 | Die TTL der Prüfpakete wächst; antwortende Hops hinterlassen Stempel. | Traceroute counting through the dark, / every hop leaves a fading mark. | E014, E015 |
| 07 | 00:01:41.720–00:01:50.180 | Traceroute erhöht seine TTL schrittweise; jeder antwortende Hop hinterlässt eine Markierung. | still no path for the packet to return. | E016 |
| 08 | 00:01:50.180–00:02:02.820 | Ein Time-Exceeded-Zettel markiert einen antwortenden Hop. | TTL expired. / Next hop gone. | E017 |
| 09 | 00:02:02.820–00:02:22.820 | Die Nebelkarte lässt den Pfad an der ungeklärten Stelle offen. | Where did the packet go? / Nobody knows. | E018, E019, E020, E021 |
| 10 | 00:02:22.820–00:02:36.620 | Ein fehlender Präfix oder Filter wird als prüfbare Hypothese gezeigt. | The blackhole grows. / Send it again. | E023 |
| 11 | 00:02:36.620–00:02:54.700 | Die zweite Suche vergleicht Pfad- und Rückwegspuren; die Ursache bleibt nur so bestimmt wie die Daten. | Destination unreachable. / Destination unreachable. | E024, E025, E026 |
| 12 | 00:02:54.700–00:03:16.100 | Die zweite Suche vergleicht Pfad- und Rückwegspuren; die Ursache bleibt nur so bestimmt wie die Daten. | Instrumental, keine Textzeile belegt | E027, E028, E029 |
| 13 | 00:03:16.100–00:03:40.100 | Finale: Die Landschaft wird weiter abgefahren, während die Stimme abklingt. | Instrumental, keine Textzeile belegt | E030, E031 |
| 14 | 00:03:40.100–00:04:00.100 | Finale: Die Landschaft wird weiter abgefahren, während die Stimme abklingt. | Instrumental, keine Textzeile belegt | E032, E033, E034, E035 |
| 15 | 00:04:00.100–00:04:19.801 | Das tatsächlich lange Ende erhält aktive Kamera- und Lichtbewegung bis zum letzten Audioabschnitt. | Destination unreachable. / Destination unreachable. | E036, E037, E038, E039 |

## Regie, Kamera und Übergänge

### Szene 01 · 00:00:00.000–00:00:20.000

**Aktion:** Ein Time-Exceeded-Zettel markiert einen antwortenden Hop.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Destination unreachable. / Time exceeded. Weitere Zeilen: No reply. / Packet lost. / Blackhole route.

**Struktur-Cues:** E004 bei 00:00:01.700: Geglätteter RMS-Verlauf ändert sich über 1 s um -18.8 dB. Kamerafahrt an einer unvollständigen Antwort anhalten; E005 bei 00:00:03.660: Beginn Pulse; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E003 bei 00:00:00.901 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:00:20.000 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 02 · 00:00:20.000–00:00:30.740

**Aktion:** ICMP-Meldungen und fehlende Antworten werden als verschiedene Karten abgelegt.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Trace the path. / Hop by hop. Weitere Zeilen: No return.

**Struktur:** Die Szene folgt ihrem gemessenen Pegelverlauf ohne behaupteten neuen Songteil.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:00:30.740 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 03 · 00:00:30.740–00:00:45.360

**Aktion:** ICMP-Meldungen und fehlende Antworten werden als verschiedene Karten abgelegt.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** I sent a signal into the core. / It crossed the edge and vanished. Weitere Zeilen: No alarm. / No answer. / Only silence from the next hop.

**Struktur-Cues:** E007 bei 00:00:30.740: Beginn Spoken; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E008 bei 00:00:32.600: Geglätteter RMS-Verlauf ändert sich über 1 s um -3.9 dB. Kamerafahrt an einer unvollständigen Antwort anhalten.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:00:45.360 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 04 · 00:00:45.360–00:01:09.360

**Aktion:** Die Nebelkarte lässt den Pfad an der ungeklärten Stelle offen.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Where did the packet go? / Nobody knows. Weitere Zeilen: Where did the packet go? / The blackhole grows. / Send it again.

**Struktur-Cues:** E009 bei 00:00:45.360: Beginn Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E011 bei 00:00:58.800: Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB. Weitere Pfadmarken in der Landschaft sichtbar machen.

**Einzelimpuls:** E010 bei 00:00:51.351 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:09.360 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 05 · 00:01:09.360–00:01:21.720

**Aktion:** Ein Paket überquert bekannte Knoten und verschwindet hinter einer Grenze.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E012 bei 00:01:09.360: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E013 bei 00:01:20.300: Geglätteter RMS-Verlauf ändert sich über 1 s um -4.1 dB. Kamerafahrt an einer unvollständigen Antwort anhalten.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:01:21.720 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 06 · 00:01:21.720–00:01:41.720

**Aktion:** Die TTL der Prüfpakete wächst; antwortende Hops hinterlassen Stempel.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Traceroute counting through the dark, / every hop leaves a fading mark. Weitere Zeilen: Firewall quiet, routing cold, / one lost prefix breaks the road. / Echo request into the night,

**Struktur-Cues:** E014 bei 00:01:21.720: Beginn Verse 2; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E015 bei 00:01:24.081 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:41.720 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 07 · 00:01:41.720–00:01:50.180

**Aktion:** Traceroute erhöht seine TTL schrittweise; jeder antwortende Hop hinterlässt eine Markierung.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** still no path for the packet to return. 

**Struktur-Cues:** E016 bei 00:01:48.500: Geglätteter RMS-Verlauf ändert sich über 1 s um -2.7 dB. Kamerafahrt an einer unvollständigen Antwort anhalten.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:01:50.180 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 08 · 00:01:50.180–00:02:02.820

**Aktion:** Ein Time-Exceeded-Zettel markiert einen antwortenden Hop.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** TTL expired. / Next hop gone. Weitere Zeilen: Silent gateway. / Moving on. / ICMP.

**Struktur-Cues:** E017 bei 00:01:50.180: Beginn Break; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:02:02.820 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 09 · 00:02:02.820–00:02:22.820

**Aktion:** Die Nebelkarte lässt den Pfad an der ungeklärten Stelle offen.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Where did the packet go? / Nobody knows. Weitere Zeilen: Where did the packet go?

**Struktur-Cues:** E018 bei 00:02:02.820: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E019 bei 00:02:03.900: Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB. Weitere Pfadmarken in der Landschaft sichtbar machen; E021 bei 00:02:12.340: Beginn Final Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E020 bei 00:02:11.351 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:02:22.820 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 10 · 00:02:22.820–00:02:36.620

**Aktion:** Ein fehlender Präfix oder Filter wird als prüfbare Hypothese gezeigt.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** The blackhole grows. / Send it again. Weitere Zeilen: Watch it fall. / Destination unreachable. / No route at all.

**Struktur-Cues:** E023 bei 00:02:34.100: Geglätteter RMS-Verlauf ändert sich über 1 s um -3.0 dB. Kamerafahrt an einer unvollständigen Antwort anhalten.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:02:36.620 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 11 · 00:02:36.620–00:02:54.700

**Aktion:** Die zweite Suche vergleicht Pfad- und Rückwegspuren; die Ursache bleibt nur so bestimmt wie die Daten.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Destination unreachable. / Destination unreachable. Weitere Zeilen: Destination unreachable.

**Struktur-Cues:** E024 bei 00:02:36.620: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E025 bei 00:02:43.800: Beginn Finale; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E026 bei 00:02:47.261 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:02:54.700 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 12 · 00:02:54.700–00:03:16.100

**Aktion:** Die zweite Suche vergleicht Pfad- und Rückwegspuren; die Ursache bleibt nur so bestimmt wie die Daten.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E027 bei 00:02:54.700: Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB. Weitere Pfadmarken in der Landschaft sichtbar machen.

**Einzelimpuls:** E028 bei 00:02:58.171 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:16.100 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 13 · 00:03:16.100–00:03:40.100

**Aktion:** Finale: Die Landschaft wird weiter abgefahren, während die Stimme abklingt.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E030 bei 00:03:16.100: Geglätteter RMS-Verlauf ändert sich über 1 s um +5.8 dB. Weitere Pfadmarken in der Landschaft sichtbar machen.

**Einzelimpuls:** E031 bei 00:03:29.081 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:40.100 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 14 · 00:03:40.100–00:04:00.100

**Aktion:** Finale: Die Landschaft wird weiter abgefahren, während die Stimme abklingt.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E032 bei 00:03:40.100: Geglätteter RMS-Verlauf ändert sich über 1 s um +5.6 dB. Weitere Pfadmarken in der Landschaft sichtbar machen; E034 bei 00:03:49.400: Geglätteter RMS-Verlauf ändert sich über 1 s um +4.6 dB. Weitere Pfadmarken in der Landschaft sichtbar machen.

**Einzelimpuls:** E033 bei 00:03:49.301 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:04:00.100 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 15 · 00:04:00.100–00:04:19.801

**Aktion:** Das tatsächlich lange Ende erhält aktive Kamera- und Lichtbewegung bis zum letzten Audioabschnitt.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.

**Textbezug:** Destination unreachable. / Destination unreachable. 

**Struktur-Cues:** E038 bei 00:04:13.900: Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB. Schlussblende frühestens hier einsetzen; E039 bei 00:04:15.940: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E041 bei 00:04:18.400: Geglätteter RMS-Verlauf ändert sich über 1 s um -71.1 dB. Kamerafahrt an einer unvollständigen Antwort anhalten.

**Einzelimpuls:** E036 bei 00:04:04.081 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:04:19.801 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

## Instrumentale Passagen und tatsächliches Ende

Die letzte übernommene Gesangszeile endet bei 00:04:15.940. Der Tonträger läuft bis 00:04:19.801. Zwischen Gesangsabschnitten und danach bleiben die Bildhandlungen der jeweiligen Szenen aktiv; keine pauschale Schlussblende am letzten Wort.

Späte Mess-Cues: E041 00:04:18.400 energy_fall; E042 00:04:19.801 end. Schlussbild erst bei einem nachgewiesenen Endabfall auflösen; sonst bis kurz vor das Audioende aktiv halten.

## Assets und wiederverwendbare Module

Nebelkarte, Hop-Stempel, TTL-Zähler, ICMP-Karten, Ziellicht, Diagnosefäden.

Wiederverwendbare Code-Module: Szenenkamera mit vorgegebenem Pfad, Audio-Kurven-Interpolator, Event-Trigger, Text-/Status-Overlay, deterministisches Partikelfeld und Abschlussblende. Die Geometrie, Farben und Metaphern bleiben trackspezifisch.

## Technische Leitplanken

ICMP Destination Unreachable, Time Exceeded und fehlende Antwort unterscheiden. Ein fehlender Traceroute-Hop beweist keinen Paketverlust für gesamten Transit. TTL wird pro Hop reduziert.

Lyrics sind gestalterische Quelle, keine automatische fachliche Wahrheit. Textzitate nur aus den im Analyse-JSON enthaltenen `lyrics.segments` verwenden; dort ausgeschlossene Quellsegmente nicht ins Bild übernehmen. Messwerte nicht als sichtbare Netzwerk-Telemetrie ausgeben.

## Deterministisches Rendering

Videozeit `t = frame_index / fps`, empfohlen 30 fps bei konstantem Raster. Audio bleibt unverändert und beginnt bei t=0. Für jeden Frame 100-ms-Steuerwerte linear interpolieren; schnelle Impulse aus `events` oder `onsets` nur einmal bei `round(time_s*fps)` auslösen. Zufall ausschliesslich aus festem Track-Seed und stabilen Objekt-IDs ableiten. Bewegungszustände aus absoluter Zeit berechnen, damit Reihenfolge und Parallelisierung identische Frames ergeben. Bei der finalen Audioeinbettung das Original-WAV und seine volle Dauer behalten.

## Abnahme

- Szene 1 beginnt bei 00:00:00.000; die letzte Szene endet exakt bei 00:04:19.801.
- Alle Tabellen-Event-IDs existieren im Analyse-JSON und ihre Zeiten liegen innerhalb der Szene.
- Gesungene Zitate stammen aus den zugeordneten Transkriptsegmenten; überlappende oder als Abschnittsname markierte Segmente erscheinen nicht.
- Grosse Wechsel folgen anhaltenden Energie- oder Abschnitts-Cues; einzelne Onsets steuern nur einzelne Aktionen.
- Die technische Darstellung folgt den obigen Leitplanken, ohne Firmenwerbung oder Logos.
- Das instrumentale Ende bleibt bis zur gemessenen Schlussentwicklung gestaltet.
