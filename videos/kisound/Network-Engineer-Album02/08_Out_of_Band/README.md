# Out of Band · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 08 von Network Engineer 02, dem Albumabschluss: CHG-2088 hat Gi0/0/1 auf R-EDGE
abgeschaltet, über den die In-band-Verwaltung lief. In einer hellen, realen Rechenzentrumshalle sitzt ein schematischer
Network Engineer im Warmgang hinter Rack C06 am Boden; sein Laptop (Managementstation 10.99.0.10) hängt am getrennten
OOB-Netz, der Console-Server 10.99.0.20 führt über das hellblaue Console-Kabel (Kanal 7) zum CON-Port. Diff prüfen,
gezielt `no shutdown`, erst Link, dann Route, dann Service-Test P-O1 (HTTP 200), speichern, Bestätigung P-O2.

Der Film beginnt mit einem Zoom aus der Stadt in ein grosses Bürogebäude, durch sechs schematische Etagen zur
Rechenzentrumsebene mit vier Hallen und hinein in Rechenzentrum 2; am Ende führt derselbe Zoom wieder hinaus.

Zwei Räume: die **Datenhalle** (Doppelboden, vier Rackreihen in Warm-/Kaltgängen, Kabeltrassen, gelbe Glasfasertrasse,
Klimaschränke, NOC-Display; Fahrten durch die Gänge zum Engineer hin und von ihm weg; aussen die schlafende Stadt) und
der **Laptop-Bildschirm**. 11 Kapitel, 64 Einstellungen.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/08_Out_of_Band"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare
npm run preview           # http://127.0.0.1:8162/
```

Einstiege: `?t=1` Zoom aus der Stadt · `?t=26` Überflug · `?t=9` Gi0/0/1 dunkel · `?t=20` hinter dem Rack · `?t=34` Engineer · `?t=40` Console-Port · `?t=91` Out of Band ·
`?t=118` Vorabbild · `?t=137` show run · `?t=141` Diff · `?t=147.9` no shutdown · `?t=150.5` Link · `?t=153.9` Route ·
`?t=159` P-O1 · `?t=183` speichern · `?t=212` P-O2 · `?t=236.5` Telefon · `?t=241` Zoom hinaus · `?t=253` Aufsicht.

## Quellen

- Finale WAV `08_Out_of_Band_1.0.wav`, SHA-256 `9139796abf25839d0b7a85ee57042ebe0e1f524d5f8c0f61073e9b2b42a2427c`;
  264,4135 s, 15 865 Bilder. Analyse: [ASTRA-AUDIO-ANALYSE.md](ASTRA-AUDIO-ANALYSE.md). Drehbuch `ASTRA-DREHBUCH.md`,
  Original unter `_revisions/`; die Schnittliste erzeugt `python3 src/tools/shotlist.py` (gleiche Startzeiten wie die Vorlage). Cue-Liste `UMSETZUNG-CUES.md` (`npm run cues`).

## Prüfen und Export

```sh
npm run check           # 10 Modell- und Timeline-Tests
npm run check:browser
kisound-render 4k --check
```

Gemeinsames Vorgehen: [PRODUKTION.md](../../PRODUKTION.md).
