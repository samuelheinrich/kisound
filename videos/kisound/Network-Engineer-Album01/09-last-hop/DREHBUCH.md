# LAST HOP — Drehbuch

Codebasiertes Musikvideo · Track 09 · *Network Engineer* (Album 01) · Samuel Heinrich
Audio: `09_Last_Hop_0.1-1.wav` · 294.721 s · 48 kHz stereo
Transkript: `09_Last_Hop_Transkript.json` (sha256 `d0fc41b0…27cf6`)
Ziel: 3840×2160 @ 60 fps, 17 684 Frames · Vorschau 1080p

## Fassung «Starship» (5. Oktober 2026)

Die Netzwerk-Abstraktion (Korridor, Datenwände, Setpieces) war zu abstrakt. Der Closing Track des Albums wird jetzt
eine Reise durch den Weltraum. Zeiten, Kapitel, Schnitte (58 Einstellungen, gerastet auf gemessene Kicks), TTL-Logik,
Kehre, Rückblende, Farbumschlag und alle Syslog-Texte bleiben – nur die Welt ist neu (`src/render/zones/cosmos.js`).
Die folgenden Abschnitte §1–§6 beschreiben die Mechanik und gelten weiter; die Bilder ersetzt diese Tabelle.

**Der Held** ist der Ethernet-Frame als Raumschiff: die lesbaren Felder (DST/SRC MAC, TTL, IPs, Payload, FCS) bilden
den Rumpf, dazu Cockpitkuppel, zwei Warp-Gondeln mit laufenden Ringen und drei Triebwerke. Cyan auf dem Hinweg, amber
nach dem Farbumschlag.

**Warp:** Beschleunigung mit Sternen, die zu Strichen werden (Länge ∝ Warp²), Zurückfallen in den Normalraum. Die
zurückgelegte Strecke ist das Integral der Warp-Geschwindigkeit – vorausberechnet, also eine reine Funktion von t.
**Während der Warp-Phasen sitzt die Kamera fest im Cockpit** (kein Wackeln, kein Kick-Zoom, kein Glitch – nur die Sterne ziehen): Syslog, Traceroute mit TTL und WARP-Wert sowie die
Sternkarte der neun Hops laufen auf den drei Displays (das 2D-Overlay pausiert dann).

| Kapitel / Szenen | Ort im All |
| --- | --- |
| Intro (0–20,8 s) | Nebel in Violett und Cyan, das Schiff treibt; Asteroiden mit fremdem Verkehr («after all the noise»); Cockpit mit der unvollständigen Sternkarte («one hop more») |
| Titel, Sturz (20,8–34,5) | Triebwerke zünden, Titel LAST HOP neben dem Rumpf, erster Warp-Sprung |
| Hop 1–5 (34,5–61,3) | Raumstation mit Andockring (Hop 1), Gasriese im Vorbeiflug (Hop 2), Warp im Cockpit (Hop 3), Sternentor mit Scanner = Firewall, wird grün und lässt passieren (Hop 4), Cockpit «Routing-Tabelle», Ringplanet taucht aus dem Warp auf (Hop 5) |
| Pre-Chorus (61,3–80,7) | Sprünge im Takt an fünf farbigen Sternen vorbei, Cockpit-Warp, TTL 60 in Nahaufnahme am Rumpf, **Kehre**: Swing-by um einen Pulsar, TTL zurück auf 64 |
| Chorus 1 – Vorausblende (80,7–109,4) | gestottert und gestört: Sternkarte mit der Route, Zielplanet mit Pin, das Wurmloch aus der Ferne, das 3-Sonnen-System, der Zielplanet aus dem Orbit; Warp im Cockpit (ruhig, ohne Pumpen) |
| Rückblende (109,4–123,9) | entsättigt: Ionensturm mit Blitzen, das Sternentor zerbricht (BGP down), Sonden verschwinden ohne Antwort, ein älteres Paket kreist um einen Doppelstern und verglüht (TTL exceeded) |
| Konvergenz (123,9–139,1) | das **riesige Wurmloch** (Horizont 440, Scheibe bis 2080 Einheiten; das Schiff ist 7 lang) – Lichtring, verkippte Akkretionsscheiben, im Schlund leuchtet blau die andere Seite. Die Kamera folgt dem winzigen Schiff, das direkt hineinfliegt; dann der leuchtende Tunnel («all the layers / all the paths meet») |
| Hook (139,1–157,2) | Austritt im **System mit drei Sonnen** (Hop 6), dritte Sonne geht auf, Kurve um einen blauen Ringplaneten, Farbumschlag cyan → amber, Nachtseite eines Planeten mit Stadtlichtern |
| Bridge (157,2–187,2) | ruhiger Flug: Cockpit ohne Alarm, Seitenansicht, Triebwerke, Warp-Gondel, durch die Ringe (Hop 7), über die Wolkendecke, Morgendämmerung im 3-Sonnen-System |
| Build (187,2–207,6) | Montage der Reise im Takt: Nebel, Tor, Ringplanet, Pulsar, Wurmloch, drei Sonnen, Ringe, Zielplanet |
| Final Chorus – der letzte Hop (207,6–236,3) | Austritt aus dem Warp vor dem blauen Zielplaneten bei Sonnenaufgang, Pin auf dem Ziel; Relais-Station im Orbit lernt die MAC (Hop 8); **Highlight:** das Schiff wird zu einem Lichtstrahl (Hop 9, Funk) und fällt durch die Atmosphäre auf ein einziges warmes Fenster einer Stadt im Morgengrauen |
| Outro (236,3–295) | hinter dem Fenster ein echter Raum im Morgenlicht: Schreibtisch, Laptop spielt «09 LAST HOP» (Wellenform auf dem Kick); Rückzug durch die Massstäbe – Stadt, Planet, Galaxie mit der Route der neun Hops –, zurück auf die Stadt und in den Raum; Schlusskarte über dem Laptop |

---


