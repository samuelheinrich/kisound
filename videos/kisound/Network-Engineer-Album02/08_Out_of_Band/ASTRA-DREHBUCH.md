# 08 · Out of Band — Der getrennte Zugang (Drehbuch, Fassung «Rechenzentrum»)

Überarbeitet am 5. Oktober 2026 nach Abnahme der ersten Fassung: Die Welt war zu dunkel und zu surreal. Sie wird jetzt
einem realen Rechenzentrum nachgebaut. Die ASTRA-Vorlage bleibt unverändert unter
`_revisions/ASTRA-DREHBUCH-original.md`; übernommen werden **die 64 Startzeiten** (an die Musik gebunden und im Test
gegen die Vorlage geprüft), alle Lyrics- und Event-Zuordnungen, das Fachszenario und die Bildschirmtexte B01–B07.
Neu sind Orte, Kamera und Handlung jeder Einstellung; Stadt, Gebäude und vier Rechenzentren rahmen den Film. Vollständige Zeiten: `UMSETZUNG-CUES.md`.

## Quellen

Finale WAV `08_Out_of_Band_1.0.wav`, SHA-256 `9139796a…427c`, 12 691 848 Samples = 264,4135 s, 60 fps = 15 865 Bilder.
Transkript-SHA `31d96fed…`. Lyric-Zeiten automatisch; neun Prüfmarkierungen (L001–L004, L017, L020, L021, L048, L049)
bleiben, die Bildhandlung hängt nicht am unsicheren Wortlaut.

## Welt: eine echte Datenhalle

Vorbild sind gewöhnliche Serverräume mit Doppelboden und Kabeltrassen über den Racks (Referenz: Shield & Strut,
«Cable Tray for Server Rooms»: Daten über Kopf in Gitterrinnen, Strom getrennt in Leiterrinnen, Trassen entlang der
Rackreihen, Abhängungen alle 1,5–3 m).

- **Halle** 14,4 × 13,4 m, Raumhöhe 3,6 m. Hellgrauer Doppelboden aus 60-cm-Platten, in den Kaltgängen gelochte
  Platten. Helle Decke mit durchgehenden LED-Lichtbändern über jedem Gang, hellgraue Wände mit einem blauen Band.
- **Vier Rackreihen** à 14 Racks (60 cm breit, 120 cm tief, 2 m hoch, 42 HE) in Warm-/Kaltgang-Anordnung:
  Reihe A und B um Kaltgang 1, Warmgang zwischen B und C, Reihe C und D um Kaltgang 2. Gänge 1,2 m, Randgänge 1,2 m.
  Racks bestückt mit Servern, Switches, Patchpanels und Blindplatten; vorne blaue und grüne Status-LEDs, hinten
  Netzteile, Lüfter, Stromkabel und Patchkabel.
- **Über Kopf:** silberne Gitterrinnen für Kupfer über jeder Reihe, darüber graue Leiterrinnen für Strom, an
  Gewindestangen abgehängt. Die **gelbe Glasfasertrasse** führt von Gi0/0/1 an R-EDGE über die Reihen zum Nachbar-Router
  (Rack A14) und zum Dienst 198.51.100.20 (Rack A13).
- **R-EDGE** ist Rack C06: Datenports (Gi0/0/0, Gi0/0/1) vorne im Kaltgang 2; hinten im Warmgang der OOB-Switch, der
  Console-Server 10.99.0.20 und das hellblaue Console-Kabel von Port 7 zum CON-Port von R-EDGE.
- **Der Engineer** – eine schematische, gesichtslose Figur in hellem Grau mit blauem Shirt – sitzt im Warmgang am Boden
  hinter Rack C06, den Laptop (Managementstation 10.99.0.10) auf den Knien: Scharnier auf der fernen Seite, Bildschirm
  zu ihm, die Hände liegen auf der Tastatur. Ein cyanfarbenes Patchkabel führt vom Laptop
  in den OOB-Switch. Daneben liegt das Telefon. Er tippt, sonst bewegt er sich kaum.
- **NOC-Display** an der Stirnwand: Dashboard des Dienstes und die Nachweise Link → Route → Service.
- **Aussen** (nur Outro): das Rechenzentrum als Gebäude in der schlafenden Stadt.

## Die grosse Szenerie: Stadt, Gebäude, vier Rechenzentren

