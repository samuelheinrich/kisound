# Vibecoder: Transkript und Audioanalyse

## VIBECODER 01 · finale DE/EN-WAVs

Die Originaldateien liegen flach unter `01_Vibecoder/final/`; die getrennten
Arbeitsdaten liegen unter `final/de/` und `final/en/`. Es wurde keine WAV
umbenannt, beschnitten oder in Git aufgenommen. Die 1.0-Quellbelege verknüpfen
jeweils die finale WAV mit den aktuellen Lyrics und dem Stiltext aus
`suno-0.1/<Sprache>/`. Die EN-Lyric wurde am 13. Oktober korrigiert; nur der
Textabgleich musste daraufhin erneuert werden, die ASR-Rohdaten und
Audio-Messungen beziehen sich weiterhin auf dieselben WAV-Samples.

```sh
KISOUND_AUDIO_TRACK=01_Vibecoder PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 \
  /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe_mlx.py de en
KISOUND_AUDIO_TRACK=01_Vibecoder KISOUND_ASR_MODEL=turbo PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 \
  /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe_mlx.py de en
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 \
  /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe_vibecoder01_windows.py de en
KISOUND_AUDIO_TRACK=01_Vibecoder PYTHONDONTWRITEBYTECODE=1 \
  python3 Vibecoder/_audio_analysis/curate_vibecoder01.py de en
KISOUND_AUDIO_TRACK=01_Vibecoder MPLCONFIGDIR=/tmp/kisound-mpl PYTHONDONTWRITEBYTECODE=1 \
  ../../videos/kisound/Network-Engineer-Album02/_audio_analysis/.venv/bin/python \
  Vibecoder/_audio_analysis/analyse.py de en
KISOUND_AUDIO_TRACK=01_Vibecoder PYTHONDONTWRITEBYTECODE=1 \
  ../../videos/kisound/Network-Engineer-Album02/_audio_analysis/.venv/bin/python \
  Vibecoder/_audio_analysis/validate.py
```

Die Kommandos starten im Verzeichnis `music/kisound/`. Die beiden Sprachfassungen
haben eigene Dauern und Zeitmarken ab Sample 0. `curate_vibecoder01.py` führt
ASR-Fragmente anhand tatsächlicher Wortgrenzen zusammen und glättet strittige
Wörter redaktionell; jede solche Zeile bleibt im JSON und Prüfbericht markiert.
Besonders die EN-Final-Drop-Zeile um 03:24–03:28 ist gegenüber den Referenzlyrics
offen. Die SRT ist eine Arbeitsfassung für das spätere Drehbuch, keine manuell
gehörte Untertitelfreigabe. Die Analyse enthält Messwerte und redaktionelle
Schnittanker, erzeugt aber kein Video.

## TOKEN BURN 02

Die finale deutsche und englische WAV bleiben unverändert. Ergebnisse liegen
neben dem jeweiligen finalen Prompt unter `02_Token_Burn/final/de/` und `en/`.
Zeitnull ist Sample 0 der jeweiligen WAV; die Sprachfassungen haben eigene Zeiten.

## Lokale Transkription

`transcribe.py` verwendet die bereits lokal vorhandenen Gewichte von
`mlx-community/whisper-large-v3-turbo` und `mlx-community/whisper-large-v3-mlx`
sowie die mit MLX Whisper ausgelieferten
Tokenizer- und Mel-Filterdaten. Da Metal im Sandboxprozess nicht erreichbar ist,
werden die Gewichte im Speicher in das PyTorch/Transformers-Layout umgewandelt.
Das strikte Laden prüft alle Modellparameter; sinusoidale Encoderpositionen
werden wie im ursprünglichen Modell berechnet. Es werden keine Gewichte geändert.

