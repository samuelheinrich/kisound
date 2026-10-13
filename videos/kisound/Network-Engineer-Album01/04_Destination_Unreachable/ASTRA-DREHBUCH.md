# 04 Destination Unreachable – Drehbuch (überarbeitete Fassung)

Grundlage war der ASTRA-Vorschlag vom 28.09. (unverändert gesichert unter
`_revisions/ASTRA-DREHBUCH-original.md`). Diese Fassung ist die Vorlage für den umgesetzten Code;
die genaue Schnittliste mit Event- und Lyric-IDs steht in `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Leitidee: Der leere Backbone

Nacht, Nebel, Router-Türme an durchhängenden Kabeln. Ein Probe-Host (192.0.2.10) erreicht den Server
203.0.113.45 nicht (die Adresse vom Cover). Der Film ist eine Traceroute-Ermittlung mit **zwei
verschiedenen Fehlern**, die man an ihrem Verhalten unterscheidet:

- **Leise:** R4 trägt eine vergessene Blackhole-Route (RTBH, „tag 666“) nach **Null0**. Pakete fallen
  dort lautlos in ein schwarzes Loch neben dem Turm, ohne jede ICMP-Meldung. Traceroute zeigt Hop 1–4
  (Time Exceeded), ab Hop 5 `* * *`. Auf „The blackhole grows“ wächst die Route von /32 auf /24, ein
  zweiter Server, der eben noch geantwortet hat, verschwindet ebenfalls.
- **Laut:** R2 fehlt das Präfix 198.51.100.0/24 (Site C). Von dort kommt ein rotes **ICMP 3/0 net
  unreachable** zurück.

Zweiter Raum ist die **Nebelkarte**: ein Kartentisch, auf dem der Nebel nur dort weicht, wo ein Hop
geantwortet hat. Daneben liegen ICMP-Zettel, Routing-Tabellen, das Firewall-Log und ein Terminal. Am Ende
sind beide Ursachen benannt, aber nicht behoben („not fixed tonight“). So bleibt das Ende offen wie der Song,
aber präzise.

## Was gegenüber dem Vorschlag geändert wurde

- **Eine Ursache, die man sehen kann:** Der Vorschlag wiederholte Szenen wörtlich (01/08, 02/03, 04/09,
  11/12, 13/14) und liess die Ursache bewusst unbestimmt. Jetzt gibt es eine konkrete, technisch
  stimmige Nacht mit zwei unterscheidbaren Fehlerarten: Stille (Null0) gegen Meldung (no route).
- **Pulse als Glossar mit echten Ereignissen:** Jede Zeile hat ihr Paket: das Unreachable von R2 auf
  „Destination unreachable“, das Time Exceeded von R1 auf „Time exceeded“, der Fall in Null0 auf
  „No reply“, die TTL-Anzeige einer Probe auf „TTL expired“ (im Test geprüft).
- **Der erste Drop ist eine Pause:** Bis 58,75 s läuft kein Sub-Bass. Davor liegt die Pegellücke
  58,45 s auf „Send it again“, dann fällt das Paket auf „Watch it fall“ (59,9 s) ins Loch.
- **Ermittlung statt Behauptung:** „Firewall quiet“ = 0 Treffer im Log von Firewall B (die Pakete kommen
  nie an); „one lost prefix“ = R2-Tabelle; „Metrics shift“ = Kostenwechsel über R3b, der Weg endet
  trotzdem in R4; die R4-Tabelle zeigt die Null0-Route.
- **Langes Outro (172–251 s) als Nacht:** Fahrten durch den Backbone und weitere Fälle in Null0 im
  Rhythmus der Bass-Einsätze; die Akte mit den Befunden liegt auf dem Tisch.
- **60 fps** wie die übrigen Album-01-Videos.

## Bildsprache

- **Farben:** Graphit, Nebel, kaltes Cyan; Rot nur für Unreachable und das Loch. Time-Exceeded-Zettel weiss.
- **Das Loch:** schwarze Kugel mit rotem Gegenlicht (wie eine Finsternis), Akkretionsring aus Partikeln;
  es wächst mit jedem verschluckten Paket und beim Sprung /32 → /24.
- **Spuren:** Jede Time-Exceeded-Antwort hinterlässt am Turm einen Ring, der über sechs Sekunden verblasst
  („every hop leaves a fading mark“).
- **Kinetische Wörter** für Pulse, Hook, Break, Final Hook und Finale, je mit einer Zeile Erklärung.
- **Titel** DESTINATION / UNREACHABLE / SAMUEL HEINRICH: 0,3–3,6 s und 242–250,8 s.

## Ablauf

| Zeit | Kapitel | Inhalt |
| --- | --- | --- |
| 0:00 | Pulse | Glossar der Stille, jedes Wort als Ereignis im Backbone; Traceroute Hop für Hop. |
| 0:30 | Ein Signal in den Kern | Echo Request überquert die Kante, verschwindet nach Hop 3; kein Alarm, keine Antwort. |
| 0:45 | Wo ist das Paket? | Nebelkarte; Blackhole wächst auf /24; nochmals senden; Fall auf „Watch it fall“; R2: no route. |
| 1:09 | Nacht | Bass, Fahrt, Traceroute. |
| 1:21 | Traceroute | Hop-Spuren, Firewall still, fehlendes Präfix, Echo ohne Reply, Metrikwechsel, Null0-Route. |
| 1:50 | Break | TTL expired · Next hop gone · Silent gateway · Moving on · ICMP · No reply · Packets fall · Signals die. |
| 2:12 | Final Hook | Dieselben Fragen, grösseres Loch. |
| 2:43 | Finale | Dreimal Destination unreachable, jedes Mal ein echtes ICMP 3/0. |
| 2:52 | Leerer Backbone | Akte mit Befunden; Nacht, Fahrten, Fälle. |
| 4:01 | Kein Weg | Titel, zwei letzte Unreachables, Blende ab 256,6 s. |

## Technische Leitplanken

- Null0 verwirft ohne ICMP; ein Router ohne Route antwortet mit Destination Unreachable (net unreachable).
- Traceroute erhöht die TTL; ein Router mit abgelaufener TTL antwortet mit Time Exceeded. R4 antwortet
  auf TTL 4 noch selbst, ab TTL 5 verschwinden die Proben (Test).
- Core-Adressen aus 198.18.0.0/15 (Benchmark-Bereich), Hosts aus den Dokumentationsbereichen.
- Zeiten verdichtet; RTT-Werte im Terminal sind Szenariowerte.
- Lyric-Zeiten unverändert aus dem automatischen Transkript, 132 BPM geschätzt (mittlere Sicherheit).
