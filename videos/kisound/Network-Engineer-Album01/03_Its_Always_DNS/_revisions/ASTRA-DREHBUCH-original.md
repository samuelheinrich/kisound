# 03 Its Always DNS – ASTRA-DREHBUCH

## Leitidee und emotionaler Verlauf

Ein Detektivfall über eine funktionierende IP-Verbindung und eine fehlerhafte Namensauflösung. Hinweise sind Cache, TTL, Antworten und Zonenansichten.

**Verlauf:** falscher Alarm → Ausschlussdiagnose → DNS-Spur → widersprüchliche Antworten → Auflösung mit ironischem Nachhall.

## Bildsprache und wiederkehrende Motive

**Farbe und Material:** Dunkles Aktenblau, Papierweiss, gelbe Suchmarken, leuchtendes Magenta für widersprüchliche DNS-Antworten.

**Motive:** Fallakte, Lupe, Fragezettel mit Hostname, Antwortumschläge, Sanduhr für TTL.

**Kamera:** Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

## Grundlage und Synchronisation

Originalaudio `03_Its_Always_DNS_0.3-2.wav`, SHA-256 `b68aaccb7fddb1eea9241f6bc8f2a91ba30ad532e72355a1ac4309338ec294c4`. Dauer 00:04:21.200. Die zugehörige Analyse misst -13.6 LUFS, -2.6 dBTP und empfiehlt ein geschätztes Raster von 127.0 BPM mit mittlerer Sicherheit.

Gesangszeiten stammen unverändert aus dem vorhandenen automatisch erzeugten Transkript. Eine manuelle Hörprüfung wird nicht behauptet. Gemessene Ereignisse und redaktionelle Bildideen bleiben im JSON durch `origin` unterscheidbar. Keine sichtbaren Firmenzeichen oder ASTRA-Marke im Film.

## Vollständige Szenenübersicht

| Szene | Start–Ende | Bildhandlung | Audio- und Textanker | Event-IDs |
| --- | --- | --- | --- | --- |
| 01 | 00:00:00.000–00:00:15.080 | Ein Nutzer meldet «Network down»; die Fallakte öffnet sich. | Instrumental, keine Textzeile belegt | E002 |
| 02 | 00:00:15.080–00:00:30.580 | Ping- und Routing-Hinweise werden in der Fallakte abgelegt. | They call me up, the network is down, / everybody staring at the blinking crown. | E003 |
| 03 | 00:00:30.580–00:00:48.120 | Kabel, Port und Firewall werden als getrennte Spuren überprüft. | Check the cable, check the port, / check the firewall report. | E004, E005, E006, E007 |
| 04 | 00:00:48.120–00:00:59.580 | Kabel, Port und Firewall erscheinen als überprüfte Spuren. | It's always DNS, / not the switch, not the mess. | E009, E010, E011, E012 |
| 05 | 00:00:59.580–00:01:23.400 | Ein veralteter Cache steht einem aktuellen Resolver gegenüber; die TTL-Sanduhr läuft. | Cache is old, TTL too high, / split brain zones make admins cry. | E013, E014, E015, E016 |
| 06 | 00:01:23.400–00:01:38.200 | Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte. | Flush it. / Query it. | E018, E019, E020, E021 |
| 07 | 00:01:38.200–00:01:48.580 | Die Lupe findet den fehlenden Hostnamen; erste DNS-Abfrage wird sichtbar. | Instrumental, keine Textzeile belegt | E023, E024 |
| 08 | 00:01:48.580–00:02:00.420 | Antwort und TTL werden als Umschlag und Sanduhr inszeniert. | It's always DNS, / from the helpdesk to the stress. | E025 |
| 09 | 00:02:00.420–00:02:20.420 | Antwort und TTL werden als Umschlag und Sanduhr inszeniert. | Instrumental, keine Textzeile belegt | E026, E027, E028, E029 |
| 10 | 00:02:20.420–00:02:40.420 | Veralteter Cache und uneinheitliche Ansichten verschiedener Resolver bilden ein Spiegellabyrinth. | Instrumental, keine Textzeile belegt | E032, E033, E034, E035 |
| 11 | 00:02:40.420–00:03:00.420 | NXDOMAIN erscheint als echte negative Antwort, nicht als verschwundenes Paket. | Instrumental, keine Textzeile belegt | E036, E037, E038, E039 |
| 12 | 00:03:00.420–00:03:21.800 | NXDOMAIN erscheint als echte negative Antwort, nicht als verschwundenes Paket. | Instrumental, keine Textzeile belegt | — |
| 13 | 00:03:21.800–00:03:34.840 | Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte. | I ask, what about DNS? / Dig it up. | E041, E042, E043, E044 |
| 14 | 00:03:34.840–00:03:45.660 | Eine gezielte neue Abfrage klärt die aktuelle Antwort; die Akte wird geschlossen. | It's always DNS, / Not the switch. | E052, E053, E054, E055 |
| 15 | 00:03:45.660–00:03:59.260 | Ein veralteter Cache steht einem aktuellen Resolver gegenüber; die TTL-Sanduhr läuft. | why do we always guess? / Cache is old, TTL too high, | E056, E057, E058, E059 |
| 16 | 00:03:59.260–00:04:10.620 | Die lange musikalische Reprise dreht den Fall noch einmal aus Nutzersicht; keine erfundenen Textzeilen einblenden. | split brain zones make admins cry. / Forward lookup, reverse pain, | E062, E063, E064, E065 |
| 17 | 00:04:10.620–00:04:21.200 | Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte. | Flush it. / Query it. | E067, E068, E069, E070 |