Das Modell erkennt den Text ohne Lyrics-Prompt, mit expliziter Sprache,
Temperatur 0 und ohne Textübernahme aus vorherigen Fenstern. Der grössere
large-v3-Lauf erhält lediglich den Vokabularhinweis
`Token Burn, Prompt, Build, Export, Screen.`; der Turbo-Lauf erhält keinen
Texthinweis. Beide Varianten verarbeiten 30-s-Fenster mit laufenden Checkpoints.
Encoder-Attention wird speichersparend via SDPA berechnet; nur die für
Wortausrichtung benötigte Decoder-Attention wird behalten. Wortzeiten kommen
aus Cross-Attention/DTW, Segmentzeiten aus Whisper-Zeitstempeln. Rohdaten und
Modell-/Datei-Hashes bleiben in `final/<Sprache>/asr/` nachvollziehbar erhalten.
Automatische Zeiten und Textabweichungen sind keine manuell bestätigte Aufnahme.
Die finale Cueliste bevorzugt large-v3; Turbo liefert den Textvergleich im selben
Zeitfenster. Abweichungen und Lyrics-Abgleich sind je Cue dokumentiert. Eine
offensichtlich zusammengefallene Kopie des Vokabularhinweises wird ausgeschlossen.
Fehlende vollständige large-v3-Zeilen werden bei ausreichendem Lyrics-Abgleich
aus tatsächlichen Turbo-Wortzeiten ergänzt und ausdrücklich markiert. Ein kurzer
Thank-you-Rest ohne Lyrics- oder Turbo-Beleg bleibt nur im Prüfprotokoll erhalten.

`cached_runtime.py` erschliesst die vorhandenen kompatiblen Python-3.12-Wheels
offline aus dem lokalen uv-Cache. Modell- und Package-Versionen werden im
Rohtranskript gespeichert. In einer regulären Python-Umgebung kann derselbe
Code mit entsprechend installierten Dependencies genutzt werden.

```sh
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 /opt/homebrew/bin/python3.12 \
  Vibecoder/_audio_analysis/transcribe.py de en
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 KISOUND_ASR_MODEL=large-v3 \
  /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe.py de en
python3 Vibecoder/_audio_analysis/build_transcripts.py
```

## Analyse

`analyse.py` übernimmt den vorhandenen Audioanalyse-Workflow aus
`videos/kisound/Network-Engineer-Album02/_audio_analysis/analyse.py` und passt
Dateiauswahl, Sprachpfade, Berichtsverweise und Bildmotive an TOKEN BURN an.
SHA-256 der ursprünglichen Pipeline:
`4791b8953954d026ea1e420cdfddf41af3d0dd98971152d2d1a3042d73fdf8a3`.

Die Analyse misst PCM-Pegel, EBU-R128-Lautheit/True Peak, Stereo-Korrelation,
Frequenzbänder und Onsets. BPM und Beat-Raster sind Schätzungen. Abschnittsnamen
kommen aus dem Transkript; Bildaktionen sind Vorschläge für spätere Codevideos.
Das JSON enthält 100-ms-Steuerwerte, alle Quell-Hashes und methodische Grenzen.
Das Ende-Ereignis behält die Originaldauer mit sechs Dezimalstellen, damit eine
Millisekundenrundung keine Zeitmarke hinter das tatsächliche WAV-Ende legt.

```sh
MPLCONFIGDIR=/tmp/kisound-mpl PYTHONDONTWRITEBYTECODE=1 \
  ../../videos/kisound/Network-Engineer-Album02/_audio_analysis/.venv/bin/python \
  Vibecoder/_audio_analysis/analyse.py de en
```

Dependencies für die Analyse: numpy, scipy, soundfile, matplotlib und FFmpeg.
Es werden weder Audioexporte noch Videos erstellt.

Prüfung der WAV-/Prompt-/ASR-Hashes, gleichen JSON/SRT/TXT-Cues, tatsächlichen
Wortgrenzen, vollständigen 100-ms-Zeitachse, Abschnittsabdeckung und PNGs:

