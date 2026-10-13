# Token Burn DE — Umsetzung, Schnitt und Cues

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten ab Sample 0 der Original-WAV `Token Burn - DE.wav`; Fassung DE.

58 Einstellungen, 13 Kapitel, 6 TOKEN-BURN-Einsätze. Alle 47 Analyse-Events und 47 Lyric-Segmente sind genau einer Einstellung zugeordnet. Blende ab 240 s, Pegellücken 14.15–14.3, 141.85–142 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Nur ein Regler | Ein heller Bildschirm in der Nacht, eine kleine Änderungsnotiz. |
| C02 | 00:28.560 | 01:00 | Der erste Build läuft; ein Bassregler und ein zweiter Klang kommen dazu. |
| C03 | 00:42.800 | Bassspur leer | Nach Reload fehlt die Bassreihe; eine Zeile im Ladepfad fehlt. |
| C04 | 00:52.920 | 02:00 | Derselbe Test besteht. Die Hand bleibt an der Tastatur. |
| C05 | 01:18.660 | Token Burn | Erster Refrain: Noch ein Prompt, ein Tab zu, zwei neue. |
| C06 | 01:40.840 | Der Stand von eben | Drei gespeicherte Projektstände und ein freier Platz. |
| C07 | 01:55.080 | 03:00 · Export | Der Export lässt die Bassspur weg; die Reparatur prüft 64 Schritte. |
| C08 | 02:08.580 | Nutzungsjournal | Input, Output, Summe und fiktive Demo-Credits je Auftrag. |
| C09 | 02:19.880 | Noch ein Prompt | Zweiter Refrain: Die Schrift wird räumlich. |
| C10 | 02:44.280 | Kalter Kaffee | Das Fenster wird hell, die Antwort wird gelesen. |
| C11 | 03:08.460 | Tageslicht | Dritter Refrain im Morgenlicht, alles hat dieselbe Version. |
| C12 | 03:35.600 | Preset speichern | Der nächste Auftrag wird abgesendet und läuft weiter. |
| C13 | 03:47.840 | Morgen | Zurück durch das Fenster; der Cursor bleibt. |

## TOKEN BURN

| Hook | Shot | Stimme ab | Sichtbar mindestens bis |
| --- | --- | --- | --- |
| H01 | S020 | 01:18.660 | 01:20.150 |
| H02 | S022 | 01:25.740 | 01:27.270 |
| H03 | S036 | 02:22.260 | 02:23.560 |
| H04 | S038 | 02:29.420 | 02:30.720 |
| H05 | S047 | 03:08.460 | 03:09.760 |
| H06 | S049 | 03:15.180 | 03:16.770 |

## Aufträge (fiktives Demo-Szenario)

| Auftrag | Text | getippt | gesendet | fertig | Version | Input | Output |
| --- | --- | --- | --- | --- | --- | ---: | ---: |
| P01 | Füge einen Level-Regler für die Kick-Spur hinzu. | 00:11.635 | 00:16.700 | 00:28.810 | v0.4 | 1240 | 360 |
| P02 | Bassregler und zweite Stimme ergänzen. Pattern speichern und nach Reload wiederherstellen. | 00:39.400 | 00:41.432 | 00:52.300 | v0.5 | 2360 | 640 |
| P03 | Projektstände vergleichen, nächste Ansicht anlegen. | 01:03.140 | 01:03.640 | 01:31.098 | v0.6 | 3180 | 820 |
| P04 | Export mit allen vier Pattern-Reihen. | 01:38.734 | 01:40.138 | 02:07.960 | v0.7 | 4600 | 1400 |
| P05 | Zusätzliche UI-Einstellungen dauerhaft übernehmen. | 02:20.030 | 02:20.951 | 02:34.095 | v0.8 | 6240 | 1760 |
| P06 | Preset speichern | 03:36.000 | 03:43.810 | läuft | v0.9 | 7800 | 1900 |

Nutzung am Ende: 25420 Input + 6880 Output = 32300 Tokens, 39.18 Demo-Credits (1 je 1 000 Input, 2 je 1 000 Output; frei erfunden).

## Zustände

- Bassreihe: Schritte an bei 00:36.500, 00:36.880, 00:37.260, 00:37.640; Reload mit leerer Bassreihe 00:43.700; ergänzte Zeile 00:47.755; Reload 00:50.750, Vergleich 00:51.525, PASS 00:52.300.
- Export: Ansicht 01:58.680, nicht bereit 02:02.160, Ursache 02:03.654, Ergänzung 02:05.852, Vergleich 64 Schritte ab 02:06.410, bereit 02:07.960.
- Tabs: 01:33.461 −build · 01:34.361 +preview · 01:35.122 +export · 02:37.146 −docs · 02:37.920 +versions · 02:38.554 +settings · 03:22.686 −versions · 03:23.313 +presets · 03:23.870 +note.

## Einstellungen

