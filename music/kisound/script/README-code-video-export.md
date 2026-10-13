# Globaler Render-Befehl für codebasierte Videos

Die globale Funktion `kisound-render` funktioniert in bestehenden und künftigen kisound-
Video-Projekten. Pro neuem Song ist kein npm-Script und bei eindeutiger Audiodatei keine
`render-export.json` nötig. Die vorhandene Three.js-/Chrome-Renderstruktur bleibt Voraussetzung.

## Einmal installieren

Von einem beliebigen Terminalordner aus:

```sh
python3 "/Users/samuel.heinrich/0004_git/music/kisound/script/setup_code_video_exports.py" --apply
source "/Users/samuel.heinrich/0004_git/videos/kisound/tools/kisound-render.zsh"
```

Die Einrichtung prüft zunächst alle vorhandenen Video-Projekte für beide Auflösungen. Sie
kopiert danach Einstieg, Exporter, Checkpoint-Verwaltung und Renderer nach `videos/kisound/tools/`, ergänzt
eine zsh-Funktion sowie deren Ladezeile in `.zshrc` (respektiert `ZDOTDIR`) und richtet die
optionalen npm-Kurzbefehle in den vorhandenen Projekten ein. Die README-Dateien im Videostamm
und in diesen Projekten erhalten die Anleitung. Andere npm-Befehle bleiben erhalten.
Vorherige Dateiinhalte werden einmal pro Änderungslauf in `_revisions/` archiviert, ohne `.bak`.
Ein erneuter identischer Lauf erzeugt keine zusätzlichen Änderungen.

Ohne `--apply` werden nur die Voraussetzungen geprüft. Das Einrichtungsskript startet nie einen
Videoexport. Mit `--video-root` und `--zshrc` können abweichende Pfade gewählt werden.

## Verwenden

Im gewünschten Songordner oder einem Unterordner:

```sh
kisound-render 1080p
```

oder:

```sh
kisound-render 4k
```

Nur prüfen:

```sh
kisound-render 4k --check
```

Von ausserhalb des Projekts:

```sh
kisound-render 4k --project "/Pfad/zum/Video-Song" --check
```

Neue Terminalfenster laden die Funktion automatisch. `source` oben ist nur für das bereits
offene Terminal nötig. Ohne Shell-Funktion lässt sich auch `node /Pfad/zu/tools/kisound-render.mjs`
mit denselben Argumenten verwenden.

Die vorhandenen Projekte erhalten zusätzlich `npm run export:1080p`, `npm run export:4k` und
`npm run export:check`. Künftige Projekte funktionieren direkt mit `kisound-render`; für die
optionalen npm-Einträge kann die Einrichtung nochmals ausgeführt werden.

## Projekt- und Audioerkennung

Der Befehl sucht vom aktuellen Ordner aufwärts nach `src/render/index.html` und
`src/render/render.mjs`. Eine vorhandene `render-export.json` hat Vorrang. Ohne Konfiguration
muss `assets/audio` genau eine Audiodatei enthalten. Bei mehreren Versionen:

```sh
kisound-render 4k --audio "assets/audio/final.wav"
```

Relative Audiopfade, `--out` und die Konfigurationspfade beziehen sich auf den erkannten
Songordner, auch bei einem Aufruf aus einem Unterordner. Ohne Titelkonfiguration wird der
Titel aus dem Ordnernamen abgeleitet; der Standardinterpret ist Samuel Heinrich.
Mit `--title` und `--artist` oder `render-export.json` lassen sich Metadaten anpassen.

Der Befehl benötigt lokale Node-Abhängigkeiten inklusive Puppeteer, Chrome, FFmpeg/ffprobe
und die bestehende kisound-Renderer-Schnittstelle. Ein Ordner mit nur Audioanalyse, Lyrics
oder Drehbuch ist noch kein renderbares Projekt. Fehlende oder mehrdeutige Quellen führen
zu einer Fehlermeldung statt einer geratenen Auswahl.

## Ergebnis

1080p entspricht 1920 × 1080, 4K entspricht 3840 × 2160. FPS und Bildzahl werden aus dem Film
übernommen. Die Datei landet mit UTC-Zeitstempel im `output/`-Ordner, zusammen mit Log und
JSON-Prüfbericht. Vorhandene Ergebnisse werden nicht überschrieben.

Optionen wie `--encoder x264 --jobs 1`, `--crf`, `--quality`, `--temp-dir`, `--keep-temp`,
`--out` und `--chrome` werden an den gemeinsamen Exporter übergeben. `--check` startet
keinen Browser und keine Codierung; es prüft keine tatsächliche GPU-Wiedergabe.

## Prüfung der Einrichtung

Die Vorbereitung wurde an allen vier bestehenden Projekten für 1080p und 4K geprüft.
Eine isolierte Installation im temporären Ordner prüft ausserdem die npm-Aufrufe, das Laden
über zsh, das Erkennen aus Unterordnern, ein erst nach der Installation hinzugefügtes Projekt
und die Wiederholbarkeit. Dabei wird kein Video gerendert.

## Chrome-Abbruch: Korrektur installieren

