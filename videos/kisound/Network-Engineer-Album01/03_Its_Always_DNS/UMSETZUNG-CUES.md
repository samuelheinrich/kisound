# It’s Always DNS — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV.
100 Einstellungen, 15 Kapitel, 33 DNS-Transaktionen, 31 Cache-Einträge. 20 POV-Fahrten mit einem Paket. Alle 74 Analyse-Events und 64 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Drops: 31,35 · 46,45 · 61,55 · 110,65 · 121,95 · 133,25 · 152,25 · 175,05 · 228,35 s. Blackout 120,55–121,4 s, digitale Stille (Timeout) 130,35–132,65 s. Harter Schluss, Blende erst ab 261 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Der Anruf | Nachtstadt, Helpdesk-Telefon; die fehlerhafte Abfrage läuft schon durch die Hierarchie und endet in NXDOMAIN. |
| C02 | 00:15.080 | Symptome | Ticket #4040: Ping per IP sauber, Routen gut, nur der Hostname ist weg. |
| C03 | 00:30.580 | Ausschluss | Kabel, Port, Firewall, Traceroute: alles grün. Die Lupe landet auf DNS. |
| C04 | 00:38.680 | Hook: Beweise | dig, TTL, NXDOMAIN; der Resolver sagt nein, der alte Cache sagt ja. |
| C05 | 00:48.120 | Urteil | It’s always DNS: Switch, Router und Firewall entlastet. |
| C06 | 00:59.580 | Indizien | Alter Cache mit TTL 86400, Split-Brain der Zonen, Reverse-Lookup ohne PTR, CNAME-Kette. |
| C07 | 01:23.400 | Flush · Query · Dig · Fix | Flush hilft nicht allein; dig zeigt die fehlende interne Ansicht; der Eintrag wird ergänzt. |
| C08 | 01:31.260 | Final Hook | Dieselben Beweise, jetzt aufgelöst. |
| C09 | 01:38.200 | Fall geschlossen | TTL läuft, Final Chorus, Stempel: Fall geschlossen. Licht aus. |
| C10 | 02:01.400 | Nachttour | Rekursive Auflösung durch Root, TLD und autoritative Server; Timeout in der Stille; negative Antworten; Ablauf der TTL. |
| C11 | 03:02.000 | Fallwand | Die Wand mit allen Spuren; das Telefon klingelt wieder. |
| C12 | 03:23.240 | Fall #4041 | Reprise: intranet → portal → lb, das Ende der CNAME-Kette fehlt. |
| C13 | 03:46.800 | Indizien II | Wieder alter Cache, Split-Brain, Reverse, CNAME-Tanz. |
| C14 | 04:10.620 | Fix und Abspann | Flush, Query, Dig, Fix; Titel. |
| C15 | 04:18.150 | Fall #4042 | Dig it up · TTL · NXDOMAIN – Schnitt. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:05.500 | city / opening | intro | – | E001, E002 | – |
| S002 | 00:05.500 | 00:09.000 | desk / phone | intro | – | – | – |
| S003 | 00:09.000 | 00:15.080 | city / ride | incident | tx:T0 | – | – |
| S004 | 00:15.080 | 00:18.400 | desk / file | ticket | – | E003 | L001 |
| S005 | 00:18.400 | 00:20.000 | city / office | ticket | – | – | – |
| S006 | 00:20.000 | 00:23.920 | desk / phone | ticket | – | – | L002 |
| S007 | 00:23.920 | 00:26.700 | city / ping | ping | – | – | L003 |
| S008 | 00:26.700 | 00:28.600 | city / chase | vanish | tx:T2 | – | L004 |
| S009 | 00:28.600 | 00:30.580 | desk / monitor | vanish | – | – | – |
| S010 | 00:30.580 | 00:32.920 | desk / file | checks | – | E004 | L005 |
| S011 | 00:32.920 | 00:34.760 | city / gear | checks | – | – | L006 |
| S012 | 00:34.760 | 00:36.460 | city / trace | checks | – | E005 | L007 |
| S013 | 00:36.460 | 00:38.680 | desk / lens | checks | – | – | L008 |
| S014 | 00:38.680 | 00:39.220 | desk / monitor | hook | – | E006 | L009 |
| S015 | 00:39.220 | 00:40.520 | city / cache | hook | – | E007 | L010 |
| S016 | 00:40.520 | 00:41.120 | desk / stamp | hook | – | – | L011 |
| S017 | 00:41.120 | 00:42.020 | city / wide | hook | – | – | L012 |
| S018 | 00:42.020 | 00:43.060 | city / resolver | hook | – | – | L013 |
| S019 | 00:43.060 | 00:43.780 | city / office | hook | laptopB | – | L014 |
| S020 | 00:43.780 | 00:45.320 | city / wide2 | hook | – | – | L015, L016 |
| S021 | 00:45.320 | 00:48.120 | city / rise | build | – | E008 | – |
| S022 | 00:48.120 | 00:51.060 | city / orbit | verdict | – | E009, E010 | L017 |
| S023 | 00:51.060 | 00:54.280 | city / gear | verdict | – | – | L018 |
| S024 | 00:54.280 | 00:57.480 | city / ride | verdict | tx:C1 | E011 | L019 |
| S025 | 00:57.480 | 00:59.580 | desk / lens | verdict | – | E012 | L020 |
| S026 | 00:59.580 | 01:03.600 | city / flyby | tour | tx:I1 | E013 | – |
| S027 | 01:03.600 | 01:06.000 | city / tower | tour | – | – | – |
| S028 | 01:06.000 | 01:08.020 | city / cache | tour | – | E014 | – |
| S029 | 01:08.020 | 01:12.100 | city / cache | stale | – | E015 | L021 |
| S030 | 01:12.100 | 01:15.680 | city / zone | split | – | – | L022 |
| S031 | 01:15.680 | 01:19.580 | city / arpa | reverse | – | E016 | L023 |
| S032 | 01:19.580 | 01:23.400 | city / chase | cname | tx:CN1 | E017 | L024 |
| S033 | 01:23.400 | 01:24.320 | city / cache | flush | – | E018 | L025 |
| S034 | 01:24.320 | 01:25.280 | city / chase | requery | tx:Q2 | E019 | L026 |
| S035 | 01:25.280 | 01:26.140 | desk / monitor | dig | – | – | L027 |
| S036 | 01:26.140 | 01:27.400 | city / zone | fix | – | E020 | L028 |
| S037 | 01:27.400 | 01:29.320 | city / gear | fix | – | – | L029 |
| S038 | 01:29.320 | 01:31.260 | city / chase | resolved | tx:OK1 | – | L030 |
| S039 | 01:31.260 | 01:32.080 | desk / monitor | hook2 | – | E021 | L031 |
| S040 | 01:32.080 | 01:33.420 | city / cache | hook2 | – | – | L032 |
| S041 | 01:33.420 | 01:34.040 | desk / stamp | hook2 | – | – | L033 |
| S042 | 01:34.040 | 01:34.720 | city / wide | hook2 | – | E022 | L034 |
| S043 | 01:34.720 | 01:35.940 | city / resolver | hook2 | – | – | L035 |
| S044 | 01:35.940 | 01:36.640 | city / office | hook2 | laptopB | – | L036 |
| S045 | 01:36.640 | 01:38.200 | city / wide2 | hook2 | – | – | L037, L038 |
| S046 | 01:38.200 | 01:42.500 | city / tower | calm | – | E023 | – |
| S047 | 01:42.500 | 01:45.500 | city / zone | calm | – | – | – |
| S048 | 01:45.500 | 01:48.580 | city / rise | build | – | E024 | – |
| S049 | 01:48.580 | 01:51.500 | city / orbit | verdict2 | – | E025 | L039 |
| S050 | 01:51.500 | 01:54.620 | desk / file | verdict2 | – | – | L040 |
| S051 | 01:54.620 | 01:57.860 | city / ride | verdict2 | tx:C2 | – | L041 |
| S052 | 01:57.860 | 02:00.420 | desk / stamp | closed | – | – | L042 |
| S053 | 02:00.420 | 02:01.400 | desk / lamp | blackout | – | E026 | – |
| S054 | 02:01.400 | 02:10.300 | city / ride | tour | tx:K1 | E027, E028, E029 | – |
| S055 | 02:10.300 | 02:13.250 | city / timeout | timeout | – | E030 | – |
| S056 | 02:13.250 | 02:15.500 | city / wide | recover | – | E031 | – |
| S057 | 02:15.500 | 02:19.500 | city / ride | tour | tx:K2 | – | – |
| S058 | 02:19.500 | 02:22.500 | city / tower | tour | – | E032 | – |
| S059 | 02:22.500 | 02:26.500 | city / flyby | tour | tx:K3 | – | – |
| S060 | 02:26.500 | 02:30.000 | city / tld | tour | – | E033 | – |
| S061 | 02:30.000 | 02:32.250 | city / chase | negative | tx:TYPO | E034 | – |
| S062 | 02:32.250 | 02:35.500 | city / orbit | tour | – | E035 | – |
| S063 | 02:35.500 | 02:40.000 | city / ride | tour | tx:K4 | – | – |
| S064 | 02:40.000 | 02:43.500 | city / cache | expire | – | – | – |
| S065 | 02:43.500 | 02:47.500 | city / flyby | tour | tx:K5 | E036 | – |
| S066 | 02:47.500 | 02:51.000 | city / tower | tour | – | E037 | – |
| S067 | 02:51.000 | 02:55.050 | city / cache | expire | – | E038, E039 | – |
| S068 | 02:55.050 | 02:59.000 | city / ride | tour | tx:K6 | – | – |
| S069 | 02:59.000 | 03:02.000 | city / wide | tour | – | E040 | – |
| S070 | 03:02.000 | 03:07.500 | desk / board | board | – | – | – |
| S071 | 03:07.500 | 03:12.000 | desk / file | board | – | – | – |
| S072 | 03:12.000 | 03:17.000 | city / orbit | calm | – | – | – |
| S073 | 03:17.000 | 03:20.500 | desk / board | board | – | – | – |
| S074 | 03:20.500 | 03:23.240 | desk / phone | ticket2 | – | E041 | – |
| S075 | 03:23.240 | 03:25.200 | desk / lens | ticket2 | – | – | L043 |
| S076 | 03:25.200 | 03:26.140 | desk / monitor | hook3 | – | E042 | L044 |
| S077 | 03:26.140 | 03:26.880 | city / cache | hook3 | – | E043 | L045 |
| S078 | 03:26.880 | 03:27.820 | desk / stamp | hook3 | – | E044 | L046 |
| S079 | 03:27.820 | 03:31.320 | city / chase | cname2 | tx:CN2 | E045, E046, E047, E048, E049 | L047 |
| S080 | 03:31.320 | 03:32.500 | city / wide2 | hook3 | – | E050, E051 | L048 |
| S081 | 03:32.500 | 03:34.840 | city / rise | build | – | – | – |
| S082 | 03:34.840 | 03:37.760 | city / orbit | verdict3 | – | E052 | L049 |
| S083 | 03:37.760 | 03:42.440 | city / gear | verdict3 | – | E053, E054 | L050, L051 |
| S084 | 03:42.440 | 03:45.660 | city / ride | verdict3 | tx:C3 | E055 | L052 |
| S085 | 03:45.660 | 03:46.900 | desk / lens | verdict3 | – | E056, E057 | L053 |
| S086 | 03:46.900 | 03:48.350 | desk / lamp | blackout | – | E058 | – |
| S087 | 03:48.350 | 03:52.000 | city / flyby | tour | tx:K7 | E059 | – |
| S088 | 03:52.000 | 03:55.300 | city / tower | tour | – | E060 | – |
| S089 | 03:55.300 | 03:59.260 | city / cache | stale2 | – | E061 | L054 |
| S090 | 03:59.260 | 04:03.040 | city / zone | split2 | – | E062 | L055 |
| S091 | 04:03.040 | 04:07.140 | city / arpa | reverse2 | – | E063 | L056 |
| S092 | 04:07.140 | 04:10.620 | city / chase | cname3 | tx:CN3 | E064, E065, E066 | L057 |
| S093 | 04:10.620 | 04:11.380 | city / cache | flush2 | – | E067 | L058 |
| S094 | 04:11.380 | 04:12.120 | city / chase | requery2 | tx:Q3 | E068 | L059 |
| S095 | 04:12.120 | 04:13.000 | desk / monitor | dig2 | – | – | L060 |
| S096 | 04:13.000 | 04:13.600 | city / zone | fix2 | – | – | L061 |
| S097 | 04:13.600 | 04:18.150 | city / final | final | – | – | – |
| S098 | 04:18.150 | 04:19.240 | desk / monitor | end | – | E069 | L062 |
| S099 | 04:19.240 | 04:20.360 | city / cache | end | – | E070 | L063 |
| S100 | 04:20.360 | 04:21.200 | desk / stamp | end | – | E071, E072, E073, E074 | L064 |