## 0 · Verhältnis zum Entwurf von Astra

Astras Entwurf liefert drei Ideen, die ich übernehme und schärfe:

- die **Vorausblende** im ersten Chorus, die die Ankunft bewusst zurückhält;
- **TTL als sichtbares Zahlenmotiv**, das nur an Routern zählt, nicht an Switches;
- den **Massstabssprung** am Schluss, vom Gerät zurück in die Topologie.

Drei Punkte verwerfe ich:

1. **Selution ist raus — vollständig.** Astras Entwurf baut auf Logo, Schriften, RMM
   und der Website von Selution auf. Das ist die Marke eines anderen Projekts. *Last Hop*
   ist der Schlusstrack eines Musikalbums; ein Firmenlogo im Schlussbild macht aus dem
   Albumfinale einen Werbespot. Die Identität dieses Films ist die des Albums: das
   Cover von Track 09, die Albumtypografie, die Figur des Network Engineer.
2. **Keine Lyrics im Bild.** Astra erlaubt einzelne Begriffe wie «LAST HOP» als
   Bildelement. Album 02 hat die Regel bereits gesetzt und der Auftraggeber sie
   bestätigt: **nur Systemmeldungen**. Das gilt hier ebenso und ist stärker, weil das
   Cover diese Sprache bereits spricht — HUD-Panels, MAC-Tabelle, Port-Status. Der
   einzige gesetzte Text ist der Titel (einmal) und die Schlusskarte.
3. **Die Reise ist keine Einbahnstrasse.** Astra bewegt sich 4:55 lang in eine Richtung.
   Der Text tut das nicht: Verse 1 geht *hinaus* («from the access to the edge, from the
   edge into the core»), und «One more turn and we are home» ist keine Strassenkurve —
   das ist die **Kehre am fernen Server**. Der Film ist ein Round Trip. Damit landet die
   Zeile, der Refrain bekommt einen Grund, und die Struktur ist technisch exakt.

Neu dazu kommt die Mechanik in Abschnitt 4 — die Rückblende in Verse 2, in der unser
Paket tatsächlich stirbt, und der Reim zwischen erstem und letztem Chorus.

---

## 1 · Leitidee

> **Neun Hops. Der letzte trifft einen Menschen.**

Vier Minuten lang sind wir keine Person, sondern ein Paket: Zahlen, Ports, Blech, Glas.
Der Film ist eine einzige Transaktion — eine Anfrage geht hinaus, kehrt am fernen Server
um, kommt zurück. Jeder Hop ist ein Bild. Der neunte Hop ist der einzige, der die
Infrastruktur verlässt: Er geht durch die Luft in ein Notebook auf einem Schreibtisch,
im ersten Morgenlicht.

Und was dort ankommt, ist dieser Track. Der letzte Hop liefert das Album an den, der es
hört. Deshalb endet der Film mit einer Ping-Statistik über zehn Titel und nicht mit einem
Logo.

---

## 2 · Der Kanon — alles steht auf dem Cover

Das Artwork von Track 09 ist kein Beiwerk, es ist das Storyboard. Es liefert verbindlich:

| Vorgabe | Wert | Verwendung im Film |
|---|---|---|
| `HOP COUNT` | **09** | Die Route hat neun Hops. Track 09. Hop 9 ist der letzte. |
| `IP ADDRESS` | **192.168.1.254** | Das Notebook. Zieladresse in jeder Einblendung. |
| `MAC ADDRESS` | **00:1A:2B:3C:4D:5E** | Erscheint in der MAC-Tabelle beim vorletzten Hop. |
| `STATUS` | **REACHABLE** | Das Wort, das am Schluss grün wird. |
| Farbverlauf der Route | cyan → amber | Der Farbbogen des Films, siehe 3.1 |
| Standort-Pin | amber, gepulst | Die Zielmarkierung im Chorus |
| Notebook | Drahtgitter | Löst sich im Finale in echte Geometrie auf |
| HUD-Panels | L2 STATUS, PORT STATUS, PROTOCOLS | Die Textsprache des Films |
| Waveform unten | cyan | Der «heartbeat», siehe 4.4 |

Die Farbkehre auf dem Cover — die Route ist zuerst cyan, knickt ab und ist danach amber —
ist der Wendepunkt des Films und liegt exakt auf der Zeile *«Destination comes alive»*.

---

## 3 · Visuelle Grundregeln

### 3.1 Palette

| Rolle | Hex | Bedeutung |
|---|---|---|
| `void` | `#05080e` | Hintergrund, nie reines Schwarz ausser im Abspann |
| `grid` | `#0d2233` | Bodenraster, inaktive Topologie |
| `cyan` | `#1ea8ff` | Infrastruktur, Transit, **Hinweg** |
| `cyanHot` | `#8fe4ff` | Paketkern auf dem Hinweg |
| `amber` | `#ff7a18` | **Rückweg**, Ziel, der letzte Hop |
| `amberHot` | `#ffd08a` | Paketkern nach der Kehre |
| `ok` | `#3fe08a` | Link up, Route clean |
| `warn` | `#ffc857` | Queue, Verzögerung |
| `down` | `#ff3b3b` | Ausfall — nur in der Rückblende |
| `dawn` | `#ffb37a` | Morgenlicht im Finale |

Der Farbbogen über die Laufzeit: kühl und dunkel bis 1:20 · erster Chorus mit einem
vorweggenommenen Amber-Stich · Rückblende entsättigt mit rotem Akzent · ab 2:26 kippt
alles nach amber · ab 3:07 mischt sich `dawn` dazu · Schlussbild warm.

### 3.2 Typografie

**Space Grotesk** (Titel, Schlusskarte) und **JetBrains Mono** (alles Maschinelle).
Beide OFL, beide bereits in `02-trustsec/assets/fonts/` vorhanden und von dort zu kopieren.

### 3.3 Textregel — nur Systemmeldungen

Gesungen wird nichts eingeblendet. Auf dem Bild erscheint ausschliesslich, was eine
Maschine ausgeben würde:

