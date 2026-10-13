# Network Engineer Album 02 – lokale Audioanalyse

Die Album02-Pipeline ist aus `Network-Engineer-Album01/_audio_analysis/analyse.py` übernommen.
Sie analysiert die acht aktuellen Tracks `01` bis `08`, schreibt pro Track
`ASTRA-AUDIO-ANALYSE.json`, `.md` und `.png` in den gleichnamigen Videoordner und erzeugt
mit `validate.py` den Albumindex sowie `manifest.json`. Keine Videos oder Drehbücher.

Die Audio- und Promptdateien werden nur gelesen. TrustSecs Transkript wurde auf die
finale WAV umgestellt; die unveränderten Texte und Zeitangaben sind durch identische
PCM16-Samples zur bisherigen MP3-Decodierung abgesichert. Das bestehende Videoprojekt
liegt ebenfalls in `../03_TrustSec/` und verwendet jetzt die finale WAV.

## Quellen und Produktionsstand

Die acht Tracks haben finale `*_1.0.txt`-Prompts mit `RELEASE AUDIO`.
Die Pipeline verwendet die Datei aus `source_audio` des Transkript-JSON und prüft
Audio-SHA-256, decodierte Dauer und Übereinstimmung mit `RELEASE AUDIO`.
`STATUS: Final`, passender 1.0-Prompt und passende Release-Datei ergeben den
Analysestatus `final_release`; ältere Analysen können noch `current_audio_candidate`
tragen. Prompt und Transkript werden zusätzlich mit SHA-256 dokumentiert.

TrustSec (03) wurde am 5. Oktober 2026 direkt aus `03_TrustSec_1.0.wav`
(WAV/PCM16, 48 kHz Stereo) neu berechnet. Keine MP3 dient mehr als seine Analysequelle.
Die übrigen Analysen wurden in diesem Schritt nicht neu berechnet.
`trustsec-wav-migration.json` dokumentiert PCM-Identität, unveränderte Cues,
Backups und die bewusste Erneuerung des Quell-Snapshots.
Containerdauer und decodierte Sampledauer stehen separat im JSON.
Bei einer anderen Aufnahme müssen Analyse und Transkript neu erstellt werden.

## Umgebung und Aufruf

Python 3.14, FFmpeg und ffprobe auf dem PATH. Die lokale `.venv` ist eingerichtet;
`requirements.txt` fixiert alle tatsächlich verwendeten Paketversionen. Start in diesem Ordner:

```sh
uv venv --python 3.14 .venv
UV_CACHE_DIR=/tmp/kisound-uv-cache uv pip install --python .venv/bin/python -r requirements.txt
MPLCONFIGDIR=/tmp/kisound-mpl .venv/bin/python analyse.py
MPLCONFIGDIR=/tmp/kisound-mpl .venv/bin/python validate.py
```

Einzelne Tracks erneut berechnen, zum Beispiel nach einer geänderten Aufnahme:

```sh
MPLCONFIGDIR=/tmp/kisound-mpl .venv/bin/python analyse.py 03_TrustSec 07_QoS
```

Vor dem Überschreiben erzeugt die Pipeline zeitgestempelte Kopien unter
`backups/<Track>/`. Die Analyse verändert Audio, Prompt und Transkript nicht.
`source-snapshot.json` enthält SHA-256 aller Musikquelldateien von Album02 sowie der
Album01-Analyseskripte zum dokumentierten Quellstand. `validate.py` prüft, dass sie unverändert sind.
Nach bewusst geänderten Musikquellen ist dieser Snapshot vor der erneuten Validierung
entsprechend neu zu erstellen; nicht einen alten Snapshot als Nachweis verwenden.

`validate.py` erhält bestehende Track-READMEs, damit Projektdokumentation nicht
überschrieben wird. Nur bei ausdrücklich gewünschter Erneuerung einer reinen
Analyse-README: `validate.py --refresh-readme 03_TrustSec`.

## Messschema `astra.audio.analysis.v1`

