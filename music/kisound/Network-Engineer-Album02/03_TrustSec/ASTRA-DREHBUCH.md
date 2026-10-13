# 03 · TrustSec — Die Identitätsfabrik

Drehbuchfassung: 2026-10-04. Historische kreative Vorlage aus der Kandidatenphase;
ihre Audio- und Analyseprüfsummen beziehen sich nicht auf die spätere finale WAV.
Für eine neue Umsetzung gilt die [finale Release-Auswahl](03_TrustSec_1.0.txt).

## Verbindliche Quellen und Zeitbasis

- Historischer Audio-Kandidat `03_TrustSec_0.1.mp3` (hier nicht mehr vorhanden) · SHA-256 `23dd181e6a22394abc0ad05a8d23a7e41bde3b9e18a7b2dfabd4dd77b1bab04d`.
- Transkript: [03_TrustSec_Transkript.json](03_TrustSec_Transkript.json) · SHA-256 `d4f4fd7c1d71245392e583dd6fa4afdd1bdc18bce12908c9af45cba8eeb2612f`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/03_TrustSec/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `24623967f76f7a78467f8f7eb841f39c7079eafd7d1425a58055b3ec1f34e6b9`.
- Exaktes Ende: **288.0000 s**, 13824000 Samples/Kanal bei 48000 Hz; Timecode 00:04:48.000 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 138.0 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Die Fabrik beginnt an winzigen Anschlussstationen auf einer fast endlosen Wand. Dahinter liegt ein Authentifizierungszentrum aus klaren, voneinander getrennten Prüfkammern. Zertifikat, Geräteprofil und Rollenentscheidung sind transparente Dokumentflächen; sie bleiben getrennt von den Datenpaketen. Die ISE-Kammer liegt seitlich am Kontrollpfad, nicht als Pflichtdurchgang jedes Nutzdatenframes.

Eine Klassifizierungsmaschine legt einem Frame einen schmalen SGT-Rahmen an. Der Rahmen begleitet den Verkehr durch eine gewaltige Fabric, deren Röhren sich über mehrere Stockwerke verzweigen. Violett bedeutet Employees/10, Cyan Servers/20, Amber Printers/30, Türkis Phones/40, mattes Grau Unknown/0. Zielgruppen bilden eigene Hallen. Ein vertrauenswürdiger Frame ist kein Generalschlüssel: vor jeder vorgesehenen Zielhalle liegt eine Enforcement-Kammer, die Quellgruppe und Zielgruppe zusammenführt.

Die Policy-Matrix ist ein begehbarer Raum aus waagrechten Quellreihen und senkrechten Zielspalten. Nur die ausgewählte Zelle leuchtet. Grünes Durchlasslicht und rote Sperrkanten tragen zusätzlich die Wörter PERMIT und DENY; Farbe allein erklärt nichts. Dünne IP-Beschriftungen können wechseln, die markierte Clientidentität C-17 und ihre bestätigte Gruppenzuordnung bleiben nachvollziehbar. Die Kamera benutzt rechtwinklige, präzise Fabrikfahrten, verknüpft den seitlichen Kontrollpfad mit der tiefen Datenachse und endet in einer Totalen aller funktionierenden Grenzen.

## Fachszenario

ISE prüft C-17 mittels 802.1X/EAP-TLS am Access-Switch ACCESS-1, Gi1/0/7. Die erfolgreiche Autorisierung weist Employees, SGT 10 zu. Der Client verwendet zunächst 192.0.2.10; nach kontrolliertem Wiederanschluss erhält er 192.0.2.110 und wird erneut autorisiert. Identität und Policy bleiben gleich, alte IP-SGT-Bindung wird entfernt. Kein SGT wird ungeprüft aus dem Client übernommen.

Inline-Tagging ist auf den vertrauenswürdigen Fabric-Links eingerichtet. EGRESS-1 bestimmt die Zielgruppe Servers/20 für 198.51.100.20; dort wird die SGACL angewendet und der Tag vor dem nicht teilnehmenden Server entfernt. Matrix: 10→20 erlaubt TCP dst 443 und verweigert den Rest; 10→30 erlaubt TCP dst 631; 40→20 erlaubt den festgelegten SIP-Dienst UDP dst 5060; 30→20 und 0→20 verweigern IP. Ein authentifizierter Employee-Test zu TCP/22 wird daher ebenfalls verworfen.

Ab 146.52 s erscheint U-09, ein unbekannter Endpoint. In diesem Szenario gelangt er über eine ausdrücklich konfigurierte Restricted-/Guest-Zulassung nur in den Unknown-Kontext SGT 0; er wird nicht erfolgreich als Employee authentifiziert. Die Authentication-Kommunikation bleibt möglich, die Anwendungswege unterliegen der festen DENY-Zelle 0→20. Der Film zeigt zunächst fehlende Autorisierung, dann Klassifizierung als Unknown, dann tatsächliche Verwerfung am Enforcement. Ab 187.93 s wird C-17 erneut verfolgt: bekannte Identität, erlaubtes HTTPS und gesperrtes SSH. Der Schluss bestätigt beide Grenzen und den erlaubten Dienst, ohne die Unknown-Policy zu ändern.

## Kontinuität

C-17 bleibt dasselbe Endgerät, nicht derselbe Frame. T-01 ist sein HTTPS-Frame mit SGT 10 im Fabric; am Server ist der SGT entfernt. T-02 ist ein neuer, späterer HTTPS-Frame von .110. U-01 hat SGT 0 und wird endgültig verworfen. Der erlaubte Drucker-Flow, der Phone-Flow und gesperrtes SSH erhalten eigene IDs.
ISE prüft Identität und liefert Autorisierung; ACCESS-1 klassifiziert; EGRESS-1 erzwingt. Ein Policy-Matrix-Bild ist eine Erklärung, kein erneuter ISE-Request pro Paket. Die gesungene Formulierung «an jedem Ort» wird als verteilte, dafür konfigurierte Enforcement-Punkte inszeniert, nicht als beliebiger Hop-Mechanismus.
L021 «Attack the flow» und L039 «Detect the flow» bleiben als Wortlautkonflikt markiert. Es wird daraus weder Angriff noch Angriffserkennung erfunden. L080–L083 enthalten widersprüchliche Schlusswörter zu Unknown: «Access defined» benennt hier die festgelegte DENY-Policy, keine Freigabe. Keine dieser Stellen erzeugt einen Policy-Wechsel. Die historische Umsetzung unter 02-trustsec bleibt eine andere Fassung; ihre Regel «nur Systemmeldungen im Bild» gilt nicht für diese neue Vorlage.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 baut das ISE-Ergebnis stufenweise auf: Connected 8.01 s, Prüfung 15.40 s, Passed 22.48 s, Employees/10 erst 27.30 s. B02 zeigt die neue aktive Bindung nach Wiederanschluss 55.17 s; die alte Bindung bleibt nur in einem datierten Verlauf. B03 ist die vorhandene Policy, B04 liest sie für den aktuellen Flow und gibt erst bei 121.71 s PERMIT aus. B05 zeigt U-09s fehlende Authentifizierung, danach Restricted/Unknown; DENY-Resultat erst bei 165.57 s. B06 bestätigt die zwei verschiedenen Zugriffe derselben bekannten Identität. L083 erzeugt keinerlei neue Bildschirmfreigabe.

