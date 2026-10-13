# 06 · ICMP — Mehr als ein Ping (Drehbuch, Fassung «Realwelt»)

Überarbeitet am 5. Oktober 2026: Die Konsolen gefielen, die fiktive Routerlandschaft mit abstrakten Paketen war zu
dürftig. Der Film zeigt jetzt reale Orte: einen Laptop in einem Büro in Zürich, seinen Desktop mit Terminal und
tcpdump, die Weltkugel mit den echten Wegpunkten und das Rechenzentrum in New York, in dem der Server steht. Die
ASTRA-Vorlage bleibt unverändert unter `_revisions/ASTRA-DREHBUCH-original.md`. Übernommen werden **die 81
Startzeiten** (im Test gegen die Vorlage geprüft), alle Lyrics- und Event-Zuordnungen, die fünf ICMP-Vorgänge mit
ihren Zeiten und die Bildschirmtexte B01–B06. Vollständige Zeiten: `UMSETZUNG-CUES.md`.

## Quellen

Finale WAV `06_ICMP_1.0.wav`, SHA-256 `1acad3bf…c823`, 10 405 128 Samples = 216,7735 s, 60 fps = 13 007 Bilder.
Transkript-SHA `307f7d74…`. Lyric-Zeiten automatisch; Prüfmarkierungen bleiben. Küstenlinien: Natural Earth 1:110m
(gemeinfrei), im Projekt unter `src/render/geo.js`.

## Orte

- **Büro in Zürich** (Nachmittag, hell): Schreibtisch mit Laptop H 192.0.2.10, Fenster auf See, Stadt und Alpen. Im
  Regal ein Desk-Switch, der Heimrouter G1 192.0.2.1 (Glasfaser zur Wanddose = Weg hinaus), der Labor-Router G2
  192.0.2.2 und der Labor-Host X 203.0.113.20. Alles in einem LAN: hier läuft TTL 1 ab (G1 meldet 11/0) und hier
  geschieht der Redirect. Pakete laufen als Licht entlang der echten Kabel.
- **Laptop-Desktop**: Terminal mit ping, PMTUD und traceroute (B-Texte), daneben **tcpdump** auf en0, das jedes
  ausgehende Paket und jede ankommende ICMP-Meldung im originalen tcpdump-Format mitschreibt (z. B. «ICMP
  198.51.100.20 unreachable - need to frag (mtu 1400)»), und ein Netzwerkfenster mit PMTU, Route und Zählern.
- **Weltkugel**: Zürich → Frankfurt (R2 10.0.12.2, Tunnel mit MTU 1400) → über den Nordatlantik → New York (Server D
  198.51.100.20). Pakete mit Leuchtspur auf Grosskreisbögen, ICMP-Antworten weiss mit amberfarbener Zitatkapsel.
- **Rechenzentrum New York**: weisse Schränke um einen eingehausten Kaltgang mit Glasdach, offene dunkle Decke, orange
  Glasfaser vom Carrier bis zur Netzwerkkarte von Server D, polierter Beton. Ein Monitorwagen zeigt `ss -ulpn` und
  die ICMP-Zähler: Echo beantwortet, UDP 9000 offen, 33434+ ohne Listener. (Bausteine aus Out of Band übernommen,
  aber eine andere Halle.)
- **Headerkarten**: unverändert.

## Präzisierungen

1. **Realistische Laufzeiten:** Ping 92,4 ms (Zürich–New York), traceroute 1,2 / 9,6 / 92,1 ms. TTL bei Antwort 62
   (zwei Router).
2. **Hops real verortet:** T-1 endet am Heimrouter im Regal, T-2 in Frankfurt, T-3 erreicht New York.
3. **PMTUD:** P-M1 (1500 B, DF) wird am Tunneleingang in Frankfurt verworfen; I-M1 3/4 fliegt nach Zürich zurück;
   P-M2 (1400 B) passiert den Tunnel und kommt im Rechenzentrum an.
4. **Redirect:** G1 und G2 hängen am selben Switch wie der Laptop; der Redirect und der neue direkte Weg zu G2 sind
   auf den Kabeln im Regal sichtbar.
5. Kinetische Wörter, Musik-Cues, Pegellücken und hartes Ende wie bisher.

