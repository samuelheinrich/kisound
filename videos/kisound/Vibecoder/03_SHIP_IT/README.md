# SHIP IT · Der letzte Unterstrich

Live-Code-Stück (kein Video) zu Track 03 des Albums **Vibecoder**, in zwei Fassungen: **DE** und **EN**. Beide erzählen
denselben Release von Album drei: Build, roter Check wegen eines Unterstrichs zu viel, derselbe Check grün, Commit,
Deploy, alter Cache, harter Reload, DE/EN geprüft, Link und Play, nächster Commit. Geometrie und Geschichte sind gemeinsam;
Original-WAVs, Analysen, Schnittzeiten (34 Einstellungen) und Hook-Anker sind je Fassung eigen. Stand: 12. Oktober 2026.

```sh
npm ci --ignore-scripts      # einmalig
npm run prepare              # prüft beide finalen WAVs, Transkripte, Analysen; kopiert die WAVs nach assets/audio
npm run preview              # Chrome, Port 8172 · deutsche Fassung
                             # englische Fassung: http://127.0.0.1:8172/?lang=en  (im Player: Knopf «DE → EN» oder Taste V)
npm run check                # 30 Tests (15 je Fassung)
npm run check:browser        # Standbilder aller 34 Shots je Fassung, Determinismus, Player, 4K-Standbild
npm run cues                 # variants/<lang>/UMSETZUNG-CUES.md/.json aus dem Code
PY=<python mit Pillow> src/tools/contact.sh de|en   # Kontaktbögen nach output/qa/contact-<lang>/
```

Weitere Abfragen: `?t=` Startzeit, `?res=540|720|1080`, `?debug=1` (Shot, Zustand, Stationen, Hook),
`?w=&h=&t=&lang=` Einzelbild ohne Player.

## Fassungen

| Fassung | Original-WAV (Musik-Repo) | Dauer | Bilder 60 fps | Analyse | Zeitliste |
| --- | --- | ---: | ---: | --- | --- |
| DE | `final/de/03_SHIP_IT_1.0.txt` → `final/03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav` | 155,960 s | 9 358 | `variants/de/` | [SHOTLIST](variants/de/SHOTLIST.md) · [Cues](variants/de/UMSETZUNG-CUES.md) |
| EN | `final/en/03_SHIP_IT_1.0.txt` → `final/03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav` | 120,680 s | 7 241 | `variants/en/` | [SHOTLIST](variants/en/SHOTLIST.md) · [Cues](variants/en/UMSETZUNG-CUES.md) |

Die Fassung wird einmal beim Laden gewählt (`src/render/config.js`): `window.KISOUND_PAGE.lang` (Website), `?lang=`
(lokale Vorschau), `SHIP_IT_LANG` (Tests, Werkzeuge). Alle Zeiten kommen aus der passenden Variante; nichts wird
proportional umgerechnet. Die Hook- und DE-Bridge-Stellen sind ASR-Anker mit offener Hörprüfung
(`variants/<lang>/TRANSKRIPT-PRUEFUNG.md`); Untertitel gibt es deshalb nicht, die Titelmarke ist ein Titel.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `src/render/config.js` | Fassungen (Samples, SHA-256, Lücken, Drops, Blende), 34 Schnitte mit DE/EN-Start, Titelmomente, Kapitel |
| `src/render/model.js` | Release als Funktion der Zeit: Ereignisse, Zustände, Stationen, Paket, Enter-Taste, Terminal, Upload, Browser, Bridge-Karten; Bildschirmtexte DE/EN |
| `src/render/screen.js` | 2D-Ebene: Dateiliste, Terminal, Namensvergleich, Albumkarte, Vorschau, Upload, Browser (alt/neu/DE/EN), Lyrics, Link, Player, Release-Seite; dieselben Flächen für Laptop und 3D-Panels |
| `src/render/room.js` | 3D: Zimmer (aus TOKEN BURN, Nacht), Laptop, Enter-Taste, Release-Schiene mit fünf Pressen, Paket, Commit-Graph, Gate-Wörter, LIVE-Projektion, Bridge-Karten, Notiz, Person |
| `src/render/type.js` | COMMIT IT. / SHIP IT.: 2D-Titel und Ebenenstapel mit Tiefe |
| `src/render/film.js` | Kamera je Einstellung, Titelposen, Panels, 2D/3D-Wechsel, Credit, Blende |
| `src/tools/` | `prepare`, `stills`, `check-browser`, `write-cues`, `contact.sh`, `sheet.py` |
| `tests/` | `suite.mjs`, ausgeführt von `de.test.mjs` und `en.test.mjs` |

Drehbuch mit Umsetzungsnotizen: [ASTRA-DREHBUCH.md](ASTRA-DREHBUCH.md) (Abschnitt 7), [SCHNITTLISTE.md](SCHNITTLISTE.md),
[REGIE-CUES.json](REGIE-CUES.json), [SOURCE-MANIFEST.json](SOURCE-MANIFEST.json); Originale des Pakets unter `_revisions/`.
`generate_handoff.py`/`validate_handoff.py` bauen bzw. prüfen die Schnittdaten aus den Musikquellen.
Abnahme: [ABNAHME.md](ABNAHME.md). Export als MP4 nur nach ausdrücklicher Freigabe (`render-export.json` zeigt auf die DE-Fassung).
