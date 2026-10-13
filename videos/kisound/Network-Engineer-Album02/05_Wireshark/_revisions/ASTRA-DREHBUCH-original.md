# 05 · Wireshark — Vom Port in den Mitschnitt

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [05_Wireshark_1.0.wav](05_Wireshark_1.0.wav) · SHA-256 `243d6ab2160abfa883bfb86a53a73019e406f6f63986de0ebb3659570e83128c`.
- Transkript: [05_Wireshark_Transkript.json](05_Wireshark_Transkript.json) · SHA-256 `88d442750d556a6aa98d11264ca41502f3c514b62d699e8fc477e01d636470c0`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/05_Wireshark/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `2729d44a42a52af9a0f0bc7ee1c78fcb2669a3a476e0910982818f1ebbeaac7e`.
- Exaktes Ende: **195.7335 s**, 9395208 Samples/Kanal bei 48000 Hz; Timecode 00:03:15.734 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 108.0 BPM, Sicherheit gering. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Im dunklen Rackraum trägt nur ein Port ein scharfes weisses Licht. Seine Adern führen in den transparenten Switch SW-A, wo eine kleine SPAN-Abzweigung parallel zur Datenfabric liegt. Originalframes haben feste weisse Konturen; Mirror-Kopien bekommen eine gestrichelte cyanfarbene Aussenkontur. Ihr Headerinhalt bleibt gleich, ihr Ziel im Film ist die Capture-Leitung, nicht der ursprüngliche Anwendungsempfänger.

Der Weg der Kopie führt durch den Mirror-Port in eine begehbare Wireshark-Oberfläche. Oben steht die Filterleiste, darunter eine Paketliste, unten links der aufklappbare Protokollbaum und unten rechts Bytes. Die Kamera tritt in eine ausgewählte Zeile ein; Ethernet, IP und TCP werden räumliche Schichten. Der TLS-Kern bleibt opak und schraffiert. Das ist ein Untersuchungsthriller, dessen Enthüllung die Grenze der Beobachtung ebenso ernst nimmt wie den Befund.

Zwei Capture-Flächen stehen vor und hinter einem 100-Mbit/s-Uplink. Links BEFORE, rechts AFTER; beide sind von einer gemeinsamen Zeitachse zusammengehalten. Dahinter liegt die überlastete Ausgangsqueue von SW-A. Die Kamera erreicht den Verlustort erst nach dem Vergleich der beiden Spuren. Rauchiges Blau, kaltes Weiss und sparsame amberfarbene Befundmarkierungen halten die Stimmung gespannt. Beim bestätigten Test öffnet sich die Sicht, die Welt bleibt technisch und dunkel.

## Fachszenario

Für die simulierten HTTPS-Tests ist die Labor-CA am Linux-Client bereits vertrauenswürdig installiert; curl prüft das Zertifikat regulär. Die Befehle erzeugen JSON und den tatsächlichen HTTP-Status als getrennte Ausgabezeilen.

Client 192.0.2.10:51000 spricht HTTPS mit APP 198.51.100.20:443. SW-A ist Cisco IOS XE Catalyst; Clientport Gi1/0/7, Ausgang Gi1/0/48 mit physischer 100-Mbit/s-Verbindung zu SW-B Gi1/0/48; beide Uplinkports sind Access-Ports in VLAN 120. SW-B routet am Gateway 192.0.2.1 zur Serverzone 198.51.100.0/24; der Server hängt an SW-B Gi1/0/7 in VLAN 220. Bulk-Verkehr konkurriert an genau dieser Ausgangsqueue. Capture BEFORE spiegelt auf SW-A den eingehenden Clientport, einen Bulk-Eingang und den Uplink-Eingang für die Rückrichtung; AFTER spiegelt auf SW-B den Uplink-Eingang für Hinverkehr und den Serverport-Eingang für Rückverkehr. Der Verlustvergleich benutzt ausschliesslich die Client→Server-Richtung am selben Uplink. Die Reverse-Captures zeigen getrennt Server→Client und sind entsprechend markiert. Mirror-Ausgänge sind jeweils Gi1/0/24 mit 1 Gbit/s, Analyzer nehmen beide PCAPNG getrennt auf. Keine Egress-SPAN-Beobachtung einer möglichen ASIC-Verwerfung wird als garantiert angenommen.

Im Intro laufen die vorbereiteten Capture-Sessions bereits; bei L009 wird die bestehende monitor-session-Konfiguration konkret überprüft. Ein Displayfilter grenzt Client/Ziel ein, tcp.stream == 7 identifiziert die Verbindung im BEFORE-Mitschnitt. AFTER kann eine andere Streamnummer (hier 3) besitzen; es wird anhand Tuple, relativen Sequenzbereichen und Zeitkorrelation verglichen, nicht anhand einer globalen Stream-ID.

