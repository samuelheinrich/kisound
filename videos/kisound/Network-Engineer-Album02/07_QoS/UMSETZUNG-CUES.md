# QoS — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV `07_QoS_1.0.wav`.

57 Einstellungen (Schnittliste des Drehbuchs), 10 Kapitel, 6 benannte Träger (Simulation: 1890 Träger, 10 Policer-Drops, 0 Live-Tail-Drops). Alle 42 Analyse-Events und 44 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Bass-Einsätze 44,85 · 134,15 · 152,75 · 182,55 · 197,35 · 212,25 · 223,85 s. Pegellücken 128,9–129,1, 130,8–131, 197–197,3, 212,1–212,2, 223,7–223,8 s. Blende ab 233,1 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Zwei Flows, ein Draht | RTP links, Backup rechts; beide schon klassifiziert. Gemeinsamer Engpass 100 Mbit/s. |
| C02 | 00:13.300 | Quality of Service | EF/46 und Best Effort/0 – nicht alles gleich. Die Markierung wirkt nur mit der passenden Policy. |
| C03 | 00:31.200 | Die Policy | INGRESS, CHILD, PARENT: Klassifizierung, Markierung, Policer, Priority, Fair-Queue, Shaper. |
| C04 | 00:58.100 | Bulk | TCP zählt Bytes; ein gespeichertes Verlustfenster zeigt Q-B17, Q-B18 ist eine neue Retransmission. |
| C05 | 01:28.880 | Policing | RTP-Burst 1,2 Mbit/s: 1,0 konform, 0,2 Überschuss wird endgültig verworfen. |
| C06 | 01:44.140 | Shaping | Der Parent-Shaper hält Q-BS im Puffer und gibt es später genau einmal aus. |
| C07 | 02:06.100 | Classify · Mark · Queue | Ein neuer RTP-Frame durch Klassifizierung, Markierung und Priority-Queue. |
| C08 | 02:21.100 | Schedule · Shape · Send | Scheduler-Wahl, Shaper-Budget, Serialisierung am gemeinsamen Port. |
| C09 | 02:31.150 | Final Chorus | Beide Klassen aktiv, Policy unverändert; RTP-Empfang und steigende TCP-ACKs. |
| C10 | 03:15.200 | Hörst du mich? | Klar und deutlich – der Transfer läuft noch. Passt. |

## Benannte Träger

| Name | Klasse | Eingang | Policer | Queue | Ausgabe | Empfang | Ausgang |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q-R1 | rtp | 00:41.200 | 00:42.981 | 00:43.600 | 00:43.610 | 00:45.960 | deliver |
| Q-B17 | tcp | 00:58.100 | – | 01:05.600 | – | – | taildrop (gespeichertes Fenster) |
| Q-B18 | tcp | 01:08.660 | – | 01:10.260 | 01:20.710 | 01:23.210 | deliver |
| Q-RX | rtp | 01:28.839 | 01:30.620 | – | – | – | police |
| Q-BS | tcp | 01:42.360 | – | 01:43.960 | 01:54.410 | 01:56.910 | deliver |
| Q-RN | rtp | 02:05.200 | 02:09.350 | 02:09.780 | 02:09.860 | 02:12.210 | deliver |

## Einstellungen

