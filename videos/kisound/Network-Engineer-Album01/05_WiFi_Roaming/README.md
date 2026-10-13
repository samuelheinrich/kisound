# WiFi Roaming — Browserfassung V3

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**
Die vorhandene MP4 unter `output/` gehört weiterhin zur V1 und bleibt unverändert.

## Start

```sh
npm run preview
npm run check
npm run check:browser
```

[Player](http://127.0.0.1:8127/?v=3), alternativ `?res=720&v=3`.
Gezielte Einstiege: `?t=43.72&v=3` für die erste Kurve, `?t=60.68&v=3` für den verspäteten
Roam, `?t=77.54&v=3` für DFS, `?t=91.56&v=3` für das Grossraumbüro.

## Video selbst exportieren

Im Terminal in diesen Songordner wechseln:

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album01/05_WiFi_Roaming"
```

**1080p / 60 fps starten:**

```sh
npm run export:1080p
```

**Oder 4K UHD / 60 fps starten:**

```sh
npm run export:4k
```

Diese Befehle starten den vollständigen Export der aktuellen Codefassung. Der Browserplayer
muss dafür nicht laufen. Nur die Voraussetzungen prüfen, ohne einen Export zu starten:

```sh
npm run export:check -- --resolution 4k
```

Ausgabe: `output/05_WiFi_Roaming_1080p60_<UTC-Zeitstempel>.mp4` beziehungsweise
`output/05_WiFi_Roaming_4k60_<UTC-Zeitstempel>.mp4`, jeweils mit `.log` und `.json` als
zusätzlicher Dateiendung für Protokoll und technischen Prüfbericht. Vorhandene Dateien bleiben
erhalten. Auflösung, Bildzahl und Audiodauer werden automatisch geprüft; keine vollständige
Decodier- oder Sichtprüfung. Die bisherige `check:export`-Prüfung bezieht sich weiterhin auf die
alte MP4 mit festem Dateinamen und ist nicht für die neuen Zeitstempel-Dateien vorgesehen.

Standard auf diesem Mac: VideoToolbox H.264, AAC 320 kbit/s, 1080p mit zwei Renderprozessen,
4K mit einem. 4K rendert direkt 3840 × 2160 Pixel. Die Original-WAV bleibt unverändert.
Optionaler eigener Dateiname:

```sh
npm run export:4k -- --out "output/WiFi_Roaming_V3_4K.mp4"
```

CPU-Encoding statt VideoToolbox:

```sh
npm run export:4k -- --encoder x264 --jobs 1 --crf 14 --preset slow
```

`Ctrl+C` bricht ab. Temporäre Dateien liegen lokal im System-Temp und werden nach Erfolg gelöscht;
bei Fehlern bleibt der ausgegebene Arbeitsordner zur Diagnose erhalten. Ein neuer Lauf startet
von Anfang an. Mehrere Renderprozesse (`--jobs 2`) erzeugen grössere ProRes-Zwischenfilme.
Mit `--temp-dir "/Volumes/RenderSSD/kisound-temp"` lässt sich ein bereits vorhandener lokaler
Arbeitsordner wählen.

Die wiederverwendbare Implementierung liegt in [tools/export-video.mjs](../../tools/export-video.mjs).
Dieser Song liefert nur die Einstellungen in [render-export.json](render-export.json) und einen
dünnen Einstieg in `src/render/export.mjs`. Die [Anleitung im zentralen README](../../README.md)
beschreibt alle Optionen und die Einrichtung für weitere Songs. Das Skript installiert nichts;
Node, FFmpeg, Chrome und Projektabhängigkeiten sind auf diesem Rechner bereits vorhanden.

## Neue Inszenierung

Die Fachdiagramme liegen kompakt links. Die Kameraprojektion verschiebt das 3D-Geschehen nach
rechts, sodass Graph und Demonstration gleichzeitig sichtbar sind. Das betrifft Medium Access,
RTS/CTS, Action Frames, Handshake, Kanal-Scan, Überlappung, Radio Inspector und DFS.
Im Gang bleiben nur ein kleines RSSI-Panel oben links und der Lageplan unten rechts.

Ein gemeinsamer Grundriss definiert sechs Gangstücke, fünf 90-Grad-Kurven, drei möblierte
Grossraumbüros und vier AP-Zellen. Die Route ist 156 Meter lang; das Endgerät legt davon 148 Meter
zurück. Gerät, Kamera, Funkpfade und Lageplan verwenden dieselben Koordinaten. Die Büros besitzen
Arbeitsplätze mit Bildschirmen, Stühlen, Glasflächen und offenen Durchgängen. Keine menschliche Figur.

Drei Roaming-Wechsel sind direkt in der Welt sichtbar:

| Zeit | Wechsel | Szenario | Verhalten |
| --- | --- | --- | --- |
| 63,54 s | AP-01 → AP-02 | verspätet bei -72 dBm | vorher rote Retransmits, rotes Gerät und Funkpfad; danach Erholung auf -51 dBm |
| 118,70 s | AP-02 → AP-03 | Ziel -67 dBm | nach abgeschlossenem Handshake; Erholung auf -50 dBm |
| 153,66 s | AP-03 → AP-04 | Ziel -67 dBm | sauberer Wechsel; Erholung auf -49 dBm |

Die Zielmarke bleibt bei **-67 dBm**. Mit wachsendem Abstand sinkt der angezeigte RSSI (wird
negativer), bis die Kurve die Markierung unterschreitet. Im verspäteten Szenario hält der Client
weiter am alten AP fest, erreicht **-72 dBm** und sendet rote Wiederholungen mit `RETRY=1`.
Der Wechsel schaltet BSSID, Funkpfad und Kartenverbindung gleichzeitig um. Der alte Pfad klingt
kurz aus, ein grüner Ring bestätigt den neuen Link, die Retransmits verschwinden.

RSSI und SNR sind synthetische Szenariowerte. -67 dBm ist hier das gewünschte Ziel für die
Inszenierung, keine universelle Client-Auslöseschwelle. Auch Retransmits werden nicht allein durch
einen bestimmten RSSI garantiert. Hintergrund: [Apple – clientabhängiges WLAN-Roaming](https://support.apple.com/de-de/guide/deployment/dep98f116c0f/1/web/1.0).

Die schnelle Schnittfolge mit 88 Einstellungen, kurzen Zooms, Frame-Verfolgungen, Bankwinkeln,
MU-MIMO und Audio-Onset-Akzenten bleibt erhalten. Titel und Samuel Heinrich erscheinen weiter
am Anfang und Ende. Die Schlussblende beginnt unverändert bei 175,4 s.

## Quellen und Zeitbasis

- Finale WAV: `05_WiFi_Roaming_0.3-1.wav` im gleichnamigen Musikordner.
- SHA-256: `eb8554d1bed1f9eac7033c3f21a8274f725eaadf6cd5e7a1366beaa9a3396afa`.
- Dauer: 8 490 287 / 48 000 = **176,880979167 s**, Stereo, PCM16.
- Vorhandene Analyse: `ASTRA-AUDIO-ANALYSE.json`, Schema `astra.audio.analysis.v1`.
- Vorhandenes Drehbuch: `ASTRA-DREHBUCH.md`; diese Revision konkretisiert und erweitert die
  Inszenierung auf Wunsch des Nutzers. Die ursprünglichen ASTRA-Dateien bleiben unverändert.
- Transkript: 48 verwendete Segmente; originale automatische Zeitmarken bleiben erhalten.
- Cover: `05_WiFi_Roaming_cover.png`; lokale OFL-Schrift Michroma, Weiss/Cyan und bernsteinfarbene
  Linien. Keine Firmenwerbung und kein ASTRA-Branding im Bild.

Die aktuelle vollständige Einstellungsliste mit Event- und Lyric-IDs steht in
[UMSETZUNG-CUES.md](UMSETZUNG-CUES.md). Die 40 verwendeten Analyse-Events sind genau einmal
zugeordnet. E039 (früher Fade-Kandidat) wird wegen der verbleibenden Musikenergie ausgelassen.

Die 87 BPM der Analyse bleiben eine unsichere Halftime-Schätzung. Der schnelle Schnitt greift
die gemessenen Onsets auf; er behauptet weder neu gemessene 174 BPM noch eine sichere Taktart.
Die Onset-Hüllkurve klingt in 75 ms ab; sie steuert lokale Bewegungsakzente. Die vorhandenen
100-ms-Bandverläufe treiben die kontinuierlichen Animationen. Es wurde in dieser Überarbeitung
keine zusätzliche vollständige Hörverifizierung durchgeführt.

## Fachliche Leitplanken

`layout.js`, `roaming.js` und `protocol-model.js` sind redaktionelle Modelle, kein WLAN-Mitschnitt.
RSSI und Noise Floor werden in dBm angezeigt, SNR wird als deren Differenz in dB berechnet.
Die Werte sind auf Entfernung und inszenierte Ereignisse abgestimmt und im Bild als Illustration
markiert. Die gewählten -67/-72-dBm-Werte sind ein inszeniertes Szenario, keine allgemeingültigen Roaming-Schwellen.
Der Zahlenverlauf wurde auf Wunsch des Nutzers überarbeitet; er ist kein Messwert aus den Lyrics.
Alle Protokollzeiten sind für den Film gedehnt; sie stellen keine realen Latenzen dar.

- Der Client wählt den Ziel-AP; identische SSID bedeutet nicht identische BSSID.
- Scans wechseln die abgehörten Kanäle. Normaler Nutzdatenverkehr wird nicht als kontinuierliches
  Frequency Hopping dargestellt. Die bunte Kanalfolge ist eine Scanansicht.
- DFS verändert den Kanal derselben AP-Zelle bei unveränderter BSSID. Regulatorische CAC- und
  Non-Occupancy-Zeiten werden nicht in Filmsekunden abgebildet. Der gezeigte Zielkanal 36 ist
  kein DFS-Kanal. Die erste Radar-Vorschau erfindet keinen zusätzlichen Kanalwechsel.
- RTS/CTS ist eine optionale Schutzsequenz. Dauerfeld/NAV lässt andere Stationen warten.
- 802.11k liefert Nachbarinformationen; 802.11v kann einen BSS-Wechsel empfehlen. Das Diagramm
  zeigt keinen Zwangswechsel und keine automatische Garantie eines nahtlosen Übergangs.
- Der gezeigte EAPOL-Handshake ist ein klassisches WPA2-PSK-Beispiel mit bereits verfügbarer PMK,
  kein 802.11r-FT. Nonces/MIC und geschützte Key Data werden übertragen, PTKs lokal abgeleitet.
- Downlink-MU-MIMO zeigt gleichzeitige räumliche Ströme auf einem Kanal. Die farbigen Pfade sind
  keine getrennten Frequenzkanäle und keine Darstellung von OFDMA Resource Units.
- 80-MHz-Beispiele sind um Kanal 42 / 5210 MHz und Kanal 58 / 5290 MHz zentriert; die 20-MHz-
  Ansicht zeigt beispielhaft Primärkanäle 36 / 5180 MHz und 52 / 5260 MHz. Kurven sind schematisch,
  keine gemessenen Spektralmasken. Die 2,4-GHz-Ansicht zeigt auch eine absichtliche Überlappung
  mit Kanal 3 neben Kanal 1, 6 und 11.
- Funkkuppeln, Strahlpfade und Ausbreitungsdiagramme sind Metaphern; Wände, Antennen, Leistung
  und Material beeinflussen reale Abdeckung. Ein Captive Portal bleibt auf Anwendungsebene.

Primäre Referenzen:

- [Cisco: 802.11-Frames, RTS/CTS und Beacons](https://www.cisco.com/c/en/us/support/docs/wireless-mobility/80211/200527-Fundamentals-of-802-11-Wireless-Sniffing.html)
- [Cisco: DFS und Radarerkennung](https://www.cisco.com/c/en/us/support/docs/wireless-mobility/80211/213882-radar-detection-in-dynamic-frequency-sel.html)
- [Cisco: 802.11k Neighbor Report](https://blogs.cisco.com/networking/why-the-802-11k-and-neighbor-report-are-important)
- [Cisco: 802.11v BSS Transition](https://www.cisco.com/c/en/us/support/docs/wireless-mobility/wireless-lan-wlan/201015-802-11v-Basic-Service-Set-BSS-on-AireO.html)
- [Cisco: gleichzeitige MU-MIMO-Übertragung im gleichen Spektrum](https://www.cisco.com/c/en/us/td/docs/wireless/controller/technotes/8-1/1850_DG/b_Cisco_Aironet_Series_1850_Access_Point_Deployment_Guide.html)

## Architektur und Abnahme

Vier Three.js-Zonen: `hall`, `device`, `spectrum`, `protocol`. `telemetry-overlay.js` zeichnet die
Fachansichten und Syslogs über das 3D-Bild. `config.js` enthält die feste Schnittfolge,
`timeline.js` ordnet die unveränderten Analyse-Cues zu. Alle Szenen sind Funktionen der absoluten
Zeit; Rückwärtsspringen muss dasselbe Bild liefern wie Vorwärtswiedergabe.

Schnittstellen: `window.renderTime(t)`, `window.renderFrame(frame)`, `window.film`, `window.FILM`,
`window.__ready`, `window.__error` und `window.player.seek(t)`.

Die Tests kontrollieren Quelle/Dauer, lückenlose Schnitte, eindeutige Cue-Zuordnung, deterministische
Interpolationen, RSSI/SNR-Konsistenz, kontinuierliche Bewegung durch fünf Kurven, drei tatsächliche BSSID-Wechsel, Retransmit-Erholung, DFS-Zustände, Senderichtungen, vollständige RTS/Action-Sequenzen
und die Frame-Rückfahrt. Die Browserprüfung untersucht alle Sekunden und Schnittgrenzen,
Handshake-/DFS-Schlüsselmomente, Pixelgleichheit nach Zeitsprüngen, Player und Wiedergabe.
Standbilder und Bericht der Revision liegen getrennt unter `output/qa-v3/`.

Der Codezustand vor der Überarbeitung liegt einmalig unter
`_revisions/code-before-spatial-roaming-v3.tar.gz`. Es werden keine `.bak`-Serien angelegt.

<!-- global-kisound-render -->
## Globaler Videoexport: bestehende und neue Projekte

In jedem fertig eingerichteten Songordner (auch in dessen Unterordnern):

```sh
kisound-render 1080p
```

oder:

```sh
kisound-render 4k
```

Nur prüfen, ohne einen Render zu starten:

```sh
kisound-render 4k --check
```

Ein beliebiges Projekt von einem anderen Ordner aus wählen:

```sh
kisound-render 4k --project "/Pfad/zum/Video-Song" --check
```

Der globale Befehl braucht keine neuen npm-Einträge pro Song. Er findet den Projektordner
an `src/render/index.html` und `src/render/render.mjs`. Er übernimmt eine vorhandene
`render-export.json`; ohne diese Datei erkennt er genau eine Audiodatei in `assets/audio`.
Bei mehreren Fassungen muss die Quelle eindeutig gewählt werden:

```sh
kisound-render 4k --audio "assets/audio/finale.wav"
```

Die Quelle wird nicht geändert. Bildrate und Bildzahl stammen aus dem Film. Auflösungen:
1920 × 1080 oder 3840 × 2160. Standardmässig erhält jeder Export im Song-Unterordner `output/`
einen Zeitstempel sowie ein Log und einen JSON-Prüfbericht. Bestehende Dateien werden nicht
überschrieben. Optional sind `--out`, `--jobs`, `--encoder`, `--crf`, `--chrome` und `--temp-dir`.
Details: `kisound-render --help` und das zentrale `tools/export-video.mjs`.

Neue Projekte müssen die vorhandene kisound-Renderer-Schnittstelle verwenden: lokale
Node-Abhängigkeiten inklusive `puppeteer-core`, `#stage`-Canvas, `window.renderFrame`,
`window.FILM`, `window.__ready`/`window.__error`, sowie `FPS`, `FRAMES`, `DURATION` im
Timeline-Modul. Ein Ordner mit nur Analyse/Lyrics lässt sich noch nicht als Video rendern.
Abweichende Pfade und Titel/Interpret können in `render-export.json` konfiguriert werden.

Für vorhandene, bei der Einrichtung gefundene Projekte funktionieren zusätzlich
`npm run export:1080p`, `npm run export:4k` und `npm run export:check -- --resolution 4k`.
Bei künftigen Projekten direkt `kisound-render` verwenden oder die Einrichtung erneut starten,
um auch die optionalen npm-Kurzbefehle hinzuzufügen. Der globale Befehl ist eine zsh-Funktion;
neue Terminalfenster laden sie aus `.zshrc`. Das Einrichtungsprogramm zeigt den `source`-Befehl
für das bereits offene Terminal. Es startet selbst nie einen Videoexport.

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
