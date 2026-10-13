# MTU — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV.
62 Einstellungen, 11 Kapitel, 122 Paketflüge. 11 POV-Fahrten. Alle 28 Analyse-Events und 58 Lyric-Zeilen sind genau einer Einstellung zugeordnet.

Strukturelle Einsätze: 16,01 · 48,00 · 104,88 · 122,64 s. Pegellücke (erster stiller Drop) 5,15–5,25 s. Schlussblende ab 137,8 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Die Grenze | Ein grosses Paket fährt an eine kaum sichtbare Grenze und verschwindet in der Pegellücke. Die Rückmeldung stirbt leise an der Firewall. |
| C02 | 00:12.800 | Alles erreichbar | Übersicht: Ping geht hin und zurück, kleine Pakete passieren den Tunnel. Der Retransmit wartet und scheitert wieder. |
| C03 | 00:23.280 | Ein Byte zu viel | Messhalle: 1401 gegen 1400 Bytes, Header und Nutzlast, DF=1. Dann der stille Drop im Pfad, der Upload steht. |
| C04 | 00:37.020 | Kleine Tests täuschen | Ping geht, das grosse Paket stirbt; tracepath endet im Nichts; ein 1400-Byte-Test passt; das Tor wird sichtbar. |
| C05 | 00:43.700 | Das Tor bekommt einen Namen | Kontur gegen Kontur: 100 Bytes Überstand. Der Rahmen rastet ein. |
| C06 | 00:48.000 | M-T-U | Anflug auf das Tor, M-T-U leuchtet rot, das Paket scheitert. Rückzug: die Engstelle ist winzig im ganzen Netz. |
| C07 | 01:01.580 | Don’t fragment | DF-Klammer, enger Korridor von oben, gestrandetes Paket, Vorschau kleinerer Pakete am Sender. |
| C08 | 01:16.000 | Die Hüllen | Tunnel-Overhead: IPsec-Hülle und MPLS-Labels. Das ICMP-„Fragmentation needed“ entsteht und wird an der Firewall verschluckt. |
| C09 | 01:30.520 | Vermessen | 1400 passt, 1500 nicht, Jumbo nur im eigenen Netz, Path MTU = kleinster Rahmen. Freigabe für ICMP Typ 3/4; der Sender lernt 1400. |
| C10 | 01:44.880 | Jetzt passt es | Gleicher Anflug wie im ersten Chorus, gleiche Torgrösse: neue 1400-Byte-Pakete fliegen durch. Der Upload wird fertig. |
| C11 | 01:57.800 | Finale | Schwebe am Tor, letzte lange Fahrt durch den Tunnel, Titel; das letzte Paket passiert auf dem letzten Impuls. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:03.880 | path / opening | intro | D0 | MTU_CUE_01 | L010 |
| S002 | 00:03.880 | 00:07.440 | path / gateside | intro | D0 | MTU_CUE_02, MTU_CUE_03 | L011 |
| S003 | 00:07.440 | 00:11.380 | path / fw | quiet | I0 | – | L012 |
| S004 | 00:11.380 | 00:12.800 | path / host | waits | – | – | L013 |
| S005 | 00:12.800 | 00:16.010 | path / wide | build | – | MTU_CUE_04 | – |
| S006 | 00:16.010 | 00:19.650 | path / chase | build | P2 | MTU_CUE_05 | – |
| S007 | 00:19.650 | 00:22.000 | path / receiver | build | – | – | – |
| S008 | 00:22.000 | 00:23.280 | path / gate | build | – | MTU_CUE_06 | – |
| S009 | 00:23.280 | 00:26.920 | lab / front | byte | – | MTU_CUE_07 | L017, L018 |
| S010 | 00:26.920 | 00:30.880 | lab / explode | header | – | – | L019, L020 |
| S011 | 00:30.880 | 00:33.760 | lab / macro | df | – | – | L021, L022 |
| S012 | 00:33.760 | 00:35.640 | path / gateside | drop | D2 | – | L023 |
| S013 | 00:35.640 | 00:37.020 | path / host | pain | – | – | L024 |
| S014 | 00:37.020 | 00:38.120 | path / chase | pre | P3 | MTU_CUE_08 | L028 |
| S015 | 00:38.120 | 00:38.940 | path / gateside | pre | D3 | – | L029 |
| S016 | 00:38.940 | 00:40.000 | path / flyby | pre | P4 | – | L030 |
| S017 | 00:40.000 | 00:40.660 | path / fw | hides | – | – | L031 |
| S018 | 00:40.660 | 00:41.760 | path / xray | trace | – | – | L032 |
| S019 | 00:41.760 | 00:42.540 | lab / front | lower | – | – | L033 |
| S020 | 00:42.540 | 00:43.700 | path / gate | fault | – | – | L034 |
| S021 | 00:43.700 | 00:48.000 | lab / front | measure | – | MTU_CUE_09, MTU_CUE_10, MTU_CUE_11 | – |
| S022 | 00:48.000 | 00:50.880 | path / ride | chorus | D4 | MTU_CUE_12, MTU_CUE_13 | L038, L039 |
| S023 | 00:50.880 | 00:52.520 | path / gateside | chorus | D4 | – | – |
| S024 | 00:52.520 | 00:53.120 | path / gate | chorus | – | – | L040 |
| S025 | 00:53.120 | 00:54.980 | lab / macro | readout | – | – | L041 |
| S026 | 00:54.980 | 00:56.980 | path / gateside | big | D5 | – | L042 |
| S027 | 00:56.980 | 00:58.080 | path / wide2 | small | – | – | L043 |
| S028 | 00:58.080 | 01:01.580 | path / pathline | find | – | – | L044, L045 |
| S029 | 01:01.580 | 01:02.760 | lab / macro | dfhook | – | MTU_CUE_14 | L049 |
| S030 | 01:02.760 | 01:05.400 | lab / seams | dfhook | – | – | L050 |
| S031 | 01:05.400 | 01:08.280 | path / topdown | narrow | – | – | L051 |
| S032 | 01:08.280 | 01:08.700 | path / gateside | stranded | D6 | – | L052 |
| S033 | 01:08.700 | 01:10.350 | lab / seams | dfhook | – | – | L053, L054 |
| S034 | 01:10.350 | 01:12.460 | path / ride | hook | D7 | – | – |
| S035 | 01:12.460 | 01:16.000 | lab / rebuild | preview | – | – | L055, L056 |
| S036 | 01:16.000 | 01:19.780 | lab / explode | encap | – | MTU_CUE_15 | L060, L061 |
| S037 | 01:19.780 | 01:20.840 | lab / orbit | vpn | – | – | L062 |
| S038 | 01:20.840 | 01:21.800 | lab / orbit | mpls | – | – | – |
| S039 | 01:21.800 | 01:23.600 | lab / front | oldsize | – | – | L063 |
| S040 | 01:23.600 | 01:25.460 | path / ride | discovery | D8 | – | L064 |
| S041 | 01:25.460 | 01:27.240 | path / chase | icmp | I8 | – | L065 |
| S042 | 01:27.240 | 01:28.720 | path / fw | blocked | I8 | – | L066 |
| S043 | 01:28.720 | 01:30.520 | path / wide | crack | – | – | L067 |
| S044 | 01:30.520 | 01:31.700 | lab / front | b1400 | – | MTU_CUE_16 | L071 |
| S045 | 01:31.700 | 01:33.740 | lab / front | b1500 | – | – | L072 |
| S046 | 01:33.740 | 01:34.960 | lab / jumbo | jumbo | – | – | L073 |
| S047 | 01:34.960 | 01:36.740 | lab / macro | bdf | – | – | L074 |
| S048 | 01:36.740 | 01:38.920 | lab / frames | pmtu | – | MTU_CUE_17 | L075 |
| S049 | 01:38.920 | 01:40.320 | path / fw | fix | I9 | – | L076 |
| S050 | 01:40.320 | 01:42.560 | path / host | learned | – | – | – |
| S051 | 01:42.560 | 01:44.880 | lab / rebuild | retry | – | MTU_CUE_18 | L077 |
| S052 | 01:44.880 | 01:46.860 | path / ride | final | S0 | MTU_CUE_19, MTU_CUE_20 | L081 |
| S053 | 01:46.860 | 01:49.240 | path / tunnel | final | S0 | – | L082 |
| S054 | 01:49.240 | 01:51.860 | path / gate | final2 | – | – | L083, L084 |
| S055 | 01:51.860 | 01:54.960 | path / gateside | ghost | S25 | – | L085, L086 |
| S056 | 01:54.960 | 01:56.760 | path / wide | final3 | – | – | L087, L088 |
| S057 | 01:56.760 | 01:59.120 | path / receiver | done | – | MTU_CUE_21 | – |
| S058 | 01:59.120 | 02:02.640 | path / gate | hover | – | MTU_CUE_22 | – |
| S059 | 02:02.640 | 02:07.200 | path / ride | tail | S55 | MTU_CUE_23 | – |
| S060 | 02:07.200 | 02:12.500 | path / tunnel | tail | S62 | – | – |
| S061 | 02:12.500 | 02:13.240 | path / wide | tail | – | MTU_CUE_24 | – |
| S062 | 02:13.240 | 02:19.000 | path / final | outro | – | MTU_CUE_25, MTU_CUE_26, MTU_CUE_27, MTU_CUE_28 | – |

