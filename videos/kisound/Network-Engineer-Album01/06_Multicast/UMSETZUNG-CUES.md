# Multicast — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV.
Stadion: 288 Empfänger in 28 Segmenten. 100 Einstellungen, 17 Kapitel, 22 POV-Fahrten zu verschiedenen Sitzen. Alle 53 Analyse-Events und 63 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Drops (100-ms-Zeilen, Sub-Band springt von ~0 auf >0,5): 31,35 · 81,85 · 96,25 · 110,65 · 135,75 · 164,35 · 182,25 · 210,75 · 230,45 s. Schlussblende ab 258,4 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Eine Quelle | Bühne und leere Reihen öffnen; Titel über dem ruhigen Quellpuls. |
| C02 | 00:11.380 | Register / leere Reihen | Quelle sendet; R1 registriert beim RP; ohne Empfänger Register-Stop, Pakete enden an R1. |
| C03 | 00:24.040 | Erster Empfänger | Ein Host meldet sich; (*,G)-Join zum RP, (S,G)-Join zur Quelle; erster Strom auf dem Drop. |
| C04 | 00:38.280 | Unicast · Anycast · Multicast | Drei Zustellarten getrennt: drei Kopien, nächste Instanz, eine replizierte Kopie. |
| C05 | 00:58.740 | Tune into the stream | Weitere Sitze treten bei; der Baum wächst nur zu ihnen. |
| C06 | 01:07.580 | IGMP / Snooping / Querier | Report, Snooping-Eintrag, General Query und Antworten im Access-Segment. |
| C07 | 01:21.480 | Join the group | Chorus-Welle neuer Mitglieder; eine Kopie pro Link, viele Empfänger. |
| C08 | 01:36.380 | Replikation | Ein Paket verzweigt an jedem Replikationspunkt. |
| C09 | 01:49.760 | PIM-SM / RP | PIM-Nachbarn, RP kennt die Quelle, Join steigt zum Core, neuer Ast wächst. |
| C10 | 02:08.580 | Hook | Report, Join, Leave, Query, Group, Source, RP, PIM, IGMP als schnelle Schläge. |
| C11 | 02:15.700 | SPT-Switchover | R3 wechselt auf den kürzesten Pfad zur Quelle; RP-Ast für S wird gepruned. |
| C12 | 02:29.000 | No flood for the silent | Flooding ohne Snooping gegen selektive Ports; von Access bis Core; viele Türen. |
| C13 | 02:46.720 | Final Chorus | Vogelperspektive über die lebendige Gemeinschaft. |
| C14 | 03:02.250 | Replikation II | Paketverfolgung und periodische Queries. |
| C15 | 03:17.180 | Querier / RP | Querier fragt, Mitglieder antworten, RP erinnert sich an die Quelle. |
| C16 | 03:30.750 | Totale | Weite Totale, an- und abmeldende Plätze; der stille Ast bleibt dunkel. |
| C17 | 04:09.200 | Finale | Schlusstitel; Queries laufen bis zum tatsächlichen Endabfall weiter. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:07.731 | arena / opening | intro | – | E001, E002, E003, E004 | – |
| S002 | 00:07.731 | 00:11.380 | arena / stands | intro | – | E005 | – |
| S003 | 00:11.380 | 00:13.840 | arena / source | register | – | E006 | L001 |
| S004 | 00:13.840 | 00:17.240 | arena / stands | register | – | – | L002 |
| S005 | 00:17.240 | 00:20.700 | arena / gate | register | – | – | L003 |
| S006 | 00:20.700 | 00:24.040 | arena / rise | register | – | E007, E008 | L004 |
| S007 | 00:24.040 | 00:27.200 | segment / host | firstjoin | 2 | E009 | – |
| S008 | 00:27.200 | 00:29.600 | arena / climb | firstjoin | 10.1.3.13 (lower, R2) | – | – |
| S009 | 00:29.600 | 00:31.300 | arena / core | firstjoin | – | – | – |
| S010 | 00:31.300 | 00:34.000 | arena / ride | firstjoin | 10.1.3.13 (lower, R2) | E010 | – |
| S011 | 00:34.000 | 00:35.900 | arena / seat | stream | 10.1.3.13 (lower, R2) | – | – |
| S012 | 00:35.900 | 00:38.280 | arena / orbit | stream | – | – | – |
| S013 | 00:38.280 | 00:41.860 | compare / wide | unicast | – | E011 | L005, L006 |
| S014 | 00:41.860 | 00:45.520 | compare / source | unicast | – | E012 | – |
| S015 | 00:45.520 | 00:48.440 | compare / wide | anycast | – | – | L007, L008 |
| S016 | 00:48.440 | 00:51.360 | compare / path | anycast | – | – | – |
| S017 | 00:51.360 | 00:54.100 | compare / wide | multicast | – | – | L009 |
| S018 | 00:54.100 | 00:58.740 | compare / branch | multicast | – | E013 | L010 |
| S019 | 00:58.740 | 01:01.340 | arena / bird | stream | – | – | L011 |
| S020 | 01:01.340 | 01:04.000 | arena / chase | stream | 10.1.24.17 (upper, R5) | – | L012 |
| S021 | 01:04.000 | 01:06.700 | arena / stands | stream | – | – | – |
| S022 | 01:06.700 | 01:07.580 | arena / rise | stream | – | E014 | – |
| S023 | 01:07.580 | 01:09.200 | segment / host | igmp-report | 6 | E015 | L013 |
| S024 | 01:09.200 | 01:10.340 | segment / switch | igmp-report | – | – | L014 |
| S025 | 01:10.340 | 01:12.300 | segment / ports | snooping | – | – | L015 |
| S026 | 01:12.300 | 01:15.100 | segment / wide | snooping | – | – | L016 |
| S027 | 01:15.100 | 01:17.780 | segment / uplink | igmp-query | – | – | L017, L018 |
| S028 | 01:17.780 | 01:19.840 | segment / wide | igmp-query | – | – | L019, L020 |
| S029 | 01:19.840 | 01:21.480 | arena / source | stream | – | E016 | – |
| S030 | 01:21.480 | 01:24.840 | arena / rise | chorus | – | E017, E018, E019 | L021, L022 |
| S031 | 01:24.840 | 01:27.440 | arena / flyby | chorus | 10.1.3.16 (lower, R2) | – | L023 |
| S032 | 01:27.440 | 01:29.600 | arena / bird | count | – | – | L024 |
| S033 | 01:29.600 | 01:31.100 | arena / chase | chorus | 10.1.25.21 (field, R2) | – | L025 |
| S034 | 01:31.100 | 01:33.940 | arena / orbit | chorus | – | E020 | L026 |
| S035 | 01:33.940 | 01:36.250 | arena / reverse | chorus | – | – | L027 |
| S036 | 01:36.250 | 01:39.800 | arena / chase | replicate | 10.1.4.15 (upper, R2) | E021, E022 | – |
| S037 | 01:39.800 | 01:43.360 | arena / branch | replicate | R2 | – | – |
| S038 | 01:43.360 | 01:46.500 | arena / stands | calm | – | – | – |
| S039 | 01:46.500 | 01:49.760 | arena / bird | calm | – | E023 | – |
| S040 | 01:49.760 | 01:53.860 | arena / core | pim-hello | – | E024, E025 | L028, L029 |
| S041 | 01:53.860 | 01:57.180 | arena / rp | rp-source | – | – | L030, L031 |
| S042 | 01:57.180 | 01:59.400 | arena / climb | pim-join | 10.1.16.13 (upper, R4) | – | L032, L033 |
| S043 | 01:59.400 | 02:01.000 | arena / grow | tree | – | – | – |
| S044 | 02:01.000 | 02:03.100 | arena / branch | tree | R3 | – | L034, L035 |
| S045 | 02:03.100 | 02:06.400 | arena / ride | tree | 10.1.16.13 (upper, R4) | E026 | – |
| S046 | 02:06.400 | 02:08.580 | arena / segment | tree | S17 | – | – |
| S047 | 02:08.580 | 02:09.820 | arena / seat | hook | 10.1.5.12 (lower, R2) | E027 | L036 |
| S048 | 02:09.820 | 02:10.100 | arena / seat | hook | 10.1.1.18 (lower, R2) | – | L037 |
| S049 | 02:10.100 | 02:10.740 | arena / seat | hook | 10.1.2.14 (upper, R2) | – | L038 |
| S050 | 02:10.740 | 02:11.220 | arena / segment | hook | 10.1.2.14 (upper, R2) | – | L039 |
| S051 | 02:11.220 | 02:11.580 | arena / bird | hook | – | – | L040 |
| S052 | 02:11.580 | 02:12.120 | arena / source | hook | – | – | L041 |
| S053 | 02:12.120 | 02:12.540 | arena / rp | hook | – | – | L042 |
| S054 | 02:12.540 | 02:13.580 | arena / core | hook | – | – | L043 |
| S055 | 02:13.580 | 02:15.700 | arena / rise | hook | – | E028, E029, E030 | L044 |
| S056 | 02:15.700 | 02:17.600 | arena / core | spt | – | – | – |
| S057 | 02:17.600 | 02:20.300 | arena / ride | spt | 10.1.16.20 (upper, R4) | – | – |
| S058 | 02:20.300 | 02:22.500 | arena / orbit | stream | – | – | – |
| S059 | 02:22.500 | 02:25.300 | arena / flyby | stream | 10.1.11.17 (lower, R3) | – | – |
| S060 | 02:25.300 | 02:27.060 | arena / bird | stream | – | – | – |
| S061 | 02:27.060 | 02:29.000 | arena / chase | stream | 10.1.27.11 (field, R4) | – | – |
| S062 | 02:29.000 | 02:31.360 | segment / wide | flood | – | E031 | L045 |
| S063 | 02:31.360 | 02:33.060 | segment / ports | snoop-on | – | – | L046 |
| S064 | 02:33.060 | 02:34.800 | segment / host | snoop-on | 9 | – | L047 |
| S065 | 02:34.800 | 02:36.380 | segment / switch | snoop-on | – | – | L048 |
| S066 | 02:36.380 | 02:40.180 | arena / ascend | layers | 10.1.3.20 (lower, R2) | – | L049, L050 |
| S067 | 02:40.180 | 02:46.720 | arena / reveal | doors | – | E032 | L051, L052 |
| S068 | 02:46.720 | 02:48.900 | arena / bird | chorus | – | E033, E034 | L053, L054 |
| S069 | 02:48.900 | 02:50.940 | arena / ride | chorus | 10.1.12.14 (upper, R3) | – | – |
| S070 | 02:50.940 | 02:53.400 | arena / flyby | chorus | 10.1.21.15 (lower, R5) | E035 | L055 |
| S071 | 02:53.400 | 02:55.500 | arena / total | count | – | E036 | L056 |
| S072 | 02:55.500 | 02:57.060 | arena / chase | chorus | 10.1.22.16 (upper, R5) | E037 | L057 |
| S073 | 02:57.060 | 03:00.040 | arena / orbit | chorus | – | – | L058 |
| S074 | 03:00.040 | 03:02.250 | arena / reverse | chorus | – | E038, E039 | L059 |
| S075 | 03:02.250 | 03:05.500 | arena / ride | replicate | 10.1.6.18 (upper, R2) | E040 | – |
| S076 | 03:05.500 | 03:07.200 | arena / rise | stream | – | – | – |
| S077 | 03:07.200 | 03:08.800 | arena / flyby | stream | 10.1.14.14 (upper, R4) | – | – |
| S078 | 03:08.800 | 03:10.640 | arena / stands | stream | – | – | – |
| S079 | 03:10.640 | 03:13.300 | arena / bird | query | – | E041 | – |
| S080 | 03:13.300 | 03:15.400 | arena / chase | stream | 10.1.13.19 (lower, R4) | – | – |
| S081 | 03:15.400 | 03:17.180 | arena / orbit | stream | – | – | – |
| S082 | 03:17.180 | 03:19.500 | arena / querier | outro-query | R7 | E042, E043, E044 | L060 |
| S083 | 03:19.500 | 03:22.700 | arena / stands | outro-query | – | – | L061 |
| S084 | 03:22.700 | 03:26.520 | arena / rp | rp-memory | – | – | L062 |
| S085 | 03:26.520 | 03:30.750 | arena / rpsource | rp-memory | – | E045, E046, E047 | L063 |
| S086 | 03:30.750 | 03:33.500 | arena / total | wide | – | – | – |
| S087 | 03:33.500 | 03:36.000 | arena / ride | wide | 10.1.16.12 (upper, R4) | – | – |
| S088 | 03:36.000 | 03:39.000 | arena / orbit | wide | – | – | – |
| S089 | 03:39.000 | 03:42.400 | arena / flyby | wide | 10.1.26.19 (field, R3) | – | – |
| S090 | 03:42.400 | 03:46.000 | arena / chase | wide | 10.1.14.19 (upper, R4) | – | – |
| S091 | 03:46.000 | 03:48.500 | arena / branch | wide | R12 | – | – |
| S092 | 03:48.500 | 03:50.450 | arena / ride | wide | 10.1.19.11 (lower, R5) | E048 | – |
| S093 | 03:50.450 | 03:53.500 | arena / rise | wide | – | – | – |
| S094 | 03:53.500 | 03:56.000 | arena / chase | wide | 10.1.6.12 (upper, R2) | – | – |
| S095 | 03:56.000 | 04:00.000 | arena / stands | wide | – | – | – |
| S096 | 04:00.000 | 04:02.500 | arena / reverse | wide | – | – | – |
| S097 | 04:02.500 | 04:04.800 | arena / ride | wide | 10.1.10.12 (upper, R3) | – | – |
| S098 | 04:04.800 | 04:07.000 | arena / seat | wide | 10.1.15.17 (lower, R4) | – | – |
| S099 | 04:07.000 | 04:09.200 | arena / flyby | wide | 10.1.20.14 (upper, R5) | E049 | – |
| S100 | 04:09.200 | 04:20.600 | arena / final | final | – | E050, E051, E052, E053 | – |

