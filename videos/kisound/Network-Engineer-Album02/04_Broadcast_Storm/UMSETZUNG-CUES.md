# Broadcast Storm — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV `04_Broadcast_Storm_1.0.wav`.

58 Einstellungen (Schnittliste des Drehbuchs), 12 Kapitel, 611 Broadcasts → 1222 Ringkopien, 1713 MAC-Flaps auf SW3. Alle 40 Analyse-Events und 45 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Ablauf: Ring geschlossen 15,58 s · B-001 22,8 s · Management weg 62,3 s · shutdown ab 161,38 s · Gi1/0/24 down 163 s · Management zurück 189,5 s · Unicast-Test ok 197,33 s.
Bass-Einsätze 34,05 · 88,25 · 154,05 · 167,75 · 195,15 s. Beat-Bruch nach «Zieh das Kabel» 131,4 s. Schlussblende ab 202,9 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Offene Kette | SW1–SW2–SW3 als offene Kette; die beiden Port-24-Enden bleiben getrennt. Ein loses Kabel. |
| C02 | 00:15.580 | Falscher Port | Der Fehlpatch rastet an SW3 Gi1/0/24 ein und schliesst den Ring in VLAN 120. STP ist dort aus. |
| C03 | 00:22.300 | B-001 | H1 fragt per ARP-Broadcast nach 192.0.2.1. SW1 flutet: eine Kopie in jede Ringrichtung. |
| C04 | 00:43.960 | Kopien wachsen | Die Kopien kehren zurück und werden erneut geflutet; jeder neue Broadcast kreist mit. CPU rot, Management weg. |
| C05 | 01:06.520 | Alle Lampen grün | Grüne Linklampen über vollen Queues. Die H1-MAC springt zwischen den Ringports. Nichts kommt durch. |
| C06 | 01:26.520 | Broadcast Storm | Kein Root, kein Blocking: der Ring frisst die Leitungen, Puffer verwerfen. |
| C07 | 01:50.540 | Loop · Flood | Eine volle Ringrunde, Flooding an jedem Abzweig, Verluste bei unverändertem Link. |
| C08 | 02:10.060 | Zieh das Kabel | Der Auftrag zur Suche. Das Suchlicht fährt über den Ring. |
| C09 | 02:17.380 | Console-Weg | In-band-Login scheitert; die serielle Console führt zu SW3. Gi1/0/24 ist der falsche Ringabschluss. |
| C10 | 02:41.380 | Ein Port down | shutdown an SW3 Gi1/0/24. Der Ring ist offen. |
| C11 | 02:46.560 | Die Flut zieht ab | Restliche Kopien laufen aus, Queues leeren sich, MAC-Lernen beruhigt sich. |
| C12 | 03:06.720 | Stille | Management antwortet, Unicast-Test erfolgreich. Folgearbeit: STP für VLAN 120. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:09.660 | ring / crane | open | – | E001, E002 | – |
| S002 | 00:09.660 | 00:10.440 | ring / crane | cable | – | E003 | L001 |
| S003 | 00:10.440 | 00:15.580 | ring / port | plug | p:SW3-24 | – | – |
| S004 | 00:15.580 | 00:16.740 | ring / port | click | p:SW3-24 | – | L002 |
| S005 | 00:16.740 | 00:20.800 | console / front | stpcfg | – | – | – |
| S006 | 00:20.800 | 00:22.300 | ring / crane | closed | – | E004 | L003 |
| S007 | 00:22.300 | 00:29.520 | ring / fabric | b001 | c:B001 | E005 | – |
| S008 | 00:29.520 | 00:36.740 | ring / crane | twocopies | – | E006 | – |
| S009 | 00:36.740 | 00:43.960 | core / mac | learn | – | E007 | – |
| S010 | 00:43.960 | 00:46.340 | ring / fabric | lap | c:B001a | E008 | L004 |
| S011 | 00:46.340 | 00:49.880 | ring / port | same | p:SW1-24 | – | L005 |
| S012 | 00:49.880 | 00:51.880 | ring / fabric | header | c:B001a | – | L006 |
| S013 | 00:51.880 | 00:54.560 | ring / crane | nostp | – | – | L007 |
| S014 | 00:54.560 | 00:56.760 | ring / fabric | flood | c:B001b | E009 | L008 |
| S015 | 00:56.760 | 01:00.140 | ring / fabric | grow | c:B001a | – | L009 |
| S016 | 01:00.140 | 01:02.300 | core / buffer | fill | – | E010 | L010 |
| S017 | 01:02.300 | 01:06.520 | console / front | mgmtdead | – | E011 | L011 |
| S018 | 01:06.520 | 01:09.660 | ring / port | green | p:SW2-1 | E012 | L012 |
| S019 | 01:09.660 | 01:16.020 | core / mac | flap | – | – | L013 |
| S020 | 01:16.020 | 01:20.020 | core / buffer | unicastdrop | – | – | L014 |
| S021 | 01:20.020 | 01:26.520 | ring / crane | drown | – | – | L015 |
| S022 | 01:26.520 | 01:28.080 | ring / crane | storm | – | E013, E014 | L016 |
| S023 | 01:28.080 | 01:32.000 | console / front | noroot | – | – | L017 |
| S024 | 01:32.000 | 01:33.640 | ring / fabric | storm2 | c:B001b | – | L018 |
| S025 | 01:33.640 | 01:38.280 | core / buffer | damage | – | E015 | L019 |
| S026 | 01:38.280 | 01:39.560 | ring / fabric | flutet | c:B001a | – | L020 |
| S027 | 01:39.560 | 01:40.840 | ring / fabric | double | c:B001b | – | L021 |
| S028 | 01:40.840 | 01:42.920 | ring / port | wire | p:SW2-2 | E016 | L022 |
| S029 | 01:42.920 | 01:46.500 | ring / crane | lapcam | – | – | L023 |
| S030 | 01:46.500 | 01:50.540 | core / buffer | olddrop | – | E017, E018 | L024 |
| S031 | 01:50.540 | 01:51.820 | ring / crane | loop | – | E019 | L025 |
| S032 | 01:51.820 | 01:59.400 | ring / fabric | fullap | c:B001a | E020 | – |
| S033 | 01:59.400 | 02:00.840 | ring / fabric | flood1 | c:B001b | – | L026 |
| S034 | 02:00.840 | 02:01.560 | ring / fabric | flood2 | c:B001a | E021 | L027 |
| S035 | 02:01.560 | 02:10.060 | core / buffer | losses | – | – | – |
| S036 | 02:10.060 | 02:11.740 | console / front | task | – | – | L028 |
| S037 | 02:11.740 | 02:15.980 | ring / search | search1 | – | E022, E023 | – |
| S038 | 02:15.980 | 02:17.380 | ring / search | search2 | – | – | L029 |
| S039 | 02:17.380 | 02:22.480 | console / front | serial | – | E024 | – |
| S040 | 02:22.480 | 02:24.980 | console / front | ssh | – | E025, E026 | L030 |
| S041 | 02:24.980 | 02:27.920 | console / front | prompt | – | E027 | L031 |
| S042 | 02:27.920 | 02:30.680 | ring / port | noblock | p:SW2-2 | – | L032 |
| S043 | 02:30.680 | 02:33.840 | ring / crane | nobridge | – | E028 | L033 |
| S044 | 02:33.840 | 02:35.120 | console / front | flashlight | – | – | L034 |
| S045 | 02:35.120 | 02:38.920 | ring / search | search3 | – | – | L035 |
| S046 | 02:38.920 | 02:41.380 | core / mac | identify | – | E029 | L036 |
| S047 | 02:41.380 | 02:46.560 | console / front | shutdown | – | E030 | L037 |
| S048 | 02:46.560 | 02:48.960 | ring / crane | drain | – | E031, E032 | L038 |
| S049 | 02:48.960 | 02:51.960 | console / front | noroot2 | – | – | L039 |
| S050 | 02:51.960 | 02:54.340 | ring / fabric | fabricrest | c:LAST | – | L040 |
| S051 | 02:54.340 | 02:57.160 | core / buffer | history | – | – | L041 |
| S052 | 02:57.160 | 02:59.760 | ring / port | down | p:SW3-24 | – | L042 |
| S053 | 02:59.760 | 03:01.700 | core / buffer | empty | – | E033 | L043 |
| S054 | 03:01.700 | 03:04.500 | core / mac | stable | – | – | L044 |
| S055 | 03:04.500 | 03:06.720 | ring / crane | calm | – | – | L045 |
| S056 | 03:06.720 | 03:14.084 | console / front | verify | – | E034, E035, E036 | – |
| S057 | 03:14.084 | 03:21.449 | ring / fabric | unicast | c:U2 | E037 | – |
| S058 | 03:21.449 | 03:28.814 | ring / crane | end | – | E038, E039, E040 | – |