| Shot | Start | Ende | Raum / Station | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:06.650 | hall / hall | E001 | – |
| S002 | 00:06.650 | 00:13.300 | hall / class | – | – |
| S003 | 00:13.300 | 00:15.480 | hall / hall | E002 | L001 |
| S004 | 00:15.480 | 00:20.920 | hall / class | – | L002 |
| S005 | 00:20.920 | 00:22.520 | hall / sched | – | L003 |
| S006 | 00:22.520 | 00:28.380 | hall / queue | – | L004 |
| S007 | 00:28.380 | 00:31.200 | hall / hall | – | L005 |
| S008 | 00:31.200 | 00:35.240 | hall / sched | – | L006 |
| S009 | 00:35.240 | 00:38.480 | hall / class | – | L007 |
| S010 | 00:38.480 | 00:40.900 | hall / sched | – | L008 |
| S011 | 00:40.900 | 00:46.633 | hall / queue | E003, E004 | – |
| S012 | 00:46.633 | 00:52.367 | hall / sched | E005 | – |
| S013 | 00:52.367 | 00:58.100 | hall / tcp | – | – |
| S014 | 00:58.100 | 01:01.500 | hall / tcp | E006, E007, E008 | L009 |
| S015 | 01:01.500 | 01:05.380 | hall / tcp | – | L010 |
| S016 | 01:05.380 | 01:08.600 | hall / queue | – | L011 |
| S017 | 01:08.600 | 01:12.700 | hall / tcp | E009 | L012 |
| S018 | 01:12.700 | 01:16.040 | hall / queue | – | L013 |
| S019 | 01:16.040 | 01:20.100 | hall / sched | – | L014 |
| S020 | 01:20.100 | 01:23.400 | hall / ziel | E010, E011 | L015 |
| S021 | 01:23.400 | 01:28.880 | hall / tcp | E012 | L016 |
| S022 | 01:28.880 | 01:30.620 | hall / police | E013 | L017 |
| S023 | 01:30.620 | 01:35.480 | hall / police | – | L018 |
| S024 | 01:35.480 | 01:37.940 | hall / police | – | L019 |
| S025 | 01:37.940 | 01:44.140 | hall / class | – | L020 |
| S026 | 01:44.140 | 01:47.040 | hall / queue | – | L021 |
| S027 | 01:47.040 | 01:51.080 | hall / queue | – | L022 |
| S028 | 01:51.080 | 01:53.680 | hall / sched | – | L023 |
| S029 | 01:53.680 | 01:57.120 | hall / queue | E014 | L024 |
| S030 | 01:57.120 | 02:06.100 | hall / police | E015 | – |
| S031 | 02:06.100 | 02:07.840 | hall / class | E016, E017 | L025 |
| S032 | 02:07.840 | 02:09.780 | hall / class | E018 | L026 |
| S033 | 02:09.780 | 02:10.480 | hall / queue | – | L027 |
| S034 | 02:10.480 | 02:13.140 | hall / sched | – | L028 |
| S035 | 02:13.140 | 02:21.100 | hall / tcp | E019 | – |
| S036 | 02:21.100 | 02:22.720 | hall / sched | – | L029 |
| S037 | 02:22.720 | 02:23.640 | hall / sched | – | L030 |
| S038 | 02:23.640 | 02:25.200 | hall / hall | – | L031 |
| S039 | 02:25.200 | 02:31.150 | hall / tcp | E020 | L032 |
| S040 | 02:31.150 | 02:32.700 | hall / hall | E021, E022 | L033 |
| S041 | 02:32.700 | 02:38.930 | hall / class | E023 | L034 |
| S042 | 02:38.930 | 02:40.060 | hall / sched | – | L035 |
| S043 | 02:40.060 | 02:45.940 | hall / queue | E024 | L036 |
| S044 | 02:45.940 | 02:49.000 | hall / hall | – | L037 |
| S045 | 02:49.000 | 02:53.020 | hall / sched | E025 | L038 |
| S046 | 02:53.020 | 02:56.420 | hall / ziel | – | L039 |
| S047 | 02:56.420 | 02:58.440 | hall / tcp | E026 | L040 |
| S048 | 02:58.440 | 03:06.820 | hall / sched | E027, E028 | – |
| S049 | 03:06.820 | 03:15.200 | hall / ziel | – | – |
| S050 | 03:15.200 | 03:16.820 | hall / ziel | E029 | L041 |
| S051 | 03:16.820 | 03:23.770 | hall / ziel | E030, E031, E032 | – |
| S052 | 03:23.770 | 03:30.720 | hall / tcp | E033 | – |
| S053 | 03:30.720 | 03:35.980 | hall / ziel | E034 | L042 |
| S054 | 03:35.980 | 03:42.340 | hall / tcp | – | L043 |
| S055 | 03:42.340 | 03:43.740 | hall / hall | – | L044 |
| S056 | 03:43.740 | 03:51.397 | hall / hall | E035, E036, E037, E038 | – |
| S057 | 03:51.397 | 03:59.054 | hall / sched | E039, E040, E041, E042 | – |

## Bildschirmtexte

**B01 · Markierung und Kapazität** (13,3–40,9 s)
```
[ 13.40] RTP: 192.0.2.10 -> 198.51.100.10 UDP dst 5004
[ 13.40] DSCP EF = 46 | ECN 0 | DS-Feld 0xb8
[ 13.40] Backup: 192.0.2.11 -> 198.51.100.50 TCP dst 443
[ 13.40] DSCP Best Effort = 0
[ 13.40] Physischer Port 1 Gbit/s | Vertrags-/Shaperrate 100 Mbit/s
```