## Netzereignisse

| Zeit | Aktion |
| --- | --- |
| 00:05.200 | R2 verwirft D0: 1500 B mit DF an Tunnel-MTU 1400 |
| 00:08.850 | I0 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 00:16.550 | R2 verwirft D1: 1500 B mit DF an Tunnel-MTU 1400 |
| 00:19.370 | I1 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 00:34.300 | R2 verwirft D2: 1500 B mit DF an Tunnel-MTU 1400 |
| 00:37.120 | I2 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 00:38.450 | R2 verwirft D3: 1500 B mit DF an Tunnel-MTU 1400 |
| 00:41.270 | I3 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 00:50.550 | R2 verwirft D4: 1500 B mit DF an Tunnel-MTU 1400 |
| 00:53.370 | I4 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 00:55.900 | R2 verwirft D5: 1500 B mit DF an Tunnel-MTU 1400 |
| 00:58.720 | I5 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 01:08.450 | R2 verwirft D6: 1500 B mit DF an Tunnel-MTU 1400 |
| 01:11.270 | I6 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 01:12.200 | R2 verwirft D7: 1500 B mit DF an Tunnel-MTU 1400 |
| 01:15.020 | I7 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 01:24.750 | R2 verwirft D8: 1500 B mit DF an Tunnel-MTU 1400 |
| 01:28.000 | I8 (ICMP 3/4, mtu 1400) an der Firewall verworfen |
| 01:37.760 | R2 verwirft D9: 1500 B mit DF an Tunnel-MTU 1400 |
| 01:39.300 | Firewall: icmp destination-unreachable / frag-needed wird akzeptiert |
| 01:40.000 | I9 (ICMP 3/4, mtu 1400) an der Firewall durchgelassen |
| 01:41.115 | Host A lernt Path MTU 1400 |
| 01:44.880 | Neusendung in 1400-Byte-Paketen beginnt (32 Segmente, 42920 B) |
| 01:57.450 | report.pdf vollständig angekommen |
