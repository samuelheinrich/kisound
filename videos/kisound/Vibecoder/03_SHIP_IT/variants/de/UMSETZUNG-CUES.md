# SHIP IT DE — Umsetzung, Schnitt und Cues

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten ab Sample 0 der Original-WAV `03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav`; Fassung DE.

34 Einstellungen, 13 Kapitel, 8 Titelmomente (4 mit ASR-Anker). Alle 37 Analyse-Events und 39 Lyric-Segmente sind genau einer Einstellung zugeordnet. Blende ab 154 s (Ende der letzten Stimme), Pegellücken 62.8–62.9, 65.2–65.3 s, Sub-Bass-Einsätze 113.35, 140.55 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Der Release wartet | Nacht am Rechner, fünf dunkle Stationen auf der Release-Schiene. |
| C02 | 00:08.360 | COMMIT IT. SHIP IT. | Die Titelmarke und Album drei als ungeöffnete Karte. |
| C03 | 00:22.140 | npm run build | Tracks, Cover, Audio und Lyrics liegen bereit; der Build besteht. |
| C04 | 00:33.760 | Ein Unterstrich zu viel | Der Check findet genau ein fehlendes Cover; ein Zeichen ist zu viel. |
| C05 | 00:46.500 | Null Fehler | Derselbe Check besteht; erst jetzt entsteht der Release-Commit. |
| C06 | 00:51.320 | Build. Check. Live. | Erster Refrain: LIVE ist noch ein Ausblick. |
| C07 | 01:18.660 | Deploy | Cover, Audio und Texte werden hochgeladen und gezählt. |
| C08 | 01:25.200 | Harter Reload | Der Browser zeigt den alten Stand, bis der Cache umgangen wird. |
| C09 | 01:32.260 | DE und EN | Beide Sprachen geprüft; die Lyrics bleiben im Original. |
| C10 | 01:38.780 | Link und Play | Zweiter Refrain: LIVE ist echt, der Link geht raus. |
| C11 | 01:53.000 | Bridge | Tracks, Covers, Build, Check, Deploy, Reload, Play. |
| C12 | 02:06.000 | Die ganze Kette | Schlussrefrain: der Release als eine Bewegung. |
| C13 | 02:30.600 | Nächster Commit | Der Release bleibt fertig, die nächste Aufgabe ist offen. |

## COMMIT IT. SHIP IT.

| Titel | Shot | ab | lesbar bis | dritte Zeile | Anker |
| --- | --- | --- | --- | --- | --- |
| T01 | S002 | 00:08.360 | 00:22.000 | ALBUM DREI GEHT RAUS | redaktionell |
| H01 | S010 | 00:51.320 | 00:55.000 | BUILD. CHECK. LIVE. | ASR (Hörprüfung offen) |
| H02 | S011 | 00:55.120 | 00:56.900 | ALBUM DREI | ASR (Hörprüfung offen) |
| T02 | S012 | 00:58.340 | 01:01.200 | ALBUM DREI | redaktionell |
| H03 | S022 | 01:38.780 | 01:42.800 | BUILD. CHECK. LIVE. | ASR (Hörprüfung offen) |
| H04 | S023 | 01:42.920 | 01:44.300 | ALBUM DREI | ASR (Hörprüfung offen) |
| T03 | S024 | 01:45.620 | 01:48.900 | ALBUM DREI | redaktionell |
| T04 | S031 | 02:17.500 | 02:20.280 | BUILD. CHECK. LIVE. | redaktionell |

## Release-Ablauf (redaktionelles Szenario)

| Zeit | Ereignis |
| --- | --- |
| 00:23.140 | TRACKS bereit |
| 00:30.960 | Enter: npm run build |
| 00:32.990 | BUILD PASS |
| 00:34.410 | Enter: npm run check |
| 00:35.210 | CHECK FAIL · 1 Fehler (Cover fehlt) |
| 00:40.680 | Unterstrich leuchtet |
| 00:43.807 | Enter: mv … (zurückbenannt) |
| 00:43.957 | Referenz = Datei |
| 00:46.850 | Enter: derselbe Check |
| 00:47.650 | CHECK PASS · 0 Fehler |
| 00:49.681 | Enter: git commit |
| 00:49.901 | Release-Commit |
| 01:19.080 | Enter: npm run deploy -- --live |
| 01:24.548 | Upload fertig (Cover, Audio, Texte) |
| 01:25.750 | normaler Reload: alter Stand (Cache) |
| 01:29.450 | harter Reload |
| 01:29.800 | Album drei im Browser |
| 01:33.196 | DE geprüft |
| 01:33.758 | Sprachschalter EN |
| 01:34.881 | EN geprüft |
| 01:36.910 | Lyrics unverändert |
| 01:38.100 | LIVE PASS |
| 01:49.360 | Link kopiert |
| 01:51.070 | Play |
| 02:31.050 | Notiz: nächstes Album, nächster Commit |

