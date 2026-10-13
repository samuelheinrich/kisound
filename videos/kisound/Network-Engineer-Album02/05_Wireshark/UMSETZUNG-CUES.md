# Wireshark — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV `05_Wireshark_1.0.wav`.

61 Einstellungen (Schnittliste des Drehbuchs), 12 Kapitel, 825 Paketflüge (Originale, Mirror-Kopien, Bulk, Vergleich), 18 Output-Drops im Messfenster. Alle 40 Analyse-Events und 52 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Ablauf: IP-Filter 70,34 s · tcp.stream == 7 73,46 s · Befund 137,3 s · Bulk 95 → 20 Mbit/s 139,8 s · neuer Test 142,72 s · HTTP 200 157,26 s · Capture STOPPED 168,22 s.
Bass-Einsätze 35,85 · 89,15 · 146,95 · 178,05 s. Pegellücken 105,95–106,25, 143,45–143,75, 159,25–159,55 s. Umfeld abgedunkelt ab 189,8 s, Blende nach «Warum» ab 195,06 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Bei mir geht’s | Zwei Aussagen, zwei Standorte: der Vergleichspfad antwortet, der betroffene Client wartet hinter dem 100-Mbit/s-Uplink. |
| C02 | 00:24.960 | Capture läuft | Vorbereitete SPAN-Sessions auf SW-A und SW-B füllen BEFORE und AFTER. |
| C03 | 00:33.220 | Fremde Flows | Thesen im Chat, Mirror-Kopien in der Liste; der betroffene Tuple wird freigestellt. |
| C04 | 01:10.340 | Der richtige Stream | Displayfilter auf Client und Ziel, dann tcp.stream == 7 – Frames werden ausgeblendet, nicht gelöscht. |
| C05 | 01:29.320 | Zeig mir, was passiert | Paket für Paket durch die Schichten; Seq 10801, 12001, 13201. |
| C06 | 01:45.940 | Retransmission | O-101 geht raus und kommt nie an; O-102 trägt denselben Bytebereich. Der zweite Capture grenzt ein. |
| C07 | 02:04.680 | TLS bleibt dicht | Ohne Secrets kein Klartext; ein RST ist ein Hinweis, kein Urteil. |
| C08 | 02:17.300 | Der Befund | Bytebereich fehlt AFTER, +18 Output-Drops am SW-A-Uplink, null Capture-Drops. |
| C09 | 02:19.800 | Kontrollierter Versuch | Bulk-Quelle 95 → 20 Mbit/s, Uplink bleibt 100 Mbit/s. Derselbe Test mit neuer Verbindung. |
| C10 | 02:37.260 | Die Antwort kommt zurück | HTTP 200 am Testclient, beidseitige Segmente, Drop-Delta 0. |
| C11 | 02:48.220 | Capture stoppen | Mitschnitte gestoppt und gesichert, Bericht mit Ursache und Versuch. |
| C12 | 03:07.900 | Warum | Der dokumentierte Verlust an der überlasteten Ausgangsqueue. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:05.890 | net / rack | open | – | E001 | – |
| S002 | 00:05.890 | 00:11.780 | net / span | mirrors | f:BG1 | – | – |
| S003 | 00:11.780 | 00:13.220 | net / target | works | – | E002 | L001 |
| S004 | 00:13.220 | 00:17.440 | net / target | waits | – | – | L002 |
| S005 | 00:17.440 | 00:24.960 | net / span | follow | f:MB101 | E003, E004 | – |
| S006 | 00:24.960 | 00:26.540 | gui / list | running | – | – | L003 |
| S007 | 00:26.540 | 00:33.220 | net / span | copy | f:MBG2 | – | L004 |
| S008 | 00:33.220 | 00:36.140 | net / target | spinner | – | E005, E006, E007 | L005 |
| S009 | 00:36.140 | 00:41.740 | net / target | ready | – | E008 | L006 |
| S010 | 00:41.740 | 00:44.500 | gui / list | theses | – | – | L007 |
| S011 | 00:44.500 | 00:50.640 | compare / front | empty | – | E009 | L008 |
| S012 | 00:50.640 | 00:53.760 | net / span | session | f:O200 | – | L009 |
| S013 | 00:53.760 | 01:00.000 | gui / list | row | – | E010 | L010 |
| S014 | 01:00.000 | 01:02.720 | gui / list | foreign | – | – | L011 |
| S015 | 01:02.720 | 01:10.340 | layers / macro | select | – | – | L012 |
| S016 | 01:10.340 | 01:13.460 | gui / list | ipfilter | – | E011, E012, E013 | L013 |
| S017 | 01:13.460 | 01:18.040 | gui / list | stream | – | – | L014 |
| S018 | 01:18.040 | 01:21.020 | gui / list | hide | – | E014 | L015 |
| S019 | 01:21.020 | 01:24.740 | gui / list | kept | – | E015 | L016 |
| S020 | 01:24.740 | 01:29.320 | layers / macro | unfold | – | E016 | – |
| S021 | 01:29.320 | 01:30.180 | gui / list | hook1 | – | E017 | L017 |
| S022 | 01:30.180 | 01:32.500 | layers / macro | three | – | E018 | L018 |
| S023 | 01:32.500 | 01:34.860 | gui / list | seqs | – | – | L019 |
| S024 | 01:34.860 | 01:37.160 | net / queue | toward | – | – | L020 |
| S025 | 01:37.160 | 01:38.860 | gui / list | hook2 | – | – | L021 |
| S026 | 01:38.860 | 01:41.440 | compare / front | theses2 | – | – | L022 |
| S027 | 01:41.440 | 01:43.660 | layers / macro | follow | – | – | L023 |
| S028 | 01:43.660 | 01:45.940 | compare / front | next | – | E019 | L024 |
| S029 | 01:45.940 | 01:48.780 | net / span | lost | f:RO101 | E020, E021 | L025 |
| S030 | 01:48.780 | 01:50.960 | gui / list | retrans | – | – | L026 |
| S031 | 01:50.960 | 01:53.400 | layers / macro | hint | – | – | L027 |
| S032 | 01:53.400 | 01:55.320 | net / queue | hypo | – | – | L028 |
| S033 | 01:55.320 | 01:57.840 | net / span | reach | f:RO102 | – | L029 |
| S034 | 01:57.840 | 01:59.620 | compare / front | limit | – | – | L030 |
| S035 | 01:59.620 | 02:02.140 | net / rack | second | – | – | L031 |
| S036 | 02:02.140 | 02:04.680 | compare / front | merge | – | E022 | L032 |
| S037 | 02:04.680 | 02:06.740 | layers / macro | tls | – | E023 | L033 |
| S038 | 02:06.740 | 02:09.100 | gui / list | secrets | – | – | L034 |
| S039 | 02:09.100 | 02:11.600 | layers / macro | headers | – | – | L035 |
| S040 | 02:11.600 | 02:13.520 | layers / macro | closed | – | – | L036 |
| S041 | 02:13.520 | 02:15.700 | gui / list | rst | – | – | L037 |
| S042 | 02:15.700 | 02:17.300 | layers / macro | rsthint | – | – | L038 |
| S043 | 02:17.300 | 02:19.800 | compare / front | finding | – | – | L039 |
| S044 | 02:19.800 | 02:22.720 | net / queue | limit | – | E024 | L040 |
| S045 | 02:22.720 | 02:23.380 | net / span | newtest | f:N1 | E025 | L041 |
| S046 | 02:23.380 | 02:25.740 | net / queue | passes | f:N1 | – | L042 |
| S047 | 02:25.740 | 02:28.280 | compare / front | both | – | – | L043 |
| S048 | 02:28.280 | 02:31.660 | net / queue | nodrop | – | E026 | L044 |
| S049 | 02:31.660 | 02:32.380 | gui / list | hook4 | – | – | L045 |
| S050 | 02:32.380 | 02:34.940 | compare / front | fits | – | – | L046 |
| S051 | 02:34.940 | 02:37.260 | gui / list | answer | – | – | L047 |
| S052 | 02:37.260 | 02:39.160 | net / target | http200 | – | E027, E028 | L048 |
| S053 | 02:39.160 | 02:48.220 | compare / front | window | – | E029, E030 | – |
| S054 | 02:48.220 | 02:52.380 | gui / list | stop | – | E031 | L049 |
| S055 | 02:52.380 | 02:53.500 | gui / list | save | – | – | L050 |
| S056 | 02:53.500 | 02:57.040 | compare / front | report | – | E032 | L051 |
| S057 | 02:57.040 | 03:02.473 | gui / list | files | – | E033 | – |
| S058 | 03:02.473 | 03:07.907 | compare / front | beforeafter | – | E034 | – |
| S059 | 03:07.907 | 03:13.340 | net / queue | why | – | E035 | – |
| S060 | 03:13.340 | 03:15.060 | net / queue | warum | – | E036, E037 | L052 |
| S061 | 03:15.060 | 03:15.733 | net / queue | end | – | E038, E039, E040 | – |