## Regie, Kamera und Übergänge

### Szene 01 · 00:00:00.000–00:00:15.080

**Aktion:** Ein Nutzer meldet «Network down»; die Fallakte öffnet sich.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur:** Die Szene folgt ihrem gemessenen Pegelverlauf ohne behaupteten neuen Songteil.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:00:15.080 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 02 · 00:00:15.080–00:00:30.580

**Aktion:** Ping- und Routing-Hinweise werden in der Fallakte abgelegt.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** They call me up, the network is down, / everybody staring at the blinking crown. Weitere Zeilen: Ping is clean and the routes are fine, / but the hostname vanished from the line.

**Struktur-Cues:** E003 bei 00:00:15.080: Beginn Verse; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:00:30.580 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 03 · 00:00:30.580–00:00:48.120

**Aktion:** Kabel, Port und Firewall werden als getrennte Spuren überprüft.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Check the cable, check the port, / check the firewall report. Weitere Zeilen: Trace complete, no mystery, / then I ask: what about DNS? / Dig it up.

**Struktur-Cues:** E004 bei 00:00:30.580: Beginn Pre-Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E005 bei 00:00:36.400: Geglätteter RMS-Verlauf ändert sich über 1 s um -5.8 dB. Fallakte auf einen einzelnen Resolver konzentrieren; E006 bei 00:00:38.680: Beginn Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E007 bei 00:00:40.241 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:00:48.120 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 04 · 00:00:48.120–00:00:59.580

**Aktion:** Kabel, Port und Firewall erscheinen als überprüfte Spuren.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** It's always DNS, / not the switch, not the mess. Weitere Zeilen: It's always DNS, / why do we always guess?

**Struktur-Cues:** E009 bei 00:00:48.120: Beginn Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E012 bei 00:00:59.200: Geglätteter RMS-Verlauf ändert sich über 1 s um -5.6 dB. Fallakte auf einen einzelnen Resolver konzentrieren.

**Einzelimpuls:** E010 bei 00:00:48.271 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:00:59.580 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 05 · 00:00:59.580–00:01:23.400

**Aktion:** Ein veralteter Cache steht einem aktuellen Resolver gegenüber; die TTL-Sanduhr läuft.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Cache is old, TTL too high, / split brain zones make admins cry. Weitere Zeilen: Forward lookup, reverse pain, / CNAME dancing in the rain.

**Struktur-Cues:** E013 bei 00:00:59.580: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E015 bei 00:01:08.020: Beginn Verse 2; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E017 bei 00:01:23.100: Geglätteter RMS-Verlauf ändert sich über 1 s um -10.6 dB. Fallakte auf einen einzelnen Resolver konzentrieren.

**Einzelimpuls:** E014 bei 00:01:06.221 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:23.400 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 06 · 00:01:23.400–00:01:38.200

**Aktion:** Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Flush it. / Query it. Weitere Zeilen: Dig it. / Fix it. / Not the network.

**Struktur-Cues:** E018 bei 00:01:23.400: Beginn Bridge; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E021 bei 00:01:31.260: Beginn Final Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpuls:** E022 bei 00:01:34.071 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:01:38.200 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 07 · 00:01:38.200–00:01:48.580