- **Oben links, permanent ab 0:34** — die Traceroute-Liste, die sich über den ganzen Film
  aufbaut, eine Zeile pro erreichtem Hop:
  ```
   1  acc-sw-01        Gi1/0/24      0.31 ms
   2  dist-rtr-01      10.24.0.1     0.88 ms
   …
   9  192.168.1.254                  8.94 ms
  ```
- **Oben rechts** — ein HUD-Block im Stil des Covers, der pro Szene wechselt
  (`PORT STATUS`, `PATH SELECTION`, `L2 STATUS`, `RADIO`).
- **Unten links** — Syslog, wie in TrustSec:
  ```
  02:37.18  %SYS-6-CLEAN: no alarms in console
  ```
- **Am Paket** — TTL als Zahlenband um den Kern (Wiederverwendung des SGT-Bands
  aus `packet.js`).
- **Bildmitte** — nur dreimal im ganzen Film: der Titel (0:29), `TTL EXCEEDED` in der
  Rückblende (1:59), die Schlusskarte (4:42).

### 3.4 Das Heldenpaket

Ein oktaedrischer Kern mit kurzem Schweif, zwei Ringen und dem TTL-Band. Auf dem Hinweg
`cyanHot`, nach der Kehre `amberHot`. Fremde Ströme sind immer dünner, dunkler,
unscharf — wenn das Bild dem Paket folgt, muss es in einem Viertelbild identifizierbar
sein.

### 3.5 Woher der Text kommt — der Unterschied zu TrustSec

Bei TrustSec enthielt das Transkript zwei Stimmen: gesungene deutsche Lyrics und
englische Computerstimmen-Systemmeldungen. Der Code trennte sie und zeigte nur die
zweiten. **Hier gibt es das nicht.** Das Transkript von *Last Hop* hat 54 Segmente, und
alle 54 sind gesungene Zeilen. Es gibt nichts zu extrahieren.

Konsequenz für den Bau: Der Bildtext wird **geschrieben, nicht abgeleitet**. Eine neue
Liste `MESSAGES` in `config.js` hält jede Zeile mit eigener Zeit, Tag und Status:

```js
{ t: 0.0341, tag: 'SYS-5-RESTART', text: 'route lookup initiated', status: 'info' }
{ t: bar(9),  hop: 1, node: 'acc-sw-01', port: 'Gi1/0/24', rtt: 0.31 }
```

Das Transkript liefert weiterhin die **Zeitanker** (Vokaleinsätze, Abschnittsgrenzen) und
die Schnittrasterung — aber keine Silbe davon erscheint im Bild. Damit ist die Regel «nur
Systemmeldungen» hier sogar strenger als bei TrustSec durchgesetzt: Es *kann* keine Lyric
ins Bild rutschen, weil der Renderer die Lyric-Segmente gar nicht erst als anzeigbar
kennt.

Praktisch heisst das: `classify()` fällt auf «alles ist Lyric, nichts wird gezeigt»
zusammen, und die bestehende Overlay-Maschinerie (Tippanimation, Rangfolge-Alpha,
Cursor auf der Zählzeit) wird von `MESSAGES` statt vom Transkript gespeist. Sie bleibt
unverändert.

---

## 4 · Die Mechanik

Vier Dinge, die der Zuschauer in den ersten dreissig Sekunden lernt und danach den ganzen
Film lang liest. Das ist der Unterschied zwischen einer Folge schöner Orte und einem Film.

### 4.1 Die neun Hops

| # | Knoten | Typ | Adresse | TTL danach | Zeit |
|---|---|---|---|---|---|
| 1 | `acc-sw-01` Gi1/0/24 | L2 Access | — | 64 | 0:36 |
| 2 | `dist-rtr-01` | L3 Distribution | `10.24.0.1` | 63 | 0:38 |
| 3 | `core-rtr-01` | Core | `10.0.0.1` | 62 | 0:41 |
| 4 | `edge-fw-01` | Firewall / Edge | `198.51.100.1` | 61 | 0:49 |
| 5 | `ix-fra-01` | Transit / IXP | `203.0.113.9` | 60 | 0:57 |
| — | **KEHRE** — ferner Server | Antwort entsteht | — | **64** | 1:14 |
| 6 | `ix-zrh-01` | Transit | `203.0.113.10` | 63 | 2:19 |
| 7 | `core-rtr-02` | Core | `10.0.0.2` | 62 | 2:45 |
| 8 | `acc-sw-07` | L2 Access | — | 62 | 3:31 |
| 9 | `ap-02` → `192.168.1.254` | Wireless, **Last Hop** | Ziel | **62** | 3:43 |

Zwischen Hop 5 und 6 liegt der ganze erste Chorus und Verse 2 — dort steht die Zeit
still, weil dort erinnert und vorausgesehen wird, nicht gereist.

### 4.2 TTL

Das Band am Paket zeigt den Wert. Es zählt **nur an Routern** herunter, an Switches und
am Access Point bleibt es stehen — das ist korrekt und dem Publikum, das diesen Track
hört, sofort erkennbar. An der Kehre springt es auf `64` zurück, weil dort ein neues
Paket entsteht: die Antwort. Dramaturgisch ist das ein geschenktes Leben, drei Sekunden
vor dem ersten Chorus.

Ankunft bei `ttl=62`. Genau dieser Wert steht auf der Schlusskarte.

### 4.3 Der Tod in der Rückblende

Der Text von Verse 2 steht im Präteritum — *«There **were** storms»*, *«routes that
**disappeared**»* — und kippt in Zeile 5 ins Präsens: *«the graph returns to green
**now**»*. Der Film nimmt das wörtlich.