## Schnittliste

Startzeiten aus der Vorlage; Orte, Kamera und Handlung neu. Erzeugt mit `python3 src/tools/shotlist.py`.

<!-- shots -->
| Shot | Beginn s | Ende s | Ort | Kamera | Handlung | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- |
| S001 | 0.0000 | 7.5800 | ROOM | push | Helles Büro in Zürich am Nachmittag: Laptop H auf dem Schreibtisch, Fenster auf See und Alpen. Die Kamera fährt auf den Bildschirm zu. | Instrumental; E001; E002; E003 |
| S002 | 7.5800 | 11.1800 | DESKTOP | term | Auf dem Laptop-Desktop: Terminal mit früheren Pings, tcpdump lauscht auf en0. | L001 · Intro · 7.5800–9.4800 s · «Du kennst mich als Ping.»; E004 |
| S003 | 11.1800 | 15.2400 | GLOBE | rise | Aus Zürich hinaus auf die Weltkugel: Frankfurt (R2) und New York (Server D) sind markiert, der Weg liegt bereit. | L002 · Intro · 11.1800–13.2800 s · «Du kennst nur den Anfang.» |
| S004 | 15.2400 | 16.6600 | HEADER | card | ICMP erscheint im Protokollfeld eines bereitliegenden Antwortschemas. | L003 · Intro · 15.2400–16.0200 s · «ICMP.»; E005 |
| S005 | 16.6600 | 19.6600 | DESKTOP | term | H öffnet das tcpdump-Fenster statt nur auf den Ping-Zähler zu schauen. | L004 · Intro · 16.6600–19.6600 s · «Hör hin.» · **PRÜFEN** |
| S006 | 19.6600 | 25.7600 | ROOM | shelf | Regal im Büro: Switch, Heimrouter G1 mit Glasfaser zur Wand, Labor-Router G2, Labor-Host X. | Instrumental; E006 |
| S007 | 25.7600 | 28.4800 | DESKTOP | term | ping -c 1 198.51.100.20 wird getippt; E-01 entsteht. B01. | L005 · Verse 1 · 25.7600–28.4800 s · «Du tippst vier Zeichen, wartest kurz,»; E007; E008 |
| S008 | 28.4800 | 33.3400 | GLOBE | follow | E-02 Echo Reply fliegt von New York durch den Tunnel nach Frankfurt und zurück nach Zürich. | L006 · Verse 1 · 28.4800–31.1600 s · «ein Echo kommt zu dir zurück.» |
| S009 | 33.3400 | 36.9000 | HEADER | card | Echo Request: Type 8 Code 0; IP-Protokoll 1 ist eine eigene Schicht. | L007 · Verse 1 · 33.3400–34.8400 s · «Echo Request.» |
| S010 | 36.9000 | 40.4200 | HEADER | card | Echo Reply: Type 0 Code 0, ID 4242 / Seq 1 wie E-01. | L008 · Verse 1 · 36.9000–38.5600 s · «Echo Reply.» |
| S011 | 40.4200 | 43.8800 | DESKTOP | term | RTT 92,4 ms über den Atlantik – Ergebnis dieses Echos, keine App-Latenz. | L009 · Verse 1 · 40.4200–43.8800 s · «Du misst die Zeit und gehst vorbei.» |
| S012 | 43.8800 | 49.3600 | DC | server | Rechenzentrum New York: Server D antwortet auf Echo, der UDP-Dienstport bleibt geschlossen. | L010 · Verse 1 · 43.8800–47.8200 s · «Der Host gibt Antwort, doch dein Dienst steht still.» |
| S013 | 49.3600 | 51.8000 | DESKTOP | term | Ping-Erfolg und fehlende UDP-Antwort stehen nebeneinander. | L011 · Verse 1 · 49.3600–51.6600 s · «Ein Ping sagt nicht, ob deine App auch will.» · **PRÜFEN** |
| S014 | 51.8000 | 55.6600 | GLOBE | hops | Von der Echo-Strecke zu den anderen Stationen: Tunnel in Frankfurt, Hops, das LAN in Zürich. | L012 · Verse 1 · 51.8000–55.3800 s · «Du kennst mein Echo, übersiehst den Rest.» |
| S015 | 55.6600 | 60.6000 | HEADER | card | Die Zitatkapsel einer Fehlerantwort als weiterer Informationskanal. | L013 · Verse 1 · 55.6600–59.3000 s · «Ich spreche dort, wo dich das Netz im Dunkeln lässt.»; E009 |
| S016 | 60.6000 | 61.3400 | GLOBE | spin | ICMP-Hook: die Kugel dreht sich, alle Wege leuchten. | L014 · Chorus · 60.6000–61.3400 s · «ICMP.»; E010 |
| S017 | 61.3400 | 63.0600 | GLOBE | hops | Echo ist nur einer von fünf Vorgängen auf dieser Strecke. | L015 · Chorus · 61.3400–62.8800 s · «Mehr als ein Ping.» |
| S018 | 63.0600 | 65.0000 | DESKTOP | term | Mehrere Testanfragen, jede mit eigener ID. | L016 · Chorus · 63.0600–64.7800 s · «Jeder ruft mich.» |
| S019 | 65.0000 | 67.6000 | HEADER | card | Die ankommenden Antwortfelder sind noch ungeöffnet. | L017 · Chorus · 65.0000–66.6600 s · «Kaum einer hört hin.» |
| S020 | 67.6000 | 68.6800 | GLOBE | return | Die gemeinsame Rückwegachse nach Zürich. | L018 · Chorus · 67.6000–68.3400 s · «ICMP.» |
| S021 | 68.6800 | 70.5600 | HEADER | card | Typ und Code statt Rot/Grün. | L019 · Chorus · 68.6800–70.2800 s · «Unterschätz meine Stimme nicht.» |
| S022 | 70.5600 | 73.2400 | GLOBE | fra | Frankfurt: der Tunnel nach New York mit MTU 1400; ein grosses DF-Datagramm kommt. | L020 · Chorus · 70.5600–73.2400 s · «Wo dein Paket an Grenzen stößt,» |
| S023 | 73.2400 | 75.6200 | HEADER | card | Das Fehlerzitat bindet die Rückmeldung an genau dieses Original. | L021 · Chorus · 73.2400–75.5200 s · «bring ich den Grund ans Licht.»; E011; E012; E013 |
| S024 | 75.6200 | 79.3600 | ROOM | desk | Am Laptop: der Transfer startet, P-M1 (1500 Byte, DF) läuft über das Kabel hinaus. | L022 · Verse 2 · 75.6200–78.7200 s · «Ping kommt durch, der Transfer steht,»; E014 |
| S025 | 79.3600 | 83.4800 | GLOBE | follow | P-M1 fliegt nach Frankfurt und trifft auf den zu engen Tunnel. | L023 · Verse 2 · 79.3600–82.5400 s · «weil das große Paket nicht weitergeht.» |
| S026 | 83.4800 | 84.2400 | HEADER | card | DF=1 steht im IP-Header von P-M1, nicht im ICMP. | L024 · Verse 2 · 83.4800–84.2400 s · «Don't Fragment.» |
| S027 | 84.2400 | 86.6200 | GLOBE | fra | R2 verwirft P-M1 vollständig am Tunneleingang; keine Fragmente. | L025 · Verse 2 · 84.2400–86.6200 s · «Der Router wirft es raus.» |
| S028 | 86.6200 | 88.6000 | HEADER | card | Neues I-M1: Type 3 Code 4, Next-Hop MTU 1400. B02. | L026 · Verse 2 · 86.6200–88.6000 s · «Fragmentation Needed.» · **PRÜFEN** |
| S029 | 88.6000 | 90.3800 | GLOBE | follow | I-M1 fliegt von Frankfurt zurück nach Zürich, mit dem Zitat von P-M1. | L027 · Verse 2 · 88.6000–90.3800 s · «Die Antwort zeigt den Engpass auf.»; E015 |
| S030 | 90.3800 | 92.0600 | DESKTOP | term | PMTU-Cache für D: 1400; tcpdump zeigt «need to frag (mtu 1400)». | L028 · Verse 2 · 90.3800–92.0600 s · «Path MTU Discovery.»; E016; E017 |
| S031 | 92.0600 | 94.3800 | DESKTOP | term | P-M2 wird neu mit 1400 Byte gebaut; P-M1 bleibt verloren. | L029 · Verse 2 · 92.0600–94.3800 s · «Der Sender passt die Größe an.» |
| S032 | 94.3800 | 96.4200 | HEADER | card | Markiertes Gegenbeispiel: gefiltertes ICMP – nicht diese Strecke. | L030 · Verse 2 · 94.3800–96.4200 s · «Sperrst du die Meldung, fehlt der Hinweis,» |
| S033 | 96.4200 | 98.0800 | DESKTOP | term | Gegenbeispiel-Hinweis im Netzwerkfenster; Haupt-PMTU bleibt 1400. | L031 · Verse 2 · 96.4200–98.0800 s · «und dein Transfer hängt daran.» |
| S034 | 98.0800 | 99.9400 | GLOBE | echo | Hook: die Echo-Strecke als Referenz. | L032 · Hook · 98.0800–99.7800 s · «Echo Reply.»; E018 |
| S035 | 99.9400 | 101.8600 | GLOBE | hops | TIME EXCEEDED: die Hops sind die nächste Station. | L033 · Hook · 99.9400–101.8600 s · «Time Exceeded.»; E019 |
| S036 | 101.8600 | 103.1000 | ROOM | shelf | REDIRECT als Vorschau: G1 und G2 im selben LAN; H nutzt weiter G1. | L034 · Hook · 101.8600–102.8000 s · «Redirect.» |
| S037 | 103.1000 | 105.1200 | HEADER | card | Drei benannte Antwortkarten neben ihren Auslösern. | L035 · Hook · 103.1000–105.1200 s · «Hör, was das Netz dir sagt.»; E020 |
| S038 | 105.1200 | 108.3200 | GLOBE | spin | ICMP auf der gemeinsamen Rückwegachse. | L036 · Hook · 105.1200–105.8200 s · «ICMP.»; E021 |
| S039 | 108.3200 | 112.6600 | GLOBE | descend | Die Kamera sinkt zurück nach Zürich, zu den TTL-Stationen. | L037 · Hook · 108.3200–109.8800 s · «Mehr als ein Ping.» · **PRÜFEN** |
| S040 | 112.6600 | 116.9600 | DESKTOP | term | traceroute erzeugt T-1 mit TTL 1; T-2 und T-3 sind eigene Probes. B03. | L038 · Verse 3 · 112.6600–115.7000 s · «Du schickst die Probe weiter raus,»; E022 |
| S041 | 116.9600 | 120.0200 | ROOM | shelf | T-1 erreicht den Heimrouter G1 im Regal – TTL läuft ab, das Original endet hier. | L039 · Verse 3 · 116.9600–120.0200 s · «die TTL läuft unterwegs aus.» · **PRÜFEN** |
| S042 | 120.0200 | 121.5000 | HEADER | card | G1 erzeugt ICMP 11/0 mit dem Zitat von T-1. | L040 · Verse 3 · 120.0200–121.5000 s · «Time Exceeded.» |
| S043 | 121.5000 | 124.2800 | ROOM | shelf | TE-1 läuft vom Heimrouter über den Switch zum Laptop zurück; erste Hopzeile 192.0.2.1. | L041 · Verse 3 · 121.5000–123.5800 s · «Ein Router meldet sich.»; E023 |
| S044 | 124.2800 | 125.7200 | DESKTOP | term | Neue Probe T-2 mit TTL 2. | L042 · Verse 3 · 124.2800–125.7200 s · «Traceroute folgt diesen Spuren,»; E024 |
| S045 | 125.7200 | 127.6200 | GLOBE | follow | T-2 läuft bis Frankfurt, R2 antwortet 11/0; T-3 fliegt weiter über den Atlantik. | L043 · Verse 3 · 125.7200–127.6200 s · «Hop für Hop wird sichtbar für dich.»; E025 |
| S046 | 127.6200 | 129.9000 | DC | server | T-3 erreicht Server D in New York auf UDP 33436 – kein Listener: 3/3. | L044 · Verse 3 · 127.6200–129.9000 s · «Destination Unreachable.» |
| S047 | 129.9000 | 131.7800 | HEADER | card | Type 3 Code 3 PORT UNREACHABLE. B04. | L045 · Verse 3 · 129.9000–131.6000 s · «Lies den Code, bevor du rätst.» |
| S048 | 131.7800 | 133.1000 | HEADER | card | Das Zitat nennt T-3s Zielport und IP-ID. | L046 · Verse 3 · 131.7800–133.1000 s · «Ein Fehler hat dir mehr zu sagen» · **PRÜFEN** |
| S049 | 133.1000 | 136.5400 | DESKTOP | term | traceroute zeigt D als erreichtes Ende, Hop 3 mit 92,1 ms. | L047 · Verse 3 · 133.1000–135.4600 s · «als ein Kreis, der sich nur dreht.»; E026 |
| S050 | 136.5400 | 137.9800 | GLOBE | hops | Wiederkehrender ICMP-Hook über den nun bekannten Rückwegen. | L048 · Chorus · 136.5400–137.6800 s · «ICMP.»; E027; E028 |
| S051 | 137.9800 | 139.7400 | HEADER | card | Die geöffneten Typ/Code-Karten. | L049 · Chorus · 137.9800–139.7400 s · «Mehr als ein Ping.» |
| S052 | 139.7400 | 141.8600 | DESKTOP | term | Neue, getrennte Testanfragen; nicht jeder Test ist ping. | L050 · Chorus · 139.7400–141.6400 s · «Jeder ruft mich.»; E029 |
| S053 | 141.8600 | 143.5600 | DC | server | Im Rechenzentrum: der geschlossene UDP-Port bleibt markiert, der Host antwortet weiter. | L051 · Chorus · 141.8600–143.5600 s · «Kaum einer hört hin.» |
| S054 | 143.5600 | 145.5000 | GLOBE | return | ICMP zieht die weissen Antworten nach Zürich zusammen. | L052 · Chorus · 143.5600–145.2000 s · «ICMP.» |
| S055 | 145.5000 | 147.1600 | HEADER | card | Fehlerzitate und Absender bleiben lesbar. | L053 · Chorus · 145.5000–147.1600 s · «Unterschätz meine Stimme nicht.» |
| S056 | 147.1600 | 150.1400 | GLOBE | follow | Neues P-M2 (1400 Byte) passiert den Tunnel in Frankfurt Richtung New York. | L054 · Chorus · 147.1600–150.1400 s · «Wo dein Paket an Grenzen stößt,»; E030 |
| S057 | 150.1400 | 152.2000 | DC | server | Server D: der UDP-Testempfänger auf 9000 bestätigt P-M2. | L055 · Chorus · 150.1400–152.2000 s · «bring ich den Grund ans Licht.»; E031; E032 |
| S058 | 152.2000 | 154.4000 | ROOM | shelf | G1 kennt den besseren Next Hop: G2 im selben LAN für 203.0.113.20. | L056 · Verse 4 · 152.2000–154.4000 s · «Dein Gateway kennt den nächsten Router,»; E033 |
| S059 | 154.4000 | 156.3600 | ROOM | wide | Laptop .10, G1 .1 und G2 .2 im selben Netz 192.0.2.0/24 – ein Raum, ein Switch. | L057 · Verse 4 · 154.4000–156.3600 s · «im selben Netz wie dein Gerät.» |
| S060 | 156.3600 | 157.9400 | HEADER | card | G1 sendet Host Redirect 5/1, Gateway 192.0.2.2. B05. | L058 · Verse 4 · 156.3600–157.8200 s · «Redirect sagt deinem Host,» |
| S061 | 157.9400 | 159.6600 | ROOM | shelf | Das Original geht von G1 über den Switch zu G2, der Redirect getrennt zum Laptop. | L059 · Verse 4 · 157.9400–159.6600 s · «dass es für dieses Ziel direkter geht.» |
| S062 | 159.6600 | 161.6200 | DESKTOP | term | H prüft Absender, Gateway, Zitat und lokalen Next Hop. | L060 · Verse 4 · 159.6600–161.6200 s · «Du prüfst den Hinweis, prüfst die Quelle,» |
| S063 | 161.6200 | 163.5200 | ROOM | shelf | Erst jetzt nimmt ein neues Paket den Weg Laptop → Switch → G2. | L061 · Verse 4 · 161.6200–163.5200 s · «bevor dein Host den Weg neu wählt.» |
| S064 | 163.5200 | 165.8200 | HEADER | card | Die geprüfte 5/1-Rückmeldung wird zum Routeneintrag. | L062 · Verse 4 · 163.5200–165.4800 s · «Ich bin die Stimme aus der Leitung.»; E034 |
| S065 | 165.8200 | 169.6200 | ROOM | wide | Der lokale Abzweig zu G2 neben der Glasfaser hinaus zur Welt. | L063 · Verse 4 · 165.8200–167.6600 s · «Jetzt hörst du, was das Netz erzählt.»; E035; E036 |
| S066 | 169.6200 | 170.2200 | GLOBE | spin | Final-ICMP: die ganze Kugel mit allen fünf Vorgängen. | L064 · Final Chorus · 169.6200–170.2200 s · «ICMP.»; E037 |
| S067 | 170.2200 | 171.6400 | GLOBE | echo | Echo Request und Reply als Paar. | L065 · Final Chorus · 170.2200–171.6400 s · «Mehr als ein Ping.» |
| S068 | 171.6400 | 173.7200 | DESKTOP | term | Testliste: Echo, PMTU, Trace, UDP-Port, Redirect. | L066 · Final Chorus · 171.6400–173.5000 s · «Jeder ruft mich.» |
| S069 | 173.7200 | 176.5000 | HEADER | card | Geöffnete Antwortfelder. | L067 · Final Chorus · 173.7200–175.4000 s · «Jetzt hörst du hin.» |
| S070 | 176.5000 | 177.4000 | GLOBE | return | Jede Station behält ihre Mechanik. | L068 · Final Chorus · 176.5000–177.1000 s · «ICMP.» |
| S071 | 177.4000 | 179.0600 | HEADER | card | Die sechs Typ/Code-Karten mit ihren Quellen. B06. | L069 · Final Chorus · 177.4000–179.0600 s · «Unterschätz meine Stimme nicht.»; E038 |
| S072 | 179.0600 | 181.3600 | GLOBE | fra | Frankfurt: kleiner Transfer passt, der grosse Drop bleibt archiviert. | L070 · Final Chorus · 179.0600–181.3600 s · «Das Netz hat dir genug zu sagen.» |
| S073 | 181.3600 | 184.7800 | ROOM | shelf | Der validierte Weg über G2 bleibt aktiv. | L071 · Final Chorus · 181.3600–184.7800 s · «Hör zu, wenn es mit dir spricht.»; E039; E040 |
| S074 | 184.7800 | 190.6400 | HEADER | card | Alle fünf Vorgänge als Ergebniskarten. | Instrumental; E041; E042 |
| S075 | 190.6400 | 191.3200 | HEADER | card | REQUEST: Type 8 Code 0. | L072 · Outro · 190.6400–191.2400 s · «Request.»; E043 |
| S076 | 191.3200 | 191.8000 | HEADER | card | REPLY: Type 0 Code 0. | L073 · Outro · 191.3200–191.8000 s · «Reply.» |
| S077 | 191.8000 | 198.2200 | DESKTOP | term | Die gespeicherte Testliste zeigt mehr als die Echo-Zeit. | L074 · Outro · 191.8000–195.7800 s · «Du kennst jetzt mehr.» · **PRÜFEN**; E044 |
| S078 | 198.2200 | 199.6200 | GLOBE | hops | Letztes ICMP verbindet Zürich, Frankfurt und New York. | L075 · Outro · 198.2200–199.6200 s · «ICMP.» |
| S079 | 199.6200 | 205.3378 | DC | flyin | Von oben in das Rechenzentrum New York: P-M3 kommt über die Glasfaser bei Server D an. | Instrumental; E045; E046 |
| S080 | 205.3378 | 211.0557 | ROOM | shelf | Ein weiteres Paket nimmt den validierten Weg über G2. | Instrumental; E047 |
| S081 | 211.0557 | 216.7735 | ROOM | pull | Vom Laptop zurück zum Fenster, über den See; das Licht wird ab 212,8 s weicher. | Instrumental; E048; E049 |
<!-- /shots -->
