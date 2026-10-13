# Layer 2 · Umsetzung und Cues

Messdaten und Transkriptzeiten bleiben im ASTRA-JSON unverändert. V-IDs sind redaktionelle Bildaktionen; E- und L-IDs verweisen auf die vorhandenen Quellen.

## Kapitel

| Kapitel | Start–Ende | Handlung | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- |
| C01 Layer Two | 00:00:00.000–00:00:09.020 | OSI-Ebenen öffnen; Anfangstitel über der aktiven Layer-2-Ebene. | E001, E002 | L001 |
| C02 Switching domain | 00:00:09.020–00:00:19.500 | Switch-Topologie zwischen Signal und Routinghorizont öffnen; Frame rastet an E004 ein. | E003, E004 | L002 |
| C03 ARP / Address resolution | 00:00:19.500–00:00:31.700 | ARP-Cache miss, Request im VLAN 10, Unicast Reply, Cache-Auflösung. Pegellücke nimmt Licht zurück. | E005, E006, E007, E008 | instrumental laut Quelle |
| C04 Unknown / Known unicast | 00:00:31.700–00:00:38.940 | Vorhandener ARP-Cache trifft auf gealterten FDB-Eintrag; Flooding, anschliessend gezielte Weiterleitung. | E009 | instrumental laut Quelle |
| C05 MAC learning / 802.1Q | 00:00:38.940–00:00:46.620 | Quell-MAC lernen, Frame verfolgen, 802.1Q-Tag einsetzen, Broadcast-Grenze zeigen. | E010, E011 | L003, L004, L005, L006 |
| C06 Root bridge | 00:00:46.620–00:00:53.800 | Root-Bridge und redundanten Port zeigen; klassische STP-Zustände. | E012 | L007, L008, L009, L010 |
| C07 VLAN 10 / VLAN 3 | 00:00:53.800–00:01:01.300 | VLAN 10 und VLAN 3 getrennt auf gemeinsamem Trunk; Frame stoppt am blockierten Port. | E013, E014, E015 | L011, L012, L013, L014 |
| C08 Port states | 00:01:01.300–00:01:10.500 | BPDU, Trunk, Access-Port, MAC move P1 → P3 und stabiler Baum. | E016, E017 | L015, L016, L017, L018, L019 |
| C09 L2TPv3 / Ethernet pseudowire | 00:01:10.500–00:01:24.000 | L2TPv3-Kontrollverbindung und Sitzung; Ethernet kapseln, über IP transportieren und auspacken. | E018, E019, E020, E021 | instrumental laut Quelle |
| C10 Loop demo / STP off | 00:01:24.000–00:01:46.900 | Explizite Loop-Demo bei deaktiviertem STP; Frame-Kopien im Kreis, MAC-Flapping. | E022, E023 | instrumental laut Quelle |
| C11 Spanning tree recovery | 00:01:46.900–00:01:59.420 | STP wieder aktiv: Listening, Learning, Forwarding; SW-03 P26 blockiert ab 113 s. | E024, E025, E026, E027 | instrumental laut Quelle |
| C12 OSI / Reprise | 00:01:59.420–00:02:13.620 | Stabilen Baum in die OSI-Schichtung zurückführen; strittige E030-Grenze steuert keinen Schnitt. | E028, E029 | L020 |
| C13 Switching domain / Reprise | 00:02:13.620–00:02:22.500 | Switching domain erneut öffnen; MAC-Matrix und ausgewählten Pfad zeigen. | E031, E032 | L021 |
| C14 Frames / Reprise | 00:02:22.500–00:02:30.160 | Frame-Perspektive der Reprise: Lernen, Übertragung, Tagging und Broadcast-Domain. | E033, E034 | L022, L023, L024, L025 |
| C15 Root bridge / Reprise | 00:02:30.160–00:02:37.020 | Root-Information und redundanten blockierten Pfad aus Gegenperspektive zeigen. | E035, E036 | L026, L027, L028, L029 |
| C16 VLANs / Reprise | 00:02:37.020–00:02:45.920 | VLAN-Reprise mit räumlicher Tiefe und lesbarem Trunk-Tag. | E037, E038 | L030, L031, L032, L033 |
| C17 MAC move / Reprise | 00:02:45.920–00:02:51.760 | Trunk, Access-Ausgang und MAC move P3 → P7; danach stabiles Netz. | E039 | L034, L035, L036, L037 |
| C18 LLDP / Direct neighbours | 00:02:51.760–00:02:58.500 | LLDP-Ankündigungen auf direkten Links; Nachbar-/Porttabelle. | E040, E041, E042, E043 | instrumental laut Quelle |
| C19 LACP / Link aggregation | 00:02:58.500–00:03:05.920 | LACP-Actor/Partner und Synchronisation; zwei Mitglieder werden ein logischer Link. | redaktionell | instrumental laut Quelle |
| C20 Flows / Members | 00:03:05.920–00:03:14.000 | Zwei unterscheidbare Flows bleiben jeweils auf einem festen Mitglied. | redaktionell | instrumental laut Quelle |
| C21 Clean forwarding | 00:03:14.000–00:03:22.341 | Montage der bereits eingeführten VLAN-, Frame- und Tunnelmechanismen. | redaktionell | instrumental laut Quelle |
| C22 Layer 2 / Samuel Heinrich | 00:03:22.341–00:03:29.960 | Aktive Schlusstotale; LAYER 2 und SAMUEL HEINRICH bis zum tatsächlichen Ende. | E044, E045, E046 | instrumental laut Quelle |