1:49.4–2:03.9 ist eine **Rückblende**: entsättigt, mit einem Zeitstempel aus der
Vergangenheit in der Ecke (`Mar 14 03:11:07.442`), leichtes Bildrauschen. Wir sehen ein
*früheres* Paket auf derselben Strecke. Eine Route wird zurückgezogen, der Pfad schleift,
und das TTL-Band — das wir dreissig Sekunden lang als ruhigen Zähler gelesen haben —
**rast auf null**. Das Paket erlischt. In der Traceroute-Liste erscheinen `* * *` und
`!H`. Stille im Bild, die Kamera hält auf nichts.

Bei 2:03.9 harter Schnitt zurück in die Gegenwart: Farbe kehrt zurück, derselbe Link
kommt hoch, unser Paket liegt unversehrt mit `TTL 64` da. Das war eine Erinnerung.

Das ist der emotionale Tiefpunkt und der einzige Moment mit Rot im ganzen Film.

### 4.4 Der Herzschlag

Ein globaler Lichtpuls läuft ab dem ersten Chorus durch die Topologie, auf dem
gemessenen Kick-Raster des Tracks. Ports, Leitungen und Knoten reagieren zeitversetzt
nach ihrer Entfernung vom Kern. Im letzten Bild pulst die Waveform auf dem
Notebook-Bildschirm — die Waveform vom Cover — im selben Takt. Was wir den ganzen Film
für ein Bildmotiv gehalten haben, war der Track selbst.

### 4.5 Der Reim

Chorus 1 (1:20.72) und Final Chorus (3:27.56) haben **dieselbe Einstellungsfolge, dieselben
Kamerafahrten, dieselben Schnittpunkte** — Bild für Bild. Unterschied:

- **Chorus 1** ist eine Vorausberechnung. Die Bilder stottern, ein Frame-Hold hier, ein
  Glitch dort, der Zeitstempel oben rechts läuft der echten Uhr voraus. Der letzte Meter
  wird jedes Mal abgeschnitten, bevor man das Ziel sieht. `PREDICTED` steht klein im HUD.
- **Final Chorus** ist echt. Kein Stottern, Zeitstempel synchron, und jede Einstellung
  läuft diesmal zu Ende.

Wer den Film zweimal sieht, sieht beim zweiten Mal, dass der erste Chorus gelogen hat.

---

## 5 · Szenenplan

Zeiten aus dem Transkript. Schnitte innerhalb einer Szene werden beim Bau auf das
gemessene Beat-Raster gerastet (siehe 8.1); die hier genannten Zeiten sind die
Vokal-Anker.

---

### S01 · 0:00.000 – 0:03.060 · TRÄGERSIGNAL
**Bild** Schwarz. Eine einzelne horizontale Linie, dunkelcyan, kaum sichtbar, mit
minimalem Rauschen — ein Link ohne Verkehr.
**Ereignis** Bei 0:02.4 ein erster schwacher Impuls, der von links nach rechts durchläuft.
**Text** keiner.

### S02 · 0:03.060 – 0:20.840 · INTRO — DAS FERNE ZIEL

| Zeit | Zeile | Bild |
|---|---|---|
| 3.06 | *Every route has an ending.* | Die Linie wird zur Route: ein Lichtfaden zieht sich in die Tiefe, die Kamera folgt ihm von der Seite. Das Ende bleibt ausserhalb des Bildes. |
| 6.88 | *Every signal finds a shore.* | Die Perspektive öffnet sich nach oben. Unter uns ein dunkler Ozean, durchzogen von Seekabeln als feinen Linien. Am Horizont ein einzelner warmer Punkt — das erste Amber des Films, sehr klein. |
| 12.36 | *After all the noise and distance* | Hunderte fremde Ströme queren das Bild, dicht, kalt, richtungslos. Unser Faden bleibt der einzige, der scharf ist. |
| 17.78 | *there is one hop more.* | Ein weiter Rückzug. Die ganze Route liegt als Linie da — **und ganz am Ende fehlt ein Stück.** Der letzte Abschnitt ist dunkel. Das Ziel dahinter glimmt. |

**Kamera** Eine einzige, langsame, nie schneidende Bewegung über 17 Sekunden.
**Text** Ab 3.06 unten links der erste Syslog-Eintrag: `%SYS-5-RESTART: route lookup initiated`.

### S03 · 0:20.840 – 0:34.460 · AUFSTIEG UND TITEL
**Bild** Die Kamera steigt über die Landschaft. Zum ersten Mal die Dimension: Zugangsknoten
als Lichtnester, Core als helle Achse, entfernte Rechenzentren als Blöcke. Das Bodenraster
vom Cover.
**Ereignis** Bei ca. 0:29 (auf die Zählzeit gerastet) ordnen sich Kanten der Topologie für
2.5 Sekunden zu den Buchstaben **LAST HOP**, Space Grotesk, und zerfallen wieder.
Direkt danach stürzt die Kamera auf einen einzelnen aktiven Anschluss zu und geht in die
Paketperspektive.
**Text** Titel. Danach oben rechts das HUD-Panel `PORT STATUS` mit `Gi1/0/24  1 Gbps  UP`.

### S04 · 0:34.460 – 0:49.440 · VERSE 1a — HOPS 1 BIS 3

| Zeit | Zeile | Bild |
|---|---|---|
| 34.46 | *From the access to the edge,* | **Makro auf den RJ45-Port.** Die acht Kontakte, die Verriegelung, die Port-LED. Wir tauchen durch die Buchse in die Leiterbahn. → **Hop 1**, TTL bleibt 64. |
| 36.76 | *from the edge into the core,* | Enge Bahnen öffnen sich in die Switching Fabric: eine breite, mehrspurige Halle aus Licht. → **Hop 2**, TTL 63. |
| 38.36 | *through the transit and the silence,* | Wir verlassen die dichte Infrastruktur. Eine fast leere Glasfaserstrecke, nur Geschwindigkeit und Abstand. → **Hop 3**, TTL 62. |
| 41.92 | *past the firewalls and the doors.* | Eine Schleuse. Sechs Sekunden Zeit — die Regelprüfung wird sichtbar abgearbeitet, Zeile für Zeile, bis eine Regel grün wird und genau ein Durchlass aufgeht. |

