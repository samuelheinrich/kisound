# ASTRA · Network Engineer Album02 — Drehbuchübersicht

Stand: 2026-10-04. Acht eigenständige Science-Fiction-Kurzfilme als vollständige kreative und technische Vorlage. Die Drehbücher liegen in den aktuellen **Musik-Trackordnern 01_On_Call bis 08_Out_of_Band**. Analysen werden aus den entsprechenden aktuellen Trackordnern im benachbarten Video-Arbeitsbereich referenziert; die historische Umsetzung `02-trustsec` ist keine Vorlage dieser Neufassung.

## Die acht Filme

| Track | Drehbuch | Welt | Exaktes Audioende s | Einstellungen | Lyric-Cues | Events |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 01 | [On Call](01_On_Call/ASTRA-DREHBUCH.md) | Die Nacht hinter dem Display | 216.7735 | 60 | 52 | 41 |
| 02 | [Active Standby](02_Active_Standby/ASTRA-DREHBUCH.md) | Die Doppelanlage | 203.1735 | 56 | 44 | 44 |
| 03 | [TrustSec](03_TrustSec/ASTRA-DREHBUCH.md) | Die Identitätsfabrik | 288.0000 | 96 | 89 | 50 |
| 04 | [Broadcast Storm](04_Broadcast_Storm/ASTRA-DREHBUCH.md) | Die sich vervielfältigende Switch-Welt | 208.8135 | 58 | 45 | 40 |
| 05 | [Wireshark](05_Wireshark/ASTRA-DREHBUCH.md) | Vom Port in den Mitschnitt | 195.7335 | 61 | 52 | 40 |
| 06 | [ICMP](06_ICMP/ASTRA-DREHBUCH.md) | Die Rückmeldungen des Netzes | 216.7735 | 81 | 75 | 49 |
| 07 | [QoS](07_QoS/ASTRA-DREHBUCH.md) | Das Innere des Engpasses | 239.0535 | 57 | 44 | 42 |
| 08 | [Out of Band](08_Out_of_Band/ASTRA-DREHBUCH.md) | Der getrennte Zugang | 264.4135 | 64 | 52 | 44 |

**Gesamt: 533 Einstellungen, 453 Lyric-Cues und 350 Analyse-Events.** Alle Schnittlisten beginnen bei 0 s und enden samplegenau mit der jeweiligen unveränderten Aufnahme. Schnittsekunden haben vier Dezimalstellen; die vorhandenen Transkriptfenster sind unverändert. Ein auf Millisekunden gerundetes End-Event verlängert keinen Film.

## Albumdramaturgie und räumliche Unterscheidung

On Call verbindet die schlafende Stadt und eine menschliche Bereitschaftsperson mit dem Inneren eines Routers. Es beginnt mit einer ungenauen Meldung und endet mit einem gezielt zurückgenommenen ACL-Binding und geprüften Diensten. Die anderen sieben Filme haben keine menschliche Hauptfigur: Geräte, Daten, Zustandsplatten, Cursor und Arbeitsoberflächen handeln.

Active / Standby erzählt mit zwei festen Maschinenidentitäten, einer gemeinsamen Adresse und einem getrennt sichtbaren Heartbeat-/Sync-System. TrustSec trennt Authentifizierung, Klassifizierung und Enforcement in einer Fabrik mit Quell-/Zielmatrix. Broadcast Storm folgt einem ARP-Frame und seiner Kopie-Abstammung durch ein festes Switchdreieck. Wireshark verbindet physische Spiegelung, Paketliste, Protokollschichten und zwei Aufnahmeorte. ICMP führt in einer zusammenhängenden Routerlandschaft durch fünf verschiedene Rückmeldevorgänge. QoS zeigt den tatsächlichen Ablauf aus Klassifizierung, Markierung, Budgetprüfung, Queue, Scheduler und gemeinsamem Ausgang. Out of Band öffnet den dunklen Produktionsraum über einen bereits gebauten unabhängigen Management- und seriellen Console-Weg.

Die Kamera erhält pro Film feste räumliche Achsen und pro Funktionsraum einen definierten Blick. Jeder Gesangscue hat eine individuell geschriebene Handlung; Instrumentalstrecken verfolgen Verarbeitung, bereiten den Befund vor oder prüfen den Endzustand. Wiederholte Refrains zeigen jeweils die veränderte Situation. Die generischen image_action-Vorschläge der Analyse wurden nicht als Bildhandlungen übernommen.

## Verbindliche Wendepunkte

