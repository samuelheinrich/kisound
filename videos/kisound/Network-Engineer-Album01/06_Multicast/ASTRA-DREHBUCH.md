# 06 Multicast – Drehbuch (überarbeitete Fassung, V2 · Stadion)

Grundlage war der ASTRA-Vorschlag vom 28.09. (unverändert gesichert unter
`_revisions/ASTRA-DREHBUCH-original.md`). Diese Fassung ist die Vorlage für den umgesetzten Code;
die genaue Schnittliste mit Event- und Lyric-IDs steht in `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Revision V2 · Stadion

V1 (Amphitheater, 64 Plätze) liegt unter `_revisions/code-v1-arena.tar.gz`. V2 erweitert die Welt auf ein
komplettes Stadion mit 288 Clients in Innenraum, Unter- und Oberrang, 4 Core-Routern im Ring und 12
Last-Hop-Routern. Die POV-Fahrten aus V1 waren das stärkste Mittel, wiederholten aber denselben Weg. In V2
führen 22 Fahrten (Verfolgung, Ride auf dem Strom, seitlicher Flyby) zu 22 verschiedenen Sitzen auf allen
Stadionseiten und in allen drei Zonen, vor und nach dem SPT-Wechsel. Neue dramaturgische Achse: Bis
Verse 2 hört nur die vordere Stadionhälfte; dann steigt ein Join über den Core-Ring zum RP, und der Baum
wächst in die hintere Hälfte. Beim Drop 135,7 s wird der Ring gekappt und drei Speichen gehen direkt zu R1.

## Leitidee

Ein Stadion als Netz: Im Mittelkreis steht eine einzige Quelle, um sie herum wachsen Router,
Access-Switches und 288 Plätze. Ein Strom fliesst nur dorthin, wo jemand gefragt hat. Ein einziger
Datenstrom wird an echten Verzweigungen kopiert; ungefragte Äste bleiben dunkel. Drei Segmente
(SW18, SW23, SW28) bleiben bis zum Ende still.

**Verlauf:** eine Quelle vor leeren Reihen → Register ohne Antwort → der erste Zuhörer → Vergleich der
Zustellarten → IGMP im Segment → Chorus-Welle → PIM und RP im Core → Hook → Umschalten auf den kürzesten
Pfad → „No flood for the silent“ → lebendige, selektive Gemeinschaft → Querier fragt bis zum Schluss.

## Was gegenüber dem Vorschlag geändert wurde

- **Durchgehendes Netzmodell statt wiederholter Einzelbilder.** Der Vorschlag wiederholte „Gruppenring
  leuchtet auf“ und „Empfänger melden Interesse an“ in mehreren Szenen. Jetzt erzeugt ein Join/Leave-Fahrplan
  IGMP-Reports, PIM-Joins hop-by-hop und daraus den Verteilbaum. Jedes Bild folgt aus demselben Zustand,
  Totale und Nahaufnahme widersprechen sich nie.
- **Unicast/Anycast/Multicast auf die gesungenen Zeilen gelegt** (38,28–58,74 s). Im Vorschlag lag der
  Vergleich bei 58–67 s, also nach den entsprechenden Textzeilen.
- **Vor dem ersten Empfänger fliesst nichts über R1 hinaus.** Register an den RP, Register-Stop und rote
  Sperren an R1 zeigen „Not every packet needs to cross every gate“ technisch korrekt.
- **Der erste Strom verlässt R1 exakt auf dem ersten Drop (31,30 s)** und erreicht den ersten Sitz kurz
  nach E010 (33,41 s). Die Hops sind dafür bewusst gedehnt.
- **SPT-Switchover auf dem Drop 135,7 s** als eigener Moment. Er ersetzt die allgemeine „Grenzübertritt“-Idee.
- **Bridge als Vergleich Flooding gegen IGMP Snooping** im Segment, dann eine Fahrt von Access bis Core
  und die grosse Öffnung auf dem Drop 164,35 s („many doors“).
- **Schlussblende ab dem gemessenen Endabfall 258,4 s**, nicht ab dem Fade-Kandidaten E050 (254,7 s):
  Bis 258,4 s läuft noch Musik mit voller Energie.
- **60 fps** wie die übrigen Album-01-Videos (der Vorschlag nannte 30 fps).

## Bildsprache

- **Farben:** Schwarzblau; Datenstrom orange/warmweiss wie auf dem Cover; Mitglieder smaragdgrün;
  IGMP-Query violett; PIM-Steuerung cyan; Leave/Prune und Flooding rot. Der RP trägt violette Orbitringe.
- **Motive:** Bühne mit konzentrischen Ringen (Cover), Polarboden mit Punktraster und Spielfeldlinien,
  Stehpublikum im Innenraum, zwei Ränge, Flutlichtmasten, Dachring als Gruppenring, Join-Ripples,
  Router auf Sockeln, Switch-Ports als Snooping-Anzeige.
- **Kamera:** Von der einsamen Bühne über Rangfahrten und POV-Fahrten (Verfolgung, Ride, Flyby) bis zur
  Vogelperspektive über dem ganzen Oval.
  In Drops und im Chorus wird sie weiter, in Strophen und Fachmomenten bleibt sie nah.
- **Typografie:** Titel MULTICAST / SAMUEL HEINRICH in Michroma mit orangen Linien (Cover).
  Fachpanels links (26,6 % Breite), drei Syslog-Zeilen unten, Hook-Wörter als grosse Schläge.

## Szenen

| Kapitel | Zeit | Bildhandlung | Text / Audio |
| --- | --- | --- | --- |
| Eine Quelle | 0–11,38 | Bühne öffnet sich nach der Pegellücke E002; Titel; leere Ränge. | Intro instrumental |
| Register / leere Reihen | 11,38–24,04 | Quelle sendet; R1 registriert beim RP, Register-Stop; Pakete enden an R1, rote Sperren. | „One source speaks … to cross every gate“ |
| Erster Empfänger | 24,04–38,28 | Breakdown: Host 10.1.3.13 sendet Report; (*,G)-Join steigt zum RP, (S,G)-Join zur Quelle; Ride mit dem ersten Strom ab dem Drop 31,3; Sitz leuchtet. | Instrumental, Drop 31,35 |
| Zustellarten | 38,28–58,74 | Unicast: drei Kopien auf dem Quelllink. Anycast: gleiche Adresse, nächste Instanz. Multicast: eine Kopie, Replikation am Router, dritter Empfänger tritt bei. | Verse |
| Tune into the stream | 58,74–67,58 | Vogelperspektive, Paketverfolgung; der Baum wächst zu neuen Sitzen. | „Tune into the stream …“ |
| IGMP | 67,58–81,48 | Segment SW3/VLAN 103 (Unterrang, R7): Membership Report, Snooping-Tabelle, General Query an 224.0.0.1, gestaffelte Antworten. | Pre-Chorus |
| Join the group | 81,48–96,38 | Chorus-Welle neuer Mitglieder; RP repliziert; „1 copy“ gegen viele Zuhörer. | Chorus, Drop 81,85 |
| Replikation | 96,38–109,76 | Paketverfolgung durch alle Verzweigungen; ruhige Totale im Sub-Breakdown. | Instrumental |
| PIM-SM / RP | 109,76–128,58 | PIM-Hellos; RP kennt die Quelle; Join aus dem Oberrang hinten steigt R13 → R4 → R3 → RP über den Core-Ring; die hintere Stadionhälfte wächst an; Ride in den neuen Ast; ein stilles Segment bleibt dunkel. | Verse 2 |
| Hook | 128,58–135,70 | Neun Wörter, neun Orte: Report, Join, Leave (Port fällt nach Group-Specific Query), Query, Group, Source, RP, PIM, IGMP. | Hook |
| SPT-Switchover | 135,70–149,00 | R3, R4, R5 joinen (S,G) zu R1, der Ring wird mit (S,G,rpt)-Prunes gekappt; POV-Fahrten über die neuen Speichen. | Drop 135,75 |
| No flood for the silent | 149,00–166,72 | Flooding ohne Snooping (rot) gegen Snooping; ein Host fragt und bekommt den Strom; Fahrt Sitz → Switch → Router → Core; grosse Öffnung auf dem Drop. | Bridge, Drop 164,35 |
| Final Chorus | 166,72–182,25 | Vogelperspektive, Replikation am Core, Zählwerk. | Final Chorus |
| Replikation II | 182,25–197,18 | Paketverfolgung; General Query auf allen VLANs (E041). | Instrumental |
| Querier / RP | 197,18–210,75 | Querier ruft, Mitglieder antworten, RP-Tabelle, Weg zurück zur Quelle. | Outro |
| Totale | 210,75–249,20 | Weite Totale im Wechsel mit sieben POV-Fahrten; Joins und Leaves überall im Stadion. | Instrumental, Drops 210,75 / 230,45 |
| Finale | 249,20–260,60 | Schlusstitel ab 250,2 s; Queries und Antworten laufen weiter; Blende ab 258,4 s. | Endabfall E051 |

## Fachliche Leitplanken

- IGMP signalisiert lokale Gruppenmitgliedschaft zwischen Host und Router; PIM organisiert das Routing
  zwischen Routern. Snooping-Switches leiten die Gruppe nur an Ports mit Mitgliedern weiter.
- Das Szenario ist PIM-SM mit statischem RP (R2). Der RP erscheint nur in dieser Rolle.
- IGMPv2-Werte: Report Typ 0x16 an die Gruppenadresse, General Query 0x11 an 224.0.0.1, Leave an 224.0.0.2,
  danach Group-Specific Query. Max Response 10 s.
- Alle Hop- und Timerzeiten sind für den Film verdichtet bzw. gedehnt. Der SPT-Wechsel ist inszeniert
  verzögert; viele Implementierungen wechseln direkt nach dem ersten Paket.
- Adressen sind Szenariowerte (10.0.0.1, 239.1.1.1, 192.0.2.53 aus dem Dokumentationsnetz).
- Messwerte werden nicht als Netzwerktelemetrie ausgegeben. Zähler im Bild zählen Szenario-Sitze.
- Lyrics erscheinen nur im Hook als Zitat aus `lyrics.segments`; keine Firmenlogos, kein ASTRA-Branding.

## Synchronisation und Rendering

Original `06_Multicast_0.1-1.wav`, SHA-256 `7d0f87a9…0794e`, 12 508 808 Samples / 48 kHz = 260,600166667 s.
`t = frame / 60`; jede Animation ist eine Funktion der absoluten Zeit. Transkriptzeiten werden nicht verschoben.
Der Beat-Raster (132,6 BPM, mittlere Sicherheit) dient nicht zur Umzeitung. Drops stammen aus den
100-ms-Zeilen der Analyse (Sub-Band springt von ~0 auf >0,5).
