# 08 MTU – Drehbuch (überarbeitete Fassung)

Grundlage war der ASTRA-Vorschlag vom 28.09. (unverändert gesichert unter
`_revisions/ASTRA-DREHBUCH-original.md`). Er war fachlich schon sorgfältig (IPv4, DF, ICMP Type 3/Code 4,
PMTUD-Black-Hole, keine Fragmentierung im Router, Neuaufteilung am Sender). Diese Fassung behält die
Geschichte und macht sie konkret. Die genaue Schnittliste steht in `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Leitidee: Die unsichtbare Grenze, konkret

Host A (192.0.2.10) lädt `report.pdf` zu Server B (198.51.100.20) hoch. Unterwegs liegt ein IPsec-Tunnel
von R2 nach R3, Tunnel-MTU **1400**. TCP schickt volle Segmente von 1500 Bytes mit DF=1. Am Tunneleingang
passen sie nicht durch, R2 verwirft sie und schickt **ICMP Destination Unreachable / Fragmentation needed,
mtu 1400** zurück. Die Firewall vor Host A lässt aber nur Echo-Reply und Time-Exceeded durch und verwirft
diese Meldung. Ping (84 Bytes) geht die ganze Zeit, der Upload hängt bei 0 %: ein PMTUD-Black-Hole.

Die Lösung kommt in zwei Schritten wie im Drehbuch: Die Firewall lässt gezielt `frag-needed` durch, das
nächste ICMP erreicht den Host, er lernt Path MTU 1400 und sendet dieselben Daten in Paketen von höchstens
1400 Bytes. **Das Tor bleibt gleich gross – der Sender hat gelernt.**

## Was gegenüber dem Vorschlag geändert wurde

- **Eine konkrete Ursache für die Engstelle:** Das Tor ist der Eingang eines IPsec-Tunnels. Damit tragen
  „Tunnel overhead“ und „encapsulation“ in Verse 2 die eigentliche Erklärung: Die Hülle braucht Platz, im
  1500er-Link bleiben 1400 für das innere Paket. Pauschale Overhead-Zahlen werden nicht beschriftet.
- **Zwei Bildräume statt einer einzigen dunklen Maschine.** Der Song ist laut Style-Prompt heller,
  verspielter UK-Garage. Neben dem nächtlichen Pfad gibt es eine **helle Messhalle**: Grössenvergleiche
  stehen frontal vor einem Lineal (0–1600 Bytes), gleicher Byte-Massstab wie im Pfad.
- **Der stille Drop liegt in der gemessenen Pegellücke** (100-ms-RMS −54 dBFS bei 5,25 s): Das erste
  Paket verschwindet genau dort, wo die Musik kurz aussetzt.
- **Kleine Tests täuschen, belegt im Terminal:** `ping` geht, `ping -M do -s 1472` verliert alles,
  `tracepath` bleibt bei pmtu 1500 und endet in „no reply“, `ping -M do -s 1372` (1400 Bytes) geht.
- **Gleicher Anflug, anderer Ausgang:** Im ersten Chorus scheitert das Paket genau auf „Can you pass it
  through?“, im Final Chorus passiert das erste neue Paket das Tor auf derselben Zeile.
- **Neuaufbau ohne Datenverlust, nachrechenbar:** Vier Nutzlasten à 1460 Bytes werden zu fünf Paketen
  (4 × 1360 + 400 Bytes Nutzlast); die 20-Byte-Module fliegen sichtbar von den alten in die neuen Pakete.
- **Der Upload wird sichtbar fertig:** 32 Segmente, 42,9 kB; das Mosaik am Server füllt sich Kachel für
  Kachel und ist bei 117,45 s vollständig. Das letzte Segment ist kleiner (760 Bytes Nutzlast).
- **Jumbo-Frame nur in eigener Bahn** (L2, MTU 9000), nie durch das 1400er-Tor.
- **Letztes Paket auf dem letzten Impuls** (137,69 s), Blende ab dem gemessenen Endabfall 137,8 s.
- **60 fps** wie die übrigen Album-01-Videos (der Vorschlag nannte 30 fps).

## Bildsprache

- **Pfad (Nacht):** Schienen für Hin- (blau) und Rückweg (orange) über einem Raster, darunter zwei
  Lichtflüsse wie auf dem Cover. Host A mit Upload-Fenster und Sendewarteschlange, Firewall als Rahmen über
  beide Bahnen mit Filtergitter auf der Rückbahn, R1/R2/R3, violette Tunnelrippen, Server B mit Mosaik.
- **Paket:** Glaskörper, Höhe = Bytes × K; magentafarbener Datenkern, heller Header vorne, orange
  DF-Klammer, im Tunnel eine violette Hülle. Pings sind kleine cyanfarbene Würfel, ICMP ist bernsteinfarben.
- **Das Tor:** Rahmen am Tunneleingang mit Lineal, bis 42,5 s fast unsichtbar, danach hell mit „MTU 1400“.
  Darüber leuchten M, T, U bei jedem gesungenen „M-T-U“: rot vor der Lösung, grün danach.
- **Verwerfen:** Rote Splitter, die Spur endet abrupt; Pakete über 1400 Bytes zeigen am Tor ihren roten
  Überstand. Rot nur als Akzent.
- **Messhalle (hell):** Weisser Boden, Rundhorizont, dunkler Messrahmen, Lineal, Pakete in derselben
  Bildsprache. Kinetische Wörter für Hook und Break, mit einer Zeile Erklärung.

## Ablauf

| Zeit | Kapitel | Inhalt |
| --- | --- | --- |
| 0:00 | Die Grenze | 1500-Byte-Paket fährt ans Tor, stirbt in der Pegellücke; ICMP stirbt leise an der Firewall; der Retransmit wartet. |
| 0:12 | Alles erreichbar | Titel; Pings gehen hin und zurück, auch durch den Tunnel; der Retransmit scheitert wieder. |
| 0:23 | Ein Byte zu viel | Messhalle: 1400 passt, 1401 nicht; Header und Nutzlast; DF=1. Stiller Drop; der Upload steht bei 0 %. |
| 0:37 | Kleine Tests täuschen | Ping geht, grosses Paket stirbt, Firewall versteckt die Antwort, tracepath, 1400er-Ping geht, das Tor erscheint. |
| 0:43 | Das Tor bekommt einen Namen | Kontur gegen Kontur: 100 Bytes Überstand, der Rahmen rastet auf 43,98 s ein. |
| 0:48 | M-T-U | Anflug auf dem Einsatz 48,0 s, rotes M-T-U, Scheitern auf der Zeile; Total Length 1500 gegen MTU 1400; Rückzug ins Winzige; Pfadverlauf. |
| 1:01 | Don’t fragment | DF-Klammer aus zwei Blickwinkeln, enger Korridor von oben, gestrandetes Paket, Vorschau kleinerer Pakete. |
| 1:16 | Die Hüllen | Tunnelhülle füllt den 1500er-Link, IPsec ESP, MPLS als Beispiel; ICMP entsteht, wird verfolgt und an der Firewall verschluckt; schwarzer Riss. |
| 1:30 | Vermessen | 1400 / 1500 / Jumbo / DF / Path MTU = kleinster Rahmen; Freigabe für ICMP 3/4; Host lernt 1400; Neuaufbau. |
| 1:44 | Jetzt passt es | Gleicher Anflug, gleiches Tor, grünes M-T-U; Durchflug in den Tunnel; Upload fertig, Mosaik vollständig. |
| 1:57 | Finale | Schwebe am Tor, lange Fahrt durch den Tunnel, Titel mit REDUCE AND RETRY, letztes Paket auf 137,69 s. |

## Technische Leitplanken

- IPv4; `1400` und `1500` sind ganze IP-Paketlängen inklusive Header. Szenariowerte, keine Empfehlung.
- Kein Router fragmentiert; die Neuaufteilung ist TCP am Sender (MSS 1460 → 1360).
- Gezielte Firewall-Freigabe (`icmp type destination-unreachable icmp code frag-needed accept`), nicht das
  Abschalten der Firewall.
- Zeiten sind verdichtet: Retransmits folgen der Musik, nicht dem echten RTO-Backoff.
- Lyric-Zeiten unverändert aus dem Transkript (nicht forced-aligned), Tempo 135 BPM (mittlere Sicherheit).
- Fachliche Referenzen: RFC 1191 (Path MTU Discovery), RFC 2923 (PMTUD-Black-Hole).
