# 04 · Broadcast Storm — Die sich vervielfältigende Switch-Welt

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [04_Broadcast_Storm_1.0.wav](04_Broadcast_Storm_1.0.wav) · SHA-256 `00a640de0f76551e27719ad0c4c0f106133fd26c4d33f4f7e3d5b71cbadec352`.
- Transkript: [04_Broadcast_Storm_Transkript.json](04_Broadcast_Storm_Transkript.json) · SHA-256 `22c0798101f354447cd67b1858d417fdf0c4e98018d92e879034fdbc499225d2`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/04_Broadcast_Storm/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `cfa771e9562745c0b8634bc8ee34743efa25fd37a459bc02540b82b686fb9907`.
- Exaktes Ende: **208.8135 s**, 10023048 Samples/Kanal bei 48000 Hz; Timecode 00:03:28.814 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 175.0 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Drei Switchkörper SW1, SW2 und SW3 stehen wie gewaltige Hangars an den Ecken einer dreieckigen Ebene. Zwischen ihnen liegen Glasröhren mit eindeutig angeschriebenen Portnummern. Unter jeder Fassade zeigt eine durchsichtige Fabric die Verzweigung vom Eingangsport zu den zulässigen Ausgängen. VLAN 120 ist ein schmaler, gelber Lichtboden; daneben existierende VLANs erhalten keine Katastrophenfarbe.

Ein ARP-Broadcast B-001 bildet den Keim. Sein Header ist weiss, sein Nutzlastkern gelb. Jede Kopie behält exakt diese Kennzeichen, bekommt jedoch ausserhalb des Headers ein filmisches Abstammungszeichen wie B-001/a/b. Bei jeder Rückkehr erzeugt ein Switch neue Zweige. Die Architektur scheint sich durch wachsende Kopien zu vervielfältigen, die drei physischen Switches bleiben unverändert. Volle Queue-Schächte, springende MAC-Tafeln und eine überlastete Managementkammer sind separate Funktionsräume.

Die Kamera läuft zu Beginn mit einem einzelnen Frame, jagt später zwischen seiner Kopie und dem Rückweg und steigt dann in eine Übersicht, die den geschlossenen Ring beweist. Das Chaos entsteht durch konkurrierende Bewegungen, nicht durch unlesbare Schrift. Nach dem Port-down bleibt die Schnittenergie der tatsächlichen Musik möglich: die nun ruhige Welt kann rhythmisch gezeigt werden, ohne einen im Prompt verlangten Musikstopp zu erfinden. Gelb zieht aus den Puffern ab; die Szene gewinnt Tiefe zurück.

## Fachszenario

VLAN 120 enthält Client H1 mit MAC 02:00:00:00:01:20, IP 192.0.2.10. SW1 Gi1/0/1↔SW2 Gi1/0/1 und SW2 Gi1/0/2↔SW3 Gi1/0/1 bilden zunächst eine offene Kette. Irrtümliches Patchkabel SW3 Gi1/0/24↔SW1 Gi1/0/24 schliesst bei 15.58 s den Ring. Auf allen drei Switches ist spanning-tree für VLAN 120 deaktiviert; kein BPDU-/Blocking-Mechanismus greift. Andere VLANs sind nicht betroffen.

B-001 ist ein ARP-Request an ff:ff:ff:ff:ff:ff. Ein Switch flutet ihn im VLAN an alle dafür weiterleitenden Ports ausser dem Eingangsport. Die zurückkehrenden Kopien werden erneut geflutet. Der Ethernet-Frame hat keine Hop-Limit-Funktion; im ARP-Inhalt existiert kein IP-TTL. Die SRC-MAC von H1 wird wechselnd an den Ringports gelernt. ASIC-Datenlast, Queue-Verlust und CPU-/Managementlast sind unterschiedliche Folgen, kein jedes Paket verarbeitender CPU-Switch.

«Zieh das Kabel» bei 130.06 s ist der Auftrag zur Suche, kein Eingriff. Da In-band-Management nicht mehr zuverlässig erreichbar ist, führt eine bestehende serielle Console zu SW3. Portbeschriftung, Ringübersicht und MAC-Flaps identifizieren Gi1/0/24 als falschen Ringabschluss. Bei 161.38 s beginnt der shutdown-Befehl; der Link ist spätestens 164.18 s administrativ down. Danach keine Ringrunde mehr. Restliche Kopien leeren sich oder werden verworfen, MAC-Lernen beruhigt sich, Management und ein neuer Service-Test werden überprüft. STP ist damit noch nicht repariert: der Endzustand ist eine offene Kette mit isoliertem Fehlpatch; die spätere dauerhafte STP-Korrektur steht als Folgearbeit im Change.