## DNS-Transaktionen

| ID | Start | Name | Weg | Ergebnis |
| --- | --- | --- | --- | --- |
| T0 | 00:09.000 | app.itsalwaysdns.com | laptopA → resolver → root-j → com → ns1int | NXDOMAIN |
| P1 | 00:23.920 | 203.0.113.42 | laptopA → switch → router → firewall → app | ICMP |
| T2 | 00:26.700 | app.itsalwaysdns.com | laptopA → resolver | NXDOMAIN |
| TR | 00:34.760 | traceroute 203.0.113.42 | laptopA → router → firewall → app | ICMP |
| RESNO | 00:42.020 | app.itsalwaysdns.com | laptopA → resolver | NXDOMAIN |
| CACHEYES | 00:43.060 | http://app.itsalwaysdns.com | laptopB → app | Antwort |
| C1 | 00:54.280 | itsalwaysdns.com | laptopA → resolver → ns1int | Antwort |
| I1 | 00:59.580 | lab.example.net | laptopB → resolver → root-k → net → nsex | Antwort |
| REV | 01:15.680 | 42.113.0.203.in-addr.arpa | laptopA → resolver → root-c → arpa → inaddr | NXDOMAIN |
| FWD | 01:15.900 | app.itsalwaysdns.com | laptopB → app | Antwort |
| CN1 | 01:19.580 | www.itsalwaysdns.com | laptopA → resolver → ns1int → nsex | NXDOMAIN |
| Q2 | 01:24.320 | app.itsalwaysdns.com | laptopA → resolver → ns1int | NXDOMAIN |
| DIGEXT | 01:25.280 | dig @ns1 app.itsalwaysdns.com | laptopB → ns1ext | Antwort |
| DIGINT | 01:25.280 | dig @ns1 app.itsalwaysdns.com | laptopB → ns1int | NXDOMAIN |
| OK1 | 01:29.320 | app.itsalwaysdns.com | laptopA → resolver → ns1int | Antwort |
| OKB | 01:30.200 | app.itsalwaysdns.com | laptopB → resolver | Antwort |
| C2 | 01:54.620 | status.itsalwaysdns.com | laptopA → resolver → ns1int | Antwort |
| K1 | 02:01.950 | kisound.ch AAAA | laptopA → resolver → root-a → ch → nsch | Antwort |
| TO | 02:10.350 | app.itsalwaysdns.com | laptopA → resolver | Timeout |
| BACK | 02:13.300 | app.itsalwaysdns.com | laptopA → resolver | Antwort |
| K2 | 02:15.500 | packets.example.org | laptopB → resolver → root-f → org → nsex | Antwort |
| K3 | 02:22.500 | samuel-heinrich.ch | laptopA → resolver → ch → nsch | Antwort |
| TYPO | 02:30.000 | itsalwaysdsn.com | laptopB → resolver → com | NXDOMAIN |
| K4 | 02:35.500 | example.net MX | laptopB → resolver → nsex | Antwort |
| K5 | 02:43.500 | 7.100.51.198.in-addr.arpa | laptopA → resolver → inaddr | Antwort |
| K6 | 02:55.050 | example.org MX | laptopA → resolver → nsex | Antwort |
| CN2 | 03:27.820 | intranet.itsalwaysdns.com | laptopA → resolver → ns1int → nsex | NXDOMAIN |
| C3 | 03:42.440 | status.itsalwaysdns.com | laptopA → resolver → ns1int | Antwort |
| K7 | 03:48.350 | kisound.ch A | laptopB → resolver → nsch | Antwort |
| CN3 | 04:07.140 | intranet.itsalwaysdns.com +trace | laptopB → ns1int → nsex | NXDOMAIN |
| Q3 | 04:11.380 | intranet.itsalwaysdns.com | laptopA → resolver → ns1int → nsex | NXDOMAIN |
| OK2 | 04:13.300 | intranet.itsalwaysdns.com | laptopA → resolver → ns1int | Antwort |
| PR | 04:18.150 | printer.itsalwaysdns.com | laptopA → resolver → ns1int | NXDOMAIN |

## Fallereignisse

| Zeit | Aktion |
| --- | --- |
| 00:09.000 | Ticket #4040 geöffnet: network down (app.itsalwaysdns.com) |
| 01:23.600 | rndc flushname app — Negativ-Cache gelöscht (hilft allein nicht) |
| 01:26.400 | Interne View: app A 203.0.113.42 ergänzt, Serial erhöht |
| 01:57.860 | Ticket #4040 geschlossen |
| 02:10.350 | Resolver nicht erreichbar — Timeout (≠ NXDOMAIN) |
| 02:12.650 | Resolver wieder erreichbar |
| 03:20.500 | Ticket #4041 geöffnet: intranet down (intranet.itsalwaysdns.com) |
| 04:10.800 | rndc flushtree intranet |
| 04:13.100 | Interne View: lb A ergänzt — CNAME-Kette löst auf |
| 04:14.500 | Ticket #4041 geschlossen |
| 04:18.150 | Ticket #4042 geöffnet: printer offline (printer.itsalwaysdns.com) |
