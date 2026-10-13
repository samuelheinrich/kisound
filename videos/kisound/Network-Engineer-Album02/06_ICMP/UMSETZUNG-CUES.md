# ICMP — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV `06_ICMP_1.0.wav`.

81 Einstellungen (Schnittliste des Drehbuchs), 12 Kapitel, 16 Pakete. Alle 49 Analyse-Events und 75 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Bass-Einsätze 19,95 · 61,25 · 106,25 · 129,25 · 138,05 · 169,95 · 199,95 s. Pegellücken 16–16,15, 74,6–74,7, 89,4–89,9, 126,3–127, 151,5–151,6, 164,6–166,6, 183,2–183,4 s. Licht dimmt ab 212,8 s, hartes Ende.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Mehr als ein Ping | Ein Büro in Zürich, ein Laptop, ein Server in New York; dazwischen Frankfurt und der Atlantik. |
| C02 | 00:25.760 | Echo | ping -c 1: E-01 Echo Request 8/0 nach New York, E-02 Echo Reply 0/0 zurück, 92,4 ms. |
| C03 | 00:43.880 | Der Host antwortet | D antwortet auf Echo, ein UDP-Socket bleibt geschlossen – ein Ping ist kein Dienstnachweis. |
| C04 | 01:00.600 | Hör hin | Fünf Vorgänge auf einer Strecke; Fehlerantworten tragen ein Zitat des Originals. |
| C05 | 01:10.560 | Don’t Fragment | P-M1: 1500 Byte, DF=1. Der Tunnel in Frankfurt hat MTU 1400 – Drop. |
| C06 | 01:26.620 | Fragmentation Needed | I-M1 ICMP 3/4, Next-Hop MTU 1400 → PMTU-Eintrag, P-M2 neu mit 1400 Byte. Gegenbeispiel: gefiltertes ICMP. |
| C07 | 01:38.080 | Hook | Echo Reply, Time Exceeded, Redirect – Vorschau auf die nächsten Stationen. |
| C08 | 01:52.660 | Traceroute | T-1 endet am Heimrouter, T-2 in Frankfurt, T-3 in New York; 11/0, 11/0, 3/3. |
| C09 | 02:07.620 | Port Unreachable | D erreicht, UDP-Port 33436 nicht belegt: Type 3 Code 3. |
| C10 | 02:16.540 | Stimme aus der Leitung | Die geöffneten Typ/Code-Karten; P-M2 passiert den Tunnel und kommt in New York an. |
| C11 | 02:32.200 | Redirect | G1 leitet zu G2 weiter und meldet 5/1, Gateway 192.0.2.2. H prüft, dann direkt über G2. |
| C12 | 02:49.620 | Jetzt hörst du hin | Alle fünf Vorgänge auf der Kugel; Request und Reply; zurück ins Büro. |

## Pakete

| ID | Art | Header | Quelle → Ziel | Start | Ende | Ausgang | Zitat |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E-01 | data | Echo Request 8/0 · ID 4242 Seq 1 | 192.0.2.10 → 198.51.100.20 | 00:26.200 | 00:28.400 | deliver | – |
| E-02 | icmp | Echo Reply 0/0 · ID 4242 Seq 1 | 198.51.100.20 → 192.0.2.10 | 00:28.500 | 00:31.600 | deliver | – |
| P-M1 | data | UDP → 9000 · 1500 B · DF=1 | 192.0.2.10 → 198.51.100.20 | 01:17.000 | 01:24.240 | drop | – |
| I-M1 | icmp | ICMP 3/4 · Fragmentation Needed · MTU 1400 | 10.0.12.2 → 192.0.2.10 | 01:26.620 | 01:30.180 | deliver | P-M1 |
| T-1 | data | UDP → 33434 · TTL 1 | 192.0.2.10 → 198.51.100.20 | 01:54.000 | 01:57.600 | expire | – |
| TE-1 | icmp | ICMP 11/0 · TTL exceeded · von G1 | 192.0.2.1 → 192.0.2.10 | 02:00.100 | 02:01.900 | deliver | T-1 |
| T-2 | data | UDP → 33435 · TTL 2 | 192.0.2.10 → 198.51.100.20 | 02:04.300 | 02:05.950 | expire | – |
| T-3 | data | UDP → 33436 · TTL 3 | 192.0.2.10 → 198.51.100.20 | 02:04.600 | 02:07.620 | deliver | – |
| TE-2 | icmp | ICMP 11/0 · TTL exceeded · von R2 | 10.0.12.2 → 192.0.2.10 | 02:06.050 | 02:07.300 | deliver | T-2 |
| PU-3 | icmp | ICMP 3/3 · Port Unreachable · von D | 198.51.100.20 → 192.0.2.10 | 02:09.950 | 02:11.600 | deliver | T-3 |
| P-M2 | data | UDP → 9000 · 1400 B · neu | 192.0.2.10 → 198.51.100.20 | 02:25.000 | 02:29.600 | deliver | – |
| R-1 | data | TCP → 203.0.113.20:443 | 192.0.2.10 → 203.0.113.20 | 02:32.600 | 02:39.900 | deliver | – |
| RD-1 | icmp | ICMP 5/1 · Redirect Host · Gateway 192.0.2.2 | 192.0.2.1 → 192.0.2.10 | 02:36.360 | 02:37.600 | deliver | R-1 |
| R-2 | data | TCP → 203.0.113.20:443 · via G2 | 192.0.2.10 → 203.0.113.20 | 02:41.620 | 02:45.600 | deliver | – |
| P-M3 | data | UDP → 9000 · 1400 B | 192.0.2.10 → 198.51.100.20 | 03:19.800 | 03:24.600 | deliver | – |
| R-3 | data | TCP → 203.0.113.20:443 · via G2 | 192.0.2.10 → 203.0.113.20 | 03:25.600 | 03:29.400 | deliver | – |

