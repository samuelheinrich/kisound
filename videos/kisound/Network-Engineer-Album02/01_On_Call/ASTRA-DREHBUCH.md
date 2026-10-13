# 01 · On Call — Die Nacht hinter dem Display (überarbeitete Fassung für den Live-Code)

Grundlage ist die vollständige ASTRA-Vorlage vom 4. Oktober 2026 (unverändert unter
`_revisions/ASTRA-DREHBUCH-original.md`, Original im Musik-Repo `01_On_Call/ASTRA-DREHBUCH.md`).
Die Vorlage war diesmal stark: konkrete Topologie, ein einziger fachlich sauberer Fehler, jede Textzeile
mit eigener Handlung. **Schnittliste (60 Einstellungen, alle Startzeiten), Schauplätze, Objekt-IDs,
Bildschirmtexte und der Eingriff bei 146,82 s werden unverändert übernommen** (im Test gegen die Vorlage
geprüft). Diese Fassung hält nur fest, was für die Umsetzung präzisiert oder korrigiert wurde.
Vollständige Zeiten aller Pakete, Texte und Logs: `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Quellen

Finale Release-WAV `01_On_Call_1.0.wav` (bitgleich mit dem Kandidaten `0.2`), SHA-256
`6d10bbfd…bcd1`, 10 405 128 Samples = 216,7735 s, 60 fps = 13 007 Bilder. Transkript-SHA `72957da7…187c`.
Lyric-Zeiten automatisch, keine Hörprüfung; die Prüfmarkierungen L014, L018, L020–L022, L024, L051, L052
bleiben bestehen, ihre Bildhandlung hängt nicht am unsicheren Wortlaut.

## Räume im Code

| Schauplatz der Vorlage | Zone | Umsetzung |
| --- | --- | --- |
| STADT | `city` | Seestadt nach dem Cover: Altstadt mit drei Kirchtürmen, See mit Mondglanz, verschneite Berge, Glasglocke als Fresnel-Kuppel, Stromtrasse zum dauernd leuchtenden Rechenzentrum, ein einziges helles Fenster. Fassaden weitgehend dunkel. |
| TISCH | `desk` | Holztisch am Fenster, Monitor zeigt das echte Display, Laptop das Router-Syslog, Telefon (Alarm, Anruf, Schlussmeldung, Sperre), kalter Kaffee, Regal mit warmer Leiste. Die Person bleibt Silhouette (von hinten/seitlich, nie frontal). |
| TICKET | `screen` | Orthogonale 70-mm-Fahrt über die Displayfläche (Ticket links, Terminal rechts oben, Monitoring/Diff rechts unten, Beweiskarte/Ursache links unten). |
| PORT, ROUTE, ACL, DIENST | `router` | Vergrössertes R-EDGE-Inneres **in Zeitlupe** (im Bild markiert): Portschleusen, Eingangsprüfung, verschiebbare Präfixplatten, ACL-Kammer mit Regelblättern 10/20 und Live-Counter, amberfarbene Bindungsklammer, Regelarchiv, drei Diensthallen und die Vergleichshalle CTRL-D. Dazu der echte Rackgang bis zur Chassis-Front. |

Farbregel der Vorlage gilt im ganzen Stück: Cyan beobachtet, Amber ist der Change, Rot verwirft,
gedämpftes Grün nur für bestätigte Tests.

## Präzisierungen und Korrekturen

1. **F-A1 ist ein einzelner kontrollierter SYN** (`hping3 -S -p 443 -s 51000 -c 1 198.51.100.20`).
   Die Vorlage verlangt „Counter 40→41 gehört zum kontrollierten Diagnose-SYN“; mit curl entstünden durch
   SYN-Wiederholungen mehrere Treffer. TEST-A (curl) läuft unverändert vorher (62,68 s, Timeout) und
   nachher (148,78 s, „Dann derselbe Test“) mit identischem Befehl.
2. **Woher die 40 kommt:** Vor dem Diagnose-SYN zieht die Person einen Vorher-Snapshot aller ACL-Zähler
   (P0, 81,42–84,78 s, `show ip access-lists | include list|matches`). Die ACL ist dort nur ein Eintrag
   unter mehreren; erst der Nachher-Vergleich zeigt „ein Counter steigt am falschen Port“.
3. **curl `--connect-timeout 2`** statt 3: Der erste TEST-A erzeugt so genau zwei SYNs (Erstversuch und eine
   Wiederholung nach 1 s); beide sterben an Regel 10 (Zähler 38→40, vor dem Snapshot). Derselbe Befehl
   wird nach dem Eingriff wiederholt.
4. **Reveal der Antwort bei Ankunft, nicht bei Abfahrt:** Die Vorlage nennt 165,58 s für die HTTP-Zeile,
   lässt die Antwort APP-A aber erst dann verlassen. Im Stück erscheint `HTTP 200` bei Ankunft am Client
   **169,70 s** – exakt auf dem Wiedereinsatz des Sub-Basses (vor L045 „On Call.“). APP-B, APP-C und CTRL-D
   werden in S053 einzeln grün (179,0 / 180,6 / 182,2 s, jeweils bei Rückkehr ihrer Antwort).
5. **B04 „Befund“** erscheint erst bei 135,68 s („Da ist der Unterschied“), nach dem Counter-Beleg.
6. **B05 als echte IOS-Vorschau:** `configure terminal` und `interface …` sind ausgeführt;
   `no ip access-group QUARANTINE out` ist eingetippt, **Enter steht aus** (VORSCHAU) bis 146,82 s;
   `end` folgt bei 147,3 s. Die ACL selbst bleibt gespeichert (Regelarchiv).
7. **Gateway-Vergleichstest** (S030): `ping 198.51.100.1` geht an die Router-eigene Adresse auf Gi0/0/1
   und wird von der CPU beantwortet – eine ausgehende ACL filtert solchen Verkehr nicht. So ist sichtbar,
   warum ein erfolgreicher Gateway-Test kein Anwendungstest ist.
8. **TCP-Sitzung F-A2 vollständig:** SYN (F-A2, Port 51001) passiert die frühere Sperrstelle in S045
   (154,19 s), SYN/ACK 157,8 s, TLS 1.3 bis 161,4 s, `GET /health` erreicht APP-A 164,3 s (S048), Antwort
   verlässt APP-A 165,6 s (S049) und kommt 169,70 s an. Replays von F-A1 (S031, S039) sind als
   „aufgezeichnet · kein neuer Transport“ markiert und zählen nicht.
9. **Zeitebenen:** Ticket und Terminal laufen in (verdichteter) Echtzeit, die Uhr zeigt 02:17 beim Alarm
   und 02:52 beim Schliessen; das Router-Innere ist eine Zeitlupen-Spur.
10. **Musikalische Wendepunkte aus der Messung:** Bass-Einsätze 30,5 · 90,8 · 120,9 · 169,7 · 199,6 s
    (Bloom-/Lichtimpulse, HTTP 200), Pegellücke 29,95–30,4 s (kurze Abdunkelung) und 197,75–199,5 s
    (fast schwarz, nachdem das Fenster dunkel wurde), Blende ab 210,8 s bis zum stillen Dateiende.
11. **Kinetische Wörter** nur für die vier „On Call.“-Hooks (L017, L021, L041, L045), je mit einer Zeile
    Erklärung, im Titelstil des Covers (ON silbern, CALL blau). Titel: Intro 1,7–7,8 s, Outro 199,7–204,9 s.
12. Zusätzlicher Bildschirmblock **P1** (Diagnose-SYN, 84,78–120,12 s) und **P0** (Snapshot) neben B01–B07.
    Alle Blöcke ≤ 6 nichtleere Zeilen je Seite, B03 in drei Seiten (120,12 / 124,14 / 129,94 s).

## Fachszenario (unverändert, redaktionell)

R-EDGE (IOS XE): Client 192.0.2.10 über Gi0/0/0 (192.0.2.1), Servernetz 198.51.100.0/24 an Gi0/0/1
(APP-A .20, APP-B .21, APP-C .22, HTTPS), CTRL-D 203.0.113.40 an Gi0/0/2. Kein NAT, Routen und Links korrekt.
CHG-2042 band die für eine fremde Zone gedachte ACL QUARANTINE ausgehend an Gi0/0/1; Regel 10
`deny ip any 198.51.100.0 0.0.0.255 log`. Belege: Route (connected via Gi0/0/1), Binding, Counter 40→41 und
Log `192.0.2.10(51000) -> 198.51.100.20(443)`. Eingriff genau dieser Bindung über das unabhängige
Management (vty0 von 10.99.0.15), danach derselbe Test und drei weitere Dienstprüfungen.