## Netzwerkereignisse

| Zeit | Aktion |
| --- | --- |
| 00:11.380 | Quelle sendet an R1 (erste Gesangszeile) |
| 00:11.550 | R1 → RP: Register |
| 00:15.200 | RP → R1: Register-Stop (keine Empfänger) |
| 00:26.000 | Join 10.1.3.13 (SW3, VLAN 103) |
| 00:29.450 | R7 → R2: (*,G) JOIN |
| 00:31.300 | R2 → R1: (S,G) JOIN |
| 00:33.070 | Join 10.1.25.20 (SW25, VLAN 125) |
| 00:34.427 | Join 10.1.20.20 (SW20, VLAN 120) |
| 00:35.477 | R15 → R5: (*,G) JOIN |
| 00:35.785 | Join 10.1.24.19 (SW24, VLAN 124) |
| 00:35.927 | R5 → R2: (*,G) JOIN |
| 00:36.835 | R17 → R5: (*,G) JOIN |
| 00:37.142 | Join 10.1.21.11 (SW21, VLAN 121) |
| 00:38.192 | R16 → R5: (*,G) JOIN |
| 00:43.000 | Join 10.1.2.14 (SW2, VLAN 102) |
| 00:44.050 | R6 → R2: (*,G) JOIN |
| 00:44.382 | Join 10.1.24.17 (SW24, VLAN 124) |
| 00:46.192 | Join 10.1.6.20 (SW6, VLAN 106) |
| 00:47.242 | R8 → R2: (*,G) JOIN |
| 00:48.002 | Join 10.1.20.16 (SW20, VLAN 120) |
| 00:49.812 | Join 10.1.3.12 (SW3, VLAN 103) |
| 00:51.622 | Join 10.1.20.15 (SW20, VLAN 120) |
| 00:53.432 | Join 10.1.6.14 (SW6, VLAN 106) |
| 00:55.242 | Join 10.1.4.20 (SW4, VLAN 104) |
| 00:57.052 | Join 10.1.5.20 (SW5, VLAN 105) |
| 00:58.862 | Join 10.1.22.12 (SW22, VLAN 122) |
| 01:00.671 | Join 10.1.2.18 (SW2, VLAN 102) |
| 01:02.481 | Join 10.1.19.13 (SW19, VLAN 119) |
| 01:04.291 | Join 10.1.21.14 (SW21, VLAN 121) |
| 01:07.580 | Join 10.1.3.17 (SW3, VLAN 103) |
| 01:15.100 | General Query auf allen 8 VLANs |
| 01:21.938 | Join 10.1.3.16 (SW3, VLAN 103) |
| 01:21.998 | Join 10.1.3.11 (SW3, VLAN 103) |
| 01:22.511 | Join 10.1.1.20 (SW1, VLAN 101) |
| 01:22.843 | Join 10.1.2.20 (SW2, VLAN 102) |
| 01:22.903 | Join 10.1.19.16 (SW19, VLAN 119) |
| 01:23.416 | Join 10.1.4.15 (SW4, VLAN 104) |
| 01:23.748 | Join 10.1.6.15 (SW6, VLAN 106) |
| 01:23.808 | Join 10.1.25.17 (SW25, VLAN 125) |
| 01:24.321 | Join 10.1.2.12 (SW2, VLAN 102) |
| 01:24.653 | Join 10.1.19.18 (SW19, VLAN 119) |
| 01:25.166 | Join 10.1.25.21 (SW25, VLAN 125) |
| 01:25.226 | Join 10.1.2.17 (SW2, VLAN 102) |
| 01:25.558 | Join 10.1.22.14 (SW22, VLAN 122) |
| 01:26.071 | Join 10.1.4.19 (SW4, VLAN 104) |
| 01:26.131 | Join 10.1.20.17 (SW20, VLAN 120) |
| 01:26.463 | Join 10.1.19.17 (SW19, VLAN 119) |
| 01:26.976 | Join 10.1.1.14 (SW1, VLAN 101) |
| 01:27.036 | Join 10.1.25.19 (SW25, VLAN 125) |
| 01:27.368 | Join 10.1.19.14 (SW19, VLAN 119) |
| 01:27.881 | Join 10.1.21.15 (SW21, VLAN 121) |
| 01:28.273 | Join 10.1.19.20 (SW19, VLAN 119) |
| 01:28.393 | Join 10.1.1.15 (SW1, VLAN 101) |
| 01:28.786 | Join 10.1.25.15 (SW25, VLAN 125) |
| 01:29.178 | Join 10.1.21.16 (SW21, VLAN 121) |
| 01:29.298 | Join 10.1.25.14 (SW25, VLAN 125) |
| 01:29.691 | Join 10.1.5.11 (SW5, VLAN 105) |
| 01:30.203 | Join 10.1.25.16 (SW25, VLAN 125) |
| 01:30.536 | Join 10.1.24.18 (SW24, VLAN 124) |
| 01:30.596 | Join 10.1.20.12 (SW20, VLAN 120) |
| 01:31.108 | Join 10.1.24.12 (SW24, VLAN 124) |
| 01:31.441 | Join 10.1.6.13 (SW6, VLAN 106) |
| 01:31.501 | Join 10.1.5.14 (SW5, VLAN 105) |
| 01:32.013 | Join 10.1.19.19 (SW19, VLAN 119) |
| 01:32.346 | Join 10.1.4.16 (SW4, VLAN 104) |
| 01:32.406 | Join 10.1.25.22 (SW25, VLAN 125) |
| 01:32.918 | Join 10.1.24.14 (SW24, VLAN 124) |
| 01:33.251 | Join 10.1.20.11 (SW20, VLAN 120) |
| 01:33.763 | Join 10.1.6.12 (SW6, VLAN 106) |
| 01:33.823 | Join 10.1.4.13 (SW4, VLAN 104) |
| 01:34.156 | Join 10.1.22.13 (SW22, VLAN 122) |
| 01:34.668 | Join 10.1.20.14 (SW20, VLAN 120) |
| 01:34.728 | Join 10.1.24.15 (SW24, VLAN 124) |
| 01:35.061 | Join 10.1.22.19 (SW22, VLAN 122) |
| 01:35.573 | Join 10.1.6.19 (SW6, VLAN 106) |
| 01:37.323 | Join 10.1.6.11 (SW6, VLAN 106) |
| 01:38.228 | Join 10.1.3.14 (SW3, VLAN 103) |
| 01:39.586 | Join 10.1.22.18 (SW22, VLAN 122) |
| 01:40.490 | Join 10.1.22.16 (SW22, VLAN 122) |
| 01:41.848 | Join 10.1.19.11 (SW19, VLAN 119) |
| 01:42.753 | Join 10.1.4.17 (SW4, VLAN 104) |
| 01:44.110 | Join 10.1.1.11 (SW1, VLAN 101) |
| 01:45.015 | Join 10.1.6.16 (SW6, VLAN 106) |
| 01:46.373 | Join 10.1.1.13 (SW1, VLAN 101) |
| 01:47.278 | Join 10.1.21.20 (SW21, VLAN 121) |
| 01:57.180 | Join 10.1.16.13 (SW16, VLAN 116) |
| 01:58.580 | R13 → R4: (*,G) JOIN |
| 01:59.180 | R4 → R3: (*,G) JOIN |
| 01:59.780 | R3 → R2: (*,G) JOIN |
| 02:00.600 | Join 10.1.9.14 (SW9, VLAN 109) |
| 02:01.650 | R10 → R3: (*,G) JOIN |
| 02:01.757 | Join 10.1.8.14 (SW8, VLAN 108) |
| 02:02.210 | Join 10.1.17.13 (SW17, VLAN 117) |
| 02:02.807 | R9 → R3: (*,G) JOIN |
| 02:03.115 | Join 10.1.16.20 (SW16, VLAN 116) |
| 02:03.260 | R14 → R4: (*,G) JOIN |
| 02:04.020 | Join 10.1.9.15 (SW9, VLAN 109) |
| 02:04.925 | Join 10.1.26.12 (SW26, VLAN 126) |
| 02:05.377 | Join 10.1.14.17 (SW14, VLAN 114) |
| 02:06.282 | Join 10.1.11.15 (SW11, VLAN 111) |
| 02:06.427 | R12 → R4: (*,G) JOIN |
| 02:07.187 | Join 10.1.11.16 (SW11, VLAN 111) |
| 02:07.332 | R11 → R3: (*,G) JOIN |
| 02:08.580 | Join 10.1.5.12 (SW5, VLAN 105) |
| 02:09.820 | Join 10.1.1.18 (SW1, VLAN 101) |
| 02:10.100 | Leave 10.1.2.14 (SW2, VLAN 102) |
| 02:10.740 | Group-specific Query VLAN 102 |
| 02:15.700 | SPT-Switchover R6/R7 (Drop) |
| 02:16.000 | R9 → R3: (S,G) JOIN |
| 02:16.000 | R10 → R3: (S,G) JOIN |
| 02:16.000 | R11 → R3: (S,G) JOIN |
| 02:16.000 | R12 → R4: (S,G) JOIN |
| 02:16.000 | R13 → R4: (S,G) JOIN |
| 02:16.000 | R14 → R4: (S,G) JOIN |
| 02:16.000 | R15 → R5: (S,G) JOIN |
| 02:16.000 | R16 → R5: (S,G) JOIN |
| 02:16.000 | R17 → R5: (S,G) JOIN |
| 02:16.237 | Join 10.1.11.17 (SW11, VLAN 111) |
| 02:16.297 | Join 10.1.7.17 (SW7, VLAN 107) |
| 02:16.450 | R3 → R1: (S,G) JOIN |
| 02:16.450 | R4 → R1: (S,G) JOIN |
| 02:16.450 | R5 → R1: (S,G) JOIN |
| 02:16.810 | Join 10.1.20.19 (SW20, VLAN 120) |
| 02:16.900 | R4 → R3: (S,G,rpt) PRUNE |
| 02:16.900 | R5 → R2: (S,G,rpt) PRUNE |
| 02:17.142 | Join 10.1.10.13 (SW10, VLAN 110) |
| 02:17.350 | R3 → R2: (S,G,rpt) PRUNE |
| 02:17.655 | Join 10.1.22.11 (SW22, VLAN 122) |
| 02:18.167 | Join 10.1.12.19 (SW12, VLAN 112) |
| 02:18.500 | Join 10.1.8.12 (SW8, VLAN 108) |
| 02:19.012 | Join 10.1.13.13 (SW13, VLAN 113) |
| 02:19.525 | Join 10.1.19.12 (SW19, VLAN 119) |
| 02:19.857 | Join 10.1.5.19 (SW5, VLAN 105) |
| 02:20.369 | Join 10.1.27.11 (SW27, VLAN 127) |
| 02:20.882 | Join 10.1.2.19 (SW2, VLAN 102) |
| 02:21.214 | Join 10.1.7.16 (SW7, VLAN 107) |
| 02:21.727 | Join 10.1.22.17 (SW22, VLAN 122) |
| 02:22.239 | Join 10.1.12.12 (SW12, VLAN 112) |
| 02:22.572 | Join 10.1.4.14 (SW4, VLAN 104) |
| 02:22.632 | Join 10.1.14.12 (SW14, VLAN 114) |
| 02:23.144 | Join 10.1.7.20 (SW7, VLAN 107) |
| 02:23.477 | Join 10.1.15.13 (SW15, VLAN 115) |
| 02:23.989 | Join 10.1.9.19 (SW9, VLAN 109) |
| 02:24.502 | Join 10.1.26.14 (SW26, VLAN 126) |
| 02:24.834 | Join 10.1.27.14 (SW27, VLAN 127) |
| 02:25.347 | Join 10.1.6.18 (SW6, VLAN 106) |
| 02:25.859 | Join 10.1.27.15 (SW27, VLAN 127) |
| 02:26.192 | Join 10.1.7.11 (SW7, VLAN 107) |
| 02:26.704 | Join 10.1.24.16 (SW24, VLAN 124) |
| 02:27.217 | Join 10.1.7.19 (SW7, VLAN 107) |
| 02:27.549 | Join 10.1.27.20 (SW27, VLAN 127) |
| 02:28.062 | Join 10.1.22.20 (SW22, VLAN 122) |
| 02:28.574 | Join 10.1.27.22 (SW27, VLAN 127) |
| 02:33.060 | Join 10.1.3.20 (SW3, VLAN 103) |
| 02:44.350 | Join 10.1.17.11 (SW17, VLAN 117) |
| 02:44.384 | Join 10.1.26.17 (SW26, VLAN 126) |
| 02:44.417 | Join 10.1.15.19 (SW15, VLAN 115) |
| 02:44.451 | Join 10.1.16.18 (SW16, VLAN 116) |
| 02:44.485 | Join 10.1.15.17 (SW15, VLAN 115) |
| 02:44.518 | Join 10.1.5.17 (SW5, VLAN 105) |
| 02:44.552 | Join 10.1.26.15 (SW26, VLAN 126) |
| 02:44.586 | Join 10.1.2.13 (SW2, VLAN 102) |
| 02:44.620 | Join 10.1.17.20 (SW17, VLAN 117) |
| 02:44.653 | Join 10.1.12.20 (SW12, VLAN 112) |
| 02:44.687 | Join 10.1.13.19 (SW13, VLAN 113) |
| 02:44.721 | Join 10.1.9.12 (SW9, VLAN 109) |
| 02:44.754 | Join 10.1.26.13 (SW26, VLAN 126) |
| 02:44.788 | Join 10.1.14.14 (SW14, VLAN 114) |
| 02:44.822 | Join 10.1.15.12 (SW15, VLAN 115) |
| 02:44.855 | Join 10.1.27.16 (SW27, VLAN 127) |
| 02:44.889 | Join 10.1.13.15 (SW13, VLAN 113) |
| 02:44.923 | Join 10.1.13.14 (SW13, VLAN 113) |
| 02:44.957 | Join 10.1.2.15 (SW2, VLAN 102) |
| 02:44.990 | Join 10.1.4.18 (SW4, VLAN 104) |
| 02:45.024 | Join 10.1.12.14 (SW12, VLAN 112) |
| 02:45.058 | Join 10.1.26.22 (SW26, VLAN 126) |
| 02:45.091 | Join 10.1.2.16 (SW2, VLAN 102) |
| 02:45.125 | Join 10.1.11.19 (SW11, VLAN 111) |
| 02:45.159 | Join 10.1.8.18 (SW8, VLAN 108) |
| 02:45.192 | Join 10.1.15.20 (SW15, VLAN 115) |
| 02:45.226 | Join 10.1.17.15 (SW17, VLAN 117) |
| 02:45.260 | Join 10.1.5.15 (SW5, VLAN 105) |
| 02:45.293 | Join 10.1.2.11 (SW2, VLAN 102) |
| 02:45.327 | Join 10.1.1.19 (SW1, VLAN 101) |
| 02:45.361 | Join 10.1.16.14 (SW16, VLAN 116) |
| 02:45.395 | Join 10.1.8.19 (SW8, VLAN 108) |
| 02:45.428 | Join 10.1.12.18 (SW12, VLAN 112) |
| 02:45.462 | Join 10.1.6.17 (SW6, VLAN 106) |
| 02:45.496 | Join 10.1.13.18 (SW13, VLAN 113) |
| 02:45.529 | Join 10.1.15.15 (SW15, VLAN 115) |
| 02:45.563 | Join 10.1.1.12 (SW1, VLAN 101) |
| 02:45.597 | Join 10.1.12.11 (SW12, VLAN 112) |
| 02:45.630 | Join 10.1.14.19 (SW14, VLAN 114) |
| 02:45.664 | Join 10.1.16.19 (SW16, VLAN 116) |
| 02:45.698 | Join 10.1.17.16 (SW17, VLAN 117) |
| 02:45.732 | Join 10.1.8.16 (SW8, VLAN 108) |
| 02:45.765 | Join 10.1.9.18 (SW9, VLAN 109) |
| 02:45.799 | Join 10.1.27.18 (SW27, VLAN 127) |
| 02:45.833 | Join 10.1.12.15 (SW12, VLAN 112) |
| 02:45.866 | Join 10.1.3.15 (SW3, VLAN 103) |
| 02:47.006 | Join 10.1.11.20 (SW11, VLAN 111) |
| 02:47.459 | Join 10.1.21.17 (SW21, VLAN 121) |
| 02:48.364 | Join 10.1.16.12 (SW16, VLAN 116) |
| 02:48.816 | Join 10.1.15.11 (SW15, VLAN 115) |
| 02:49.721 | Join 10.1.25.12 (SW25, VLAN 125) |
| 02:50.174 | Join 10.1.27.17 (SW27, VLAN 127) |
| 02:51.079 | Join 10.1.10.16 (SW10, VLAN 110) |
| 02:51.531 | Join 10.1.4.12 (SW4, VLAN 104) |
| 02:52.436 | Join 10.1.21.18 (SW21, VLAN 121) |
| 02:52.889 | Join 10.1.3.19 (SW3, VLAN 103) |
| 02:53.794 | Join 10.1.12.13 (SW12, VLAN 112) |
| 02:54.246 | Join 10.1.9.16 (SW9, VLAN 109) |
| 02:55.151 | Join 10.1.5.18 (SW5, VLAN 105) |
| 02:55.604 | Join 10.1.26.19 (SW26, VLAN 126) |
| 02:56.509 | Join 10.1.11.12 (SW11, VLAN 111) |
| 02:56.961 | Join 10.1.10.14 (SW10, VLAN 110) |
| 02:57.866 | Join 10.1.16.16 (SW16, VLAN 116) |
| 02:58.319 | Join 10.1.24.20 (SW24, VLAN 124) |
| 02:59.224 | Join 10.1.16.15 (SW16, VLAN 116) |
| 02:59.676 | Join 10.1.7.18 (SW7, VLAN 107) |
| 03:00.581 | Join 10.1.26.11 (SW26, VLAN 126) |
| 03:01.033 | Join 10.1.7.14 (SW7, VLAN 107) |
| 03:02.391 | Join 10.1.27.12 (SW27, VLAN 127) |
| 03:02.617 | Leave 10.1.2.18 (SW2, VLAN 102) |
| 03:03.296 | Join 10.1.22.15 (SW22, VLAN 122) |
| 03:04.201 | Join 10.1.27.19 (SW27, VLAN 127) |
| 03:05.106 | Join 10.1.21.12 (SW21, VLAN 121) |
| 03:05.332 | Leave 10.1.5.15 (SW5, VLAN 105) |
| 03:06.463 | Join 10.1.10.18 (SW10, VLAN 110) |
| 03:07.368 | Join 10.1.24.13 (SW24, VLAN 124) |
| 03:08.047 | Leave 10.1.22.14 (SW22, VLAN 122) |
| 03:08.273 | Join 10.1.13.12 (SW13, VLAN 113) |
| 03:09.631 | Join 10.1.17.14 (SW17, VLAN 117) |
| 03:10.536 | Join 10.1.12.17 (SW12, VLAN 112) |
| 03:10.640 | General Query auf allen 8 VLANs |
| 03:11.214 | Leave 10.1.2.13 (SW2, VLAN 102) |
| 03:11.441 | Join 10.1.21.19 (SW21, VLAN 121) |
| 03:12.346 | Join 10.1.16.17 (SW16, VLAN 116) |
| 03:13.703 | Join 10.1.10.20 (SW10, VLAN 110) |
| 03:13.929 | Leave 10.1.10.13 (SW10, VLAN 110) |
| 03:14.608 | Join 10.1.12.16 (SW12, VLAN 112) |
| 03:15.513 | Join 10.1.14.20 (SW14, VLAN 114) |
| 03:17.180 | General Query auf allen 8 VLANs |
| 03:30.898 | Join 10.1.5.16 (SW5, VLAN 105) |
| 03:31.124 | Leave 10.1.13.18 (SW13, VLAN 113) |
| 03:32.255 | Join 10.1.17.17 (SW17, VLAN 117) |
| 03:33.386 | Leave 10.1.22.19 (SW22, VLAN 122) |
| 03:34.065 | Join 10.1.13.17 (SW13, VLAN 113) |
| 03:35.423 | Join 10.1.27.13 (SW27, VLAN 127) |
| 03:35.649 | Leave 10.1.2.20 (SW2, VLAN 102) |
| 03:37.233 | Join 10.1.8.17 (SW8, VLAN 108) |
| 03:37.911 | Leave 10.1.27.16 (SW27, VLAN 127) |
| 03:38.590 | Join 10.1.10.17 (SW10, VLAN 110) |
| 03:40.400 | Join 10.1.14.13 (SW14, VLAN 114) |
| 03:40.626 | Leave 10.1.6.11 (SW6, VLAN 106) |
| 03:41.757 | Join 10.1.10.12 (SW10, VLAN 110) |
| 03:42.888 | Leave 10.1.24.18 (SW24, VLAN 124) |
| 03:43.567 | Join 10.1.9.17 (SW9, VLAN 109) |
| 03:44.925 | Join 10.1.17.18 (SW17, VLAN 117) |
| 03:45.151 | Leave 10.1.8.18 (SW8, VLAN 108) |
| 03:46.735 | Join 10.1.17.19 (SW17, VLAN 117) |
| 03:47.866 | Leave 10.1.25.12 (SW25, VLAN 125) |
| 03:48.092 | Join 10.1.5.13 (SW5, VLAN 105) |
| 03:49.902 | Join 10.1.10.11 (SW10, VLAN 110) |
| 03:50.128 | Leave 10.1.22.20 (SW22, VLAN 122) |
| 03:51.712 | Join 10.1.2.18 (SW2, VLAN 102) |
| 03:52.391 | Leave 10.1.5.20 (SW5, VLAN 105) |
| 03:53.070 | Join 10.1.24.11 (SW24, VLAN 124) |
| 03:54.880 | Join 10.1.10.19 (SW10, VLAN 110) |
| 03:55.106 | Leave 10.1.22.12 (SW22, VLAN 122) |
| 03:56.237 | Join 10.1.7.13 (SW7, VLAN 107) |
| 03:57.368 | Leave 10.1.16.18 (SW16, VLAN 116) |
| 03:58.047 | Join 10.1.5.20 (SW5, VLAN 105) |
| 03:59.405 | Join 10.1.11.14 (SW11, VLAN 111) |
| 03:59.631 | Leave 10.1.21.11 (SW21, VLAN 121) |
| 04:01.214 | Join 10.1.16.11 (SW16, VLAN 116) |
| 04:02.345 | Leave 10.1.25.15 (SW25, VLAN 125) |
| 04:02.572 | Join 10.1.13.16 (SW13, VLAN 113) |
| 04:04.382 | Join 10.1.22.14 (SW22, VLAN 122) |
| 04:04.608 | Leave 10.1.10.12 (SW10, VLAN 110) |
| 04:05.739 | Join 10.1.27.16 (SW27, VLAN 127) |
| 04:06.870 | Leave 10.1.10.14 (SW10, VLAN 110) |
| 04:07.549 | Join 10.1.21.11 (SW21, VLAN 121) |
| 04:12.000 | General Query auf allen 8 VLANs |
