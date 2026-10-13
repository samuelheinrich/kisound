# Multicast · Browservorschau (V2 · Stadion)

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 06: ein komplettes Stadion als Netz. Eine einzige Quelle sendet von der
Bühne im Mittelkreis, und der Strom wächst nur dorthin, wo Empfänger einer Gruppe beigetreten sind:
in den Innenraum, in den Unterrang und hinauf in den Oberrang. Zu sehen sind IGMP-Reports und Snooping,
Querier, PIM-SM mit RP im Core-Ring, Register/Register-Stop, ein SPT-Switchover für drei Stadionseiten,
Leave mit Group-Specific Query und drei Segmente, die bis zum Schluss still bleiben.
17 Kapitel, 100 Einstellungen, davon 22 POV-Fahrten zu 22 verschiedenen Sitzen, drei Szenenmodule,
unverändertes Originalaudio.

## Revisionen

- **V2 (aktuell):** Stadion mit 288 Clients, 28 Segmenten, 17 Routern; Verfolgung, Ride und Flyby.
- **V1:** Amphitheater mit 64 Plätzen, gesichert als `_revisions/code-v1-arena.tar.gz`.

Zurück zu V1 (überschreibt den Code von V2; vorher V2 ebenso sichern):

```sh
tar -czf _revisions/code-v2-stadium.tar.gz src tests README.md ABNAHME.md ASTRA-DREHBUCH.md UMSETZUNG-CUES.md UMSETZUNG-CUES.json package.json render-export.json
rm -rf src tests && tar -xzf _revisions/code-v1-arena.tar.gz
```

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album01/06_Multicast"
npm ci            # nur falls node_modules fehlt
npm run prepare   # prüft WAV/Transkript per SHA-256 und kopiert das Audio nach assets/audio
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8136/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Anderer Port: `npm run preview -- 8137`. `npm run serve` öffnet nichts.

Einstiege:

- `?t=11.38` Register ohne Empfänger · `?t=17.24` Pakete enden an R1
- `?t=24.04` erster Empfänger · `?t=31.3` Ride mit dem ersten Strom auf dem Drop
- `?t=38.28` Unicast · `?t=45.52` Anycast · `?t=51.36` Multicast
- `?t=67.58` IGMP-Report / Snooping · `?t=75.1` General Query
- `?t=81.48` Chorus · `?t=109.76` PIM / RP · `?t=117.18` Join zum RP, neuer Ast
- `?t=128.58` Hook · `?t=135.7` SPT-Switchover · `?t=149` Flooding gegen Snooping
- `?t=160.18` „many doors“ · `?t=197.18` Querier / RP · `?t=249.2` Finale
- `?res=720` kleinere Vorschau · `?debug=1` Kapitel-, Shot-, Event- und Lyric-IDs
- `?w=1920&h=1080&t=80` Einzelbild ohne Player (QA)

Tasten: Leertaste Play/Pause, Pfeile ±1 s, Shift+Pfeil ein Bild, Home/End, 1–9 Kapitel,
L/M/F/D Schleife/Stumm/Vollbild/Cues. Kapitelwahl, Geschwindigkeit, Scrubbing und Auflösungswechsel
(Position bleibt erhalten) im Player.

## Bildwelt

Ovales Stadion (Halbachsen 62 × 46) mit Spielfeldlinien, Mittelkreis-Bühne, zwei Rängen, Umlauf,
Dachring und vier Flutlichtmasten. Polarboden und konzentrische Bühnenringe wie auf dem Cover.
Datenstrom orange/warmweiss, Mitglieder smaragdgrün, IGMP-Queries violett, PIM-Steuerung cyan,
Leave/Prune und Flooding rot. Der **Dachring ist der Gruppenring**: Er leuchtet stärker, je mehr zuhören.

Netz: Quelle → R1 (FHR) → vier Core-Router im Ring (R2 = RP, R3, R4, R5) → zwölf Last-Hop-Router auf dem
Feld (R6–R17) → je ein Switch am Fuss des Unterrangs und auf der Front des Oberrangs; dazu ein
Innenraum-Segment pro Core. 28 VLANs (101–128), 288 Clients: 120 Unterrang, 120 Oberrang, 48 Innenraum.
Bis Verse 2 hört nur die vordere Stadionhälfte (R2/R5); um 117 s steigt ein Join über den Core-Ring zum RP,
und der Baum wächst in die hintere Hälfte. Beim Drop 135,7 s wechseln R3/R4/R5 auf direkte Speichen zu R1,
der Ring wird gekappt. SW18, SW23 und SW28 haben nie Mitglieder.

POV-Fahrten folgen dem echten Weg eines Pakets bis zu einem Sitz: `chase` (hinter dem Paket), `ride`
(auf dem Strom, zwischen zwei Paketen) und `flyby` (seitlich). Ziele werden pro Einstellung aus den
gerade empfangenden Sitzen der verlangten Zone gewählt (`pick:<tier>:<core>`), deterministisch und
ohne Wiederholung; die aufgelösten Sitze stehen in `UMSETZUNG-CUES.md`.