| Film | Ursache und Beleg | Eingriff / Zustandswechsel | Nachweis der Auflösung |
| --- | --- | --- | --- |
| On Call | QUARANTINE fälschlich ausgehend an R-EDGE Gi0/0/1; Route, Binding, Log und Counter stimmen überein | 146.82 s: genau das falsche ACL-Binding entfernen | Ab 148.78 s derselbe curl-Test vom selben Client zum selben Dienst; neue Frames, TLS/HTTP und drei weitere Dienstprüfungen |
| Active / Standby | 89.10 s: ha1 aus; A verarbeitet weiter; 92.62 s: B nach beobachtetem Timer ebenfalls Primary | 111.38–113.26 s A extern isolieren; 117.90 s HA-Link reparieren; Präferenz B und Rollenprüfung; 125.58 s Sync bestätigt | 132.04 s A-Produktionslinks wieder frei; A Secondary/Standby, B Primary/Active; neuer Service-Test |
| TrustSec | ISE prüft C-17; ACCESS-1 weist SGT 10 zu; EGRESS-1 prüft 10→20 HTTPS_ONLY | Ab 146.52 s U-09 unbekannt, Restricted/Unknown SGT 0; bestehende DENY-Zelle 0→20 | C-17 HTTPS erlaubt, C-17 SSH gesperrt, U-09 Serverzugriff gesperrt; kein Policy-Wechsel im Finale |
| Broadcast Storm | 15.58 s Fehlpatch schliesst VLAN-120-Ring; STP dort deaktiviert; Kopien, MAC-Flaps, Drops und Managementverlust | «Zieh das Kabel» bei 130.06 s ist Auftrag; 161.38–164.18 s SW3 Gi1/0/24 einmal shutdown | Restliche Kopien laufen ab, offene Kette stabil, Management/Service geprüft; STP-Korrektur ist dokumentierte Folgearbeit |
| Wireshark | Bytebereich BEFORE vorhanden/AFTER fehlt; Capture-Drops 0; SW-A Output-Drops +18 unter Uplinklast | 139.80 s kontrollierte Bulk-Quelle 95→20 Mbit/s; physischer Uplink bleibt 100 Mbit/s | Neuer HTTPS-Test ab 142.72 s, beidseitige Segmente, Drop-Delta 0 und Antwort; TLS ohne Secrets bleibt verschlüsselt |
| ICMP | Echo 8/0→0/0; DF-Drop 3/4; TTL 11/0; unbesetzter UDP-Port 3/3; lokaler Host Redirect 5/1 | Sender erzeugt kleineres neues Datagramm; Traceroute erzeugt getrennte Probes; Redirect erst nach Quellen-/Zitat-/Next-Hop-Prüfung annehmen | Erfolgreicher kleiner Transfer, identifizierte Hops/Zielport und validierter direkter lokaler Next Hop; keine Wiederbelebung verworfener Originale |
| QoS | Vor 13.30 s beide Verkehrsarten sichtbar; aktive MQC trennt EF/46 und BE/0 unter festem 100-Mbit/s-Vertrag | Policer verwirft RTP-Überschuss; Parent-Shaper puffert angenommene Pakete und ermöglicht später Scheduler-Ausgabe | RTP-Empfang und laufende TCP-ACKs gleichzeitig; Gesamt-Langzeitrate unverändert, Bulk nutzt verbleibende Gelegenheiten |
| Out of Band | Historischer Change shutdown an Produktions-Uplink; unabhängiges Management und serielle Console bestehen bereits | 147.88 s gezielt no shutdown; danach Link, installierte statische Route, neuer End-to-End-Test | Service ab 163.48 s bestätigt, im Finale erneut geprüft; Konfiguration gespeichert, Change dokumentiert, Console erreichbar |

## Quellen, Text und Bildschirmdarstellung

Verbindlich sind sieben aktuelle WAV-Kandidaten und TrustSecs MP3, deren decodierte Samples die Zeitachse bestimmen. Noch keine finale Release-Auswahl. Jedes Drehbuch enthält Audio-, Transkript- und Analyse-SHA-256, Samplezahl, Samplerate und exakte Dauer. Die Referenzen auf die Analysen zeigen in den Video-Arbeitsbereich; für eine spätere Übergabe ausserhalb dieser Ordner muss dieser Quellenbaum mitgegeben oder die Links angepasst werden.

