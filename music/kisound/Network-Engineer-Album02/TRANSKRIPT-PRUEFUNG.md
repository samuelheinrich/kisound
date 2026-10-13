# Album02 – automatische Transkriptprüfung

Stand: 2026-10-04. Alle Zeitmarken beziehen sich auf den Beginn der unveränderten aktuellen Aufnahme. Die sieben neuen Transkripte verwenden zwei lokale Whisper-Modelle und bei schwierigen Stellen zusätzliche kurze, sprachbandgefilterte Ausschnitte. **Keine manuelle Hörprüfung.**

Die Audioerkennung liefert Zeitmarken und die Zuordnung der vorhandenen Zeilen. Der beibehaltene Lyric-Prompt liefert ihre Schreibweise, insbesondere für technische Begriffe. Ein zugeordneter Prompt-Text ist keine unabhängige Bestätigung jedes gesungenen Wortes. Nicht zugeordnete Zeilen erhalten keine geschätzten Zeiten. Kurze Wiederholungen können aus den ASR-Ausgaben ergänzt werden. Instrumentalstrecken erhalten keine Untertitel.

JSON, SRT und TXT werden aus derselben Cue-Liste geschrieben. Die neuen JSON-Dateien enthalten `review_required` pro Zeile; Hinweise unten sind vor wortgenauer Verwendung im Video zu hören. Die Tabelle führt den automatischen Erstabgleich auf, danach folgen die redaktionellen Zuordnungen aus dem Modellvergleich.

