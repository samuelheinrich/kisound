# Firewall State Table — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV.
93 Einstellungen, 11 Kapitel, 24 Sessions, 216 Paketflüge, 25 verworfene Pakete. Alle 44 Analyse-Events und 59 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Bass-Einsätze: 24,95 · 45,65 · 84,95 · 105,25 · 126,35 · 167,75 · 195,25 · 215,55 · 229,05 s. Pegellücke 228,35–228,45 s. Blocklist-Regel ab 96 s. Schlussblende ab 256,8 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Default deny | Geschlossene Mauer, ruhendes Tor. Die erste Session öffnet sich, ein einzelnes unaufgefordertes Paket stirbt am Tor. |
| C02 | 00:24.400 | Verkehr | Der Bass setzt ein: Clients öffnen Sessions, die State Table füllt sich, Rückpakete nehmen den Fast Path. Ein Scanner klopft. |
| C03 | 00:50.600 | Policy und State | Default deny, Regeln von oben nach unten, 5-Tupel, TCP-Handshake, UDP ohne Antwort, die Tabelle entscheidet. |
| C04 | 01:10.740 | NAT und Inspection | Source NAT versteckt die Inside-Adresse, Destination NAT leitet auf die DMZ, DPI liest mit. |
| C05 | 01:18.640 | Drop it · Log it · Block it | Scanner-Welle ohne Bass: verwerfen, loggen, sperren. Ein ACK ohne Session findet keinen Eintrag. Eine neue Regel wird geschrieben. |
| C06 | 01:36.460 | Least privilege | Das Tor dreht sich, nur wenige präzise Wege sind offen. Jede Session hinterlässt eine Spur im Log. |
| C07 | 02:03.500 | Übersetzung | ACL, NAT-Reflection (Hairpin), Inside local / outside global, DPI: ein sauberer Download passiert, die EICAR-Testsignatur schliesst die Session. |
| C08 | 02:26.920 | Break | SYN, ACK, Session match, Deny, Permit, Log, Source NAT, Destination NAT, TCP, UDP – je ein Bild im Kontrollraum. |
| C09 | 02:44.780 | Rausch | Volle Fahrt durch das Tor, alle Sessions aktiv. |
| C10 | 03:03.100 | Lock it | Final Hook: Der Scanner stirbt sofort an der Blocklist, die Regel steht. |
| C11 | 03:15.000 | Sessions schliessen | FIN, Timeouts, die Tabelle leert sich. Kurzer Lichtabfall in der Pegellücke, letzte Fahrt, Titel, zurück zu default deny. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:04.800 | gate / opening | intro | – | E001, E002 | – |
| S002 | 00:04.800 | 00:09.940 | gate / portal | intro | – | – | – |
| S003 | 00:09.940 | 00:13.100 | ledger / table | open | – | E003 | L001 |
| S004 | 00:13.100 | 00:16.500 | gate / ride | state | f:D0q | E004 | L002 |
| S005 | 00:16.500 | 00:20.040 | gate / wall | deny | – | – | – |
| S006 | 00:20.040 | 00:23.150 | gate / chase | alone | f:Z0 | E005 | L003, L004 |
| S007 | 00:23.150 | 00:24.400 | gate / portal | alone | – | E006, E007 | – |
| S008 | 00:24.400 | 00:28.350 | gate / wide | flow | – | – | – |
| S009 | 00:28.350 | 00:32.150 | gate / ride | flow | f:T1syn | E008 | – |
| S010 | 00:32.150 | 00:34.250 | gate / chase | flow | f:T1sa | – | – |
| S011 | 00:34.250 | 00:37.000 | ledger / table | flow | – | – | – |
| S012 | 00:37.000 | 00:41.000 | gate / orbit | calm | – | – | – |
| S013 | 00:41.000 | 00:44.900 | gate / scanner | knock | f:X1 | E009 | – |
| S014 | 00:44.900 | 00:48.000 | gate / ride | flow2 | f:T2syn | E010 | – |
| S015 | 00:48.000 | 00:50.600 | gate / wide2 | flow2 | – | – | – |
| S016 | 00:50.600 | 00:54.000 | gate / wall | deny2 | – | E011, E012 | L005 |
| S017 | 00:54.000 | 00:57.160 | ledger / policy | chain | – | – | L006 |
| S018 | 00:57.160 | 00:59.260 | ledger / packet | tuple | – | – | L007 |
| S019 | 00:59.260 | 01:01.250 | gate / portal | wrong | f:Z1 | E013 | L008 |
| S020 | 01:01.250 | 01:04.460 | gate / flyby | verse | f:T3syn | – | – |
| S021 | 01:04.460 | 01:05.600 | ledger / ladder | tcp | – | – | L009 |
| S022 | 01:05.600 | 01:07.260 | gate / ride | udp | f:U1.2 | – | L010 |
| S023 | 01:07.260 | 01:08.920 | gate / rings | policy | – | E014 | L011 |
| S024 | 01:08.920 | 01:10.740 | ledger / table | state | – | – | L012 |
| S025 | 01:10.740 | 01:12.840 | gate / nat | snat | f:T4syn | E015 | L013 |
| S026 | 01:12.840 | 01:14.580 | gate / nat | dnat | f:T5syn | – | L014 |
| S027 | 01:14.580 | 01:16.180 | gate / dpi | dpi | f:T1d5 | E016 | L015 |
| S028 | 01:16.180 | 01:18.640 | ledger / policy | verdict | – | – | L016 |
| S029 | 01:18.640 | 01:21.500 | gate / portal | hook | – | E017 | L017 |
| S030 | 01:21.500 | 01:24.950 | gate / scanner | hook | f:X3 | E018 | L018, L019 |
| S031 | 01:24.950 | 01:26.340 | gate / wide | hook | – | – | L020 |
| S032 | 01:26.340 | 01:28.350 | gate / rings | hook | – | E019 | L021, L022, L023 |
| S033 | 01:28.350 | 01:29.080 | ledger / log | hook | – | – | – |
| S034 | 01:29.080 | 01:32.100 | gate / portal | hook | – | – | L024, L025, L026, L027 |
| S035 | 01:32.100 | 01:33.860 | gate / scanner | nomatch | f:X7 | – | L028 |
| S036 | 01:33.860 | 01:35.420 | gate / rings | hook | – | – | L029, L030, L031 |
| S037 | 01:35.420 | 01:36.460 | ledger / policy | write | – | – | L032 |
| S038 | 01:36.460 | 01:37.800 | gate / orbit | chorus | – | E020 | – |
| S039 | 01:37.800 | 01:41.500 | gate / wide | calm | – | E021, E022 | – |
| S040 | 01:41.500 | 01:43.500 | gate / ride | chorus | f:T6syn | – | – |
| S041 | 01:43.500 | 01:45.250 | gate / portal | chorus | – | – | – |
| S042 | 01:45.250 | 01:48.300 | gate / flyby | chorus | f:T6d1 | – | – |
| S043 | 01:48.300 | 01:51.240 | gate / wide2 | chorus | – | – | – |
| S044 | 01:51.240 | 01:53.960 | gate / wall | trust | – | E023 | L033 |
| S045 | 01:53.960 | 01:57.340 | gate / topdown | least | – | – | L034 |
| S046 | 01:57.340 | 02:00.160 | gate / ride | app | f:T7syn | – | L035 |
| S047 | 02:00.160 | 02:01.600 | ledger / packet | app | – | – | L036 |
| S048 | 02:01.600 | 02:03.500 | ledger / log | sign | – | – | L037 |
| S049 | 02:03.500 | 02:06.350 | gate / orbit | inst | – | E024, E025 | – |
| S050 | 02:06.350 | 02:10.440 | gate / ride | inst | f:T8syn | – | – |
| S051 | 02:10.440 | 02:13.720 | gate / acl | acl | – | E026 | L038 |
| S052 | 02:13.720 | 02:15.380 | gate / hairpin | hairpin | f:H1syn | – | L039 |
| S053 | 02:15.380 | 02:17.100 | ledger / nat | terms | – | – | L040 |
| S054 | 02:17.100 | 02:18.520 | gate / ride | mobile | f:T9syn | – | L041 |
| S055 | 02:18.520 | 02:20.380 | gate / dpi | dpi2 | f:E1d1 | – | L042 |
| S056 | 02:20.380 | 02:22.100 | ledger / packet | layers | – | – | L043 |
| S057 | 02:22.100 | 02:23.760 | gate / dpi | verdict2 | f:E1d2 | – | L044 |
| S058 | 02:23.760 | 02:26.920 | gate / portal | close | – | – | L045 |
| S059 | 02:26.920 | 02:28.800 | ledger / ladder | syn | – | E027 | L046 |
| S060 | 02:28.800 | 02:30.500 | ledger / ladder | ack | – | – | L047 |
| S061 | 02:30.500 | 02:33.040 | ledger / table | match | – | – | L048 |
| S062 | 02:33.040 | 02:34.600 | gate / portal | deny3 | – | – | L049 |
| S063 | 02:34.600 | 02:35.240 | gate / portal | permit | – | – | L050 |
| S064 | 02:35.240 | 02:36.020 | ledger / log | log | – | – | L051 |
| S065 | 02:36.020 | 02:38.380 | ledger / nat | snat2 | – | – | L052 |
| S066 | 02:38.380 | 02:39.400 | ledger / nat | dnat2 | – | – | L053 |
| S067 | 02:39.400 | 02:42.140 | gate / ride | break | f:T10d2 | – | – |
| S068 | 02:42.140 | 02:44.140 | ledger / table | tcp | – | – | L054 |
| S069 | 02:44.140 | 02:44.780 | ledger / table | udp | – | – | L055 |
| S070 | 02:44.780 | 02:47.750 | gate / orbit | inst2 | – | E028, E029 | – |
| S071 | 02:47.750 | 02:51.200 | gate / ride | rush | f:T11syn | E030 | – |
| S072 | 02:51.200 | 02:54.550 | gate / wide | rush | – | – | – |
| S073 | 02:54.550 | 02:58.350 | gate / flyby | rush | f:T11d3 | – | – |
| S074 | 02:58.350 | 03:00.050 | gate / rings | rush | – | – | – |
| S075 | 03:00.050 | 03:03.100 | gate / chase | rush | f:T12syn | – | – |
| S076 | 03:03.100 | 03:06.500 | gate / portal | lock | – | E031 | L056 |
| S077 | 03:06.500 | 03:09.820 | gate / scanner | lock | f:X17 | – | L057 |
| S078 | 03:09.820 | 03:11.680 | ledger / table | lock | – | – | L058 |
| S079 | 03:11.680 | 03:15.250 | ledger / policy | lock | – | E032, E033, E034, E035 | L059 |
| S080 | 03:15.250 | 03:20.750 | gate / ride | outro | f:T13syn | – | – |
| S081 | 03:20.750 | 03:24.000 | gate / wide | outro | – | – | – |
| S082 | 03:24.000 | 03:26.650 | gate / chase | fin | f:T1fin | E036 | – |
| S083 | 03:26.650 | 03:29.200 | ledger / table | close | – | – | – |
| S084 | 03:29.200 | 03:32.000 | gate / orbit | calm2 | – | – | – |
| S085 | 03:32.000 | 03:35.550 | ledger / table | expire | – | E037, E038 | – |
| S086 | 03:35.550 | 03:39.350 | gate / ride | final | f:T14syn | – | – |
| S087 | 03:39.350 | 03:43.150 | gate / flyby | final | f:T14d2 | – | – |
| S088 | 03:43.150 | 03:46.700 | gate / wide2 | final | – | – | – |
| S089 | 03:46.700 | 03:49.050 | gate / portal | dip | – | E039, E040, E041 | – |
| S090 | 03:49.050 | 03:54.000 | gate / ride | last | f:T15syn | – | – |
| S091 | 03:54.000 | 03:58.350 | gate / rings | last | – | – | – |
| S092 | 03:58.350 | 04:02.150 | gate / wide | last | – | – | – |
| S093 | 04:02.150 | 04:19.321 | gate / final | outro | – | E042, E043, E044 | – |