Ergänzt nach der zweiten Durchsicht («zu wenig Material, es wiederholt sich»). Das Rechenzentrum liegt im Erdgeschoss
eines grossen Bürogebäudes in der schlafenden Stadt. Darüber sechs **schematische Etagen** (transparente Decken mit
leuchtenden Kanten, Arbeitsplätze als Umrisse, ein Kern), aussen eine Glasfassade mit Pfosten und Riegeln, auf dem
Dach Kälteanlagen. Auf der Rechenzentrumsebene stehen **vier grosse Hallen** im Raster; Rechenzentrum 2 ist die Halle
mit Rack C06 und dem Engineer, die drei anderen sind gleich gebaut und arbeiten normal.

- **Zoom hinein (S001, 0–8,48 s):** eine durchgehende Fahrt von der Stadt zum Gebäude, durchs Dach abwärts durch die
  Etagen, über die vier Hallen und senkrecht hinunter in Kaltgang 2 vor R-EDGE. Darüber liegt der Titel.
- **Zoom heraus (S061–S062, 240,34–250,51 s):** dieselbe Reise rückwärts, vom Engineer über die Hallen, durch Etagen und
  Dach bis zur Stadt, mit dem Abspanntitel. Danach folgen wie bisher die Aufsicht (S063) und die Schlussfahrt (S064).
- **Überflüge** über die offene Halle (ohne Decke): S006 über Rechenzentrum 2, S023 entlang der dunklen Trasse, S042
  zurück über die Trasse mit Verkehr, S046 aufsteigend über alle vier Hallen, S057 über dem Warmgang zum Engineer,
  S063 Aufsicht.

## Licht und Farbe

Hell wie ein reales Rechenzentrum: kaltweisses LED-Licht von oben, helle Böden und Decken. Der bläuliche Grundton
bleibt über das Himmelslicht, einen leichten blaugrauen Dunst, blaue Server-LEDs und das blaue Wandband. Die
Produktionstrasse ist bis zur Rücknahme ohne Verkehr; danach laufen warmgelbe Pakete durch sie, und das Hallenlicht
wird minimal wärmer. Das OOB-Kabel bleibt cyan, das Console-Kabel hellblau – beide bleiben getrennt von der Trasse.

## Kamerasprache

Zuerst vor dem Rack (Kaltgang, Produktion), dann hinter dem Rack (Warmgang), der Console-Port, der Engineer.
Fahrten durch die Gänge und um die Ecken der Reihen führen **immer wieder zum Engineer zurück**; die Wegstrecken
wechseln, und die Richtung wechselt: **mal zu ihm hin** (`*_to`: Blick nach vorn, am Ende auf ihn), **mal von ihm weg**
(`away_*`: Blick zurück auf ihn, dann um die Ecke). Augenhöhe 1,5–1,7 m, tiefe Fahrten 0,9 m, eine hohe Fahrt und eine
Aufsicht. Feste Orte: Rackfront (Ports, SFP), Rückseite, Console-Port (Makro), Engineer, Laptop (Bildschirm),
NOC-Display, Service-Reihe.

## Fachszenario (unverändert)

R-EDGE (IOS XE) verbindet Client 192.0.2.10 (Gi0/0/0) mit dem Uplink Gi0/0/1 10.0.12.1/30; Nachbar 10.0.12.2,
Dienst 198.51.100.20:443, statische Route 198.51.100.0/24 via 10.0.12.2. CHG-2088 hat vor Filmbeginn shutdown auf
Gi0/0/1 gesetzt. In-band-SSH vom prod-client 198.51.100.10 endet am Nachbarn. Der Laptop des Engineers ist die
Managementstation 10.99.0.10 im getrennten OOB-Netz 10.99.0.0/24; SSH zum Console-Server 10.99.0.20, picocom
/dev/ttyUSB7 9600 8N1, Kanal 7 seriell zum CON-Port. show running-config 136,32 s, Diff 140,4 s, no shutdown genau
147,88 s, Link 150,48 s, Line Protocol 151,48 s, Route 153,84 s, P-O1 158,88 → HTTP 200 163,48 s, speichern 182,8 s,
P-O2 212,06 → HTTP 200 218,64 s, Doku-Zeile 221,06 s.

## Kontinuität

- Gi0/0/1 ist bis 147,88 s administrativ down: Port-LED aus, Etikett «administratively down», Trasse ohne Verkehr.
  Danach LED grün, Pakete in der Trasse. Kein In-band-Paket erreicht R-EDGE vorher.