Das aktuelle Album01-Format bleibt erhalten: `source`, `summary`, `tempo`, `spectrum`,
`sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`,
`limitations`. Neue Felder ergänzen Kandidatenstatus, Codec, decodierte Dauer und
vorhandene ASR-Prüfmetadaten. Keine alten MTU-Sonderformen (`lyrics` als Liste, `kind`).

- Pegel: Sample-Peak und RMS aus beiden decodierten Kanälen; Crest = Peak minus Gesamt-RMS.
  True Peak, LUFS, LRA, Momentary (400 ms) und Short-term (3 s) aus FFmpeg EBU R128.
  True Peak ist auf 0,1 dB gerundet. Nicht endliche Samples führen zum Abbruch;
  nicht verfügbare Lautheitsfenster sind JSON-`null`, auch FFmpeg-`nan` im leisen MP3-Ausklang.
- Spektrum: arithmetische Stereo-Mono-Summe, Hann-STFT mit 4096 Samples und 50-ms-Hop
  bei Original-Samplerate. Bandenergie aus quadrierten FFT-Beträgen, Messbereich 20–20 000 Hz.
- 100-ms-Merkmale: Zeitstempel ist die tatsächliche Fenstermitte, auch beim kürzeren letzten
  Fenster. `*_drive`: pro Band durch das eigene 95. Perzentil normiert, auf 0–1 begrenzt,
  RMS-Gate von −55 bis −33 dBFS. `*_fraction` ist ein Energieanteil.
- Onsets: tiefpassgefilterte Reduktion auf 12 kHz, 512-Sample-STFT, 10-ms-Hop,
  positive spektrale Differenzen. Zeitunsicherheit ±40 ms; keine Instrument-/SFX-Erkennung.
- Tempo: Onset-Autokorrelation und phasenoptimierte Rasterbewertung. Halb-/Doppeltempo
  als Alternativen; Beat-Raster synthetisch, Taktart und erste Zählzeit unsicher.
- Abschnitte: redaktionelle Grenzen aus vorhandenen Transkript-Gesangszeiten plus
  instrumentalen Lücken; Pegel und Spektrum innerhalb dieser Grenzen sind gemessen.
- Lyrics: Originalzeiten unverändert. Abschnittsnamen, exakte Duplikate und starke
  Überlappungen werden wie bei Album01 ausgeschlossen und mit Quell-ID/Grund dokumentiert.
  `review_required`, `timing_model` und weitere ASR-Prüffelder bleiben in übernommenen Cues erhalten.
  Keine neue Spracherkennung und keine manuelle Hörprüfung in diesem Auftrag.

`events[].image_action` enthält redaktionelle Vorschläge für den späteren Agent,
keine Szenenumsetzung. Spektrale Impulse belegen weder Heartbeat/Flatline noch bestimmte Stimmen.
Echte Drops für die Umsetzung anhand der Sub-Bass-Steuerdaten prüfen
(Kriterium in `../../PRODUKTION.md`), keine geschätzten Beat-Cues als Messung behandeln.

## Prüfung und Übergabe

`validate.py` kontrolliert alle 24 Primärdateien: striktes JSON, Quellen-/Transkript-/Prompt-Hashes,
Sampledauer, vollständige 100-ms-Fenster, normierte Bänder, lückenlose Abschnitte,
Ereignis-/Lyric-IDs, unveränderte Lyrics inklusive Prüffelder, erklärte Ausschlüsse,
endliche Werte und lesbare PNG-Dateien. Manifest: Quelle, Ausgaben inklusive SHA-256,
Umgebung, Tool-Hashes und Validierungszeit. Der Albumindex verlinkt alle Ergebnisse.

Für die Videoumsetzung zusätzlich lesen:

- `../../PRODUKTION.md`, `../../README.md` und `../../tools/`.
- Den beibehaltenen Lyric-/Stil-Prompt und `album.yml` im Musik-Repo.
- Das jeweilige Quelltranskript und `music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`.
- `../ASTRA-ALBUM-UEBERSICHT.md` und die drei Analysedateien pro Track.

Das Musik-Repo bleibt die Quelle der Wahrheit. Neue Videoprojekte verwenden die aktuellen
Ordner `01_On_Call` bis `08_Out_of_Band`; Ports laut Produktionshandbuch ab 8150.