Datenbereich Seq=12001, Len=1200 ist BEFORE vorhanden, AFTER zunächst nicht. Ein späterer Retransmission-Frame mit gleichem TCP-Bytebereich erscheint in beiden. Das allein lokalisiert noch keine Ursache. Synchronisierte Capture-Zeiten, ausreichende Mirror-Kapazität, null Capture-Drops und gleichzeitig um 18 steigende SW-A-Output-Drops grenzen den Verlust auf den Uplink-Ausgang ein. Das Bildschirm-Label TCP Retransmission ist ein Analysehinweis, keine universelle Fehlerursache. Im Vergleichsverkehr ist ein RST sichtbar; er wird nicht zum Grund des verlorenen Segments erklärt.

Bei 139.80 s wird für den kontrollierten Versuch die konkurrierende Bulk-Testquelle von 95 auf 20 Mbit/s begrenzt. Produktionslink bleibt 100 Mbit/s, kein QoS-Umbau. Gleicher HTTPS-Test mit neuer TCP-Verbindung läuft ab 142.72 s; die relevanten Segmente erscheinen auf beiden Seiten, kein neuer Output-Drop, Anwendung antwortet. TLS-Inhalt wird nur am eigenen Testclient als HTTP-Resultat gelesen; Wireshark ohne Secrets zeigt keinen Klartext. Capture stoppen, Artefakte sichern, Ursache samt kontrolliertem Versuch dokumentieren.

## Kontinuität

O-101 ist das erste Original mit Seq=12001/Len=1200, M-B101 seine BEFORE-Kopie. O-101 wird am Uplink-Ausgang verworfen und darf AFTER nicht erscheinen. O-102 ist eine neue TCP-Retransmission mit gleichem Bytebereich, anderem Frame-Zeitpunkt und IP-ID; sie erreicht AFTER, erhält dort M-A102. Mirror-Kopien laufen nie weiter als Produktionspakete. IP/TCP-Payload bleiben beim Kopieren erhalten; die filmische gestrichelte Hülle ist kein Headerfeld.
BEFORE und AFTER verwenden eigene Frame- und Streamnummern. Die Bildschirmzeit des Films ist nicht die PCAP-Zeit; Tabelle mit relativen Capturezeiten bleibt als Messdarstellung datiert. Der neue Test hat Clientport 51001 und neue Stream-IDs. Nicht dargestellte Payloaddetails bleiben verschlüsselt. Filter verbergen Zeilen, löschen keine Frames aus dem Mitschnitt.
Der zuerst funktionierende Dienst ist ein unbelasteter Vergleichspfad; beide Aussagen «geht/geht nicht» haben ihren Standort. Der Eingriff verändert nur kontrollierte Last. Wiederkehrende Hooks betrachten erst den Verlust, später die bestätigte Antwort. Im Outro ist der Capture wirklich gestoppt; spätere Paketbilder sind gespeicherte Wiedergabe, kein fortlaufender Live-Mitschnitt.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 zeigt vorbereitete, bereits laufende Sessions; L009 ist ihre konkrete Überprüfung. B02 ist Displayfilter, niemals Capturefilter. B03 baut Original/Re-Transmission und AFTER-Vergleich über die ganze Verse-2-Strecke auf; AFTER-Fehlen ist erst nach L032 als lokalisierender Vergleich markiert. B04 bleibt ohne Secrets. B05 zeigt +18 als abgeschlossenes Vorher-Messfenster; gemeinsam mit null Capture-Drops wird es erst 137.30 s zum Befund. B06 startet mit Laständerung 139.80 s, zeigt neuen Tuple ab 142.72 s und neue Messwerte/HTTP 200 erst 157.26 s. B07 STOPPED erst 168.22 s; nachher nur gespeicherte Wiedergabe.

CLI-Ausgaben und PCAP-Zeilen sind gekürzte, simulierte Ausschnitte; die GUI hält Packet List, Packet Details und Packet Bytes gleichzeitig in ihren üblichen Bereichen. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 24.9600–60.0000 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 12 Zeilen. |
| B02 | 70.3400–89.3200 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B03 | 105.9400–124.6800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 9 Zeilen. |
| B04 | 124.6800–133.5200 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |
| B05 | 137.3000–151.6600 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |
| B06 | 139.8000–168.2200 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |
| B07 | 168.2200–189.8000 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |

### B01 · 24.9600–60.0000 s

```text
SW-A# show monitor session 1
Type              : Local Session
Source Ports      : RX Only: Gi1/0/7,Gi1/0/8,Gi1/0/48
Destination Ports : Gi1/0/24

Vorhandene Konfiguration SW-A:
monitor session 1 source interface Gi1/0/7 - 8 rx
monitor session 1 source interface Gi1/0/48 rx
monitor session 1 destination interface Gi1/0/24

Vorhandene Konfiguration SW-B:
monitor session 1 source interface Gi1/0/48 rx
monitor session 1 source interface Gi1/0/7 rx
monitor session 1 destination interface Gi1/0/24
```

### B02 · 70.3400–89.3200 s

```text
Display filter:
ip.addr == 192.0.2.10 && ip.addr == 198.51.100.20 && tcp.port == 443
Danach im BEFORE-PCAP:
tcp.stream == 7
Status: Packets 8400 | Displayed 92 | Dropped 0
```

### B03 · 105.9400–124.6800 s