**Kamera** Paketperspektive mit zwei Aussenblicken zur Orientierung.
**Text** Die Traceroute-Liste beginnt zu schreiben, eine Zeile pro Hop. TTL-Band am Paket.

### S05 · 0:49.440 – 1:01.280 · VERSE 1b — HOPS 4 UND 5

| Zeit | Zeile | Bild |
|---|---|---|
| 49.44 | *Every metric, every prefix,* | Im Router. Eine Routing-Tabelle steht als Wand aus Einträgen im Raum — nicht flimmernd, sondern ruhig und lesbar. → **Hop 4**, TTL 61. |
| 51.64 | *every table in the night,* | Die Kamera fährt an der Wand entlang. Die meisten Einträge dunkel. |
| 53.18 | *points the packet to the distance,* | Ein Präfix leuchtet auf — `203.0.113.0/24, metric 20`. Der zugehörige Ausgang öffnet sich. → **Hop 5**, TTL 60. |
| 57.54 | *keeps the destination bright.* | Blick entlang der gewählten Strecke. Am Ende, winzig: derselbe warme Punkt aus dem Intro. Dreieinhalb Sekunden ohne Schnitt. |

**Text** HUD oben rechts wechselt auf `PATH SELECTION`.

### S06 · 1:01.280 – 1:20.720 · PRE-CHORUS — DIE KEHRE

| Zeit | Zeile | Bild |
|---|---|---|
| 61.28 | *Hop by hop, the path is drawn.* | Mit jedem Knoten wird ein weiterer Abschnitt der grossen Topologie sichtbar, wie eine sich selbst zeichnende Karte. |
| 67.62 | *Link by link, we carry on.* | Verbindungen setzen sich zu einer Lichtbrücke zusammen, Segment für Segment im Takt. |
| 71.28 | *TTL falling, but the signal is strong.* | Nahaufnahme des TTL-Bands. `60`. Es ist das erste Mal, dass die Kamera es ernst nimmt. |
| 74.18 | *One more turn and we are home.* | **Die Kehre.** Wir erreichen den fernen Server — eine ruhige, sehr grosse, dunkle Form. Das Paket läuft hinein und kommt als **anderes** Paket wieder heraus: amber-gesäumt, TTL zurück auf `64`. Die Kamera dreht 180°. Zum ersten Mal zeigt die Bewegungsrichtung nach Hause. |

**Ereignis** Der 180°-Schwenk läuft über die letzten vier Takte vor dem Chorus und endet
exakt auf dem Drop bei 1:20.72.

### S07 · 1:20.720 – 1:49.400 · CHORUS 1 — DIE VORAUSBERECHNUNG

Die Bildwelt öffnet sich. Wir sehen das Ende — aber es ist nicht echt. Siehe 4.5.

| Zeit | Zeile | Bild (Einstellung A–F, kehrt im Final Chorus wieder) |
|---|---|---|
| 80.72 | *Last hop.* | **A** Weitwinkel auf die gesamte Topologie, ein Puls läuft durch. |
| 82.88 | *Destination reached.* | **B** Eine abstrakte Zielmarkierung — der Pin vom Cover — schliesst sich um den Lichtkern. |
| 84.40 | *Last hop.* | **C** Match Cut: reale Netzwerkbuchse → die riesige Landschaft in ihrem Inneren. |
| 85.70 | *Across the unseen.* | **D** Der Funkraum. Wellen im leeren Zimmer, ohne Gerät. |
| 87.90 | *Last hop.* | **E** Die vollständige Strecke als eine zusammenhängende Linie, von Hop 1 bis 9. |
| 89.74 | *The route is complete.* | **F** Ein Notebook, von hinten, geschlossenes Drahtgitter. Der Schnitt kommt zu früh. |
| 92.04 | *One final packet* | Der Herzschlag setzt ein (4.4). |
| 94.02 | *through the heartbeat.* | Puls läuft durch Ports, Leitungen, Knoten, zeitversetzt. |
| 100.82 | *Through the heartbeat.* | Rückzug. Die Vision löst sich in Streifen auf. |

**Stil** Frame-Holds auf den Zählzeiten, leichter Glitch, Chromatic Aberration erhöht.
**Text** Oben rechts klein `PREDICTED`, der Zeitstempel läuft ~11 s vor.
**Ausgang** 1:43.5–1:49.4 sechs Sekunden Instrumental: wir sind zurück auf der realen
Strecke, zwischen Hop 5 und 6, und es ist dunkler als vorher.

### S08 · 1:49.400 – 2:03.900 · VERSE 2a — DIE RÜCKBLENDE

Entsättigt. Zeitstempel `Mar 14 03:11:07` oben links. Leichtes Rauschen. Siehe 4.3.

| Zeit | Zeile | Bild |
|---|---|---|
| 109.40 | *There were storms in the switching,* | Warteschlangen wachsen. Pakete stauen sich an einer Engstelle, Puffer laufen voll, `warn`-gelb. |
| 112.20 | *there were routes that disappeared.* | Ein Eintrag wird aus der Tabelle gestrichen. Vor uns endet die Strecke im Nichts. `%BGP-5-ADJCHANGE: neighbor 203.0.113.9 Down`. |
| 115.82 | *There were queries without answers,* | Anfragen laufen hinaus und kommen nicht zurück. Ihre Markierungen verblassen nach Timeout. In der Liste: `* * *`. |
| 119.88 | *there were outages and fear.* | **Das Paket schleift.** Es läuft im Kreis zwischen zwei Routern, und das TTL-Band rast: 24, 17, 9, 3, 0. Bei 0 erlischt der Kern. Bildmitte für 1.2 s: `TTL EXCEEDED`. Danach zwei Sekunden fast leeres Bild. |

**Das ist der einzige Rotmoment des Films.**

### S09 · 2:03.900 – 2:19.140 · VERSE 2b — KONVERGENZ