## Einstellungen

| ID / V-ID | Start–Ende | Raum / Kamera / Handlung | E-IDs | L-IDs |
| --- | --- | --- | --- | --- |
| S001 / V001 | 00:00:00.000–00:00:09.020 | topology / stack / osi | E001, E002 | L001 |
| S002 / V002 | 00:00:09.020–00:00:12.600 | topology / reveal / domain |  | L002 |
| S003 / V003 | 00:00:12.600–00:00:18.711 | topology / orbit / domain | E003 | L002 |
| S004 / V004 | 00:00:18.711–00:00:19.500 | frame / push / wire | E004 | L002 |
| S005 / V005 | 00:00:19.500–00:00:21.700 | topology / host / arp | E005, E006 |  |
| S006 / V006 | 00:00:21.700–00:00:26.800 | topology / overhead / arp | E007 |  |
| S007 / V007 | 00:00:26.800–00:00:30.211 | frame / track / arp |  |  |
| S008 / V008 | 00:00:30.211–00:00:31.700 | control / matrix / arp | E008 |  |
| S009 / V009 | 00:00:31.700–00:00:35.400 | topology / overhead / unknown | E009 |  |
| S010 / V010 | 00:00:35.400–00:00:38.940 | topology / chase / known |  |  |
| S011 / V011 | 00:00:38.940–00:00:41.020 | control / matrix / learning | E010, E011 | L003 |
| S012 / V012 | 00:00:41.020–00:00:42.900 | frame / track / wire |  | L004 |
| S013 / V013 | 00:00:42.900–00:00:44.800 | frame / side / tag |  | L005 |
| S014 / V014 | 00:00:44.800–00:00:46.620 | topology / overhead / broadcast |  | L006 |
| S015 / V015 | 00:00:46.620–00:00:48.760 | control / root / stp | E012 | L007, L008 |
| S016 / V016 | 00:00:48.760–00:00:51.100 | topology / port / stp |  | L009, L010 |
| S017 / V017 | 00:00:51.100–00:00:53.800 | topology / orbit / stp |  |  |
| S018 / V018 | 00:00:53.800–00:00:56.461 | topology / reveal / vlans | E013, E014 | L011, L012 |
| S019 / V019 | 00:00:56.461–00:00:57.580 | topology / port / stp | E015 | L012 |
| S020 / V020 | 00:00:57.580–00:00:59.420 | topology / overhead / vlans |  | L013 |
| S021 / V021 | 00:00:59.420–00:01:01.300 | frame / side / tag |  | L014 |
| S022 / V022 | 00:01:01.300–00:01:03.500 | control / root / bpdu | E016, E017 | L015 |
| S023 / V023 | 00:01:03.500–00:01:04.400 | frame / track / trunk |  | L016 |
| S024 / V024 | 00:01:04.400–00:01:06.920 | frame / side / access |  | L017 |
| S025 / V025 | 00:01:06.920–00:01:08.780 | control / matrix / move |  | L018 |
| S026 / V026 | 00:01:08.780–00:01:10.500 | topology / reveal / stp |  | L019 |
| S027 / V027 | 00:01:10.500–00:01:11.461 | tunnel / wide / setup | E018, E019, E020 |  |
| S028 / V028 | 00:01:11.461–00:01:14.300 | tunnel / launch / setup | E021 |  |
| S029 / V029 | 00:01:14.300–00:01:18.300 | tunnel / track / encapsulate |  |  |
| S030 / V030 | 00:01:18.300–00:01:21.000 | tunnel / inside / transport |  |  |
| S031 / V031 | 00:01:21.000–00:01:24.000 | tunnel / arrival / decapsulate |  |  |
| S032 / V032 | 00:01:24.000–00:01:29.831 | topology / overhead / loop | E022 |  |
| S033 / V033 | 00:01:29.831–00:01:35.500 | topology / chase / loop | E023 |  |
| S034 / V034 | 00:01:35.500–00:01:40.500 | control / matrix / loop |  |  |
| S035 / V035 | 00:01:40.500–00:01:44.100 | topology / orbit / loop |  |  |
| S036 / V036 | 00:01:44.100–00:01:46.900 | topology / overhead / loop |  |  |
| S037 / V037 | 00:01:46.900–00:01:48.591 | control / root / recover | E024, E025 |  |
| S038 / V038 | 00:01:48.591–00:01:53.000 | topology / port / recover | E026 |  |
| S039 / V039 | 00:01:53.000–00:01:56.400 | topology / overhead / stp |  |  |
| S040 / V040 | 00:01:56.400–00:01:59.420 | control / root / stp | E027 |  |
| S041 / V041 | 00:01:59.420–00:02:03.500 | topology / stack / osi | E028, E029 | L020 |
| S042 / V042 | 00:02:03.500–00:02:09.000 | topology / orbit / stp |  | L020 |
| S043 / V043 | 00:02:09.000–00:02:13.620 | topology / stack / osi |  | L020 |
| S044 / V044 | 00:02:13.620–00:02:15.781 | topology / reveal / domain | E031 | L021 |
| S045 / V045 | 00:02:15.781–00:02:19.500 | control / matrix / learning | E032 | L021 |
| S046 / V046 | 00:02:19.500–00:02:22.500 | topology / chase / known |  |  |
| S047 / V047 | 00:02:22.500–00:02:24.440 | control / matrix / learning | E033 | L022 |
| S048 / V048 | 00:02:24.440–00:02:26.480 | frame / track / wire |  | L023 |
| S049 / V049 | 00:02:26.480–00:02:28.180 | frame / side / tag | E034 | L024 |
| S050 / V050 | 00:02:28.180–00:02:30.160 | topology / overhead / broadcast |  | L025 |
| S051 / V051 | 00:02:30.160–00:02:32.160 | control / root / stp | E035 | L026, L027 |
| S052 / V052 | 00:02:32.160–00:02:34.531 | topology / port / stp |  | L028, L029 |
| S053 / V053 | 00:02:34.531–00:02:37.020 | topology / orbit / stp | E036 |  |
| S054 / V054 | 00:02:37.020–00:02:41.080 | topology / reveal / vlans | E037, E038 | L030, L031 |
| S055 / V055 | 00:02:41.080–00:02:42.880 | topology / overhead / vlans |  | L032 |
| S056 / V056 | 00:02:42.880–00:02:45.920 | frame / side / tag |  | L033 |
| S057 / V057 | 00:02:45.920–00:02:46.720 | frame / track / trunk | E039 | L034 |
| S058 / V058 | 00:02:46.720–00:02:47.860 | frame / side / access |  | L035 |
| S059 / V059 | 00:02:47.860–00:02:48.520 | control / matrix / move |  | L036 |
| S060 / V060 | 00:02:48.520–00:02:51.760 | topology / reveal / stp |  | L037 |
| S061 / V061 | 00:02:51.760–00:02:54.691 | control / neighbours / lldp | E040, E041, E042 |  |
| S062 / V062 | 00:02:54.691–00:02:56.600 | topology / port / lldp | E043 |  |
| S063 / V063 | 00:02:56.600–00:02:58.500 | control / neighbours / lldp |  |  |
| S064 / V064 | 00:02:58.500–00:03:01.200 | control / bundle / lacp |  |  |
| S065 / V065 | 00:03:01.200–00:03:03.700 | topology / bundle / lacp |  |  |
| S066 / V066 | 00:03:03.700–00:03:05.920 | control / bundle / lacp |  |  |
| S067 / V067 | 00:03:05.920–00:03:09.700 | topology / bundle / flows |  |  |
| S068 / V068 | 00:03:09.700–00:03:12.000 | frame / track / flows |  |  |
| S069 / V069 | 00:03:12.000–00:03:14.000 | topology / overhead / flows |  |  |
| S070 / V070 | 00:03:14.000–00:03:16.800 | frame / side / tag |  |  |
| S071 / V071 | 00:03:16.800–00:03:19.600 | tunnel / wide / transport |  |  |
| S072 / V072 | 00:03:19.600–00:03:22.341 | topology / reveal / final |  |  |
| S073 / V073 | 00:03:22.341–00:03:29.960 | topology / final / final | E044, E045, E046 |  |

## Präzisierungen

- E030 ist nur als Quelle erhalten, nicht als Trigger. L020 bleibt 119,420–133,620 s; kein behaupteter Instrumentalbeginn bei 125,080 s.
- E019 und E020 liegen beide bei 71,300 s. Die gespeicherten RMS-Werte zeigen eine kurze Lücke, danach den starken Anstieg. Das Bild nimmt Licht zurück und öffnet sich anschliessend.
- VLAN 3 ersetzt VLAN 30 aus dem früheren Drehbuch, entsprechend den Lyrics.
- Ab 171,760 s bleiben 38,200166667 Sekunden gestaltete instrumentale Musik.
- Schlussblende entfällt: RMS und E045 zeigen bis zum Ende Aktivität. Titel und Bewegung bleiben bis zum letzten Frame.