```text
Simulierte PCAP-Zeilen; relative TCP-Sequenznummern
BEFORE (Stream 7):
No.  Time      Source       Destination    Protocol  Info
101  12.0010   192.0.2.10  198.51.100.20  TCP       51000 -> 443 Seq=12001 Len=1200
102  12.2510   192.0.2.10  198.51.100.20  TCP       [TCP Retransmission] Seq=12001 Len=1200
AFTER (Stream 3):
 87  12.2521   192.0.2.10  198.51.100.20  TCP       51000 -> 443 Seq=12001 Len=1200
Overlay: erster Bytebereich BEFORE vorhanden / AFTER fehlt
Capturezeit ist Messzeit, nicht Filmzeit
```

### B04 · 124.6800–133.5200 s

```text
Transmission Control Protocol
 Src Port: 51000    Dst Port: 443
 Sequence Number: 12001 (relative)
 TCP Segment Len: 1200
Transport Layer Security
 Application Data
TLS secrets: nicht vorhanden | Payload verschlüsselt
```

### B05 · 137.3000–151.6600 s

```text
SW-A# show interfaces GigabitEthernet1/0/48
GigabitEthernet1/0/48 is up, line protocol is up
  Full-duplex, 100Mb/s
  Total output drops: 3818
Overlay Messfenster: 3800 -> 3818 (Delta +18)
BEFORE Capture-Drops: 0    AFTER Capture-Drops: 0
Mirror-Ports: 1 Gbit/s; gespiegelte Last unter Kapazität
Befund: Verlust am SW-A-Uplink-Ausgang unter Konkurrenzlast
```

### B06 · 139.8000–168.2200 s

```text
Kontrollierter Versuch: Bulk-Quelle 95 -> 20 Mbit/s
Uplink unverändert: 100 Mbit/s
client$ curl --connect-timeout 3 --max-time 5 --resolve app.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app.example/health
{"status":"ok"}
HTTP 200
Neuer Tuple: 192.0.2.10:51001 -> 198.51.100.20:443
Messfenster: Testsegmente BEFORE+AFTER | Output-Drop-Delta 0
HTTP 200: lokales Clientergebnis, kein TLS-Klartext im Capture
```

### B07 · 168.2200–189.8000 s