- OOB-Kabel, Console-Server und Console-Kabel sind von der ersten Einstellung an da; Pakete laufen erst ab der
  SSH-Sitzung (66,78 s), serielle Bytes ab picocom (68,6 s).
- Antworten von P-O1/P-O2 laufen über die Produktionstrasse zurück, nie über die Console.
- Der Engineer bleibt sitzen; das Telefon wird nicht benutzt.

## Schnittliste

Startzeiten aus der Vorlage; Orte, Kamera (Fahrtvariante) und Handlung neu. Erzeugt mit `python3 src/tools/shotlist.py`.

<!-- shots -->
| Shot | Beginn s | Ende s | Ort | Kamera | Handlung | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- |
| S001 | 0.0000 | 8.4800 | FLY | zoom_in | Eine Fahrt: die schlafende Stadt, das grosse Bürogebäude, durchs Dach abwärts durch sechs schematische Etagen zur Rechenzentrumsebene mit vier Hallen, hinein in Rechenzentrum 2 bis vor Rack C06 (R-EDGE). Die Störung besteht seit 0 s. | Instrumental; E001; E002; E003 |
| S002 | 8.4800 | 10.4200 | FRONT | port | Front von R-EDGE: Gi0/0/1 dunkel, Etikett «administratively down». Der Login bleibt ohne Prompt. | L001 · Intro · 8.4800–10.4200 s · «Kein Login.» · **PRÜFEN**; E004; E005 |
| S003 | 10.4200 | 14.4600 | SERVICE | nbr | Am Nachbar-Rack A14 kommt ein In-band-SYN aus der Trasse an und endet vor dem abgeschalteten Uplink. | L002 · Intro · 10.4200–14.0200 s · «Keine Antwort.» · **PRÜFEN** |
| S004 | 14.4600 | 18.4800 | FRONT | wide | Kaltgang 2 mit Rackreihe C: die gelbe Glasfasertrasse über R-EDGE bleibt ohne Verkehr. | L003 · Intro · 14.4600–18.1800 s · «Das Netz ist weg.» · **PRÜFEN** |
| S005 | 18.4800 | 22.5800 | BACK | reveal | Erster Blick hinter das Rack: Warmgang, Rückseite von C06 mit OOB-Switch, Console-Server und hellblauem Console-Kabel – schon vorhanden. | L004 · Intro · 18.4800–22.5800 s · «Der andere Weg bleibt.» · **PRÜFEN** |
| S006 | 22.5800 | 30.4533 | FLY | fly_hall | Überflug über Rechenzentrum 2 ohne Decke: Rackreihen, Gänge, die dunkle gelbe Trasse; hinten die Nachbarhallen. | Instrumental; E006; E007 |
| S007 | 30.4533 | 38.3267 | AISLE | east_to | Um die Ostecke in den Warmgang: die Kamera findet den Engineer am Boden mit Laptop und Kabel. | Instrumental; E008 |
| S008 | 38.3267 | 46.2000 | CONSOLE | ports | Console-Server: serielle Ports 1–8, Port 7 mit hellblauem Kabel zum CON-Port von R-EDGE; noch keine Änderung. | Instrumental; E009 |
| S009 | 46.2000 | 48.1800 | SERVICE | nbr | SSH-Wiederholungen vom prod-client enden am Nachbarn; Timeout auf dem Produktionspfad. B01. | L005 · Verse 1 · 46.2000–48.1800 s · «SSH wartet, bis es aufgibt,»; E010 |
| S010 | 48.1800 | 52.6800 | NOC | dash | NOC-Wanddisplay: Dashboard mit altem Zeitstempel, keine neuen Werte. | L006 · Verse 1 · 48.1800–51.3200 s · «kein Dashboard lädt noch einen Wert.» |
| S011 | 52.6800 | 56.4800 | LAPTOP | screen | Laptop: CHG-2088 als historischer Eingriff (shutdown an Gi0/0/1) im Managementspeicher. | L007 · Verse 1 · 52.6800–55.6800 s · «Die Änderung hat den Pfad zerschnitten,» |
| S012 | 56.4800 | 60.0800 | FRONT | sfp | Makro: SFP in Gi0/0/1 mit gelber Faser – genau der Port, über den die Änderung lief. | L008 · Verse 1 · 56.4800–58.8200 s · «über den ich sie geschickt hab.» |
| S013 | 60.0800 | 63.3600 | AISLE | west_to | Durch Kaltgang 1 und um die Westecke in den Warmgang: hinten am Rack hängt die Leitung, daneben der Engineer. | L009 · Verse 1 · 60.0800–63.3600 s · «Doch hinten am Rack hängt eine Leitung,» |
| S014 | 63.3600 | 66.7800 | BACK | gap | Rückseite: das cyanfarbene OOB-Kabel des Laptops getrennt von den Produktionskabeln und der gelben Trasse oben. | L010 · Verse 1 · 63.3600–66.7800 s · «getrennt von diesem Traffic hier.»; E011 |
| S015 | 66.7800 | 71.0600 | CONSOLE | ch7 | Kanal 7 leuchtet: Console-Server → R-EDGE CON. B02. | L011 · Verse 1 · 66.7800–71.0600 s · «Ein eigener Zugang zur Console,» |
| S016 | 71.0600 | 75.3000 | LAPTOP | screen | Laptop: R-EDGE# erreichbar, obwohl der Produktions-Uplink geschlossen bleibt. | L012 · Verse 1 · 71.0600–73.4200 s · «die letzte offene Tür.»; E012 |
| S017 | 75.3000 | 78.0200 | ENGINEER | typing | Der Engineer tippt; cyanfarbene Pakete laufen über das Laptop-Kabel zum OOB-Switch. | L013 · Pre-Chorus · 75.3000–78.0200 s · «Ich brauch nicht erst das Netz zurück,»; E013 |
| S018 | 78.0200 | 82.6000 | CONSOLE | bytes | Serielle Bytes laufen über das Console-Kabel – ohne Produktionsrouting. | L014 · Pre-Chorus · 78.0200–80.9000 s · «um wieder ranzukommen.» |
| S019 | 82.6000 | 85.8400 | AISLE | away_east | Vom Engineer weg: die Kamera folgt dem Kabel ins Rack und zieht durch den Warmgang davon. | L015 · Pre-Chorus · 82.6000–85.8400 s · «Ich nehme den getrennten Weg.» |
| S020 | 85.8400 | 90.0800 | LAPTOP | screen | Laptop: R-EDGE# steht, Produktionspfad down. | L016 · Pre-Chorus · 85.8400–88.0800 s · «Der Prompt ist noch zu hören.»; E014 |
| S021 | 90.0800 | 91.9800 | ENGINEER | hook | OUT OF BAND: Engineer, Laptop, Kabel und Rack in einer ruhigen Totale. | L017 · Chorus · 90.0800–91.7200 s · «Out of Band.» · **PRÜFEN**; E015; E016 |
| S022 | 91.9800 | 95.8600 | CONSOLE | ch7 | Kanal 7 bleibt offen und trägt nur CLI. | L018 · Chorus · 91.9800–95.6600 s · «Eine Tür bleibt offen.» |
| S023 | 95.8600 | 100.0400 | FLY | fly_duct | Überflug entlang der gelben Glasfasertrasse: der grosse Weg schweigt, kein Paket. | L019 · Chorus · 95.8600–100.0400 s · «Wenn der grosse Weg verstummt,» |
| S024 | 100.0400 | 105.1600 | LAPTOP | screen | Laptop: Antworten der Console kommen über Serial und OOB zurück. | L020 · Chorus · 100.0400–103.2200 s · «komm ich hier noch an.» · **PRÜFEN**; E017 |
| S025 | 105.1600 | 107.3800 | BACK | both | Zweiter Hook von der Rackrückseite: OOB-Kabel unten, gelbe Produktionstrasse oben – zwei getrennte Wege. | L021 · Chorus · 105.1600–106.9600 s · «Out of Band.» · **PRÜFEN** |
| S026 | 107.3800 | 111.1600 | CONSOLE | con | Das Console-Kabel endet am CON-Port, nicht am Datenport. | L022 · Chorus · 107.3800–111.1600 s · «Ich erreiche die Console.»; E018 |
| S027 | 111.1600 | 114.6800 | LAPTOP | screen | Laptop: Vorabbild aus dem Managementspeicher neben der aktuellen Konfiguration. | L023 · Chorus · 111.1600–114.2600 s · «Ein schmaler Weg zurück,» |
| S028 | 114.6800 | 117.8000 | FRONT | port | Vorne wartet Gi0/0/1 weiter auf den gezielten Eingriff. | L024 · Chorus · 114.6800–117.8000 s · «bis das Netz wieder trägt.» |
| S029 | 117.8000 | 127.0600 | AISLE | front_to | Lange Fahrt vom NOC-Display über den Randgang und um die Ecke zurück zum Engineer. | Instrumental; E019; E020 |
| S030 | 127.0600 | 136.3200 | LAPTOP | screen | Laptop: aktuelle Konfiguration über die Console lesen. | Instrumental; E021; E022 |
| S031 | 136.3200 | 140.2600 | LAPTOP | screen | Laptop: shutdown an Gi0/0/1. B03. | L025 · Verse 2 · 136.3200–139.3800 s · «Die Console zeigt den letzten Change,»; E023 |
| S032 | 140.2600 | 144.1000 | LAPTOP | screen | Laptop: Diff aus dem Managementspeicher neben dem Plan. B03. | L026 · Verse 2 · 140.2600–142.9000 s · «der Diff liegt neben meinem Plan.»; E024 |
| S033 | 144.1000 | 147.8800 | LAPTOP | screen | Laptop: genau ein Unterschied wird geprüft. | L027 · Verse 2 · 144.1000–146.9400 s · «Ich prüfe, was den Weg gekappt hat,» |
| S034 | 147.8800 | 150.4800 | LAPTOP | screen | Laptop: no shutdown bei 147,88 s. B04. | L028 · Verse 2 · 147.8800–150.1200 s · «und setze den Fehler zurück.» |
| S035 | 150.4800 | 155.0800 | FRONT | link | Vorne: Gi0/0/1 wird grün (Link), danach Line Protocol; die gelbe Trasse erwacht. | L029 · Verse 2 · 150.4800–153.8400 s · «Erst steht der Link, dann kommt die Route,»; E025 |
| S036 | 155.0800 | 158.8800 | NOC | tiles | NOC-Display: LINK grün, ROUTE installiert, SERVICE noch offen. B05. | L030 · Verse 2 · 155.0800–157.5200 s · «doch grün allein reicht mir nicht.» |
| S037 | 158.8800 | 163.4800 | SERVICE | follow | Neuer Test P-O1 vom Client läuft durch R-EDGE und die Trasse zum Ziel. | L031 · Verse 2 · 158.8800–161.5000 s · «Ich teste den betroffenen Service»; E026 |
| S038 | 163.4800 | 166.9800 | SERVICE | server | P-O1-Antwort: HTTP 200 vom Server-Rack 198.51.100.20. B06. | L032 · Verse 2 · 163.4800–165.7000 s · «vom Client bis zum Ziel.»; E027 |
| S039 | 166.9800 | 169.3200 | AISLE | away_west | Vom Engineer weg durch den Warmgang und um die Westecke in die Halle. | L033 · Bridge · 166.9800–169.3200 s · «Ein Backup, das erreichbar ist.»; E028 |
| S040 | 169.3200 | 170.8600 | LAPTOP | screen | Laptop: Rollback dokumentiert (Interface und no shutdown). | L034 · Bridge · 169.3200–170.8600 s · «Ein Rollback, den wir kennen.» |
| S041 | 170.8600 | 173.0000 | BACK | both | Cyan bleibt getrennt von der jetzt warm leuchtenden Produktionstrasse. | L035 · Bridge · 170.8600–172.9200 s · «Ein Zugang, der getrennt bleibt,» |
| S042 | 173.0000 | 174.8000 | FLY | fly_duct_warm | Überflug zurück über die Trasse: jetzt laufen warme Pakete zum Nachbarn. | L036 · Bridge · 173.0000–174.8000 s · «wenn sich die andern Wege trennen.» |
| S043 | 174.8000 | 177.0800 | CONSOLE | bytes | Serielle Bytes und Prompt: die konkrete Technik des Zugangs. | L037 · Bridge · 174.8000–176.9600 s · «Kein Zauber hinter dieser Tür,» |
| S044 | 177.0800 | 178.6400 | BACK | label | Kabeletiketten «OOB · CON-07»: dieser Weg war vorher gebaut. | L038 · Bridge · 177.0800–178.6400 s · «wir haben sie vorher gebaut.» |
| S045 | 178.6400 | 180.5400 | CONSOLE | ch7 | Dokumentation fährt über Kanal 7 zurück zum Laptop. | L039 · Bridge · 178.6400–180.5400 s · «Jetzt trägt die kleine Leitung»; E029 |
| S046 | 180.5400 | 182.8000 | FLY | fly_dc | Aufsteigender Überflug: alle vier Rechenzentren arbeiten, die Produktion reicht in die Tiefe. | L040 · Bridge · 180.5400–182.8000 s · «die Arbeit für das grosse Netz.» |
| S047 | 182.8000 | 189.8400 | LAPTOP | screen | Laptop: speichern nach den Tests. B07. | Instrumental; E030 |
| S048 | 189.8400 | 196.8800 | AISLE | hall_to | Hohe Fahrt über Kaltgang 2, um die Ecke und hinunter zum Engineer; Verkehr in der Trasse. | Instrumental |
| S049 | 196.8800 | 199.8200 | ENGINEER | low | Final OUT OF BAND: tiefe Totale mit Engineer, Rack und leuchtender Trasse. | L041 · Final Chorus · 196.8800–198.6600 s · «Out of Band.»; E031; E032 |
| S050 | 199.8200 | 203.6000 | LAPTOP | screen | Laptop: Console-Kanal 7 antwortet weiterhin. | L042 · Final Chorus · 199.8200–202.3200 s · «Eine Tür bleibt offen.» |
| S051 | 203.6000 | 206.6000 | FRONT | port | Vorne: Gi0/0/1 grün; der Diff ist archiviert, kein erneuter Ausfall. | L043 · Final Chorus · 203.6000–206.6000 s · «Wenn der grosse Weg verstummt,» |
| S052 | 206.6000 | 212.0600 | AISLE | away_low | Tiefe Rückfahrt vom Engineer den Warmgang entlang. | L044 · Final Chorus · 206.6000–209.9200 s · «komm ich hier noch an.» |
| S053 | 212.0600 | 213.9600 | SERVICE | follow | Bestätigungstest P-O2 startet. | L045 · Final Chorus · 212.0600–213.9600 s · «Out of Band.» |
| S054 | 213.9600 | 218.6400 | SERVICE | follow | Die Antwort kehrt auf dem Produktionspfad zurück, nicht über die Console. | L046 · Final Chorus · 213.9600–217.6600 s · «Die Antwort ist zurück.» |
| S055 | 218.6400 | 221.0600 | SERVICE | server | P-O2: HTTP 200, TLS geprüft. | L047 · Final Chorus · 218.6400–221.0600 s · «Der Test erreicht sein Ziel,» |
| S056 | 221.0600 | 225.3000 | NOC | tiles | NOC-Display: Link, Route und Service als drei abgeschlossene Nachweise. | L048 · Final Chorus · 221.0600–225.3000 s · «und das Netz trägt wieder.» · **PRÜFEN** |
| S057 | 225.3000 | 229.6400 | FLY | fly_hot | Überflug über dem Warmgang, absinkend bis zum Engineer. | Instrumental; E033; E034 |
| S058 | 229.6400 | 232.2000 | LAPTOP | screen | Laptop: Console bleibt erreichbar, Konfiguration gespeichert. | L049 · Outro · 229.6400–232.2000 s · «Console bleibt erreichbar.» · **PRÜFEN**; E035 |
| S059 | 232.2000 | 236.2000 | LAPTOP | screen | Laptop: CHG-2088 mit Ursache, Vorzustand, Rücknahme und beiden Tests. B07. | L050 · Outro · 232.2000–236.2000 s · «Die letzte Änderung dokumentiert.» |
| S060 | 236.2000 | 240.3400 | ENGINEER | phone | Das Telefon liegt still neben dem Engineer auf dem Boden. | L051 · Outro · 236.2000–240.3400 s · «Das Telefon liegt still.» |
| S061 | 240.3400 | 243.5600 | FLY | zoom_out | Zoom aus allem heraus: vom Engineer hoch über die Halle, die vier Rechenzentren, durch die Etagen und das Dach … | L052 · Outro · 240.3400–243.5600 s · «Die Stadt schläft weiter.» |
| S062 | 243.5600 | 250.5112 | FLY | zoom_out | … bis zur schlafenden Stadt (eine durchgehende Fahrt mit S061). | Instrumental; E036; E037; E038; E039; E040 |
| S063 | 250.5112 | 257.4623 | FLY | top | Zurück in die Halle von oben: gelbe Trasse und cyanfarbenes OOB-Kabel getrennt sichtbar. | Instrumental; E041 |
| S064 | 257.4623 | 264.4135 | ENGINEER | final | Langsame Fahrt zum Engineer und zum Console-Kabel; Blende ab 258,5 s. | Instrumental; E042; E043; E044 |
<!-- /shots -->