L-IDs stammen aus `lyrics.segments`, E-IDs aus `events`. Jede L-ID hat genau eine Haupteinstellung samt originalem Start/Ende; jede E-ID gehört genau einer Einstellung und ist zusätzlich im Eventregister mit Quellenzeit, Typ und Unsicherheit erklärt. Gemessene Onsets steuern die konkret getimten Hook-Akzente. Das geschätzte Beat-Raster dient Bewegungen, nicht dem Verschieben von Gesang. Fehlende Prompt-Zeilen erhalten keine erfundenen Zeiten. Promptwünsche nach Flatline, Beatstopp oder Arrangement-Drop sind kein akustischer Nachweis.

Jeder Film enthält konkrete CLI-/UI-/Header-/Log-Texte mit B-IDs und Zeitfenstern. Reveal-Regeln halten Resultate hinter dem jeweiligen Test oder Eingriff. Kurze Wörter erscheinen gross zu ihren vorhandenen Gesangscues; technische Befunde bleiben auf Geräte-/Displayflächen länger lesbar. Lange Auszüge werden in höchstens sechszeilige Seiten/Tabs aufgeteilt, mindestens vier Sekunden gehalten. Parallelflächen sind im HA-Fencing ausdrücklich nötig, damit beide Switch-Terminals ausreichend lesbar bleiben.

Plattformen sind pro Gerät fest: Cisco IOS XE für Switching, Routing und MQC, ISE/TrustSec für Identität und SGACL, FortiOS 7.6.1 für die HA-Geräte, Linux/Wireshark für Endpunkte, Capture und Console-Server. Zwei Plattformen dürfen im selben Film vorkommen, ihre Syntax steht an getrennt bezeichneten Geräten. Herstellerbegriffe sind sachliche Beschriftungen; kein Logo ist vorgesehen. Adressen stammen aus Dokumentations- und privaten Netzen. Ausgaben sind gekürzte, simulierte Szenarioausschnitte, keine behaupteten realen Geräte-Dumps.

## Offene Sprachprüfungen

Die vorhandene [Transkriptprüfung](TRANSKRIPT-PRUEFUNG.md) bleibt verbindlich. Die neue Vorlage beseitigt keine ASR-Unsicherheit und behauptet keine manuelle Hörprüfung.

| Track | Im Drehbuch ausdrücklich markiert |
| --- | --- |
| 01 | L014, L018, L020, L021, L022, L024, L051, L052 |
| 02 | L015, L022, L023, L027, L033, L035, L038, L041, L042, L043, L044 |
| 03 | L021, L039, L080, L081, L082, L083 |
| 04 | L017, L020, L025, L026, L027, L029, L030, L032, L041, L042, L044 |
| 05 | L003, L004, L006, L008, L014, L015, L017, L021, L025, L033, L041, L045, L049, L050, L051 |
| 06 | L004, L011, L026, L037, L039, L046, L074 |
| 07 | L024, L027, L031, L042, L043 |
| 08 | L001, L002, L003, L004, L017, L020, L021, L048, L049 |

TrustSecs L021/L039 («Attack/Detect the flow») führen nur den bestehenden Flow fort. Die widersprüchlichen Unknown-Schlusszeilen L080–L083 erzeugen keine Freigabe: «Access defined» ist die festgelegte DENY-Policy. Die übrigen markierten Stellen erhalten belastbare, vom unklaren Wortlaut unabhängige Bildhandlungen.

## Prüfung und Übergabe

Die geschriebenen Markdown-Tabellen wurden unabhängig vom Erzeugungsschritt erneut gelesen und gegen Transkripte/Analysen geprüft: lückenlose positive Shotintervalle, samplegenaues Ende, eindeutige Lyric-/Event-Zuordnung, unveränderte Lyricfenster und Wortlaute, erhaltene Prüfmarkierungen, passende Onsets, definierte B-Verweise und funktionierende lokale Quellenlinks. Die aktuellen Audio-/Transkript-Hashes und Dauern wurden geprüft. Die technischen Quellen sind in jedem Szenario direkt verlinkt.

Redaktionell geprüft sind besonders Original versus Mirror-Kopie, neuer TCP-Retransmission-Frame versus gleicher Bytebereich, HA-Gerät versus wechselnde Rolle, SGT-Zuweisung versus SGACL-Enforcement, ICMP-Original versus Zitat/Rückmeldung, Policer-Drop versus Shaper-Wartepaket sowie einmaliger Eingriff versus wiederholte Refrainansicht.

Abgegeben werden diese Übersicht und die acht Drehbücher. Die nächste Umsetzung übernimmt die Topologien, Objekt-IDs, Zustandszeiten, Bildschirmtexte und Kamerablicke und prüft Lesbarkeit und räumliche Kontinuität im Animatic. Szenencode, Assets und Videos sind ein anschliessender Arbeitsschritt.
