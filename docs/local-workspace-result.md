# Lokaler Arbeitsordner nach der Migration

Stand: 13.10.2026. Der Arbeitsordner ist
`/Users/samuel.heinrich/0004_git/kisound/`.

Die zuvor noch fehlenden lokalen Dateien wurden ohne Umbenennung und ohne
Überschreiben vorhandener Zieldateien übernommen:

| Bereich | Zusätzliche Dateien | Bytes |
| --- | ---: | ---: |
| Musikexporte | 82 | 6’599’651’202 |
| Videorenders und Ausgaben | 2’943 | 3’495’802’589 |
| Web-Statistikdateien | 2 | 531’599 |
| Analyse-Backups und temporäre TrustSec-Dateien | 33 | 23’162’271 |

Alle 3’060 Dateien wurden mit SHA-256 gegen die alten Ordner geprüft. Ein
anschliessender Dateivergleich fand ausser den bewusst nicht übernommenen
Abhängigkeiten und Caches keine weiteren nur am alten Ort vorhandenen Dateien.
Die Python-Umgebungen für YouTube-Upload und Album02-Audioanalyse wurden im
Monorepo aus ihren Requirements neu erstellt. Der Web-Build und die lokalen
Pakete sind dort bereits vorhanden.

Arbeitsanleitungen, die global geladene `kisound-render`-Funktion und die
laufzeitrelevanten Vibecoder-Handoff-Manifeste verweisen nun auf den neuen
Arbeitsordner. Das Medieninventar prüft 45 lokale WAV-/Lizenzdateien.

Die alten Ordner unter `../music/kisound/`, `../videos/kisound/` und
`../web/kisound/` können als zusätzliche lokale Kopie bestehen bleiben. Ein
Git-Checkout enthält die ignorierten WAVs, Exporte, Renders und Backups nicht;
die alten Ordner sollten daher erst nach einer **unabhängigen** Sicherung dieser
Daten gelöscht werden. Die bisherigen Audioanalyse-JSONs enthalten teils
historische absolute Quellpfade als Herkunftsangabe. Ihre Prüfsummen und
gespeicherten Messungen wurden nicht umgeschrieben.

Prüfungen: `tools/media_inventory.py --check`, beide Vibecoder-Handoff-Checks,
der isolierte `global-setup.test.py`, das Laden von `kisound-render` aus einer
neuen zsh-Sitzung sowie Imports aus beiden neuen Python-Umgebungen. Der frühere
Web-Build und Browser-Check sind in [`web-build-result.md`](web-build-result.md)
dokumentiert; an Web-Laufzeitdateien wurde hier nichts geändert.
