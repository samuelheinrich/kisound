# Layer 2 · ASTRA-DREHBUCH · Browserfassung

## Leitidee und Verlauf

Eine abstrakte Netzwerkwelt lernt, welche Quell-MAC an welchem Port erreichbar ist. Cyanfarbene VLAN-10- und violette VLAN-3-Ebenen transportieren getrennte Frame-Ströme. Kontrollsignale halten die physisch redundante Topologie geordnet. Eine bewusst aktivierte Loop-Demo verdichtet den Raum, bevor Spanning Tree wieder Ordnung herstellt.

Verlauf: Orientierung → Lernen → Trennen und Kapseln → Schleife → Wiederherstellung → gemeinsame, stabile Infrastruktur. Figuren und Stadtarchitektur entfallen zugunsten räumlicher Topologien und Frame-Felder.

## Grundlage

Release `01_Layer_2_0.3-1.wav`; SHA-256 `15b1566f6863945032ca9ca508b26d71b86d594a8d81d9f5ffd2753a28800e8c`. Originaldauer 10078088/48000 = 209,960166667 s. Die vorhandene Analyse empfiehlt geschätzte 128 BPM mit mittlerer Sicherheit. Die Umsetzung nutzt 60 fps wie die Referenzfilme, 12’598 Frames.

Die Zeiten der vorhandenen automatischen Transkription bleiben unverändert. Keine neue manuelle Hörprüfung wird behauptet. Die ausgeschlossene überlappende Quellzeile bleibt ausgeschlossen. E030 steuert keinen Schnitt; die Reprise hat eine zusammenhängende Handlung.

## Bildsprache, Farben und Titel

Dunkles Petrol, Blau-Schwarz, metallische geometrische Körper und räumlich gestaffelte Lichtwege. VLAN 10 ist cyan, VLAN 3 violett. BPDU-/Tunnelkontrolle benutzt Bernstein, Bestätigung Grün und die Schleifenwarnung Rot. Im LACP-Detail unterscheiden Cyan und Bernstein die zwei gezeigten Flows und Mitglieder.

Die Räume sind Topologie, Frame-Inspektor, Kontrollmatrix und Tunnel. Wiederkehrende Motive: flache Frame-Karte, eingeschobenes Tag, Porttor, adressierte Tabellenzeile und Baumstruktur. Isometrische Übersicht, senkrechte Fahrten, kurze Frame-Verfolgung und präzise rechtwinklige Schnitte. Protokollabläufe bekommen lesbare Haltepunkte. Kein weisser Ganzbild-Strobe und kein dauerndes Kamerawackeln.

Titel **LAYER 2**, Weiss/Cyan, in lokal eingebundener Michroma. Darunter gesperrtes **SAMUEL HEINRICH**, flankiert von zwei bernsteinfarbenen Linien. Anfang 0,650–8,400 s, Schluss ab 202,341 s bis zum letzten Frame. Welt und Verkehr bleiben aktiv. Keine Firmenlogos, ASTRA-Marke oder gesungenen Untertitel. Space Grotesk und JetBrains Mono ergänzen technische Texte.

Ein kompaktes technisches Panel steht links; die 3D-Demonstration wird nach rechts projiziert. Syslogs laufen mit maximal drei Meldungen unten. Alle Netzwerkwerte und Statusmeldungen sind Bestandteil des redaktionellen Szenarios.

## Vollständige Szenenübersicht

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

## Regie und konkrete Aktionen

Die 73 Einstellungen, Kameraarten, Start-/Endzeiten und ihre E-/L-/V-Zuordnungen stehen vollständig in `UMSETZUNG-CUES.md` und `UMSETZUNG-CUES.json`. Diese Schnittliste und `src/render/config.js` sind die ausgeführte Montage. E-IDs behalten ihre Messherkunft; L-IDs ihre Transkriptquelle; V-IDs sind redaktionelle Entscheidungen.

Beim ARP-Einsatz nimmt die Lücke bei 21,100 s Licht zurück. Request ab 21,700 s und Reply ab 26,800 s bekommen getrennte Wege; der Cache ist ab 30,211 s aufgelöst. Bei 31,700 s folgt die ausdrücklich gealterte FDB-Demonstration. MAC-Lernen, Link-Verfolgung, Tag und Broadcast-Ebene wechseln an den vier Zeilenanfängen der Strophe.

In der Bridge erzeugen BPDU, Trunk, Access und MAC move jeweils eine prägnante Nahaufnahme. Bei 70,500 s trennen sich die Tunnelstandorte. Die kurze Lücke bei 71,300 s und der Anstieg danach öffnen die Kapselung. Kontrollverbindung und Sitzung liegen vor dem Nutzdatentransport; Transport und Zielansicht wechseln die Kamera, ohne den inneren Frame auszutauschen.

