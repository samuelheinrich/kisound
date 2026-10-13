# Destination Unreachable — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV.
85 Einstellungen, 10 Kapitel, 150 Paketflüge, 36 empfangene ICMP-/Reply-Meldungen, 78 Pakete in Null0 verschwunden. Alle 42 Analyse-Events und 51 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Bass-Einsätze: 58,75 · 73,35 · 95,15 · 124,25 · 131,95 · 160,55 · 175,15 · 187,85 · 198,75 · 209,45 · 220,55 · 233,35 · 236,95 · 246,55 s. Pegellücke vor dem ersten Drop 58,4–58,5 s. RTBH /32 → /24 bei 55,2 s, Metrikwechsel bei 101,4 s. Schlussblende ab 256,6 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Pulse | Ein Glossar der Stille: Destination unreachable, Time exceeded, No reply, Blackhole, TTL, Traceroute – jedes als echtes Ereignis im Backbone. |
| C02 | 00:30.740 | Ein Signal in den Kern | Ein Echo Request überquert die Kante und verschwindet nach Hop 3. Kein Alarm, keine Antwort. |
| C03 | 00:45.360 | Wo ist das Paket? | Nebelkarte. Die Blackhole-Route wächst von /32 auf /24, ein zweiter Host verschwindet. Nochmals senden – Fall. Von R2 kommt ein lautes Unreachable: kein Route für Site C. |
| C04 | 01:09.360 | Nacht | Fahrt durch den Backbone, Traceroute läuft. |
| C05 | 01:21.720 | Traceroute | Hop für Hop. Firewall still: 0 Treffer im Log. Ein fehlendes Präfix bei R2. Echo Request ohne Reply. Metriken wechseln, der Weg führt trotzdem in R4. |
| C06 | 01:50.180 | Break | TTL expired · Next hop gone · Silent gateway · Moving on · ICMP · No reply · Packets fall · Signals die. |
| C07 | 02:12.340 | Final Hook | Dieselben Fragen, grösseres Loch. |
| C08 | 02:43.800 | Finale | Dreimal Destination unreachable. |
| C09 | 02:52.460 | Leerer Backbone | Die Akte: R4 verwirft 203.0.113.0/24 nach Null0 (alte RTBH-Route), R2 fehlt 198.51.100.0/24. Die Nacht geht weiter, die Pakete fallen. |
| C10 | 04:01.000 | Kein Weg | Titel, zwei letzte Unreachables, dann Stille. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:03.660 | backbone / opening | intro | – | E001, E002, E003, E004 | – |
| S002 | 00:03.660 | 00:06.460 | backbone / hop | du | n:R2 | E005 | L001 |
| S003 | 00:06.460 | 00:09.680 | backbone / hop | te | n:R1 | E006 | L002 |
| S004 | 00:09.680 | 00:12.400 | backbone / void | noreply | – | – | L003 |
| S005 | 00:12.400 | 00:14.860 | map / top | pulse | – | – | – |
| S006 | 00:14.860 | 00:15.960 | backbone / chase | lost | f:E0b | – | L004 |
| S007 | 00:15.960 | 00:17.920 | backbone / void | blackhole | – | – | L005 |
| S008 | 00:17.920 | 00:20.640 | backbone / ttl | ttl | f:T0p4 | – | L006 |
| S009 | 00:20.640 | 00:23.440 | map / top | trace | – | – | L007 |
| S010 | 00:23.440 | 00:27.060 | backbone / cable | hop | – | – | L008 |
| S011 | 00:27.060 | 00:28.400 | backbone / void | noreturn | – | – | L009 |
| S012 | 00:28.400 | 00:30.740 | map / low | pulse2 | – | – | – |
| S013 | 00:30.740 | 00:33.100 | backbone / ride | spoken | f:E1 | E007, E008 | L010 |
| S014 | 00:33.100 | 00:36.780 | backbone / chase | spoken | f:E1 | – | L011 |
| S015 | 00:36.780 | 00:38.080 | map / card | noalarm | – | – | L012 |
| S016 | 00:38.080 | 00:39.420 | map / term | noanswer | – | – | L013 |
| S017 | 00:39.420 | 00:41.440 | backbone / tower | silence | n:R4 | – | – |
| S018 | 00:41.440 | 00:45.360 | backbone / void | silence | – | – | L014 |
| S019 | 00:45.360 | 00:49.280 | backbone / wide | hook | – | E009 | L015 |
| S020 | 00:49.280 | 00:52.540 | map / top | nobody | – | E010 | L016 |
| S021 | 00:52.540 | 00:55.200 | backbone / ride | hook | f:E2 | – | L017 |
| S022 | 00:55.200 | 00:58.440 | backbone / void | grow | – | – | L018 |
| S023 | 00:58.440 | 00:58.750 | backbone / host | resend | – | – | L019 |
| S024 | 00:58.750 | 01:01.980 | backbone / fall | fall | f:K1 | E011 | L020 |
| S025 | 01:01.980 | 01:03.600 | backbone / hop | du2 | n:R2 | – | L021 |
| S026 | 01:03.600 | 01:05.260 | map / table | noroute | – | – | – |
| S027 | 01:05.260 | 01:09.360 | backbone / site | noroute2 | n:RC | – | L022 |
| S028 | 01:09.360 | 01:13.350 | backbone / wide2 | inst | – | E012 | – |
| S029 | 01:13.350 | 01:17.000 | backbone / ride | inst | f:E4 | – | – |
| S030 | 01:17.000 | 01:20.300 | backbone / flyby | inst | f:T1p3 | – | – |
| S031 | 01:20.300 | 01:21.720 | map / low | inst | – | E013 | – |
| S032 | 01:21.720 | 01:23.360 | backbone / cable | trace2 | – | E014 | L023 |
| S033 | 01:23.360 | 01:27.060 | map / top | marks | – | E015 | L024 |
| S034 | 01:27.060 | 01:30.600 | backbone / site | fw | n:FWB | – | L025 |
| S035 | 01:30.600 | 01:34.260 | map / table | prefix | – | – | L026 |
| S036 | 01:34.260 | 01:37.800 | backbone / ride | echo | f:E5 | – | L027 |
| S037 | 01:37.800 | 01:41.400 | backbone / site | noreply2 | n:D | – | L028 |
| S038 | 01:41.400 | 01:44.980 | backbone / wide | shift | – | – | L029 |
| S039 | 01:44.980 | 01:47.500 | map / table | null | – | – | L030 |
| S040 | 01:47.500 | 01:50.180 | backbone / orbit | inst2 | – | E016 | – |
| S041 | 01:50.180 | 01:51.100 | backbone / hop | b_ttl | n:R3b | E017 | L031 |
| S042 | 01:51.100 | 01:52.320 | backbone / void | b_gone | – | – | L032 |
| S043 | 01:52.320 | 01:54.880 | backbone / tower | b_silent | n:R4 | – | L033 |
| S044 | 01:54.880 | 01:56.100 | backbone / cable | b_moving | – | – | L034 |
| S045 | 01:56.100 | 01:58.540 | map / card | b_icmp | – | – | L035 |
| S046 | 01:58.540 | 01:59.680 | map / term | b_noreply | – | – | L036 |
| S047 | 01:59.680 | 02:02.080 | backbone / fall | b_fall | f:E6 | – | L037 |
| S048 | 02:02.080 | 02:02.820 | backbone / void | b_die | – | – | L038 |
| S049 | 02:02.820 | 02:04.250 | backbone / wide2 | inst3 | – | E018, E019 | – |
| S050 | 02:04.250 | 02:08.000 | backbone / ride | inst3 | f:E7 | – | – |
| S051 | 02:08.000 | 02:12.340 | backbone / flyby | inst3 | f:T5p2 | E020 | – |
| S052 | 02:12.340 | 02:16.260 | backbone / wide | hook2 | – | E021 | L039 |
| S053 | 02:16.260 | 02:19.540 | map / top | nobody2 | – | E022 | L040 |
| S054 | 02:19.540 | 02:23.200 | backbone / ride | hook2 | f:E8 | – | L041 |
| S055 | 02:23.200 | 02:25.560 | backbone / void | grow2 | – | – | L042 |
| S056 | 02:25.560 | 02:26.780 | backbone / host | resend2 | – | – | L043 |
| S057 | 02:26.780 | 02:28.720 | backbone / fall | fall2 | f:E9 | – | L044 |
| S058 | 02:28.720 | 02:30.700 | backbone / hop | du3 | n:R2 | – | L045 |
| S059 | 02:30.700 | 02:33.680 | map / card | du3 | – | – | – |
| S060 | 02:33.680 | 02:36.620 | backbone / site | noroute3 | n:RC | E023 | L046 |
| S061 | 02:36.620 | 02:40.550 | backbone / wide2 | inst4 | – | E024 | – |
| S062 | 02:40.550 | 02:43.800 | backbone / ride | inst4 | f:E10 | – | – |
| S063 | 02:43.800 | 02:45.200 | backbone / hop | fin1 | n:R2 | E025 | L047 |
| S064 | 02:45.200 | 02:46.500 | map / card | fin2 | – | – | L048 |
| S065 | 02:46.500 | 02:51.060 | backbone / void | fin2 | – | E026 | – |
| S066 | 02:51.060 | 02:52.460 | backbone / hop | fin3 | n:R2 | – | L049 |
| S067 | 02:52.460 | 02:55.150 | map / top | case | – | E027 | – |
| S068 | 02:55.150 | 03:00.000 | backbone / ride | night | f:E11 | E028 | – |
| S069 | 03:00.000 | 03:04.000 | backbone / flyby | night | f:T4p3 | – | – |
| S070 | 03:04.000 | 03:07.850 | map / low | night | – | E029 | – |
| S071 | 03:07.850 | 03:12.800 | backbone / cable | night2 | – | – | – |
| S072 | 03:12.800 | 03:18.750 | backbone / orbit | night2 | – | E030 | – |
| S073 | 03:18.750 | 03:24.000 | backbone / fall | night3 | f:E12 | – | – |
| S074 | 03:24.000 | 03:26.400 | backbone / wide | night3 | – | – | – |
| S075 | 03:26.400 | 03:29.450 | map / table | night3 | – | E031 | – |
| S076 | 03:29.450 | 03:35.800 | backbone / ride | night4 | f:E13 | – | – |
| S077 | 03:35.800 | 03:40.550 | backbone / void | night4 | – | E032 | – |
| S078 | 03:40.550 | 03:46.000 | backbone / chase | night5 | f:E14 | – | – |
| S079 | 03:46.000 | 03:47.900 | backbone / tower | night5 | n:R4 | – | – |
| S080 | 03:47.900 | 03:53.350 | map / top | night5 | – | E033, E034 | – |
| S081 | 03:53.350 | 03:56.950 | backbone / fall | night6 | f:E15 | E035 | – |
| S082 | 03:56.950 | 04:01.000 | backbone / wide2 | night6 | – | – | – |
| S083 | 04:01.000 | 04:11.080 | backbone / final | outro | – | E036 | – |
| S084 | 04:11.080 | 04:14.540 | backbone / hop | end | n:R2 | E037, E038 | L050 |
| S085 | 04:14.540 | 04:19.801 | backbone / void | end | – | E039, E040, E041, E042 | L051 |

