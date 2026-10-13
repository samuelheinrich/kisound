# 08 · Out of Band — Der getrennte Zugang

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [08_Out_of_Band_1.0.wav](08_Out_of_Band_1.0.wav) · SHA-256 `9139796abf25839d0b7a85ee57042ebe0e1f524d5f8c0f61073e9b2b42a2427c`.
- Transkript: [08_Out_of_Band_Transkript.json](08_Out_of_Band_Transkript.json) · SHA-256 `31d96fedd52205614f68229e8c240f75923552c7686090b5169584051ff00497`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/08_Out_of_Band/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `aed244c4896af7bb099ab7183ff9e7957066b59fa1e60d08a318ab5e89ce6820`.
- Exaktes Ende: **264.4135 s**, 12691848 Samples/Kanal bei 48000 Hz; Timecode 00:04:24.414 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 126.0 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Die Produktionsinfrastruktur ist anfangs ein enger dunkler Raum. Ein grosser Uplink endet in einer geschlossenen administrativen Klappe; die Kamera prallt optisch daran ab. Hinter dem Rack verläuft jedoch eine dünne cyanfarbene Leitung in einer getrennten Kabeltrasse. Sie führt über einen eigenen Managementswitch zum Console-Server und dann als serielle Leitung in den betroffenen Router. Beide Netze haben getrennte Ports, Kabel und Adressflächen; sie treffen sich nur am verwalteten Gerät.

Der Console-Server ist eine kompakte Schaltkammer, seine seriellen Kanäle nummerierte schmale Tunnel. Kanal 7 führt in R-EDGE. Der lokale Konfigurationsraum besitzt Interfaceplatten, einen Change-Diff und einen gesicherten Vorzustand. Ein Cursor bildet hier die handelnde Figur. Weder Hände noch Techniker betreten den Raum; selbst das Telefon im Outro liegt unbenutzt auf einer festen Fläche.

Die enge Anfangskamera nimmt kaltes Blau und kurzen Sichtabstand. Bei der Entdeckung des schon bestehenden Managementweges wird eine kontinuierliche Fahrt hinter dem Rack möglich. Nach der gezielten Rücknahme wachsen Sichttiefe und warmer Amberanteil, die Produktionshallen öffnen sich. Die separate dünne Console-Leitung bleibt cyan und wird im Finale nicht mit dem grossen Datenpfad verschmolzen. Die schlafende Stadt erscheint als äusserer Abschluss des Albums, ohne menschliche Hauptfigur.

## Fachszenario

Für die simulierten HTTPS-Tests ist die Labor-CA am Linux-Client bereits vertrauenswürdig installiert; curl prüft das Zertifikat regulär. Die Befehle erzeugen JSON und den tatsächlichen HTTP-Status als getrennte Ausgabezeilen.

R-EDGE unter IOS XE verbindet Client 192.0.2.10 auf Gi0/0/0 mit Produktions-Uplink Gi0/0/1, 10.0.12.1/30; Nachbar 10.0.12.2 führt zum Dienst 198.51.100.20:443. Statische Route 198.51.100.0/24 via 10.0.12.2 ist konfiguriert. Change CHG-2088 hat versehentlich shutdown auf Gi0/0/1 gesetzt, über den die In-band-SSH-Verbindung lief. Der fehlgeschlagene In-band-Versuch kommt von einem Linux-Administrationsclient 198.51.100.10 hinter dem Uplink und richtet sich an 10.0.12.1. Seit Beginn ist das Interface administrativ down; dieser Fehler wird nicht erst bei seiner späteren Erklärung neu erzeugt.

Managementstation 10.99.0.10 erreicht Console-Server 10.99.0.20 über ein bestehendes unabhängiges Netz. Von dort führt Kanal 7 seriell zu R-EDGE. Linux auf dem Console-Server verwendet picocom /dev/ttyUSB7 mit 9600 Baud, 8N1; privilegierter IOS-Zugang ist im Szenario bereits autorisiert, Credentials werden nicht gezeigt. Das Managementnetz benutzt weder den ausgefallenen Produktions-Uplink noch dessen Routing. Ein gespeichertes Pre-Change-Konfigurationsabbild liegt im erreichbaren Managementspeicher; der Diff ist ein dort erzeugtes Vergleichsdokument, kein erfundener IOS-diff-Befehl.

Ab 136.32 s zeigt die Console den aktuellen shutdown-Zustand und den gesicherten Vorzustand ohne shutdown. Bei 147.88 s wird genau no shutdown an Gi0/0/1 ausgeführt. Danach erst Link up, dann wieder installierte statische Route, danach neuer HTTPS-Test vom betroffenen Client zum Ziel. Grün an einer Portlampe bestätigt noch keine Anwendung. Service-Erfolg ist ab 163.48 s dokumentiert, im Final Chorus mit einem neuen Test erneut bestätigt. Der Managementzugang bleibt unabhängig, Diff und Rollback werden dokumentiert, Konfiguration erst nach Verifikation gespeichert.