IOS-XE-Ausgaben sind gekürzte, simulierte Ausschnitte. Unknown ist im Header/Overlay SGT 0; im dargestellten permissions-Befehl steht das CLI-Schlüsselwort unknown. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 8.0100–41.2100 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B02 | 55.1700–62.2600 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B03 | 83.8600–112.8900 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 10 Zeilen. |
| B04 | 112.8900–132.2000 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B05 | 146.5200–172.1000 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 9 Zeilen. |
| B06 | 197.8900–209.4900 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |

### B01 · 8.0100–41.2100 s

```text
ISE | Live Logs (Szenarioansicht)
Endpoint: C-17    Access device: ACCESS-1
Port: Gi1/0/7     Method: EAP-TLS
Authentication: Passed
Authorization profile: Employees
Security Group: Employees (10)
```

### B02 · 55.1700–62.2600 s

```text
ACCESS-1# show cts role-based sgt-map all
Active IPv4-SGT Bindings Information
IP Address       SGT
192.0.2.110      10
198.51.100.20    20
Overlay: C-17 neu autorisiert | alte Bindung 192.0.2.10 entfernt
```

### B03 · 83.8600–112.8900 s

```text
Policy-Matrix (Szenarioansicht)
Source          Destination       SGACL
Employees 10    Servers 20        HTTPS_ONLY
Employees 10    Printers 30       IPP_ONLY
Phones 40       Servers 20        SIP_ONLY
Printers 30     Servers 20        DENY_ALL
Unknown 0       Servers 20        DENY_ALL

HTTPS_ONLY:
 permit tcp dst eq 443
 deny ip
```

### B04 · 112.8900–132.2000 s

```text
EGRESS-1# show cts role-based permissions from 10 to 20
IPv4 Role-based permissions from group 10:Employees to group 20:Servers:
 HTTPS_ONLY
Overlay: Source SGT 10 | Destination SGT 20
Match: TCP dst 443 | PERMIT | Inline-SGT am Egress entfernt
```

### B05 · 146.5200–172.1000 s

```text
ISE | U-09 | Authentication: Failed
Restricted/Guest profile: Unknown (0)
Anwendungsregel: Source 0 -> Destination 20 = DENY_ALL
EGRESS-1# show cts role-based permissions from unknown to 20
IPv4 Role-based permissions from group 0:Unknown to group 20:Servers:
 DENY_ALL
DENY_ALL:
 deny ip
Overlay: U-01 verworfen | APP-20 erhält U-01 nicht
```

### B06 · 197.8900–209.4900 s