## Traceroutes

**T0**
```
$ traceroute -n 203.0.113.45
 1  192.0.2.1      1.1 ms
 2  198.18.0.2     4.8 ms
 3  198.18.0.3     9.6 ms
 4  198.18.0.4     12.3 ms
 5  * * *
 6  * * *
```

**T1**
```
$ traceroute -n 203.0.113.45
 1  192.0.2.1      1.1 ms
 2  198.18.0.2     4.8 ms
 3  198.18.0.3     9.6 ms
 4  198.18.0.4     12.3 ms
 5  * * *
 6  * * *
```

**T2**
```
$ traceroute -n 203.0.113.45
 1  192.0.2.1      1.1 ms
 2  198.18.0.2     4.8 ms
 3  198.18.0.3     9.6 ms
 4  198.18.0.4     12.3 ms
 5  * * *
 6  * * *
```

**T3**
```
$ traceroute -n 203.0.113.45
 1  192.0.2.1      1.1 ms
 2  198.18.0.2     4.8 ms
 3  198.18.0.13    9.6 ms
 4  198.18.0.4     12.3 ms
 5  * * *
 6  * * *
```

**T5**
```
$ traceroute -n 203.0.113.45
 1  192.0.2.1      1.1 ms
 2  198.18.0.2     4.8 ms
 3  198.18.0.13    9.6 ms
 4  198.18.0.4     12.3 ms
 5  * * *
 6  * * *
```