```sh
PYTHONDONTWRITEBYTECODE=1 \
  ../../videos/kisound/Network-Engineer-Album02/_audio_analysis/.venv/bin/python \
  Vibecoder/_audio_analysis/validate.py
```

ASR-Runtime: torch 2.10.0, transformers 4.57.6, numpy 2.3.5,
safetensors 0.7.0 und Tokenizer/Mel-Daten aus mlx-whisper 0.4.3.

## SHIP IT · finale V3-Aufnahmen (12. Oktober 2026)

Die beiden Original-WAVs liegen unter `03_SHIP_IT/final/`. Die sprachgetrennten `03_SHIP_IT_1.0.txt`-Prompts verweisen mit `RELEASE AUDIO: ../...` auf diese Dateien. Zeitnull ist Sample 0 jeder WAV; DE und EN werden niemals proportional ineinander umgerechnet.

Für SHIP IT wurde die vorhandene Pipeline über `KISOUND_AUDIO_TRACK=03_SHIP_IT` wiederverwendet. Der Turbo-Gegenlauf stammt aus `transcribe.py` (CPU). `transcribe_mlx.py` nutzt dieselben lokal vorhandenen large-v3-Gewichte auf MLX/GPU mit Wortzeiten. Bei langen, stark bearbeiteten Hookpassagen wiederholte die 30-s-ASR Wörter ohne ausreichenden Audio-Beleg. `transcribe_repair.py` prüft nur diese Intervalle in unabhängigen kurzen Fenstern. `curate_ship_raw.py` behält die Rohfassungen und dokumentiert ersetzte Segmente; es ändert weder WAV noch Modellgewichte. Es gab keine manuelle Hörprüfung. Auch die Modell-Gegenprüfung ist keine unabhängige Bestätigung, weil beide Läufe zur Whisper-Familie gehören.

```sh
KISOUND_AUDIO_TRACK=03_SHIP_IT PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe.py de en
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe_mlx.py de en
PYTHONDONTWRITEBYTECODE=1 HF_HUB_OFFLINE=1 /opt/homebrew/bin/python3.12 Vibecoder/_audio_analysis/transcribe_repair.py de en
PYTHONDONTWRITEBYTECODE=1 python3 Vibecoder/_audio_analysis/curate_ship_raw.py de en
KISOUND_AUDIO_TRACK=03_SHIP_IT PYTHONDONTWRITEBYTECODE=1 python3 Vibecoder/_audio_analysis/build_transcripts.py
PYTHONDONTWRITEBYTECODE=1 python3 Vibecoder/_audio_analysis/curate_ship_sections.py de en
KISOUND_AUDIO_TRACK=03_SHIP_IT MPLCONFIGDIR=/tmp/kisound-mpl PYTHONDONTWRITEBYTECODE=1 \
  ../../videos/kisound/Network-Engineer-Album02/_audio_analysis/.venv/bin/python Vibecoder/_audio_analysis/analyse.py de en
KISOUND_AUDIO_TRACK=03_SHIP_IT PYTHONDONTWRITEBYTECODE=1 \
  ../../videos/kisound/Network-Engineer-Album02/_audio_analysis/.venv/bin/python Vibecoder/_audio_analysis/validate.py
PYTHONDONTWRITEBYTECODE=1 python3 Vibecoder/_video_handoff/Vibecoder/03_SHIP_IT/generate_handoff.py
```

`curate_ship_sections.py` fügt redaktionelle Songabschnitte hinzu. Die Grenzen folgen ASR und der gemessenen Form, sind keine Wortgrenzen. Die automatischen Wortzeiten und der rohe Modelltext bleiben erhalten. `TRANSKRIPT-PRUEFUNG.md` führt unsichere Zeilen und nicht ausreichend belegte Promptzeilen auf. Die Audioanalyse trägt SHA-256 der WAV, des Prompts und des Transkripts; die Handoff-Dateien übernehmen die Analysen bitgleich.
