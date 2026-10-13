# 04 · Broadcast Storm — Die sich vervielfältigende Switch-Welt (überarbeitete Fassung für den Live-Code)

Grundlage ist die ASTRA-Vorlage vom 4. Oktober 2026 (unverändert unter `_revisions/ASTRA-DREHBUCH-original.md`).
Übernommen werden **die 58 Einstellungen mit allen Startzeiten** (im Test gegen die Vorlage geprüft), die Topologie,
B-001, die Zustandszeiten (Ring zu 15,58 s, shutdown ab 161,38 s, down spätestens 164,18 s) und die Bildschirmtexte
B01–B05. Vollständige Zeiten: `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Quellen

Finale WAV `04_Broadcast_Storm_1.0.wav`, SHA-256 `00a640de…c352`, 10 023 048 Samples = 208,8135 s, 60 fps =
12 529 Bilder. Transkript-SHA `22c07981…25d2`. Lyric-Zeiten automatisch, keine Hörprüfung; Prüfmarkierungen bleiben.

## Räume im Code

| Schauplatz | Zone | Umsetzung |
| --- | --- | --- |
| AUSSEN, PORT, FABRIC | `ring` | Das feste Switchdreieck in einem Rechenzentrumsraum: SW1, SW2, SW3 als Hangars mit lesbaren Portfronten, Glasröhren SW1/1↔SW2/1 und SW2/2↔SW3/1, das rote Fehlpatchkabel SW3/24↔SW1/24 (Cover), VLAN 120 als schmaler gelber Lichtboden, andere VLANs blau. Hosts H1, H2, R1 (192.0.2.1), H3, H5, H6 hinter den Switches. |
| BUFFER, MAC | `core` | In SW3: sechs Queue-Schächte mit Füllstand und Drop-Zähler, die MAC-Tafel (H1-MAC springt Gi1/0/1 ↔ Gi1/0/24) und die Managementkammer mit CPU-Monitor. |
| CONSOLE | `console` | Serielle Console vom NOC-Laptop zu SW3, unabhängig vom In-band-Netz; B03 als zwei Tabs nebeneinander. |

## Präzisierungen

1. **Vervielfachung fachlich korrekt:** Im Dreieck hat jeder Switch genau zwei Ringports. Ein Broadcast wird daher
   zu **zwei** Ringkopien (B-001/a im, B-001/b gegen den Ring), die ohne Hop-Limit endlos kreisen; bei jedem
   Durchlauf wird er an alle Access-Ports zugestellt (die „Zweige“), nie zurück durch den Eingangsport. Die Menge
   wächst, weil jeder weitere Broadcast (ARP-Wiederholungen von H1, andere Hosts) ebenfalls kreist – im Code 611
   Broadcasts → 1222 Ringkopien. Ab der Sättigung (≈ 60 s) verwerfen volle Queues Kopien.
2. **Zeitlupe:** Der Ring läuft anfangs in Zeitlupe (B-001 gabelt bei 25,0 s an SW1), ab ~44 s mit einer Runde in
   etwa 2,4 s – ein Darstellungstempo, die echte Rundenzeit liegt im Mikrosekundenbereich.
3. **Port-down:** Enter bei 162,8 s, `%LINK-5-CHANGED … administratively down` bei 163,0 s (≤ 164,18 s). Danach
   stirbt jede Kopie spätestens beim nächsten Erreichen des abgeschalteten Ringendes (letzte bei 165,2 s); die
   Queues leeren sich verzögert (bis ~180 s), CPU erholt sich zeitversetzt, MAC-Lernen stabil an Gi1/0/1.
4. **B02-Meldung** im IOS-Wortlaut: `Spanning tree instance(s) for vlan 120 does not exist.`
5. **Zugang** als eigener Block C01: SSH auf 10.20.0.3 läuft in den Timeout, dann `screen /dev/ttyUSB0 9600` auf
   die serielle Console; erst danach B03/B04.
6. **B03** steht als zwei Tabs nebeneinander (je ≤ 6 Zeilen) und bleibt neben B04 sichtbar, damit beide Seiten
   mindestens 4 s lesbar sind.
7. **Unicast-Tests:** 76,4 s im vollen Queue verworfen (S020); 194,6 s über die offene Kette, Antwort bei 197,33 s
   (= E037), danach erst „Client-Service-Test: erfolgreich“ in B05.
8. **Musik aus der Messung:** Bass-Einsätze 34,05 · 88,25 · 154,05 · 167,75 · 195,15 s. Der verlangte Beat-Stopp nach
   „Zieh das Kabel“ ist messbar (Pegelabfall ab ~131,4 s → kurzer Lichtabfall). Rund um das Port-down liegt eine
   basslose Strecke (160–167 s) – das „Stille kommt“ fällt dorthin. Der im Prompt gewünschte harte Schnitt bei
   „Ein Port down“ (177,16 s) ist nicht messbar; dort zeigt das Bild nur den bereits abgeschalteten Port.
9. **Suchlicht** statt Taschenlampenträger: ein montiertes Prüflicht fährt in S037, S038 und S045 über den Ring und
   endet in S045 auf SW3/24.
10. **Kinetische Wörter:** BROADCAST STORM, LOOP, FLOOD, ZIEH DAS KABEL, PORT DOWN – jeweils mit einer Zeile Erklärung;
    „Yes.“ (L029, unsicher) bleibt ohne Wort.
