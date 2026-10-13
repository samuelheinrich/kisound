# Token Burn EN — Umsetzung, Schnitt und Cues

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten ab Sample 0 der Original-WAV `Token Burn - EN.wav`; Fassung EN.

58 Einstellungen, 13 Kapitel, 6 TOKEN-BURN-Einsätze. Alle 47 Analyse-Events und 46 Lyric-Segmente sind genau einer Einstellung zugeordnet. Blende ab 244.8 s, Pegellücken 226.15–226.35 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Nur ein Regler | Ein heller Bildschirm in der Nacht, eine kleine Änderungsnotiz. |
| C02 | 00:45.240 | 01:00 | Der erste Build läuft; ein Bassregler und ein zweiter Klang kommen dazu. |
| C03 | 01:00.200 | Bassspur leer | Nach Reload fehlt die Bassreihe; eine Zeile im Ladepfad fehlt. |
| C04 | 01:10.660 | 02:00 | Derselbe Test besteht. Die Hand bleibt an der Tastatur. |
| C05 | 01:36.480 | Token Burn | Erster Refrain: Noch ein Prompt, ein Tab zu, zwei neue. |
| C06 | 01:57.000 | Der Stand von eben | Drei gespeicherte Projektstände und ein freier Platz. |
| C07 | 02:03.320 | 03:00 · Export | Der Export lässt die Bassspur weg; die Reparatur prüft 64 Schritte. |
| C08 | 02:19.420 | Nutzungsjournal | Input, Output, Summe und fiktive Demo-Credits je Auftrag. |
| C09 | 02:29.620 | Noch ein Prompt | Zweiter Refrain: Die Schrift wird räumlich. |
| C10 | 02:53.080 | Kalter Kaffee | Das Fenster wird hell, die Antwort wird gelesen. |
| C11 | 03:18.560 | Tageslicht | Dritter Refrain im Morgenlicht, alles hat dieselbe Version. |
| C12 | 03:45.640 | Preset speichern | Der nächste Auftrag wird abgesendet und läuft weiter. |
| C13 | 03:54.340 | Morgen | Zurück durch das Fenster; der Cursor bleibt. |

## TOKEN BURN

| Hook | Shot | Stimme ab | Sichtbar mindestens bis |
| --- | --- | --- | --- |
| H01 | S020 | 01:36.480 | 01:37.830 |
| H02 | S022 | 01:43.520 | 01:45.590 |
| H03 | S036 | 02:33.000 | 02:34.300 |
| H04 | S038 | 02:39.800 | 02:41.250 |
| H05 | S047 | 03:18.560 | 03:19.860 |
| H06 | S049 | 03:25.580 | 03:26.880 |

## Aufträge (fiktives Demo-Szenario)

| Auftrag | Text | getippt | gesendet | fertig | Version | Input | Output |
| --- | --- | --- | --- | --- | --- | ---: | ---: |
| P01 | Add a level slider to the kick lane. | 00:15.135 | 00:20.300 | 00:45.490 | v0.4 | 1240 | 360 |
| P02 | Add a bass slider and a second lane. Save the pattern and restore it after reload. | 00:56.780 | 00:58.824 | 01:09.964 | v0.5 | 2360 | 640 |
| P03 | Compare the project states, add the next view. | 01:21.420 | 01:21.920 | 01:49.056 | v0.6 | 3180 | 820 |
| P04 | Export with all four pattern rows. | 01:55.803 | 01:56.601 | 02:18.712 | v0.7 | 4600 | 1400 |
| P05 | Persist the extra UI settings. | 02:29.770 | 02:31.141 | 02:44.742 | v0.8 | 6240 | 1760 |
| P06 | Save a preset | 03:46.040 | 03:53.130 | läuft | v0.9 | 7800 | 1900 |

Nutzung am Ende: 25420 Input + 6880 Output = 32300 Tokens, 39.18 Demo-Credits (1 je 1 000 Input, 2 je 1 000 Output; frei erfunden).

## Zustände

- Bassreihe: Schritte an bei 00:53.660, 00:54.040, 00:54.420, 00:54.800; Reload mit leerer Bassreihe 01:01.100; ergänzte Zeile 01:05.127; Reload 01:08.224, Vergleich 01:09.094, PASS 01:09.964.
- Export: Ansicht 02:08.880, FAILED 02:12.400, Ursache 02:13.966, Ergänzung 02:16.305, Vergleich 64 Schritte ab 02:16.942, bereit 02:18.712.
- Tabs: 01:51.594 −build · 01:52.510 +preview · 01:53.284 +export · 02:47.930 −docs · 02:48.740 +versions · 02:49.402 +settings · 03:33.072 −versions · 03:33.723 +presets · 03:34.302 +note.

## Einstellungen