Harter Schnitt in die Gegenwart. Farbe kehrt zurück, Zeitstempel wieder aktuell.

| Zeit | Zeile | Bild |
|---|---|---|
| 123.90 | *But the graph returns to green now,* | Ein Ersatzpfad wird aktiv. Statusanzeigen kippen der Reihe nach auf `ok`. `%BGP-5-ADJCHANGE: neighbor 203.0.113.10 Up`. |
| 127.30 | *and the backbone starts to breathe.* | Ein breiter Lichtpuls läuft durch die Hauptverbindungen. Unser Paket liegt unversehrt da, `TTL 64`. |
| 131.18 | *All the layers stand together,* | Vier transparente Ebenen desselben Datenflusses richten sich übereinander aus: Signal, Frame, IP-Paket, Segment. |
| 134.24 | *all the paths begin to meet.* | Die Ebenen fallen zusammen. Nebenströme münden geordnet in die Hauptstrecke. |

### S10 · 2:19.140 – 2:37.180 · HOOK — DER FARBUMSCHLAG

Vier Zeilen, vier klare Aktionen, je eine auf den Takt.

| Zeit | Zeile | Aktion |
|---|---|---|
| 139.14 | *One more hop.* | **Hop 6** erreicht, TTL 63. |
| 140.20 | *One more light.* | Ein Link leuchtet auf, der vorher dunkel war. |
| 141.30 | *One more route through the night.* | Eine weite Kurve gibt erstmals den Blick auf das Zielnetz frei. |
| 144.96 | *Destination comes alive.* | **Der Farbumschlag.** Die gesamte Route kippt von cyan nach amber, von hinten nach vorn durchlaufend, 0.8 s. Danach ist der Film warm. |

**2:26.4 – 2:37.18 · 11 s Instrumental** Wir fliegen zum ersten Mal aus der Hardware
heraus. Aussenansicht: ein Gebäude in einer nächtlichen Stadt, wenige Fenster
beleuchtet, eines davon warm. Dann gleitet die Kamera ruhig zurück hinein.

### S11 · 2:37.180 – 3:07.220 · BRIDGE — DAS NETZ TRÄGT

Ruhiger, präziser, langsamere Schnitte. Detailaufnahmen statt Weitwinkel.

| Zeit | Zeile | Bild |
|---|---|---|
| 157.18 | *No alarm in the console.* | Eine reduzierte Monitoringansicht. Alles still. Nur der Cursor blinkt. |
| 160.82 | *No loss in the stream.* | Eine Messstelle, gleichmässige Impulse, Zähler bei `0.00%`. |
| 165.06 | *Every link is holding.* | Makro: ein SFP-Modul, das Glas, das Licht darin. |
| 168.20 | *Every route is clean.* | Makro: ein Kabelstrang, eine Port-Reihe, alle LEDs grün. |
| 170.92 | *From layer one to layer four,* | **Hop 7**, TTL 62. Die vier Ebenen aus S09 kommen wieder, diesmal einzeln durchfahren. |
| 173.78 | *from wireless air to core,* | Eine einzige durchgehende Fahrt: Funkraum → Access Point → Switch → Core. Rückwärts, als Vorschau auf den Heimweg. |
| 177.28 | *the network keeps on moving,* | Weit oben über der Stadt. Verkehr als Adernetz. |
| 181.28 | *then fades into the dawn.* | Der Horizont wird hell. `dawn` mischt sich in die Palette. Sechs Sekunden ohne Schnitt. |

### S12 · 3:07.220 – 3:27.560 · BUILD

Zwanzig Sekunden, ein einziger Kamerazug. Der Film sammelt seine Motive ein: die
reparierte Strecke, der Router, die Datenautobahn, die Buchse — jedes für einen
Wimpernschlag, in der Reihenfolge ihres ersten Auftretens.

Bewegung und Lichtdichte steigern sich mit dem Aufbau. **Bei ca. 3:26 ein harter
Ruhemoment:** alles friert für zwei Zählzeiten, nur das TTL-Band dreht sich weiter.
Dann der Drop.

### S13 · 3:27.560 – 3:56.260 · FINAL CHORUS — DER NEUNTE HOP

Dieselbe Folge A–F wie in S07, echt und zu Ende gespielt.

| Zeit | Zeile | Bild |
|---|---|---|
| 207.56 | *Last hop. Destination reached.* | **A/B** Die Topologie, der Puls, der Pin schliesst sich — und bleibt. |
| 211.46 | *Last hop. Across the unseen.* | **C/D** Match Cut in die Buchse. **Hop 8**, `acc-sw-07`, MAC-Tabelle lernt `00:1A:2B:3C:4D:5E`. Dann der Access Point: das Paket verlässt das Kabel und wird zu einer Welle im Raum. |
| 215.06 | *Last hop. The route is complete.* | **E** **Hop 9.** Die Welle erreicht die Antenne im Notebookdeckel. Gesamtansicht: die vollständige Strecke, alle neun Hops, eine Linie. |
| 219.02 | *One final packet through the heartbeat.* | **F** Die Kamera folgt den Daten durch das Gerät — Antenne, Bus, Speicher, Renderer — bis auf den Bildschirm. Das Drahtgitter-Notebook vom Cover wird zu echtem Gerät. |
| 228.04 | *Through the heartbeat.* | Die Kamera tritt aus dem Bildschirm zurück. Zum ersten Mal ein Raum: ein Schreibtisch, ein Fenster, erstes Morgenlicht. |

**Auf dem Bildschirm** lädt der Player dieses Albums. Die Waveform vom Cover baut sich
auf und pulst ab sofort auf dem Kick des Tracks (4.4). Kein Gesicht, kein Mensch im
Bild — nur die Spuren: eine Hand, die das Trackpad gerade verlassen hat, eine kalt
gewordene Tasse, ein Kabel über die Tischkante.

### S14 · 3:56.260 – 4:11.600 · OUTRO — DIE ANTWORT

