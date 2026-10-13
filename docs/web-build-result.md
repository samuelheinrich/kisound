# Web-Import: lokaler Build und Check

Stand: 13.10.2026. **Web-Import und lokale Prüfung vom verantwortlichen
Web-Build-Agenten abgenommen.**

## Import

Die 37 Dateien aus `0004_git/web/kisound/` wurden aus dem Arbeitsstand
einschliesslich uncommitteter Dateien nach `web/kisound/` kopiert. Vor und nach
dem Import stimmten Pfad, Grösse und SHA-256 mit
[`web-import-manifest.tsv`](web-import-manifest.tsv) überein. Das Manifest selbst
hat SHA-256 `feb3e53fd44823a28530d55c60b40515c8d431af9c38146a035be819c0e862a0`.
Die ursprünglichen Arbeitsordner blieben unverändert.

## Vorbereitung und Ergebnis

- `python3 tools/media_inventory.py --check`: 44 lokale Mediendateien bestätigt.
- `npm ci --no-audit --no-fund`: im Web-Projekt und in allen 20
  interaktiven Video-Projekten erfolgreich.
- Album 01: `00_Network_Engineers` und `05_WiFi_Roaming` haben ihre Sets per
  `npm`-Prepare-Hook vorbereitet; `09-last-hop` per `npm run sync-sets`.
- `09-last-hop` und Album-02-`03_TrustSec`: `npm run prepare-audio` erfolgreich;
  beide meldeten höchstens 39 ms Beat-Raster-Abweichung.
- `npm run build`: erfolgreich, 49 erzeugte Seiten, 20 Live-Code-Standbilder,
  21 Link-Vorschaubilder, 175,3 MB in `dist/`.
- `npm run check`: erfolgreich, 29 Seiten ohne Seiten- oder Bildfehler,
  22 Audio-Messungen mit 0 ms Versatz und 22 funktionierende Live-Code-Fassungen.
  Der Bericht liegt lokal unter `web/kisound/.cache/check/report.json`.
- `audio-offsets.json` blieb bytegleich zum Import-Manifest;
  `rebuild_needed` wurde nicht gemeldet. Ein zweiter Build war nicht nötig.

Der Build meldete zwei inhaltliche Hinweise: Im Vibecoder-`album.yml` fehlt ein
Albumcover; im Impressum ist keine Postadresse konfiguriert. Dafür wurden keine
Web-Quellen geändert. Ein Live-Deploy wurde nicht ausgeführt.

## Session-Migration

Die Claude-/Codex-Session-Migration und das Wiederöffnen älterer Sessions sind
separat im [Migrationsbericht](session-migration-result.md) dokumentiert. Die
aktuell laufende Codex-Sitzung wurde am Monorepo-Root wiederaufgenommen; ihre
früheren Kontext-Einträge bleiben als Verlauf erhalten.