## B-001 und seine zwei Ringkopien

- **B-001/a**: Gabelung 24,988 s, Ende 163,474 s; Durchläufe SW2@32.87 · SW3@35.48 · SW1@37.07 · SW2@38.28 · SW3@39.30 · SW1@40.24 · SW2@41.08 · SW3@41.88 · SW1@42.65 · SW2@43.39 · SW3@44.13 · SW1@44.87 …
- **B-001/b**: Gabelung 24,988 s, Ende 164,221 s; Durchläufe SW3@32.96 · SW2@35.52 · SW1@37.07 · SW3@38.30 · SW2@39.33 · SW1@40.24 · SW3@41.10 · SW2@41.89 · SW1@42.65 · SW3@43.41 · SW2@44.14 · SW1@44.87 …

## Bildschirmtexte

**B01 · B-001 · Header** (43,96–60,14 s)
```
[ 44.10] B-001 (Header)
[ 44.10] VLAN: 120
[ 44.10] Ethernet src: 02:00:00:00:01:20
[ 44.10] Ethernet dst: ff:ff:ff:ff:ff:ff
[ 52.10] EtherType: 0x0806 (ARP)
[ 52.10] ARP: Who has 192.0.2.1? Tell 192.0.2.10
[ 52.10] Filmisches Kopiezeichen: B-001/a/b (kein Headerfeld)
```