## Kontinuität

Produktions-Uplink ist bis 147.88 s administrativ down; keine In-band-CLI-Antwort erreicht vorher die Managementstation. Die SSH-Sitzung zum Console-Server benutzt immer 10.99.0.20, die IOS-Eingaben laufen seriell. Kanäle und Plattformprompts bleiben sichtbar auseinandergehalten.
P-O1 bezeichnet den neuen Service-Test nach Wiederherstellung, P-O2 den späteren Bestätigungstest. Beide entstehen neu; kein alter verlorener Login wird reanimiert. Link/Routing/Service sind getrennte Nachweise in dieser Reihenfolge. Die statische Route ist vor dem Eingriff konfiguriert, bei down nicht über den Next Hop nutzbar; nach Link up wieder installiert. Keine OSPF-Nachbarschaft oder BGP-Konvergenz erfinden.
Der Change wird einmal zurückgenommen; Final Chorus zeigt den offenen Uplink aus neuer Perspektive. Pre-Change-Abbild, Diff, Console-Kanal 7 und separates Managementnetz bleiben bis zum Ende vorhanden. Warmes Licht ist die gestalterische Auflösung, keine zusätzliche Messbehauptung über das Audio. Die Stadt schläft wie im Albumauftakt; das stille Telefon erhält keinen Benutzer.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 benutzt das Produktionsnetz; B02 ein anderes Linux-Terminal im Managementnetz und danach den IOS-Prompt auf Serial. B03 ist gespeicherter Linux-Dateidiff plus aktueller IOS-Auszug. B04 führt no shutdown bei 147.88 s aus; Link up bei 150.48 s, Line Protocol up anschliessend. B05 zeigt installierte Route erst nach Link/Line Protocol, vollständig bei 153.84 s. B06 zeigt das curl-Rezept ab 158.88 s und das erfolgreiche Resultat bei 163.48 s. B07 speichert erst im Instrumental ab 182.80 s. Die P-O2-Ergebniszeile fehlt dort zunächst und wird erst im Final Chorus bei 221.06 s ergänzt.

IOS-/Linux-Ausgaben sind gekürzte, simulierte Ausschnitte. Der Produktionsclient 198.51.100.10 und die unabhängige Managementstation 10.99.0.10 sind getrennte Endpunkte. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 46.2000–60.0800 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B02 | 66.7800–90.0800 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B03 | 136.3200–147.8800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |
| B04 | 147.8800–155.0800 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B05 | 150.4800–158.8800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |
| B06 | 158.8800–170.8600 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B07 | 182.8000–243.5600 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |

### B01 · 46.2000–60.0800 s

```text
In-band-Versuch (Produktionspfad)
prod-client$ ssh ops@10.0.12.1
ssh: connect to host 10.0.12.1 port 22: Connection timed out
Dashboard: letzter erfolgreicher Abruf vor CHG-2088
Gi0/0/1 administratively down
```

### B02 · 66.7800–90.0800 s

```text
management$ ssh consoleops@10.99.0.20
console$ picocom --baud 9600 --databits 8 --parity n --stopbits 1 /dev/ttyUSB7
Terminal ready
R-EDGE#
Overlay: SSH im separaten Managementnetz; danach seriell 9600/8N1
Kanal 7 -> R-EDGE Console
```

### B03 · 136.3200–147.8800 s

```text
R-EDGE# show running-config interface GigabitEthernet0/0/1
interface GigabitEthernet0/0/1
 ip address 10.0.12.1 255.255.255.252
 shutdown

Change-Diff CHG-2088 (Managementstation, gespeicherte Dateien)
interface GigabitEthernet0/0/1
+ shutdown
Vorabbild: Interface aktiv; Route via 10.0.12.2 unverändert
```

### B04 · 147.8800–155.0800 s

```text
R-EDGE# configure terminal
R-EDGE(config)# interface GigabitEthernet0/0/1
R-EDGE(config-if)# no shutdown
R-EDGE(config-if)# end
%LINK-3-UPDOWN: Interface GigabitEthernet0/0/1, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/1, changed state to up
```

### B05 · 150.4800–158.8800 s

```text
R-EDGE# show ip interface brief
GigabitEthernet0/0/1  10.0.12.1  YES manual  up  up
R-EDGE# show ip route 198.51.100.20
Routing entry for 198.51.100.0/24
  Known via "static", distance 1, metric 0
  * 10.0.12.2
Overlay: LINK bestätigt -> ROUTE installiert -> SERVICE noch prüfen
```

### B06 · 158.8800–170.8600 s

```text
client$ curl --connect-timeout 3 --max-time 5 --resolve app.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app.example/health
{"status":"ok"}
HTTP 200
P-O1: HTTP 200 | TLS-Zertifikat geprüft
Client 192.0.2.10 -> 198.51.100.20:443
Kein Datenverkehr über Console-Kanal 7
```

