# Network Engineer Album 02 – Audioanalyse für die Videoproduktion

Die Struktur spiegelt die acht aktuellen Trackordner des Musik-Repos.
Pro Track sind `ASTRA-AUDIO-ANALYSE.json`, `.md` und `.png` erstellt;
Videoumsetzung und Drehbücher folgen in einem separaten Auftrag.

[Albumindex mit allen Analysen](ASTRA-ALBUM-UEBERSICHT.md) ·
[Analysewerkzeuge und Wiederholung](_audio_analysis/README.md)

```text
Network-Engineer-Album02/
├── _audio_analysis/       analyse.py, validate.py, requirements.txt, manifest.json, .venv
├── 01_On_Call/           Live-Code-Stück (Port 8150), siehe dortiges README
├── 02_Active_Standby/    Live-Code-Stück (Port 8152), siehe dortiges README
├── 03_TrustSec/          WAV-Analyse und bestehendes Videoprojekt (Port 8124)
├── 04_Broadcast_Storm/   Live-Code-Stück (Port 8154), siehe dortiges README
├── 05_Wireshark/         Live-Code-Stück (Port 8156), siehe dortiges README
├── 06_ICMP/              Live-Code-Stück (Port 8158), siehe dortiges README
├── 07_QoS/              Live-Code-Stück (Port 8160), siehe dortiges README
└── 08_Out_of_Band/       Live-Code-Stück (Port 8162), siehe dortiges README
```

Musikquellen: `../../../music/kisound/Network-Engineer-Album02/`.
Die aktuelle Tracknummer für TrustSec ist 03; dessen neue Analysen liegen in `03_TrustSec/`.
Die bestehende Videoumsetzung liegt ebenfalls unter `03_TrustSec/` und verwendet die finale WAV.

TrustSec wurde direkt aus der finalen `03_TrustSec_1.0.wav` neu analysiert.
Die übrigen Analysen bleiben aus ihren bisherigen WAV-Quellen erhalten.
Die Zuordnung ist über Transkript-SHA-256 und Sampledauer geprüft; TrustSec ist zusätzlich
mit dem finalen 1.0-Prompt abgeglichen.
Offene ASR-Prüfmarkierungen bleiben erhalten; keine manuelle Hörprüfung.
Bei einer anderen Aufnahme Analyse und Transkript erneut erstellen.

Der nächste Agent startet mit [PRODUKTION.md](../PRODUKTION.md), Prompt/Stilvorgaben,
Transkript-Prüfbericht und den Analysen. Die instrumentalen Abschnitte, Pegellücken,
Bassverläufe und Onsets liefern die Grundlage für Szenen und Schnitt.
