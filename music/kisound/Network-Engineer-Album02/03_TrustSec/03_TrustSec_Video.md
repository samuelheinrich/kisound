# 03 TrustSec – Musikvideo und Audioanalyse

Das bestehende Videoprojekt und die aktuelle Audioanalyse liegen unter:

    0004_git/videos/kisound/Network-Engineer-Album02/03_TrustSec/

| Datei in diesem Trackordner | Verwendung |
| --- | --- |
| `03_TrustSec_1.0.wav` | Finale Release-Datei, Audioanalyse und Masterclock des Videos |
| `03_TrustSec_Transkript.json` | Unveränderte Gesangs- und Systemmeldungszeiten, mit WAV-SHA-256 |
| `03_TrustSec_1.0.txt` | Finaler Lyric-/Stil-Prompt mit `RELEASE AUDIO` |

Die finale WAV hat dieselben PCM16-Samples wie die bisherige MP3-Decodierung;
Texte und Zeitangaben wurden unverändert übernommen. Der vollständige PCM-Hash und
die ursprüngliche MP3-Zuordnung stehen unter `source_migration` im Transkript-JSON.

Bei Änderungen `npm run prepare-audio` im Videoprojekt ausführen. Das Skript prüft
Dateiname und SHA-256 und kopiert die Release-WAV ohne Neucodierung.
Die separate ASTRA-Analyse wird mit `_audio_analysis/analyse.py 03_TrustSec` erneuert.

Die bestehende Umsetzung zeigt Systemmeldungen; die Überarbeitung des Szenencodes
ist separat. Dieser Quellenwechsel erzeugt keinen neuen MP4-Export und ersetzt keine
bereits hochgeladenen Videos. `03_TrustSec_Transkript.srt` bleibt unverändert.