## Simulierte PCAP-Zeilen

**BEFORE (SW-A, Stream 7)**

| No. | Time | Source | Destination | Protocol | Info |
| --- | --- | --- | --- | --- | --- |
| 96 | 11.8012 | 192.0.2.40 | 198.51.100.50 | TCP | 40112 → 8443 [ACK] Seq=5524801 Len=1460 |
| 97 | 11.8210 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=9601 Ack=4381 Len=1200 |
| 98 | 11.8452 | 198.51.100.20 | 192.0.2.10 | TCP | 443 → 51000 [ACK] Seq=4381 Ack=10801 Len=0 |
| 99 | 11.9020 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=10801 Ack=4381 Len=1200 |
| 100 | 11.9533 | 192.0.2.30 | 198.51.100.20 | TLSv1.3 | Application Data |
| 101 | 12.0010 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=12001 Ack=4381 Len=1200 |
| 102 | 12.2510 | 192.0.2.10 | 198.51.100.20 | TCP | [TCP Retransmission] 51000 → 443 [ACK] Seq=12001 Len=1200 |
| 103 | 12.2610 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=13201 Ack=4381 Len=1200 |
| 104 | 12.2894 | 198.51.100.20 | 192.0.2.10 | TCP | 443 → 51000 [ACK] Seq=4381 Ack=14401 Len=0 |
| 105 | 12.3011 | 192.0.2.30 | 198.51.100.20 | TCP | 51522 → 443 [RST] Seq=2201 Len=0 |