**B02 · aktive Policy (vorhanden, nicht neu eingegeben)** (31,2–88,88 s)
```
[ 31.20] ip access-list extended RTP-TRUSTED
[ 31.20]  permit udp host 192.0.2.10 host 198.51.100.10 eq 5004
[ 31.20] class-map match-all REALTIME-IN
[ 31.20]  match access-group name RTP-TRUSTED
[ 31.20] class-map match-all EF-OUT
[ 31.20]  match dscp ef
[ 40.90] policy-map INGRESS
[ 40.90]  class REALTIME-IN
[ 40.90]   set dscp ef
[ 40.90]   police cir 1000000 bc 31250
[ 40.90]    conform-action transmit
[ 40.90]    exceed-action drop
[ 52.37]  class class-default
[ 52.37]   set dscp default
[ 52.37] interface GigabitEthernet0/0/0
[ 52.37]  service-policy input INGRESS
[ 64.00] policy-map CHILD
[ 64.00]  class EF-OUT
[ 64.00]   priority 1000
[ 64.00]  class class-default
[ 64.00]   bandwidth remaining percent 100
[ 64.00]   fair-queue
[ 76.04] policy-map PARENT
[ 76.04]  class class-default
[ 76.04]   shape average 100000000
[ 76.04]   service-policy CHILD
[ 76.04] interface GigabitEthernet0/0/1
[ 76.04]  service-policy output PARENT
```

**B03 · Policer und Shaper** (88,88–126,1 s)
```
[ 89.00] R-QOS# show policy-map interface GigabitEthernet0/0/0 input
[ 89.60]  Service-policy input: INGRESS
[ 89.60]   Class-map: REALTIME-IN
[ 89.60]    police: cir 1000000 bps, bc 31250 bytes
[ 90.62]     conformed 1000 packets; actions: transmit
[ 90.62]     exceeded 200 packets; actions: drop
[ 97.94] Overlay Burst: angeboten 1.2 Mbit/s, konform 1.0, drop 0.2
[ 97.94] Danach RTP-Angebot wieder 0.2 Mbit/s
[104.20] R-QOS# show policy-map interface GigabitEthernet0/0/1 output
[104.80]  Service-policy output: PARENT
[104.80]   shape (average) cir 100000000
[104.80]    Service-policy : CHILD
[104.80]     Class-map: EF-OUT | Priority: 1000 kbps
[104.80]     Class-map: class-default | bandwidth remaining 100%
```

**B04 · Messfenster (Szenario)** (151,15–223,74 s)
```
[151.30] Szenario-Messfenster (keine garantierten Produktwerte)
[151.30] erwartet: RTP angeboten/empfangen 0.2 Mbit/s
[151.30] erwartet: Bulk nutzt verbleibende Freigaben; ACK steigt
[151.30] erwartet: Gemeinsame langfristige Ausgabe <= 100 Mbit/s
[151.30] Policy INGRESS / CHILD / PARENT unverändert
[173.02] RTP angeboten/empfangen: 0.2 Mbit/s
[173.02] Bulk nutzt verbleibende Freigaben; ACK-Bytes steigen
[173.02] Gemeinsame langfristige Ausgabe: <= 100 Mbit/s
[173.42] RTP-Queue-Beispiel: 2 Pakete | Bulk-Queue-Beispiel: 48 Pakete
[173.82] Policer-Drop Q-RX: endgültig
[173.82] Shaper-Paket Q-BS: später ausgegeben
```

## Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 00:13.300 | cls | INGRESS: RTP → EF/46 · Backup → BE/0 |
| 00:52.370 | rec | Gespeichertes Verlustfenster (datiert) geöffnet |
| 01:05.600 | rec | Q-B17 Seq 24001 Len 1200: Tail-Drop bei voller Queue |
| 01:08.600 | tcp | Q-B18: Retransmission Seq 24001 Len 1200 (neuer Frame) |
| 01:23.210 | ok | Q-B18 angekommen · ACK 25201 |
| 01:28.880 | pol | RTP-Burst 1,2 Mbit/s an INGRESS-Policer |
| 01:30.620 | pol | exceed-action drop: Q-RX endgültig verworfen |
| 01:36.080 | pol | RTP-Angebot wieder 0,2 Mbit/s |
| 01:44.140 | shp | PARENT shape average 100 Mbit/s: Q-BS wartet auf Budget |
| 01:54.410 | shp | Q-BS verlässt die Queue (einmal) |
| 02:53.020 | ok | RTP-Empfang vollständig · TCP-ACKs steigen |