## Kontinuität

B-001 und alle filmischen Kopie-IDs enthalten denselben Ethernet-/ARP-Inhalt. Das Abstammungszeichen ist ausserhalb des Headers; keine neue Sequenznummer im echten Broadcast erfinden. Keine Rücksendung durch denselben Eingangsport beim Flooding. Eine Kopie darf den Sender erreichen, ihr weiterer Transport ist nicht vom Sender neu ausgelöst.
Ring offen bis 15.58 s, geschlossen bis zum einmaligen Abschalten 161.38–164.18 s. Der Final Chorus bei 177.16 s zeigt denselben bereits abgeschalteten Port aus der Fabric-Perspektive; er führt keinen zweiten shutdown aus. «Kein Root» bedeutet hier deaktiviertes STP im betroffenen VLAN, nicht global fehlendes Layer-3-Routing.
Portlampen zeigen physische Links, keine Servicegesundheit. Buffer laufen nach dem Eingriff nicht augenblicklich leer. Altes Syslog bleibt als datierte Historie sichtbar; neue Flaps enden. CPU erholt sich zeitversetzt. Figuren, Hände und menschliche Taschenlampenträger fehlen; Console und bewegter Lichtkegel tragen die Suche.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 ist ein dauerhafter Header, die filmische Kopie-ID liegt ausserhalb. B02 zeigt historische, datierte Flaps und aktuelle Überlastung; ab 164.18 s kommen keine neuen Flap-Zeilen. B03 zeigt die konkret identifizierte Buchse. B04 tippt shutdown ab 161.38 s und zeigt administratively down spätestens bei 164.18 s. B05 zeigt die verminderte Broadcastrate als Verlauf, Managementantwort und Client-Test erst nach gesonderter Prüfung im Outro. Es gibt keinen STP-Root-Befund nach dem Port-down, weil STP deaktiviert bleibt.

IOS-XE-Ausgaben und Syslog sind gekürzte, simulierte Ausschnitte, keine originalen Messdaten. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 43.9600–60.1400 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |
| B02 | 60.1400–86.5200 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B03 | 153.8400–161.3800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |
| B04 | 161.3800–168.9600 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B05 | 186.7200–202.9000 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |

### B01 · 43.9600–60.1400 s

```text
B-001 (Header)
VLAN: 120
Ethernet src: 02:00:00:00:01:20
Ethernet dst: ff:ff:ff:ff:ff:ff
EtherType: 0x0806 (ARP)
ARP: Who has 192.0.2.1? Tell 192.0.2.10
Filmisches Kopiezeichen: B-001/a/b (kein Headerfeld)
```

### B02 · 60.1400–86.5200 s

```text
SW3# show spanning-tree vlan 120
No spanning tree instance exists.
SW3# show running-config | include spanning-tree
no spanning-tree vlan 120
%SW_MATM-4-MACFLAP_NOTIF: Host 0200.0000.0120 in vlan 120 is flapping between port Gi1/0/1 and port Gi1/0/24
Overlay: CPU 94% | Broadcast 620000 fps | Management timeout
```

### B03 · 153.8400–161.3800 s

```text
SW3# show interfaces GigabitEthernet1/0/24 description
Interface  Status  Protocol  Description
Gi1/0/24   up      up        PATCH-UNPLANNED-TO-SW1
SW3# show interfaces GigabitEthernet1/0/24 switchport
Administrative Mode: trunk
Trunking VLANs Enabled: 120
Overlay: Ringabschluss SW3/24 <-> SW1/24 bestätigt
```

### B04 · 161.3800–168.9600 s

```text
SW3# configure terminal
SW3(config)# interface GigabitEthernet1/0/24
SW3(config-if)# shutdown
SW3(config-if)# end
%LINK-5-CHANGED: Interface GigabitEthernet1/0/24, changed state to administratively down
```

### B05 · 186.7200–202.9000 s

