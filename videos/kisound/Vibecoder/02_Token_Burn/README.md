# TOKEN BURN · Nur noch diese eine Änderung

Live-Code-Stück (kein Video) zu Track 02 des Albums **Vibecoder**, in zwei Fassungen: **DE** und **EN**.
Beide Fassungen erzählen dieselbe Nacht mit derselben Geometrie, haben aber eigene Original-WAVs,
Analysen, Schnittzeiten (58 Einstellungen) und TOKEN-BURN-Anker. Stand: 9. Oktober 2026.

```sh
npm ci --ignore-scripts      # einmalig
npm run prepare              # prüft beide finalen WAVs, Transkripte, Analysen; kopiert die WAVs nach assets/audio
npm run preview              # Chrome, Port 8170 · deutsche Fassung
                             # englische Fassung: http://127.0.0.1:8170/?lang=en  (im Player: Knopf «DE → EN» oder Taste V)
npm run check                # 28 Tests (14 je Fassung)
npm run check:browser        # Standbilder aller 58 Shots je Fassung, Determinismus, Player, 4K-Standbild
npm run cues                 # variants/<lang>/UMSETZUNG-CUES.md/.json aus dem Code
src/tools/contact.sh de|en   # Kontaktbögen (Mitte jeder Einstellung) nach output/qa/contact-<lang>/
```

Weitere Abfragen: `?t=` Startzeit, `?res=540|720|1080`, `?debug=1` (Shot, Cues, Uhr, Version, Tokens),
`?w=&h=&t=&lang=` Einzelbild ohne Player.

## Fassungen

| Fassung | Original-WAV (Musik-Repo) | Dauer | Bilder 60 fps | Analyse |
| --- | --- | ---: | ---: | --- |
| DE | `final/de/02_Token_Burn_1.0.txt` → `suno-0.1/de/Token Burn - DE.wav` | 245,9335 s | 14 757 | `variants/de/` |
| EN | `final/en/02_Token_Burn_1.0.txt` → `suno-0.1/en/Token Burn - EN.wav` | 250,8000 s | 15 048 | `variants/en/` |

Die Fassung wird einmal beim Laden gewählt (`src/render/config.js`): `window.KISOUND_PAGE.lang` (Website),
`?lang=` (lokale Vorschau), `TOKEN_BURN_LANG` (Tests, Werkzeuge). Alle Zeiten kommen aus der passenden Variante;
nichts wird proportional umgerechnet. Auf kisound.ch wählt man die Fassung auf der Trackseite oder im Player.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `src/render/config.js` | Fassungen (Samples, SHA-256, Lücken, Blende, Keyword-Anker), 58 Schnitte mit DE/EN-Start, Kapitel |
| `src/render/model.js` | Szenario als Funktion der Zeit: Aufträge P01–P06, Pattern und Bassfehler, Export, Tabs, Nutzungsjournal (fiktiv), Uhr, Bildschirmtexte DE/EN |
| `src/render/screen.js` | 2D-Ebene: App-Ansicht (auch Laptop-Display und Projektflächen), die Vollbild-Ansichten der Screen-/Ledger-Shots |
| `src/render/room.js` | 3D: Zimmer mit Fenster, Schreibtisch, Laptop, Uhr, Becher, Karten, schematische Person (IK-Arme), Fassade, Haus gegenüber, Licht Nacht → Morgen |
| `src/render/type.js` | TOKEN BURN: 2D (H01, H05) und als Ebenenstapel mit Tiefe (H02, H03, H04, H06) |
| `src/render/film.js` | Kamera je Einstellung, Projektflächen, Titel, 2D/3D-Wechsel, Overlay, Blende und Cursorpunkt |
| `src/tools/` | `prepare`, `stills`, `check-browser`, `write-cues`, `contact.sh`, `sheet.py` |
| `tests/` | `suite.mjs`, ausgeführt von `de.test.mjs` und `en.test.mjs` |

Drehbuch, Schnittliste und Regiedaten: [ASTRA-DREHBUCH.md](ASTRA-DREHBUCH.md) (mit Umsetzungsnotizen am Ende),
[SCHNITTLISTE.md](SCHNITTLISTE.md), [REGIE-CUES.json](REGIE-CUES.json); Originale des Pakets unter `_revisions/`.
Abnahme: [ABNAHME.md](ABNAHME.md). Export als MP4 nur nach ausdrücklicher Freigabe
(`render-export.json` zeigt auf die DE-Fassung).
