# 06 · ICMP — Die Rückmeldungen des Netzes

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [06_ICMP_1.0.wav](06_ICMP_1.0.wav) · SHA-256 `1acad3bf8ff6addcf656e2b92cb0273c123230c70dfb2ce3b36f1a5b780ac823`.
- Transkript: [06_ICMP_Transkript.json](06_ICMP_Transkript.json) · SHA-256 `307f7d74211d6f678b22e307048704a6d42ffd8b2801b95ddee0cb0e248a007f`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/06_ICMP/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `c02c34194055e149887086bf5e9d6b4834f654c60ade36c69c721bedceb376e3`.
- Exaktes Ende: **216.7735 s**, 10405128 Samples/Kanal bei 48000 Hz; Timecode 00:03:36.774 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 128.0 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Ein zusammenhängendes Routerland liegt auf einer dunklen, terrassierten Ebene. Vom Linux-Sender H aus führt die Hauptstrecke durch Gateway G1 und Router R2 zum Ziel D. Rückmeldungen haben schmale weisse Aussenhüllen und reisen immer zum auslösenden Sender zurück; die Datenrichtung ist cyan. Innen tragen Fehlermeldungen eine kleine, lesbare Kopie des ursprünglichen IP-Headers und Transportbeginns. Diese Zitatkapsel ist kein erneut gesendetes Originalpaket.

Jede Station hat eine eigene Mechanik: Echo ist ein weit offenes Zieltor mit einem Rückkanal, der MTU-Engpass eine starre 1400-Byte-Messöffnung, TTL eine Reihe gezählter Routerstufen. Der unerreichbare UDP-Dienst ist ein erreichbares Zielgehäuse mit verschlossenem Socket. Redirect bildet einen Seitenweg im lokalen LAN: H, G1 und G2 liegen auf derselben flachen Terrasse. So bleibt die alternative nächste Station räumlich nachvollziehbar.

Die Kamera fährt mit Paketen vorwärts und folgt Antworten in entgegengesetzter Richtung zurück. Bei einem Drop stoppt sie am unveränderten Engpass, schwenkt zur neu erzeugten Fehlermeldung und verlässt mit ihr den Ort. Es gibt weder heilende Paketverkleinerung noch Teleportation. Typ/Code liegen auf der jeweiligen ICMP-Schicht, IP-TTL auf dem äusseren IP-Header. Der letzte Chorus versammelt die fünf bereits verstandenen Wege zu einer verbundenen Landschaft.

## Fachszenario

IPv4-Labornetz: H=192.0.2.10/24, G1=192.0.2.1, G2=192.0.2.2. Hauptweg H→G1→R2→D=198.51.100.20. Transit G1–R2 liegt in 10.0.12.0/30, R2=10.0.12.2. R2s Ausgang zum Zielnetz hat MTU 1400; der Senderlink hat MTU 1500. D beantwortet ICMP Echo, bietet für die PMTUD-Demonstration einen UDP-Testempfänger auf 9000 und hat keinen UDP-Listener auf den Traceroute-Ports 33434+. Ein funktionierendes Echo beweist keinen beliebigen Dienst.

Vorgang 1: E-01 Echo Request 8/0, E-02 Echo Reply 0/0, identische Echo-ID 4242/seq 1, Daten erhalten. Vorgang 2: P-M1 ist ein 1500-Byte-IPv4/UDP-Datagramm mit DF=1 zu D:9000. R2 verwirft es. I-M1 ist ICMP 3/4, Next-Hop MTU 1400, inklusive Zitat von P-M1. H reduziert die IP-Datagrammgrösse und sendet P-M2 neu: 1400 Byte total = 20 IP + 8 UDP + 1372 Nutzdaten. P-M1 existiert nicht weiter. Ein Seitenbild zeigt das mögliche Black-Hole bei gefiltertem I-M1 ausdrücklich als Gegenbeispiel, nicht als Änderung der laufenden Strecke.

Vorgang 3: UDP-Traceroute sendet getrennte Probes T-1 TTL 1, T-2 TTL 2, T-3 TTL 3. G1 bzw. R2 verwirft die erste/zweite Probe bei TTL-Ablauf und sendet 11/0. D empfängt T-3 und antwortet 3/3, weil der UDP-Port nicht belegt ist. Das ist zugleich Vorgang 4, Destination Unreachable mit eindeutigem Port-Code; keine Behauptung eines unerreichbaren Hosts. Vorgang 5: Ziel 203.0.113.20 ist über G2 erreichbar, H nutzt zunächst G1. G1 leitet dasselbe Datagramm über dieselbe LAN-Schnittstelle zu G2 weiter und sendet H einen Host Redirect 5/1 mit Gateway 192.0.2.2. Im explizit freigeschalteten isolierten Laborszenario prüft H Absender, Zitat und lokalen Next Hop, bevor ein neues Paket direkt G2 nutzt. Das ist keine allgemeine Aufforderung, Redirects produktiv zu aktivieren.

## Kontinuität

ICMP ist hier ausschliesslich IPv4. Typ/Code: Request 8/0, Reply 0/0, PMTUD 3/4, TTL 11/0, UDP-Port 3/3, Host Redirect 5/1. Keine ICMPv6-Werte. Jede Fehlerantwort ist ein neues IP-Paket mit Quelle des meldenden Routers/Hosts und Ziel H; das Original ist nur im Zitat enthalten. Echo Reply besitzt Echo-ID/Sequenz und Daten, kein Fehlerzitat.
P-M1 verworfen, I-M1 zurück, P-M2 neu; niemals das alte Paket am Gate schrumpfen. Traceroute-Probes sind ebenfalls jeweils neue Datagramme. R2 senkt nur sein eigenes ausgehendes MTU-Limit, nicht dynamisch die gesamte Topologie.
Redirect-Zweig teilt das LAN mit H/G1/G2; G1 ist Hs aktuelles Gateway. Die Annahme ist eine bewusste Laborkonfiguration, in der H Routervertrauen und Next Hop validiert. Die frühe Hook-Aufzählung von Redirect ist eine beschriftete Übersicht, die eigentliche Route ändert sich erst nach 161.62 s. Final Chorus bestätigt die fünf Vorgänge, erzeugt keinen neuen Ausfall.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01s ping-Ergebnis erscheint erst nach der Echo-Rückkehr bei 28.48 s. B02 zeigt zunächst P-M1 und DROP 84.24 s, dann 3/4 bei 86.62 s, dann PMTU und neues P-M2 ab 92.06 s. B03s Hopzeilen kommen nach den jeweiligen Probes; vollständige Traceroute-Ausgabe erst 127.62 s. B04 ergänzt danach den Ziel-Port-Code. B05 zeigt zuerst LAN/Redirect, dessen Annahme und neuen direkten Weg erst ab 161.62 s. B06 ist die gespeicherte Zusammenfassung; die kurze Request/Reply-Typografie im Outro ersetzt nie die lange lesbaren Headerkarten.