## Sessions

| ID | Proto | Inside | NAT | Ziel | Regel | offen | zu |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T0 | tcp | 10.0.0.23:53834 | 203.0.113.10:40001 | 198.51.100.20:443 | 1 | 00:10.200 | 04:04.798 |
| D0 | udp | 10.0.0.31:41478 | 203.0.113.10:40002 | 192.0.2.53:53 | 2 | 00:13.989 | 00:46.905 |
| T1 | tcp | 10.0.0.23:53931 | 203.0.113.10:40003 | 198.51.100.20:443 | 1 | 00:29.400 | 03:31.898 |
| D1 | udp | 10.0.0.45:41495 | 203.0.113.10:40004 | 192.0.2.53:53 | 2 | 00:32.322 | 01:05.238 |
| T2 | tcp | 10.0.0.45:54028 | 203.0.113.10:40005 | 198.51.100.40:443 | 1 | 00:46.600 | 03:50.150 |
| T3 | tcp | 10.0.0.31:54125 | 203.0.113.10:40006 | 198.51.100.20:443 | 1 | 01:02.400 | 03:38.903 |
| U1 | udp | 10.0.0.12:41495 | 203.0.113.10:40007 | 192.0.2.14:514 | 5 | 01:02.586 | 03:33.586 |
| T4 | tcp | 10.0.0.31:54222 | 203.0.113.10:40008 | 198.51.100.40:443 | 1 | 01:11.000 | 03:40.616 |
| T5 | tcp | 192.0.2.77:54319 | – | 203.0.113.10:443 → 172.16.0.80:443 | 3 | 01:13.300 | 03:35.969 |
| D2 | udp | 10.0.0.23:41512 | 203.0.113.10:40009 | 192.0.2.53:53 | 2 | 01:39.983 | 02:12.899 |
| T6 | tcp | 10.0.0.23:54416 | 203.0.113.10:40010 | 198.51.100.40:443 | 1 | 01:42.700 | 03:53.211 |
| T7 | tcp | 10.0.0.45:54513 | 203.0.113.10:40011 | 198.51.100.20:443 | 1 | 01:58.400 | 03:56.237 |
| T8 | tcp | 10.0.0.31:54610 | 203.0.113.10:40012 | 198.51.100.40:443 | 1 | 02:07.400 | 03:59.216 |
| H1 | tcp | 10.0.0.23:53931 | 203.0.113.10:40013 | 203.0.113.10:443 → 172.16.0.80:443 | 3 | 02:14.400 | 04:01.953 |
| T9 | tcp | 10.0.0.45:54707 | 203.0.113.10:40014 | 198.51.100.40:443 | 1 | 02:18.200 | 03:48.150 |
| E1 | tcp | 10.0.0.31:53931 | 203.0.113.10:40015 | 198.51.100.40:80 | 4 | 02:16.400 | 02:24.602 |
| T10 | tcp | 10.0.0.45:53944 | 203.0.113.10:40016 | 198.51.100.20:443 | 1 | 02:26.950 | 04:03.400 |
| T16 | tcp | 10.0.0.23:53944 | 203.0.113.10:40017 | 198.51.100.40:443 | 1 | 02:34.900 | 03:43.211 |
| D3 | udp | 10.0.0.45:41529 | 203.0.113.10:40018 | 192.0.2.53:53 | 2 | 02:44.722 | 03:17.638 |
| T11 | tcp | 10.0.0.23:53944 | 203.0.113.10:40019 | 198.51.100.20:443 | 1 | 02:48.900 | 04:09.298 |
| T12 | tcp | 10.0.0.31:53944 | 203.0.113.10:40020 | 198.51.100.40:443 | 1 | 03:01.300 | 03:46.216 |
| T13 | tcp | 10.0.0.45:53944 | 203.0.113.10:40021 | 198.51.100.20:443 | 1 | 03:16.400 | 04:12.237 |
| T14 | tcp | 10.0.0.23:53944 | 203.0.113.10:40022 | 198.51.100.40:443 | 1 | 03:36.700 | 04:15.211 |
| T15 | tcp | 10.0.0.31:53944 | 203.0.113.10:40023 | 198.51.100.20:443 | 1 | 03:50.200 | 04:17.303 |