**AFTER (SW-B, Stream 3)**

| No. | Time | Source | Destination | Protocol | Info |
| --- | --- | --- | --- | --- | --- |
| 84 | 11.8221 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=9601 Ack=4381 Len=1200 |
| 85 | 11.9031 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=10801 Ack=4381 Len=1200 |
| 86 | 11.9544 | 192.0.2.30 | 198.51.100.20 | TLSv1.3 | Application Data |
| 87 | 12.2521 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=12001 Ack=4381 Len=1200 |
| 88 | 12.2621 | 192.0.2.10 | 198.51.100.20 | TCP | 51000 → 443 [ACK] Seq=13201 Ack=4381 Len=1200 |
| 89 | 12.2883 | 198.51.100.20 | 192.0.2.10 | TCP | 443 → 51000 [ACK] Seq=4381 Ack=14401 Len=0 |

## Benannte Pakete

| ID | Name | Art | Start | Ende | Ausgang |
| --- | --- | --- | --- | --- | --- |
| BG1 | Original · weiss | orig | 00:06.000 | 00:09.200 | deliver |
| M-B-BG1 | Mirror-Kopie · gestrichelt | mirror | 00:06.567 | 00:07.967 | deliver |
| O-101 | O-101 · Seq=12001 | orig | 00:16.900 | 00:17.842 | drop |
| M-B-O-101 | M-B101 | mirror | 00:17.467 | 00:18.867 | deliver |
| O-102 | O-102 · Retransmission | orig | 00:20.600 | 00:23.800 | deliver |
| M-B-O-102 | M-B102 | mirror | 00:21.167 | 00:22.567 | deliver |
| M-A-O-102 | M-A102 | mirror | 00:22.858 | 00:24.258 | deliver |
| M-B-MBG2x | Mirror-Kopie → BEFORE | mirror | 00:27.567 | 00:28.967 | deliver |
| O200 | Original → Uplink | orig | 00:50.900 | 00:54.100 | deliver |
| M-B-O200 | Kopie → Gi1/0/24 | mirror | 00:51.467 | 00:52.867 | deliver |
| RO101 | O-101 · Wiedergabe | orig (Wiedergabe) | 01:45.600 | 01:46.542 | drop |
| M-B-RO101 | M-B101 · Wiedergabe | mirror (Wiedergabe) | 01:46.167 | 01:47.567 | deliver |
| RO102 | O-102 · Wiedergabe | orig (Wiedergabe) | 01:55.500 | 01:58.700 | deliver |
| M-B-RO102 | M-B102 | mirror (Wiedergabe) | 01:56.067 | 01:57.467 | deliver |
| M-A-RO102 | M-A102 · AFTER | mirror (Wiedergabe) | 01:57.758 | 01:59.158 | deliver |
| N1 | Neuer Test · SYN 51001 | orig | 02:23.000 | 02:26.000 | deliver |
| M-B-N1 | M-B (neu) | mirror | 02:23.531 | 02:24.931 | deliver |
| M-A-N1 | M-A (neu) | mirror | 02:25.117 | 02:26.517 | deliver |
| N1R | SYN/ACK | orig | 02:26.300 | 02:29.300 | deliver |
| N2 | GET /health (TLS) | orig | 02:29.600 | 02:32.600 | deliver |
| N2R | HTTP-Antwort (TLS) | orig | 02:34.060 | 02:37.260 | deliver |

