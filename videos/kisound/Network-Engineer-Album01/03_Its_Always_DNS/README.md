# It’s Always DNS · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 03 als Kriminalfall im Nachtdienst: Ticket #4040 meldet „network down“,
und Ping, Routen, Kabel, Port und Firewall werden nacheinander entlastet, bis nur DNS übrig bleibt. Zwei
Bildräume teilen einen Modellzustand: die **Stadt** (Resolver, Cache, Root-Ring, TLDs, ns1 mit Split
Horizon) und der **Schreibtisch** (Fallakte, Terminal, Stempel, Lampe, Fallwand). 15 Kapitel,
100 Einstellungen (davon 20 POV-Fahrten mit einem Paket), 33 DNS-Transaktionen, unverändertes Originalaudio.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album01/03_Its_Always_DNS"
npm ci            # nur falls node_modules fehlt
npm run prepare   # prüft WAV/Transkript per SHA-256 und kopiert das Audio nach assets/audio
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8133/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Anderer Port: `npm run preview -- 8134`. `npm run serve` öffnet nichts.

Einstiege:

- `?t=9` erste Abfrage Root → .com → ns1 (intern) → NXDOMAIN · `?t=23.9` Ping per IP sauber
- `?t=31.3` Ausschluss auf dem Drop · `?t=38.7` Hook · `?t=48.1` Urteil
- `?t=59.6` Indizien: fremde Namen, alter Cache, Split-Brain, Reverse, CNAME
- `?t=83.4` Bridge: Flush · Query · Dig · Fix · `?t=91.3` Final Hook
- `?t=117` Fall geschlossen und Licht aus · `?t=121.4` Nachttour
- `?t=130` Timeout in der digitalen Stille · `?t=168` kurze TTLs laufen ab
- `?t=182` Fallwand · `?t=203.2` Fall #4041 (CNAME-Kette) · `?t=250.6` Fix · `?t=258.2` Fall #4042
- `?res=720` kleinere Vorschau · `?debug=1` Kapitel-, Shot-, Event- und Lyric-IDs
- `?w=1920&h=1080&t=80` Einzelbild ohne Player (QA)

Tasten: Leertaste Play/Pause, Pfeile ±1 s, Shift+Pfeil ein Bild, Home/End, 1–9 Kapitel,
L/M/F/D Schleife/Stumm/Vollbild/Cues.

## Bildwelt

Polarboden und Nachtstadt. Am Boden der Helpdesk mit zwei Laptops (der Bildschirm zeigt, was jeder
gerade auflöst), Switch, Router, Firewall und der App-Server 203.0.113.42. In der Mitte der Resolver
10.0.0.53 als Drahtglobus: blau, solange er Antworten liefert, magenta bei NXDOMAIN, dunkelrot bei
Timeout. Daneben sein Cache: eine Karte pro Eintrag mit Sanduhr (verbleibende TTL), Negativ-Einträge
magenta. Darüber fünf TLD-Plattformen (.com .net .org .ch .arpa), der Ring der 13 Root-Server und `ns1`
mit externer und interner View als zwei Spiegelwände; fehlende Einträge rot, nachgetragene grün.

Pakete: Anfrage gelb, Referral orange, Antwort grün, CNAME cyan, NXDOMAIN magenta, Timeout rot (bricht
auf halber Strecke ab). Terminal-Dock links in technischen Einstellungen, maximal drei Query-Log-Zeilen
unten, kinetische Wörter für Hook und Bridge. Schriften samt OFL-Lizenzen unter `assets/fonts`.
Prozedurale Three.js-Geometrie, keine externen Modelle.

## Quellen und Timing

- Finale WAV laut `03_Its_Always_DNS_1.0.txt`: `03_Its_Always_DNS_0.3-2.wav`,
  SHA-256 `b68aaccb7fddb1eea9241f6bc8f2a91ba30ad532e72355a1ac4309338ec294c4`.
- 48 kHz, 12 537 608 Samples je Kanal = **261,200166667 s**; 60 fps = 15 673 Bilder.
- Transkript-SHA-256 `0646a267b0c894ff086ad765274b9d884f90c273fd0ab9ae6e4a7ed8b66591b1`.
- Analyse `ASTRA-AUDIO-ANALYSE.json` (unverändert), 127 BPM geschätzt, mittlere Sicherheit.
- Drehbuch: `ASTRA-DREHBUCH.md` ist die überarbeitete Fassung, das Original liegt unter `_revisions/`.
- Schnittliste: `UMSETZUNG-CUES.md`/`.json`, erzeugt mit `npm run cues`.

Drops: 31,35 · 46,45 · 61,55 · 110,65 · 121,95 · 133,25 · 152,25 · 175,05 · 228,35 s.
Blackout 120,55–121,4 s, digitale Stille 130,35–132,65 s (beide im Test gegen die Pegel geprüft).
Der Song endet abrupt auf „NXDOMAIN“; nur die letzten 0,2 s werden schwarz.

## Fachliche Leitplanken

`src/render/model.js` ist ein redaktionelles Szenario, kein Mitschnitt. Es hält sich an das Verhalten
eines rekursiven Resolvers:

- Root wird pro TLD genau einmal gefragt; danach kennt der Resolver die NS-Einträge, und spätere Namen
  derselben Domain gehen direkt an den autoritativen Server.
- NXDOMAIN wird negativ gecacht (SOA-Minimum); eine erneute Frage kommt aus dem Cache. `rndc flushname`
  löscht den Eintrag, die nächste Frage holt wieder NXDOMAIN, bis die interne View repariert ist.
- Split Horizon: Die externe View hatte `app` immer, nur die interne nicht. Clients innen sehen die interne.
- CNAME-Ketten innerhalb einer Zone kommen in einer Antwort; nur zonenübergreifende Ziele werden weiter
  verfolgt (`intranet` → `portal.example.net` → `lb.itsalwaysdns.com`).
- Timeout (Server nicht erreichbar) ist ein anderer Befund als NXDOMAIN (Name existiert nicht).
- Zeiten sind verdichtet, TTLs in der Nachttour für die Sichtbarkeit verkürzt. Alle fremden Adressen
  stammen aus den Dokumentationsbereichen.

## Architektur

`config.js` (Zeiten, Kapitel, Schnitte), `model.js` (Knoten, Transaktionen, Cache, Zonen-Views,
Tickets, Hinweise, dig-Ausgaben, Query-Log), `timeline.js` (Analyse, Cues, Blende), `zones/city.js`,
`zones/desk.js`, `overlay.js` (Titel, Terminal, Wörter, Timeout, Log), `film.js`, `player.js`.
Schnittstellen: `window.renderTime(t)`, `window.renderFrame(n)`, `window.FILM`, `window.__ready`,
`window.__error`, `window.player.seek(t)`.

## Prüfen

```sh
npm run check           # 15 Modell- und Timeline-Tests
npm run check:browser   # Standbilder aller Einstellungen, Schnittgrenzen, Determinismus, Player, 4K-Still
node src/tools/stills.mjs 131 260.6   # einzelne Bilder nach output/qa/stills
```

## Video exportieren (erst nach Freigabe)

```sh
kisound-render 4k --check    # nur prüfen, rendert nichts
kisound-render 1080p         # oder: npm run export:1080p
kisound-render 4k            # oder: npm run export:4k
```

Ausgabe unter `output/03_Its_Always_DNS_<auflösung>_<UTC-Zeitstempel>.mp4` mit Log und JSON-Prüfbericht.
Optionen und Wiederaufnahme: zentrales README unter `videos/kisound/README.md`.