### B07 · 182.8000–243.5600 s

```text
R-EDGE# copy running-config startup-config
Destination filename [startup-config]?
Building configuration...
[OK]
CHG-2088 | Rücknahme dokumentiert
Gi0/0/1: no shutdown | Route via 10.0.12.2 installiert
P-O1 erfolgreich | P-O2 im Finale erneut HTTP 200
Management 10.99.0.20 / Console Kanal 7 weiterhin erreichbar
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 8.4800 | PROD | Vom Dashboard bis zur geschlossenen administrativen Uplink-Klappe fahren; Fehlzustand steht seit 0 s fest. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | Instrumental; E001; E002; E003 |
| S002 | 8.4800 | 10.4200 | PROD | In-band-SSH-Verbindung erreicht den abgeschalteten Uplink nicht; Login bleibt ohne Prompt. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L001 · Intro · 8.4800–10.4200 s · «Kein Login.» · **PRÜFEN**; E004; E005 |
| S003 | 10.4200 | 14.4600 | PROD | Der Rückkanal bleibt leer, keine erfolgreiche Terminalantwort wird vorgetäuscht. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L002 · Intro · 10.4200–14.0200 s · «Keine Antwort.» · **PRÜFEN** |
| S004 | 14.4600 | 18.4800 | PROD | Produktionsweg ist dunkel, Linkplatte Gi0/0/1 trägt administratively down. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L003 · Intro · 14.4600–18.1800 s · «Das Netz ist weg.» · **PRÜFEN** |
| S005 | 18.4800 | 22.5800 | MGMT | Hinter dem Rack leuchtet bereits die separate Managementtrasse; sie entsteht nicht erst jetzt. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L004 · Intro · 18.4800–22.5800 s · «Der andere Weg bleibt.» · **PRÜFEN** |
| S006 | 22.5800 | 30.4533 | PROD | Das isolierte Produktionsnetz in engen, kalten Räumen zeigen; Antworten fehlen weiterhin. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | Instrumental; E006; E007 |
| S007 | 30.4533 | 38.3267 | MGMT | Die bereits vorhandene separate Trasse hinter den Racks langsam entdecken. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | Instrumental; E008 |
| S008 | 38.3267 | 46.2000 | SERIAL | Managementswitch, Console-Server und seriellen Kanal 7 räumlich verbinden; noch keine Konfigurationsänderung. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | Instrumental; E009 |
| S009 | 46.2000 | 48.1800 | PROD | Der SSH-Versuch zum Produktionsgerät läuft in seinen Timeout. B01. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L005 · Verse 1 · 46.2000–48.1800 s · «SSH wartet, bis es aufgibt,»; E010 |
| S010 | 48.1800 | 52.6800 | PROD | Dashboard bleibt mit altem Messzeitstempel stehen, keine neuen Werte kommen an. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L006 · Verse 1 · 48.1800–51.3200 s · «kein Dashboard lädt noch einen Wert.» |
| S011 | 52.6800 | 56.4800 | CONFIG | CHG-2088 zeigt shutdown als historischen Eingriff am Uplink; der Fehler besteht seit Filmbeginn. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L007 · Verse 1 · 52.6800–55.6800 s · «Die Änderung hat den Pfad zerschnitten,» |
| S012 | 56.4800 | 60.0800 | PROD | Die alte In-band-Verwaltungslinie endet an genau dem Port, dessen Change sie übertragen hatte. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L008 · Verse 1 · 56.4800–58.8200 s · «über den ich sie geschickt hab.» |
| S013 | 60.0800 | 63.3600 | MGMT | Kamera gleitet hinter das Rack und findet die beschriftete unabhängige Leitung. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L009 · Verse 1 · 60.0800–63.3600 s · «Doch hinten am Rack hängt eine Leitung,» |
| S014 | 63.3600 | 66.7800 | MGMT | Management- und Produktionstrasse bleiben über eine Luftlücke sichtbar getrennt. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L010 · Verse 1 · 63.3600–66.7800 s · «getrennt von diesem Traffic hier.»; E011 |
| S015 | 66.7800 | 71.0600 | SERIAL | Console-Server Kanal 7 führt als serieller Tunnel nach R-EDGE. B02. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | L011 · Verse 1 · 66.7800–71.0600 s · «Ein eigener Zugang zur Console,» |
| S016 | 71.0600 | 75.3000 | CONFIG | Lokaler IOS-Prompt ist erreichbar, obwohl der Produktions-Uplink geschlossen bleibt. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L012 · Verse 1 · 71.0600–73.4200 s · «die letzte offene Tür.»; E012 |
| S017 | 75.3000 | 78.0200 | MGMT | Das bestehende Managementnetz transportiert die neue SSH-Sitzung zum Console-Server. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L013 · Pre-Chorus · 75.3000–78.0200 s · «Ich brauch nicht erst das Netz zurück,»; E013 |
| S018 | 78.0200 | 82.6000 | SERIAL | Bytefolge der Console erreicht das Gerät ohne Produktionsrouting. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | L014 · Pre-Chorus · 78.0200–80.9000 s · «um wieder ranzukommen.» |
| S019 | 82.6000 | 85.8400 | MGMT | Kamera folgt 10.99.0.10→10.99.0.20→Kanal 7 als zusammenhängendem getrennten Weg. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L015 · Pre-Chorus · 82.6000–85.8400 s · «Ich nehme den getrennten Weg.» |
| S020 | 85.8400 | 90.0800 | CONFIG | R-EDGE# steht auf der lokalen Console-Fläche, Produktionspfad bleibt down. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L016 · Pre-Chorus · 85.8400–88.0800 s · «Der Prompt ist noch zu hören.»; E014 |
| S021 | 90.0800 | 91.9800 | MGMT | OUT OF BAND rahmt die schmale unabhängige Trasse. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L017 · Chorus · 90.0800–91.7200 s · «Out of Band.» · **PRÜFEN**; E015; E016 |
| S022 | 91.9800 | 95.8600 | SERIAL | Kanal 7 bleibt offen und transportiert CLI, kein Anwendungsverkehr wird darüber umgeleitet. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | L018 · Chorus · 91.9800–95.6600 s · «Eine Tür bleibt offen.» |
| S023 | 95.8600 | 100.0400 | PROD | Die breite Produktionsklappe bleibt geschlossen, daneben läuft der Managementpfad weiter. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L019 · Chorus · 95.8600–100.0400 s · «Wenn der grosse Weg verstummt,» |
| S024 | 100.0400 | 105.1600 | CONFIG | Die Console liefert Antworten über Serial und Management zurück zur Station. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L020 · Chorus · 100.0400–103.2200 s · «komm ich hier noch an.» · **PRÜFEN**; E017 |
| S025 | 105.1600 | 107.3800 | MGMT | Zweiter Hook zeigt die räumliche Trennung beider Netze aus der Rackrückseite. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L021 · Chorus · 105.1600–106.9600 s · «Out of Band.» · **PRÜFEN** |
| S026 | 107.3800 | 111.1600 | SERIAL | Der serielle Kanal endet am lokalen Konfigurationsraum, nicht am Datenplane-Uplink. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | L022 · Chorus · 107.3800–111.1600 s · «Ich erreiche die Console.»; E018 |
| S027 | 111.1600 | 114.6800 | CONFIG | Pre-Change-Abbild wird aus dem erreichbaren Managementspeicher neben die aktuelle Konfiguration gelegt. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L023 · Chorus · 111.1600–114.2600 s · «Ein schmaler Weg zurück,» |
| S028 | 114.6800 | 117.8000 | PROD | Grosser Produktionsweg wartet weiterhin auf den gezielten Eingriff; noch kein Link up. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L024 · Chorus · 114.6800–117.8000 s · «bis das Netz wieder trägt.» |
| S029 | 117.8000 | 127.0600 | MGMT | Im Managementspeicher das datierte Pre-Change-Abbild finden; gleiche Interface-ID als Anker. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | Instrumental; E019; E020 |
| S030 | 127.0600 | 136.3200 | CONFIG | Aktuelle Konfiguration über die Console lesen und den Unterschied shutdown sichtbar vorbereiten. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | Instrumental; E021; E022 |
| S031 | 136.3200 | 140.2600 | CONFIG | Console-Auszug zeigt shutdown an Gi0/0/1 und den unveränderten Next Hop. B03. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L025 · Verse 2 · 136.3200–139.3800 s · «Die Console zeigt den letzten Change,»; E023 |
| S032 | 140.2600 | 144.1000 | CONFIG | Linux-erzeugter Change-Diff steht neben dem gesicherten Plan, getrennt vom IOS-Prompt. B03. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L026 · Verse 2 · 140.2600–142.9000 s · «der Diff liegt neben meinem Plan.»; E024 |
| S033 | 144.1000 | 147.8800 | CONFIG | Der eine shutdown-Unterschied wird geprüft; keine Gesamtkonfiguration wird blind zurückgespielt. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L027 · Verse 2 · 144.1000–146.9400 s · «Ich prüfe, was den Weg gekappt hat,» |
| S034 | 147.8800 | 150.4800 | CONFIG | Ab 147.88 s no shutdown an Gi0/0/1; die administrative Klappe öffnet genau einmal. B04. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L028 · Verse 2 · 147.8800–150.1200 s · «und setze den Fehler zurück.» |
| S035 | 150.4800 | 155.0800 | PROD | Erst physischer Link up, danach zeigt die Routingplatte den installierten Next Hop 10.0.12.2. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L029 · Verse 2 · 150.4800–153.8400 s · «Erst steht der Link, dann kommt die Route,»; E025 |
| S036 | 155.0800 | 158.8800 | ROUTE | Grüne Linkanzeige bleibt neben noch ausstehendem Service-Test stehen. B05. | 35-mm-Seitenfahrt an Prefix/Next-Hop-Platten. | Next-Hop-Pfeil führt zum Serviceweg. | L030 · Verse 2 · 155.0800–157.5200 s · «doch grün allein reicht mir nicht.» |
| S037 | 158.8800 | 163.4800 | SERVICE | Neuer Test P-O1 entsteht am betroffenen Client .10 und nimmt den Produktionspfad. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | L031 · Verse 2 · 158.8800–161.5000 s · «Ich teste den betroffenen Service»; E026 |
| S038 | 163.4800 | 166.9800 | SERVICE | P-O1 erreicht .20:443, TLS und HTTP-Antwort bestätigen den vollständigen Serviceweg. B06. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | L032 · Verse 2 · 163.4800–165.7000 s · «vom Client bis zum Ziel.»; E027 |
| S039 | 166.9800 | 169.3200 | MGMT | Pre-Change-Konfiguration liegt weiterhin im erreichbaren unabhängigen Managementspeicher. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L033 · Bridge · 166.9800–169.3200 s · «Ein Backup, das erreichbar ist.»; E028 |
| S040 | 169.3200 | 170.8600 | CONFIG | Dokumentierter Rollback nennt genau Interface und no shutdown, nicht einen unspezifischen Restore. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L034 · Bridge · 169.3200–170.8600 s · «Ein Rollback, den wir kennen.» |
| S041 | 170.8600 | 173.0000 | MGMT | Die cyanfarbene Trasse bleibt von der jetzt warm leuchtenden Produktionsleitung getrennt. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L035 · Bridge · 170.8600–172.9200 s · «Ein Zugang, der getrennt bleibt,» |
| S042 | 173.0000 | 174.8000 | PROD | Die grosse Leitung arbeitet wieder; die kleine Managementleitung bleibt als eigener Zugang erhalten. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L036 · Bridge · 173.0000–174.8000 s · «wenn sich die andern Wege trennen.» |
| S043 | 174.8000 | 177.0800 | SERIAL | Serielle Bytes und lokaler Prompt zeigen die konkrete Technik des Zugangs. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | L037 · Bridge · 174.8000–176.9600 s · «Kein Zauber hinter dieser Tür,» |
| S044 | 177.0800 | 178.6400 | MGMT | Beschriftete bestehende Trasse und Console-Port bestätigen: dieser Weg war vorher gebaut. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L038 · Bridge · 177.0800–178.6400 s · «wir haben sie vorher gebaut.» |
| S045 | 178.6400 | 180.5400 | SERIAL | Dokumentation fährt über Kanal 7 zurück zur Managementstation. | Makrofahrt durch Console-Kanal 7, klare Eingang-/Ausgangsrichtung. | Cursor wird zur lokalen Konfigurationslinie. | L039 · Bridge · 178.6400–180.5400 s · «Jetzt trägt die kleine Leitung»; E029 |
| S046 | 180.5400 | 182.8000 | SERVICE | Die wieder arbeitende Produktionshalle reicht in die Tiefe, getragen vom getrennten Steuerzugang. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | L040 · Bridge · 180.5400–182.8000 s · «die Arbeit für das grosse Netz.» |
| S047 | 182.8000 | 189.8400 | CONFIG | Nach erfolgreichen Tests Konfiguration speichern; Diff und Testbelege an CHG-2088 hängen. B07. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | Instrumental; E030 |
| S048 | 189.8400 | 196.8800 | SERVICE | Neue normale Transaktionen passieren den Uplink, Kamera fährt in weitere warme Diensthallen. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | Instrumental |
| S049 | 196.8800 | 199.8200 | MGMT | Final-OUT-OF-BAND zeigt beide Wege bei offenem Produktions-Uplink. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L041 · Final Chorus · 196.8800–198.6600 s · «Out of Band.»; E031; E032 |
| S050 | 199.8200 | 203.6000 | CONFIG | Console-Kanal 7 antwortet weiterhin neben dem erfolgreichen Produktionsstatus. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L042 · Final Chorus · 199.8200–202.3200 s · «Eine Tür bleibt offen.» |
| S051 | 203.6000 | 206.6000 | PROD | Gesungene Bedingung «Wenn ... verstummt» liegt auf dem archivierten Change-Diff; kein erneuter Ausfall. | Enger 50-mm-Dolly bis zur geschlossenen Uplink-Klappe; später gleiche Achse offen. | Geschlossene bzw. offene Portkante verbindet Perspektiven. | L043 · Final Chorus · 203.6000–206.6000 s · «Wenn der grosse Weg verstummt,» |
| S052 | 206.6000 | 212.0600 | MGMT | Bestehender Managementweg bleibt physisch unabhängig sichtbar. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | L044 · Final Chorus · 206.6000–209.9200 s · «komm ich hier noch an.» |
| S053 | 212.0600 | 213.9600 | SERVICE | Neuer Bestätigungstest P-O2 startet in der warmen, geöffneten Produktionshalle. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | L045 · Final Chorus · 212.0600–213.9600 s · «Out of Band.» |
| S054 | 213.9600 | 218.6400 | SERVICE | Die neue Antwort kehrt auf dem Produktionspfad zurück, nicht über den Console-Server. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | L046 · Final Chorus · 213.9600–217.6600 s · «Die Antwort ist zurück.» |
| S055 | 218.6400 | 221.0600 | SERVICE | P-O2 bestätigt Client .10 bis .20:443 mit geprüftem TLS und HTTP 200. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | L047 · Final Chorus · 218.6400–221.0600 s · «Der Test erreicht sein Ziel,» |
| S056 | 221.0600 | 225.3000 | ROUTE | Link, installierte Route und Service-Erfolg stehen als drei abgeschlossene Nachweise nebeneinander. | 35-mm-Seitenfahrt an Prefix/Next-Hop-Platten. | Next-Hop-Pfeil führt zum Serviceweg. | L048 · Final Chorus · 221.0600–225.3000 s · «und das Netz trägt wieder.» · **PRÜFEN** |
| S057 | 225.3000 | 229.6400 | SERVICE | Bestätigungstest abschliessen und denselben Status in die Dokumentation übernehmen. | Weite 28-mm-Fahrt Client→Ziel und zurück mit neuem Antwortframe. | Antwortstatus als Match Cut zum Testdisplay. | Instrumental; E033; E034 |
| S058 | 229.6400 | 232.2000 | CONFIG | IOS-Prompt antwortet noch immer über den getrennten Kanal; persistente Config ist nach Tests gespeichert. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L049 · Outro · 229.6400–232.2000 s · «Console bleibt erreichbar.» · **PRÜFEN**; E035 |
| S059 | 232.2000 | 236.2000 | CONFIG | CHG-2088-Dokumentation enthält Ursache, Vorzustand, Rücknahme und beide Service-Tests. B07. | Starre orthogonale Ansicht von IOS-Prompt, Diff und Interfaceplatte. | Interface-ID bleibt über jeden Schnitt gleich. | L050 · Outro · 232.2000–236.2000 s · «Die letzte Änderung dokumentiert.» |
| S060 | 236.2000 | 240.3400 | STADT | Unbenutztes Telefon liegt still auf einer Fläche im Managementraum; keine menschliche Figur. | Langsame 24-mm-Kranfahrt aus der nun weiten Infrastruktur über die ruhende Stadt. | Lichtkante führt zur letzten Console-Leitung. | L051 · Outro · 236.2000–240.3400 s · «Das Telefon liegt still.» |
| S061 | 240.3400 | 243.5600 | STADT | Kamera öffnet sich über die ruhende Stadt; dieselbe Nachtwelt wie On Call, jetzt ohne Alarmhandlung. | Langsame 24-mm-Kranfahrt aus der nun weiten Infrastruktur über die ruhende Stadt. | Lichtkante führt zur letzten Console-Leitung. | L052 · Outro · 240.3400–243.5600 s · «Die Stadt schläft weiter.» |
| S062 | 243.5600 | 250.5112 | STADT | Über die Stadt hinaus zur warmen Rechenzentrumstotale fahren, kein sichtbares Publikum. | Langsame 24-mm-Kranfahrt aus der nun weiten Infrastruktur über die ruhende Stadt. | Lichtkante führt zur letzten Console-Leitung. | Instrumental; E036; E037; E038; E039; E040 |
| S063 | 250.5112 | 257.4623 | MGMT | Beide Netze aus grosser Höhe zeigen; cyanfarbener Managementpfad bleibt getrennt. | Kontinuierliche 24-mm-Fahrt entlang der separaten cyanfarbenen Kabeltrasse. | Kanalnummer führt zum seriellen Tunnel. | Instrumental; E041 |
| S064 | 257.4623 | 264.4135 | STADT | Bei 258.5 s Blende beginnen, letzte sichtbare Linie führt zur weiterhin erreichbaren Console. | Langsame 24-mm-Kranfahrt aus der nun weiten Infrastruktur über die ruhende Stadt. | Endbild bis 264.4135 s; dann Schwarz mit Dateiende. | Instrumental; E042; E043; E044 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L017 | OUT OF BAND · kräftiger Eintritt, ruhiger Halt | 90.0800 | 91.7200 | 1.6400 | 90.1310 | OUT OF BAND rahmt die schmale unabhängige Trasse. |
| L018 | EINE TÜR BLEIBT OFFEN · kräftiger Eintritt, ruhiger Halt | 91.9800 | 95.6600 | 3.6800 | 92.0310 | Kanal 7 bleibt offen und transportiert CLI, kein Anwendungsverkehr wird darüber umgeleitet. |
| L021 | OUT OF BAND · kräftiger Eintritt, ruhiger Halt | 105.1600 | 106.9600 | 1.8000 | 105.2510 | Zweiter Hook zeigt die räumliche Trennung beider Netze aus der Rackrückseite. |
| L041 | OUT OF BAND · kräftiger Eintritt, ruhiger Halt | 196.8800 | 198.6600 | 1.7800 | 196.9510 | Final-OUT-OF-BAND zeigt beide Wege bei offenem Produktions-Uplink. |
| L042 | EINE TÜR BLEIBT OFFEN · kräftiger Eintritt, ruhiger Halt | 199.8200 | 202.3200 | 2.5000 | 199.9210 | Console-Kanal 7 antwortet weiterhin neben dem erfolgreichen Produktionsstatus. |
| L045 | OUT OF BAND · kräftiger Eintritt, ruhiger Halt | 212.0600 | 213.9600 | 1.9000 | 212.0710 | Neuer Bestätigungstest P-O2 startet in der warmen, geöffneten Produktionshalle. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / PROD | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Vom Dashboard bis zur geschlossenen administrativen Uplink-Klappe fahren; Fehlzustand steht seit 0 s fest. |
| E002 | 0.1000 | level_gap / ±0.1 | S001 / PROD | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Vom Dashboard bis zur geschlossenen administrativen Uplink-Klappe fahren; Fehlzustand steht seit 0 s fest. |
| E003 | 1.5000 | energy_rise / ±0.5 | S001 / PROD | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Vom Dashboard bis zur geschlossenen administrativen Uplink-Klappe fahren; Fehlzustand steht seit 0 s fest. |
| E004 | 8.4800 | section_boundary / ±0.35 | S002 / PROD | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: In-band-SSH-Verbindung erreicht den abgeschalteten Uplink nicht; Login bleibt ohne Prompt. |
| E005 | 9.8000 | energy_fall / ±0.5 | S002 / PROD | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: In-band-SSH-Verbindung erreicht den abgeschalteten Uplink nicht; Login bleibt ohne Prompt. |
| E006 | 22.5800 | section_boundary / ±0.35 | S006 / PROD | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Das isolierte Produktionsnetz in engen, kalten Räumen zeigen; Antworten fehlen weiterhin. |
| E007 | 22.8000 | energy_rise / ±0.5 | S006 / PROD | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Das isolierte Produktionsnetz in engen, kalten Räumen zeigen; Antworten fehlen weiterhin. |
| E008 | 30.8000 | energy_rise / ±0.5 | S007 / MGMT | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Die bereits vorhandene separate Trasse hinter den Racks langsam entdecken. |
| E009 | 44.7000 | energy_rise / ±0.5 | S008 / SERIAL | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Managementswitch, Console-Server und seriellen Kanal 7 räumlich verbinden; noch keine Konfigurationsänderung. |
| E010 | 46.2000 | section_boundary / ±0.35 | S009 / PROD | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Der SSH-Versuch zum Produktionsgerät läuft in seinen Timeout. B01. |
| E011 | 63.5710 | transient / ±0.04 | S014 / MGMT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Management- und Produktionstrasse bleiben über eine Luftlücke sichtbar getrennt. |
| E012 | 74.0510 | transient / ±0.04 | S016 / CONFIG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Lokaler IOS-Prompt ist erreichbar, obwohl der Produktions-Uplink geschlossen bleibt. |
| E013 | 75.3000 | section_boundary / ±0.35 | S017 / MGMT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Das bestehende Managementnetz transportiert die neue SSH-Sitzung zum Console-Server. |
| E014 | 89.2910 | transient / ±0.04 | S020 / CONFIG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: R-EDGE# steht auf der lokalen Console-Fläche, Produktionspfad bleibt down. |
| E015 | 90.0800 | section_boundary / ±0.35 | S021 / MGMT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: OUT OF BAND rahmt die schmale unabhängige Trasse. |
| E016 | 91.9000 | energy_fall / ±0.5 | S021 / MGMT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: OUT OF BAND rahmt die schmale unabhängige Trasse. |
| E017 | 101.2000 | energy_rise / ±0.5 | S024 / CONFIG | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Die Console liefert Antworten über Serial und Management zurück zur Station. |
| E018 | 109.2910 | transient / ±0.04 | S026 / SERIAL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der serielle Kanal endet am lokalen Konfigurationsraum, nicht am Datenplane-Uplink. |
| E019 | 117.8000 | section_boundary / ±0.35 | S029 / MGMT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Im Managementspeicher das datierte Pre-Change-Abbild finden; gleiche Interface-ID als Anker. |
| E020 | 117.8610 | transient / ±0.04 | S029 / MGMT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Im Managementspeicher das datierte Pre-Change-Abbild finden; gleiche Interface-ID als Anker. |
| E021 | 128.3410 | transient / ±0.04 | S030 / CONFIG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Aktuelle Konfiguration über die Console lesen und den Unterschied shutdown sichtbar vorbereiten. |
| E022 | 135.0110 | transient / ±0.04 | S030 / CONFIG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Aktuelle Konfiguration über die Console lesen und den Unterschied shutdown sichtbar vorbereiten. |
| E023 | 136.3200 | section_boundary / ±0.35 | S031 / CONFIG | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Console-Auszug zeigt shutdown an Gi0/0/1 und den unveränderten Next Hop. B03. |
| E024 | 143.5810 | transient / ±0.04 | S032 / CONFIG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Linux-erzeugter Change-Diff steht neben dem gesicherten Plan, getrennt vom IOS-Prompt. B03. |
| E025 | 151.2010 | transient / ±0.04 | S035 / PROD | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Erst physischer Link up, danach zeigt die Routingplatte den installierten Next Hop 10.0.12.2. |
| E026 | 161.6810 | transient / ±0.04 | S037 / SERVICE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Neuer Test P-O1 entsteht am betroffenen Client .10 und nimmt den Produktionspfad. |
| E027 | 163.5000 | energy_fall / ±0.5 | S038 / SERVICE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: P-O1 erreicht .20:443, TLS und HTTP-Antwort bestätigen den vollständigen Serviceweg. B06. |
| E028 | 166.9800 | section_boundary / ±0.35 | S039 / MGMT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Pre-Change-Konfiguration liegt weiterhin im erreichbaren unabhängigen Managementspeicher. |
| E029 | 179.5000 | energy_rise / ±0.5 | S045 / SERIAL | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Dokumentation fährt über Kanal 7 zurück zur Managementstation. |
| E030 | 182.8000 | section_boundary / ±0.35 | S047 / CONFIG | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Nach erfolgreichen Tests Konfiguration speichern; Diff und Testbelege an CHG-2088 hängen. B07. |
| E031 | 196.8800 | section_boundary / ±0.35 | S049 / MGMT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Final-OUT-OF-BAND zeigt beide Wege bei offenem Produktions-Uplink. |
| E032 | 198.3610 | transient / ±0.04 | S049 / MGMT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Final-OUT-OF-BAND zeigt beide Wege bei offenem Produktions-Uplink. |
| E033 | 228.3710 | transient / ±0.04 | S057 / SERVICE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bestätigungstest abschliessen und denselben Status in die Dokumentation übernehmen. |
| E034 | 229.2000 | energy_fall / ±0.5 | S057 / SERVICE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bestätigungstest abschliessen und denselben Status in die Dokumentation übernehmen. |
| E035 | 229.6400 | section_boundary / ±0.35 | S058 / CONFIG | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: IOS-Prompt antwortet noch immer über den getrennten Kanal; persistente Config ist nach Tests gespeichert. |
| E036 | 243.5600 | section_boundary / ±0.35 | S062 / STADT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Über die Stadt hinaus zur warmen Rechenzentrumstotale fahren, kein sichtbares Publikum. |
| E037 | 243.5600 | last_vocal_end / ±0.5 | S062 / STADT | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Über die Stadt hinaus zur warmen Rechenzentrumstotale fahren, kein sichtbares Publikum. |
| E038 | 243.9000 | level_gap / ±0.1 | S062 / STADT | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Über die Stadt hinaus zur warmen Rechenzentrumstotale fahren, kein sichtbares Publikum. |
| E039 | 244.0000 | energy_rise / ±0.5 | S062 / STADT | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Über die Stadt hinaus zur warmen Rechenzentrumstotale fahren, kein sichtbares Publikum. |
| E040 | 244.0910 | transient / ±0.04 | S062 / STADT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Über die Stadt hinaus zur warmen Rechenzentrumstotale fahren, kein sichtbares Publikum. |
| E041 | 255.0510 | transient / ±0.04 | S063 / MGMT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Beide Netze aus grosser Höhe zeigen; cyanfarbener Managementpfad bleibt getrennt. |
| E042 | 258.5000 | fade_candidate / ±0.3 | S064 / STADT | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: Bei 258.5 s Blende beginnen, letzte sichtbare Linie führt zur weiterhin erreichbaren Console. |
| E043 | 263.0000 | energy_fall / ±0.5 | S064 / STADT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bei 258.5 s Blende beginnen, letzte sichtbare Linie führt zur weiterhin erreichbaren Console. |
| E044 | 264.4130 | end / ±2.0833333333333333e-05 | S064 / STADT | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Bei 258.5 s Blende beginnen, letzte sichtbare Linie führt zur weiterhin erreichbaren Console. |

## Referenz und Übergabeprüfung

[Cisco: IP Routing / Static Routes](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/16448-default.html) dient als Routingreferenz. [picocom-Handbuch](https://raw.githubusercontent.com/npat-efault/picocom/master/picocom.1.md) dokumentiert das serielle Terminal. Topologie, Recovery und Change-Diff sind simuliert.

Geprüft: 64 lückenlose Einstellungen von 0 bis 264.4135 s; alle 52 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 44 Events genau einmal zugeordnet; 6 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L001, L002, L003, L004, L017, L020, L021, L048, L049.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