Upload: Cover 6, Audio 12, Texte 12 Dateien. Datei im Ordner `05_Hallucination__cover.png`, Referenz `05_Hallucination_cover.png`.

## Bridge

01:53.000 Tracks. · 01:53.680 Covers. · 01:56.100 Build. · 01:58.190 Check. · 02:00.280 Deploy. · 02:02.282 Reload. · 02:03.826 Play. · 02:05.142 Album drei. (Tracks/Covers ASR, übrige Karten redaktionell an den Schnitten)

## Einstellungen

| Shot | Start | Ende | Raum / Modus | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:08.360 | room / 3D | E001, E002, E003 | – |
| S002 | 00:08.360 | 00:22.140 | type / 2D | E004 | L001 |
| S003 | 00:22.140 | 00:27.160 | desk / 3D | E005 | L002 |
| S004 | 00:27.160 | 00:30.260 | screen / 2D | E006 | L003 |
| S005 | 00:30.260 | 00:33.760 | screen / 2D | – | L004 |
| S006 | 00:33.760 | 00:36.940 | screen / 2D | E007 | L005 |
| S007 | 00:36.940 | 00:40.380 | screen / 2D | – | L006 |
| S008 | 00:40.380 | 00:46.500 | screen / 2D | E008 | L007 |
| S009 | 00:46.500 | 00:51.320 | project / hybrid | E009 | L008 |
| S010 | 00:51.320 | 00:55.120 | type / 2D | E010, E011 | L009 |
| S011 | 00:55.120 | 00:58.340 | project / 3D | – | L010, L011 |
| S012 | 00:58.340 | 01:01.440 | type / hybrid | – | L012 |
| S013 | 01:01.440 | 01:07.000 | screen / 2D | E012, E013, E014 | L013 |
| S014 | 01:07.000 | 01:12.000 | room / 3D | – | L014, L015 |
| S015 | 01:12.000 | 01:18.660 | screen / 2D | E015, E016 | L016, L017, L018 |
| S016 | 01:18.660 | 01:21.940 | project / 3D | E017 | L019 |
| S017 | 01:21.940 | 01:25.200 | screen / 2D | – | L020 |
| S018 | 01:25.200 | 01:28.700 | screen / 2D | E018 | L021 |
| S019 | 01:28.700 | 01:32.260 | screen / 2D | E019 | L022, L023 |
| S020 | 01:32.260 | 01:35.380 | screen / 2D | E020 | L024 |
| S021 | 01:35.380 | 01:38.780 | screen / 2D | – | L025 |
| S022 | 01:38.780 | 01:42.920 | type / 2D | E021, E022 | L026 |
| S023 | 01:42.920 | 01:45.620 | project / 3D | – | L027 |
| S024 | 01:45.620 | 01:49.140 | type / hybrid | E023 | L028 |
| S025 | 01:49.140 | 01:50.720 | screen / 2D | – | L029 |
| S026 | 01:50.720 | 01:53.000 | screen / 2D | E024 | L030 |
| S027 | 01:53.000 | 01:56.100 | project / hybrid | E025, E026 | L031, L032, L033 |
| S028 | 01:56.100 | 02:00.280 | project / 3D | – | L034 |
| S029 | 02:00.280 | 02:06.000 | project / 3D | E027 | L035, L036 |
| S030 | 02:06.000 | 02:17.500 | room / 3D | E028, E029 | – |
| S031 | 02:17.500 | 02:20.280 | type / hybrid | E030 | L037 |
| S032 | 02:20.280 | 02:30.600 | screen / 2D | E031, E032 | – |
| S033 | 02:30.600 | 02:34.000 | desk / 3D | E033, E034 | L038, L039 |
| S034 | 02:34.000 | 02:35.960 | end / 3D | E035, E036, E037 | – |
