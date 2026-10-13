# OSPF Neighbors · Umsetzung und Cues

E-IDs = Audiomessung oder Transkriptgrenze aus ASTRA. L-IDs = vorhandene automatische Gesangssegmente. V-IDs = redaktionelle Bild-/Protokollaktionen. Netzwerkdaten sind Szenariowerte.

## Kapitel

| Kapitel | Start–Ende | Handlung | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- |
| C01 OSPF Neighbors | 00:00:00.000–00:00:07.600 | Atlas aus der Dunkelheit öffnen; Anfangstitel über ersten Hello-Impulsen. | E001, E002 | instrumental laut Quelle |
| C02 Area 0 / Hello | 00:00:07.600–00:00:23.160 | Hello zwischen direkten Nachbarn; Routerinseln und Backbone verbinden sich. | E003, E004 | L001, L002, L003, L004 |
| C03 Init → Two-Way | 00:00:23.160–00:00:36.980 | Router-ID im Hello-Nachbarfeld identifiziert bidirektionale Kommunikation. | E005, E006 | L005, L006, L007, L008 |
| C04 DR / BDR / DROTHER | 00:00:36.980–00:00:47.880 | R4 ist DR, R5 BDR; R6 und R7 bleiben DROTHER. Matrix zeigt Beziehungen. | E007, E008, E009, E010, E011, E012 | L009, L010, L011, L012 |
| C05 Database aligned / SPF | 00:00:47.880–00:01:02.380 | ExStart, DBD-Header, LSR, LSU und LSAck bis Full; SPF öffnet Wege. | E013, E014, E015, E016, E017 | L013, L014, L015, L016, L017, L018, L019, L020 |
| C06 Area 1 / ABR | 00:01:02.380–00:01:16.580 | R7 verbindet Area 0 und Area 1. Getrennte LSDBs; Type-3-LSA neu erzeugen. | E018, E019, E020 | instrumental laut Quelle |
| C07 Equal Cost / Flows | 00:01:16.580–00:01:30.760 | Zwei gleich teure Wege; vier unterscheidbare Flows bleiben auf ihren gewählten Wegen. | E021, E022, E023 | L021, L022, L023, L024 |
| C08 Link State / Cost | 00:01:30.760–00:01:44.840 | LSA aktualisieren; Metrik R1–R2 steigt 10 → 25, SPF wählt R3. | E024, E025, E026, E027 | L025, L026, L027, L028, L029, L030 |
| C09 Reliable flood / SPF | 00:01:44.840–00:01:58.500 | LSU und Bestätigungen; SPF aus zwei Routerperspektiven, keine globale Wurzel. | E028 | L031, L032, L033, L034 |
| C10 Hello / ECMP reprise | 00:01:58.500–00:02:12.680 | Metrik zurück auf 10; Datenbankabgleich und beide Wege erneut öffnen. | E029, E030 | L035, L036, L037, L038, L039, L040, L041, L042 |
| C11 Link down / Convergence | 00:02:12.680–00:02:24.280 | R2–R4 fällt bei E032 aus; LSAs aktualisieren, Nutzdaten wechseln zu R3. | E031, E032, E033 | instrumental laut Quelle |
| C12 Full / Roles / Recovery | 00:02:24.280–00:02:48.880 | Passende Nachbarpaare zu Outro-Begriffen; Link ab E038 wieder aufbauen, ECMP zurück. | E034, E035, E036, E037, E038, E039 | L043, L044, L045, L046, L047, L048, L049 |
| C13 OSPF / Samuel Heinrich | 00:02:48.880–00:02:58.350 | Aktiven Multi-Area-Atlas öffnen; Schlusstext; letzter kräftiger Lichtakzent bei E045. | E040, E041, E042, E043, E044, E045 | instrumental laut Quelle |
| C14 Actual audio tail | 00:02:58.350–00:03:01.081 | Atlas und Titel erst mit dem tatsächlichen Endabfall auflösen. | E046 | instrumental laut Quelle |

## Einstellungen

