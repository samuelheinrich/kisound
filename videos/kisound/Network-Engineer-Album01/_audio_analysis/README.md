# Network Engineer Album 01 – lokale Audioanalyse

Die Pipeline verarbeitet ausschliesslich die acht in `analyse.py` aufgeführten Tracks. Sie liest die im Projektprompt als `RELEASE AUDIO` bezeichnete WAV-Datei, prüft deren SHA-256 gegen das vorhandene Transkript und schreibt pro Track die Analyse als JSON, Markdown und PNG. Erst danach erzeugt `screenplay.py` das zugehörige Drehbuch. Originalaudio und Quelldateien bleiben unverändert. Alle Analysen sind signaltechnisch; eine manuelle Hörprüfung wird nicht behauptet.

## Umgebung und Aufruf

Benötigt: Python 3.14, FFmpeg und ffprobe. Abhängigkeiten stehen in `requirements.txt`; die virtuelle Umgebung liegt in `.venv` und ändert System-Python nicht.

```sh
uv venv --python 3.14 .venv
UV_CACHE_DIR=/tmp/kisound-uv-cache uv pip install --python .venv/bin/python -r requirements.txt
MPLCONFIGDIR=/tmp/kisound-mpl .venv/bin/python analyse.py 00_Network_Engineers
MPLCONFIGDIR=/tmp/kisound-mpl .venv/bin/python analyse.py
.venv/bin/python screenplay.py
.venv/bin/python validate.py
```

Für die zusätzliche lokale Gegenprüfung von Track 00 wird `requirements-verify.txt` benötigt. Die beiden Modelle müssen lokal im Hugging-Face-Cache liegen; mit `HF_HUB_OFFLINE=1` werden keine Audiodaten hochgeladen. `verify00.py --apply` gleicht die vorhandenen Lyrics gegen Wortzeiten beider Modelle ab, schreibt einen Vergleichsbericht und aktualisiert die drei Quelltranskriptdateien. Dieser Abgleich ist keine menschliche Hörprüfung. Die ursprünglichen Quelltranskripte liegen unter `_audio_analysis/backups/source_transcript_00/`.

`analyse.py` nimmt optional einzelne Tracknamen an. Dadurch kann nach einem Abbruch bei einem Track fortgesetzt werden. Jede Datei wird unmittelbar nach ihrer Berechnung geschrieben. Vor dem Überschreiben vorhandener ASTRA-Ergebnisse wird eine zeitgestempelte Kopie unter `_audio_analysis/backups/<Track>/` angelegt. Andere Videoprojekte werden nicht berührt.

## Messschema `astra.audio.analysis.v1`

Alle Zeiten sind Sekunden ab Sample 0 der Original-WAV. Die wichtigsten Felder sind `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods` und `limitations`. Nicht verfügbare Lautheitsfenster sind `null`; JSON enthält keine NaN- oder Infinity-Werte.

- **Pegel:** PCM-Sample-Peaks und RMS werden aus beiden Kanälen berechnet. Der Crest-Faktor ist `Sample-Peak dBFS – globales RMS dBFS`. True Peak, LUFS, LRA, Momentary (400 ms) und Short-term (3 s) stammen von FFmpeg EBU R128; True Peak wird auf 0.1 dB gerundet.
- **Spektrum:** Stereo wird arithmetisch zu Mono summiert. Hann-STFT mit 4096 Samples und 50-ms-Hop bei Original-Samplerate. Bandenergie ist die Summe quadrierter FFT-Beträge im jeweiligen Bereich; Anteile beziehen sich auf 20 Hz bis min(20 kHz, Nyquist). Das Spektrogramm benutzt eine logarithmische Frequenzachse.
- **100-ms-Merkmale:** Jede Zeile liegt in der Mitte des entsprechenden Originalaudio-Fensters; das letzte kann kürzer sein. Band-`drive` ist die jeweilige Bandenergie dividiert durch ihr eigenes 95. Perzentil, auf 0–1 begrenzt und bei leisen Passagen mit einem RMS-Gate von −55 bis −33 dBFS abgeschwächt. `*_fraction` ist ein physikalischer Energieanteil, keine wahrgenommene Lautheit.
- **Onsets:** Vor der Reduktion auf 12 kHz wird tiefpassgefiltert. Eine 512-Sample-STFT mit 10-ms-Hop liefert positive spektrale Differenzen. 10 ms sind Analyseauflösung; die angegebene zeitliche Unsicherheit ist grösser. Onsets sind keine Instrument- oder Fehlerklassifikation.
- **Tempo:** Verfahren 1 ist die Autokorrelation des Onset-Verlaufs. Verfahren 2 bewertet periodische Raster über BPM und Phase. Halbzeit- und Doppelzeit-Werte werden als Alternativen aufgeführt. Das Beat-Raster ist ausdrücklich synthetisch, Taktart und erste Zählzeit gelten nicht als sicher erkannt.
- **Lyrics:** Die Zeiten des vorhandenen automatischen Transkripts werden nicht verändert. Offensichtliche Abschnittsnamen, exakte Duplikate und stark überlappende Segmente werden für die Bildzuordnung ausgeschlossen und im JSON mit Grund erfasst. Das ersetzt keine manuelle Hörprüfung.

Die Pipeline speichert die ausgewählte Audiozuordnung mit SHA-256 in `manifest.json`. Die `ASTRA-ALBUM-UEBERSICHT.md` ist der kompakte Albumindex. Das Verzeichnis `09-last-hop` und andere bestehende Videoprojekte gehören nicht zum Lauf.
