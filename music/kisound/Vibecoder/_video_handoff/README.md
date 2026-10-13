# Videopaket · Vibecoder

Das vorbereitete Albumverzeichnis liegt unter [Vibecoder](Vibecoder/README.md). Direkte Einstiege: [TOKEN BURN](Vibecoder/02_Token_Burn/ASTRA-DREHBUCH.md) und [SHIP IT](Vibecoder/03_SHIP_IT/ASTRA-DREHBUCH.md).

Das **SHIP-IT-Paket** wurde am 12. Oktober 2026 zusätzlich nach `/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Vibecoder/03_SHIP_IT/` übertragen und dort gegen die finalen Musikquellen validiert. Für TOKEN BURN existiert im Videoordner bereits eine weiterentwickelte Live-Code-Umsetzung. Die Dateien unter `_video_handoff/Vibecoder/02_Token_Burn/` bleiben deren früheres Drehbuchpaket.

`install.py` kopiert das gesamte vorbereitete Album nur, wenn vorhandene Zieldateien identisch sind. Im aktuellen Videoordner meldet ein Albumlauf erwartete Konflikte bei den dort weiterentwickelten READMEs und TOKEN-BURN-Dateien. Für SHIP IT ist die Übertragung bereits erfolgt; ein erneuter Albumlauf ist dafür nicht nötig. Mit `--check` werden Konflikte vor jeder Kopie angezeigt.

Das ZIP `Vibecoder-Video-Drehbuch.zip` enthält den aktuellen Paketstand einschliesslich SHIP IT und der leeren Platzhalterordner. Das ZIP ist ein Archiv des Handoffs, kein Ersatz für die bereits weiterentwickelten Dateien im Videoordner.

`build_handoff.py` erzeugt die TOKEN-BURN-Zeitlisten neu und erhält die SHIP-IT-Dateien. `Vibecoder/03_SHIP_IT/generate_handoff.py` erzeugt die SHIP-IT-Produktionsdaten aus den finalen Musikquellen. `validate.py` prüft den TOKEN-BURN-Handoff und Paketlinks; `Vibecoder/03_SHIP_IT/validate_handoff.py` prüft SHIP IT, beide auch am tatsächlichen Projektort.