| ID / V-ID | Start–Ende | Raum / Kamera | Bildaktion | E-IDs | L-IDs |
| --- | --- | --- | --- | --- | --- |
| S001 / V001 | 00:00:00.000–00:00:07.600 | atlas / opening | Atlas öffnen; OSPF / NEIGHBORS und SAMUEL HEINRICH einblenden. | E001, E002 |  |
| S002 / V002 | 00:00:07.600–00:00:11.000 | atlas / chase | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. | E003 | L001 |
| S003 / V003 | 00:00:11.000–00:00:14.820 | atlas / wide | Backbone-Karte räumlich öffnen. |  | L002 |
| S004 / V004 | 00:00:14.820–00:00:18.360 | atlas / orbit | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. | E004 | L003 |
| S005 / V005 | 00:00:18.360–00:00:23.160 | atlas / rise | Backbone-Karte räumlich öffnen. |  | L004 |
| S006 / V006 | 00:00:23.160–00:00:26.640 | neighbour / close | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. | E005 | L005 |
| S007 / V007 | 00:00:26.640–00:00:30.220 | atlas / orbit | Backbone-Karte räumlich öffnen. | E006 | L006 |
| S008 / V008 | 00:00:30.220–00:00:33.860 | neighbour / side | Init und nachfolgende Nachbarzustände hervorheben. |  | L007 |
| S009 / V009 | 00:00:33.860–00:00:36.980 | neighbour / close | Eigenen Router-ID-Eintrag bestätigen; später normales DROTHER-Paar zeigen. |  | L008 |
| S010 / V010 | 00:00:36.980–00:00:39.160 | atlas / lan | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. | E007, E008 | L009 |
| S011 / V011 | 00:00:39.160–00:00:40.920 | neighbour / matrix | R6 / R7 bleiben Two-Way; Rollen von Zuständen unterscheiden. | E009 | L010 |
| S012 / V012 | 00:00:40.920–00:00:42.780 | atlas / bdr | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. | E010 | L011 |
| S013 / V013 | 00:00:42.780–00:00:45.000 | neighbour / matrix | R5 als bestehenden Backup Designated Router hervorheben. | E011, E012 | L012 |
| S014 / V014 | 00:00:45.000–00:00:47.880 | atlas / lan | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. |  |  |
| S015 / V015 | 00:00:47.880–00:00:49.720 | database / wide | DBD-Sequenzaushandlung vorbereiten; ExStart zeigen. | E013, E014 | L013 |
| S016 / V016 | 00:00:49.720–00:00:51.620 | database / side | LSA-Header vergleichen; fehlende oder neuere Informationen markieren. | E015 | L014 |
| S017 / V017 | 00:00:51.620–00:00:53.360 | database / track | LSR, LSU und LSAck nacheinander unterscheiden. |  | L015 |
| S018 / V018 | 00:00:53.360–00:00:55.180 | database / wide | Passende Datenbankstände derselben Area gegenüberstellen. |  | L016 |
| S019 / V019 | 00:00:55.180–00:00:58.640 | routing / wide | SPF aus lokaler Routerperspektive durchlaufen. | E016 | L017, L018 |
| S020 / V020 | 00:00:58.640–00:01:02.380 | atlas / chase | Unterscheidbare Nutzdatenflows auf ausgewählten Wegen verfolgen. | E017 | L019, L020 |
| S021 / V021 | 00:01:02.380–00:01:05.000 | atlas / areas | Area 1 über R7 öffnen; Area-Grenze und ABR zeigen. | E018 |  |
| S022 / V022 | 00:01:05.000–00:01:08.000 | neighbour / side | Neue Punkt-zu-Punkt-Nachbarschaft R7 / R8 aufbauen. | E019 |  |
| S023 / V023 | 00:01:08.000–00:01:11.500 | database / wide | Separate LSDBs zeigen; lokale LSA-Information endet am ABR. |  |  |
| S024 / V024 | 00:01:11.500–00:01:14.700 | database / track | Type-3-LSA am ABR neu erzeugen; Präfix und Metrik zeigen. |  |  |
| S025 / V025 | 00:01:14.700–00:01:16.580 | atlas / border | Area 1 über R7 öffnen; Area-Grenze und ABR zeigen. | E020 |  |
| S026 / V026 | 00:01:16.580–00:01:19.700 | routing / wide | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. | E021, E022 | L021 |
| S027 / V027 | 00:01:19.700–00:01:23.220 | atlas / chase | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |  | L022 |
| S028 / V028 | 00:01:23.220–00:01:26.620 | neighbour / matrix | DROTHER-Nachbarschaft mit Full-Beziehungen zu DR/BDR vergleichen. | E023 | L023 |
| S029 / V029 | 00:01:26.620–00:01:30.760 | atlas / orbit | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |  | L024 |
| S030 / V030 | 00:01:30.760–00:01:34.300 | database / track | LSA-Identität und fortschreitende Sequenznummer zeigen. | E024, E025 | L025, L026 |
| S031 / V031 | 00:01:34.300–00:01:35.980 | routing / side | Konfigurierte Kostenänderung R1–R2 zeigen. |  | L027 |
| S032 / V032 | 00:01:35.980–00:01:37.760 | routing / wide | SPF aus lokaler Routerperspektive durchlaufen. |  | L028 |
| S033 / V033 | 00:01:37.760–00:01:39.720 | atlas / lan | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. |  | L029 |
| S034 / V034 | 00:01:39.720–00:01:43.000 | atlas / local | Nutzdaten R6 → R7 direkt über das gemeinsame Ethernetsegment weiterleiten. |  | L030 |
| S035 / V035 | 00:01:43.000–00:01:44.840 | database / wide | LSA-Identität und fortschreitende Sequenznummer zeigen. | E026, E027 |  |
| S036 / V036 | 00:01:44.840–00:01:46.600 | database / track | LSU und Bestätigungen als verlässlichen Austausch zeigen. | E028 | L031 |
| S037 / V037 | 00:01:46.600–00:01:49.000 | routing / side | Konfigurierte Kostenänderung R1–R2 zeigen. |  | L032 |
| S038 / V038 | 00:01:49.000–00:01:51.800 | database / wide | Passende Datenbankstände derselben Area gegenüberstellen. |  |  |
| S039 / V039 | 00:01:51.800–00:01:54.740 | routing / wide | SPF-Baum mit Wurzel R1 berechnen. |  | L033 |
| S040 / V040 | 00:01:54.740–00:01:58.500 | routing / side | Dieselbe Topologie mit lokaler Wurzel R4 berechnen. |  | L034 |
| S041 / V041 | 00:01:58.500–00:02:00.200 | neighbour / close | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. | E029, E030 | L035 |
| S042 / V042 | 00:02:00.200–00:02:03.840 | atlas / rise | Atlas vergrössern; beide gleichwertigen Wege wieder öffnen. |  | L036, L037 |
| S043 / V043 | 00:02:03.840–00:02:05.580 | database / wide | Passende Datenbankstände derselben Area gegenüberstellen. |  | L038 |
| S044 / V044 | 00:02:05.580–00:02:09.160 | routing / wide | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |  | L039, L040 |
| S045 / V045 | 00:02:09.160–00:02:12.680 | atlas / orbit | Unterscheidbare Nutzdatenflows auf ausgewählten Wegen verfolgen. |  | L041, L042 |
| S046 / V046 | 00:02:12.680–00:02:15.000 | atlas / fault | Carrier-Verlust R2–R4; aktualisierte LSAs und Konvergenz zeigen. | E031, E032 |  |
| S047 / V047 | 00:02:15.000–00:02:18.000 | database / track | Carrier-Verlust R2–R4; aktualisierte LSAs und Konvergenz zeigen. |  |  |
| S048 / V048 | 00:02:18.000–00:02:21.000 | routing / wide | Nutzdaten nach abgeschlossener Berechnung über R3 weiterleiten. |  |  |
| S049 / V049 | 00:02:21.000–00:02:24.280 | atlas / chase | Nutzdaten nach abgeschlossener Berechnung über R3 weiterleiten. | E033 |  |
| S050 / V050 | 00:02:24.280–00:02:25.400 | neighbour / matrix | Full-Beziehung R6 / R4 hervorheben. | E034 | L043 |
| S051 / V051 | 00:02:25.400–00:02:27.060 | neighbour / matrix | Eigenen Router-ID-Eintrag bestätigen; später normales DROTHER-Paar zeigen. | E035, E036 | L044 |
| S052 / V052 | 00:02:27.060–00:02:30.271 | atlas / local | Nutzdaten R6 → R7 direkt über das gemeinsame Ethernetsegment weiterleiten. |  | L045 |
| S053 / V053 | 00:02:30.271–00:02:32.680 | database / wide | Separate LSDBs zeigen; lokale LSA-Information endet am ABR. | E037 |  |
| S054 / V054 | 00:02:32.680–00:02:36.640 | neighbour / matrix | R6 / R7 bleiben Two-Way; Rollen von Zuständen unterscheiden. |  | L046 |
| S055 / V055 | 00:02:36.640–00:02:40.800 | atlas / lan | R4 als bestehenden Designated Router hervorheben. |  | L047 |
| S056 / V056 | 00:02:40.800–00:02:44.000 | neighbour / side | R2 / R4 erneut durch Init, Two-Way und Datenbankabgleich zu Full führen. | E038, E039 |  |
| S057 / V057 | 00:02:44.000–00:02:46.360 | routing / wide | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |  |  |
| S058 / V058 | 00:02:46.360–00:02:47.760 | atlas / chase | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |  | L048 |
| S059 / V059 | 00:02:47.760–00:02:48.880 | atlas / bdr | R5 als bestehenden Backup Designated Router hervorheben. |  | L049 |
| S060 / V060 | 00:02:48.880–00:02:51.671 | atlas / areas | Aktiven Multi-Area-Atlas öffnen; Titel und Name über der Welt. | E040, E041 |  |
| S061 / V061 | 00:02:51.671–00:02:58.350 | atlas / final | Aktiven Multi-Area-Atlas öffnen; Titel und Name über der Welt. | E042, E043, E044, E045 |  |
| S062 / V062 | 00:02:58.350–00:03:01.081 | atlas / final | Bild und Titel mit dem tatsächlichen Audio-Endabfall auflösen. | E046 |  |