**Aktion:** Die Lupe findet den fehlenden Hostnamen; erste DNS-Abfrage wird sichtbar.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E023 bei 00:01:38.200: Beginn Final Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E024 bei 00:01:47.000: Geglätteter RMS-Verlauf ändert sich über 1 s um +4.9 dB. Abfragekette und Suchlicht räumlich öffnen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:01:48.580 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 08 · 00:01:48.580–00:02:00.420

**Aktion:** Antwort und TTL werden als Umschlag und Sanduhr inszeniert.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** It's always DNS, / from the helpdesk to the stress. Weitere Zeilen: It's always DNS, / close the case, confess.

**Struktur-Cues:** E025 bei 00:01:48.580: Beginn Final Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:02:00.420 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 09 · 00:02:00.420–00:02:20.420

**Aktion:** Antwort und TTL werden als Umschlag und Sanduhr inszeniert.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E026 bei 00:02:00.420: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E027 bei 00:02:01.400: Geglätteter RMS-Verlauf ändert sich über 1 s um +37.7 dB. Abfragekette und Suchlicht räumlich öffnen; E029 bei 00:02:09.700: Geglätteter RMS-Verlauf ändert sich über 1 s um -56.8 dB. Fallakte auf einen einzelnen Resolver konzentrieren.

**Einzelimpuls:** E028 bei 00:02:04.241 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:02:20.420 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 10 · 00:02:20.420–00:02:40.420

**Aktion:** Veralteter Cache und uneinheitliche Ansichten verschiedener Resolver bilden ein Spiegellabyrinth.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E034 bei 00:02:31.400: Geglätteter RMS-Verlauf ändert sich über 1 s um +5.0 dB. Abfragekette und Suchlicht räumlich öffnen.

**Einzelimpuls:** E032 bei 00:02:21.251 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:02:40.420 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 11 · 00:02:40.420–00:03:00.420

**Aktion:** NXDOMAIN erscheint als echte negative Antwort, nicht als verschwundenes Paket.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur-Cues:** E037 bei 00:02:50.600: Geglätteter RMS-Verlauf ändert sich über 1 s um -8.4 dB. Fallakte auf einen einzelnen Resolver konzentrieren.

**Einzelimpuls:** E036 bei 00:02:44.491 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:00.420 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 12 · 00:03:00.420–00:03:21.800

**Aktion:** NXDOMAIN erscheint als echte negative Antwort, nicht als verschwundenes Paket.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Instrumental, keine Textzeile belegt 

**Struktur:** Die Szene folgt ihrem gemessenen Pegelverlauf ohne behaupteten neuen Songteil.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:03:21.800 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 13 · 00:03:21.800–00:03:34.840

**Aktion:** Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** I ask, what about DNS? / Dig it up. Weitere Zeilen: TTL. / NXDOMAIN. / Who can tell?

**Struktur-Cues:** E041 bei 00:03:21.800: Beginn Reprise – Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E042 bei 00:03:25.200: Beginn Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E043 bei 00:03:26.140: Beginn Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:03:34.840 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 14 · 00:03:34.840–00:03:45.660

**Aktion:** Eine gezielte neue Abfrage klärt die aktuelle Antwort; die Akte wird geschlossen.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** It's always DNS, / Not the switch. Weitere Zeilen: Not the mess. / It's always DNS,

**Struktur-Cues:** E052 bei 00:03:34.840: Beginn Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E053 bei 00:03:37.760: Beginn Reprise – Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E054 bei 00:03:39.660: Beginn Reprise – Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:03:45.660 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 15 · 00:03:45.660–00:03:59.260

**Aktion:** Ein veralteter Cache steht einem aktuellen Resolver gegenüber; die TTL-Sanduhr läuft.

**Kamera:** Kurze Nahaufnahme, danach Öffnung zur Übersicht. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** why do we always guess? / Cache is old, TTL too high, 

**Struktur-Cues:** E056 bei 00:03:45.660: Beginn Chorus; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E057 bei 00:03:46.820: Beginn Instrumental; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E058 bei 00:03:47.600: Geglätteter RMS-Verlauf ändert sich über 1 s um +13.9 dB. Abfragekette und Suchlicht räumlich öffnen.

**Einzelimpuls:** E060 bei 00:03:53.521 als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.

**Übergang:** Bei 00:03:59.260 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 16 · 00:03:59.260–00:04:10.620