**T4**
```
$ traceroute -n 203.0.113.45
 1  192.0.2.1      1.1 ms
 2  198.18.0.2     4.8 ms
 3  198.18.0.13    9.6 ms
 4  198.18.0.4     12.3 ms
 5  * * *
 6  * * *
```

## Empfangene Meldungen

| Zeit | Typ | von | Meldung |
| --- | --- | --- | --- |
| 00:05.518 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 00:07.244 | te | 192.0.2.1 | ICMP 11 time exceeded · hop 1 · 192.0.2.1 |
| 00:11.848 | te | 198.18.0.2 | ICMP 11 time exceeded · hop 2 · 198.18.0.2 |
| 00:16.752 | te | 198.18.0.3 | ICMP 11 time exceeded · hop 3 · 198.18.0.3 |
| 00:22.835 | te | 198.18.0.4 | ICMP 11 time exceeded · hop 4 · 198.18.0.4 |
| 00:57.651 | reply | 203.0.113.80 | echo reply from 203.0.113.80 |
| 01:03.968 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 01:08.268 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 01:12.244 | te | 192.0.2.1 | ICMP 11 time exceeded · hop 1 · 192.0.2.1 |
| 01:16.648 | te | 198.18.0.2 | ICMP 11 time exceeded · hop 2 · 198.18.0.2 |
| 01:21.552 | te | 198.18.0.3 | ICMP 11 time exceeded · hop 3 · 198.18.0.3 |
| 01:23.644 | te | 192.0.2.1 | ICMP 11 time exceeded · hop 1 · 192.0.2.1 |
| 01:25.235 | te | 198.18.0.4 | ICMP 11 time exceeded · hop 4 · 198.18.0.4 |
| 01:27.248 | te | 198.18.0.2 | ICMP 11 time exceeded · hop 2 · 198.18.0.2 |
| 01:31.552 | te | 198.18.0.3 | ICMP 11 time exceeded · hop 3 · 198.18.0.3 |
| 01:33.068 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 01:36.535 | te | 198.18.0.4 | ICMP 11 time exceeded · hop 4 · 198.18.0.4 |
| 01:47.544 | te | 192.0.2.1 | ICMP 11 time exceeded · hop 1 · 192.0.2.1 |
| 01:50.448 | te | 198.18.0.2 | ICMP 11 time exceeded · hop 2 · 198.18.0.2 |
| 01:53.707 | te | 198.18.0.13 | ICMP 11 time exceeded · hop 3 · 198.18.0.13 |
| 01:57.235 | te | 198.18.0.4 | ICMP 11 time exceeded · hop 4 · 198.18.0.4 |
| 02:09.944 | te | 192.0.2.1 | ICMP 11 time exceeded · hop 1 · 192.0.2.1 |
| 02:12.648 | te | 198.18.0.2 | ICMP 11 time exceeded · hop 2 · 198.18.0.2 |
| 02:15.957 | te | 198.18.0.13 | ICMP 11 time exceeded · hop 3 · 198.18.0.13 |
| 02:19.235 | te | 198.18.0.4 | ICMP 11 time exceeded · hop 4 · 198.18.0.4 |
| 02:30.868 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 02:36.068 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 02:45.968 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 02:47.368 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 02:53.168 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 02:57.244 | te | 192.0.2.1 | ICMP 11 time exceeded · hop 1 · 192.0.2.1 |
| 03:01.048 | te | 198.18.0.2 | ICMP 11 time exceeded · hop 2 · 198.18.0.2 |
| 03:04.957 | te | 198.18.0.13 | ICMP 11 time exceeded · hop 3 · 198.18.0.13 |
| 03:08.535 | te | 198.18.0.4 | ICMP 11 time exceeded · hop 4 · 198.18.0.4 |
| 04:13.168 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
| 04:16.668 | du | 198.18.0.2 | ICMP 3/0 net unreachable · from 198.18.0.2 |