```text
Capture: STOPPED
before.pcapng | after.pcapng | counters-before-after.txt
report.txt: Uplink-Output-Verlust unter konkurrierender Last
Kontrollversuch mit reduzierter Konkurrenz: erfolgreich
TLS-Payload weiterhin verschlüsselt
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 5.8900 | RACK | Vom Rack bis zum 100-Mbit/s-Uplink fahren; Bulk und Client teilen diesen Ausgang. | Langsame 35-mm-Seitenfahrt an Ports und Kabeln. | Kabel führt optisch in die Datenfabric. | Instrumental; E001 |
| S002 | 5.8900 | 11.7800 | SPAN | Die vorbereiteten Mirror-Abzweigungen zeigen; Originale laufen weiter ins Netz. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | Instrumental |
| S003 | 11.7800 | 13.2200 | ZIEL | Vergleichspfad erhält Antwort, Standort und Ziel sind eindeutig beschriftet. | Tiefe Fahrt zum Diensttor und zurück mit der Antwort. | Antwortmarker führt zum Client-Testdisplay. | L001 · Intro · 11.7800–13.1400 s · ««Bei mir geht's.»»; E002 |
| S004 | 13.2200 | 17.4400 | ZIEL | Betroffener Client wartet vor dem belasteten SW-A-Uplink; es ist ein anderer Pfad. | Tiefe Fahrt zum Diensttor und zurück mit der Antwort. | Antwortmarker führt zum Client-Testdisplay. | L002 · Intro · 13.2200–17.4400 s · ««Bei mir nicht.»» |
| S005 | 17.4400 | 24.9600 | SPAN | M-B101 auf der Capture-Leitung bis zur Analyzer-NIC verfolgen; die gestrichelte Kontur wird zur Auswahlmarkierung in Wireshark. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | Instrumental; E003; E004 |
| S006 | 24.9600 | 26.5400 | LISTE | Bereits vorbereitete Capture-Sessions füllen BEFORE und AFTER; Aufnahmestatus läuft. B01. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L003 · Intro · 24.9600–26.5400 s · «Capture läuft.» · **PRÜFEN** |
| S007 | 26.5400 | 33.2200 | SPAN | Eine gestrichelte Kopie verlässt die Datenfabric in Richtung Analyzer. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | L004 · Intro · 26.5400–31.0000 s · «Zeig mir die Spur.» · **PRÜFEN** |
| S008 | 33.2200 | 36.1400 | ZIEL | Client-Testoberfläche wartet auf die HTTPS-Antwort, der Spinner bleibt eine Folge. | Tiefe Fahrt zum Diensttor und zurück mit der Antwort. | Antwortmarker führt zum Client-Testdisplay. | L005 · Verse 1 · 33.2200–36.1400 s · «Der Browser dreht im Kreis,»; E005; E006; E007 |
| S009 | 36.1400 | 41.7400 | ZIEL | Serverseitige Bereitschaft steht grün, der Weg zum Client bleibt trotzdem gestört. | Tiefe Fahrt zum Diensttor und zurück mit der Antwort. | Antwortmarker führt zum Client-Testdisplay. | L006 · Verse 1 · 36.1400–40.1400 s · «der Server sei bereit.» · **PRÜFEN**; E008 |
| S010 | 41.7400 | 44.5000 | LISTE | Drei Hypothesen stehen als unbestätigte Notizen neben der Spur, ohne rote Schuldmarkierung. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L007 · Verse 1 · 41.7400–44.5000 s · «Im Chat hat jeder eine These,» |
| S011 | 44.5000 | 50.6400 | VERGLEICH | Die leere AFTER-Zelle passt nicht zur blossen Behauptung «Server down». | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L008 · Verse 1 · 44.5000–48.9600 s · «doch keine passt zum Bild.» · **PRÜFEN**; E009 |
| S012 | 50.6400 | 53.7600 | SPAN | monitor session auf SW-A wird gezeigt; Original und Mirror-Kopie verlassen unterschiedliche Ausgänge. B01. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | L009 · Verse 1 · 50.6400–53.7600 s · «Ich spiegle den betroffenen Port,» |
| S013 | 53.7600 | 60.0000 | LISTE | Kopie M-B101 wird zur konkreten Zeile des BEFORE-PCAPs, die drei Wireshark-Bereiche bleiben sichtbar. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L010 · Verse 1 · 53.7600–57.7400 s · «der Mitschnitt füllt den Screen.»; E010 |
| S014 | 60.0000 | 62.7200 | LISTE | Unbeteiligte IP-Paare ziehen durch die Liste, der richtige Tuple ist noch nicht allein. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L011 · Verse 1 · 60.0000–62.7200 s · «Zwischen all den fremden Flows» |
| S015 | 62.7200 | 70.3400 | DETAIL | .10:51000→.20:443 wird in einer ausgewählten Zeile freigestellt. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L012 · Verse 1 · 62.7200–66.7000 s · «muss unser Fehler liegen.» |
| S016 | 70.3400 | 73.4600 | LISTE | Displayfilter enthält genau Client- und Zieladresse, beide Richtungen bleiben möglich. B02. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L013 · Pre-Chorus · 70.3400–73.4600 s · «Source und Destination.»; E011; E012; E013 |
| S017 | 73.4600 | 78.0400 | LISTE | tcp.stream == 7 isoliert im BEFORE-PCAP den passenden Tuple. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L014 · Pre-Chorus · 73.4600–75.5200 s · «Den richtigen Stream.» · **PRÜFEN** |
| S018 | 78.0400 | 81.0200 | LISTE | Fremde Zeilen verschwinden nur aus der Ansicht; Gesamtzahl im Status bleibt gleich. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L015 · Pre-Chorus · 78.0400–81.0200 s · «Ich blende fremde Frames aus,» · **PRÜFEN**; E014 |
| S019 | 81.0200 | 84.7400 | LISTE | Der gespeicherte Mitschnitt enthält weiterhin alle Frames, angezeigte Zahl ist kleiner. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L016 · Pre-Chorus · 81.0200–84.7400 s · «die Spur bleibt im Mitschnitt drin.»; E015 |
| S020 | 84.7400 | 89.3200 | DETAIL | Den ausgewählten Header langsam vom Ethernetrahmen zum TCP-Bytebereich aufklappen. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | Instrumental; E016 |
| S021 | 89.3200 | 90.1800 | LISTE | WIRESHARK markiert den Eintritt in die ausgewählte TCP-Spur. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L017 · Chorus · 89.3200–90.1800 s · «Wireshark.» · **PRÜFEN**; E017 |
| S022 | 90.1800 | 92.5000 | DETAIL | Header und Zeitstempel werden in drei lesbare Schichten aufgeklappt. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L018 · Chorus · 90.1800–92.5000 s · «Zeig mir, was passiert.»; E018 |
| S023 | 92.5000 | 94.8600 | LISTE | Seq=10801, dann 12001, dann 13201 werden nacheinander ausgewählt, nicht schnell weggeschnitten. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L019 · Chorus · 92.5000–94.8600 s · «Paket für Paket,» |
| S024 | 94.8600 | 97.1600 | QUEUE | Die Kamera fährt von Seq=12001 zur noch unbewiesenen Verluststelle an SW-As Ausgang. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | L020 · Chorus · 94.8600–96.9200 s · «bis die Spur zum Fehler führt.» |
| S025 | 97.1600 | 98.8600 | LISTE | Zweiter Hook hält die Vorher-Spur ohne vorzeitiges Urteil offen. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L021 · Chorus · 97.1600–98.8600 s · «Wireshark.» · **PRÜFEN** |
| S026 | 98.8600 | 101.4400 | VERGLEICH | Hypothesen treten hinter den vorhandenen Messdaten zurück. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L022 · Chorus · 98.8600–101.4400 s · «Keine These hält mich auf.» |
| S027 | 101.4400 | 103.6600 | DETAIL | Der ausgewählte TCP-Bytebereich wird zum räumlichen Leitobjekt. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L023 · Chorus · 101.4400–103.4800 s · «Ich folge diesem Stream,» |
| S028 | 103.6600 | 105.9400 | VERGLEICH | Zweiter Capture-Punkt und Counter werden als nächster Prüfauftrag vorbereitet. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L024 · Chorus · 103.6600–105.8400 s · «dann prüfe ich den nächsten Schritt.»; E019 |
| S029 | 105.9400 | 108.7800 | SPAN | O-101 passiert den Clientport und wird gespiegelt; am Uplink verliert sich sein Original. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | L025 · Verse 2 · 105.9400–108.7800 s · «Der Request geht raus, dann Stille,» · **PRÜFEN**; E020; E021 |
| S030 | 108.7800 | 110.9600 | LISTE | O-102 erscheint später mit gleichem Seq/Len, eigener Frame-ID und späterem Zeitpunkt. B03. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L026 · Verse 2 · 108.7800–110.9600 s · «ein Segment erscheint erneut.» |
| S031 | 110.9600 | 113.4000 | DETAIL | TCP Retransmission steht als Analysehinweis über dem Bytebereich, nicht als Ursachenetikett. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L027 · Verse 2 · 110.9600–113.3600 s · «Retransmission auf dem Bildschirm,» |
| S032 | 113.4000 | 115.3200 | QUEUE | Der Raum um die Queue bleibt noch als Hypothese schraffiert. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | L028 · Verse 2 · 113.4000–115.3200 s · «doch die Ursache ist noch weit.» |
| S033 | 115.3200 | 117.8400 | SPAN | BEFORE-Leitung kann den Ausgang hinter der Queue nicht beobachten; ihre Reichweite endet klar. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | L029 · Verse 2 · 115.3200–117.7600 s · «Was dieser Port nicht sehen kann,» |
| S034 | 117.8400 | 119.6200 | VERGLEICH | Eine einzelne leere AFTER-Zelle bleibt als Sichtgrenze bezeichnet, noch kein endgültiger Beweis. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L030 · Verse 2 · 117.8400–119.6200 s · «wird hier auch nicht zum Beweis.» |
| S035 | 119.6200 | 122.1400 | RACK | SW-Bs Uplink-Eingang und eigener Mirror-Port bilden den zweiten Aufnahmeweg. | Langsame 35-mm-Seitenfahrt an Ports und Kabeln. | Kabel führt optisch in die Datenfabric. | L031 · Verse 2 · 119.6200–122.1400 s · «Ein zweiter Capture auf der Strecke» |
| S036 | 122.1400 | 124.6800 | VERGLEICH | BEFORE Stream 7 und AFTER Stream 3 werden über Tuple/Seq/Len zusammengeführt. Beide Aufnahmeuhren sind im Szenario auf ±0.1 ms abgeglichen; die um 1.1 ms versetzte retransmittierte Probe passt dazu. B03. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L032 · Verse 2 · 122.1400–124.1600 s · «grenzt die Lücke für uns ein.»; E022 |
| S037 | 124.6800 | 126.7400 | DETAIL | Die TLS-Schicht bleibt als opaker Application-Data-Kern geschlossen. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L033 · Bridge · 124.6800–126.4800 s · «TLS hält seinen Inhalt zu,» · **PRÜFEN**; E023 |
| S038 | 126.7400 | 129.1000 | LISTE | Secrets-Feld bleibt leer; kein erfundener entschlüsselter Inhalt erscheint. B04. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L034 · Bridge · 126.7400–129.1000 s · «ohne passende Secrets bleibt er dicht.» |
| S039 | 129.1000 | 131.6000 | DETAIL | Source, Destination, TCP-Sequenz und TLS-Record-Typ sind sichtbar. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L035 · Bridge · 129.1000–131.6000 s · «Ich seh die sichtbaren Header,» |
| S040 | 131.6000 | 133.5200 | DETAIL | Der Inhalt bleibt schraffiert; die Kamera stoppt vor dem geschlossenen Kern. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L036 · Bridge · 131.6000–133.5200 s · «doch die Nachricht les ich nicht.» |
| S041 | 133.5200 | 135.7000 | LISTE | Ein RST eines getrennten Vergleichsstreams steht mit eigener Stream-ID im Randbereich. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L037 · Bridge · 133.5200–135.6600 s · «Ein Reset ist ein Hinweis,» |
| S042 | 135.7000 | 137.3000 | DETAIL | Das RST erhält die Beschriftung HINWEIS, ohne Pfeil zur Verlustursache. | Makrofahrt durch Ethernet/IP/TCP-Schichten; TLS bleibt geschlossen. | Headerfeld verbindet Rückschnitt zur Paketliste. | L038 · Bridge · 135.7000–137.3000 s · «kein Urteil über Schuld.» |
| S043 | 137.3000 | 139.8000 | VERGLEICH | Fehlender Bytebereich, 18 Output-Drops und null Capture-Drops ergeben gemeinsam den Befund. B05. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L039 · Bridge · 137.3000–139.7200 s · «Erst wenn die Spuren zusammenpassen,» |
| S044 | 139.8000 | 142.7200 | QUEUE | Bei 139.80 s senkt die kontrollierte Lastquelle ihr Angebot; der Ausgang bleibt 100 Mbit/s. B06. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | L040 · Bridge · 139.8000–141.4400 s · «hat die nächste Änderung Grund.»; E024 |
| S045 | 142.7200 | 143.3800 | SPAN | Neuer HTTPS-Test mit Port 51001 beginnt; Original und Kopie entstehen neu. | 24-mm-Fahrt mit dem Original, seitlicher Schwenk zur gestrichelten Kopie. | Kopie-ID bleibt beim Übergang zur Captureleitung sichtbar. | L041 · Final Chorus · 142.7200–143.3800 s · «Wireshark.» · **PRÜFEN**; E025 |
| S046 | 143.3800 | 145.7400 | QUEUE | Die gleiche Ausgangsqueue leitet den relevanten Testframe nun durch. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | L042 · Final Chorus · 143.3800–145.7400 s · «Zeig mir, was passiert.» |
| S047 | 145.7400 | 148.2800 | VERGLEICH | Neue Testsegmente stehen auf beiden Capture-Seiten mit übereinstimmendem Bytebereich. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L043 · Final Chorus · 145.7400–148.2800 s · «Paket für Paket,» |
| S048 | 148.2800 | 151.6600 | QUEUE | Output-Drop-Zuwachs bleibt im neuen Messfenster null; die Ursache ist eingegrenzt. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | L044 · Final Chorus · 148.2800–150.2800 s · «bis die Spur zum Fehler führt.»; E026 |
| S049 | 151.6600 | 152.3800 | LISTE | Final-Hook liegt auf der neuen vollständigen Spur, nicht auf der alten Verlustzeile. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L045 · Final Chorus · 151.6600–152.3600 s · «Wireshark.» · **PRÜFEN** |
| S050 | 152.3800 | 154.9400 | VERGLEICH | Gleiche Testparameter, reduzierte Konkurrenz und zwei passende Mitschnitte stehen nebeneinander. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L046 · Final Chorus · 152.3800–154.8800 s · «Jetzt passt der Test zur Spur.» |
| S051 | 154.9400 | 157.2600 | LISTE | Der neue AFTER-Mitschnitt enthält Testdaten und anschliessende Serverantwort. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L047 · Final Chorus · 154.9400–157.1800 s · «Der nächste Mitschnitt zeigt:» |
| S052 | 157.2600 | 159.1600 | ZIEL | Am Client trifft die bestätigte Antwort ein; HTTP 200 kommt vom Testclient, nicht aus entschlüsseltem PCAP. B06. | Tiefe Fahrt zum Diensttor und zurück mit der Antwort. | Antwortmarker führt zum Client-Testdisplay. | L048 · Final Chorus · 157.2600–159.1600 s · «Die Antwort kommt zurück.»; E027; E028 |
| S053 | 159.1600 | 168.2200 | VERGLEICH | Messfenster des neuen Tests halten: beidseitige Segmente, Capture-Drops 0, Output-Drop-Delta 0. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | Instrumental; E029; E030 |
| S054 | 168.2200 | 172.3800 | LISTE | Live-Capture wird an beiden Analyzer gestoppt, Aufnahmesymbol wechselt auf STOPPED. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L049 · Outro · 168.2200–170.2600 s · «Capture stoppen.» · **PRÜFEN**; E031 |
| S055 | 172.3800 | 173.5000 | LISTE | BEFORE und AFTER werden mit Testparametern und Counterfenstern gesichert. B07. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | L050 · Outro · 172.3800–173.4000 s · «Spur sichern.» · **PRÜFEN** |
| S056 | 173.5000 | 177.0400 | VERGLEICH | Bericht enthält den vorherigen Verlust und den kontrollierten Erfolg, nicht nur einen grünen Status. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | L051 · Outro · 173.5000–177.0400 s · «Nicht nur «geht wieder».» · **PRÜFEN**; E032 |
| S057 | 177.0400 | 182.4733 | LISTE | Gespeicherte Spur mit PCAPNG-Dateinamen und Befundbericht verbinden. | Orthogonaler Halt auf Filter und Paketliste, 50 mm; keine Verkippung. | Ausgewählte Zeile wird zum Protokollraum. | Instrumental; E033 |
| S058 | 182.4733 | 187.9067 | VERGLEICH | Vorher-/Nachher-Fenster auf derselben dokumentierten Lastvariable gegeneinander lesen. | Starre symmetrische Frontansicht BEFORE links, AFTER rechts. | Synchroner Schnitt auf denselben TCP-Bytebereich. | Instrumental; E034 |
| S059 | 187.9067 | 193.3400 | QUEUE | Ab 189.8 s nur Umfeld abdunkeln; das letzte gesungene «Warum» bei 193.34 s bleibt auf der lesbaren Ursache. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | Instrumental; E035 |
| S060 | 193.3400 | 195.0600 | QUEUE | Letztes Wort «Warum» verbindet den dokumentierten Verlust mit der überlasteten Ausgangsqueue; keine neue Diagnose. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Sequenzlabel führt zur dazugehörigen PCAP-Zeile. | L052 · Outro · 193.3400–195.0600 s · «Auch: Warum.»; E036; E037 |
| S061 | 195.0600 | 195.7335 | QUEUE | Den überprüften Endzustand halten und bis zum exakten Audioende zurückfahren. | Seitlicher 32-mm-Dolly an SW-As Ausgangsqueue. | Endbild bis 195.7335 s; dann Schwarz mit Dateiende. | Instrumental; E038; E039; E040 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L017 | WIRESHARK · kräftiger Eintritt, ruhiger Halt | 89.3200 | 90.1800 | 0.8600 | 89.3610 | WIRESHARK markiert den Eintritt in die ausgewählte TCP-Spur. |
| L021 | WIRESHARK · kräftiger Eintritt, ruhiger Halt | 97.1600 | 98.8600 | 1.7000 | 97.4110 | Zweiter Hook hält die Vorher-Spur ohne vorzeitiges Urteil offen. |
| L041 | WIRESHARK · kräftiger Eintritt, ruhiger Halt | 142.7200 | 143.3800 | 0.6600 | 143.0010 | Neuer HTTPS-Test mit Port 51001 beginnt; Original und Kopie entstehen neu. |
| L045 | WIRESHARK · kräftiger Eintritt, ruhiger Halt | 151.6600 | 152.3600 | 0.7000 | 151.7210 | Final-Hook liegt auf der neuen vollständigen Spur, nicht auf der alten Verlustzeile. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / RACK | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Vom Rack bis zum 100-Mbit/s-Uplink fahren; Bulk und Client teilen diesen Ausgang. |
| E002 | 11.7800 | section_boundary / ±0.35 | S003 / ZIEL | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Vergleichspfad erhält Antwort, Standort und Ziel sind eindeutig beschriftet. |
| E003 | 17.9000 | energy_rise / ±0.5 | S005 / SPAN | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: M-B101 auf der Capture-Leitung bis zur Analyzer-NIC verfolgen; die gestrichelte Kontur wird zur Auswahlmarkierung in Wireshark. |
| E004 | 24.0810 | transient / ±0.04 | S005 / SPAN | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: M-B101 auf der Capture-Leitung bis zur Analyzer-NIC verfolgen; die gestrichelte Kontur wird zur Auswahlmarkierung in Wireshark. |
| E005 | 33.2200 | section_boundary / ±0.35 | S008 / ZIEL | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Client-Testoberfläche wartet auf die HTTPS-Antwort, der Spinner bleibt eine Folge. |
| E006 | 34.0810 | transient / ±0.04 | S008 / ZIEL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Client-Testoberfläche wartet auf die HTTPS-Antwort, der Spinner bleibt eine Folge. |
| E007 | 35.7000 | energy_rise / ±0.5 | S008 / ZIEL | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Client-Testoberfläche wartet auf die HTTPS-Antwort, der Spinner bleibt eine Folge. |
| E008 | 40.7510 | transient / ±0.04 | S009 / ZIEL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Serverseitige Bereitschaft steht grün, der Weg zum Client bleibt trotzdem gestört. |
| E009 | 49.6410 | transient / ±0.04 | S011 / VERGLEICH | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die leere AFTER-Zelle passt nicht zur blossen Behauptung «Server down». |
| E010 | 59.6410 | transient / ±0.04 | S013 / LISTE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Kopie M-B101 wird zur konkreten Zeile des BEFORE-PCAPs, die drei Wireshark-Bereiche bleiben sichtbar. |
| E011 | 70.3400 | section_boundary / ±0.35 | S016 / LISTE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Displayfilter enthält genau Client- und Zieladresse, beide Richtungen bleiben möglich. B02. |
| E012 | 70.9000 | energy_fall / ±0.5 | S016 / LISTE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Displayfilter enthält genau Client- und Zieladresse, beide Richtungen bleiben möglich. B02. |
| E013 | 71.8610 | transient / ±0.04 | S016 / LISTE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Displayfilter enthält genau Client- und Zieladresse, beide Richtungen bleiben möglich. B02. |
| E014 | 79.8000 | energy_fall / ±0.5 | S018 / LISTE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Fremde Zeilen verschwinden nur aus der Ansicht; Gesamtzahl im Status bleibt gleich. |
| E015 | 82.9710 | transient / ±0.04 | S019 / LISTE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der gespeicherte Mitschnitt enthält weiterhin alle Frames, angezeigte Zahl ist kleiner. |
| E016 | 87.9000 | energy_rise / ±0.5 | S020 / DETAIL | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Den ausgewählten Header langsam vom Ethernetrahmen zum TCP-Bytebereich aufklappen. |
| E017 | 89.3200 | section_boundary / ±0.35 | S021 / LISTE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: WIRESHARK markiert den Eintritt in die ausgewählte TCP-Spur. |
| E018 | 90.7510 | transient / ±0.04 | S022 / DETAIL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Header und Zeitstempel werden in drei lesbare Schichten aufgeklappt. |
| E019 | 104.7000 | energy_fall / ±0.5 | S028 / VERGLEICH | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Zweiter Capture-Punkt und Counter werden als nächster Prüfauftrag vorbereitet. |
| E020 | 105.9400 | section_boundary / ±0.35 | S029 / SPAN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: O-101 passiert den Clientport und wird gespiegelt; am Uplink verliert sich sein Original. |
| E021 | 106.1000 | level_gap / ±0.1 | S029 / SPAN | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: O-101 passiert den Clientport und wird gespiegelt; am Uplink verliert sich sein Original. |
| E022 | 124.1000 | energy_fall / ±0.5 | S036 / VERGLEICH | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: BEFORE Stream 7 und AFTER Stream 3 werden über Tuple/Seq/Len zusammengeführt. Beide Aufnahmeuhren sind im Szenario auf ±0.1 ms abgeglichen; die um 1.1 ms versetzte retransmittierte Probe passt dazu. B03. |
| E023 | 124.6800 | section_boundary / ±0.35 | S037 / DETAIL | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Die TLS-Schicht bleibt als opaker Application-Data-Kern geschlossen. |
| E024 | 142.3000 | energy_fall / ±0.5 | S044 / QUEUE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bei 139.80 s senkt die kontrollierte Lastquelle ihr Angebot; der Ausgang bleibt 100 Mbit/s. B06. |
| E025 | 142.7200 | section_boundary / ±0.35 | S045 / SPAN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Neuer HTTPS-Test mit Port 51001 beginnt; Original und Kopie entstehen neu. |
| E026 | 148.5210 | transient / ±0.04 | S048 / QUEUE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Output-Drop-Zuwachs bleibt im neuen Messfenster null; die Ursache ist eingegrenzt. |
| E027 | 157.4110 | transient / ±0.04 | S052 / ZIEL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Am Client trifft die bestätigte Antwort ein; HTTP 200 kommt vom Testclient, nicht aus entschlüsseltem PCAP. B06. |
| E028 | 158.0000 | energy_fall / ±0.5 | S052 / ZIEL | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Am Client trifft die bestätigte Antwort ein; HTTP 200 kommt vom Testclient, nicht aus entschlüsseltem PCAP. B06. |
| E029 | 159.1600 | section_boundary / ±0.35 | S053 / VERGLEICH | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Messfenster des neuen Tests halten: beidseitige Segmente, Capture-Drops 0, Output-Drop-Delta 0. |
| E030 | 164.0810 | transient / ±0.04 | S053 / VERGLEICH | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Messfenster des neuen Tests halten: beidseitige Segmente, Capture-Drops 0, Output-Drop-Delta 0. |
| E031 | 168.2200 | section_boundary / ±0.35 | S054 / LISTE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Live-Capture wird an beiden Analyzer gestoppt, Aufnahmesymbol wechselt auf STOPPED. |
| E032 | 176.5510 | transient / ±0.04 | S056 / VERGLEICH | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bericht enthält den vorherigen Verlust und den kontrollierten Erfolg, nicht nur einen grünen Status. |
| E033 | 177.3000 | energy_rise / ±0.5 | S057 / LISTE | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Gespeicherte Spur mit PCAPNG-Dateinamen und Befundbericht verbinden. |
| E034 | 185.1910 | transient / ±0.04 | S058 / VERGLEICH | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Vorher-/Nachher-Fenster auf derselben dokumentierten Lastvariable gegeneinander lesen. |
| E035 | 189.8000 | fade_candidate / ±0.3 | S059 / QUEUE | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: Ab 189.8 s nur Umfeld abdunkeln; das letzte gesungene «Warum» bei 193.34 s bleibt auf der lesbaren Ursache. |
| E036 | 194.0710 | transient / ±0.04 | S060 / QUEUE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Letztes Wort «Warum» verbindet den dokumentierten Verlust mit der überlasteten Ausgangsqueue; keine neue Diagnose. |
| E037 | 194.3000 | energy_fall / ±0.5 | S060 / QUEUE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Letztes Wort «Warum» verbindet den dokumentierten Verlust mit der überlasteten Ausgangsqueue; keine neue Diagnose. |
| E038 | 195.0600 | section_boundary / ±0.35 | S061 / QUEUE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Den überprüften Endzustand halten und bis zum exakten Audioende zurückfahren. |
| E039 | 195.0600 | last_vocal_end / ±0.5 | S061 / QUEUE | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Den überprüften Endzustand halten und bis zum exakten Audioende zurückfahren. |
| E040 | 195.7330 | end / ±2.0833333333333333e-05 | S061 / QUEUE | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Den überprüften Endzustand halten und bis zum exakten Audioende zurückfahren. |

## Referenz und Übergabeprüfung

[Cisco: SPAN/RSPAN](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-2/configuration_guide/nmgmt/b_172_nmgmt_9300_cg/configuring_span_and_rspan.html) belegt Spiegelung und mögliche Mirror-Verluste. [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html/) ist die Referenz für Liste, Details, Filter und Streamansichten. Messwerte, PCAP-Zeilen und Uplink-Konflikt sind simuliert.

Geprüft: 61 lückenlose Einstellungen von 0 bis 195.7335 s; alle 52 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 40 Events genau einmal zugeordnet; 4 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L003, L004, L006, L008, L014, L015, L017, L021, L025, L033, L041, L045, L049, L050, L051.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
