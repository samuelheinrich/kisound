# 03 It’s Always DNS – Drehbuch (überarbeitete Fassung)

Grundlage war der ASTRA-Vorschlag vom 28.09. (unverändert gesichert unter
`_revisions/ASTRA-DREHBUCH-original.md`). Diese Fassung ist die Vorlage für den umgesetzten Code;
die genaue Schnittliste mit Event- und Lyric-IDs steht in `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Leitidee: Der Fall #4040

Ein Nachtdienst am Helpdesk als Kriminalfall. Das Ticket sagt „network down“, gemeint ist
`app.itsalwaysdns.com`. Der Song zählt die Verdächtigen auf (Ping, Routen, Kabel, Port, Firewall) und
entlastet sie einen nach dem anderen, bis nur DNS übrig bleibt. Zwei Bildräume wechseln sich ab:

- **Die Stadt (DNS-Welt):** Laptops im Helpdesk, Switch, Router, Firewall und App-Server am Boden; der
  rekursive Resolver als Drahtglobus mit Neonschild „IT’S ALWAYS DNS“; sein Cache als Regal mit
  Karteikarten und Sanduhren (TTL); TLD-Plattformen; der Ring der 13 Root-Server am Himmel; `ns1` mit zwei
  Ansichten, die sich wie Spiegel gegenüberstehen (Split Horizon).
- **Der Schreibtisch (Noir):** Fallakte mit Hinweisliste, Telefon, Terminal, Lupe, Stempel, Lampe,
  Tasse „TRUST THE PACKETS“ und eine Fallwand mit roten Fäden.

Beide Räume lesen denselben Modellzustand: Was die Akte abhakt, ist in der Stadt entlastet; was im
Terminal steht, ist die Antwort, die gerade durch die Stadt fliegt.

**Die Geschichte:** Bei einer Migration fehlt `app` in der *internen* View. Der Resolver bekommt
NXDOMAIN und speichert das negativ. Der Laptop des Engineers hat noch die alte Antwort mit TTL 86400 und
sagt „works on my machine“. In der Bridge: Flush (hilft allein nicht, die nächste Frage holt wieder
NXDOMAIN), Query, `dig @ns1` zeigt extern eine Antwort und intern keine, Fix in der internen View, die
Auflösung gelingt. Die Reprise eröffnet Fall #4041: `intranet` → CNAME `portal.example.net` → CNAME
`lb.itsalwaysdns.com`, und das Ende der Kette fehlt. Nach dessen Fix klingelt das Telefon ein drittes
Mal: #4042, der Drucker, NXDOMAIN. Schnitt.

## Was gegenüber dem Vorschlag geändert wurde

- **Eine Geschichte statt wiederholter Szenenaktionen.** Der Vorschlag beschrieb in mehreren Szenen
  dieselben Bilder („Lupe über Logs“, „Stempel NXDOMAIN“) und legte die Bridge-Begriffe nicht auf die
  gesungenen Zeilen. Jetzt hat jeder Begriff aus Hook und Bridge seinen eigenen Beleg im Bild.
- **Das lange Instrumental (120–203 s) ist eine Nachttour** durch die Auflösung statt vier gleich langer
  20-s-Blöcke: Rekursion über Root, TLD und autoritative Server, Antworten im Cache, ein Tippfehler-
  NXDOMAIN, Reverse-Lookup, Ablauf kurzer TTLs, dann die Fallwand.
- **Die digitale Stille 130,35–132,65 s ist ein Timeout**, nicht ein weiteres NXDOMAIN: Der Resolver ist
  nicht erreichbar, das Bild wird schwarz, nur das Terminal tippt
  `communications error … timed out` / `no servers could be reached`. Der kurze Blackout 120,55–121,4 s ist
  dagegen das Licht aus nach „Fall geschlossen“.
- **Fachlich korrekt aufgelöst:** Root wird pro TLD nur einmal gefragt, danach kennt der Resolver die
  NS-Einträge; Ketten innerhalb einer Zone kommen in einer Antwort, nur zonenübergreifende CNAMEs werden
  weiterverfolgt; der Negativ-Cache gilt bis zum Flush und entsteht nach erneuter Frage wieder; eine
  Wiederholung derselben Frage kommt aus dem Cache und läuft nicht erneut durch die Hierarchie.
- **Nur Dokumentations-Adressen** (203.0.113.x, 198.51.100.x, 192.0.2.x) und Beispiel-Domains für fremde
  Hosts. Keine Firmennamen oder Logos.
- **Harter Schluss:** Der Song endet abrupt auf „NXDOMAIN“ (260,36–260,84 s). Keine lange Blende; nur die
  letzten 0,2 s werden schwarz.
- **60 fps** wie die übrigen Album-01-Videos.

## Bildsprache

- **Farben:** Nachtblau; Anfrage gelb, Referral orange, Antwort grün, CNAME cyan, NXDOMAIN magenta,
  Timeout rot. Der Resolver färbt sich nach dem Zustand: blau (antwortet), magenta (verteilt NXDOMAIN),
  dunkelrot (nicht erreichbar).
- **Pakete** fliegen als Karten auf Bögen zwischen den Knoten; die Verbindung leuchtet in ihrer Farbe,
  solange sie unterwegs sind. POV-Fahrten folgen einem bestimmten Paket (hinterher, auf dem Paket, seitlich).
- **Cache:** jede Karte hat ihren festen Platz; die Sanduhr läuft mit der TTL ab; Flush lässt Karten
  aufsteigen und verschwinden.
- **Kinetische Typografie** nur für Hook, Final Hook, Reprise-Hook und Bridge, direkt aus den
  Lyric-Segmenten der Analyse, jeweils mit einer Zeile Erklärung (z. B. TTL · *time to live*).
- **Titel** „IT’S ALWAYS / DNS / SAMUEL HEINRICH“ in Michroma mit orangen Linien, 0,7–9,6 s und 253,6–258,15 s.

## Ablauf

| Zeit | Kapitel | Inhalt |
| --- | --- | --- |
| 0:00 | Der Anruf | Nachtstadt, Telefon klingelt; die erste Abfrage läuft Root → .com → ns1 (intern) und endet in NXDOMAIN. |
| 0:15 | Symptome | Ticket #4040; Ping per IP sauber, Routen gut, nur der Name ist weg. |
| 0:30 | Ausschluss | Kabel, Port Gi1/0/12, Firewall, Traceroute grün; Drop 31,35 s; die Lupe landet auf DNS. |
| 0:38 | Hook: Beweise | DIG IT UP · TTL · NXDOMAIN · WHO CAN TELL · RESOLVER SAYS NO · CACHE SAYS YES. |
| 0:48 | Urteil | Chorus; Switch, Router, Firewall entlastet; Neonschild. |
| 0:59 | Indizien | Fremde Namen über Root/.net; alter Cache 86400; Split-Brain; Reverse ohne PTR; CNAME-Kette ins Leere. |
| 1:23 | Flush · Query · Dig · Fix | Bridge: Flush, erneute Frage (wieder NXDOMAIN), dig auf beide Views, Fix, Antwort. |
| 1:31 | Final Hook | Dieselben Wörter, jetzt grün aufgelöst. |
| 1:38 | Fall geschlossen | TTL läuft, Final Chorus, Stempel CASE CLOSED, Licht aus (Blackout). |
| 2:01 | Nachttour | Rekursion für kisound.ch, .org, Tippfehler, MX, PTR; Timeout in der Stille; Ablauf kurzer TTLs. |
| 3:02 | Fallwand | Alle Spuren an der Wand; das Telefon klingelt wieder. |
| 3:23 | Fall #4041 | Reprise: intranet → portal → lb, das Ende der Kette fehlt. |
| 3:46 | Indizien II | Licht aus/an, alte Caches, Split-Brain, Reverse, CNAME-Tanz mit `+trace`. |
| 4:10 | Fix und Abspann | Flush, Query, Dig, Fix; Titel. |
| 4:18 | Fall #4042 | Drucker, Dig it up · TTL · NXDOMAIN – harter Schnitt. |

## Technische Leitplanken

- Jedes Bild ist eine reine Funktion der absoluten Zeit; kein Zufall ausser festem Seed.
- Lyric-Zeiten unverändert aus dem automatischen Transkript, nicht auf das Beat-Raster gezogen.
- Tempo 127 BPM, Sicherheit mittel; das Beat-Raster ist synthetisch und dient nur der Kamera-Atmung.
- Zeiten im DNS-Modell sind redaktionell verdichtet, Adressen sind Szenariowerte.