| Zeit | Zeile | Bild |
|---|---|---|
| 236.26 | *The last hop answers.* | Ein kleiner Bestätigungsimpuls läuft vom Gerät zurück ins Netz — ACK. Wir sehen ihn nur als kurzes Aufblitzen der Port-LED. |
| 240.40 | *The signal lands.* | Die Seite steht. `STATUS  REACHABLE` wird grün. |
| 243.68 | *The route is silent.* | Die leuchtenden Hilfslinien der Visualisierung verblassen. Die reale Infrastruktur bleibt: die Port-LEDs blinken weiter, ohne Erklärung. |
| 249.36 | *The album ends.* | Die Kamera beginnt sich zu entfernen. |

### S15 · 4:11.600 – 4:42.000 · RÜCKZUG DURCH DIE MASSSTÄBE

Ein einziger, ununterbrochener Zug nach hinten über dreissig Sekunden, durch die
Massstäbe des ganzen Films — Bildschirm, Notebook, Schreibtisch, Raum, Fenster, Gebäude,
Stadt, Küste, Kontinent, Topologie.

Bei ca. 4:28 ist die Stadt nur noch Topologie, und die Route liegt als eine einzige feine
Linie darin — die Linie vom Cover, cyan, knickend, amber. Neun Knoten leuchten.

**Easter Egg** Entlang der Strecke liegen neun weitere, kleinere Knoten, die der Reihe
nach für je einen Frame aufleuchten und erlöschen: die neun vorangegangenen Titel des
Albums, in Reihenfolge. Wer es nicht bemerkt, verpasst nichts.

### S16 · 4:42.000 – 4:54.721 · SCHLUSSKARTE

Bewegung kommt zur Ruhe. Auf `void`, JetBrains Mono, links ausgerichtet, ohne Effekt:

```
--- 192.168.1.254 ping statistics ---
9 hops traversed, 1 packet transmitted, 1 received, 0% packet loss
rtt min/avg/max/mdev = 8.94/8.94/8.94/0.00 ms   ttl=62

--- network-engineer ping statistics ---
10 tracks transmitted, 10 received, 0% packet loss

route complete.
```

Darunter klein, Space Grotesk: **LAST HOP · SAMUEL HEINRICH · NETWORK ENGINEER**

Ab 4:50 sanfte Ausblendung, exakt auf dem Audioende bei 4:54.721 auf Schwarz.

---

## 6 · Blender — was übernommen wird

Die Pipeline in `public/globivonnairobi/tools/blender` erzeugt Spielwelt-Geometrie aus
einer deklarativen Recipe-JSON und exportiert GLB plus JSON-Sidecar. Das Muster passt,
die Inhalte nicht. Blender 5.2.2 LTS ist installiert.

### 6.1 Rollenteilung

**Blender baut nur statische Geometrie.** Kamera, Animation, Licht, Post und Schnitt
bleiben vollständig in Three.js. Damit bleibt die Doktrin intakt, dass jedes Bild eine
reine Funktion von `t` ist, und es entsteht keine zweite Renderfarm.

Was Blender dazugewinnt, das Three.js-Primitive nicht können: echte Fasen und saubere
Normalen an Hardware, Boolean-geschnittene Portkäfige, gebackene Ambient Occlusion als
Vertexfarbe, und Instanzierung für Racks und Stadt.

### 6.2 Übernommene Module → `videos/kisound/tools/blender/`

| Quelle | Ziel | Was bleibt, was ändert |
|---|---|---|
| `common.py` | `common.py` | `arguments`, `write_json`, `native`, `props`, `bounds`, `signature`, `collections`, `read_recipe` bleiben. **`BASIS` fällt weg** — die Quelle spiegelt X für Babylons Linkshänder-System; Three.js ist wie glTF rechtshändig Y-up, die Spiegelung würde jedes Asset kippen. `collider_record()` wird zu `anchor_record()`. Collection-Liste auf `GEO`, `ANCHORS`, `EXPORT`, `DEBUG` gekürzt. |
| `build_level.py` | `build_set.py` | Recipe→Szene-Schleife, Materialtabelle, `_generated_signature`-Idempotenz und Backup-bei-`--update` bleiben. Strassen-, Dach-, Treppen- und Fahrzeuglogik fällt weg. |
| `export_level.py` | `export_set.py` | GLB-Export und **`mergeRenderMeshes` pro Material** bleiben — das ist für die Draw-Call-Zahl in Three.js entscheidend. Der Sidecar trägt statt Türen und Spawns die **Anker**. |
| `validate_level.py` | `validate_set.py` | Nur die günstigen Prüfungen plus neue Renderbudgets. Der SAT-Flächenlöser fällt weg, der löst ein Level-Design-Problem, das wir nicht haben. |
| `render_level_preview.py` | `preview_set.py` | Fast unverändert: Workbench-Turntable als QA-Kontaktbogen. |

**Nicht übernommen:** `generate_collision.py`, `planar_union.py`, `mcp_bridge.py`,
`check_pipeline.py`, sämtliche `sg2020_*` und `zurich_*` Rezeptgeneratoren.

**Neu, ohne Vorlage:** `bake_set.py` — backt AO und Curvature in **Vertexfarben**
(nicht in einen Texturatlas: keine UVs nötig, Three.js liest Vertexfarben direkt, und
der GLB bleibt klein).

### 6.3 Die Anker sind der eigentliche Gewinn

Der Sidecar `<set>.anchors.json` gibt jedem benannten Punkt der Geometrie Position,
Rotation und freie Attribute. Der Three.js-Code sagt dann `anchor('acc-sw-01.port.24')`
statt Koordinaten zu raten. Vorgesehene Anker:

- `*.port.NN` — jede Buchse, mit `led` als Kind
- `*.uplink.N` — Fasereingänge
- `*.cam.<name>` — vorkomponierte Kamerastandorte direkt am Modell
- `path.NN` — Wegpunkte für den Paketflug durch ein Gerät