## Kuratierte Audio-Cues

| E-ID | Zeit | Herkunft / Unsicherheit | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | gemessen; ±0.000 s | Beginn der Original-WAV | Atlas öffnen; OSPF / NEIGHBORS und SAMUEL HEINRICH einblenden. |
| E002 | 00:00:01.500 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +10.9 dB | Atlas bei Energieanstieg öffnen. |
| E003 | 00:00:07.600 | aus Transkript übernommen; ±0.350 s | Beginn Intro; Abschnittsgrenze aus Transkript | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. |
| E004 | 00:00:15.000 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.5 dB | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. |
| E005 | 00:00:23.160 | aus Transkript übernommen; ±0.350 s | Beginn Verse; Abschnittsgrenze aus Transkript | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. |
| E006 | 00:00:27.261 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.64 | Backbone-Karte räumlich öffnen. |
| E007 | 00:00:36.980 | aus Transkript übernommen; ±0.350 s | Beginn Call; Abschnittsgrenze aus Transkript | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. |
| E008 | 00:00:37.800 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.8 dB | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. |
| E009 | 00:00:39.160 | aus Transkript übernommen; ±0.350 s | Beginn Response; Abschnittsgrenze aus Transkript | R6 / R7 bleiben Two-Way; Rollen von Zuständen unterscheiden. |
| E010 | 00:00:40.920 | aus Transkript übernommen; ±0.350 s | Beginn Call; Abschnittsgrenze aus Transkript | DR, BDR und DROTHER auf dem Broadcastsegment gegenüberstellen. |
| E011 | 00:00:42.780 | aus Transkript übernommen; ±0.350 s | Beginn Response; Abschnittsgrenze aus Transkript | R5 als bestehenden Backup Designated Router hervorheben. |
| E012 | 00:00:42.821 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 1.93 | R5 als bestehenden Backup Designated Router hervorheben. |
| E013 | 00:00:47.880 | aus Transkript übernommen; ±0.350 s | Beginn Hook; Abschnittsgrenze aus Transkript | DBD-Sequenzaushandlung vorbereiten; ExStart zeigen. |
| E014 | 00:00:48.200 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.0 dB | DBD-Sequenzaushandlung vorbereiten; ExStart zeigen. |
| E015 | 00:00:49.931 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.35 | LSA-Header vergleichen; fehlende oder neuere Informationen markieren. |
| E016 | 00:00:57.031 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.20 | SPF aus lokaler Routerperspektive durchlaufen. |
| E017 | 00:01:02.100 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.3 dB | Anstieg bereitet die Öffnung nach Area 1 vor. |
| E018 | 00:01:02.380 | aus Transkript übernommen; ±0.350 s | Beginn Instrumental; Abschnittsgrenze aus Transkript | Area 1 über R7 öffnen; Area-Grenze und ABR zeigen. |
| E019 | 00:01:06.771 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.46 | Neue Punkt-zu-Punkt-Nachbarschaft R7 / R8 aufbauen. |
| E020 | 00:01:14.700 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.0 dB | Area 1 über R7 öffnen; Area-Grenze und ABR zeigen. |
| E021 | 00:01:16.580 | aus Transkript übernommen; ±0.350 s | Beginn Chorus; Abschnittsgrenze aus Transkript | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |
| E022 | 00:01:17.351 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.09 | Gleichwertige Wege hervorheben; Verteilung pro Flow inszenieren. |
| E023 | 00:01:26.161 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.33 | DROTHER-Nachbarschaft mit Full-Beziehungen zu DR/BDR vergleichen. |
| E024 | 00:01:30.760 | aus Transkript übernommen; ±0.350 s | Beginn Verse 2; Abschnittsgrenze aus Transkript | LSA-Identität und fortschreitende Sequenznummer zeigen. |
| E025 | 00:01:32.321 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.05 | LSA-Identität und fortschreitende Sequenznummer zeigen. |
| E026 | 00:01:43.000 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.1 dB | LSA-Identität und fortschreitende Sequenznummer zeigen. |
| E027 | 00:01:43.761 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.02 | LSA-Identität und fortschreitende Sequenznummer zeigen. |
| E028 | 00:01:44.840 | aus Transkript übernommen; ±0.350 s | Beginn Bridge; Abschnittsgrenze aus Transkript | LSU und Bestätigungen als verlässlichen Austausch zeigen. |
| E029 | 00:01:58.500 | aus Transkript übernommen; ±0.350 s | Beginn Final Hook; Abschnittsgrenze aus Transkript | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. |
| E030 | 00:01:59.100 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.8 dB | Hello verfolgen; Sender-Router-ID und Nachbarfeld zeigen. |
| E031 | 00:02:12.680 | aus Transkript übernommen; ±0.350 s | Beginn Instrumental; Abschnittsgrenze aus Transkript | Carrier-Verlust R2–R4; aktualisierte LSAs und Konvergenz zeigen. |
| E032 | 00:02:12.700 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.8 dB | Link R2–R4 im redaktionellen Szenario ausfallen lassen. |
| E033 | 00:02:23.711 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.55 | Nutzdaten nach abgeschlossener Berechnung über R3 weiterleiten. |
| E034 | 00:02:24.280 | aus Transkript übernommen; ±0.350 s | Beginn Outro; Abschnittsgrenze aus Transkript | Full-Beziehung R6 / R4 hervorheben. |
| E035 | 00:02:26.200 | gemessen; ±0.100 s | 100-ms-RMS -44.0 dBFS | Bei kurzer Pegellücke Licht und Paketgrösse zurücknehmen; die Nachbarschaft bleibt bestehen. |
| E036 | 00:02:26.700 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.4 dB | Eigenen Router-ID-Eintrag bestätigen; später normales DROTHER-Paar zeigen. |
| E037 | 00:02:30.271 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.34 | Separate LSDBs zeigen; lokale LSA-Information endet am ABR. |
| E038 | 00:02:40.800 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.1 dB | Wiederherstellung R2–R4 inszenieren. |
| E039 | 00:02:41.191 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.55 | R2 / R4 erneut durch Init, Two-Way und Datenbankabgleich zu Full führen. |
| E040 | 00:02:48.880 | aus Transkript übernommen; ±0.350 s | Beginn Instrumental; Abschnittsgrenze aus Transkript | Aktiven Multi-Area-Atlas öffnen; Titel und Name über der Welt. |
| E041 | 00:02:48.880 | aus Transkript übernommen; ±0.500 s | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende bleibt aktiv. |
| E042 | 00:02:51.671 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.31 | Aktiven Multi-Area-Atlas öffnen; Titel und Name über der Welt. |
| E043 | 00:02:54.700 | gemessen; ±0.500 s | Geglätteter RMS-Verlauf ändert sich über 1 s um +14.1 dB | Schlusstotale über 500 ms weiter öffnen. |
| E044 | 00:02:55.100 | gemessen; ±0.300 s | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Kein Blenden-Trigger: spätere Energie und Peak bei 178,225 s widersprechen einem frühen Schluss. |
| E045 | 00:02:58.221 | gemessen; ±0.040 s | Spektraler Anstieg, relative Stärke 2.47 | Letzten Lichtakzent am Atlas setzen. |
| E046 | 00:03:01.081 | gemessen; ±0.000 s | Ende der Original-WAV | Bild am exakten Ende der Original-WAV schliessen. |