Drei Szenen: `arena` (das Stadion), `compare` (Unicast/Anycast/Multicast nebeneinander) und `segment`
(Nahaufnahme SW3/VLAN 103 unter R7, Unterrang). Das Segment liest denselben Modellzustand wie das Stadion.

Titel **MULTICAST** / **SAMUEL HEINRICH** in Michroma mit orangen Linien: 0,7–9,9 s und ab 250,2 s.
Blende ab dem gemessenen Endabfall 258,4 s. Fachpanels links (feste Breite), maximal drei Syslog-Zeilen.
Schriften samt OFL-Lizenzen unter `assets/fonts`. Prozedurale Three.js-Geometrie, keine externen Modelle.

## Quellen und Timing

- Finale WAV laut `06_Multicast_1.0.txt`: `06_Multicast_0.1-1.wav`,
  SHA-256 `7d0f87a9f23017511848df85b035a20b14761e8da550f196064183032780794e`.
- 48 kHz, Stereo, 16 Bit, 12 508 808 Samples je Kanal = **260,600166667 s**; 60 fps = 15 637 Bilder.
- Transkript-SHA-256 `def8f0c83bcb6d421e6fd9717b77e3520c11b8c41c8611fb6cc5a949e8223cc4`.
- Analyse `ASTRA-AUDIO-ANALYSE.json` (unverändert), 132,6 BPM geschätzt, mittlere Sicherheit.
- Drehbuch: `ASTRA-DREHBUCH.md` ist die überarbeitete Fassung, das Original liegt unter `_revisions/`.
- Schnittliste: `UMSETZUNG-CUES.md`/`.json`, erzeugt mit `npm run cues`.

Lyric-Zeiten stammen unverändert aus dem automatischen Transkript; es gab keine neue Hörprüfung.
Drops sind aus den 100-ms-Zeilen gelesen (Sub-Band springt von ~0 auf >0,5): 31,35 · 81,85 · 96,25 ·
110,65 · 135,75 · 164,35 · 182,25 · 210,75 · 230,45 s.

## Fachliche Leitplanken

`src/render/model.js` ist ein redaktionelles Szenario, kein Mitschnitt und kein vollständiger
PIM-Simulator. Neun Schlüssel-Sitze tragen die Geschichte (`KEY`); alle übrigen Joins und Leaves
entstehen aus zehn Wellen auf dem geschätzten Beat-Raster, mit festem Seed. Der Fahrplan erzeugt IGMP-Reports, PIM-Joins/-Prunes hop-by-hop und daraus
die Weiterleitungsintervalle jeder Kante. Datenpakete existieren auf einer Kante nur, wenn jede Kante
ihres Wegs beim Passieren weiterleitete. Neue Äste wachsen dadurch von der Wurzel her, gekappte Äste laufen leer.

- IGMP (v2) zwischen Host und Router, Snooping auf den Switches, PIM-SM zwischen Routern, statischer RP R2.
- Vor dem ersten Empfänger: Register an den RP, Register-Stop, keine Daten über R1 hinaus.
- SPT-Switchover für R3, R4, R5 bei 135,7 s (inszeniert; viele Implementierungen wechseln sofort nach
  dem ersten Paket). Der R2-Ast erreicht die Quelle ohnehin über den RP, sein Pfad ändert sich nicht.
- Der Link R4–R5 existiert physisch, liegt aber auf keinem Baum (Unicast zum RP läuft R4 → R3 → R2).
- Leave → Group-Specific Query → Port wird nach der (verdichteten) Last-Member-Query-Zeit entfernt.
- Flooding ohne Snooping erscheint nur in der Bridge, ausdrücklich als Vergleich beschriftet.
- Alle Hop-/Timerzeiten sind verdichtet bzw. gedehnt. Adressen sind Szenariowerte. Zähler im Bild
  zählen Szenario-Sitze, keine Audiomesswerte.

## Architektur

`config.js` (Zeiten, Kapitel, Schnitte), `model.js` (Stadion-Topologie, Fahrplan, Intervalle, Nachrichten, Tabellen, Kameraziele),
`timeline.js` (Analyse, Cues, Blende), `zones/arena.js`, `zones/compare.js`, `zones/segment.js`,
`overlay.js` (Titel, Panels, Hook, Syslog), `film.js`, `player.js`. Schnittstellen: `window.renderTime(t)`,
`window.renderFrame(n)`, `window.FILM`, `window.__ready`, `window.__error`, `window.player.seek(t)`.

## Prüfen

```sh
npm run check           # 17 Modell- und Timeline-Tests
npm run check:browser   # Standbilder aller Einstellungen, Schnittgrenzen, Determinismus, Player, 4K-Still
node src/tools/stills.mjs 31.4 136.6   # einzelne Bilder nach output/qa/stills
```

## Video exportieren (erst nach Freigabe)

```sh
kisound-render 4k --check    # nur prüfen, rendert nichts
kisound-render 1080p         # oder: npm run export:1080p
kisound-render 4k            # oder: npm run export:4k
```

Ausgabe unter `output/06_Multicast_<auflösung>_<UTC-Zeitstempel>.mp4` mit Log und JSON-Prüfbericht.
Optionen und Wiederaufnahme: zentrales README unter `videos/kisound/README.md`.