### 6.4 Asset-Liste

| Set | Inhalt | Budget |
|---|---|---|
| `port-macro` | eine RJ45-Buchse in Extremnähe, acht Kontakte, Verriegelung | 120 k |
| `switch-48p` | Access-Switch, 48 gefräste Portkäfige, SFP-Bucht, LED-Anker | 400 k |
| `router-core` | Chassis, Linecards, Faser-Bulkhead, 4 Uplink-Anker | 300 k |
| `ap-ceiling` | Access Point mit Halterung | 60 k |
| `laptop` | Deckel, Scharnier, Tastaturdeck mit Einzeltasten, Bildschirmanker | 350 k |
| `office` | Tisch, Stuhllehne, Tasse, Kabel, Fensterrahmen | 250 k |
| `rack-aisle` | Rack-Säule instanziert, Kabelrinne, Bodenplatte | 200 k |
| `city-block` | modularer Gebäudebaukasten für den Rückzug | 300 k |

Gesamtbudget **≤ 2 M Dreiecke**, ≤ 8 Materialien, alle GLB zusammen ≤ 60 MB. Der
Validator bricht ab, wenn ein Set sein Budget reisst. Geladen wird einmal pro
Renderlauf, die Ladezeit ist gegenüber 17 684 Frames vernachlässigbar.

---

## 7 · Technische Doktrin

Unverändert aus TrustSec übernommen, weil sie sich bewährt hat:

- **Jedes Bild ist eine reine Funktion von `t`.** Keine Zustandsakkumulation, keine
  Live-Audioanalyse. Teilrenderings und Parallelläufe liefern identische Bilder.
- **Audio wird nicht erzeugt.** Die WAV ist gesetzt. `prepare.mjs` misst Tempo, Beat-Grid
  und Kick-Onsets einmal und legt sie in `assets/audio/analysis.json` ab; das Rendering
  liest nur noch Zahlen.
- **Schnitte auf dem Raster.** Vokal-geführte Schnittgrenzen werden auf den nächsten
  Beat gerastet, wenn er weniger als ein Drittel Beat entfernt liegt.
- **Photosensitivität.** Höchstens eine deutliche Aufhellung pro Sekunde über den ganzen
  Film, gemessen und protokolliert. Der Farbumschlag bei 2:26 und der Drop bei 3:27 sind
  die einzigen Vollbild-Ereignisse.
- **Kameraachsen-Regel.** Aus dem TrustSec-Projekt: keine grosse beleuchtete Fläche
  direkt hinter einem transluzenten Vordergrundobjekt, sonst liest sie als schwebender
  Rahmen. Gilt hier besonders für den Monolithen des fernen Servers in S06.

---

## 8 · Baureihenfolge

1. **Projekt aufsetzen** — Ordner, `package.json`, Renderer-Wrapper auf
   `videos/kisound/tools/render.mjs`, Schriften aus `02-trustsec` kopieren,
   `.gitignore`.
2. **`prepare.mjs`** — Quelle ist die **WAV** `09_Last_Hop_0.1-1.wav`, nicht die MP3:
   der sha256 im Transkript (`d0fc41b0…`) ist der Hash der WAV, geprüft. Die MP3 in
   `xx_mp3/` würde die Prüfung reissen. `DURATION` ist **295** — die gemessenen
   294.721 s liegen innerhalb der 0.5-s-Toleranz von 295, aber nicht von 294.
   Analyse und Transkript nach `assets/` schreiben. **Ergebnis abwarten**: BPM und
   Beat-Raster bestimmen alle Schnittzeiten und sind bis dahin unbekannt. Die Zeiten in
   Abschnitt 5 sind Vokal-Anker, nicht Schnittzeiten.
3. **Animatic** — alle 16 Szenen als Farbflächen mit Szenenkarte über die volle Länge,
   1080p, in einem Durchlauf. Dramaturgie und Synchronität prüfen, **bevor** ein einziges
   Modell gebaut wird.
4. **Blender-Werkzeuge** portieren, `port-macro` als erstes Set durchspielen — es ist das
   kleinste und prüft die ganze Kette Recipe → Build → Bake → Validate → Export → Anker →
   Three.js.
5. **Restliche Sets** in der Reihenfolge ihres ersten Auftretens.
6. **Zonen ausarbeiten**, Szene für Szene, mit Stills als Zwischenkontrolle.
7. **1080p-Vorschau**, Abnahme, dann 4K final.

---

## 9 · Offene Punkte

- **`MESSAGES` steht** — 44 Zeilen Traceroute, Syslog und HUD-Text, davon 9 Hop-Zeilen.
  Feinschliff der Wortwahl nach der Abnahme des Animatics.
- **Raster gemessen: 131.746 BPM, beat0 0.3623 s.** Die Prompt-Angabe 128–132 stimmte also,
  anders als bei TrustSec. Der Comb-Filter aus dem TrustSec-Projekt versagte hier allerdings
  (flache Score-Kurve, Argmax 12 BPM daneben); gemessen wird jetzt per Autokorrelation bei
  100 Hz Onset-Rate. **Wichtiger Befund:** der ACF-Peak ist 4.2 BPM breit und die Kicks liegen
  im Median 44 ms neben dem Raster — der Track atmet. Schnitte rasten deshalb auf die
  gemessenen Kick-Onsets, nicht auf ein konstantes Raster.
- **Der Player im Finale** zeigt das Album. Falls das zu selbstbezüglich wirkt, ist die
  Rückfallvariante ein Monitoring-Dashboard, das auf grün geht — schwächer, aber neutral.
- **Renderzeit** für 4K bei 17 684 Frames mit GLB-Geometrie liegt über dem TrustSec-Wert;
  Schätzung nach dem ersten Vorschaulauf.

---

*Die WAV ist die verbindliche Zeitachse. Die Technik liefert die Bildwelt, die Musik
bestimmt den Rhythmus, die Reise erzählt die Geschichte.*