## Redaktionelle Protokollaktionen / Syslogs

| V-ID | Zeit | Aktion | Einstellung |
| --- | --- | --- | --- |
| V063 | 00:00:07.600 | Area 0 / Hello received. | S002 |
| V064 | 00:00:23.160 | R1 / R2: DOWN → INIT. | S006 |
| V065 | 00:00:33.860 | Own Router-ID found: INIT → 2-WAY. | S009 |
| V066 | 00:00:36.980 | LAN: R4 DR / R5 BDR. | S010 |
| V067 | 00:00:39.160 | R6 is DROTHER; R6 / R7 stay 2-WAY. | S011 |
| V068 | 00:00:47.880 | R1 / R2: 2-WAY → EXSTART. | S015 |
| V069 | 00:00:49.720 | EXCHANGE / LSA headers compared. | S016 |
| V070 | 00:00:51.620 | LOADING / request missing LSAs. | S017 |
| V071 | 00:00:53.360 | LSDB aligned: LOADING → FULL. | S018 |
| V072 | 00:00:55.180 | R1 / metric 21 / next hops R2,R3. | S019 |
| V073 | 00:01:02.380 | R7 ABR / Area 1 interface enabled. | S021 |
| V074 | 00:01:13.200 | Type-3 originated / metric 11. | S024 |
| V075 | 00:01:19.700 | Example / stable per-flow forwarding. | S027 |
| V076 | 00:01:34.300 | R1–R2 cost changed: 10 → 25. | S031 |
| V077 | 00:01:35.980 | R1 / next hop R3 selected. | S032 |
| V078 | 00:01:44.840 | LSA flooded / acknowledgement received. | S036 |
| V079 | 00:01:58.500 | R1–R2 cost restored: 25 → 10. | S041 |
| V080 | 00:02:01.680 | Equal-cost next hops R2,R3 restored. | S042 |
| V081 | 00:02:12.700 | R2–R4 carrier lost / neighbour DOWN. | S046 |
| V082 | 00:02:15.000 | Topology change advertised. | S047 |
| V083 | 00:02:18.000 | Failed link removed / next hop R3. | S048 |
| V084 | 00:02:25.400 | R6 / R7: 2-WAY is normal here. | S051 |
| V085 | 00:02:40.800 | R2–R4 carrier restored / INIT. | S056 |
| V086 | 00:02:42.100 | R2 / R4: EXCHANGE. | S056 |
| V087 | 00:02:44.000 | R2 / R4: FULL / routes recalculated. | S057 |
| V088 | 00:02:46.360 | Both equal-cost paths available. | S058 |
| V089 | 00:02:47.760 | R5 remains backup designated router. | S059 |

## Grenzen

- Originale Gesangszeiten unverändert; automatisch erzeugt und nicht manuell hörverifiziert.
- E046 hat in der Analyse eine gerundete Endzeit. Nur die Umsetzung verwendet die exakte Sampledauer.
- BPM und Raster geschätzt; kein Snapping von Lyrics.
- 178,350 s ist eine redaktionelle Blendenentscheidung auf Basis des gemessenen Endabfalls.

E044 bleibt dokumentiert und startet keine Blende. Originalaudio, Analyse und Transkript werden nicht verändert.
