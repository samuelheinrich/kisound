# Übergabe an den Web-Build-Agenten · Monorepo-Import

**Freigabestatus: Import und lokale Prüfung freigegeben (13.10.2026).**
Die [Review-Rückmeldung](web-review-and-session-migration.md) bestätigt das
37-Dateien-Manifest und beschreibt die zusätzlich erforderlichen Video-Asset-
Vorbereitungen sowie die Claude-/Codex-Session-Migration. Der
[Build- und Prüfbericht](web-build-result.md) dokumentiert den erfolgreichen
Import und lokalen Check, die der Web-Build-Agent abgenommen hat. Die
Session-Migration wurde separat durchgeführt und im
[Migrationsbericht](session-migration-result.md) geprüft.

## Vorgesehener Import

- Quelle: bisheriger Arbeitsordner `0004_git/web/kisound/` mit seinem aktuellen
  Dateistand, einschliesslich nicht committeter Änderungen.
- Ziel: `web/kisound/` im neuen gemeinsamen Repository `0004_git/kisound/`.
- Die 37 zu übernehmenden Dateien und ihre SHA-256-Werte stehen in
  [`web-import-manifest.tsv`](web-import-manifest.tsv). Der Web-Code und
  `site.config.json` sollen beim Import bytegleich bleiben.
- Lokale Git-Metadaten, `node_modules/`, `.cache/`, `dist/`, `.DS_Store` sowie
  die mit `npm run stats` erzeugten `projekt-stats.html` und
  `projekt-stats.json` werden nicht übernommen.

Die relative Anordnung bleibt gleich: Von `web/kisound/` aus zeigen die
Konfigurationswerte `../../music/kisound` und `../../videos/kisound` weiter auf
die beiden Quellen. Album 01, Album 02 und die bereits sichtbaren Vibecoder-
Stücke behalten ihren aktuellen Veröffentlichungsstatus. Die Musikquellen
liegen am vorgesehenen Ort; Audio bleibt lokal ausserhalb von Git, Cover und
benötigte Code-Assets werden versioniert. Die URL-Tabellen in den `xx_*`-
Ordnern werden mitgenommen.

## Ausführung und Abnahme

1. Direkt vor dem Import die Quell-Dateien erneut gegen das Manifest prüfen.
   Bei einer Änderung die Übergabe aktualisieren und erneut bestätigen lassen.
2. Die 37 Dateien bytegleich kopieren und Quelle/Ziel per SHA-256 vergleichen.
3. Die in der Review-Rückmeldung beschriebenen Paketinstallationen und
   Audio-/Set-Vorbereitungen durchführen. Im neuen Web-Ordner `npm run build`
   und den vollständigen `npm run check` ausführen. Der Check kann die
   versionierte `audio-offsets.json` ändern; diesen Diff prüfen und bei
   `rebuild_needed` erneut bauen und vollständig prüfen.
4. Das Ergebnis mit dem Build-Agenten prüfen. Bei nötigen Web-Codeänderungen
   die konkrete Änderung vor ihrer Ausführung erneut übergeben.

Die Migration führt keinen Live-Deploy aus. Nach erfolgreicher Abnahme kann
der Monorepo-Branch als Pull Request in das bestehende GitHub-Repository gehen.