## Bildschirmtexte

**B01 · SPAN-Sessions (vorbereitet)** (24,96–60 s)
```
[ 25.10] SW-A# show monitor session 1
[ 25.80] Type              : Local Session
[ 25.80] Source Ports      : RX Only: Gi1/0/7,Gi1/0/8,Gi1/0/48
[ 25.80] Destination Ports : Gi1/0/24
[ 50.80] SW-A: monitor session 1 source interface Gi1/0/7 - 8 rx
[ 50.80] SW-A: monitor session 1 source interface Gi1/0/48 rx
[ 50.80] SW-A: monitor session 1 destination interface Gi1/0/24
[ 51.40] SW-B: … source Gi1/0/48 rx, Gi1/0/7 rx → destination Gi1/0/24
```

**B02 · Displayfilter (kein Capturefilter)** (70,34–89,32 s)
```
[ 70.40] Display filter:
[ 70.40] ip.addr == 192.0.2.10 && ip.addr == 198.51.100.20 && tcp.port == 443
[ 73.50] Danach im BEFORE-PCAP:
[ 73.50] tcp.stream == 7
[ 74.40] Status: Packets 8400 | Displayed 92 | Dropped 0
```

**B03 · BEFORE / AFTER** (105,94–124,68 s)
```
[106.10] Simulierte PCAP-Zeilen; relative TCP-Sequenznummern
[106.10] BEFORE (Stream 7):
[106.30] 101  12.0010  …10 → …20  Seq=12001 Len=1200
[108.90] 102  12.2510  [TCP Retransmission] Seq=12001 Len=1200
[117.90] AFTER (Stream 3):
[117.90]  87  12.2521  …10 → …20  Seq=12001 Len=1200
[122.20] Overlay: erster Bytebereich BEFORE vorhanden / AFTER fehlt
[122.20] Capturezeit ist Messzeit, nicht Filmzeit
```

