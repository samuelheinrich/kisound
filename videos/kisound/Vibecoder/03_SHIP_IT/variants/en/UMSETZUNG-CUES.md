# SHIP IT EN — Umsetzung, Schnitt und Cues

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten ab Sample 0 der Original-WAV `03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav`; Fassung EN.

34 Einstellungen, 13 Kapitel, 10 Titelmomente (9 mit ASR-Anker). Alle 52 Analyse-Events und 54 Lyric-Segmente sind genau einer Einstellung zugeordnet. Blende ab 120.08 s (Ende der letzten Stimme), Pegellücken 1.1–1.3, 1.5–1.7, 2–2.1, 2.4–2.6, 2.8–3, 3.3–3.4, 11.9–12, 13.9–14.1, 49.9–50.1, 65.4–65.6, 68.8–69, 83.9–84, 95.5–95.8, 96.6–96.9, 97–97.3, 104.9–105, 113.7–114, 119.2–119.6 s, Sub-Bass-Einsätze 71.35, 84.95, 98.65, 105.45, 113.95 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Der Release wartet | Nacht am Rechner, fünf dunkle Stationen auf der Release-Schiene. |
| C02 | 00:00.900 | COMMIT IT. SHIP IT. | Die Titelmarke und Album drei als ungeöffnete Karte. |
| C03 | 00:10.680 | npm run build | Tracks, Cover, Audio und Lyrics liegen bereit; der Build besteht. |
| C04 | 00:20.920 | Ein Unterstrich zu viel | Der Check findet genau ein fehlendes Cover; ein Zeichen ist zu viel. |
| C05 | 00:30.540 | Null Fehler | Derselbe Check besteht; erst jetzt entsteht der Release-Commit. |
| C06 | 00:33.960 | Build. Check. Live. | Erster Refrain: LIVE ist noch ein Ausblick. |
| C07 | 00:48.380 | Deploy | Cover, Audio und Texte werden hochgeladen und gezählt. |
| C08 | 00:55.020 | Harter Reload | Der Browser zeigt den alten Stand, bis der Cache umgangen wird. |
| C09 | 01:01.680 | DE und EN | Beide Sprachen geprüft; die Lyrics bleiben im Original. |
| C10 | 01:10.020 | Link und Play | Zweiter Refrain: LIVE ist echt, der Link geht raus. |
| C11 | 01:23.000 | Bridge | Tracks, Covers, Build, Check, Deploy, Reload, Play. |
| C12 | 01:30.700 | Die ganze Kette | Schlussrefrain: der Release als eine Bewegung. |
| C13 | 01:47.740 | Nächster Commit | Der Release bleibt fertig, die nächste Aufgabe ist offen. |

## COMMIT IT. SHIP IT.

| Titel | Shot | ab | lesbar bis | dritte Zeile | Anker |
| --- | --- | --- | --- | --- | --- |
| H01 | S002 | 00:00.900 | 00:06.800 | BUILD. CHECK. LIVE. | ASR (Hörprüfung offen) |
| H02 | S002 | 00:06.960 | 00:10.500 | ALBUM THREE | ASR (Hörprüfung offen) |
| H03 | S010 | 00:33.960 | 00:36.200 | BUILD. CHECK. LIVE. | ASR (Hörprüfung offen) |
| H04 | S012 | 00:37.400 | 00:39.800 | ALBUM THREE | ASR (Hörprüfung offen) |
| H05 | S022 | 01:10.020 | 01:13.300 | BUILD. CHECK. LIVE. | ASR (Hörprüfung offen) |
| H06 | S023 | 01:13.460 | 01:14.900 | ALBUM THREE | ASR (Hörprüfung offen) |
| T03 | S024 | 01:17.780 | 01:20.700 | ALBUM THREE | redaktionell |
| H07 | S030 | 01:30.700 | 01:32.000 | BUILD. CHECK. LIVE. | ASR (Hörprüfung offen) |
| H08 | S031 | 01:34.020 | 01:36.480 | ALBUM THREE | ASR (Hörprüfung offen) |
| H09 | S033 | 01:47.740 | 01:49.000 | – | ASR (Hörprüfung offen) |

## Release-Ablauf (redaktionelles Szenario)

