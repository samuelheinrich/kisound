# 01 · VIBECODER — Der sichtbare Weg

Codebasierter Film zu Track 01 des Albums **Vibecoder**. Stand 15. Oktober 2026:
Die [Bildfassung V4](ASTRA-DREHBUCH-v4.md) gibt der Figur eine geformte,
gesichtslose Stoffkapuze mit matter, zurückgesetzter Dunkelheit. Ihre Hände
und Finger tippen auf der Tastatur. Beim ersten VIBECODER-Ruf um 51 Sekunden
(EN um 62 Sekunden) gehen beide Hände hoch; auf der Achterbahn folgen weitere
Bassgesten, auch in der Fahrersicht. Die [72 Einstellungen](SCHNITTLISTE-v2.md) führen an einem Tag vom Café über
einen belebten Park durch Wald und Berg zum nächtlichen Vergnügungspark.
Die lokale Browserprüfung ist für DE und EN bestanden. Beide Fassungen sind als
[Live-Code auf kisound.ch](https://kisound.ch/vibecoder/01-vibecoder/live/) veröffentlicht.
Ein MP4 wurde nicht exportiert; die Website berechnet die Bilder im Browser.

## Start

```sh
cd videos/kisound/Vibecoder/01_Vibecoder
npm ci --ignore-scripts     # einmalig
npm run prepare             # beide Original-WAVs prüfen und lokal bereitstellen
npm run preview             # Chrome, Port 8174: DE
```

EN: `http://127.0.0.1:8174/?lang=en`. Im Player wechselt **V** die Fassung;
**Leertaste** spielt oder pausiert, **←/→** sucht, **Shift + ←/→** geht ein
Frame zurück oder vor. `?t=159&lang=de` startet an einer Zeitmarke,
`?res=720` ändert die Vorschauauflösung, `?debug=1` zeigt Shot und Cues,
`?w=1920&h=1080&t=159&lang=de` rendert ein Einzelbild ohne Player.

```sh
npm run check               # Quellen, Schnitt, Zustände und Zeitsteuerung
npm run check:browser       # alle 72 Einstellungen je Fassung, Player, 4K-Standbild
npm run cues                # Varianten-Cues aus Code und Drehbuch erzeugen
src/tools/contact.sh de     # drei Kontaktbögen aus den DE-Standbildern
src/tools/contact.sh en     # drei Kontaktbögen aus den EN-Standbildern
npm run export:check        # DE: Exportvoraussetzungen, ohne Render
npm run export:check:en     # EN: Exportvoraussetzungen, ohne Render
```

Für eine 4K-Vorprüfung: `node ../../tools/kisound-render.mjs 4k --check`
beziehungsweise mit `--lang en`. `render-export.json` und
`render-export.en.json` halten Audio, Sprache, Laufzeitmodul und Ausgabe
getrennt. Die Befehle `export:1080p`, `export:1080p:en`, `export:4k` und
`export:4k:en` sind vorbereitet; gemäss
[Produktionshandbuch](../../PRODUKTION.md) wird der MP4-Export erst nach
ausdrücklicher Freigabe gestartet.

## Zwei Fassungen, ein Film

| Fassung | Original-WAV | Dauer | Frames bei 60 fps | Schnitt | Analyse |
| --- | --- | ---: | ---: | --- | --- |
| DE | `final/01_Vibecoder_suno-0.1_50_50_exakt_off_DE.wav` | 3:36,240 | 12 975 | [72 Cues](variants/de/UMSETZUNG-CUES.md) | [Messbericht](variants/de/ASTRA-AUDIO-ANALYSE.md) |
| EN | `final/01_Vibecoder_suno-0.1_50_50_exakt_off_EN.wav` | 4:04,760 | 14 686 | [72 Cues](variants/en/UMSETZUNG-CUES.md) | [Messbericht](variants/en/ASTRA-AUDIO-ANALYSE.md) |

`npm run prepare` liest die beiden finalen `*_1.0.txt` im
[Musikordner](../../../../music/kisound/Vibecoder/01_Vibecoder/), prüft die
`RELEASE AUDIO`-Auswahl und die SHA-256-Werte von WAV, Transkript, Analyse,
Prompt und Cover gegen das [Quellmanifest](SOURCE-MANIFEST.json). Die WAVs
werden unverändert nach `assets/audio/` kopiert; dieser Ordner bleibt aus Git.
DE und EN haben eigene Shotzeiten und werden nicht proportional gestreckt.

## Handlung und Bild

Im Café hängt ein Katalogexport bei 99 %. Datei und Status werden mit zwei
Tests geprüft. Im Park scheitert ein zweiter Exportfall und wird korrigiert.
Der durchgehende Wald und Berg tragen den eigenen Vier-Reihen-Beat. Auf dem Jahrmarkt entsteht
das kleine Track-Tool; erst der wiederholte Reload-Test macht seine Auswahl
beständig. Die Hardcoder-Nachricht erscheint als Einblendung über der
Einstiegsfahrt. Die Person zeigt Auftrag, Diff und Test und fährt mit dem Laptop in
der gesicherten Gondel. Nach dem Ausstieg bleibt ein neuer Wunsch offen.

Die **2D-Flächen** tragen Auftrag, Diff und Test. Die **3D-Orte** werden aus
Geometrie, Material und Licht im Browser erzeugt: ein rundum eingerichtetes Café, belebter Park,
durchgehender Wald mit Bergblick, Vergnügungspark, durchgehendes Gleis und
Ausgang. Die Kapuze hat eine geformte Stoffhülle mit dunkler Öffnung ohne
Gesicht. Ein geschlossener Stoffrand und matte Innenfalten führen zu einem
zurückgesetzten, vollständig abgedunkelten Abschluss; kein Licht spiegelt sich
darin. Ärmel, Unterarme, Handflächen und
Finger reichen bis auf die Laptop-Tastatur und tippen versetzt im Takt.
Auch in der Fahrersicht sind die Hände am Laptop zu sehen. Die Person sitzt im Café, im Park und zunächst im Wald,
geht dann zum Aussichtspunkt und steigt später in die Gondel. Im Park laufen
Jogger, Spaziergänger mit Hunden und Frisbee-Spieler. Im Café füllen Rückwand,
Seitenwände, Fenster, Theke, Espresso- und Gebäckstation, Tische, Gäste,
Wandbilder und Deckenleuchten auch die vorderen Kamerawinkel. Dort erscheinen
die Beweise auf dem Laptop und in den 2D-Schnitten; schwebende Karten und
HUD-Tafeln verdecken die Figur nicht. Über dem Park liegt eine langsam
ziehende Himmelskugel mit blauem Himmel und Wolken. Über Wald und Berg
ziehen dunkle Wolken; am Aussichtspunkt setzen Regen und kurze Blitze ein.
Auch dort bleiben die Beweise auf dem Laptop und in den 2D-Schnitten, damit
Wetter und Figur sichtbar sind.
Die drei Artefaktkarten übernehmen Texte und Zustände aus demselben Modell
wie die Vollbildansichten; Pattern-Steps sind auch räumliche Plättchen. Orange
bezeichnet den Arbeitsweg in der Oberfläche und auf den Gleisen; dekorative
orange Linien auf dem Boden wurden entfernt. Grün bedeutet einen bestandenen Test, Rot einen
Fehlversuch. Gemessene Audioenergie bewegt Licht und Material in engen Grenzen,
aber nie einen Testzustand. In jeder 2D-Passage zoomt die Kamera auf den
Laptopbildschirm und danach an die fortlaufende Position im 3D-Ort zurück.
Die Kamera umrundet die Figur auch von vorn; die räumlichen Titel lassen sie
sichtbar. Die Achterbahn beginnt bei S053 am Boden und fährt ab S054 los.
Fahrersicht mit Laptop am unteren Bildrand, leichtes Rütteln und Blicke zur
Seite wechseln mit Kamerafahrten um die Gondel bei S059, S061 und S064.
Gemessene Bassschläge lassen die Figur wiederholt beide Hände oder abwechselnd
einen Arm heben; die Gesten erscheinen auch neben dem Laptop in der Fahrersicht.
S059 zeigt die drei Beweiskarten räumlich; S062 ist der einzige Wechsel in
eine bildfüllende 2D-Szene während der Fahrt.
Einstieg und Ausstieg liegen am Boden; die Stützen tragen die gesamte Strecke.
Riesenrad, Karussell, Fallturm, Buden und Publikum stehen unter einer
texturierten Himmelskugel mit Sternen und Mond.

[Regie V4](ASTRA-DREHBUCH-v4.md) · [Regie V3](ASTRA-DREHBUCH-v3.md) · [Drehbuch V2](ASTRA-DREHBUCH-v2.md) · [Schnittliste V2](SCHNITTLISTE-v2.md) ·
[Regie-Cues](REGIE-CUES.json) · [Abnahme](ABNAHME.md) ·
[V1-Drehbuch](ASTRA-DREHBUCH.md).
`build_screenplay.py` erzeugt die Schnittliste, Regie-Cues, das Quellenmanifest
und `src/render/shot-data.js`; `npm run cues` erzeugt die sprachgetrennten
Umsetzungslisten aus dem laufenden Modell. Die Schnittstelle für Player und
Renderer ist `window.renderTime(t)`, `window.renderFrame(n)`, `window.FILM`,
`window.__ready` und `window.__error`.

Die EN-Zeile bei 03:23,740–03:27,700 bleibt nach dem
[Transkript-Prüfbericht](../../../../music/kisound/Vibecoder/01_Vibecoder/final/en/TRANSKRIPT-PRUEFUNG.md)
hörpflichtig. Sie erscheint im Film deshalb nur als Handlung, ohne ungeprüfte
wörtliche Einblendung. Weitere markierte ASR-Stellen sind vor finalen
Untertiteln und Wortanimationen anhand der jeweiligen WAV zu hören.