Bei 84 s wird STP für die klar bezeichnete Loop-Demo abgeschaltet. Die Übersicht zeigt den geschlossenen Kreis, die Verfolgung dessen Kopien, die Matrix das MAC-Flapping. An E024 wird der Raum ruhiger. STP wird bei 106,900 s eingeschaltet; Listening und Learning gehen dem stabilen Baum ab 113 s voraus. Redundante physische Verbindungen bleiben sichtbar.

Die Reprise zeigt dieselben Mechanismen aus anderer Richtung. Im letzten Gesangsblock wandert HOST-A von P3 auf P7. Nach 171,760 s beginnt kein Schlussbild: LLDP entdeckt direkte Nachbarn; LACP handelt die Bündelung aus und verteilt unterschiedliche Flows auf feste Mitglieder. Die finale Montage greift bekannte Motive erneut auf.

## Instrumentale Passagen und Ende

Alle instrumentalen Zwischenräume erhalten die in der Tabelle beschriebene Handlung. Ab der letzten transkribierten Stimme bei 171,760 s bleiben 38,200166667 s aktive Musik. E044 bei 202,341 s eröffnet die Schlusstotale und den Titel. E045 bei 209,371 s ist ein letzter lokaler Akzent. Da die gespeicherten Messwerte bis zum Ende energiereich bleiben, gibt es keine lange Schlussblende. Das Bild bleibt bis zum letzten Rasterframe aktiv; der Player endet an der exakten Originaldauer.

## Fachliche Leitplanken

MAC-Lernen benutzt Quelladresse plus VLAN und Eingangsport; die Zieladresse steuert die Weiterleitung. ARP-Cache und Switch-FDB sind getrennt. Broadcast und unbekannter Unicast bleiben innerhalb des VLANs, ohne Eingangsreflexion oder blockierten Ausgang.

802.1Q zeigt ein 4-Byte-Tag zwischen Source MAC und EtherType; Access-Ausgänge der Szene sind ungetaggt. Native-VLAN-Sonderfälle entfallen. VLAN 3 folgt den Lyrics und ersetzt die frühere VLAN-30-Angabe.

SW-01 hat die niedrigste Bridge-ID; SW-03 P26 ist der redundante blockierte Port. Klassische STP-Zustände werden konsistent verwendet. Protokolltimer sind für die Inszenierung verdichtet. Keine vermeintliche Echtzeitsimulation, kein automatisches Root-Routing sämtlicher Frames.

L2TPv3 transportiert Ethernet über einen IP-Unterbau, hier ohne zusätzliche Verschlüsselung. Innere MAC-Adressen und VLAN bleiben erhalten; FCS ist lokal. LLDP bleibt beim direkten Nachbarn. LACP bündelt physische Mitglieder logisch; ein Flow bleibt bei stabiler Verteilung auf einem Mitglied. Fachquellen und Implementierungsgrenzen sind im README verlinkt.

## Assets und deterministisches Rendering

Benötigt: Original-WAV, bestehende Audioanalyse, Transkript zur Quellenprüfung und lokale Schriften mit OFL-Lizenzen. Die 3D-Geometrie ist prozedural: Switch-Knoten, Endgeräte, VLAN-Flächen, Frame-Felder, Matrix, BPDU-Marker und Tunnelringe. Keine externen Downloads für Modelle erforderlich.

Audio bleibt bei t=0 unverändert. Videozeit ist frame/FPS; Kamera und Netzwerkszenario werden aus absoluter Zeit berechnet. Band-Drives der Analyse steuern Licht und lokale Bewegung, mit fester 100-ms-Glättung. Onsets sind Impulse ohne Instrumentenbehauptung. Partikel verwenden begrenzte Instanzpools. Direkte Zeitsprünge müssen pixelgleiche Bilder liefern, damit Chunk-Rendering und Wiederaufnahme funktionieren.

## Abnahme

- Vollständige Handlung von 0 bis 209,960166667 s, 22 Kapitel und 73 Einstellungen.
- Übereinstimmende E-/L-/V-Referenzen in Code, Cue-Dateien und dieser Szenenübersicht.
- Gut lesbarer Anfangs- und Schlusstext, kompakte Panels, unverdeckt handelnde Objekte.
- Protokolle als sichtbare Abläufe; korrekte VLAN-, ARP-, STP-, Tunnel- und LACP-Semantik.
- Deterministische Zustände und Bilder nach beliebigen Sprüngen; funktionierender Player.
- Erst Browserabnahme. Kein vollständiger Musikvideoexport ohne ausdrückliche Freigabe.