| Shot | Start | Ende | Raum / Modus | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:09.180 | room / 3D | E001 | – |
| S002 | 00:09.180 | 00:13.140 | screen / 2D | E002 | L001 |
| S003 | 00:13.140 | 00:14.300 | desk / 3D | E003, E004, E005 | L002 |
| S004 | 00:14.300 | 00:21.000 | desk / 3D | – | – |
| S005 | 00:21.000 | 00:25.000 | screen / 2D | – | – |
| S006 | 00:25.000 | 00:28.560 | project / hybrid | – | – |
| S007 | 00:28.560 | 00:32.200 | desk / 3D | E006 | L003 |
| S008 | 00:32.200 | 00:35.700 | screen / 2D | – | L004 |
| S009 | 00:35.700 | 00:39.200 | screen / 2D | – | L005 |
| S010 | 00:39.200 | 00:42.800 | project / hybrid | – | L006 |
| S011 | 00:42.800 | 00:46.260 | screen / 2D | – | L007 |
| S012 | 00:46.260 | 00:49.820 | screen / 2D | – | L008 |
| S013 | 00:49.820 | 00:52.920 | project / 3D | – | L009 |
| S014 | 00:52.920 | 00:56.560 | desk / 3D | – | L010 |
| S015 | 00:56.560 | 01:03.040 | room / 3D | E007, E008 | – |
| S016 | 01:03.040 | 01:06.620 | screen / 2D | E009, E010 | L011 |
| S017 | 01:06.620 | 01:10.100 | desk / 3D | – | L012 |
| S018 | 01:10.100 | 01:13.700 | project / hybrid | – | L013 |
| S019 | 01:13.700 | 01:18.660 | screen / 2D | – | L014 |
| S020 | 01:18.660 | 01:22.560 | type / 2D | E011, E012, E013 | L015 |
| S021 | 01:22.560 | 01:25.740 | screen / 2D | – | L016 |
| S022 | 01:25.740 | 01:29.140 | type / hybrid | E014 | L017 |
| S023 | 01:29.140 | 01:32.700 | screen / 2D | – | L018, L019 |
| S024 | 01:32.700 | 01:36.160 | screen / 2D | – | L020 |
| S025 | 01:36.160 | 01:40.840 | desk / 3D | E015, E016 | L021 |
| S026 | 01:40.840 | 01:47.900 | project / 3D | E017 | – |
| S027 | 01:47.900 | 01:55.080 | screen / 2D | E018, E019 | – |
| S028 | 01:55.080 | 01:58.680 | room / 3D | E020, E021 | L022 |
| S029 | 01:58.680 | 02:02.160 | project / hybrid | – | L023, L024 |
| S030 | 02:02.160 | 02:05.480 | screen / 2D | – | L025 |
| S031 | 02:05.480 | 02:08.580 | screen / 2D | E022 | L026 |
| S032 | 02:08.580 | 02:12.100 | ledger / 2D | E023 | L027 |
| S033 | 02:12.100 | 02:15.960 | desk / 3D | E024 | L028 |
| S034 | 02:15.960 | 02:19.880 | screen / 2D | – | L029 |
| S035 | 02:19.880 | 02:22.260 | project / hybrid | E025 | L030 |
| S036 | 02:22.260 | 02:25.820 | type / 3D | E026, E027 | L031 |
| S037 | 02:25.820 | 02:29.420 | ledger / 2D | – | L032 |
| S038 | 02:29.420 | 02:32.600 | type / hybrid | – | – |
| S039 | 02:32.600 | 02:36.160 | screen / 2D | E028 | L033 |
| S040 | 02:36.160 | 02:39.680 | project / 3D | – | L034 |
| S041 | 02:39.680 | 02:44.280 | desk / 3D | E029 | L035 |
| S042 | 02:44.280 | 02:51.580 | room / 3D | E030, E031 | – |
| S043 | 02:51.580 | 02:55.120 | desk / 3D | E032 | L036 |
| S044 | 02:55.120 | 02:58.660 | screen / 2D | – | L037 |
| S045 | 02:58.660 | 03:02.220 | desk / hybrid | E033 | L038 |
| S046 | 03:02.220 | 03:08.460 | room / 3D | – | L039 |
| S047 | 03:08.460 | 03:11.680 | type / 2D | E034 | L040 |
| S048 | 03:11.680 | 03:15.180 | screen / 2D | – | L041 |
| S049 | 03:15.180 | 03:18.580 | type / hybrid | – | L042 |
| S050 | 03:18.580 | 03:22.060 | project / 3D | E035 | L043 |
| S051 | 03:22.060 | 03:25.540 | screen / 2D | – | L044 |
| S052 | 03:25.540 | 03:29.980 | desk / 3D | E036 | L045 |
| S053 | 03:29.980 | 03:35.600 | room / 3D | E037 | – |
| S054 | 03:35.600 | 03:43.260 | screen / 2D | E038, E039 | L046 |
| S055 | 03:43.260 | 03:47.840 | desk / hybrid | E040 | L047 |
| S056 | 03:47.840 | 03:54.000 | room / 3D | E041, E042, E043 | – |
| S057 | 03:54.000 | 04:00.000 | exterior / 3D | – | – |
| S058 | 04:00.000 | 04:05.934 | end / 2D | E044, E045, E046, E047 | – |
