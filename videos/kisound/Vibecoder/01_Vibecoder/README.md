# 01 · VIBECODER — Der sichtbare Weg

Codebasierter Film zu Track 01 des Albums **Vibecoder**. Stand 14. Oktober 2026:
DE und EN sind als eigenständige Browservorschauen umgesetzt und technisch geprüft.
Ein MP4 wurde nicht exportiert; der Film ist noch nicht in kisound.ch eingetragen.

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

Um 08:00 hängt ein Katalogexport bei 99 %. Die Person formuliert einen
prüfbaren Auftrag: Datei und Status müssen stimmen. Ein zweiter Exportfall
scheitert und wird korrigiert. Mittags führen drei unpassende Kandidaten zu
einem eigenen Pattern mit vier Reihen. Abends baut die Person ein kleines Tool,
das den Track wählt und ein Paket exportiert. Ein Reload verliert zuerst die
Auswahl, ein falscher Speicherschlüssel besteht den Test nicht; erst der zweite
Fix bleibt grün. In der Bridge greift der Hardcoder die opake Agentmitte an.
Die Antwort zeigt Auftrag, Diff und Test, ohne die Blackbox zu erfinden. Drei
Artefakte verbinden sich zur orangefarbenen Schiene. Um 22:00 kehren die
räumlichen Karten an den Tisch zurück; ein neuer Wunsch bleibt offen.

Die **2D-Flächen** tragen Auftrag, Diff und Test. Im **3D-Raum** bleiben
Arbeitsplatz, Uhr, Licht und die drei Artefakte über alle Kapitel dieselben
Objekte. Die Projektkarten übernehmen ihre Texte und Zustände aus demselben
Modell wie die Vollbildansichten; die Pattern-Steps haben zusätzlich echte
räumliche Plättchen. Orange bezeichnet den sichtbaren Arbeitsweg, Grün einen
bestandenen Test, Rot einen Fehlversuch. Audioenergie bewegt Licht, Schiene und
Plättchen nur innerhalb enger Grenzen; sie ändert nie einen Testzustand.

[Drehbuch](ASTRA-DREHBUCH.md) · [Schnittliste](SCHNITTLISTE.md) ·
[Regie-Cues](REGIE-CUES.json) · [Abnahme](ABNAHME.md).
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