## Verworfene Pakete

| Zeit | Paket | Grund |
| --- | --- | --- |
| 00:23.150 | SYN 192.0.2.77:51104 → 203.0.113.10:8080 | deny |
| 00:42.600 | SYN 198.51.100.66:51022 → 203.0.113.10:22 | deny |
| 00:44.100 | SYN 198.51.100.66:51398 → 203.0.113.10:3389 | deny |
| 01:00.000 | SYN 192.0.2.77:51445 → 203.0.113.10:445 | deny |
| 01:22.600 | SYN 198.51.100.66:51023 → 203.0.113.10:23 | deny |
| 01:24.200 | SYN 198.51.100.66:51398 → 203.0.113.10:3389 | deny |
| 01:26.600 | SYN 198.51.100.66:51022 → 203.0.113.10:22 | deny |
| 01:29.600 | SYN 198.51.100.66:51915 → 203.0.113.10:5900 | deny |
| 01:32.700 | ACK 198.51.100.66:51443 → 203.0.113.10:443 | nostate |
| 01:34.400 | SYN 198.51.100.66:51467 → 203.0.113.10:8443 | deny |
| 01:39.200 | SYN 198.51.100.66:51022 → 203.0.113.10:22 | blocklist |
| 01:44.300 | SYN 198.51.100.66:51398 → 203.0.113.10:3389 | blocklist |
| 02:00.400 | SYN 198.51.100.66:51023 → 203.0.113.10:23 | blocklist |
| 02:11.200 | SYN 198.51.100.66:51445 → 203.0.113.10:445 | blocklist |
| 02:23.282 | DATA GET /eicar.com · EICAR-Test-Signature | ips |
| 02:33.350 | SYN 198.51.100.66:51315 → 203.0.113.10:3306 | blocklist |
| 02:33.400 | SYN 198.51.100.66:51021 → 203.0.113.10:21 | blocklist |
| 02:56.000 | SYN 198.51.100.66:51104 → 203.0.113.10:8080 | blocklist |
| 03:04.600 | SYN 198.51.100.66:51022 → 203.0.113.10:22 | blocklist |
| 03:07.300 | SYN 198.51.100.66:51398 → 203.0.113.10:3389 | blocklist |
| 03:10.300 | SYN 198.51.100.66:51023 → 203.0.113.10:23 | blocklist |
| 03:13.600 | SYN 198.51.100.66:51445 → 203.0.113.10:445 | blocklist |
| 03:18.000 | SYN 198.51.100.66:51915 → 203.0.113.10:5900 | blocklist |
| 03:52.000 | SYN 198.51.100.66:51104 → 203.0.113.10:8080 | blocklist |
| 04:06.000 | SYN 198.51.100.66:51022 → 203.0.113.10:22 | blocklist |