| Shot | Start | Ende | Raum / Modus | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:12.680 | room / 3D | E001, E002, E003 | – |
| S002 | 00:12.680 | 00:16.640 | screen / 2D | E004, E005 | L001 |
| S003 | 00:16.640 | 00:17.900 | desk / 3D | E006 | L002 |
| S004 | 00:17.900 | 00:28.000 | desk / 3D | – | – |
| S005 | 00:28.000 | 00:38.500 | screen / 2D | – | – |
| S006 | 00:38.500 | 00:45.240 | project / hybrid | E007 | – |
| S007 | 00:45.240 | 00:49.540 | desk / 3D | E008 | L003 |
| S008 | 00:49.540 | 00:52.860 | screen / 2D | – | L004 |
| S009 | 00:52.860 | 00:56.580 | screen / 2D | – | L005 |
| S010 | 00:56.580 | 01:00.200 | project / hybrid | – | L006 |
| S011 | 01:00.200 | 01:03.640 | screen / 2D | – | L007 |
| S012 | 01:03.640 | 01:07.180 | screen / 2D | – | L008 |
| S013 | 01:07.180 | 01:10.660 | project / 3D | – | L009 |
| S014 | 01:10.660 | 01:14.500 | desk / 3D | E009 | L010 |
| S015 | 01:14.500 | 01:21.320 | room / 3D | E010 | – |
| S016 | 01:21.320 | 01:24.820 | screen / 2D | E011 | L011 |
| S017 | 01:24.820 | 01:28.300 | desk / 3D | – | L012 |
| S018 | 01:28.300 | 01:31.880 | project / hybrid | – | L013 |
| S019 | 01:31.880 | 01:36.480 | screen / 2D | – | L014 |
| S020 | 01:36.480 | 01:39.860 | type / 2D | E012, E013 | L015 |
| S021 | 01:39.860 | 01:43.520 | screen / 2D | E014 | L016 |
| S022 | 01:43.520 | 01:46.900 | type / hybrid | – | L017 |
| S023 | 01:46.900 | 01:50.820 | screen / 2D | – | L018 |
| S024 | 01:50.820 | 01:54.340 | screen / 2D | – | L019 |
| S025 | 01:54.340 | 01:57.000 | desk / 3D | E015 | L020 |
| S026 | 01:57.000 | 02:00.100 | project / 3D | E016, E017 | – |
| S027 | 02:00.100 | 02:03.320 | screen / 2D | – | – |
| S028 | 02:03.320 | 02:08.880 | room / 3D | E018 | L021 |
| S029 | 02:08.880 | 02:12.400 | project / hybrid | E019 | L022 |
| S030 | 02:12.400 | 02:15.880 | screen / 2D | E020 | L023 |
| S031 | 02:15.880 | 02:19.420 | screen / 2D | – | L024 |
| S032 | 02:19.420 | 02:22.940 | ledger / 2D | E021 | L025 |
| S033 | 02:22.940 | 02:26.480 | desk / 3D | – | L026 |
| S034 | 02:26.480 | 02:29.620 | screen / 2D | – | L027 |
| S035 | 02:29.620 | 02:33.000 | project / hybrid | E022 | L028 |
| S036 | 02:33.000 | 02:36.140 | type / 3D | E023, E024 | L029 |
| S037 | 02:36.140 | 02:39.800 | ledger / 2D | E025 | L030 |
| S038 | 02:39.800 | 02:43.180 | type / hybrid | – | L031 |
| S039 | 02:43.180 | 02:46.900 | screen / 2D | – | L032 |
| S040 | 02:46.900 | 02:50.580 | project / 3D | E026 | L033 |
| S041 | 02:50.580 | 02:53.080 | desk / 3D | E027 | L034 |
| S042 | 02:53.080 | 03:02.300 | room / 3D | E028, E029, E030 | – |
| S043 | 03:02.300 | 03:05.660 | desk / 3D | E031 | L035 |
| S044 | 03:05.660 | 03:08.980 | screen / 2D | – | L036 |
| S045 | 03:08.980 | 03:12.480 | desk / hybrid | E032 | L037 |
| S046 | 03:12.480 | 03:18.560 | room / 3D | E033 | L038 |
| S047 | 03:18.560 | 03:21.700 | type / 2D | E034, E035 | L039 |
| S048 | 03:21.700 | 03:25.580 | screen / 2D | – | L040 |
| S049 | 03:25.580 | 03:28.680 | type / hybrid | – | L041 |
| S050 | 03:28.680 | 03:32.420 | project / 3D | E036 | L042 |
| S051 | 03:32.420 | 03:36.040 | screen / 2D | – | L043 |
| S052 | 03:36.040 | 03:38.420 | desk / 3D | – | L044 |
| S053 | 03:38.420 | 03:45.640 | room / 3D | E037 | – |
| S054 | 03:45.640 | 03:52.580 | screen / 2D | E038, E039, E040, E041 | L045 |
| S055 | 03:52.580 | 03:54.340 | desk / hybrid | – | L046 |
| S056 | 03:54.340 | 03:59.300 | room / 3D | E042, E043, E044 | – |
| S057 | 03:59.300 | 04:04.800 | exterior / 3D | – | – |
| S058 | 04:04.800 | 04:10.800 | end / 2D | E045, E046, E047 | – |