Linux-Ausgaben und Headerkarten sind gekürzte, simulierte Ausschnitte. Der PMTUD-UDP-Test ist eine eigens bezeichnete Laborquelle, kein aus ping abgeleiteter Anwendungsnachweis. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 25.7600–43.8800 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B02 | 83.4800–98.0800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |
| B03 | 112.6600–136.5400 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |
| B04 | 127.6200–136.5400 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B05 | 152.2000–169.6200 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |
| B06 | 169.6200–199.6200 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |

### B01 · 25.7600–43.8800 s

```text
h$ ping -c 1 198.51.100.20
PING 198.51.100.20 (198.51.100.20) 56(84) bytes of data.
64 bytes from 198.51.100.20: icmp_seq=1 ttl=62 time=8.4 ms
1 packets transmitted, 1 received, 0% packet loss
Headerkarte: E-01 8/0 -> E-02 0/0 | Echo ID 4242 Seq 1
```

### B02 · 83.4800–98.0800 s

```text
P-M1 | IPv4 len 1500 | DF 1 | UDP dst 9000 | IP ID 0x1201
R2: MTU 1400 -> DROP
I-M1 | src 10.0.12.2 -> dst 192.0.2.10
ICMP Type 3 Code 4 | Next-Hop MTU 1400
Quoted: P-M1 IP header + UDP header
P-M2 | NEU | IPv4 len 1400 | DF 1 | IP ID 0x1202
20 IP + 8 UDP + 1372 Daten = 1400 Byte
Gegenbeispiel gefiltertes ICMP: separat gekennzeichnet
```

### B03 · 112.6600–136.5400 s

```text
h$ traceroute -n -q 1 -m 3 198.51.100.20
traceroute to 198.51.100.20, 3 hops max, 60 byte packets
 1  192.0.2.1      1.2 ms
 2  10.0.12.2     3.6 ms
 3  198.51.100.20 8.7 ms
Overlay: UDP-Probes TTL 1/2/3 = drei neue Datagramme
Antworten: G1 11/0 | R2 11/0 | D 3/3
```

### B04 · 127.6200–136.5400 s

```text
T-3: UDP-Traceroute-Zielport | TTL bei Sender 3
D erreicht, UDP-Socket nicht belegt
ICMP src 198.51.100.20 -> dst 192.0.2.10
Type 3 Code 3: Destination Unreachable / Port Unreachable
Zitat: IP-Header T-3 + erste 8 Byte UDP
```

### B05 · 152.2000–169.6200 s

```text
Isoliertes Laborszenario, Redirect-Annahme explizit freigeschaltet
Auslöser: H -> 203.0.113.20 zunächst via G1
ICMP src 192.0.2.1 -> dst 192.0.2.10
Type 5 Code 1: Redirect for Host
Gateway: 192.0.2.2
Zitat: ursprünglicher IP-Header + Transportbeginn
Prüfung: aktueller Gateway / passendes Zitat / Next Hop im LAN
Erst danach: neues Paket direkt H -> G2
```

### B06 · 169.6200–199.6200 s