```text
SW3# show interfaces GigabitEthernet1/0/24
GigabitEthernet1/0/24 is administratively down, line protocol is down
Overlay: Broadcastrate 620000 -> 24 fps
Neue MAC-Flaps: 0 | Management antwortet
Client-Service-Test: erfolgreich
Folgearbeit: STP für VLAN 120 korrekt aktivieren; Fehlpatch entfernen
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 9.6600 | AUSSEN | Die offene Kette SW1–SW2–SW3 von oben aufbauen; freie Port-24-Enden bleiben räumlich getrennt. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | Instrumental; E001; E002 |
| S002 | 9.6600 | 10.4400 | AUSSEN | Ein einzelnes loses Kabel hängt zwischen den offenen Enden SW3 und SW1; die Kette ist noch nicht geschlossen. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L001 · Intro · 9.6600–10.4400 s · «Ein Kabel.»; E003 |
| S003 | 10.4400 | 15.5800 | PORT | Beide Kabelenden und ihre Portnummern in einer ungeschnittenen Kurvenfahrt verbinden. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | Instrumental |
| S004 | 15.5800 | 16.7400 | PORT | Bei 15.58 s rastet der Fehlpatch an SW3 Gi1/0/24 ein; sein Gegenende liegt an SW1 Gi1/0/24. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | L002 · Intro · 15.5800–16.7400 s · «Falscher Port.» |
| S005 | 16.7400 | 20.8000 | CONSOLE | Bereits vorhandene no spanning-tree vlan 120-Konfiguration sichtbar halten; kein späterer STP-Ausfall wird erfunden. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | Instrumental |
| S006 | 20.8000 | 22.3000 | AUSSEN | Der geschlossene VLAN-120-Ring wird als vollständige Ursache sichtbar, bevor viele Kopien entstehen. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L003 · Intro · 20.8000–22.3000 s · «Mehr braucht es nicht.»; E004 |
| S007 | 22.3000 | 29.5200 | FABRIC | H1 erzeugt B-001; Kamera begleitet ihn vom Clientport bis zur ersten Flooding-Gabel. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | Instrumental; E005 |
| S008 | 29.5200 | 36.7400 | AUSSEN | Eine Kopie nimmt den neuen Ringabschluss, die zweite den direkten Pfad; beide kehren aus anderer Richtung zurück. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | Instrumental; E006 |
| S009 | 36.7400 | 43.9600 | MAC | MAC-Lernen kippt beim Wiedereintritt; der Loop ist durch Topologie und Header belegt. | Orthogonale 50-mm-Makroaufnahme der MAC-/Port-Tafel. | Portnummer als Match Cut zur Topologie. | Instrumental; E007 |
| S010 | 43.9600 | 46.3400 | FABRIC | B-001/a läuft SW1→SW2→SW3→SW1 und kommt als erhaltene Kopie zurück. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L004 · Verse · 43.9600–46.3400 s · «Frame geht raus und kommt zurück,»; E008 |
| S011 | 46.3400 | 49.8800 | PORT | Derselbe SRC-/DST-/ARP-Inhalt passiert den Ringabschluss erneut; Kamera hält den Header. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | L005 · Verse · 46.3400–49.3200 s · «derselbe Frame, wo ist das Ende.» |
| S012 | 49.8800 | 51.8800 | FABRIC | Der ARP-Frame zeigt EtherType 0x0806 und kein IP-TTL-Feld. B01. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L006 · Verse · 49.8800–51.8800 s · «Kein Time to Live hier unten drin,» |
| S013 | 51.8800 | 54.5600 | AUSSEN | Die Kamera steigt aus dem Frame und erkennt den Ring ohne blockierenden STP-Port. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L007 · Verse · 51.8800–54.5600 s · «nichts sagt ihm, wohin er soll.» |
| S014 | 54.5600 | 56.7600 | FABRIC | SW2 flutet ausser dem Eingangsport auf beide zulässigen VLAN-Ausgänge; die Abzweigung bleibt nachvollziehbar. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L008 · Verse · 54.5600–56.7600 s · «Flooding raus auf jeden Port,»; E009 |
| S015 | 56.7600 | 60.1400 | FABRIC | Kopien entstehen an SW3 erneut, Abstammungslinien wachsen ausserhalb der echten Header. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L009 · Verse · 56.7600–59.6400 s · «Kopien wachsen, keiner stoppt.» |
| S016 | 60.1400 | 62.3000 | BUFFER | Datenpfade und Puffer laufen voll, der separate CPU-Monitor schlägt rot aus. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | L010 · Verse · 60.1400–62.3000 s · «Der Switch schreit, C-P-U rot,»; E010 |
| S017 | 62.3000 | 66.5200 | CONSOLE | Ein In-band-Management-Request bleibt ohne Antwort; die Control-Plane-Kammer ist überlastet, nicht zerstört. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L011 · Verse · 62.3000–65.4400 s · «die Control Plane ist längst tot.»; E011 |
| S018 | 66.5200 | 69.6600 | PORT | Grüne physische Linklampen stehen über dicht gefüllten Datenkanälen. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | L012 · Pre-Chorus · 66.5200–69.1200 s · «Alle Lampen leuchten grün.»; E012 |
| S019 | 69.6600 | 76.0200 | MAC | Die H1-MAC springt zwischen lokalem Client- und Ringport; Link-grün passt nicht zum Befund. B02. | Orthogonale 50-mm-Makroaufnahme der MAC-/Port-Tafel. | Portnummer als Match Cut zur Topologie. | L013 · Pre-Chorus · 69.6600–72.2600 s · «Das ist kein gutes Zeichen.» |
| S020 | 76.0200 | 80.0200 | BUFFER | Ein neuer Unicast-Test wird hinter den Broadcast-Kopien verworfen, Management bleibt unerreichbar. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | L014 · Pre-Chorus · 76.0200–80.0200 s · «Hier kommt gar nichts mehr durch.» |
| S021 | 80.0200 | 86.5200 | AUSSEN | Drei feste Switches verschwinden fast in den Kopiespuren; die Gerätezahl wächst nicht. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L015 · Pre-Chorus · 80.0200–83.1000 s · «Hier steht alles auf dem Spiel.» |
| S022 | 86.5200 | 88.0800 | AUSSEN | BROADCAST STORM öffnet die Totalenansicht des überfüllten Rings. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L016 · Chorus · 86.5200–88.0800 s · «Broadcast Storm.»; E013; E014 |
| S023 | 88.0800 | 92.0000 | CONSOLE | VLAN-120-STP-Status lautet deaktiviert; kein Root/Blocking für diesen VLAN-Baum. B02. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L017 · Chorus · 88.0800–90.9400 s · «Kein Root, kein Pfad.» · **PRÜFEN** |
| S024 | 92.0000 | 93.6400 | FABRIC | Zweiter Titel liegt entlang einer Flutverzweigung mit immer neuen Kopien. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L018 · Chorus · 92.0000–93.6400 s · «Broadcast Storm.» |
| S025 | 93.6400 | 98.2800 | BUFFER | Drop-Counter und volle Queues zeigen den konkreten Schaden statt abstrakten roten Nebels. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | L019 · Chorus · 93.6400–96.1400 s · «Spür den Schaden.»; E015 |
| S026 | 98.2800 | 99.5600 | FABRIC | ES FLUTET begleitet eine Kopie bis in die nächste Verzweigung. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L020 · Chorus · 98.2800–99.5600 s · «Es flutet,» · **PRÜFEN** |
| S027 | 99.5600 | 100.8400 | FABRIC | Zwei neue Ausgänge erhalten identische Header; die Vermehrung ist sichtbar. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L021 · Chorus · 99.5600–100.8400 s · «verdoppelt,» |
| S028 | 100.8400 | 102.9200 | PORT | Die verfügbare physische Drahtkapazität ist von Broadcasts belegt, sie wird nicht grösser. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | L022 · Chorus · 100.8400–102.1600 s · «ertränkt den Draht,»; E016 |
| S029 | 102.9200 | 106.5000 | AUSSEN | Der Ring führt den Kameraweg zurück zum Ausgangspunkt. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L023 · Chorus · 102.9200–106.5000 s · «ein Loop, der sich» |
| S030 | 106.5000 | 110.5400 | BUFFER | Eine alte Kopie fällt in einem vollen Puffer aus; andere Kopien treiben den Loop weiter. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | L024 · Chorus · 106.5000–107.6200 s · «selber frisst.»; E017; E018 |
| S031 | 110.5400 | 111.8200 | AUSSEN | LOOP markiert die vollständige räumliche Rundfahrt, nicht einen neuen Patchvorgang. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L025 · Break · 110.5400–111.8200 s · «Loop.» · **PRÜFEN**; E019 |
| S032 | 111.8200 | 119.4000 | FABRIC | Eine vollständige Ringrunde verfolgen; die Stamm-ID bleibt B-001, alle Kopien haben eigene filmische Suffixe. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | Instrumental; E020 |
| S033 | 119.4000 | 120.8400 | FABRIC | FLOOD sitzt am ersten offenen Abzweig; Eingangsport erhält keine eigene Rückkopie. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L026 · Break · 119.4000–120.1000 s · «Flood.» · **PRÜFEN** |
| S034 | 120.8400 | 121.5600 | FABRIC | Zweites FLOOD folgt der nächsten Verzweigung derselben Abstammungslinie. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L027 · Break · 120.8400–121.5600 s · «Flood.» · **PRÜFEN**; E021 |
| S035 | 121.5600 | 130.0600 | BUFFER | Volle Queues und Drop-Counter zeigen Verluste bei unverändertem Linkstatus. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | Instrumental |
| S036 | 130.0600 | 131.7400 | CONSOLE | ZIEH DAS KABEL erscheint als Arbeitsauftrag neben einer noch unbestimmten Portauswahl. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L028 · Break · 130.0600–131.7400 s · «Zieh das Kabel.» |
| S037 | 131.7400 | 135.9800 | AUSSEN | Portlabels des Fehlpatches im Suchlicht finden; der Link bleibt zunächst up. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | Instrumental; E022; E023 |
| S038 | 135.9800 | 137.3800 | AUSSEN | Unsicheres «Yes»: der Suchscheinwerfer fährt weiter über den Ring; kein Eingriff. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L029 · Break · 135.9800–137.3800 s · «Yes.» · **PRÜFEN** |
| S039 | 137.3800 | 142.4800 | CONSOLE | Unabhängigen seriellen Zugang bis SW3 verfolgen und den Prompt halten. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | Instrumental; E024 |
| S040 | 142.4800 | 144.9800 | CONSOLE | In-band-Login scheitert sichtbar, nebenan bleibt die unabhängige Console-Leitung verbunden. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L030 · Verse 2 · 142.4800–144.9800 s · «Management weg, kein Login mehr,» · **PRÜFEN**; E025; E026 |
| S041 | 144.9800 | 147.9200 | CONSOLE | Die Kamera folgt dieser Leitung bis zum lokalen SW3-Prompt. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L031 · Verse 2 · 144.9800–147.7400 s · «der Console Port ist unser Weg.»; E027 |
| S042 | 147.9200 | 150.6800 | PORT | Kein Port ist im STP-Blocking; die erwartete Blockierposition ist eine leere Statusfläche. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | L032 · Verse 2 · 147.9200–150.6600 s · «Blocking State, der niemals kam,» · **PRÜFEN** |
| S043 | 150.6800 | 153.8400 | AUSSEN | VLAN-120-STP ist deaktiviert, das Dreieck hat weiterhin drei weiterleitende Seiten. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L033 · Verse 2 · 150.6800–152.8400 s · «eine Bridge ohne Root, ohne Namen.»; E028 |
| S044 | 153.8400 | 155.1200 | CONSOLE | Das serielle Kabel bleibt als heller Pfad; ein montierter Prüflichtkegel fährt in den Rackgang. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L034 · Verse 2 · 153.8400–155.1200 s · «Konsolenkabel, Taschenlampe,» |
| S045 | 155.1200 | 158.9200 | AUSSEN | Eine langsame seitliche Suchfahrt liest an beiden Kabelenden SW3/24 und SW1/24. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L035 · Verse 2 · 155.1200–157.8800 s · «durch die Reihen im Serverraum.» |
| S046 | 158.9200 | 161.3800 | MAC | Portlabel, Flap-Liste und Ringübersicht treffen auf SW3 Gi1/0/24 zusammen. B03. | Orthogonale 50-mm-Makroaufnahme der MAC-/Port-Tafel. | Portnummer als Match Cut zur Topologie. | L036 · Verse 2 · 158.9200–161.2800 s · «Finde den Link, der den Ring schliesst,»; E029 |
| S047 | 161.3800 | 166.5600 | CONSOLE | Bei 161.38 s shutdown an SW3 Gi1/0/24; bis 164.18 s schliesst sein einziges falsches Ringende. B04. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L037 · Verse 2 · 161.3800–164.1800 s · «ein Port down und Stille kommt.»; E030 |
| S048 | 166.5600 | 168.9600 | AUSSEN | Final-BROADCAST-STORM zeigt die offene Kette mit verbleibenden, abfliessenden Kopien. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L038 · Final Chorus · 166.5600–167.6000 s · «Broadcast Storm.»; E031; E032 |
| S049 | 168.9600 | 171.9600 | CONSOLE | «Kein Root» bleibt technisch als STP deaktiviert sichtbar, Ring aber bereits unterbrochen. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | L039 · Final Chorus · 168.9600–170.7800 s · «Kein Root, kein Pfad.» |
| S050 | 171.9600 | 174.3400 | FABRIC | Zweiter Final-Titel nimmt die Perspektive der auslaufenden Fabric statt des Ringflugs ein. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | L040 · Final Chorus · 171.9600–173.1200 s · «Broadcast Storm.» |
| S051 | 174.3400 | 177.1600 | BUFFER | Der Schaden steht als historische Drop-Zahl; der neue Zuwachs fällt ab. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | L041 · Final Chorus · 174.3400–175.6200 s · «Spür den Schaden.» · **PRÜFEN** |
| S052 | 177.1600 | 179.7600 | PORT | Bereits abgeschalteter Gi1/0/24 aus der Innenseite: keine zweite Portänderung, keine weitere Runde. | Tiefe 28-mm-Fahrt durch die markierte Buchse; kein Wechsel der Port-ID. | Schnitt auf dieselbe Buchse innen/aussen. | L042 · Final Chorus · 177.1600–178.5000 s · «Ein Port down,» · **PRÜFEN** |
| S053 | 179.7600 | 181.7000 | BUFFER | Restliche Kopien verlassen die Queues; freie Plätze werden nacheinander sichtbar. | Seitlicher Dolly an Queue-Schächten, nie durch den Inhalt hindurch. | Harter Schnitt auf den nächsten gefüllten Schacht. | L043 · Final Chorus · 179.7600–181.5200 s · «die Flut zieht ab,»; E033 |
| S054 | 181.7000 | 184.5000 | MAC | Neue Frames lernen die H1-MAC stabil am richtigen Pfad; alte Flap-Logs bleiben historisch. | Orthogonale 50-mm-Makroaufnahme der MAC-/Port-Tafel. | Portnummer als Match Cut zur Topologie. | L044 · Final Chorus · 181.7000–184.4800 s · «das Netz lernt,» · **PRÜFEN** |
| S055 | 184.5000 | 186.7200 | AUSSEN | Zwischen den Switches fliesst begrenzter normaler Verkehr; physische Ruhe ersetzt die Kopiewolke. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Kabelkurve führt als Anschluss in den Port. | L045 · Final Chorus · 184.5000–186.7200 s · «was Stille heisst.» |
| S056 | 186.7200 | 194.0845 | CONSOLE | Management antwortet wieder; Gi1/0/24 ist administrativ down, kein neuer MAC-Flap. B05. | Starre Frontansicht des seriellen Terminals, kurze Fahrt entlang seines Kabels. | Promptkante führt zum bezeichneten Rack/Port. | Instrumental; E034; E035; E036 |
| S057 | 194.0845 | 201.4490 | FABRIC | Ein neuer Unicast-Test passiert die offene Kette und erhält Antwort; kein alter Storm-Frame wird dafür recycelt. | 18-mm-Verfolgung einer Kopie, Verzweigung seitlich in voller Tiefe zeigen. | Kopie-ID verbindet jeden Perspektivwechsel. | Instrumental; E037 |
| S058 | 201.4490 | 208.8135 | AUSSEN | Bei 202.9 s beginnt die Blende; das abgeschaltete Ringende bleibt als Ursache dokumentiert. | 24-mm-Kranfahrt über das feste Switchdreieck mit lesbaren Portenden. | Endbild bis 208.8135 s; dann Schwarz mit Dateiende. | Instrumental; E038; E039; E040 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L016 | BROADCAST STORM · kräftiger Eintritt, ruhiger Halt | 86.5200 | 88.0800 | 1.5600 | 86.7610 | BROADCAST STORM öffnet die Totalenansicht des überfüllten Rings. |
| L018 | BROADCAST STORM · kräftiger Eintritt, ruhiger Halt | 92.0000 | 93.6400 | 1.6400 | 92.0710 | Zweiter Titel liegt entlang einer Flutverzweigung mit immer neuen Kopien. |
| L025 | LOOP · kräftiger Eintritt, ruhiger Halt | 110.5400 | 111.8200 | 1.2800 | 110.6010 | LOOP markiert die vollständige räumliche Rundfahrt, nicht einen neuen Patchvorgang. |
| L026 | FLOOD · kräftiger Eintritt, ruhiger Halt | 119.4000 | 120.1000 | 0.7000 | 119.6710 | FLOOD sitzt am ersten offenen Abzweig; Eingangsport erhält keine eigene Rückkopie. |
| L027 | FLOOD · kräftiger Eintritt, ruhiger Halt | 120.8400 | 121.5600 | 0.7200 | 120.8710 | Zweites FLOOD folgt der nächsten Verzweigung derselben Abstammungslinie. |
| L028 | ZIEH DAS KABEL · kräftiger Eintritt, ruhiger Halt | 130.0600 | 131.7400 | 1.6800 | 130.1310 | ZIEH DAS KABEL erscheint als Arbeitsauftrag neben einer noch unbestimmten Portauswahl. |
| L038 | BROADCAST STORM · kräftiger Eintritt, ruhiger Halt | 166.5600 | 167.6000 | 1.0400 | 166.6410 | Final-BROADCAST-STORM zeigt die offene Kette mit verbleibenden, abfliessenden Kopien. |
| L040 | BROADCAST STORM · kräftiger Eintritt, ruhiger Halt | 171.9600 | 173.1200 | 1.1600 | 171.9710 | Zweiter Final-Titel nimmt die Perspektive der auslaufenden Fabric statt des Ringflugs ein. |
| L042 | PORT DOWN · kräftiger Eintritt, ruhiger Halt | 177.1600 | 178.5000 | 1.3400 | 177.2710 | Bereits abgeschalteter Gi1/0/24 aus der Innenseite: keine zweite Portänderung, keine weitere Runde. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / AUSSEN | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Die offene Kette SW1–SW2–SW3 von oben aufbauen; freie Port-24-Enden bleiben räumlich getrennt. |
| E002 | 7.2000 | energy_fall / ±0.5 | S001 / AUSSEN | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Die offene Kette SW1–SW2–SW3 von oben aufbauen; freie Port-24-Enden bleiben räumlich getrennt. |
| E003 | 9.6600 | section_boundary / ±0.35 | S002 / AUSSEN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Ein einzelnes loses Kabel hängt zwischen den offenen Enden SW3 und SW1; die Kette ist noch nicht geschlossen. |
| E004 | 21.5000 | energy_rise / ±0.5 | S006 / AUSSEN | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Der geschlossene VLAN-120-Ring wird als vollständige Ursache sichtbar, bevor viele Kopien entstehen. |
| E005 | 22.3000 | section_boundary / ±0.35 | S007 / FABRIC | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: H1 erzeugt B-001; Kamera begleitet ihn vom Clientport bis zur ersten Flooding-Gabel. |
| E006 | 32.9000 | energy_rise / ±0.5 | S008 / AUSSEN | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Eine Kopie nimmt den neuen Ringabschluss, die zweite den direkten Pfad; beide kehren aus anderer Richtung zurück. |
| E007 | 39.6110 | transient / ±0.04 | S009 / MAC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: MAC-Lernen kippt beim Wiedereintritt; der Loop ist durch Topologie und Header belegt. |
| E008 | 43.9600 | section_boundary / ±0.35 | S010 / FABRIC | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: B-001/a läuft SW1→SW2→SW3→SW1 und kommt als erhaltene Kopie zurück. |
| E009 | 56.0710 | transient / ±0.04 | S014 / FABRIC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: SW2 flutet ausser dem Eingangsport auf beide zulässigen VLAN-Ausgänge; die Abzweigung bleibt nachvollziehbar. |
| E010 | 62.0710 | transient / ±0.04 | S016 / BUFFER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Datenpfade und Puffer laufen voll, der separate CPU-Monitor schlägt rot aus. |
| E011 | 63.3000 | energy_fall / ±0.5 | S017 / CONSOLE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Ein In-band-Management-Request bleibt ohne Antwort; die Control-Plane-Kammer ist überlastet, nicht zerstört. |
| E012 | 66.5200 | section_boundary / ±0.35 | S018 / PORT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Grüne physische Linklampen stehen über dicht gefüllten Datenkanälen. |
| E013 | 86.5200 | section_boundary / ±0.35 | S022 / AUSSEN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: BROADCAST STORM öffnet die Totalenansicht des überfüllten Rings. |
| E014 | 87.9000 | energy_rise / ±0.5 | S022 / AUSSEN | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: BROADCAST STORM öffnet die Totalenansicht des überfüllten Rings. |
| E015 | 94.4710 | transient / ±0.04 | S025 / BUFFER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Drop-Counter und volle Queues zeigen den konkreten Schaden statt abstrakten roten Nebels. |
| E016 | 102.7010 | transient / ±0.04 | S028 / PORT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die verfügbare physische Drahtkapazität ist von Broadcasts belegt, sie wird nicht grösser. |
| E017 | 109.5000 | energy_rise / ±0.5 | S030 / BUFFER | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Eine alte Kopie fällt in einem vollen Puffer aus; andere Kopien treiben den Loop weiter. |
| E018 | 110.0710 | transient / ±0.04 | S030 / BUFFER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Eine alte Kopie fällt in einem vollen Puffer aus; andere Kopien treiben den Loop weiter. |
| E019 | 110.5400 | section_boundary / ±0.35 | S031 / AUSSEN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: LOOP markiert die vollständige räumliche Rundfahrt, nicht einen neuen Patchvorgang. |
| E020 | 116.4110 | transient / ±0.04 | S032 / FABRIC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Eine vollständige Ringrunde verfolgen; die Stamm-ID bleibt B-001, alle Kopien haben eigene filmische Suffixe. |
| E021 | 121.0000 | energy_fall / ±0.5 | S034 / FABRIC | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Zweites FLOOD folgt der nächsten Verzweigung derselben Abstammungslinie. |
| E022 | 131.9000 | energy_rise / ±0.5 | S037 / AUSSEN | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Portlabels des Fehlpatches im Suchlicht finden; der Link bleibt zunächst up. |
| E023 | 135.6110 | transient / ±0.04 | S037 / AUSSEN | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Portlabels des Fehlpatches im Suchlicht finden; der Link bleibt zunächst up. |
| E024 | 137.3800 | section_boundary / ±0.35 | S039 / CONSOLE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Unabhängigen seriellen Zugang bis SW3 verfolgen und den Prompt halten. |
| E025 | 142.4800 | section_boundary / ±0.35 | S040 / CONSOLE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: In-band-Login scheitert sichtbar, nebenan bleibt die unabhängige Console-Leitung verbunden. |
| E026 | 142.8000 | energy_fall / ±0.5 | S040 / CONSOLE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: In-band-Login scheitert sichtbar, nebenan bleibt die unabhängige Console-Leitung verbunden. |
| E027 | 147.1010 | transient / ±0.04 | S041 / CONSOLE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Kamera folgt dieser Leitung bis zum lokalen SW3-Prompt. |
| E028 | 153.6000 | energy_rise / ±0.5 | S043 / AUSSEN | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: VLAN-120-STP ist deaktiviert, das Dreieck hat weiterhin drei weiterleitende Seiten. |
| E029 | 160.3010 | transient / ±0.04 | S046 / MAC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Portlabel, Flap-Liste und Ringübersicht treffen auf SW3 Gi1/0/24 zusammen. B03. |
| E030 | 164.0000 | energy_fall / ±0.5 | S047 / CONSOLE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bei 161.38 s shutdown an SW3 Gi1/0/24; bis 164.18 s schliesst sein einziges falsches Ringende. B04. |
| E031 | 166.5600 | section_boundary / ±0.35 | S048 / AUSSEN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Final-BROADCAST-STORM zeigt die offene Kette mit verbleibenden, abfliessenden Kopien. |
| E032 | 168.5310 | transient / ±0.04 | S048 / AUSSEN | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Final-BROADCAST-STORM zeigt die offene Kette mit verbleibenden, abfliessenden Kopien. |
| E033 | 181.3810 | transient / ±0.04 | S053 / BUFFER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Restliche Kopien verlassen die Queues; freie Plätze werden nacheinander sichtbar. |
| E034 | 186.7200 | section_boundary / ±0.35 | S056 / CONSOLE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Management antwortet wieder; Gi1/0/24 ist administrativ down, kein neuer MAC-Flap. B05. |
| E035 | 186.7200 | last_vocal_end / ±0.5 | S056 / CONSOLE | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Management antwortet wieder; Gi1/0/24 ist administrativ down, kein neuer MAC-Flap. B05. |
| E036 | 188.2410 | transient / ±0.04 | S056 / CONSOLE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Management antwortet wieder; Gi1/0/24 ist administrativ down, kein neuer MAC-Flap. B05. |
| E037 | 197.3310 | transient / ±0.04 | S057 / FABRIC | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ein neuer Unicast-Test passiert die offene Kette und erhält Antwort; kein alter Storm-Frame wird dafür recycelt. |
| E038 | 202.9000 | fade_candidate / ±0.3 | S058 / AUSSEN | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: Bei 202.9 s beginnt die Blende; das abgeschaltete Ringende bleibt als Ursache dokumentiert. |
| E039 | 207.2000 | energy_fall / ±0.5 | S058 / AUSSEN | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bei 202.9 s beginnt die Blende; das abgeschaltete Ringende bleibt als Ursache dokumentiert. |
| E040 | 208.8140 | end / ±2.0833333333333333e-05 | S058 / AUSSEN | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Bei 202.9 s beginnt die Blende; das abgeschaltete Ringende bleibt als Ursache dokumentiert. |

## Referenz und Übergabeprüfung

[Cisco: Troubleshoot LAN Switching Environments](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/12006-chapter22.html) ist die Referenz für die Switching-Diagnose. Das Ring-/VLAN-Szenario und alle Zählwerte sind redaktionell simuliert.

Geprüft: 58 lückenlose Einstellungen von 0 bis 208.8135 s; alle 45 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 40 Events genau einmal zugeordnet; 9 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L017, L020, L025, L026, L027, L029, L030, L032, L041, L042, L044.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