**Aktion:** Die lange musikalische Reprise dreht den Fall noch einmal aus Nutzersicht; keine erfundenen Textzeilen einblenden.

**Kamera:** Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** split brain zones make admins cry. / Forward lookup, reverse pain, Weitere Zeilen: CNAME dancing in the rain.

**Struktur-Cues:** E062 bei 00:03:59.260: Beginn Verse 2; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E063 bei 00:04:03.040: Beginn Verse 2; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E064 bei 00:04:07.140: Beginn Verse 2; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:04:10.620 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

### Szene 17 · 00:04:10.620–00:04:21.200

**Aktion:** Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte.

**Kamera:** Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont. Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.

**Textbezug:** Flush it. / Query it. Weitere Zeilen: Dig it. / Fix it. / Dig it up.

**Struktur-Cues:** E067 bei 00:04:10.620: Beginn Bridge; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E068 bei 00:04:11.380: Beginn Bridge; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen; E069 bei 00:04:18.200: Beginn Hook; Abschnittsgrenze aus Transkript. Neues Kapitel oder Kameraposition einführen.

**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.

**Übergang:** Bei 00:04:21.200 in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.

## Instrumentale Passagen und tatsächliches Ende

Die letzte übernommene Gesangszeile endet bei 00:04:20.840. Der Tonträger läuft bis 00:04:21.200. Zwischen Gesangsabschnitten und danach bleiben die Bildhandlungen der jeweiligen Szenen aktiv; keine pauschale Schlussblende am letzten Wort.

Späte Mess-Cues: E074 00:04:21.200 end. Schlussbild erst bei einem nachgewiesenen Endabfall auflösen; sonst bis kurz vor das Audioende aktiv halten.

## Assets und wiederverwendbare Module

Fallakte, DNS-Fragezettel, Resolver-Schreibtische, Cache-Regal, TTL-Sanduhr, Zonen-Spiegel, Antwortumschläge.

Wiederverwendbare Code-Module: Szenenkamera mit vorgegebenem Pfad, Audio-Kurven-Interpolator, Event-Trigger, Text-/Status-Overlay, deterministisches Partikelfeld und Abschlussblende. Die Geometrie, Farben und Metaphern bleiben trackspezifisch.

## Technische Leitplanken

DNS-Namensauflösung und IP-Erreichbarkeit getrennt darstellen. TTL beschreibt Cache-Lebensdauer. NXDOMAIN bedeutet, dass der abgefragte Name nicht existiert; ein Timeout ist ein anderer Befund. Cache-Flush ist nicht automatisch die dauerhafte Fehlerbehebung.

Lyrics sind gestalterische Quelle, keine automatische fachliche Wahrheit. Textzitate nur aus den im Analyse-JSON enthaltenen `lyrics.segments` verwenden; dort ausgeschlossene Quellsegmente nicht ins Bild übernehmen. Messwerte nicht als sichtbare Netzwerk-Telemetrie ausgeben.

## Deterministisches Rendering

Videozeit `t = frame_index / fps`, empfohlen 30 fps bei konstantem Raster. Audio bleibt unverändert und beginnt bei t=0. Für jeden Frame 100-ms-Steuerwerte linear interpolieren; schnelle Impulse aus `events` oder `onsets` nur einmal bei `round(time_s*fps)` auslösen. Zufall ausschliesslich aus festem Track-Seed und stabilen Objekt-IDs ableiten. Bewegungszustände aus absoluter Zeit berechnen, damit Reihenfolge und Parallelisierung identische Frames ergeben. Bei der finalen Audioeinbettung das Original-WAV und seine volle Dauer behalten.

## Abnahme

- Szene 1 beginnt bei 00:00:00.000; die letzte Szene endet exakt bei 00:04:21.200.
- Alle Tabellen-Event-IDs existieren im Analyse-JSON und ihre Zeiten liegen innerhalb der Szene.
- Gesungene Zitate stammen aus den zugeordneten Transkriptsegmenten; überlappende oder als Abschnittsname markierte Segmente erscheinen nicht.
- Grosse Wechsel folgen anhaltenden Energie- oder Abschnitts-Cues; einzelne Onsets steuern nur einzelne Aktionen.
- Die technische Darstellung folgt den obigen Leitplanken, ohne Firmenwerbung oder Logos.
- Das instrumentale Ende bleibt bis zur gemessenen Schlussentwicklung gestaltet.