| Zeit | Ereignis |
| --- | --- |
| 00:11.680 | TRACKS bereit |
| 00:18.200 | Enter: npm run build |
| 00:20.168 | BUILD PASS |
| 00:21.570 | Enter: npm run check |
| 00:22.370 | CHECK FAIL · 1 Fehler (Cover fehlt) |
| 00:27.860 | Unterstrich leuchtet |
| 00:29.229 | Enter: mv … (zurückbenannt) |
| 00:29.379 | Referenz = Datei |
| 00:30.890 | Enter: derselbe Check |
| 00:31.690 | CHECK PASS · 0 Fehler |
| 00:32.797 | Enter: git commit |
| 00:33.017 | Release-Commit |
| 00:48.800 | Enter: npm run deploy -- --live |
| 00:54.328 | Upload fertig (Cover, Audio, Texte) |
| 00:55.570 | normaler Reload: alter Stand (Cache) |
| 00:58.350 | harter Reload |
| 00:58.700 | Album drei im Browser |
| 01:02.730 | DE geprüft |
| 01:03.360 | Sprachschalter EN |
| 01:04.620 | EN geprüft |
| 01:07.358 | Lyrics unverändert |
| 01:09.052 | LIVE PASS |
| 01:21.100 | Link kopiert |
| 01:21.850 | Play |
| 01:48.190 | Notiz: nächstes Album, nächster Commit |

Upload: Cover 6, Audio 12, Texte 12 Dateien. Datei im Ordner `05_Hallucination__cover.png`, Referenz `05_Hallucination_cover.png`.

## Bridge

01:24.480 Tracks. · 01:26.080 Covers. · 01:26.400 Build. · 01:27.200 Check. · 01:27.960 Deploy. · 01:28.960 Reload. · 01:29.740 Play. (ASR-Wortanfänge)

## Einstellungen

| Shot | Start | Ende | Raum / Modus | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:00.900 | room / 3D | E001 | L001 |
| S002 | 00:00.900 | 00:10.680 | type / 2D | E002, E003, E004, E005 | L002 |
| S003 | 00:10.680 | 00:14.080 | desk / 3D | E006, E007 | L003, L004 |
| S004 | 00:14.080 | 00:17.500 | screen / 2D | E008, E009, E010 | L005 |
| S005 | 00:17.500 | 00:20.920 | screen / 2D | – | L006 |
| S006 | 00:20.920 | 00:25.200 | screen / 2D | E011 | L007, L008 |
| S007 | 00:25.200 | 00:27.560 | screen / 2D | – | L009 |
| S008 | 00:27.560 | 00:30.540 | screen / 2D | E012 | L010 |
| S009 | 00:30.540 | 00:33.960 | project / hybrid | E013, E014 | L011 |
| S010 | 00:33.960 | 00:35.000 | type / 2D | E015 | L012 |
| S011 | 00:35.000 | 00:37.400 | project / 3D | E016 | L013 |
| S012 | 00:37.400 | 00:39.920 | type / hybrid | – | L014, L015 |
| S013 | 00:39.920 | 00:44.040 | screen / 2D | E017 | L016, L017 |
| S014 | 00:44.040 | 00:45.380 | room / 3D | – | L018 |
| S015 | 00:45.380 | 00:48.380 | screen / 2D | E018, E019 | L019 |
| S016 | 00:48.380 | 00:51.560 | project / 3D | E020, E021 | L020 |
| S017 | 00:51.560 | 00:55.020 | screen / 2D | E022 | L021 |
| S018 | 00:55.020 | 00:57.600 | screen / 2D | – | L022 |
| S019 | 00:57.600 | 01:01.680 | screen / 2D | E023, E024, E025 | L023 |
| S020 | 01:01.680 | 01:05.180 | screen / 2D | E026 | L024 |
| S021 | 01:05.180 | 01:10.020 | screen / 2D | E027, E028 | L025 |
| S022 | 01:10.020 | 01:13.460 | type / 2D | E029, E030 | L026 |
| S023 | 01:13.460 | 01:17.780 | project / 3D | – | L027, L028, L029 |
| S024 | 01:17.780 | 01:20.880 | type / hybrid | E031 | L030 |
| S025 | 01:20.880 | 01:21.500 | screen / 2D | – | – |
| S026 | 01:21.500 | 01:23.000 | screen / 2D | E032 | – |
| S027 | 01:23.000 | 01:26.400 | project / hybrid | E033, E034, E035 | L031, L032, L033 |
| S028 | 01:26.400 | 01:27.960 | project / 3D | – | L034, L035, L036, L037 |
| S029 | 01:27.960 | 01:30.700 | project / 3D | E036 | L038, L039, L040, L041, L042, L043 |
| S030 | 01:30.700 | 01:34.020 | room / 3D | E037 | L044, L045 |
| S031 | 01:34.020 | 01:36.480 | type / hybrid | E038 | L046, L047, L048 |
| S032 | 01:36.480 | 01:47.740 | screen / 2D | E039, E040, E041, E042 | L049, L050, L051 |
| S033 | 01:47.740 | 01:53.600 | desk / 3D | E043, E044, E045 | L052, L053 |
| S034 | 01:53.600 | 02:00.680 | end / 3D | E046, E047, E048, E049, E050, E051, E052 | L054 |