## Einstellungen

| Shot | Start | Ende | Raum / Station | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:07.580 | room / room | E001, E002, E003 | – |
| S002 | 00:07.580 | 00:11.180 | desktop / desktop | E004 | L001 |
| S003 | 00:11.180 | 00:15.240 | globe / globe | – | L002 |
| S004 | 00:15.240 | 00:16.660 | header / header | E005 | L003 |
| S005 | 00:16.660 | 00:19.660 | desktop / desktop | – | L004 |
| S006 | 00:19.660 | 00:25.760 | room / room | E006 | – |
| S007 | 00:25.760 | 00:28.480 | desktop / desktop | E007, E008 | L005 |
| S008 | 00:28.480 | 00:33.340 | globe / globe | – | L006 |
| S009 | 00:33.340 | 00:36.900 | header / header | – | L007 |
| S010 | 00:36.900 | 00:40.420 | header / header | – | L008 |
| S011 | 00:40.420 | 00:43.880 | desktop / desktop | – | L009 |
| S012 | 00:43.880 | 00:49.360 | dc / dc | – | L010 |
| S013 | 00:49.360 | 00:51.800 | desktop / desktop | – | L011 |
| S014 | 00:51.800 | 00:55.660 | globe / globe | – | L012 |
| S015 | 00:55.660 | 01:00.600 | header / header | E009 | L013 |
| S016 | 01:00.600 | 01:01.340 | globe / globe | E010 | L014 |
| S017 | 01:01.340 | 01:03.060 | globe / globe | – | L015 |
| S018 | 01:03.060 | 01:05.000 | desktop / desktop | – | L016 |
| S019 | 01:05.000 | 01:07.600 | header / header | – | L017 |
| S020 | 01:07.600 | 01:08.680 | globe / globe | – | L018 |
| S021 | 01:08.680 | 01:10.560 | header / header | – | L019 |
| S022 | 01:10.560 | 01:13.240 | globe / globe | – | L020 |
| S023 | 01:13.240 | 01:15.620 | header / header | E011, E012, E013 | L021 |
| S024 | 01:15.620 | 01:19.360 | room / room | E014 | L022 |
| S025 | 01:19.360 | 01:23.480 | globe / globe | – | L023 |
| S026 | 01:23.480 | 01:24.240 | header / header | – | L024 |
| S027 | 01:24.240 | 01:26.620 | globe / globe | – | L025 |
| S028 | 01:26.620 | 01:28.600 | header / header | – | L026 |
| S029 | 01:28.600 | 01:30.380 | globe / globe | E015 | L027 |
| S030 | 01:30.380 | 01:32.060 | desktop / desktop | E016, E017 | L028 |
| S031 | 01:32.060 | 01:34.380 | desktop / desktop | – | L029 |
| S032 | 01:34.380 | 01:36.420 | header / header | – | L030 |
| S033 | 01:36.420 | 01:38.080 | desktop / desktop | – | L031 |
| S034 | 01:38.080 | 01:39.940 | globe / globe | E018 | L032 |
| S035 | 01:39.940 | 01:41.860 | globe / globe | E019 | L033 |
| S036 | 01:41.860 | 01:43.100 | room / room | – | L034 |
| S037 | 01:43.100 | 01:45.120 | header / header | E020 | L035 |
| S038 | 01:45.120 | 01:48.320 | globe / globe | E021 | L036 |
| S039 | 01:48.320 | 01:52.660 | globe / globe | – | L037 |
| S040 | 01:52.660 | 01:56.960 | desktop / desktop | E022 | L038 |
| S041 | 01:56.960 | 02:00.020 | room / room | – | L039 |
| S042 | 02:00.020 | 02:01.500 | header / header | – | L040 |
| S043 | 02:01.500 | 02:04.280 | room / room | E023 | L041 |
| S044 | 02:04.280 | 02:05.720 | desktop / desktop | E024 | L042 |
| S045 | 02:05.720 | 02:07.620 | globe / globe | E025 | L043 |
| S046 | 02:07.620 | 02:09.900 | dc / dc | – | L044 |
| S047 | 02:09.900 | 02:11.780 | header / header | – | L045 |
| S048 | 02:11.780 | 02:13.100 | header / header | – | L046 |
| S049 | 02:13.100 | 02:16.540 | desktop / desktop | E026 | L047 |
| S050 | 02:16.540 | 02:17.980 | globe / globe | E027, E028 | L048 |
| S051 | 02:17.980 | 02:19.740 | header / header | – | L049 |
| S052 | 02:19.740 | 02:21.860 | desktop / desktop | E029 | L050 |
| S053 | 02:21.860 | 02:23.560 | dc / dc | – | L051 |
| S054 | 02:23.560 | 02:25.500 | globe / globe | – | L052 |
| S055 | 02:25.500 | 02:27.160 | header / header | – | L053 |
| S056 | 02:27.160 | 02:30.140 | globe / globe | E030 | L054 |
| S057 | 02:30.140 | 02:32.200 | dc / dc | E031, E032 | L055 |
| S058 | 02:32.200 | 02:34.400 | room / room | E033 | L056 |
| S059 | 02:34.400 | 02:36.360 | room / room | – | L057 |
| S060 | 02:36.360 | 02:37.940 | header / header | – | L058 |
| S061 | 02:37.940 | 02:39.660 | room / room | – | L059 |
| S062 | 02:39.660 | 02:41.620 | desktop / desktop | – | L060 |
| S063 | 02:41.620 | 02:43.520 | room / room | – | L061 |
| S064 | 02:43.520 | 02:45.820 | header / header | E034 | L062 |
| S065 | 02:45.820 | 02:49.620 | room / room | E035, E036 | L063 |
| S066 | 02:49.620 | 02:50.220 | globe / globe | E037 | L064 |
| S067 | 02:50.220 | 02:51.640 | globe / globe | – | L065 |
| S068 | 02:51.640 | 02:53.720 | desktop / desktop | – | L066 |
| S069 | 02:53.720 | 02:56.500 | header / header | – | L067 |
| S070 | 02:56.500 | 02:57.400 | globe / globe | – | L068 |
| S071 | 02:57.400 | 02:59.060 | header / header | E038 | L069 |
| S072 | 02:59.060 | 03:01.360 | globe / globe | – | L070 |
| S073 | 03:01.360 | 03:04.780 | room / room | E039, E040 | L071 |
| S074 | 03:04.780 | 03:10.640 | header / header | E041, E042 | – |
| S075 | 03:10.640 | 03:11.320 | header / header | E043 | L072 |
| S076 | 03:11.320 | 03:11.800 | header / header | – | L073 |
| S077 | 03:11.800 | 03:18.220 | desktop / desktop | E044 | L074 |
| S078 | 03:18.220 | 03:19.620 | globe / globe | – | L075 |
| S079 | 03:19.620 | 03:25.338 | dc / dc | E045, E046 | – |
| S080 | 03:25.338 | 03:31.056 | room / room | E047 | – |
| S081 | 03:31.056 | 03:36.774 | room / room | E048, E049 | – |