Werkzeug: [MLX Whisper](https://github.com/ml-explore/mlx-examples/tree/main/whisper), Version 0.4.3; Modelle `mlx-community/whisper-large-v3-mlx` und `mlx-community/whisper-large-v3-turbo`. Sprachvorgabe `de`, Wortzeitmarken, Temperatur 0, kein Kontextfortschreiben zwischen Audiofenstern, kurze Fachwortlisten als Erkennungshilfe. Bei Ausschnitten: Highpass 220 Hz, Lowpass 5000 Hz, Mono 16 kHz; Ausschnittzeiten werden um den Originaldatei-Offset ergänzt. Die Quellaudios wurden nicht verändert.

## Übersicht

| # | Track | Audio-Dauer | Cues | Zeilen mit Prüfmarkierung |
|---|---|---|---|---|
| 01 | [On Call](01_On_Call/01_On_Call_Transkript.txt) | 00:03:36.774 | 52 | 8 |
| 02 | [Active / Standby](02_Active_Standby/02_Active_Standby_Transkript.txt) | 00:03:23.174 | 44 | 11 |
| 03 | TrustSec | 00:04:48.000 | 89 | bestehendes Transkript unverändert |
| 04 | [Broadcast Storm](04_Broadcast_Storm/04_Broadcast_Storm_Transkript.txt) | 00:03:28.814 | 45 | 11 |
| 05 | [Wireshark](05_Wireshark/05_Wireshark_Transkript.txt) | 00:03:15.734 | 52 | 15 |
| 06 | [ICMP](06_ICMP/06_ICMP_Transkript.txt) | 00:03:36.774 | 75 | 7 |
| 07 | [QoS](07_QoS/07_QoS_Transkript.txt) | 00:03:59.054 | 44 | 5 |
| 08 | [Out of Band](08_Out_of_Band/08_Out_of_Band_Transkript.txt) | 00:04:24.414 | 52 | 9 |

## Bestehendes TrustSec-Transkript

Die vorhandenen drei Transkriptdateien von TrustSec wurden bytegenau erhalten. Ihre Quelle ist die MP3 `03_TrustSec_0.1.mp3`; der gespeicherte SHA-256 und die Dauer passen zur aktuellen Datei. Ihre bisherige Erstellungs- und Prüfqualität wurde in diesem Auftrag nicht erneut bewertet.

## 01 On Call

Audio: `01_On_Call_1.0.wav` · SHA-256 `6d10bbfdf8af4a390e4e12e9775a93b1bea7f2838d68f7bd75046ca0a290bcd1`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| Display wird hell. | Display wird hell, · 00:00:16.580–00:00:18.320 | Display wird hell, · 00:00:16.580–00:00:18.520 | automatisch zugeordnet |
| Die Stadt schläft weiter. | die Stadt schläft weiter, · 00:00:18.540–00:00:22.400 | die Stadt schläft weiter, · 00:00:18.660–00:00:22.620 | automatisch zugeordnet |
| Ein Name auf dem Screen. | ein Name auf dem Screen. · 00:00:22.620–00:00:25.580 | ein Name auf dem Screen. · 00:00:23.040–00:00:25.780 | automatisch zugeordnet |
| Ich bin erreichbar. | Ich bin erreichbar · 00:00:28.140–00:00:30.020 | Ich bin erreichbar · 00:00:27.980–00:00:30.220 | automatisch zugeordnet |
| Das Telefon tanzt auf dem Holz, | Das Telefon tanzt auf dem Holz · 00:00:44.560–00:00:47.160 | Das Telefon tanzt auf dem Holz · 00:00:44.560–00:00:47.380 | automatisch zugeordnet |
| der Kaffee von gestern ist kalt. | Der Kaffee von gestern ist kalt · 00:00:48.560–00:00:51.000 | Der Kaffee von gestern ist kalt · 00:00:48.320–00:00:51.120 | automatisch zugeordnet |
| Im Ticket steht: «Alles ist weg», | Mein Ticket steht, alles ist weg · 00:00:52.280–00:00:54.640 | Mit Tickets steht alles weg · 00:00:52.100–00:00:54.680 | automatisch zugeordnet |
| kein Standort, kein Fehler, kein Halt. | Kein Standort, kein Fehler, kein Halt · 00:00:55.580–00:00:58.700 | Standort, kein Fehler, kein Hall · 00:00:55.780–00:00:58.700 | automatisch zugeordnet |
| Ich frag: Seit wann? Ich frag: Für wen? | Ich frag seit wann, ich frag für wen · 00:00:58.700–00:01:02.680 | Ich frag seit wann, ich frag für wen · 00:00:58.700–00:01:02.760 | automatisch zugeordnet |
| Ein Screenshot ersetzt keinen Test. | Ein Screenshot ersetzt kein Test · 00:01:02.680–00:01:06.160 | Ein Screenshot ersetzt, kein Test · 00:01:02.760–00:01:06.400 | automatisch zugeordnet |
| Drei Dienste rot, ein vierter grün, | Drei Dienste rot, ein Vierter grün · 00:01:06.160–00:01:09.200 | Dreidienst, Rot, ein Viertel, Grün · 00:01:07.220–00:01:09.260 | automatisch zugeordnet |
| ich suche den Punkt, der sie verbindet. | Ich suche den Punkt, der sich verbindet · 00:01:09.200–00:01:12.420 | Ich suche den Punkt, der sich verbindet · 00:01:09.260–00:01:12.500 | automatisch zugeordnet |
| Nicht lauter werden. | Nicht lauter werden, · 00:01:15.400–00:01:17.760 | Nicht lauter werden, · 00:01:15.620–00:01:18.380 | automatisch zugeordnet |
| Genauer fragen. | genauer fragen · 00:01:18.420–00:01:21.420 | genauer fragen · 00:01:19.980–00:01:22.120 | ja |
| Bevor ich etwas ändere, | Bevor ich etwas ändere, · 00:01:21.420–00:01:24.660 | Bevor ich etwas ändere, · 00:01:22.120–00:01:24.840 | automatisch zugeordnet |
| will ich den Fehler sehen. | will ich den Fehler sehen · 00:01:24.780–00:01:27.860 | will ich den Fehler sehen · 00:01:25.060–00:01:28.240 | automatisch zugeordnet |
| On Call. | On call, · 00:01:29.320–00:01:30.860 | On call, · 00:01:29.480–00:01:31.100 | automatisch zugeordnet |
| Display wird hell. | Display wird hell · 00:01:31.160–00:01:34.500 | Display wird hell · 00:01:33.500–00:01:34.680 | ja |
| Die Stadt schläft weiter, | Die Stadt schläft weiter, · 00:01:35.920–00:01:38.760 | Die Stadt schläft weiter, · 00:01:36.120–00:01:38.980 | automatisch zugeordnet |
| ich folg dem Signal. | ich folg dem Signal · 00:01:39.180–00:01:41.780 | ich folg dem Signal · 00:01:40.920–00:01:42.060 | ja |
| On Call. | On call, · 00:01:41.780–00:01:45.920 | On call, · 00:01:44.480–00:01:46.220 | ja |
| Noch keine Antwort. | noch keine Antwort · 00:01:46.320–00:01:49.820 | noch keine Antwort · 00:01:48.180–00:01:49.960 | ja |
| Doch ich bleib dran, | Doch ich bleib dran, · 00:01:51.920–00:01:53.480 | Doch ich bleib dran, · 00:01:52.120–00:01:53.760 | automatisch zugeordnet |
| bis ich die Ursache hab. | bis ich die Ursache hab · 00:01:53.740–00:01:56.980 | bis ich die Ursache -ha · 00:01:53.800–00:02:00.400 | ja |
| Die Route steht, der Link ist da, | Die Route steht, der Link ist da, · 00:02:00.120–00:02:02.260 | Die Route steht, der Link ist da, · 00:02:00.400–00:02:02.360 | automatisch zugeordnet |
| der erste Test geht sauber durch. | der erste Test geht sauber durch · 00:02:02.380–00:02:04.140 | der erste Test geht sauber durch · 00:02:02.540–00:02:04.240 | automatisch zugeordnet |
| Am nächsten Hop verstummt der Flow, | Am nächsten Hauptverstummt der Flow, · 00:02:04.140–00:02:06.120 | Am nächsten Hauptverstummter Flow, · 00:02:04.240–00:02:06.180 | automatisch zugeordnet |
| ich zieh die Spur durch jeden Sprung. | ich zieh die Spur durch jeden Sprung · 00:02:06.200–00:02:08.000 | ich zieh die Spur durch jeden Sprung · 00:02:06.200–00:02:08.080 | automatisch zugeordnet |
| Ein Change von heute, frisch im Log, | Ein Change von heute, frisch im Lauf, · 00:02:08.000–00:02:09.800 | Ein Change von heute, frisch im Lauf, · 00:02:08.080–00:02:09.880 | automatisch zugeordnet |
| ein Counter steigt am falschen Port. | ein Counter steigt am falschen Port · 00:02:09.940–00:02:11.700 | ein Counter steigt am falschen Port · 00:02:09.980–00:02:11.780 | automatisch zugeordnet |
| Kein Neustart auf Verdacht, | Kein Neustart, auch Verdacht, · 00:02:11.700–00:02:13.180 | Kein Neustart auf Verdacht, · 00:02:11.780–00:02:13.200 | automatisch zugeordnet |
| ich grenze ein und prüfe dort. | ich grenze ein und prüfe dort · 00:02:13.220–00:02:15.000 | ich grenze ein und prüfe dort · 00:02:13.300–00:02:15.140 | automatisch zugeordnet |
| Da ist der Unterschied. | Da ist der Unterschied, · 00:02:15.680–00:02:17.260 | Da ist der Unterschied, · 00:02:15.740–00:02:17.480 | automatisch zugeordnet |
| Da fängt die Spur an. | da fängt die Spur an · 00:02:17.640–00:02:19.400 | da fängt die Spur · 00:02:17.980–00:02:19.100 | automatisch zugeordnet |
| Ein Test bestätigt, | Mein Test bestätigt, · 00:02:19.400–00:02:20.900 | Mein Test bestätigt, · 00:02:19.100–00:02:21.000 | automatisch zugeordnet |
| was das Ticket nicht sagen kann. | was das Ticket nicht sagen kann · 00:02:20.900–00:02:23.020 | was das Ticket nicht sagen kann · 00:02:21.080–00:02:23.260 | automatisch zugeordnet |
| Die Hand liegt auf der Taste. | Die Hand liegt auf der Tast, · 00:02:23.020–00:02:25.160 | Die Art liegt auf der Tast, · 00:02:23.260–00:02:25.160 | automatisch zugeordnet |
| Der nächste Schritt steht fest. | der nächste Schritt steht fest · 00:02:25.220–00:02:26.820 | der Lichter schritt, steht fest · 00:02:25.500–00:02:27.000 | automatisch zugeordnet |
| Erst verstehen, dann verändern. | Erst verstehen, dann verändern, · 00:02:26.820–00:02:28.760 | Erst verstehen, dann verbinden, · 00:02:27.000–00:02:28.840 | automatisch zugeordnet |
| Dann derselbe Test. | dann derselbe Test · 00:02:28.780–00:02:30.140 | dann derselbe Test · 00:02:29.020–00:02:30.340 | automatisch zugeordnet |
| On Call. | On call · 00:02:33.520–00:02:34.700 | On call · 00:02:33.660–00:02:34.940 | automatisch zugeordnet |
| Display wird hell. | Display wird hell · 00:02:36.800–00:02:38.340 | Display wird hell · 00:02:36.880–00:02:38.460 | automatisch zugeordnet |
| Die Stadt schläft weiter, | Die Stadt schläft weiter · 00:02:40.200–00:02:42.560 | Die Stadt schläft weiter · 00:02:40.320–00:02:42.820 | automatisch zugeordnet |
| ich folg dem Signal. | Ich folg dem Signal · 00:02:43.980–00:02:45.580 | Ich folg dem Signal · 00:02:44.060–00:02:45.840 | automatisch zugeordnet |
| On Call. | Uncool, Uncool, · 00:02:49.880–00:02:50.840 | Unkopf, Unkopf, · 00:02:49.120–00:02:50.080 | automatisch zugeordnet |
| Jetzt hat der Fehler einen Namen. | jetzt hat er wieder einen Namen · 00:02:50.840–00:02:53.600 | jetzt hat der Fehler einen Namen · 00:02:51.660–00:02:53.740 | automatisch zugeordnet |
| Ich halte die Spur, | Ich halte die Spur, · 00:02:55.020–00:02:57.440 | Ich halte die Spur, · 00:02:55.140–00:02:57.440 | automatisch zugeordnet |
| bis der Service wieder läuft. | bis der Service wieder läuft · 00:02:57.460–00:03:01.160 | bis der Service wieder läuft · 00:02:57.740–00:03:01.300 | automatisch zugeordnet |
| Kein Applaus im leeren Zimmer. | Kein Applaus im leeren Zimmer · 00:03:04.280–00:03:07.460 | Kein Applaus im leeren Zimmer, · 00:03:04.380–00:03:07.700 | automatisch zugeordnet |
| Nur ein Ticket, das sich schliesst. | Nur ein Ticket, das sich schließt · 00:03:07.460–00:03:11.520 | nur ein Ticket, das ich schließ · 00:03:08.160–00:03:11.420 | automatisch zugeordnet |
| Die Stadt weiss nichts davon. | Distabler Weiß nichts davon · 00:03:15.840–00:03:19.040 | weiß nichts davon · 00:03:16.640–00:03:19.260 | ja |

### Ergänzungen und korrigierte Zuordnungen

- 00:03:12.560–00:03:14.160 · **Display wird dunkel.**: Large-v3 erkennt «Das Blatt ist dunkel», Turbo und Ausschnitt «Das bleibt dunkel». Zeit aus den Large-v3-Wörtern; Schreibweise aus dem Prompt. Wortlaut bleibt zur Hörprüfung offen.

## 02 Active / Standby

Audio: `02_Active_Standby_1.0.wav` · SHA-256 `42750eb28bf676ef697bc26cddb9c28ec62390336e462783111b69db2446c86c`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| Ich trag den Traffic. | Ich trag den Traffic. · 00:00:12.400–00:00:13.960 | Ich trag den Traffic. · 00:00:12.380–00:00:14.040 | automatisch zugeordnet |
| Ich hör deinen Puls. | Ich hör deinen Puls. · 00:00:23.720–00:00:25.580 | Ich hör deinen Puls. · 00:00:23.820–00:00:25.680 | automatisch zugeordnet |
| Die Sessions laufen, unser Sync steht. | Die Sessions laufen, unser Sync steht · 00:00:39.140–00:00:41.920 | Die Sessions laufen, unser Sync steht · 00:00:39.200–00:00:42.060 | automatisch zugeordnet |
| Ein Heartbeat sagt dir: Ich bin hier. | Ein Habit sagt dir, ich bin hier · 00:00:42.740–00:00:45.120 | Ein Heartbeat sagt dir, ich bin hier · 00:00:42.840–00:00:45.280 | automatisch zugeordnet |
| Ich halte unsern Datenpfad, | Ich halte unseren Datenpfad · 00:00:46.400–00:00:48.720 | Ich halte unseren Daten · 00:00:46.420–00:00:48.400 | automatisch zugeordnet |
| du hältst den Stand von mir. | Du hältst den Stand von mir · 00:00:49.540–00:00:52.240 | Du hältst den Stand von mir · 00:00:48.880–00:00:52.420 | automatisch zugeordnet |
| Die Flows sind auch bei mir bekannt. | Die Flows sind auch bei mir bekannt · 00:00:53.480–00:00:55.780 | Die Flows sind auch bei mir bekannt · 00:00:53.520–00:00:55.980 | automatisch zugeordnet |
| Dein Heartbeat hält uns im Kontakt. | Dein Habit hält uns in Kontakt · 00:00:57.180–00:00:59.340 | Dein Heartbeat hält uns im Kontakt · 00:00:57.240–00:00:59.460 | automatisch zugeordnet |
| Ich bleibe wach und hör dich an. | Ich bleibe wach und hör dich an · 00:01:00.480–00:01:03.120 | Ich bleibe wach und hör dich an · 00:01:00.600–00:01:03.340 | automatisch zugeordnet |
| Bereit, wenn ich übernehmen kann. | Bereit, wenn ich übernehmen kann · 00:01:04.100–00:01:06.800 | Bereit, wenn ich übernehmen kann · 00:01:04.220–00:01:07.280 | automatisch zugeordnet |
| Active. | Active · 00:01:07.420–00:01:08.480 | Active · 00:01:07.280–00:01:08.620 | automatisch zugeordnet |
| Standby. | Stand by · 00:01:10.440–00:01:11.940 | Stand by · 00:01:10.720–00:01:12.180 | automatisch zugeordnet |
| Einer trägt, | Einer trägt · 00:01:14.240–00:01:15.880 | Einer trägt · 00:01:14.440–00:01:15.900 | automatisch zugeordnet |
| einer steht bereit. | Einer steht bereit · 00:01:17.520–00:01:19.100 | Einer steht bereit · 00:01:17.660–00:01:19.300 | automatisch zugeordnet |
| Dein Heartbeat sagt: | Dein Habi sagt, · 00:01:19.100–00:01:20.820 | Dein geht, sag · 00:01:19.300–00:01:21.160 | ja |
| Ich bin noch hier. | ich bin noch hier · 00:01:21.220–00:01:22.340 | ich bin noch hier · 00:01:21.160–00:01:22.540 | automatisch zugeordnet |
| Dein Heartbeat fehlt, der Link ist weg. | Dein Heartbeat fehlt, der Link ist weg, · 00:01:29.100–00:01:31.220 | Dein Heartbeat fehlt, der Link ist weg, · 00:01:29.220–00:01:31.260 | automatisch zugeordnet |
| Der letzte Check läuft aus. | der letzte Check läuft aus · 00:01:31.260–00:01:32.620 | der letzte Check läuft aus · 00:01:31.300–00:01:32.680 | automatisch zugeordnet |
| Ich schalte um, ich bin jetzt Active. | Ich schalte um, ich bin jetzt active, · 00:01:32.620–00:01:34.480 | Ich schalte um, ich bin jetzt active, · 00:01:32.680–00:01:34.580 | automatisch zugeordnet |
| Doch du sendest weiter raus. | doch du sendest weiter raus · 00:01:34.580–00:01:36.140 | doch du sendest weiter raus · 00:01:34.740–00:01:36.220 | automatisch zugeordnet |
| Mein Datenpfad ist immer offen. | Mein Datenfahrt, ist immer offen, · 00:01:36.140–00:01:38.940 | Mein Datenfahrt ist immer offen, · 00:01:36.220–00:01:39.080 | automatisch zugeordnet |
| Ich bin noch da. Ich bin Active. | ich bin noch da ich bin active, · 00:01:39.660–00:01:43.460 | ich bin noch da Ich bin active, · 00:01:39.820–00:01:42.700 | automatisch zugeordnet |
| Split Brain. | ich bin · 00:01:43.620–00:01:44.060 | ich bin · 00:01:42.720–00:01:44.260 | ja |
| Beide Active. | Beide active, · 00:01:45.940–00:01:47.020 | Beide active, · 00:01:46.120–00:01:47.160 | automatisch zugeordnet |
| Eine Adresse. | eine Adresse, · 00:01:47.340–00:01:48.800 | eine Adresse, · 00:01:48.000–00:01:48.840 | automatisch zugeordnet |
| Kein gemeinsamer Takt. | kein gemeinsamer Takt · 00:01:48.820–00:01:50.580 | kein gemeinsamer · 00:01:49.000–00:01:50.240 | automatisch zugeordnet |
| Mein Datenpfad wird isoliert. | wird isoliert · 00:01:52.340–00:01:53.260 | Isoliert · 00:01:52.580–00:01:53.380 | ja |
| Ich gebe meine Führung ab. | Ich gebe meine Führung ab · 00:01:53.260–00:01:56.820 | Ich gebe meine Führung ab · 00:01:54.420–00:01:56.920 | automatisch zugeordnet |
| Der Link steht wieder zwischen uns. | Der Link steht wieder zwischen uns · 00:01:57.900–00:02:00.440 | Der Link steht wieder zwischen uns · 00:01:58.000–00:02:00.620 | automatisch zugeordnet |
| Wir prüfen unsre Rollen neu. | Wir prüfen unsere Rolle neu · 00:02:00.440–00:02:03.480 | Wir prüfen unsere Rolle neu · 00:02:00.620–00:02:03.680 | automatisch zugeordnet |
| Dein Puls ist wieder da, der Sync steht. | Dein Puls ist wieder da, der Sync steht · 00:02:05.580–00:02:08.820 | Dein Puls ist wieder da, der Sync steht · 00:02:05.620–00:02:09.020 | automatisch zugeordnet |
| Ein Pfad trägt unsern Traffic jetzt. | Ein Fahrt trägt unseren Traffic jetzt · 00:02:08.820–00:02:12.040 | Ein Fahrt trägt unseren Traffic jetzt · 00:02:09.020–00:02:12.260 | automatisch zugeordnet |
| Du hältst als Standby unsern Stand. | Du hältst als bei unserem Stahn · 00:02:12.040–00:02:15.140 | Du hältst als Stand bei unserem Stahn · 00:02:12.260–00:02:15.300 | automatisch zugeordnet |
| Ich führe, während du mich hörst. | Ich führe während du mich hörst · 00:02:15.140–00:02:19.780 | Ich führe, während du mich hörst · 00:02:16.340–00:02:19.880 | automatisch zugeordnet |
| Active. | aktiv · 00:02:19.860–00:02:20.180 | kein Wortabgleich | ja |
| Ich trag den Traffic. | Ich trag den Traffic · 00:02:22.420–00:02:23.760 | Ich trag den Traffic · 00:02:22.540–00:02:23.860 | automatisch zugeordnet |
| Standby. | Stand by · 00:02:26.660–00:02:27.340 | Standby · 00:02:26.680–00:02:27.560 | automatisch zugeordnet |
| Ich halte mich bereit. | Ich halte mich bereit · 00:02:27.340–00:02:30.720 | Ich halte mich bereit · 00:02:29.280–00:02:31.000 | ja |
| Active. | Aktiv · 00:02:41.400–00:02:41.860 | Aktiv · 00:02:41.120–00:02:42.000 | automatisch zugeordnet |
| Standby. | Stand by · 00:02:43.640–00:02:45.360 | Standby · 00:02:44.500–00:02:45.380 | automatisch zugeordnet |
| Ein klarer Pfad. | Ein Klavier · 00:02:47.060–00:02:48.380 | Ein Klavier · 00:02:45.380–00:02:48.440 | ja |
| Dein Puls ist wieder da. | Dein Puls ist wieder · 00:02:50.300–00:02:51.920 | Ein Poßes wieder · 00:02:48.440–00:02:52.060 | ja |

### Ergänzungen und korrigierte Zuordnungen

- 00:01:39.660–00:01:42.560 · **Ich bin noch da. Ich bin Active.**: Ende auf das erste vollständige «Ich bin Active» begrenzt. Folgende Laute werden von den vollständigen Läufen als Wiederholung, im Ausschnitt als Split Brain erkannt.
- 00:01:42.740–00:01:44.860 · **Split Brain.**: Ausschnitt erkennt Split Brain mit sehr niedriger Wortwahrscheinlichkeit; beide vollständigen Läufe erkennen hier «ich bin Active». Zeit und Prompt-Schreibweise sind vorläufig und müssen gehört werden.
- 00:01:51.380–00:01:53.360 · **Mein Datenpfad wird isoliert.**: Der gefilterte Ausschnitt erkennt die ganze Zeile; vollständige Läufe erkennen nur «wird isoliert» beziehungsweise «isoliert». Ausschnitt-Wortzeiten mit Originaloffset.
- 00:02:19.860–00:02:20.180 · **Active.**: Nur Large-v3 erkennt hier «Du bist aktiv», mit kurzen/teilweise kollabierten Wortzeiten. Im Transkript bleibt das Prompt-Stichwort Active; Beginn und Ende müssen gehört werden.
- 00:03:09.660–00:03:10.540 · **Active.**: Beide vollständigen Modelle erkennen diese zusätzliche Wiederholung nach dem vorgesehenen letzten Refrain.
- 00:03:12.400–00:03:13.680 · **Standby.**: Beide vollständigen Modelle erkennen diese zusätzliche Wiederholung; Start und Ende umfassen die getrennt erkannten Wörter Stand/by.

## 04 Broadcast Storm

Audio: `04_Broadcast_Storm_1.0.wav` · SHA-256 `00a640de0f76551e27719ad0c4c0f106133fd26c4d33f4f7e3d5b71cbadec352`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| Ein Kabel. | Ein Kabel · 00:00:09.660–00:00:10.440 | Ein Kabel. · 00:00:08.840–00:00:10.480 | automatisch zugeordnet |
| Falscher Port. | Falscher Port · 00:00:15.580–00:00:16.740 | Falscher Port. · 00:00:15.620–00:00:16.940 | automatisch zugeordnet |
| Mehr braucht es nicht. | Mehr braucht es nicht · 00:00:20.800–00:00:22.300 | Mehr braucht es nicht. · 00:00:20.460–00:00:22.400 | automatisch zugeordnet |
| Frame geht raus und kommt zurück, | Frame geht raus und kommt zurück · 00:00:43.960–00:00:46.340 | Frame geht raus und kommt zurück · 00:00:44.060–00:00:46.480 | automatisch zugeordnet |
| derselbe Frame, wo ist das Ende. | Derselbe Frame, wo ist das Ende? · 00:00:46.340–00:00:49.320 | Derselbe Frame, wo ist das Ende? · 00:00:46.480–00:00:49.460 | automatisch zugeordnet |
| Kein Time to Live hier unten drin, | Kein Time to live hier unten drin · 00:00:49.880–00:00:51.880 | Kein Time to live hier unten drin · 00:00:50.040–00:00:51.960 | automatisch zugeordnet |
| nichts sagt ihm, wohin er soll. | Ich sag ihm, wohin er soll · 00:00:51.880–00:00:54.560 | Ich sag ihm, wohin er soll · 00:00:51.960–00:00:54.660 | automatisch zugeordnet |
| Flooding raus auf jeden Port, | Flirting raus auf jedem Port · 00:00:54.560–00:00:56.760 | den Haus auf jedem Port · 00:00:55.380–00:00:56.920 | automatisch zugeordnet |
| Kopien wachsen, keiner stoppt. | Kopien wachsen, keiner stoppt · 00:00:56.760–00:00:59.640 | Kopien wachsen, keiner stoppt · 00:00:56.920–00:00:59.740 | automatisch zugeordnet |
| Der Switch schreit, C-P-U rot, | Der Switch schreit CPU -Rohr · 00:01:00.140–00:01:02.300 | Der Switch schreibt CPU -Rohr, · 00:01:00.000–00:01:02.800 | automatisch zugeordnet |
| die Control Plane ist längst tot. | Die Control -Plane ist längst tot · 00:01:02.300–00:01:05.440 | die Control -Plane ist längst top · 00:01:03.460–00:01:05.540 | automatisch zugeordnet |
| Alle Lampen leuchten grün. | Alle Lampen leuchten grün · 00:01:06.520–00:01:09.120 | Alle Lampen leuchten grün, · 00:01:05.540–00:01:09.240 | automatisch zugeordnet |
| Das ist kein gutes Zeichen. | Das ist kein gutes Zeichen · 00:01:09.660–00:01:12.260 | das ist kein gutes Zeichen · 00:01:09.900–00:01:12.300 | automatisch zugeordnet |
| Hier kommt gar nichts mehr durch. | Hier kommt gar nichts mehr durch · 00:01:16.020–00:01:20.020 | Hier kommt gar nichts mehr durch, · 00:01:16.420–00:01:20.220 | automatisch zugeordnet |
| Hier steht alles auf dem Spiel. | Hier steht alles auf dem Spiel · 00:01:20.020–00:01:23.100 | hier steht alles auf dem Spiel · 00:01:20.400–00:01:23.360 | automatisch zugeordnet |
| Broadcast Storm. | Broadcast Storm · 00:01:26.520–00:01:28.080 | Broadcast Storm · 00:01:26.800–00:01:28.200 | automatisch zugeordnet |
| Kein Root, kein Pfad. | Kein Rot, kein Far · 00:01:28.080–00:01:30.940 | kein Fahd · 00:01:30.000–00:01:31.400 | ja |
| Broadcast Storm. | Broadcast Storm · 00:01:32.000–00:01:33.640 | Podcast Storm · 00:01:32.000–00:01:33.840 | automatisch zugeordnet |
| Spür den Schaden. | Spür den Schaden · 00:01:33.640–00:01:36.140 | Spür den Schaden · 00:01:33.840–00:01:36.180 | automatisch zugeordnet |
| Es flutet, | Flute, · 00:01:38.280–00:01:39.560 | Flute · 00:01:38.020–00:01:39.400 | ja |
| verdoppelt, | verdoppelt, · 00:01:39.560–00:01:40.840 | Verdoppelt · 00:01:40.000–00:01:40.860 | automatisch zugeordnet |
| ertränkt den Draht, | ertränkt den Draht · 00:01:40.840–00:01:42.160 | ertränkt den Draht · 00:01:40.860–00:01:42.410 | automatisch zugeordnet |
| ein Loop, der sich | Ein Lob, der sich · 00:01:42.920–00:01:46.500 | Ein Lob Der sich · 00:01:43.850–00:01:46.600 | automatisch zugeordnet |
| selber frisst. | selber frisst · 00:01:46.500–00:01:47.620 | selber frisst · 00:01:46.600–00:01:47.620 | automatisch zugeordnet |
| Zieh das Kabel. | Zieh das Kabel · 00:02:10.060–00:02:11.740 | Zieh das Kabel · 00:02:10.140–00:02:11.860 | automatisch zugeordnet |
| Management weg, kein Login mehr, | Management will kein Login mehr · 00:02:22.140–00:02:24.980 | Management weg, kein Login mehr · 00:02:22.480–00:02:25.120 | automatisch zugeordnet |
| der Console Port ist unser Weg. | Der Console -Report ist unser Weg · 00:02:24.980–00:02:27.740 | Der Konsole -Port ist unser Weg · 00:02:25.120–00:02:27.920 | automatisch zugeordnet |
| Blocking State, der niemals kam, | der niemals kam, · 00:02:29.460–00:02:30.480 | Blocking State, der niemals kam · 00:02:27.920–00:02:30.660 | ja |
| eine Bridge ohne Root, ohne Namen. | eine Bridge ohne Route, ohne Namen · 00:02:30.680–00:02:32.840 | Eine Bridge ohne Route, ohne Namen · 00:02:30.660–00:02:32.940 | automatisch zugeordnet |
| Konsolenkabel, Taschenlampe, | Konsolenkabel, Taschenlampe · 00:02:33.840–00:02:35.120 | Konsolen, Taschenlampe · 00:02:32.940–00:02:35.220 | automatisch zugeordnet |
| durch die Reihen im Serverraum. | durch die Reihen im Serverraum · 00:02:35.120–00:02:37.880 | durch die Reihen im Serverraum · 00:02:35.220–00:02:38.060 | automatisch zugeordnet |
| Finde den Link, der den Ring schliesst, | Finden den, der den Ring schließt · 00:02:38.920–00:02:41.280 | Finde einen Ding, der den Ring schließt · 00:02:38.880–00:02:41.380 | automatisch zugeordnet |
| ein Port down und Stille kommt. | Ein paar Daumen und stille Kommen · 00:02:41.280–00:02:44.180 | Ein Port -Down und Stille kommt · 00:02:41.380–00:02:44.180 | automatisch zugeordnet |
| Broadcast Storm. | Broadcast Storm · 00:02:46.560–00:02:47.600 | Broadcast Storm · 00:02:46.580–00:02:47.880 | automatisch zugeordnet |
| Kein Root, kein Pfad. | Kein Rute, kein Pfad · 00:02:48.960–00:02:50.780 | Kein Rout, kein Fart · 00:02:48.920–00:02:50.800 | automatisch zugeordnet |
| Broadcast Storm. | Broadcast Storm · 00:02:51.960–00:02:53.120 | Broadcast Storm · 00:02:52.020–00:02:53.340 | automatisch zugeordnet |
| Spür den Schaden. | Spür den Schaden · 00:02:54.340–00:02:55.620 | Schaden, · 00:02:56.360–00:02:57.220 | ja |
| die Flut zieht ab, | Die Flut zieht ab, · 00:02:59.760–00:03:01.520 | die Flut zählt ab, · 00:02:59.440–00:03:01.740 | automatisch zugeordnet |
| das Netz lernt, | das Netz leert, · 00:03:01.700–00:03:04.480 | das Netz leer, · 00:03:03.520–00:03:04.360 | ja |
| was Stille heisst. | was Stille heißt. · 00:03:04.500–00:03:06.720 | was stiller heißt. · 00:03:05.420–00:03:06.840 | automatisch zugeordnet |

### Ergänzungen und korrigierte Zuordnungen

- 00:01:50.540–00:01:51.820 · **Loop.**: Large-v3 erkennt an dieser Stelle «Lob». Als kurze Loop-Zeile dem Prompt zugeordnet; Wortlaut ist unsicher und muss gehört werden.
- 00:01:59.400–00:02:00.100 · **Flood.**: Zusätzlicher englischer ASR-Lauf des gefilterten Breaks erkennt Flood mit Wortwahrscheinlichkeit 0.79. Die genaue Reihenfolge der Loop/Flood-Rufe bleibt offen.
- 00:02:00.840–00:02:01.560 · **Flood.**: Der englische ASR-Lauf erkennt eine weitere Flood-Zeile mit Wortwahrscheinlichkeit 0.79; keine unerkannte Loop-Zeile zwischen die Rufe ergänzt.
- 00:02:15.980–00:02:17.380 · **Yes.**: Die vollständigen deutschen Läufe und der englische Ausschnitt lesen Yes. Der Prompt nennt Jetzt. Übernommen ist die ASR-Lesart; die Wortentscheidung bleibt offen.
- 00:02:57.160–00:02:58.500 · **Ein Port down,**: Ausschnitt und vollständiger Turbo-Lauf lesen «Ein Problem». Schreibweise aus dem Prompt dem akustischen Kurzsatz zugeordnet; exakter Wortlaut muss gehört werden.

### Prompt-Zeilen ohne belastbare akustische Zuordnung

Diese Zeilen wurden nicht mit geschätzten Zeiten ergänzt. Das kann auf eine abweichende Aufnahme oder einen Erkennungsfehler zurückgehen.

- [Break] Loop.

## 05 Wireshark

Audio: `05_Wireshark_1.0.wav` · SHA-256 `243d6ab2160abfa883bfb86a53a73019e406f6f63986de0ebb3659570e83128c`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| «Bei mir geht's.» | Bei mir geht's, geht's, · 00:00:11.780–00:00:13.140 | Bei mir geht's, geht's, · 00:00:11.740–00:00:13.280 | automatisch zugeordnet |
| «Bei mir nicht.» | bei mir nicht. · 00:00:13.220–00:00:17.440 | bei mir nicht. · 00:00:13.320–00:00:17.660 | automatisch zugeordnet |
| Capture läuft. | Capture Lived · 00:00:24.960–00:00:26.540 | Capture Live · 00:00:25.060–00:00:26.580 | ja |
| Zeig mir die Spur. | Zeig mir die Spur · 00:00:26.540–00:00:31.000 | Zeig mir die Spur · 00:00:29.060–00:00:31.060 | ja |
| Der Browser dreht im Kreis, | Der Browser dreht im Kreis · 00:00:33.220–00:00:36.140 | Der Browser dreht im Kreis · 00:00:33.400–00:00:36.420 | automatisch zugeordnet |
| der Server sei bereit. | Der Server sei bereit · 00:00:36.140–00:00:40.140 | Der Server sei bereit · 00:00:37.820–00:00:40.580 | ja |
| Im Chat hat jeder eine These, | Im Chat hat jeder eine These · 00:00:41.740–00:00:44.500 | Im Chat hat jeder eine These · 00:00:41.780–00:00:44.940 | automatisch zugeordnet |
| doch keine passt zum Bild. | Doch keine passt zum Bild · 00:00:44.500–00:00:48.960 | Doch keine passt zum Bild · 00:00:46.180–00:00:49.040 | ja |
| Ich spiegle den betroffenen Port, | Ich spiegle den Betroffenen Port · 00:00:50.640–00:00:53.760 | Ich spiegle den betroffenen Port · 00:00:50.640–00:00:53.880 | automatisch zugeordnet |
| der Mitschnitt füllt den Screen. | Der Mitschnitt füllt den Screen · 00:00:53.760–00:00:57.740 | Der Mitschnitt füllt den Screen · 00:00:55.100–00:00:57.920 | automatisch zugeordnet |
| Zwischen all den fremden Flows | Zwischen all den fremden Flows · 00:01:00.000–00:01:02.720 | Zwischen all den fremden Flows · 00:01:00.020–00:01:02.780 | automatisch zugeordnet |
| muss unser Fehler liegen. | Muss unser Fehler liegen · 00:01:02.720–00:01:06.700 | Muss unser Fehler liegen · 00:01:04.040–00:01:06.940 | automatisch zugeordnet |
| Source und Destination. | Source und Destination, · 00:01:10.340–00:01:13.460 | Source und Destination · 00:01:10.480–00:01:13.800 | automatisch zugeordnet |
| Den richtigen Stream. | den richtigen Stream · 00:01:13.460–00:01:15.520 | kein Wortabgleich | ja |
| Ich blende fremde Frames aus, | Ich blende fremde Frames auf, · 00:01:17.580–00:01:20.960 | Ich blende fremde Frames aus, · 00:01:18.040–00:01:21.040 | automatisch zugeordnet |
| die Spur bleibt im Mitschnitt drin. | die Spur bleibt im Mitschnitt drin · 00:01:21.020–00:01:24.740 | die Spur bleibt im Mitschnitt drin · 00:01:21.080–00:01:24.800 | automatisch zugeordnet |
| Wireshark. | kein Wortabgleich | Fireshack, · 00:01:29.320–00:01:30.200 | ja |
| Zeig mir, was passiert. | zeig mir was passiert · 00:01:30.180–00:01:32.500 | zeigt mir was passiert, · 00:01:31.000–00:01:32.680 | automatisch zugeordnet |
| Paket für Paket, | Paket für Paket · 00:01:32.500–00:01:34.860 | Paket für Paket, · 00:01:33.220–00:01:35.000 | automatisch zugeordnet |
| bis die Spur zum Fehler führt. | ist die Spur zum Fehler für · 00:01:34.860–00:01:36.920 | die Spur zum Fehler führt · 00:01:35.140–00:01:37.140 | automatisch zugeordnet |
| Keine These hält mich auf. | deine These hält mich auf · 00:01:38.860–00:01:41.440 | Keine These, hält mich auf · 00:01:39.100–00:01:41.560 | automatisch zugeordnet |
| Ich folge diesem Stream, | Ich folge diesem Stream, · 00:01:41.440–00:01:43.480 | Ich folge diesem Stream, · 00:01:41.560–00:01:43.600 | automatisch zugeordnet |
| dann prüfe ich den nächsten Schritt. | dann prüfe ich den nächsten Schritt · 00:01:43.660–00:01:45.840 | dann prüfe ich den nächsten Schritt · 00:01:43.800–00:01:45.940 | automatisch zugeordnet |
| Der Request geht raus, dann Stille, | Der Request geht raus an Stille, · 00:01:45.840–00:01:48.640 | Der Request geht raus, dann stille · 00:01:45.940–00:01:48.820 | automatisch zugeordnet |
| ein Segment erscheint erneut. | ein Segment erscheint erneut · 00:01:48.780–00:01:50.960 | Ein Segment erscheint erneut · 00:01:48.820–00:01:51.120 | automatisch zugeordnet |
| Retransmission auf dem Bildschirm, | Drehtransmission auf dem Bildschirm, · 00:01:50.960–00:01:53.360 | Transmission auf dem Bildschirm, · 00:01:51.540–00:01:53.440 | automatisch zugeordnet |
| doch die Ursache ist noch weit. | doch die Ursache ist noch weit · 00:01:53.400–00:01:55.320 | doch die Ursache ist noch weit · 00:01:53.500–00:01:55.520 | automatisch zugeordnet |
| Was dieser Port nicht sehen kann, | Was dieser Port nicht sehen kann, · 00:01:55.320–00:01:57.760 | Was dieser Board nicht sehen kann, · 00:01:55.520–00:01:57.860 | automatisch zugeordnet |
| wird hier auch nicht zum Beweis. | wird hier auch nicht zum Beweis · 00:01:57.840–00:01:59.620 | wird hier auch nicht zum Beweis · 00:01:58.000–00:01:59.780 | automatisch zugeordnet |
| Ein zweiter Capture auf der Strecke | Ein zweiter Kehrtür auf der Strecke · 00:01:59.620–00:02:02.140 | Ein zweiter Kehrtür auf der Strecke, · 00:01:59.780–00:02:02.240 | automatisch zugeordnet |
| grenzt die Lücke für uns ein. | grenzt die Lücke für uns ein · 00:02:02.140–00:02:04.160 | grenzt die Lücke für uns ein · 00:02:02.440–00:02:04.340 | automatisch zugeordnet |
| ohne passende Secrets bleibt er dicht. | ohne passende Secrets bleibt er dicht · 00:02:06.740–00:02:09.100 | Passende Secrets bleibt er dicht · 00:02:07.140–00:02:09.280 | automatisch zugeordnet |
| Ich seh die sichtbaren Header, | Ich seh die sichtbaren Helder, · 00:02:09.100–00:02:11.600 | Ich seh die sichtbaren Hater · 00:02:09.280–00:02:11.680 | automatisch zugeordnet |
| doch die Nachricht les ich nicht. | doch die Nachricht les ich nicht · 00:02:11.600–00:02:13.520 | Doch die Nachricht lese ich nicht · 00:02:11.680–00:02:13.640 | automatisch zugeordnet |
| Ein Reset ist ein Hinweis, | Dein Reset ist ein Hinweis, · 00:02:13.520–00:02:15.660 | Ein Reset ist ein Hinweis · 00:02:13.640–00:02:15.740 | automatisch zugeordnet |
| kein Urteil über Schuld. | kein Urteil über Schuld · 00:02:15.700–00:02:17.300 | Kein Urteil über Schuld · 00:02:15.740–00:02:17.560 | automatisch zugeordnet |
| Erst wenn die Spuren zusammenpassen, | Erst wenn die Spuren zusammenpassen, · 00:02:17.300–00:02:19.720 | Erst wenn die Spuren zusammenpassen · 00:02:17.560–00:02:19.780 | automatisch zugeordnet |
| hat die nächste Änderung Grund. | hat die nächste Änderung Grund · 00:02:19.800–00:02:21.440 | Hat die nächste Änderung Grund · 00:02:19.780–00:02:21.580 | automatisch zugeordnet |
| Wireshark. | kein Wortabgleich | Weierschark · 00:02:22.720–00:02:23.420 | ja |
| Zeig mir, was passiert. | zeig mir was passiert · 00:02:23.380–00:02:25.740 | Zeig mir was passiert · 00:02:23.420–00:02:25.940 | automatisch zugeordnet |
| Paket für Paket, | Paket für Paket, · 00:02:25.740–00:02:28.280 | Paket für Paket · 00:02:25.940–00:02:28.300 | automatisch zugeordnet |
| bis die Spur zum Fehler führt. | bis die Spur zum Fehler führt · 00:02:28.280–00:02:30.280 | Dass die Spur zum Fehler führt · 00:02:28.300–00:02:30.440 | automatisch zugeordnet |
| Wireshark. | kein Wortabgleich | Weierschark · 00:02:31.660–00:02:32.360 | ja |
| Jetzt passt der Test zur Spur. | jetzt passt der Test zur Spur · 00:02:32.380–00:02:34.880 | Jetzt passt der Test zur Spur · 00:02:32.360–00:02:34.940 | automatisch zugeordnet |
| Der nächste Mitschnitt zeigt: | Nächste Mitschnitt zeigt, · 00:02:34.880–00:02:36.900 | Der nächste Mitschnitt zeigt, · 00:02:34.940–00:02:37.180 | automatisch zugeordnet |
| Die Antwort kommt zurück. | die Antwort kommt zurück · 00:02:37.260–00:02:39.160 | die Antwort kommt zurück · 00:02:37.380–00:02:39.220 | automatisch zugeordnet |
| Capture stoppen. | kein Wortabgleich | Käpte stoppen · 00:02:48.220–00:02:50.260 | ja |
| Spur sichern. | kein Wortabgleich | Spursichern · 00:02:52.380–00:02:53.400 | ja |
| Nicht nur «geht wieder». | Nicht nur geht wieder · 00:02:53.500–00:02:57.040 | Nicht nur geht wieder · 00:02:55.180–00:02:57.260 | ja |
| Auch: Warum. | Auch warum · 00:03:13.340–00:03:15.060 | Auch warum? · 00:03:14.160–00:03:15.180 | automatisch zugeordnet |

### Ergänzungen und korrigierte Zuordnungen

- 00:01:37.160–00:01:38.860 · **Wireshark.**: Der gefilterte Ausschnitt erkennt Wireshark mit niedriger Wortwahrscheinlichkeit; Large-v3 liest «Dein Erschlag». Hook-Schreibweise aus dem Prompt; Hörprüfung erforderlich.
- 00:02:04.680–00:02:06.480 · **TLS hält seinen Inhalt zu,**: Large-v3 und Ausschnitt erkennen TLS und bruchstückhafte Laute der folgenden Phrase. Prompt-Schreibweise mit den Ausschnittzeiten zugeordnet; Wortlaut bleibt offen.

## 06 ICMP

Audio: `06_ICMP_1.0.wav` · SHA-256 `1acad3bf8ff6addcf656e2b92cb0273c123230c70dfb2ce3b36f1a5b780ac823`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| Du kennst mich als Ping. | Du kennst mich als Ping. · 00:00:07.580–00:00:09.480 | Du kennst mich als Ping, · 00:00:07.720–00:00:09.560 | automatisch zugeordnet |
| Du kennst nur den Anfang. | Du kennst nur den Anfang. · 00:00:11.180–00:00:13.280 | du kennst nur den Anfang, · 00:00:09.740–00:00:13.480 | automatisch zugeordnet |
| ICMP. | ICMP. · 00:00:15.240–00:00:16.020 | ICMP, · 00:00:15.220–00:00:16.220 | automatisch zugeordnet |
| Hör hin. | Hören. · 00:00:18.580–00:00:19.360 | hör hin. · 00:00:16.660–00:00:19.660 | ja |
| Du tippst vier Zeichen, wartest kurz, | Du tippst, wir zeichnen, wartest kurz · 00:00:25.760–00:00:28.480 | Du tippst, wir zeichnen, wart kurz · 00:00:26.040–00:00:28.680 | automatisch zugeordnet |
| ein Echo kommt zu dir zurück. | Ein Echo kommt zu dir zurück · 00:00:28.480–00:00:31.160 | Ein Echo kommt zu dir zurück · 00:00:28.680–00:00:31.360 | automatisch zugeordnet |
| Echo Request. | Echo Request · 00:00:33.340–00:00:34.840 | Echo Request · 00:00:33.580–00:00:35.020 | automatisch zugeordnet |
| Echo Reply. | Echo Reply · 00:00:36.900–00:00:38.560 | Echo Reply · 00:00:37.340–00:00:38.780 | automatisch zugeordnet |
| Du misst die Zeit und gehst vorbei. | Du misst die Zeit und gehst vorbei · 00:00:40.420–00:00:43.880 | Du misst die Zeit und gehst vorbei · 00:00:41.040–00:00:44.160 | automatisch zugeordnet |
| Der Host gibt Antwort, doch dein Dienst steht still. | Der Host gibt Antwort, doch dein Dienst steht still · 00:00:43.880–00:00:47.820 | Der Haus gibt Antwort, doch dein Dienst steht still · 00:00:44.160–00:00:47.980 | automatisch zugeordnet |
| Ein Ping sagt nicht, ob deine App auch will. | Ich hab deine App auch will, · 00:00:49.360–00:00:51.660 | Ob deine App auch will · 00:00:49.660–00:00:51.800 | ja |
| Du kennst mein Echo, übersiehst den Rest. | du kennst mein Echo übersiehst den Rest, · 00:00:51.800–00:00:55.380 | Du kennst mein Echo übersiehst den Rest · 00:00:51.800–00:00:55.580 | automatisch zugeordnet |
| Ich spreche dort, wo dich das Netz im Dunkeln lässt. | ich spreche dort, wo ich das Netz im Dunkeln lässt · 00:00:55.660–00:00:59.300 | Ich spreche dort, wo dich das Netz im Dunkeln lässt · 00:00:55.580–00:00:59.360 | automatisch zugeordnet |
| ICMP. | ICMP, · 00:01:00.600–00:01:01.340 | ICMP · 00:01:00.200–00:01:00.980 | automatisch zugeordnet |
| Mehr als ein Ping. | mehr als ein Ping, · 00:01:01.340–00:01:02.880 | Mehr als ein Ping · 00:01:00.980–00:01:03.000 | automatisch zugeordnet |
| Jeder ruft mich. | jeder ruft mich, · 00:01:03.060–00:01:04.780 | Jeder ruft mich, · 00:01:03.000–00:01:04.980 | automatisch zugeordnet |
| Kaum einer hört hin. | kaum einer hört hin · 00:01:05.000–00:01:06.660 | kaum einer hört hin · 00:01:05.120–00:01:06.860 | automatisch zugeordnet |
| ICMP. | ICMP, · 00:01:07.600–00:01:08.340 | ICMP, · 00:01:07.880–00:01:08.660 | automatisch zugeordnet |
| Unterschätz meine Stimme nicht. | unterschätzt meine Stimme nicht, · 00:01:08.680–00:01:10.280 | unterschätzt meine Stimme nicht · 00:01:08.660–00:01:10.540 | automatisch zugeordnet |
| Wo dein Paket an Grenzen stößt, | wo, dein Paket an Grenzen stößt · 00:01:10.560–00:01:13.240 | Wo dein Paket an Grenzen stößt · 00:01:10.540–00:01:13.340 | automatisch zugeordnet |
| bring ich den Grund ans Licht. | Bring ich den Grund ans Licht, · 00:01:13.240–00:01:15.520 | Bring ich den Grund ans Licht · 00:01:13.340–00:01:15.580 | automatisch zugeordnet |
| Ping kommt durch, der Transfer steht, | Ping, komm durch, der Transfer steht · 00:01:15.620–00:01:18.720 | Ding, komm durch Der Transfer steht · 00:01:15.580–00:01:18.880 | automatisch zugeordnet |
| weil das große Paket nicht weitergeht. | Das große Paket nicht weitergeht · 00:01:19.360–00:01:22.540 | Der große geht nicht weiter, · 00:01:19.680–00:01:22.020 | automatisch zugeordnet |
| Don't Fragment. | don't don't fragment · 00:01:23.480–00:01:24.240 | down, down. Fragment, · 00:01:23.280–00:01:24.540 | automatisch zugeordnet |
| Der Router wirft es raus. | Der Router wirft es raus · 00:01:24.240–00:01:26.620 | der Router wirft es raus. · 00:01:24.800–00:01:26.820 | automatisch zugeordnet |
| Fragmentation Needed. | Fragmentation niedert · 00:01:26.620–00:01:28.600 | Fragmentation niedert, · 00:01:27.520–00:01:28.640 | ja |
| Die Antwort zeigt den Engpass auf. | die Antwort Zeigt den Engpass auf · 00:01:28.600–00:01:30.380 | die Antwort zeigt den Engpass auf. · 00:01:28.720–00:01:30.520 | automatisch zugeordnet |
| Path MTU Discovery. | Path MTU Discovery · 00:01:30.380–00:01:32.060 | Path, MTU Discovery, · 00:01:30.700–00:01:32.380 | automatisch zugeordnet |
| Der Sender passt die Größe an. | Der Sender passt die Größe an · 00:01:32.060–00:01:34.380 | der Sender passt die Größe an. · 00:01:32.720–00:01:34.480 | automatisch zugeordnet |
| Sperrst du die Meldung, fehlt der Hinweis, | Sperrst du die Meldung, fehlt der Hinweis · 00:01:34.380–00:01:36.420 | Sperrst du die Meldung, fehlt der Hinweis · 00:01:34.600–00:01:36.520 | automatisch zugeordnet |
| und dein Transfer hängt daran. | Und dein Transfer hängt daran · 00:01:36.420–00:01:38.080 | und dein Transfer hängt daran. · 00:01:36.520–00:01:38.220 | automatisch zugeordnet |
| Echo Reply. | Echo, Reply, · 00:01:38.080–00:01:39.780 | Echo, Reply, · 00:01:38.600–00:01:39.920 | automatisch zugeordnet |
| Time Exceeded. | Time, Exceeded · 00:01:39.940–00:01:41.860 | Time, Exceeded, · 00:01:40.520–00:01:41.880 | automatisch zugeordnet |
| Redirect. | Redirect, · 00:01:41.860–00:01:42.800 | Redirect. · 00:01:41.920–00:01:43.040 | automatisch zugeordnet |
| Hör, was das Netz dir sagt. | hör, was das Netz dir sagt · 00:01:43.100–00:01:45.120 | Hör, was das Netz dir sagt. · 00:01:43.340–00:01:45.160 | automatisch zugeordnet |
| ICMP. | ICMP · 00:01:45.120–00:01:45.820 | ICMP · 00:01:45.160–00:01:46.020 | automatisch zugeordnet |
| Mehr als ein Ping. | kein Wortabgleich | Mehr als ein Ping · 00:01:48.320–00:01:49.880 | ja |
| Du schickst die Probe weiter raus, | Du schickst die Probe weiter raus · 00:01:52.660–00:01:55.700 | Du schickst die Probe weiter raus · 00:01:53.180–00:01:55.940 | automatisch zugeordnet |
| die TTL läuft unterwegs aus. | Die PTR läuft unterwegs aus · 00:01:55.700–00:02:00.020 | Die TTR läuft unterwegs aus · 00:01:56.960–00:02:00.140 | automatisch zugeordnet |
| Time Exceeded. | Time Exceeded · 00:02:00.020–00:02:01.500 | Time Exide · 00:02:00.140–00:02:01.420 | automatisch zugeordnet |
| Ein Router meldet sich. | Ein Router meldet sich · 00:02:01.500–00:02:03.580 | Ein Router meldet sich · 00:02:01.420–00:02:03.840 | automatisch zugeordnet |
| Traceroute folgt diesen Spuren, | hoopt, folgt diesen Spuren · 00:02:04.280–00:02:05.720 | hoopt, folgt diesen Spuren · 00:02:04.380–00:02:05.780 | automatisch zugeordnet |
| Hop für Hop wird sichtbar für dich. | Hop für Hop wird sichtbar für dich · 00:02:05.720–00:02:07.620 | Hopp für Hopp, wird sichtbar für dich · 00:02:05.780–00:02:07.720 | automatisch zugeordnet |
| Destination Unreachable. | Destination Unreachable · 00:02:07.620–00:02:09.900 | Destination, unreachable · 00:02:07.720–00:02:10.020 | automatisch zugeordnet |
| Lies den Code, bevor du rätst. | Lies den Code bevor du rätst · 00:02:09.900–00:02:11.600 | Lies den Code, bevor du rätst, · 00:02:10.020–00:02:11.700 | automatisch zugeordnet |
| Ein Fehler hat dir mehr zu sagen | Ein Fehler, dem herzusagen · 00:02:11.600–00:02:13.100 | ein Fehler Dem her zu sagen, · 00:02:11.780–00:02:13.660 | ja |
| als ein Kreis, der sich nur dreht. | Als ein Kreis, der sich nur dreht · 00:02:13.100–00:02:15.460 | als ein Kreis, der sich nur dreht · 00:02:13.760–00:02:15.640 | automatisch zugeordnet |
| ICMP. | Als EMP, · 00:02:16.540–00:02:17.680 | Als EMP, · 00:02:16.780–00:02:17.900 | automatisch zugeordnet |
| Mehr als ein Ping. | mehr als ein Ding · 00:02:17.980–00:02:19.740 | mehr als ein Ding · 00:02:18.180–00:02:19.860 | automatisch zugeordnet |
| Jeder ruft mich. | Jeder ruft mich, · 00:02:19.740–00:02:21.640 | Jeder ruft mich, · 00:02:20.540–00:02:21.820 | automatisch zugeordnet |
| Kaum einer hört hin. | kaum einer hat hin · 00:02:21.860–00:02:23.560 | kaum einer hat hin · 00:02:22.200–00:02:23.700 | automatisch zugeordnet |
| ICMP. | Als EMP, · 00:02:23.560–00:02:25.200 | Als EMP, · 00:02:23.700–00:02:25.400 | automatisch zugeordnet |
| Unterschätz meine Stimme nicht. | unterschätzt meine Stimme nicht · 00:02:25.500–00:02:27.160 | unterschätzt meine Stimme nicht · 00:02:25.680–00:02:27.400 | automatisch zugeordnet |
| Wo dein Paket an Grenzen stößt, | Wo dein Paket an Grenzen stößt, · 00:02:27.160–00:02:30.140 | Wo dein Paket an Grenzen stirbt, · 00:02:27.400–00:02:30.100 | automatisch zugeordnet |
| bring ich den Grund ans Licht. | bring ich den Grund ans Licht · 00:02:30.140–00:02:32.200 | bring ich den Grund ans Licht · 00:02:30.460–00:02:32.440 | automatisch zugeordnet |
| Dein Gateway kennt den nächsten Router, | Dein Gateway kennt den nächsten Route · 00:02:32.200–00:02:34.400 | Dein Gateway kennt den nächsten Route · 00:02:32.440–00:02:34.560 | automatisch zugeordnet |
| im selben Netz wie dein Gerät. | im selben Netz wie dein Gerät · 00:02:34.400–00:02:36.360 | im selben Netz wie dein Gerät · 00:02:34.560–00:02:36.440 | automatisch zugeordnet |
| Redirect sagt deinem Host, | Redirekt sagt deinem Host, · 00:02:36.360–00:02:37.820 | direkt, sag deinem Haus, · 00:02:36.680–00:02:37.900 | automatisch zugeordnet |
| dass es für dieses Ziel direkter geht. | dass es für dieses Ziel direkter geht · 00:02:37.940–00:02:39.660 | dass es für dieses Ziel direkt geht · 00:02:37.960–00:02:39.740 | automatisch zugeordnet |
| Du prüfst den Hinweis, prüfst die Quelle, | Du prüfst den Hinweis, prüfst die Quelle, · 00:02:39.660–00:02:41.620 | Du prüfst den Hinweis, prüfst die Quelle, · 00:02:39.740–00:02:41.640 | automatisch zugeordnet |
| bevor dein Host den Weg neu wählt. | bevor dein Host den Weg neu wählt · 00:02:41.620–00:02:43.520 | bevor dein Haus den Weg neu wählt · 00:02:41.700–00:02:43.560 | automatisch zugeordnet |
| Ich bin die Stimme aus der Leitung. | Ich bin die Stimme aus der Leitung · 00:02:43.520–00:02:45.480 | Ich bin die Stimme aus der Leitung, · 00:02:43.560–00:02:45.580 | automatisch zugeordnet |
| Jetzt hörst du, was das Netz erzählt. | Jetzt hörst du, was das Netz erzählt · 00:02:45.820–00:02:47.660 | jetzt hörst du, was das Netz erzählt · 00:02:45.820–00:02:47.880 | automatisch zugeordnet |
| ICMP. | ICMP, · 00:02:49.620–00:02:50.220 | ICMP, · 00:02:49.940–00:02:50.460 | automatisch zugeordnet |
| Mehr als ein Ping. | mehr als ein Ding · 00:02:50.220–00:02:51.640 | mehr als ein Ding, · 00:02:50.460–00:02:51.740 | automatisch zugeordnet |
| Jeder ruft mich. | Jeder ruft mich, · 00:02:51.640–00:02:53.500 | jeder ruft mich, · 00:02:52.760–00:02:53.700 | automatisch zugeordnet |
| Jetzt hörst du hin. | jetzt hörst du hin · 00:02:53.720–00:02:55.400 | jetzt hörst du hin · 00:02:54.200–00:02:55.500 | automatisch zugeordnet |
| ICMP. | ICMP, · 00:02:56.500–00:02:57.100 | ICMP, · 00:02:56.740–00:02:57.260 | automatisch zugeordnet |
| Unterschätz meine Stimme nicht. | schätz meine Stimme nicht · 00:02:57.400–00:02:59.060 | schätze meine Stimme nicht, · 00:02:57.880–00:02:59.300 | automatisch zugeordnet |
| Das Netz hat dir genug zu sagen. | Das Netz hat dir genug zu sagen · 00:02:59.060–00:03:01.360 | das Netz hat dir genug zu sagen · 00:02:59.520–00:03:01.480 | automatisch zugeordnet |
| Hör zu, wenn es mit dir spricht. | Hör zu, wenn es mit dir spricht · 00:03:01.360–00:03:04.780 | Hör zu, wenn es mit dir spricht · 00:03:01.480–00:03:04.940 | automatisch zugeordnet |
| Request. | Request, · 00:03:10.640–00:03:11.240 | Request, · 00:03:10.100–00:03:11.260 | automatisch zugeordnet |
| Reply. | reply · 00:03:11.320–00:03:11.800 | reply · 00:03:11.480–00:03:12.180 | automatisch zugeordnet |
| Du kennst jetzt mehr. | Du kannst jetzt mehr · 00:03:11.800–00:03:15.780 | kein Wortabgleich | ja |
| ICMP. | ICMP · 00:03:18.220–00:03:19.620 | ICMP · 00:03:18.660–00:03:19.820 | automatisch zugeordnet |

### Prompt-Zeilen ohne belastbare akustische Zuordnung

Diese Zeilen wurden nicht mit geschätzten Zeiten ergänzt. Das kann auf eine abweichende Aufnahme oder einen Erkennungsfehler zurückgehen.

- [Outro] Hör hin.

## 07 QoS

Audio: `07_QoS_1.0.wav` · SHA-256 `2eb5c953db38d50aaeba2bb4d1c6fd761c8764dc961b52581308b7684e30c73f`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| Quality of Service. | Quality of Service, · 00:00:13.300–00:00:14.940 | Quality of Service, · 00:00:12.960–00:00:15.460 | automatisch zugeordnet |
| Nicht alles gleich. | nicht alles gleich. · 00:00:15.480–00:00:18.580 | nicht alles gleich. · 00:00:15.520–00:00:18.800 | automatisch zugeordnet |
| Echtzeit zuerst, | Echtzeit zuerst, · 00:00:20.920–00:00:22.440 | Echtzeit zuerst, · 00:00:20.480–00:00:22.540 | automatisch zugeordnet |
| was warten kann, reiht sich ein. | was warten kann, reiht sich ein. · 00:00:22.520–00:00:26.100 | was warten kann, reiht sich ein. · 00:00:22.720–00:00:26.340 | automatisch zugeordnet |
| Quality of Service. | Quality of Service · 00:00:28.380–00:00:29.900 | Quality of Service · 00:00:28.360–00:00:30.480 | automatisch zugeordnet |
| Wir teilen diesen Draht. | Wir teilen diesen Draht · 00:00:31.200–00:00:33.900 | Wir teilen diesen Draht · 00:00:31.680–00:00:34.100 | automatisch zugeordnet |
| Die Klasse setzt den Rahmen, | Die Klasse setzt den Rahmen · 00:00:35.240–00:00:37.460 | Die Klasse setzt den Rahmen · 00:00:35.320–00:00:37.640 | automatisch zugeordnet |
| die Policy hält den Takt. | Die Policy hält den Tag · 00:00:38.480–00:00:40.900 | Die Polizei hält den Tag · 00:00:37.640–00:00:41.040 | automatisch zugeordnet |
| Ich trag die Dateien Stück für Stück, | Ich trag die Dateien Stück für Stück · 00:00:58.100–00:01:00.620 | Ich trag die Latein Stück für Stück · 00:00:58.200–00:01:00.760 | automatisch zugeordnet |
| TCP zählt meine Bytes. | TCP zählt meine Bytes · 00:01:01.500–00:01:03.640 | Tzip zählt meine Beis · 00:01:01.680–00:01:03.840 | automatisch zugeordnet |
| Geht ein Segment verloren, | Geht ein Segment verloren · 00:01:05.380–00:01:07.080 | Geht dein Segment verloren · 00:01:05.480–00:01:07.400 | automatisch zugeordnet |
| schick ich es noch mal auf die Reise. | Schick ich es nochmal auf die Reise · 00:01:08.600–00:01:11.060 | Schick ich es nochmal auf die Reise · 00:01:08.720–00:01:11.180 | automatisch zugeordnet |
| Gib mir den Anteil, der mir bleibt, | Gib mir den Anteil, der mir bleibt · 00:01:12.700–00:01:16.040 | Gib mir den Anteil, der mir bleibt · 00:01:12.780–00:01:16.320 | automatisch zugeordnet |
| ich muss nicht vor dir durch die Tür. | Ich muss nicht vor dir durch die Tür · 00:01:16.040–00:01:18.380 | Ich muss nicht vor dir durch die Tür · 00:01:16.320–00:01:18.480 | automatisch zugeordnet |
| Du brauchst den Satz im Augenblick, | Du brauchst den Satz im Augenblick · 00:01:20.100–00:01:22.660 | Du brauchst den Satz im Augenblick · 00:01:20.240–00:01:22.760 | automatisch zugeordnet |
| ich brauch den Rest der Strecke hier. | Ich brauch den Rest der Strecke hier · 00:01:23.400–00:01:25.780 | Ich brauch den Rest der Strecke hier · 00:01:23.540–00:01:25.960 | automatisch zugeordnet |
| Policing zieht die Grenze. | Policien zieht die Grenze · 00:01:28.880–00:01:30.620 | Policing zieht die Grenze · 00:01:28.840–00:01:30.660 | automatisch zugeordnet |
| Zu viel wird markiert oder fällt. | zu viel, wird markiert oder fällt · 00:01:30.620–00:01:33.020 | zu viel, wird markiert oder fällt · 00:01:30.660–00:01:33.200 | automatisch zugeordnet |
| Kein Warten auf den nächsten Platz, | Kein Warten auf den nächsten Platz, · 00:01:35.480–00:01:37.860 | Kein Warten auf den nächsten Platz, · 00:01:35.440–00:01:37.940 | automatisch zugeordnet |
| wenn diese Policy es so bestellt. | wenn diese Policier so bestellt · 00:01:37.940–00:01:40.620 | wenn diese Policiers so bestellt · 00:01:38.060–00:01:40.840 | automatisch zugeordnet |
| Shaping hält den Überschuss zurück, | Shaping hält den Überschuss zurück · 00:01:44.140–00:01:47.040 | Shaping hält den Überschuss zurück · 00:01:44.100–00:01:47.180 | automatisch zugeordnet |
| im Puffer wartet mein Paket. | im Puffer Wartet mein Paket, · 00:01:47.040–00:01:51.080 | im Puffer Wartet mein Paket, · 00:01:47.180–00:01:51.260 | automatisch zugeordnet |
| Es glättet meinen Strom, | das glättet Mein Strom · 00:01:51.080–00:01:53.680 | das glättet Mein Strom · 00:01:51.400–00:01:53.880 | automatisch zugeordnet |
| bis der nächste Anteil geht. | ist der nächste Anteil G · 00:01:53.680–00:01:57.120 | ist der nächste Antal -G · 00:01:53.880–00:01:57.220 | ja |
| Classify. | Classify · 00:02:06.100–00:02:06.980 | Classify · 00:02:05.880–00:02:07.280 | automatisch zugeordnet |
| Mark. | Mark · 00:02:07.840–00:02:08.540 | Mark · 00:02:08.180–00:02:08.880 | automatisch zugeordnet |
| Queue. | Queer · 00:02:09.780–00:02:10.480 | kein Wortabgleich | ja |
| Mein Wort muss jetzt hinaus. | Mein Wort muss jetzt hinaus · 00:02:10.480–00:02:13.140 | Mein Wort muss jetzt hinaus · 00:02:11.340–00:02:13.360 | automatisch zugeordnet |
| Schedule. | Scheduler · 00:02:21.100–00:02:21.820 | Schedular · 00:02:21.340–00:02:22.080 | automatisch zugeordnet |
| Shape. | Shake · 00:02:22.720–00:02:23.420 | Shake · 00:02:22.940–00:02:23.640 | automatisch zugeordnet |
| Send. | kein Wortabgleich | Send · 00:02:23.640–00:02:25.500 | ja |
| Ich nutze, was noch bleibt. | Ich nutze was noch bleibt · 00:02:25.200–00:02:29.080 | Ich nutze was noch bleibt · 00:02:25.500–00:02:29.220 | automatisch zugeordnet |
| Quality of Service. | Quality of Service · 00:02:31.150–00:02:32.700 | Quality of Service · 00:02:30.740–00:02:33.140 | automatisch zugeordnet |
| Nicht alles gleich. | Nicht alles gleich · 00:02:32.700–00:02:36.360 | Nicht alles gleich · 00:02:33.140–00:02:36.680 | automatisch zugeordnet |
| Echtzeit zuerst, | Echtzeit zuerst · 00:02:38.930–00:02:40.060 | Echtzeit zuerst · 00:02:38.260–00:02:40.180 | automatisch zugeordnet |
| was warten kann, reiht sich ein. | was warten kann Reicht sich ein · 00:02:40.060–00:02:43.760 | was warten kann Reiz ich ein · 00:02:40.180–00:02:44.000 | automatisch zugeordnet |
| Quality of Service. | Quality of Service · 00:02:45.940–00:02:47.760 | Quality of Service · 00:02:45.580–00:02:48.060 | automatisch zugeordnet |
| Wir teilen diesen Draht. | Wir teilen diesen Draht · 00:02:49.000–00:02:51.540 | Wir teilen diesen Draht · 00:02:48.060–00:02:51.760 | automatisch zugeordnet |
| Dein Satz kommt wieder klar, | Dein Satz kommt wieder klar · 00:02:53.020–00:02:55.060 | Dein Satz kommt wieder klar, · 00:02:53.640–00:02:55.320 | automatisch zugeordnet |
| mein Transfer läuft danach. | Mein Transfer läuft danach · 00:02:56.420–00:02:58.440 | mein Transfer läuft danach · 00:02:55.480–00:02:58.560 | automatisch zugeordnet |
| Hörst du mich? | Hörst du mich? · 00:03:15.200–00:03:16.820 | Hörst du mich? · 00:03:15.960–00:03:16.940 | automatisch zugeordnet |
| Mein Transfer läuft noch. | Mein Transfer läuft noch · 00:03:35.980–00:03:39.280 | Mein Transfer läuft noch · 00:03:37.640–00:03:39.440 | ja |
| Passt. | Passt. · 00:03:42.340–00:03:43.740 | Passt · 00:03:42.360–00:03:43.760 | automatisch zugeordnet |

### Ergänzungen und korrigierte Zuordnungen

- 00:03:30.720–00:03:32.120 · **Klar und deutlich.**: Alle drei Läufe erkennen an dieser Stelle Varianten von «Kaum deutlich»/«Kaundeutig». Dem Prompt-Kurzsatz zugeordnet; zusätzlicher unklarer Sprachkandidat bei 203.84–207.14 s nicht als sichere Wiederholung übernommen.

### Prompt-Zeilen ohne belastbare akustische Zuordnung

Diese Zeilen wurden nicht mit geschätzten Zeiten ergänzt. Das kann auf eine abweichende Aufnahme oder einen Erkennungsfehler zurückgehen.

- [Intro] Ich bin die Stimme im Gespräch.
- [Intro] Ich kann nicht warten.
- [Intro] Ich bin der Transfer nebenan.
- [Intro] Ich komm auch später an.
- [Verse 1] Dein Backup schiebt den Link jetzt voll,
- [Verse 1] mein Satz zerbricht am andern Ende.
- [Verse 1] Ein Wort zu spät, ein Stück fehlt ganz,
- [Verse 1] ich sprech und hör nur Lücken.
- [Verse 1] Erst die Klasse, dann die Markierung,
- [Verse 1] DSCP zeigt, wer ich bin.
- [Verse 1] Doch nur die passende Policy
- [Verse 1] gibt diesem Zeichen einen Sinn.
- [Pre-Chorus] Wir teilen uns denselben Draht.
- [Pre-Chorus] Er wird durch Tags nicht breiter.
- [Pre-Chorus] Ordne uns in die Queues,
- [Pre-Chorus] dann läuft das Gespräch weiter.

## 08 Out of Band

Audio: `08_Out_of_Band_1.0.wav` · SHA-256 `9139796abf25839d0b7a85ee57042ebe0e1f524d5f8c0f61073e9b2b42a2427c`.

| Prompt-Zeile | Large-v3: erkannter Text / Zeiten | Turbo: erkannter Text / Zeiten | Erstabgleich: Prüfung |
|---|---|---|---|
| Kein Login. | Kein Login, · 00:00:08.480–00:00:10.420 | kein Wortabgleich | ja |
| Keine Antwort. | keine Antwort, · 00:00:10.420–00:00:14.020 | kein Wortabgleich | ja |
| Das Netz ist weg. | das Netz ist weg, · 00:00:14.460–00:00:18.180 | kein Wortabgleich | ja |
| Der andere Weg bleibt. | der andere Weg bleibt. · 00:00:18.480–00:00:22.580 | kein Wortabgleich | ja |
| SSH wartet, bis es aufgibt, | hart, wartet bis es aufgeht · 00:00:46.200–00:00:48.180 | wartet bis es aufgeht · 00:00:46.720–00:00:48.400 | automatisch zugeordnet |
| kein Dashboard lädt noch einen Wert. | Kein Dashboard lädt noch einen Wert · 00:00:48.180–00:00:51.320 | Kein Dashboard lädt noch einen Wert · 00:00:48.400–00:00:51.420 | automatisch zugeordnet |
| Die Änderung hat den Pfad zerschnitten, | Die Änderung hat den Pfad zerschnitten · 00:00:52.680–00:00:55.680 | Die Änderung hat den Fahrt zerschnitten · 00:00:52.580–00:00:55.780 | automatisch zugeordnet |
| über den ich sie geschickt hab. | Über den ich sie geschickt hab · 00:00:56.480–00:00:58.820 | Über den ich sie geschickt hab · 00:00:55.780–00:00:58.920 | automatisch zugeordnet |
| Doch hinten am Rack hängt eine Leitung, | Doch hinten am Rack hängt eine Leitung · 00:01:00.080–00:01:03.360 | Doch hinten am Rack hängt eine Leitung · 00:01:00.180–00:01:03.500 | automatisch zugeordnet |
| getrennt von diesem Traffic hier. | Getrennt von diesem Traffic hier · 00:01:03.360–00:01:06.780 | Getrennt von diesem Traffic hier · 00:01:03.500–00:01:06.960 | automatisch zugeordnet |
| Ein eigener Zugang zur Console, | Ein eigener Zugang zur Konsole · 00:01:06.780–00:01:11.060 | Ein eigener Zugang zur Konsole · 00:01:06.960–00:01:11.360 | automatisch zugeordnet |
| die letzte offene Tür. | Die letzte offene Tür · 00:01:11.060–00:01:13.420 | Die letzte offene Tür · 00:01:11.360–00:01:13.560 | automatisch zugeordnet |
| Ich brauch nicht erst das Netz zurück, | Ich brauch nicht erst das Netz zurück · 00:01:15.300–00:01:18.020 | Ich brauch nicht erst das Netz zurück · 00:01:15.440–00:01:18.160 | automatisch zugeordnet |
| um wieder ranzukommen. | Um wieder ranzukommen · 00:01:18.020–00:01:20.900 | Um wieder ranzukommen · 00:01:18.160–00:01:21.040 | automatisch zugeordnet |
| Ich nehme den getrennten Weg. | Ich nehme den getrennten Weg · 00:01:22.600–00:01:25.840 | Ich nehme den getrennten Weg, · 00:01:23.040–00:01:26.020 | automatisch zugeordnet |
| Der Prompt ist noch zu hören. | Der prompt ist noch zu hören · 00:01:25.840–00:01:28.080 | der prompt ist noch zu hören · 00:01:26.120–00:01:28.220 | automatisch zugeordnet |
| Out of Band. | Out of bed, · 00:01:30.080–00:01:31.720 | Out of bed, · 00:01:30.180–00:01:32.000 | ja |
| Eine Tür bleibt offen. | eine Tür bleibt offen, · 00:01:31.980–00:01:35.660 | eine Tür bleibt offen · 00:01:32.580–00:01:35.820 | automatisch zugeordnet |
| Wenn der grosse Weg verstummt, | wenn der große Weg verstummt, · 00:01:35.860–00:01:40.040 | Wenn der große Weg verstummt, · 00:01:37.060–00:01:40.120 | automatisch zugeordnet |
| komm ich hier noch an. | komm ich hier noch an. · 00:01:40.040–00:01:43.220 | komm ich hier noch an · 00:01:41.660–00:01:43.480 | ja |
| Out of Band. | Out of bed, · 00:01:45.160–00:01:46.960 | Out of bed · 00:01:45.240–00:01:47.240 | ja |
| Ich erreiche die Console. | ich erreiche die Konsole, · 00:01:47.380–00:01:51.160 | Ich erreiche die Konsole · 00:01:47.240–00:01:51.480 | automatisch zugeordnet |
| Ein schmaler Weg zurück, | ein schmaler Weg zurück, · 00:01:51.160–00:01:54.260 | Ein schmaler Weg zurück · 00:01:51.480–00:01:54.460 | automatisch zugeordnet |
| bis das Netz wieder trägt. | bis das Netz wieder · 00:01:54.680–00:01:57.800 | Bis das Netz wieder drückt · 00:01:55.920–00:01:58.620 | automatisch zugeordnet |
| Die Console zeigt den letzten Change, | als sei ich den letzten Change · 00:02:17.520–00:02:18.900 | Die Konsol zeigt den letzten Change · 00:02:16.320–00:02:19.380 | automatisch zugeordnet |
| der Diff liegt neben meinem Plan. | Der, der fliegt neben meinem Plan · 00:02:20.420–00:02:22.720 | Der Tiff liegt neben meinem Plan · 00:02:20.260–00:02:22.900 | automatisch zugeordnet |
| Ich prüfe, was den Weg gekappt hat, | Ich prüfe, was den Weg gekappt hat · 00:02:24.100–00:02:26.940 | Ich prüfe, was den Weg gekappt hat · 00:02:24.080–00:02:26.980 | automatisch zugeordnet |
| und setze den Fehler zurück. | Und setze den Fehler zurück · 00:02:27.880–00:02:30.120 | Und setze den Fehler zurück · 00:02:27.900–00:02:30.480 | automatisch zugeordnet |
| Erst steht der Link, dann kommt die Route, | Es steht der Link, dann kommt die Route · 00:02:31.200–00:02:33.720 | Erst steht der Link, dann kommt die Route · 00:02:30.480–00:02:33.840 | automatisch zugeordnet |
| doch grün allein reicht mir nicht. | Doch Grün allein reicht mir nicht · 00:02:35.080–00:02:37.520 | Doch Grün allein reicht mir nicht · 00:02:35.040–00:02:37.800 | automatisch zugeordnet |
| Ich teste den betroffenen Service | Ich teste den betroffenen Service · 00:02:38.880–00:02:41.500 | Ich teste den Betroffenen -Service · 00:02:38.860–00:02:41.680 | automatisch zugeordnet |
| vom Client bis zum Ziel. | Vom Klären bis zum Ziehen · 00:02:43.200–00:02:45.700 | Vom Klieren bis zum Ziel · 00:02:43.480–00:02:45.700 | automatisch zugeordnet |
| Ein Backup, das erreichbar ist. | Ein Backup, das erreichbar ist · 00:02:46.980–00:02:49.320 | Ein Backup, das erreichbar ist, · 00:02:47.040–00:02:49.460 | automatisch zugeordnet |
| Ein Rollback, den wir kennen. | Ein Rollback, den wir kennen · 00:02:49.320–00:02:50.860 | ein Rollpack, den wir kennen · 00:02:49.480–00:02:51.060 | automatisch zugeordnet |
| Ein Zugang, der getrennt bleibt, | Ein Zugang, der getrennt bleibt, · 00:02:50.860–00:02:52.920 | Ein Zugang, der getrennt bleibt, · 00:02:51.060–00:02:53.000 | automatisch zugeordnet |
| wenn sich die andern Wege trennen. | wenn sich die anderen Wege trennen · 00:02:53.000–00:02:54.800 | wenn sich die anderen Wege trennen · 00:02:53.100–00:02:54.860 | automatisch zugeordnet |
| Kein Zauber hinter dieser Tür, | Kein Zauber hinter dieser Tür, · 00:02:54.800–00:02:56.960 | Kein Zauber hinter dieser Tür, · 00:02:54.860–00:02:57.020 | automatisch zugeordnet |
| wir haben sie vorher gebaut. | wir haben sie vorher gebaut · 00:02:57.080–00:02:58.640 | wir haben sie vorher gebaut · 00:02:57.160–00:02:58.820 | automatisch zugeordnet |
| Jetzt trägt die kleine Leitung | Jetzt trägt die kleine Leitung · 00:02:58.640–00:03:00.540 | Jetzt trägt die kleine Leitung · 00:02:58.820–00:03:00.600 | automatisch zugeordnet |
| die Arbeit für das grosse Netz. | die Arbeit für das große Netz · 00:03:00.540–00:03:02.800 | die Arbeit für das große Netz · 00:03:00.600–00:03:03.020 | automatisch zugeordnet |
| Out of Band. | Out of bed · 00:03:16.400–00:03:18.360 | Out of band · 00:03:16.880–00:03:18.660 | automatisch zugeordnet |
| Eine Tür bleibt offen. | Eine Tür bleibt offen · 00:03:19.820–00:03:22.320 | Eine Tür bleibt offen · 00:03:19.920–00:03:22.440 | automatisch zugeordnet |
| Wenn der grosse Weg verstummt, | Wenn der große Weg verstummt, · 00:03:23.600–00:03:26.600 | Wenn der große Weg verstummt · 00:03:23.700–00:03:26.660 | automatisch zugeordnet |
| komm ich hier noch an. | komm ich hier noch ran · 00:03:26.600–00:03:29.920 | Komm ich hier noch ab · 00:03:27.380–00:03:30.080 | automatisch zugeordnet |
| Out of Band. | Out of hell, · 00:03:31.880–00:03:33.760 | Out of band · 00:03:32.060–00:03:33.960 | automatisch zugeordnet |
| Die Antwort ist zurück. | die Antwort ist zurück · 00:03:33.960–00:03:37.660 | Die Antwort ist zurück · 00:03:35.400–00:03:37.800 | automatisch zugeordnet |
| Der Test erreicht sein Ziel, | Der Test erreicht sein Ziel · 00:03:38.640–00:03:41.060 | Der Tester reicht sein Ziel · 00:03:37.800–00:03:41.260 | automatisch zugeordnet |
| und das Netz trägt wieder. | und das Netz dreht wieder · 00:03:41.060–00:03:45.300 | das Netz dreht wieder · 00:03:43.760–00:03:45.440 | ja |
| Console bleibt erreichbar. | so bleibt erreichbar · 00:03:49.640–00:03:52.200 | so bleibt erreichbar · 00:03:49.700–00:03:52.460 | ja |
| Die letzte Änderung dokumentiert. | Die letzte Änderung dokumentiert · 00:03:52.200–00:03:56.200 | Die letzte Änderung dokumentiert · 00:03:52.460–00:03:56.280 | automatisch zugeordnet |
| Das Telefon liegt still. | Das Telefon liegt still · 00:03:56.200–00:04:00.340 | Das Telefon liegt still · 00:03:56.280–00:04:00.500 | automatisch zugeordnet |
| Die Stadt schläft weiter. | Die Stadt schläft weiter · 00:04:00.340–00:04:03.560 | Die Stadt schläft weiter · 00:04:00.500–00:04:03.740 | automatisch zugeordnet |