Das Einrichtungsprogramm auch bei bestehender Installation nochmals mit `--apply`
ausführen (Befehl oben). Es aktualisiert die globalen Tools samt Dokumentation und
sichert den bisherigen Stand in einem Archiv. Der laufende Shell-Befehl verwendet
danach sofort den neuen Code. Es wird dabei kein Video gerendert.


<!-- kisound-render-checkpoints -->
### Wiederaufnahme nach einem Chrome-Abbruch

Der globale Export rendert standardmässig in Abschnitten von 20 Sekunden mit einem
Chrome-Prozess. Jeder Abschnitt wird geprüft und als Checkpoint gespeichert. Chrome
startet für jeden Abschnitt neu. Ein fehlgeschlagener Abschnitt wird bis zu zweimal
wiederholt. Bildnummern beziehen sich stets auf die gesamte Timeline.

Nach einem Abbruch den ausgegebenen Arbeitsordner verwenden, von jedem Ordner aus:

```sh
kisound-render --resume "/Pfad/zum/kisound-export-ABC123"
```

Optional zuerst `--check` ergänzen. Bei `--resume` weder `4k`/`1080p` noch neue
Renderparameter angeben: Einstellungen, Song und Ausgabe stammen aus dem Checkpoint.
Geprüfte Abschnitte werden übernommen; beschädigte Abschnitte werden erneut gerendert.
`--check` prüft Quellen/Einstellungen, aber decodiert keine Abschnitte.
Änderungen an Quellcode, Assets oder Renderer verhindern die Wiederaufnahme; dann einen
neuen Export starten. Während eines Exports die Projektdateien nicht bearbeiten.

Neue Exporte erlauben `--chunk-seconds 5..60` (Standard 20) und `--retries 0..5`
(Standard 2). `--jobs 1` ist nun für beide Auflösungen Standard. Beispiel:

```sh
kisound-render 4k --chunk-seconds 10
```

Fertige Abschnitte werden ohne erneute Bildcodierung zusammengefügt. Das Originalaudio
wird einmal vollständig eingebettet. Bildzahl, FPS, Auflösung, Audiodauer und vollständige
Videodecodierung werden vor der Ausgabe geprüft. Fehlerlogs enthalten Browser-Abbruch-
ereignisse, soweit Chrome diese noch meldet. Nach Erfolg wird der Arbeitsordner gelöscht,
mit `--keep-temp` bleibt er erhalten. Bei Fehlern bleibt er immer erhalten. Er kann gross
werden; `--temp-dir` wählt bei neuen Exporten einen anderen lokalen Datenträger.

Die Wiederaufnahme benötigt `checkpoint.json` aus dieser Version. Alte abgebrochene
Exporte ohne Checkpoint, beispielsweise `kisound-export-Rf2zLF`, müssen neu gestartet
werden. Ihre Dateien bleiben unberührt. Die Änderung verhindert nicht jede mögliche
GPU-/Chrome-Störung, begrenzt aber den verlorenen Fortschritt auf einen Abschnitt.

Neue Szenen müssen `renderFrame(n)` auch direkt mit beliebigen absoluten Bildnummern
aufrufen können. Animationen müssen aus der Zeit berechnet werden, ohne vom zuletzt
gerenderten Frame abzuhängen. Quellprüfsummen umfassen `src/`, `assets/`, Audio,
JSON-/Code-Dateien im Projektstamm (inklusive Audioanalyse), Konfiguration,
Paket-/Lockdateien sowie die gemeinsamen Renderer. Externe dynamische
Ressourcen oder manuelle Änderungen in `node_modules` sind damit nicht abgesichert.
<!-- /kisound-render-checkpoints -->

## Prüfstand der Korrektur

16 automatisierte Tests prüfen unter anderem absichtliche Abbrüche, begrenzte
Wiederholungen, Wiederaufnahme, beschädigte Abschnitte, geänderte Quell-/Analysedaten,
Sperren gegen parallele Wiederaufnahme und Aufräumen nach einem TargetCloseError.
Ein winziger synthetischer Farbfilm wird mit FFmpeg zusammengefügt und vollständig
decodiert; alle 21 Bilder, Farbwechsel an Abschnittsgrenzen und die Audiodauer werden
geprüft. Browser und HTTP-Server sind im Aufräumtest simuliert. Kein Musikvideo und
kein echter Chrome-/GPU-Dauerlauf wurden für diese Korrektur gerendert.

Aus dem Musik-Repository lassen sich die Tests wiederholen:

```sh
node --test script/tests/export-video.test.mjs script/tests/render-checkpoints.test.mjs script/tests/render-cleanup.test.mjs
python3 script/tests/global-setup.test.py
```

Der zweite Test installiert nur in einem temporären Testordner. Er prüft bestehende
und neue Projekte, npm/zsh-Aufrufe und eine wiederholte Installation ohne zusätzliche
Änderungen. Zusätzlich bestanden die acht Vorprüfungen der vier vorhandenen Projekte
für 1080p und 4K. Die Stabilität eines vollständigen 4K-Laufs bleibt im echten Export
zu prüfen. Der ursprüngliche Fehler belegt den Verbindungsverlust zu Chrome; eine
konkrete Ursache wie Speichermangel ist daraus nicht nachgewiesen.