## Bildschirmtexte

**B01 · ping** (25,76–43,88 s)
```
[ 25.90] h$ ping -c 1 198.51.100.20
[ 26.20] PING 198.51.100.20 (198.51.100.20) 56(84) bytes of data.
[ 31.60] 64 bytes from 198.51.100.20: icmp_seq=1 ttl=62 time=92.4 ms
[ 31.60] 1 packets transmitted, 1 received, 0% packet loss
[ 31.90] Headerkarte: E-01 8/0 -> E-02 0/0 | Echo ID 4242 Seq 1
```

**B02 · PMTUD** (83,48–98,08 s)
```
[ 83.60] P-M1 | IPv4 len 1500 | DF 1 | UDP dst 9000 | IP ID 0x1201
[ 84.24] R2: MTU 1400 -> DROP
[ 86.62] I-M1 | src 10.0.12.2 -> dst 192.0.2.10
[ 86.62] ICMP Type 3 Code 4 | Next-Hop MTU 1400
[ 87.02] Quoted: P-M1 IP header + UDP header
[ 92.06] P-M2 | NEU | IPv4 len 1400 | DF 1 | IP ID 0x1202
[ 92.06] 20 IP + 8 UDP + 1372 Daten = 1400 Byte
[ 94.40] Gegenbeispiel gefiltertes ICMP: separat gekennzeichnet
```