```text
IPv4 ICMP — geprüfte Vorgänge
8/0  Echo Request      0/0  Echo Reply
3/4  Fragmentation Needed (DF, MTU 1400)
11/0 TTL Exceeded in Transit
3/3  Destination Unreachable: UDP Port
5/1  Redirect: Host, Gateway 192.0.2.2
Jede Fehlerantwort referenziert ihr eigenes Original
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 7.5800 | LAND | Von H über G1 und R2 zum Ziel fahren; der lokale G2-Abzweig ist auf derselben H-Terrasse sichtbar. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | Instrumental; E001; E002; E003 |
| S002 | 7.5800 | 11.1800 | ECHO | Die einfache Echo-Strecke leuchtet als erster bekannter Weg auf. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L001 · Intro · 7.5800–9.4800 s · «Du kennst mich als Ping.»; E004 |
| S003 | 11.1800 | 15.2400 | LAND | Kamera hebt über diese Strecke hinaus zu vier weiteren, noch unbenutzten Stationen. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L002 · Intro · 11.1800–13.2800 s · «Du kennst nur den Anfang.» |
| S004 | 15.2400 | 16.6600 | HEADER | ICMP erscheint am Protokollfeld eines bereitliegenden Antwortschemas. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L003 · Intro · 15.2400–16.0200 s · «ICMP.»; E005 |
| S005 | 16.6600 | 19.6600 | SENDER | H öffnet den Rückmeldungsbereich statt nur den Echo-Zähler zu betrachten. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L004 · Intro · 16.6600–19.6600 s · «Hör hin.» · **PRÜFEN** |
| S006 | 19.6600 | 25.7600 | ECHO | Request und Reply als zwei verschiedene Träger auf Gegenrichtungen vorbereiten; gleiche Echo-ID ist das Verbindungsmerkmal. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | Instrumental; E006 |
| S007 | 25.7600 | 28.4800 | SENDER | Linux-Prompt startet einen einzelnen ping zu D; E-01 wird neu erzeugt. B01. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L005 · Verse 1 · 25.7600–28.4800 s · «Du tippst vier Zeichen, wartest kurz,»; E007; E008 |
| S008 | 28.4800 | 33.3400 | ECHO | D erzeugt E-02 mit erhaltener Echo-ID, Sequenz und Daten und sendet ihn zurück. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L006 · Verse 1 · 28.4800–31.1600 s · «ein Echo kommt zu dir zurück.» |
| S009 | 33.3400 | 36.9000 | HEADER | Echo Request trägt Type 8 Code 0 im ICMP-Header; IP-Protokoll 1 bleibt separate Schicht. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L007 · Verse 1 · 33.3400–34.8400 s · «Echo Request.» |
| S010 | 36.9000 | 40.4200 | HEADER | Echo Reply trägt Type 0 Code 0, ID 4242/seq 1 stimmt mit E-01 überein. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L008 · Verse 1 · 36.9000–38.5600 s · «Echo Reply.» |
| S011 | 40.4200 | 43.8800 | SENDER | RTT 8.4 ms wird als Ergebnis dieses Echo-Vorgangs gelesen, nicht als App-Latenz. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L009 · Verse 1 · 40.4200–43.8800 s · «Du misst die Zeit und gehst vorbei.» |
| S012 | 43.8800 | 49.3600 | SOCKET | D ist erreichbar, daneben bleibt ein UDP-Dienstsocket geschlossen. | 50-mm-Fahrt vom Zielhost bis zum verschlossenen UDP-Socket. | Code 3/3 führt als Rückweg zum Sender. | L010 · Verse 1 · 43.8800–47.8200 s · «Der Host gibt Antwort, doch dein Dienst steht still.» |
| S013 | 49.3600 | 51.8000 | SENDER | Ping-Erfolg und fehlende UDP-Anwendungsantwort stehen als unterschiedliche Prüfungen nebeneinander. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L011 · Verse 1 · 49.3600–51.6600 s · «Ein Ping sagt nicht, ob deine App auch will.» · **PRÜFEN** |
| S014 | 51.8000 | 55.6600 | LAND | Vom Echo-Weg zu MTU, TTL und lokalem LAN-Abzweig fahren. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L012 · Verse 1 · 51.8000–55.3800 s · «Du kennst mein Echo, übersiehst den Rest.» |
| S015 | 55.6600 | 60.6000 | HEADER | Die Zitatkapsel einer Fehlerantwort wird als weiterer Informationskanal vorbereitet. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L013 · Verse 1 · 55.6600–59.3000 s · «Ich spreche dort, wo dich das Netz im Dunkeln lässt.»; E009 |
| S016 | 60.6000 | 61.3400 | LAND | ICMP-Hook weitet den Blick auf die gesamte Routerlandschaft. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L014 · Chorus · 60.6000–61.3400 s · «ICMP.»; E010 |
| S017 | 61.3400 | 63.0600 | ECHO | Echo ist nur eine von fünf sichtbar beschrifteten Stationen. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L015 · Chorus · 61.3400–62.8800 s · «Mehr als ein Ping.» |
| S018 | 63.0600 | 65.0000 | SENDER | Mehrere Testanfragen liegen bereit, jeweils eigene IDs statt identischer Ping-Kopien. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L016 · Chorus · 63.0600–64.7800 s · «Jeder ruft mich.» |
| S019 | 65.0000 | 67.6000 | HEADER | Die ankommenden Antwortfelder bleiben zunächst ungeöffnet. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L017 · Chorus · 65.0000–66.6600 s · «Kaum einer hört hin.» |
| S020 | 67.6000 | 68.6800 | LAND | Zweites ICMP spannt die gemeinsame Rückwegachse zum Sender auf. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L018 · Chorus · 67.6000–68.3400 s · «ICMP.» |
| S021 | 68.6800 | 70.5600 | HEADER | Typ und Code werden grösser als die blosse Rot-/Grünanzeige. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L019 · Chorus · 68.6800–70.2800 s · «Unterschätz meine Stimme nicht.» |
| S022 | 70.5600 | 73.2400 | MTU | Kamera fährt auf die starre 1400-Byte-Öffnung zu, ein grosses DF-Datagramm wartet davor. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | L020 · Chorus · 70.5600–73.2400 s · «Wo dein Paket an Grenzen stößt,» |
| S023 | 73.2400 | 75.6200 | HEADER | Das Fehlerzitat zeigt die Bindung der Rückmeldung an genau dieses Original. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L021 · Chorus · 73.2400–75.5200 s · «bring ich den Grund ans Licht.»; E011; E012; E013 |
| S024 | 75.6200 | 79.3600 | ECHO | Kleiner Echo-Verkehr passiert, der UDP-Transfer P-M1 mit 1500 Byte scheitert am nächsten Engpass. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L022 · Verse 2 · 75.6200–78.7200 s · «Ping kommt durch, der Transfer steht,»; E014 |
| S025 | 79.3600 | 83.4800 | MTU | P-M1 trifft vollständig auf die zu kleine Öffnung; seine Gesamtgrösse bleibt 1500 Byte. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | L023 · Verse 2 · 79.3600–82.5400 s · «weil das große Paket nicht weitergeht.» |
| S026 | 83.4800 | 84.2400 | HEADER | DF=1 wird auf dem IP-Header P-M1s sichtbar, nicht auf ICMP. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L024 · Verse 2 · 83.4800–84.2400 s · «Don't Fragment.» |
| S027 | 84.2400 | 86.6200 | MTU | R2 verwirft P-M1 vollständig; keine Fragmenthälften verlassen den Ausgang. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | L025 · Verse 2 · 84.2400–86.6200 s · «Der Router wirft es raus.» |
| S028 | 86.6200 | 88.6000 | HEADER | Neu erzeugtes I-M1 trägt Type 3 Code 4 und Next-Hop MTU 1400. B02. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L026 · Verse 2 · 86.6200–88.6000 s · «Fragmentation Needed.» · **PRÜFEN** |
| S029 | 88.6000 | 90.3800 | MTU | I-M1 reist von R2 zurück nach H, sein Zitat referenziert P-M1. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | L027 · Verse 2 · 88.6000–90.3800 s · «Die Antwort zeigt den Engpass auf.»; E015 |
| S030 | 90.3800 | 92.0600 | SENDER | Der PMTU-Eintrag für D übernimmt den bestätigten Wert 1400. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L028 · Verse 2 · 90.3800–92.0600 s · «Path MTU Discovery.»; E016; E017 |
| S031 | 92.0600 | 94.3800 | SENDER | H baut P-M2 neu mit 1400 Byte; P-M1 bleibt im Verlustarchiv. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L029 · Verse 2 · 92.0600–94.3800 s · «Der Sender passt die Größe an.» |
| S032 | 94.3800 | 96.4200 | HEADER | Markiertes Gegenbeispiel: ein Filter hält eine Kopie der erklärenden Fehlermeldung zurück, nicht auf der Hauptstrecke. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L030 · Verse 2 · 94.3800–96.4200 s · «Sperrst du die Meldung, fehlt der Hinweis,» |
| S033 | 96.4200 | 98.0800 | SENDER | Gegenbeispiel-Panel zeigt wiederholte zu grosse Transfers ohne Hinweis; Haupt-PMTU bleibt 1400. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L031 · Verse 2 · 96.4200–98.0800 s · «und dein Transfer hängt daran.» |
| S034 | 98.0800 | 99.9400 | ECHO | Hook zeigt die bereits gespeicherte Echo-Reply-Schicht 0/0 als Referenzkarte. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L032 · Hook · 98.0800–99.7800 s · «Echo Reply.»; E018 |
| S035 | 99.9400 | 101.8600 | TTL | TIME EXCEEDED ist die beschriftete nächste Station, noch kein neuer Probeverlust. | 24-mm-Fahrt über gezählte Routerstufen mit stets sichtbarem TTL-Feld. | Neue Probe übernimmt die Achse, nicht die Identität. | L033 · Hook · 99.9400–101.8600 s · «Time Exceeded.»; E019 |
| S036 | 101.8600 | 103.1000 | LAN | REDIRECT erscheint als Vorschau auf den lokalen Abzweig; H nutzt weiter G1. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | L034 · Hook · 101.8600–102.8000 s · «Redirect.» |
| S037 | 103.1000 | 105.1200 | HEADER | Drei benannte Antwortkarten stehen neben ihrem jeweils auslösenden Vorgang. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L035 · Hook · 103.1000–105.1200 s · «Hör, was das Netz dir sagt.»; E020 |
| S038 | 105.1200 | 108.3200 | LAND | ICMP liegt auf der zusammenhängenden Rückwegachse aller Stationen. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L036 · Hook · 105.1200–105.8200 s · «ICMP.»; E021 |
| S039 | 108.3200 | 112.6600 | ECHO | Die Kamera verlässt die reine Echo-Strecke in Richtung TTL-Terrassen. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L037 · Hook · 108.3200–109.8800 s · «Mehr als ein Ping.» · **PRÜFEN** |
| S040 | 112.6600 | 116.9600 | SENDER | Traceroute erzeugt T-1 mit TTL 1, T-2 und T-3 bleiben neue, getrennte Probes. B03. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L038 · Verse 3 · 112.6600–115.7000 s · «Du schickst die Probe weiter raus,»; E022 |
| S041 | 116.9600 | 120.0200 | TTL | T-1 erreicht G1, TTL läuft ab; das Original endet an der ersten Stufe. | 24-mm-Fahrt über gezählte Routerstufen mit stets sichtbarem TTL-Feld. | Neue Probe übernimmt die Achse, nicht die Identität. | L039 · Verse 3 · 116.9600–120.0200 s · «die TTL läuft unterwegs aus.» · **PRÜFEN** |
| S042 | 120.0200 | 121.5000 | HEADER | G1 erzeugt ICMP 11/0 mit dem Zitat von T-1. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L040 · Verse 3 · 120.0200–121.5000 s · «Time Exceeded.» |
| S043 | 121.5000 | 124.2800 | TTL | Die Fehlermeldung läuft G1→H zurück; Absender .1 wird zur ersten Hopzeile. | 24-mm-Fahrt über gezählte Routerstufen mit stets sichtbarem TTL-Feld. | Neue Probe übernimmt die Achse, nicht die Identität. | L041 · Verse 3 · 121.5000–123.5800 s · «Ein Router meldet sich.»; E023 |
| S044 | 124.2800 | 125.7200 | SENDER | Neue Probe T-2 mit TTL 2 geht auf die Strecke; T-1 wird nicht weitergeschickt. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L042 · Verse 3 · 124.2800–125.7200 s · «Traceroute folgt diesen Spuren,»; E024 |
| S045 | 125.7200 | 127.6200 | TTL | R2 antwortet 11/0 auf T-2; danach startet T-3 mit TTL 3 und erreicht D. | 24-mm-Fahrt über gezählte Routerstufen mit stets sichtbarem TTL-Feld. | Neue Probe übernimmt die Achse, nicht die Identität. | L043 · Verse 3 · 125.7200–127.6200 s · «Hop für Hop wird sichtbar für dich.»; E025 |
| S046 | 127.6200 | 129.9000 | SOCKET | D empfängt T-3 auf einem unbesetzten UDP-Port und erzeugt Destination Unreachable. | 50-mm-Fahrt vom Zielhost bis zum verschlossenen UDP-Socket. | Code 3/3 führt als Rückweg zum Sender. | L044 · Verse 3 · 127.6200–129.9000 s · «Destination Unreachable.» |
| S047 | 129.9000 | 131.7800 | HEADER | Type 3 Code 3 PORT UNREACHABLE steht gross an Ds Antwortheader. B04. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L045 · Verse 3 · 129.9000–131.6000 s · «Lies den Code, bevor du rätst.» |
| S048 | 131.7800 | 133.1000 | HEADER | Das Zitat liefert T-3s UDP-Zielport und IP-ID statt eines pauschalen Hostfehlers. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L046 · Verse 3 · 131.7800–133.1000 s · «Ein Fehler hat dir mehr zu sagen» · **PRÜFEN** |
| S049 | 133.1000 | 136.5400 | SENDER | Traceroute zeigt D als erreichtes Ende; der unerreichbare Port ist benannt. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L047 · Verse 3 · 133.1000–135.4600 s · «als ein Kreis, der sich nur dreht.»; E026 |
| S050 | 136.5400 | 137.9800 | LAND | Wiederkehrender ICMP-Hook blickt auf nun bekannte Echo-, MTU- und TTL-Rückwege. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L048 · Chorus · 136.5400–137.6800 s · «ICMP.»; E027; E028 |
| S051 | 137.9800 | 139.7400 | HEADER | Die geöffneten Typ/Code-Karten ergänzen den alten Echo-Zähler. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L049 · Chorus · 137.9800–139.7400 s · «Mehr als ein Ping.» |
| S052 | 139.7400 | 141.8600 | SENDER | Neue Testanfragen bleiben voneinander getrennt; nicht jeder Test ist ping. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L050 · Chorus · 139.7400–141.6400 s · «Jeder ruft mich.»; E029 |
| S053 | 141.8600 | 143.5600 | SOCKET | Der geschlossene UDP-Port bleibt beschriftet, während der Host weiter antwortet. | 50-mm-Fahrt vom Zielhost bis zum verschlossenen UDP-Socket. | Code 3/3 führt als Rückweg zum Sender. | L051 · Chorus · 141.8600–143.5600 s · «Kaum einer hört hin.» |
| S054 | 143.5600 | 145.5000 | LAND | ICMP zieht die rückwärts laufenden weissen Hüllen zum Sender zusammen. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L052 · Chorus · 143.5600–145.2000 s · «ICMP.» |
| S055 | 145.5000 | 147.1600 | HEADER | Fehlerzitate und Absender bleiben als nutzbare Rückmeldung lesbar. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L053 · Chorus · 145.5000–147.1600 s · «Unterschätz meine Stimme nicht.» |
| S056 | 147.1600 | 150.1400 | MTU | Neues P-M2 passiert die 1400-Byte-Öffnung; der zuvor verlorene P-M1 erscheint nicht. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | L054 · Chorus · 147.1600–150.1400 s · «Wo dein Paket an Grenzen stößt,»; E030 |
| S057 | 150.1400 | 152.2000 | SENDER | UDP-Testempfänger 9000 bestätigt P-M2; Ping und Transfer sind separat geprüft. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L055 · Chorus · 150.1400–152.2000 s · «bring ich den Grund ans Licht.»; E031; E032 |
| S058 | 152.2000 | 154.4000 | LAN | G1s Route zu 203.0.113.20 zeigt G2 als besseren Next Hop im lokalen LAN. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | L056 · Verse 4 · 152.2000–154.4000 s · «Dein Gateway kennt den nächsten Router,»; E033 |
| S059 | 154.4000 | 156.3600 | LAN | H .10, G1 .1 und G2 .2 liegen sichtbar auf derselben /24-Ebene. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | L057 · Verse 4 · 154.4000–156.3600 s · «im selben Netz wie dein Gerät.» |
| S060 | 156.3600 | 157.9400 | HEADER | G1 sendet Host Redirect Type 5 Code 1 mit Gateway .2 und Zitat des ausgelösten Pakets. B05. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L058 · Verse 4 · 156.3600–157.8200 s · «Redirect sagt deinem Host,» |
| S061 | 157.9400 | 159.6600 | LAN | Das Original wird von G1 zu G2 weitergeleitet, Redirect läuft getrennt zu H zurück. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | L059 · Verse 4 · 157.9400–159.6600 s · «dass es für dieses Ziel direkter geht.» |
| S062 | 159.6600 | 161.6200 | SENDER | H prüft Absender .1, aktuellen Gateway, Zitat und den lokalen Next Hop .2. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L060 · Verse 4 · 159.6600–161.6200 s · «Du prüfst den Hinweis, prüfst die Quelle,» |
| S063 | 161.6200 | 163.5200 | LAN | Erst ab 161.62 s nimmt ein neues Datagramm H→G2 direkt; die alte Sendung bleibt via G1. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | L061 · Verse 4 · 161.6200–163.5200 s · «bevor dein Host den Weg neu wählt.» |
| S064 | 163.5200 | 165.8200 | HEADER | Die geprüfte 5/1-Rückmeldung wird im lokalen Routeneintrag verankert. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L062 · Verse 4 · 163.5200–165.4800 s · «Ich bin die Stimme aus der Leitung.»; E034 |
| S065 | 165.8200 | 169.6200 | LAND | Der neue lokale Abzweig liegt neben der unveränderten Hauptstrecke zu D. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L063 · Verse 4 · 165.8200–167.6600 s · «Jetzt hörst du, was das Netz erzählt.»; E035; E036 |
| S066 | 169.6200 | 170.2200 | LAND | Final-ICMP öffnet die Totale mit allen fünf abgeschlossenen Vorgängen. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L064 · Final Chorus · 169.6200–170.2200 s · «ICMP.»; E037 |
| S067 | 170.2200 | 171.6400 | ECHO | Echo-Request und -Reply sind ein gekoppeltes Paar unter den weiteren Rückmeldungen. | 32-mm-Verfolgung hin und spiegelbildlich zurück. | Echo-ID verbindet Request und Reply. | L065 · Final Chorus · 170.2200–171.6400 s · «Mehr als ein Ping.» |
| S068 | 171.6400 | 173.7200 | SENDER | Testliste zeigt Echo, PMTU, Trace, UDP-Port und Redirect als verschiedene Aufträge. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L066 · Final Chorus · 171.6400–173.5000 s · «Jeder ruft mich.» |
| S069 | 173.7200 | 176.5000 | HEADER | Geöffnete Antwortfelder ersetzen den zuvor ungeöffneten Rückmeldebereich. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L067 · Final Chorus · 173.7200–175.4000 s · «Jetzt hörst du hin.» |
| S070 | 176.5000 | 177.4000 | LAND | ICMP liegt auf der verbundenen Landschaft, jede Station behält ihre Mechanik. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L068 · Final Chorus · 176.5000–177.1000 s · «ICMP.» |
| S071 | 177.4000 | 179.0600 | HEADER | Die sechs Typ/Code-Karten stehen neben ihren konkreten Quellen. B06. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L069 · Final Chorus · 177.4000–179.0600 s · «Unterschätz meine Stimme nicht.»; E038 |
| S072 | 179.0600 | 181.3600 | MTU | Erfolgreicher kleiner Transfer und archivierter grosser Drop bleiben gleichzeitig nachvollziehbar. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | L070 · Final Chorus · 179.0600–181.3600 s · «Das Netz hat dir genug zu sagen.» |
| S073 | 181.3600 | 184.7800 | LAN | Validierter direkter Next Hop bleibt aktiv; kein neuer Redirect ändert die Haupttopologie. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | L071 · Final Chorus · 181.3600–184.7800 s · «Hör zu, wenn es mit dir spricht.»; E039; E040 |
| S074 | 184.7800 | 190.6400 | HEADER | Alle fünf Vorgänge als gespeicherte Ergebniskarten halten; keine neuen Fehler erzeugen. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | Instrumental; E041; E042 |
| S075 | 190.6400 | 191.3200 | HEADER | REQUEST hebt Type 8 Code 0 des bekannten Echo-Vorgangs hervor. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L072 · Outro · 190.6400–191.2400 s · «Request.»; E043 |
| S076 | 191.3200 | 191.8000 | HEADER | REPLY hebt Type 0 Code 0 desselben Echo-Paares hervor, die beiden Karten bleiben anschliessend lesbar. | Makro auf die ICMP-Schicht, dann zurück zum zitierten Originalheader. | Referenz-ID als Match Cut zum auslösenden Datagramm. | L073 · Outro · 191.3200–191.8000 s · «Reply.» |
| S077 | 191.8000 | 198.2200 | SENDER | Die gespeicherte Testliste zeigt mehr als die Echo-Zeitmessung. | Starre 50-mm-Frontansicht des Linux-Testpanels. | Neu erzeugter Paketträger führt aus dem Panel. | L074 · Outro · 191.8000–195.7800 s · «Du kennst jetzt mehr.» · **PRÜFEN**; E044 |
| S078 | 198.2200 | 199.6200 | LAND | Letztes ICMP verbindet Quelle, Router und Ziel; alle Endzustände bleiben stabil. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Paketbahn führt in die nächste Station. | L075 · Outro · 198.2200–199.6200 s · «ICMP.» |
| S079 | 199.6200 | 205.3378 | MTU | Neues kleineres Testpaket durch R2 bis zum UDP-Testempfänger verfolgen. | Orthogonale Seitenansicht der 1400-Byte-Öffnung; kein perspektivisches Schrumpfen. | Nach Drop Schwenk auf die neue Rückmeldung. | Instrumental; E045; E046 |
| S080 | 205.3378 | 211.0557 | LAN | Ein weiteres neues Paket benutzt den validierten G2-Weg; G1 bleibt erreichbar. | Hohe 28-mm-Totale mit H, G1 und G2 auf einer Ebene. | Gatewayfeld führt zum neuen direkten Next Hop. | Instrumental; E047 |
| S081 | 211.0557 | 216.7735 | LAND | Die Gesamtlandschaft langsam zurücknehmen; letzter Pegelabfall bei 212.8 s dimmt nur Licht, bis 216.7735 s stabiler Zustand. | 20-mm-Kranfahrt über alle verbundenen Terrassen. | Endbild bis 216.7735 s; dann Schwarz mit Dateiende. | Instrumental; E048; E049 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L003 | ICMP · kräftiger Eintritt, ruhiger Halt | 15.2400 | 16.0200 | 0.7800 | kein Onset im Cue; nur Gesangseintritt | ICMP erscheint am Protokollfeld eines bereitliegenden Antwortschemas. |
| L007 | ECHO REQUEST · kräftiger Eintritt, ruhiger Halt | 33.3400 | 34.8400 | 1.5000 | 33.4910 | Echo Request trägt Type 8 Code 0 im ICMP-Header; IP-Protokoll 1 bleibt separate Schicht. |
| L008 | ECHO REPLY · kräftiger Eintritt, ruhiger Halt | 36.9000 | 38.5600 | 1.6600 | 37.0010 | Echo Reply trägt Type 0 Code 0, ID 4242/seq 1 stimmt mit E-01 überein. |
| L014 | ICMP · kräftiger Eintritt, ruhiger Halt | 60.6000 | 61.3400 | 0.7400 | 60.9010 | ICMP-Hook weitet den Blick auf die gesamte Routerlandschaft. |
| L018 | ICMP · kräftiger Eintritt, ruhiger Halt | 67.6000 | 68.3400 | 0.7400 | 67.7010 | Zweites ICMP spannt die gemeinsame Rückwegachse zum Sender auf. |
| L024 | DF = 1 · kräftiger Eintritt, ruhiger Halt | 83.4800 | 84.2400 | 0.7600 | 83.5310 | DF=1 wird auf dem IP-Header P-M1s sichtbar, nicht auf ICMP. |
| L026 | FRAGMENTATION NEEDED · kräftiger Eintritt, ruhiger Halt | 86.6200 | 88.6000 | 1.9800 | 86.6910 | Neu erzeugtes I-M1 trägt Type 3 Code 4 und Next-Hop MTU 1400. B02. |
| L032 | ECHO REPLY · kräftiger Eintritt, ruhiger Halt | 98.0800 | 99.7800 | 1.7000 | 98.1710 | Hook zeigt die bereits gespeicherte Echo-Reply-Schicht 0/0 als Referenzkarte. |
| L033 | TIME EXCEEDED · kräftiger Eintritt, ruhiger Halt | 99.9400 | 101.8600 | 1.9200 | 100.0510 | TIME EXCEEDED ist die beschriftete nächste Station, noch kein neuer Probeverlust. |
| L034 | REDIRECT · kräftiger Eintritt, ruhiger Halt | 101.8600 | 102.8000 | 0.9400 | 101.9310 | REDIRECT erscheint als Vorschau auf den lokalen Abzweig; H nutzt weiter G1. |
| L036 | ICMP · kräftiger Eintritt, ruhiger Halt | 105.1200 | 105.8200 | 0.7000 | 105.2110 | ICMP liegt auf der zusammenhängenden Rückwegachse aller Stationen. |
| L040 | TIME EXCEEDED · kräftiger Eintritt, ruhiger Halt | 120.0200 | 121.5000 | 1.4800 | 120.1110 | G1 erzeugt ICMP 11/0 mit dem Zitat von T-1. |
| L048 | ICMP · kräftiger Eintritt, ruhiger Halt | 136.5400 | 137.6800 | 1.1400 | 136.6110 | Wiederkehrender ICMP-Hook blickt auf nun bekannte Echo-, MTU- und TTL-Rückwege. |
| L052 | ICMP · kräftiger Eintritt, ruhiger Halt | 143.5600 | 145.2000 | 1.6400 | 143.6410 | ICMP zieht die rückwärts laufenden weissen Hüllen zum Sender zusammen. |
| L064 | ICMP · kräftiger Eintritt, ruhiger Halt | 169.6200 | 170.2200 | 0.6000 | 169.6610 | Final-ICMP öffnet die Totale mit allen fünf abgeschlossenen Vorgängen. |
| L068 | ICMP · kräftiger Eintritt, ruhiger Halt | 176.5000 | 177.1000 | 0.6000 | 176.6910 | ICMP liegt auf der verbundenen Landschaft, jede Station behält ihre Mechanik. |
| L072 | REQUEST · kräftiger Eintritt, ruhiger Halt | 190.6400 | 191.2400 | 0.6000 | 190.6410 | REQUEST hebt Type 8 Code 0 des bekannten Echo-Vorgangs hervor. |
| L073 | REPLY · kräftiger Eintritt, ruhiger Halt | 191.3200 | 191.8000 | 0.4800 | 191.3410 | REPLY hebt Type 0 Code 0 desselben Echo-Paares hervor, die beiden Karten bleiben anschliessend lesbar. |
| L075 | ICMP · kräftiger Eintritt, ruhiger Halt | 198.2200 | 199.6200 | 1.4000 | 198.2610 | Letztes ICMP verbindet Quelle, Router und Ziel; alle Endzustände bleiben stabil. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / LAND | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Von H über G1 und R2 zum Ziel fahren; der lokale G2-Abzweig ist auf derselben H-Terrasse sichtbar. |
| E002 | 0.1000 | level_gap / ±0.1 | S001 / LAND | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Von H über G1 und R2 zum Ziel fahren; der lokale G2-Abzweig ist auf derselben H-Terrasse sichtbar. |
| E003 | 1.9000 | energy_rise / ±0.5 | S001 / LAND | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Von H über G1 und R2 zum Ziel fahren; der lokale G2-Abzweig ist auf derselben H-Terrasse sichtbar. |
| E004 | 7.5800 | section_boundary / ±0.35 | S002 / ECHO | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Die einfache Echo-Strecke leuchtet als erster bekannter Weg auf. |
| E005 | 16.3000 | energy_rise / ±0.5 | S004 / HEADER | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: ICMP erscheint am Protokollfeld eines bereitliegenden Antwortschemas. |
| E006 | 19.6600 | section_boundary / ±0.35 | S006 / ECHO | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Request und Reply als zwei verschiedene Träger auf Gegenrichtungen vorbereiten; gleiche Echo-ID ist das Verbindungsmerkmal. |
| E007 | 25.7600 | section_boundary / ±0.35 | S007 / SENDER | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Linux-Prompt startet einen einzelnen ping zu D; E-01 wird neu erzeugt. B01. |
| E008 | 26.4510 | transient / ±0.04 | S007 / SENDER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Linux-Prompt startet einen einzelnen ping zu D; E-01 wird neu erzeugt. B01. |
| E009 | 59.9000 | energy_rise / ±0.5 | S015 / HEADER | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Die Zitatkapsel einer Fehlerantwort wird als weiterer Informationskanal vorbereitet. |
| E010 | 60.6000 | section_boundary / ±0.35 | S016 / LAND | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: ICMP-Hook weitet den Blick auf die gesamte Routerlandschaft. |
| E011 | 73.3310 | transient / ±0.04 | S023 / HEADER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Das Fehlerzitat zeigt die Bindung der Rückmeldung an genau dieses Original. |
| E012 | 74.2000 | energy_fall / ±0.5 | S023 / HEADER | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Das Fehlerzitat zeigt die Bindung der Rückmeldung an genau dieses Original. |
| E013 | 74.6000 | level_gap / ±0.1 | S023 / HEADER | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Das Fehlerzitat zeigt die Bindung der Rückmeldung an genau dieses Original. |
| E014 | 75.6200 | section_boundary / ±0.35 | S024 / ECHO | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Kleiner Echo-Verkehr passiert, der UDP-Transfer P-M1 mit 1500 Byte scheitert am nächsten Engpass. |
| E015 | 89.4000 | level_gap / ±0.1 | S029 / MTU | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: I-M1 reist von R2 zurück nach H, sein Zitat referenziert P-M1. |
| E016 | 90.4000 | energy_rise / ±0.5 | S030 / SENDER | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Der PMTU-Eintrag für D übernimmt den bestätigten Wert 1400. |
| E017 | 91.1410 | transient / ±0.04 | S030 / SENDER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der PMTU-Eintrag für D übernimmt den bestätigten Wert 1400. |
| E018 | 98.0800 | section_boundary / ±0.35 | S034 / ECHO | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Hook zeigt die bereits gespeicherte Echo-Reply-Schicht 0/0 als Referenzkarte. |
| E019 | 100.0510 | transient / ±0.04 | S035 / TTL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: TIME EXCEEDED ist die beschriftete nächste Station, noch kein neuer Probeverlust. |
| E020 | 105.0000 | energy_rise / ±0.5 | S037 / HEADER | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Drei benannte Antwortkarten stehen neben ihrem jeweils auslösenden Vorgang. |
| E021 | 107.0810 | transient / ±0.04 | S038 / LAND | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: ICMP liegt auf der zusammenhängenden Rückwegachse aller Stationen. |
| E022 | 112.6600 | section_boundary / ±0.35 | S040 / SENDER | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Traceroute erzeugt T-1 mit TTL 1, T-2 und T-3 bleiben neue, getrennte Probes. B03. |
| E023 | 122.0810 | transient / ±0.04 | S043 / TTL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Fehlermeldung läuft G1→H zurück; Absender .1 wird zur ersten Hopzeile. |
| E024 | 125.0000 | energy_fall / ±0.5 | S044 / SENDER | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Neue Probe T-2 mit TTL 2 geht auf die Strecke; T-1 wird nicht weitergeschickt. |
| E025 | 126.3000 | level_gap / ±0.1 | S045 / TTL | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: R2 antwortet 11/0 auf T-2; danach startet T-3 mit TTL 3 und erreicht D. |
| E026 | 133.3310 | transient / ±0.04 | S049 / SENDER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Traceroute zeigt D als erreichtes Ende; der unerreichbare Port ist benannt. |
| E027 | 136.5400 | section_boundary / ±0.35 | S050 / LAND | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Wiederkehrender ICMP-Hook blickt auf nun bekannte Echo-, MTU- und TTL-Rückwege. |
| E028 | 136.7000 | energy_rise / ±0.5 | S050 / LAND | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Wiederkehrender ICMP-Hook blickt auf nun bekannte Echo-, MTU- und TTL-Rückwege. |
| E029 | 141.7710 | transient / ±0.04 | S052 / SENDER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Neue Testanfragen bleiben voneinander getrennt; nicht jeder Test ist ping. |
| E030 | 147.8610 | transient / ±0.04 | S056 / MTU | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Neues P-M2 passiert die 1400-Byte-Öffnung; der zuvor verlorene P-M1 erscheint nicht. |
| E031 | 151.0000 | energy_fall / ±0.5 | S057 / SENDER | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: UDP-Testempfänger 9000 bestätigt P-M2; Ping und Transfer sind separat geprüft. |
| E032 | 151.5000 | level_gap / ±0.1 | S057 / SENDER | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: UDP-Testempfänger 9000 bestätigt P-M2; Ping und Transfer sind separat geprüft. |
| E033 | 152.2000 | section_boundary / ±0.35 | S058 / LAN | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: G1s Route zu 203.0.113.20 zeigt G2 als besseren Next Hop im lokalen LAN. |
| E034 | 164.6000 | level_gap / ±0.1 | S064 / HEADER | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Die geprüfte 5/1-Rückmeldung wird im lokalen Routeneintrag verankert. |
| E035 | 167.6000 | energy_rise / ±0.5 | S065 / LAND | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Der neue lokale Abzweig liegt neben der unveränderten Hauptstrecke zu D. |
| E036 | 168.0210 | transient / ±0.04 | S065 / LAND | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der neue lokale Abzweig liegt neben der unveränderten Hauptstrecke zu D. |
| E037 | 169.6200 | section_boundary / ±0.35 | S066 / LAND | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Final-ICMP öffnet die Totale mit allen fünf abgeschlossenen Vorgängen. |
| E038 | 178.3310 | transient / ±0.04 | S071 / HEADER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die sechs Typ/Code-Karten stehen neben ihren konkreten Quellen. B06. |
| E039 | 182.0000 | energy_fall / ±0.5 | S073 / LAN | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Validierter direkter Next Hop bleibt aktiv; kein neuer Redirect ändert die Haupttopologie. |
| E040 | 183.3000 | level_gap / ±0.1 | S073 / LAN | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Validierter direkter Next Hop bleibt aktiv; kein neuer Redirect ändert die Haupttopologie. |
| E041 | 184.7800 | section_boundary / ±0.35 | S074 / HEADER | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Alle fünf Vorgänge als gespeicherte Ergebniskarten halten; keine neuen Fehler erzeugen. |
| E042 | 190.5210 | transient / ±0.04 | S074 / HEADER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Alle fünf Vorgänge als gespeicherte Ergebniskarten halten; keine neuen Fehler erzeugen. |
| E043 | 190.6400 | section_boundary / ±0.35 | S075 / HEADER | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: REQUEST hebt Type 8 Code 0 des bekannten Echo-Vorgangs hervor. |
| E044 | 197.0810 | transient / ±0.04 | S077 / SENDER | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die gespeicherte Testliste zeigt mehr als die Echo-Zeitmessung. |
| E045 | 199.6200 | section_boundary / ±0.35 | S079 / MTU | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Neues kleineres Testpaket durch R2 bis zum UDP-Testempfänger verfolgen. |
| E046 | 199.6200 | last_vocal_end / ±0.5 | S079 / MTU | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Neues kleineres Testpaket durch R2 bis zum UDP-Testempfänger verfolgen. |
| E047 | 206.4610 | transient / ±0.04 | S080 / LAN | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ein weiteres neues Paket benutzt den validierten G2-Weg; G1 bleibt erreichbar. |
| E048 | 212.8000 | energy_fall / ±0.5 | S081 / LAND | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Die Gesamtlandschaft langsam zurücknehmen; letzter Pegelabfall bei 212.8 s dimmt nur Licht, bis 216.7735 s stabiler Zustand. |
| E049 | 216.7740 | end / ±2.0833333333333333e-05 | S081 / LAND | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Die Gesamtlandschaft langsam zurücknehmen; letzter Pegelabfall bei 212.8 s dimmt nur Licht, bis 216.7735 s stabiler Zustand. |

## Referenz und Übergabeprüfung

[IANA ICMP Parameters](https://www.iana.org/assignments/icmp-parameters) liefert Typen und Codes. [RFC 792](https://www.rfc-editor.org/rfc/rfc792) beschreibt Rückmeldungen und Zitat; [RFC 1191](https://www.rfc-editor.org/rfc/rfc1191) den PMTUD-Hinweis. Das Labornetz und seine Tests sind simuliert.

Geprüft: 81 lückenlose Einstellungen von 0 bis 216.7735 s; alle 75 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 49 Events genau einmal zugeordnet; 19 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L004, L011, L026, L037, L039, L046, L074.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