**B04 · Protokollbaum · ohne Secrets** (124,68–133,52 s)
```
[124.80] Transmission Control Protocol
[124.80]  Src Port: 51000    Dst Port: 443
[124.80]  Sequence Number: 12001 (relative)
[124.80]  TCP Segment Len: 1200
[129.20] Transport Layer Security
[129.20]  Application Data
[129.20] TLS secrets: nicht vorhanden | Payload verschlüsselt
```

**B05 · Befund** (137,3–151,66 s)
```
[137.40] SW-A# show interfaces GigabitEthernet1/0/48
[138.00] GigabitEthernet1/0/48 is up, line protocol is up
[138.00]   Full-duplex, 100Mb/s
[138.00]   Total output drops: 3818
[143.50] Overlay Messfenster: 3800 -> 3818 (Delta +18)
[143.50] BEFORE Capture-Drops: 0    AFTER Capture-Drops: 0
[143.50] Mirror-Ports: 1 Gbit/s; gespiegelte Last unter Kapazität
[144.20] Befund: Verlust am SW-A-Uplink-Ausgang unter Konkurrenzlast
```

**B06 · Kontrollierter Versuch** (139,8–168,22 s)
```
[139.90] Kontrollierter Versuch: Bulk-Quelle 95 -> 20 Mbit/s
[139.90] Uplink unverändert: 100 Mbit/s
[142.80] client$ curl --connect-timeout 3 --max-time 5 --resolve app.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app.example/health
[142.90] Neuer Tuple: 192.0.2.10:51001 -> 198.51.100.20:443
[157.26] {"status":"ok"}
[157.26] HTTP 200
[157.66] Messfenster: Testsegmente BEFORE+AFTER | Output-Drop-Delta 0
[157.66] HTTP 200: lokales Clientergebnis, kein TLS-Klartext im Capture
```

**B07 · Gesichert** (168,22–189,8 s)
```
[168.22] Capture: STOPPED
[172.50] before.pcapng | after.pcapng | counters-before-after.txt
[173.60] report.txt: Uplink-Output-Verlust unter konkurrierender Last
[173.60] Kontrollversuch mit reduzierter Konkurrenz: erfolgreich
[173.60] TLS-Payload weiterhin verschlüsselt
```

## Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 00:16.900 | cap | BEFORE: Seq=12001 Len=1200 gespiegelt (M-B101) |
| 00:17.700 | drop | SW-A Gi1/0/48: Output-Drop (Queue voll) |
| 00:20.600 | cap | O-102: Retransmission desselben Bytebereichs |
| 01:10.340 | flt | Displayfilter gesetzt – Frames bleiben im Mitschnitt |
| 01:45.950 | rec | Wiedergabe aus dem Mitschnitt: O-101 erreicht AFTER nie |
| 01:55.600 | rec | Wiedergabe: O-102 erscheint in BEFORE und AFTER |
| 02:17.300 | find | Befund: Delta +18 Output-Drops · Capture-Drops 0 · AFTER fehlt der Bytebereich |
| 02:19.800 | cfg | Bulk-Quelle 95 → 20 Mbit/s (Uplink bleibt 100 Mbit/s) |
| 02:23.020 | cap | Neuer Test 192.0.2.10:51001 → 198.51.100.20:443 |
| 02:37.260 | ok | HTTP 200 am Testclient · Output-Drop-Delta 0 |
| 02:48.220 | cap | Capture STOPPED · before.pcapng / after.pcapng gesichert |