**B03 · traceroute** (112,66–136,54 s)
```
[112.80] h$ traceroute -n -q 1 -m 3 198.51.100.20
[113.60] traceroute to 198.51.100.20, 3 hops max, 60 byte packets
[121.90]  1  192.0.2.1      1.2 ms
[127.30]  2  10.0.12.2     9.6 ms
[131.60]  3  198.51.100.20 92.1 ms
[131.60] Overlay: UDP-Probes TTL 1/2/3 = drei neue Datagramme
[131.90] Antworten: G1 11/0 | R2 11/0 | D 3/3
```

**B04 · Port Unreachable** (127,62–136,54 s)
```
[127.62] T-3: UDP-Traceroute-Zielport | TTL bei Sender 3
[127.62] D erreicht, UDP-Socket nicht belegt
[129.95] ICMP src 198.51.100.20 -> dst 192.0.2.10
[129.95] Type 3 Code 3: Destination Unreachable / Port Unreachable
[130.30] Zitat: IP-Header T-3 + erste 8 Byte UDP
```

**B05 · Redirect (Labor)** (152,2–169,62 s)
```
[152.30] Isoliertes Laborszenario, Redirect-Annahme explizit freigeschaltet
[152.30] Auslöser: H -> 203.0.113.20 zunächst via G1
[156.36] ICMP src 192.0.2.1 -> dst 192.0.2.10
[156.36] Type 5 Code 1: Redirect for Host
[156.36] Gateway: 192.0.2.2
[156.66] Zitat: ursprünglicher IP-Header + Transportbeginn
[159.70] Prüfung: aktueller Gateway / passendes Zitat / Next Hop im LAN
[161.62] Erst danach: neues Paket direkt H -> G2
```

**B06 · Zusammenfassung** (169,62–199,62 s)
```
[169.70] IPv4 ICMP — geprüfte Vorgänge
[169.70] 8/0  Echo Request      0/0  Echo Reply
[169.70] 3/4  Fragmentation Needed (DF, MTU 1400)
[169.70] 11/0 TTL Exceeded in Transit
[184.80] 3/3  Destination Unreachable: UDP Port
[184.80] 5/1  Redirect: Host, Gateway 192.0.2.2
[184.80] Jede Fehlerantwort referenziert ihr eigenes Original
```

## Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 00:26.200 | tx | H: Echo Request 8/0 → 198.51.100.20 (E-01) |
| 00:31.600 | rx | H: Echo Reply 0/0 von 198.51.100.20 · ID 4242 Seq 1 |
| 01:17.000 | tx | H: UDP 1500 B DF=1 → 198.51.100.20:9000 (P-M1) |
| 01:24.240 | drop | R2: 1500 > MTU 1400, DF=1 → verworfen |
| 01:30.180 | rx | H: ICMP 3/4 von 10.0.12.2 · MTU 1400 → PMTU-Cache |
| 01:54.000 | tx | traceroute: T-1 TTL 1 |
| 02:01.900 | rx | H: ICMP 11/0 von 192.0.2.1 |
| 02:07.300 | rx | H: ICMP 11/0 von 10.0.12.2 |
| 02:11.600 | rx | H: ICMP 3/3 von 198.51.100.20 · Port 33436 |
| 02:25.000 | tx | H: UDP 1400 B → 198.51.100.20:9000 (P-M2) |
| 02:30.140 | ok | UDP-Testempfänger 9000: P-M2 erhalten |
| 02:36.360 | rx | H: ICMP 5/1 von 192.0.2.1 · Gateway 192.0.2.2 |
| 02:41.620 | ok | H: Redirect geprüft · 203.0.113.20 via 192.0.2.2 |