**B02 · SW3 · STP und MAC** (60,14–86,52 s)
```
[ 60.30] SW3# show spanning-tree vlan 120
[ 61.00] Spanning tree instance(s) for vlan 120 does not exist.
[ 61.60] SW3# show running-config | include spanning-tree
[ 62.30] no spanning-tree vlan 120
[ 63.00] %SW_MATM-4-MACFLAP_NOTIF: Host 0200.0000.0120 in vlan 120 is flapping between port Gi1/0/1 and port Gi1/0/24
[ 63.60] Overlay: CPU 94% | Broadcast 620000 fps | Management timeout
```

**C01 · Zugang zu SW3** (137,38–153,84 s)
```
[142.60] noc$ ssh admin@10.20.0.3
[144.60] ssh: connect to host 10.20.0.3 port 22: Connection timed out
[145.10] noc$ screen /dev/ttyUSB0 9600
[146.20] SW3>enable
[147.20] SW3#
```

**B03 · SW3 · Gi1/0/24** (153,84–165 s)
```
[153.95] SW3# show interfaces GigabitEthernet1/0/24 description
[154.60] Interface  Status  Protocol  Description
[154.60] Gi1/0/24   up      up        PATCH-UNPLANNED-TO-SW1
[158.00] SW3# show interfaces GigabitEthernet1/0/24 switchport
[158.70] Administrative Mode: trunk
[158.70] Trunking VLANs Enabled: 120
[159.30] Overlay: Ringabschluss SW3/24 <-> SW1/24 bestätigt
```

**B04 · SW3 · shutdown** (161,38–168,96 s)
```
[161.45] SW3# configure terminal
[161.90] SW3(config)# interface GigabitEthernet1/0/24
[162.40] SW3(config-if)# shutdown
[162.80] SW3(config-if)# end
[163.00] %LINK-5-CHANGED: Interface GigabitEthernet1/0/24, changed state to administratively down
```

**B05 · SW3 · Prüfung** (186,72–202,9 s)
```
[186.90] SW3# show interfaces GigabitEthernet1/0/24
[187.60] GigabitEthernet1/0/24 is administratively down, line protocol is down
[188.50] Overlay: Broadcastrate 620000 -> 24 fps
[189.50] Neue MAC-Flaps: 0 | Management antwortet
[197.33] Client-Service-Test: erfolgreich
[199.00] Folgearbeit: STP für VLAN 120 korrekt aktivieren; Fehlpatch entfernen
```

## Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 00:15.580 | link | %LINK-3-UPDOWN: Interface GigabitEthernet1/0/24, changed state to up (SW3) |
| 00:16.300 | link | %LINK-3-UPDOWN: Interface GigabitEthernet1/0/24, changed state to up (SW1) |
| 00:22.800 | arp | H1: ARP Who has 192.0.2.1? Tell 192.0.2.10 (B-001) |
| 00:40.400 | sw | %SW_MATM-4-MACFLAP_NOTIF: Host 0200.0000.0120 in vlan 120 is flapping between port Gi1/0/1 and port Gi1/0/24 |
| 01:01.200 | cpu | SW3: CPU 94% · Queue-Drops steigen |
| 01:02.300 | mgmt | NOC: 10.20.0.3 antwortet nicht (SSH/SNMP Timeout) |
| 01:19.600 | drop | Unicast-Test H1 → 192.0.2.1: verworfen |
| 02:10.060 | task | Auftrag: Ringabschluss finden |
| 02:24.600 | mgmt | ssh 10.20.0.3: Connection timed out → serielle Console |
| 02:43.000 | ok | %LINK-5-CHANGED: Interface GigabitEthernet1/0/24, changed state to administratively down |
| 02:55.000 | ok | Broadcastrate fällt · keine neuen MAC-Flaps |
| 03:09.500 | ok | NOC: 10.20.0.3 antwortet wieder |
| 03:17.330 | ok | Unicast-Test H1 → 192.0.2.1: Antwort |