```text
C-17 | Employees 10 -> Servers 20
TCP dst 443: PERMIT | Dienst antwortet
TCP dst 22:  DENY   | gleiche bekannte Identität
U-09 | Unknown 0 -> Servers 20: DENY
Policy unverändert
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 3.6700 | FABRIC | Anlage und Ausgangszustand öffnen; Kontroll- und Datenräume räumlich miteinander verbinden. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | Instrumental; E001; E002; E003 |
| S002 | 3.6700 | 8.0100 | FABRIC | Die Gesamtanlage erwacht, Anschlusswand und getrennte Kontrollkammer werden als Teile einer Fabrik sichtbar. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L001 · Intro – Systemmeldungen · 3.6700–5.8800 s · «Cisco TrustSec.»; E004; E005 |
| S003 | 8.0100 | 11.8500 | ACCESS | C-17 verbindet sich an Gi1/0/7; nur Linkstatus ist bestätigt. B01. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L002 · Intro – Systemmeldungen · 8.0100–9.6600 s · «Client connected.»; E006; E007 |
| S004 | 11.8500 | 15.4000 | ACCESS | Der Switch startet die Identitätsanfrage auf dem Kontrollpfad, Anwendungsweg bleibt geschlossen. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L003 · Intro – Systemmeldungen · 11.8500–13.2400 s · «Identity requested.»; E008 |
| S005 | 15.4000 | 17.9200 | ISE | EAP-TLS-Prüfung verarbeitet das Clientzertifikat; noch kein SGT-Rahmen am Datenframe. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L004 · Intro – Systemmeldungen · 15.4000–16.8000 s · «ISE is checking.»; E009 |
| S006 | 17.9200 | 22.4800 | ISE | Die Zertifikatidentität C-17 wird freigestellt; die Kamera wartet auf das Resultat. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L005 · Intro – Systemmeldungen · 17.9200–19.0000 s · «Who are you?» |
| S007 | 22.4800 | 27.3000 | ISE | Identität C-17 ist verifiziert; Autorisierungsprofil Employees wird erst danach ausgewählt. B01. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L006 · Intro – Systemmeldungen · 22.4800–24.5200 s · «Identity verified.» |
| S008 | 27.3000 | 28.6600 | TAG | ACCESS-1 weist SGT 10 zu; der Rahmen erscheint am neuen Frame T-01. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L007 · Intro – Systemmeldungen · 27.3000–28.6600 s · «SGT assigned.»; E010 |
| S009 | 28.6600 | 34.9350 | TAG | T-01s Rahmen durch die Klassifizierung verfolgen; Zertifikatskarte bleibt zurück im ISE-Raum. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | Instrumental; E011; E012 |
| S010 | 34.9350 | 41.2100 | FABRIC | Die Kamera folgt dem ersten erlaubten Frame durch mehrere Stockwerke bis vor EGRESS-1. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | Instrumental; E013 |
| S011 | 41.2100 | 45.1300 | ACCESS | Ein neuer Vorgang am selben Anschluss zeigt die Anfrage vom Switch und nicht vom Server. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L008 · Strophe 1 – Identität und Zugriff · 41.2100–44.6200 s · «Ein Client kommt, der Switch fragt an.»; E014; E015 |
| S012 | 45.1300 | 48.4600 | ISE | Die Anfrage erreicht das seitliche Authentifizierungszentrum; Datenpfad bleibt räumlich getrennt. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L009 · Strophe 1 – Identität und Zugriff · 45.1300–48.0600 s · «ISE prüft nach, wer das sein kann.» |
| S013 | 48.4600 | 51.7800 | ISE | Zertifikatidentität und Geräteprofil stehen als zwei geprüfte Eigenschaften nebeneinander. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L010 · Strophe 1 – Identität und Zugriff · 48.4600–51.4600 s · «Gerät erkannt, der Nutzer klar.» |
| S014 | 51.7800 | 55.1700 | EGRESS | Der ausgewählte HTTPS-Frame gelangt erst nach 10→20-PERMIT in die Serverhalle. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L011 · Strophe 1 – Identität und Zugriff · 51.7800–54.9400 s · «Die Rolle stimmt, der Zugriff da.»; E016 |
| S015 | 55.1700 | 58.6300 | ACCESS | C-17 trennt und verbindet sich neu; .10 weicht .110, erneute Autorisierung bleibt Employees/10. B02. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L012 · Strophe 1 – Identität und Zugriff · 55.1700–58.5400 s · «Die Adresse wechselt, der Kontext bleibt.» |
| S016 | 58.6300 | 62.2600 | TAG | T-02 trägt nun SGT 10 trotz neuer Quell-IP; die alte Bindung ist entfernt. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L013 · Strophe 1 – Identität und Zugriff · 58.6300–62.1600 s · «Der SGT zeigt, wer sich hier treibt.» |
| S017 | 62.2600 | 63.8100 | ISE | IDENTITY KNOWN steht über C-17s bestätigter Prüfkarte. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L014 · Pre-Hook – Rollenzuweisung · 62.2600–63.4800 s · «Identity known.»; E017 |
| S018 | 63.8100 | 65.6000 | ISE | ROLE DEFINED markiert Employees; andere Rollenfelder bleiben geschlossen. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L015 · Pre-Hook – Rollenzuweisung · 63.8100–65.2000 s · «Role defined.» |
| S019 | 65.6000 | 67.3100 | TAG | Ein neuer Frame erhält SGT 10, keine Tagänderung eines bereits laufenden Frames. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L016 · Pre-Hook – Rollenzuweisung · 65.6000–66.7800 s · «SGT assigned.» |
| S020 | 67.3100 | 69.5900 | MATRIX | ACCESS ALIGNED führt die Zelle 10→20 mit HTTPS zusammen, keine pauschale Freigabe. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L017 · Pre-Hook – Rollenzuweisung · 67.3100–68.6000 s · «Access aligned.» |
| S021 | 69.5900 | 71.5700 | FABRIC | TRUSTSEC folgt T-02 durch den violetten Fabric-Korridor. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L018 · Hook 1 · 69.5900–71.1200 s · «TrustSec.»; E018; E019 |
| S022 | 71.5700 | 73.6100 | ACCESS | C-17 ist an seiner Anschlussstation identifizierbar; die Adresse ist eine wechselbare Nebenbeschriftung. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L019 · Hook 1 · 71.5700–73.3000 s · «Know the client.»; E020 |
| S023 | 73.6100 | 74.8100 | TAG | TRUSTSEC legt den SGT-Rahmen gross um den sichtbaren Header. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L020 · Hook 1 · 73.6100–74.7200 s · «TrustSec.» |
| S024 | 74.8100 | 76.5200 | FABRIC | Unsichere «Attack/Detect»-Zeile: Kamera verfolgt nur den bestehenden erlaubten Flow, ohne Angriffshandlung. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L021 · Hook 1 · 74.8100–75.7800 s · «Attack the flow.» · **PRÜFEN** |
| S025 | 76.5200 | 80.5200 | ISE | Die bestätigte C-17-Karte liegt im Kontrollraum; kein ISE-Abstecher des Nutzdatenframes. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L022 · Hook 1 · 76.5200–80.1200 s · «ISE kennt dich, ISE weiß Bescheid.»; E021 |
| S026 | 80.5200 | 83.8600 | TAG | Employees/10 bleibt als feste Autorisierungsantwort sichtbar. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L023 · Hook 1 · 80.5200–83.4000 s · «Deine Rolle steht bereit.» |
| S027 | 83.8600 | 87.2300 | MATRIX | Quellgruppe 10 und Zielgruppe 20 kreuzen sich in HTTPS_ONLY. B03. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L024 · Hook 1 · 83.8600–87.2300 s · «Source und Ziel, die Policy zählt.» |
| S028 | 87.2300 | 90.8800 | EGRESS | Header wird gegen TCP dst 443 geprüft; die positive Entscheidung öffnet genau diesen Weg. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L025 · Hook 1 · 87.2300–90.4800 s · «TrustSec prüft, was wirklich gilt.»; E022 |
| S029 | 90.8800 | 94.3600 | ACCESS | Vier Anschlussstationen zeigen Client, Server, Phone und Printer als Geräte mit verschiedenen Rollen. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L026 · Strophe 2 – Gruppen und Policy · 90.8800–93.8600 s · «Client oder Server, Phone oder Print.»; E023; E024 |
| S030 | 94.3600 | 97.8200 | MATRIX | Verschiedene Zellen geben HTTPS, IPP und SIP frei, während Printer→Server dunkel gesperrt bleibt. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L027 · Strophe 2 – Gruppen und Policy · 94.3600–97.3000 s · «Jeder bekommt, was passend bestimmt.» |
| S031 | 97.8200 | 101.1200 | TAG | SGT 10 begleitet den Frame über einen vertrauenswürdigen Fabric-Link. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L028 · Strophe 2 – Gruppen und Policy · 97.8200–100.6800 s · «Der SGT geht mit dem Verkehr.» |
| S032 | 101.1200 | 105.1200 | MATRIX | Die kleine IP-Platte tritt zurück, Quell- und Zielgruppe bleiben grosse Entscheidungseingänge. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L029 · Strophe 2 – Gruppen und Policy · 101.1200–104.5200 s · «Die IP allein entscheidet nicht mehr.» |
| S033 | 105.1200 | 108.1700 | MATRIX | Source 10 liegt waagrecht, Destination 20 senkrecht; ihr Schnitt bleibt eindeutig. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L030 · Strophe 2 – Gruppen und Policy · 105.1200–107.8000 s · «Source Group hier, Destination dort.» |
| S034 | 108.1700 | 112.8900 | EGRESS | Zwei konfigurierte Enforcement-Hallen prüfen ihre jeweiligen Zielzugriffe, nicht jeder beliebige Hop. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L031 · Strophe 2 – Gruppen und Policy · 108.1700–111.3400 s · «Die Policy prüft an jedem Ort.»; E025 |
| S035 | 112.8900 | 115.4200 | TAG | T-02s Quell-SGT 10 wird aus dem Fabric-Kontext gelesen. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L032 · Systemmeldungen – Zugriff erlaubt · 112.8900–115.0200 s · «Source SGT detected.»; E026 |
| S036 | 115.4200 | 118.9100 | EGRESS | Zielgruppe Servers/20 wird für .20 bestimmt, unabhängig von der Quellgruppe. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L033 · Systemmeldungen – Zugriff erlaubt · 115.4200–118.3600 s · «Destination SGT detected.» |
| S037 | 118.9100 | 121.7100 | MATRIX | Die Zelle 10→20 lädt HTTPS_ONLY; TCP/443 passt, implizites Vertrauen allein reicht nicht. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L034 · Systemmeldungen – Zugriff erlaubt · 118.9100–121.2000 s · «SGT-ACL matched.»; E027; E028 |
| S038 | 121.7100 | 125.2400 | ZIEL | PERMIT: Tag wird am Egress entfernt, der unveränderte IP-Verkehr erreicht APP-20. B04. | Ruhiger 32-mm-Dolly durch die Diensthalle. | Antwortframe führt zurück in die Fabric. | L035 · Systemmeldungen – Zugriff erlaubt · 121.7100–124.2000 s · «Access permitted.» |
| S039 | 125.2400 | 126.9800 | FABRIC | Zweiter Hook folgt einer nun bestätigten Antwortspur vom Server zurück. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L036 · Hook 2 · 125.2400–126.7400 s · «TrustSec.»; E029 |
| S040 | 126.9800 | 129.2500 | ACCESS | Die Kamera zeigt C-17 zusammen mit seiner bereits verifizierten Rollenkarte. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L037 · Hook 2 · 126.9800–128.7800 s · «Know the client.» |
| S041 | 129.2500 | 130.4800 | TAG | TRUSTSEC liegt auf dem Gruppenrahmen eines neuen erlaubten Frames. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L038 · Hook 2 · 129.2500–130.1800 s · «TrustSec.» |
| S042 | 130.4800 | 132.2000 | EGRESS | Unsichere «Detect/Attack»-Zeile: der bekannte Header wird auf die vorhandene Policy geprüft, keine IDS-Funktion. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L039 · Hook 2 · 130.4800–131.4000 s · «Detect the flow.» · **PRÜFEN** |
| S043 | 132.2000 | 135.8100 | MATRIX | IP und Port sind konkrete Match-Eingänge, der SGT bleibt notwendiger Kontext. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L040 · Hook 2 · 132.2000–135.5400 s · «Nicht nur Adresse, nicht nur Port.» |
| S044 | 135.8100 | 139.4600 | FABRIC | Die Employees-Reihe führt zu ihren erlaubten Zielen, nicht in jede Halle. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L041 · Hook 2 · 135.8100–139.1000 s · «Deine Identität bestimmt den Ort.» |
| S045 | 139.4600 | 143.1200 | MATRIX | Wieder Quell- und Zielgruppe; die Zelle bleibt dieselbe, kein neuer Regelbeschluss. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L042 · Hook 2 · 139.4600–142.8800 s · «Source und Ziel, die Policy zählt.» |
| S046 | 143.1200 | 146.5200 | EGRESS | Ein HTTPS-Frame passiert, ein gleichzeitig erzeugter SSH-Frame derselben Identität stoppt am deny. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L043 · Hook 2 · 143.1200–146.2200 s · «Nur was erlaubt ist, wird weitergewählt.» |
| S047 | 146.5200 | 148.1900 | ACCESS | Ab 146.52 s erscheint U-09 am getrennten Anschluss; keine bestehende C-17-Rolle wird überschrieben. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L044 · Break – Unbekannte Identität · 146.5200–148.1400 s · «Unknown client.»; E030 |
| S048 | 148.1900 | 149.8300 | ISE | Ein neuer Authentifizierungsversuch für U-09 erhält keine erfolgreiche Identitätsbestätigung. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L045 · Break – Unbekannte Identität · 148.1900–149.6000 s · «ISE checks again.»; E031 |
| S049 | 149.8300 | 151.7100 | ISE | Fehlende gültige Identität bleibt als offener Befund stehen; kein Zertifikat wird erfunden. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L046 · Break – Unbekannte Identität · 149.8300–151.5400 s · «No identity.»; E032 |
| S050 | 151.7100 | 153.2300 | TAG | Der Restricted-Zugang ordnet U-09 dem Unknown-Kontext SGT 0 zu. B05. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L047 · Break – Unbekannte Identität · 151.7100–153.0600 s · «Unknown endpoint.»; E033 |
| S051 | 153.2300 | 154.6800 | ISE | Employees-Rollenfeld bleibt für U-09 leer. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L048 · Break – Unbekannte Identität · 153.2300–154.4600 s · «Keine Rolle.» |
| S052 | 154.6800 | 156.6900 | MATRIX | Für 0→20 besteht keine positive Zugriffsregel; die festgelegte Sperrzelle ist trotzdem vorhanden. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L049 · Break – Unbekannte Identität · 154.6800–156.3200 s · «Kein Match bereit.» |
| S053 | 156.6900 | 159.9800 | ACCESS | U-09 bleibt als unbekannter Endpoint im eingeschränkten Zugang sichtbar. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L050 · Break – Unbekannte Identität · 156.6900–159.8400 s · «Keine bekannte Identität.» |
| S054 | 159.9800 | 161.6400 | TAG | Sein grauer SGT-0-Rahmen trägt UNKNOWN, nicht «ungültiger SGT». | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L051 · Break – Unbekannte Identität · 159.9800–161.5400 s · «No trusted group.» |
| S055 | 161.6400 | 163.6600 | MATRIX | 0→20 zeigt DENY_ALL; eine fehlende bekannte Identität macht keine dynamische Freigabe. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L052 · Break – Unbekannte Identität · 161.6400–163.4800 s · «No access found.» |
| S056 | 163.6600 | 165.5700 | EGRESS | U-01 tritt in die SGACL-Prüfung und passt auf deny ip. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L053 · Break – Unbekannte Identität · 163.6600–165.4400 s · «SGT-ACL.» |
| S057 | 165.5700 | 167.5600 | EGRESS | U-01 wird endgültig verworfen; der Servereingang erhält keine Kopie. B05. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L054 · Break – Unbekannte Identität · 165.5700–167.5600 s · «Access denied.» |
| S058 | 167.5600 | 172.1000 | ACCESS | Den endgültig verworfenen U-01 als abgeschlossenen Eintrag am Quellanschluss zeigen; nur neue Kontrollanfragen bleiben möglich. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | Instrumental; E034 |
| S059 | 172.1000 | 174.1600 | ISE | Im Dialog steht nur U-09s Anfragekarte im seitlichen Prüfraum. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L055 · Dialog – Zugriff verweigert · 172.1000–173.9200 s · «Who are you?»; E035 |
| S060 | 174.1600 | 175.5100 | ISE | UNKNOWN bleibt als Ergebnis derselben Anfrage; kein neues Endgerät wird eingeführt. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L056 · Dialog – Zugriff verweigert · 174.1600–174.6400 s · «Unknown.» |
| S061 | 175.5100 | 177.7600 | MATRIX | Die Anfrage nach einer Rolle zeigt eine leere autorisierte Gruppe. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L057 · Dialog – Zugriff verweigert · 175.5100–177.3400 s · «What is your role?» |
| S062 | 177.7600 | 179.7400 | TAG | Die Antwort UNKNOWN gehört zum grauen Kontext SGT 0. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L058 · Dialog – Zugriff verweigert · 177.7600–178.1200 s · «Unknown.» |
| S063 | 179.7400 | 183.7000 | EGRESS | DENY wird aus der bestehenden 0→20-Zelle bestätigt, nicht erneut als Eingriff gesetzt. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L059 · Dialog – Zugriff verweigert · 179.7400–181.3400 s · «Access denied.» |
| S064 | 183.7000 | 187.9300 | ACCESS | U-09 bleibt vor dem Anwendungszugang; Authentication-Kontrollverkehr darf weiter zum Prüfzentrum. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L060 · Dialog – Zugriff verweigert · 183.7000–184.8800 s · «Stay outside.» |
| S065 | 187.9300 | 191.3800 | ACCESS | C-17 wird wieder ausgewählt, das vorher gesperrte U-09 bleibt am eigenen Anschluss. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L061 · Strophe 3 – Bekannter Client · 187.9300–191.3400 s · «Bekannter Client, bekannte Pflicht.»; E036 |
| S066 | 191.3800 | 194.9600 | ISE | Employees-Profil steht erneut auf der verifizierten C-17-Karte. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L062 · Strophe 3 – Bekannter Client · 191.3800–194.3000 s · «ISE kennt die Rolle, verwechselt sie nicht.» |
| S067 | 194.9600 | 197.8900 | TAG | Der neue C-17-Frame trägt SGT 10; graue Unknown-Frames ändern ihre Farbe nicht. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L063 · Strophe 3 – Bekannter Client · 194.9600–197.5000 s · «SGT gesetzt, die Gruppe steht.»; E037 |
| S068 | 197.8900 | 201.3600 | MATRIX | HTTPS zu Servers/20 ist erlaubt, SSH zur selben Halle bleibt DENY. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L064 · Strophe 3 – Bekannter Client · 197.8900–201.1800 s · «Die Policy sagt, wohin es geht.» |
| S069 | 201.3600 | 204.8800 | ACCESS | .110 steht klein unter C-17; Identität und Gruppe bleiben der räumliche Anker. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L065 · Strophe 3 – Bekannter Client · 201.3600–204.5400 s · «Nicht deine IP entscheidet allein.» |
| S070 | 204.8800 | 209.4900 | EGRESS | Der bekannte Client erhält nur seinen HTTPS-Weg, der danebenliegende SSH-Weg bleibt geschlossen. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L066 · Strophe 3 – Bekannter Client · 204.8800–208.4400 s · «Deine Identität lässt dich hinein.» |
| S071 | 209.4900 | 212.1400 | ISE | IDENTITY CONFIRMED referenziert die vorhandene erfolgreiche C-17-Prüfung. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L067 · Build – Systemmeldungen · 209.4900–210.8000 s · «Identity confirmed.»; E038 |
| S072 | 212.1400 | 214.1600 | TAG | SGT ASSIGNED bestätigt Employees/10 an einem neuen Frame. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L068 · Build – Systemmeldungen · 212.1400–213.2600 s · «SGT assigned.» |
| S073 | 214.1600 | 216.7700 | EGRESS | SGACL ACTIVE ist am echten Egress angeschrieben; keine Gleichsetzung mit ISE-Prüfung. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L069 · Build – Systemmeldungen · 214.1600–216.1400 s · «SGT-ACL active.» |
| S074 | 216.7700 | 219.0700 | MATRIX | POLICY ENFORCED beleuchtet gleichzeitig eine erlaubte und eine gesperrte Zelle. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L070 · Build – Systemmeldungen · 216.7700–218.0600 s · «Policy enforced.» |
| S075 | 219.0700 | 221.7700 | FABRIC | Die Fabrik läuft weiter mit lesbaren Grenzen; kein globaler Sicherheitszauber. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L071 · Build – Systemmeldungen · 219.0700–221.0000 s · «Network protected.» |
| S076 | 221.7700 | 223.5100 | FABRIC | Final-TRUSTSEC spannt die bekannte Datenachse bis zum Server auf. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L072 · Final Hook · 221.7700–223.3000 s · «TrustSec.»; E039 |
| S077 | 223.5100 | 225.7500 | ACCESS | KNOW THE CLIENT rahmt C-17 und U-09 getrennt ein, ohne die Gruppen zu vermischen. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L073 · Final Hook · 223.5100–225.4200 s · «Know the client.» |
| S078 | 225.7500 | 226.9200 | TAG | Ein violetter SGT-10-Frame tritt zwischen grauen Unknown-Frames hervor. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L074 · Final Hook · 225.7500–226.4600 s · «TrustSec.» |
| S079 | 226.9200 | 228.2600 | EGRESS | CONTROL THE FLOW zeigt konkrete Weiterleitung und konkrete Verwerfung nebeneinander. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L075 · Final Hook · 226.9200–227.9400 s · «Control the flow.» |
| S080 | 228.2600 | 230.5700 | ISE | C-17s Identität bleibt bestätigt im Kontrollzentrum gespeichert. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L076 · Final Hook · 228.2600–230.5700 s · «ISE kennt den Client.» |
| S081 | 230.5700 | 232.2900 | MATRIX | Die konfigurierte Zielgruppe kommt aus der Policy-/Zielzuordnung; ISE kennt hier keinen Inhalt jedes Pakets. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L077 · Final Hook · 230.5700–232.2800 s · «ISE kennt sein Ziel.»; E040 |
| S082 | 232.2900 | 233.6000 | TAG | BEKANNTE ROLLE ist Employees/10, nicht die gesamte Matrix. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L078 · Final Hook · 232.2900–233.5200 s · «Bekannte Rolle.» |
| S083 | 233.6000 | 235.5000 | MATRIX | DEFINIERTES SPIEL zeigt HTTPS_ONLY samt abschliessendem deny ip. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L079 · Final Hook · 233.6000–235.3200 s · «Definiertes Spiel.» |
| S084 | 235.5000 | 239.1200 | ACCESS | Unknown bleibt U-09 am eingeschränkten Anschluss; der Final Hook erfindet keine neue Authentifizierung. | 24-mm-Fahrt von der Anschlusswand in Gi1/0/7; C-17 bleibt unten links. | Portrechteck wird zur Fabricöffnung. | L080 · Final Hook · 235.5000–238.5800 s · «Unknown identity.» · **PRÜFEN** |
| S085 | 239.1200 | 241.5500 | EGRESS | ACCESS DENIED bestätigt den stabilen U-09→Server-Sperrzustand. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L081 · Final Hook · 239.1200–241.1600 s · «Access denied.» · **PRÜFEN** |
| S086 | 241.5500 | 245.6200 | TAG | Zweite Unknown-Zeile bleibt am grauen SGT-0-Rahmen, kein Wechsel auf SGT 10. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L082 · Final Hook · 241.5500–245.4200 s · «Unknown identity.» · **PRÜFEN** |
| S087 | 245.6200 | 251.8000 | MATRIX | Widersprüchliches «Access defined»: die fest definierte DENY-Zelle bleibt gross sichtbar; keine Freigabe aus dem Wortlaut ableiten. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L083 · Final Hook · 245.6200–248.4800 s · «Access defined.» · **PRÜFEN**; E041 |
| S088 | 251.8000 | 258.1400 | ISE | Outro zeigt C-17s verifizierte Identität als gespeicherten, datierten Befund. | Orthogonaler 50-mm-Dolly durch seitliche Prüfflächen. | Dokument-ID verbindet Prüfung und Ergebnis. | L084 · Outro – Systemmeldungen · 251.8000–255.6800 s · «Identity verified.»; E042; E043 |
| S089 | 258.1400 | 259.8200 | TAG | SGT ACTIVE gehört dem neuen erlaubten Frame aus Employees/10. | Makro um den Rahmen, dann Achsenfahrt mit dem Frame. | Farbe und SGT-Zahl als Match Cut. | L085 · Outro – Systemmeldungen · 258.1400–259.7800 s · «SGT active.» |
| S090 | 259.8200 | 262.5600 | EGRESS | SGACL ACTIVE steht an der unverändert eingeschalteten Enforcement-Anlage. | 35-mm-Seitenfahrt an den Prüfplatten; Stop vor der Sperrkante. | PERMIT führt vorwärts, DENY schneidet zum Quellbefund zurück. | L086 · Outro – Systemmeldungen · 259.8200–262.3800 s · «SGT-ACL active.» |
| S091 | 262.5600 | 266.3500 | MATRIX | POLICY ENFORCED zeigt 10→20 HTTPS erlaubt und 0→20 weiterhin gesperrt. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | L087 · Outro – Systemmeldungen · 262.5600–265.7000 s · «Policy enforced.» |
| S092 | 266.3500 | 269.1600 | FABRIC | ACCESS CONTROL zieht eine räumliche Verbindung zwischen Gruppenmatrix und Zielhallentoren. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L088 · Outro – Systemmeldungen · 266.3500–268.8000 s · «Access control.» |
| S093 | 269.1600 | 273.1200 | FABRIC | Totale der Fabrik: Identity, Classification und Enforcement sind gleichzeitig räumlich unterscheidbar. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Anschluss über die unveränderte Richtung des Datenflusses. | L089 · Outro – Systemmeldungen · 269.1600–273.1200 s · «Cisco TrustSec.»; E044 |
| S094 | 273.1200 | 278.0800 | ZIEL | Ein neuer HTTPS-Test von C-17 empfängt Antwort, der Tag war am Egress bereits entfernt. | Ruhiger 32-mm-Dolly durch die Diensthalle. | Antwortframe führt zurück in die Fabric. | Instrumental; E045; E046; E047 |
| S095 | 278.0800 | 283.0400 | MATRIX | Die stabilen Zellen 10→20 und 0→20 im grossen Raum halten, ohne Regelwechsel. | Kran von Quellreihe zur Zielspalte, dann orthogonaler Halt auf der Zelle. | Harter Schnitt auf die ausgewählte Entscheidungszelle. | Instrumental; E048 |
| S096 | 283.0400 | 288.0000 | FABRIC | Ab 282.0 s visuelle Blende; die Verbindung der drei Funktionsbereiche bleibt bis zum Ende erkennbar. | Lange 20-mm-Tiefenfahrt mit sichtbaren Abzweigungen. | Endbild bis 288.0000 s; dann Schwarz mit Dateiende. | Instrumental; E049; E050 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L007 | SGT ASSIGNED · kräftiger Eintritt, ruhiger Halt | 27.3000 | 28.6600 | 1.3600 | 27.4010 | ACCESS-1 weist SGT 10 zu; der Rahmen erscheint am neuen Frame T-01. |
| L016 | SGT ASSIGNED · kräftiger Eintritt, ruhiger Halt | 65.6000 | 66.7800 | 1.1800 | 65.7710 | Ein neuer Frame erhält SGT 10, keine Tagänderung eines bereits laufenden Frames. |
| L018 | TRUSTSEC · kräftiger Eintritt, ruhiger Halt | 69.5900 | 71.1200 | 1.5300 | 69.6810 | TRUSTSEC folgt T-02 durch den violetten Fabric-Korridor. |
| L020 | TRUSTSEC · kräftiger Eintritt, ruhiger Halt | 73.6100 | 74.7200 | 1.1100 | 73.8110 | TRUSTSEC legt den SGT-Rahmen gross um den sichtbaren Header. |
| L036 | TRUSTSEC · kräftiger Eintritt, ruhiger Halt | 125.2400 | 126.7400 | 1.5000 | 125.3010 | Zweiter Hook folgt einer nun bestätigten Antwortspur vom Server zurück. |
| L038 | TRUSTSEC · kräftiger Eintritt, ruhiger Halt | 129.2500 | 130.1800 | 0.9300 | 129.4210 | TRUSTSEC liegt auf dem Gruppenrahmen eines neuen erlaubten Frames. |
| L054 | ACCESS DENIED · kräftiger Eintritt, ruhiger Halt | 165.5700 | 167.5600 | 1.9900 | 165.6010 | U-01 wird endgültig verworfen; der Servereingang erhält keine Kopie. B05. |
| L059 | ACCESS DENIED · kräftiger Eintritt, ruhiger Halt | 179.7400 | 181.3400 | 1.6000 | 179.8210 | DENY wird aus der bestehenden 0→20-Zelle bestätigt, nicht erneut als Eingriff gesetzt. |
| L068 | SGT ASSIGNED · kräftiger Eintritt, ruhiger Halt | 212.1400 | 213.2600 | 1.1200 | 212.2510 | SGT ASSIGNED bestätigt Employees/10 an einem neuen Frame. |
| L072 | TRUSTSEC · kräftiger Eintritt, ruhiger Halt | 221.7700 | 223.3000 | 1.5300 | 221.7710 | Final-TRUSTSEC spannt die bekannte Datenachse bis zum Server auf. |
| L074 | TRUSTSEC · kräftiger Eintritt, ruhiger Halt | 225.7500 | 226.4600 | 0.7100 | 225.9410 | Ein violetter SGT-10-Frame tritt zwischen grauen Unknown-Frames hervor. |
| L081 | ACCESS DENIED · kräftiger Eintritt, ruhiger Halt | 239.1200 | 241.1600 | 2.0400 | 239.2010 | ACCESS DENIED bestätigt den stabilen U-09→Server-Sperrzustand. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / FABRIC | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Anlage und Ausgangszustand öffnen; Kontroll- und Datenräume räumlich miteinander verbinden. |
| E002 | 0.2000 | level_gap / ±0.1 | S001 / FABRIC | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Anlage und Ausgangszustand öffnen; Kontroll- und Datenräume räumlich miteinander verbinden. |
| E003 | 1.7000 | energy_fall / ±0.5 | S001 / FABRIC | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Anlage und Ausgangszustand öffnen; Kontroll- und Datenräume räumlich miteinander verbinden. |
| E004 | 3.6700 | section_boundary / ±0.35 | S002 / FABRIC | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Die Gesamtanlage erwacht, Anschlusswand und getrennte Kontrollkammer werden als Teile einer Fabrik sichtbar. |
| E005 | 5.1310 | transient / ±0.04 | S002 / FABRIC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Gesamtanlage erwacht, Anschlusswand und getrennte Kontrollkammer werden als Teile einer Fabrik sichtbar. |
| E006 | 10.3000 | level_gap / ±0.1 | S003 / ACCESS | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: C-17 verbindet sich an Gi1/0/7; nur Linkstatus ist bestätigt. B01. |
| E007 | 10.9000 | energy_rise / ±0.5 | S003 / ACCESS | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: C-17 verbindet sich an Gi1/0/7; nur Linkstatus ist bestätigt. B01. |
| E008 | 13.9000 | level_gap / ±0.1 | S004 / ACCESS | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Der Switch startet die Identitätsanfrage auf dem Kontrollpfad, Anwendungsweg bleibt geschlossen. |
| E009 | 16.3000 | level_gap / ±0.1 | S005 / ISE | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: EAP-TLS-Prüfung verarbeitet das Clientzertifikat; noch kein SGT-Rahmen am Datenframe. |
| E010 | 27.9000 | energy_rise / ±0.5 | S008 / TAG | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: ACCESS-1 weist SGT 10 zu; der Rahmen erscheint am neuen Frame T-01. |
| E011 | 28.6600 | section_boundary / ±0.35 | S009 / TAG | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: T-01s Rahmen durch die Klassifizierung verfolgen; Zertifikatskarte bleibt zurück im ISE-Raum. |
| E012 | 31.4210 | transient / ±0.04 | S009 / TAG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: T-01s Rahmen durch die Klassifizierung verfolgen; Zertifikatskarte bleibt zurück im ISE-Raum. |
| E013 | 38.8110 | transient / ±0.04 | S010 / FABRIC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Kamera folgt dem ersten erlaubten Frame durch mehrere Stockwerke bis vor EGRESS-1. |
| E014 | 41.2100 | section_boundary / ±0.35 | S011 / ACCESS | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Ein neuer Vorgang am selben Anschluss zeigt die Anfrage vom Switch und nicht vom Server. |
| E015 | 44.9010 | transient / ±0.04 | S011 / ACCESS | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ein neuer Vorgang am selben Anschluss zeigt die Anfrage vom Switch und nicht vom Server. |
| E016 | 53.1610 | transient / ±0.04 | S014 / EGRESS | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der ausgewählte HTTPS-Frame gelangt erst nach 10→20-PERMIT in die Serverhalle. |
| E017 | 62.2600 | section_boundary / ±0.35 | S017 / ISE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: IDENTITY KNOWN steht über C-17s bestätigter Prüfkarte. |
| E018 | 69.5900 | section_boundary / ±0.35 | S021 / FABRIC | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: TRUSTSEC folgt T-02 durch den violetten Fabric-Korridor. |
| E019 | 69.8000 | energy_rise / ±0.5 | S021 / FABRIC | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: TRUSTSEC folgt T-02 durch den violetten Fabric-Korridor. |
| E020 | 72.7210 | transient / ±0.04 | S022 / ACCESS | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: C-17 ist an seiner Anschlussstation identifizierbar; die Adresse ist eine wechselbare Nebenbeschriftung. |
| E021 | 78.8110 | transient / ±0.04 | S025 / ISE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die bestätigte C-17-Karte liegt im Kontrollraum; kein ISE-Abstecher des Nutzdatenframes. |
| E022 | 89.2000 | energy_fall / ±0.5 | S028 / EGRESS | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Header wird gegen TCP dst 443 geprüft; die positive Entscheidung öffnet genau diesen Weg. |
| E023 | 90.8800 | section_boundary / ±0.35 | S029 / ACCESS | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Vier Anschlussstationen zeigen Client, Server, Phone und Printer als Geräte mit verschiedenen Rollen. |
| E024 | 90.9810 | transient / ±0.04 | S029 / ACCESS | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Vier Anschlussstationen zeigen Client, Server, Phone und Printer als Geräte mit verschiedenen Rollen. |
| E025 | 112.5000 | energy_fall / ±0.5 | S034 / EGRESS | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Zwei konfigurierte Enforcement-Hallen prüfen ihre jeweiligen Zielzugriffe, nicht jeder beliebige Hop. |
| E026 | 112.8900 | section_boundary / ±0.35 | S035 / TAG | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: T-02s Quell-SGT 10 wird aus dem Fabric-Kontext gelesen. |
| E027 | 119.0110 | transient / ±0.04 | S037 / MATRIX | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Zelle 10→20 lädt HTTPS_ONLY; TCP/443 passt, implizites Vertrauen allein reicht nicht. |
| E028 | 120.5000 | energy_fall / ±0.5 | S037 / MATRIX | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Die Zelle 10→20 lädt HTTPS_ONLY; TCP/443 passt, implizites Vertrauen allein reicht nicht. |
| E029 | 125.2400 | section_boundary / ±0.35 | S039 / FABRIC | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Zweiter Hook folgt einer nun bestätigten Antwortspur vom Server zurück. |
| E030 | 146.5200 | section_boundary / ±0.35 | S047 / ACCESS | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Ab 146.52 s erscheint U-09 am getrennten Anschluss; keine bestehende C-17-Rolle wird überschrieben. |
| E031 | 148.8000 | energy_fall / ±0.5 | S048 / ISE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Ein neuer Authentifizierungsversuch für U-09 erhält keine erfolgreiche Identitätsbestätigung. |
| E032 | 150.1000 | level_gap / ±0.1 | S049 / ISE | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Fehlende gültige Identität bleibt als offener Befund stehen; kein Zertifikat wird erfunden. |
| E033 | 152.1810 | transient / ±0.04 | S050 / TAG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der Restricted-Zugang ordnet U-09 dem Unknown-Kontext SGT 0 zu. B05. |
| E034 | 168.3000 | energy_fall / ±0.5 | S058 / ACCESS | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Den endgültig verworfenen U-01 als abgeschlossenen Eintrag am Quellanschluss zeigen; nur neue Kontrollanfragen bleiben möglich. |
| E035 | 172.1000 | section_boundary / ±0.35 | S059 / ISE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Im Dialog steht nur U-09s Anfragekarte im seitlichen Prüfraum. |
| E036 | 187.9300 | section_boundary / ±0.35 | S065 / ACCESS | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: C-17 wird wieder ausgewählt, das vorher gesperrte U-09 bleibt am eigenen Anschluss. |
| E037 | 197.4410 | transient / ±0.04 | S067 / TAG | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der neue C-17-Frame trägt SGT 10; graue Unknown-Frames ändern ihre Farbe nicht. |
| E038 | 209.4900 | section_boundary / ±0.35 | S071 / ISE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: IDENTITY CONFIRMED referenziert die vorhandene erfolgreiche C-17-Prüfung. |
| E039 | 221.7700 | section_boundary / ±0.35 | S076 / FABRIC | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Final-TRUSTSEC spannt die bekannte Datenachse bis zum Server auf. |
| E040 | 230.8610 | transient / ±0.04 | S081 / MATRIX | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die konfigurierte Zielgruppe kommt aus der Policy-/Zielzuordnung; ISE kennt hier keinen Inhalt jedes Pakets. |
| E041 | 249.6000 | energy_rise / ±0.5 | S087 / MATRIX | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Widersprüchliches «Access defined»: die fest definierte DENY-Zelle bleibt gross sichtbar; keine Freigabe aus dem Wortlaut ableiten. |
| E042 | 251.8000 | section_boundary / ±0.35 | S088 / ISE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Outro zeigt C-17s verifizierte Identität als gespeicherten, datierten Befund. |
| E043 | 252.2510 | transient / ±0.04 | S088 / ISE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Outro zeigt C-17s verifizierte Identität als gespeicherten, datierten Befund. |
| E044 | 273.1000 | energy_rise / ±0.5 | S093 / FABRIC | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Totale der Fabrik: Identity, Classification und Enforcement sind gleichzeitig räumlich unterscheidbar. |
| E045 | 273.1200 | section_boundary / ±0.35 | S094 / ZIEL | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Ein neuer HTTPS-Test von C-17 empfängt Antwort, der Tag war am Egress bereits entfernt. |
| E046 | 273.1200 | last_vocal_end / ±0.5 | S094 / ZIEL | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Ein neuer HTTPS-Test von C-17 empfängt Antwort, der Tag war am Egress bereits entfernt. |
| E047 | 275.3410 | transient / ±0.04 | S094 / ZIEL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ein neuer HTTPS-Test von C-17 empfängt Antwort, der Tag war am Egress bereits entfernt. |
| E048 | 282.0000 | fade_candidate / ±0.3 | S095 / MATRIX | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: Die stabilen Zellen 10→20 und 0→20 im grossen Raum halten, ohne Regelwechsel. |
| E049 | 284.4000 | energy_fall / ±0.5 | S096 / FABRIC | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Ab 282.0 s visuelle Blende; die Verbindung der drei Funktionsbereiche bleibt bis zum Ende erkennbar. |
| E050 | 288.0000 | end / ±2.0833333333333333e-05 | S096 / FABRIC | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Ab 282.0 s visuelle Blende; die Verbindung der drei Funktionsbereiche bleibt bis zum Ende erkennbar. |

## Referenz und Übergabeprüfung

[Cisco: Security Group ACLs](https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/sec-crypto/cts/cisco-trustsec-configuration-guide/security-group-acls.html) belegt das Quell-/Zielgruppen-Enforcement und die Trennung von SGT-Zuweisung und SGACL. Gruppen, Regeln und ISE-Bildschirme hier sind simulierte Szenariowerte.

Geprüft: 96 lückenlose Einstellungen von 0 bis 288.0000 s; alle 89 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 50 Events genau einmal zugeordnet; 12 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L021, L039, L080, L081, L082, L083.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
