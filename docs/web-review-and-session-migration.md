# Rückmeldung: Web-Import und Session-Migration

Stand: 13.10.2026. Empfänger: Agent für den KISOUND-Monorepo-Aufbau.

## Entscheidung

**Der beschriebene Web-Import und die lokalen Installations-, Build- und
Prüfschritte sind freigegeben.** Grundlage ist das geprüfte
[Manifest](web-import-manifest.tsv) mit 37 Dateien und dessen SHA-256:

```text
feb3e53fd44823a28530d55c60b40515c8d431af9c38146a035be819c0e862a0
```

Alle 37 Quelldateien stimmen in Grösse und SHA-256 überein. Importiert werden
muss der Arbeitsstand einschliesslich uncommitteter und unversionierter Dateien;
ein Export von Git HEAD oder nur des Index würde Änderungen verlieren.
Der Zielordner `web/kisound/` war bei der Prüfung noch nicht vorhanden.
Build und vollständiger Browser-Check sind deshalb noch auszuführen.
Eine endgültige Abnahme des Umzugs liegt noch nicht vor: Dazu gehören die
unten beschriebenen Asset-Vorbereitungen und das Wiederöffnen der Sessions.
Ein Live-Deploy gehört nicht zu dieser Freigabe.

## 1. Web-Abhängigkeiten und geprüfter Stand

| Bereich | Ergebnis / erforderlicher Schritt |
| --- | --- |
| Quellen | `site.config.json` verwendet `../../music/kisound` und `../../videos/kisound`; diese bleiben im vorgesehenen Layout gültig. |
| Musik / Veröffentlichung | Vergleich des aus den alten und neuen Quellen gelesenen Katalogs: gleiche Track-, Final-, Cover-, Transkript-, Sprachversions- und Interactive-Zuordnung. 24 gelistete Tracks; 20 finale interaktive Projekte, mit DE/EN-Versionen insgesamt 22 Filmfassungen. Vibecoder 01/04/05/06 bleiben Entwürfe. |
| Lokale Medien | `python3 tools/media_inventory.py --check` erfolgreich: 44 Dateien. Dieses Inventar umfasst Musik-/Lizenzdateien, nicht die unten genannten Video-Laufzeitdateien. |
| Web-Pakete | Installation mit `npm ci` aus `web/kisound/`; Lockfile übernehmen. Verwendet werden u. a. esbuild, yaml und puppeteer-core. |
| Video-Pakete | `src/lib/interactive.mjs` bündelt die jeweiligen `src/render/main.js` und löst Pakete aus deren `node_modules` auf. Auch in den 20 in `site.config.json` ausgewählten Video-Projekten ist `npm ci` erforderlich; alle haben ein Lockfile. Lokale vorhandene Installationen ersetzen diesen Wiederherstellungsschritt nicht. |
| Externe Programme | Node/npm, ffmpeg, ffprobe, cwebp sowie Chrome sind auf diesem Rechner vorhanden. puppeteer-core bringt keinen Browser mit; bei abweichendem Standort `CHROME_PATH` setzen. Python 3 wird für Inventar/Statistik verwendet. |
| Caches | Die Audio-Cache-Schlüssel enthalten den absoluten Quellpfad. Am neuen Standort ist erneutes Transcodieren zu erwarten. `.cache`, `dist` und `node_modules` nicht importieren. |
| Absolute Web-Pfade | Im geprüften Web-Laufzeitcode keine fest verdrahteten alten Repo-Pfade gefunden. `README.md:21` enthält noch den alten `cd`-Pfad; nach dem bytegleichen Import als getrennte Dokumentationsänderung korrigieren. |
| Deployment | Weiterhin externer Keychain-Eintrag `kisound.ch-deploy`. Keine Secrets in Git übernehmen. Deploy wurde nicht getestet oder ausgeführt. |

Die Web-Quellen lesen zusätzlich `album.yml`, finale Prompts, WAVs, Cover,
Transkripte, Sprachvarianten, ASTRA-Analysen und die veröffentlichten URL-Tabellen
in `xx_youtube/` und `xx_soundcloud/`. Die Freigabe umfasst keine Änderung ihres
Veröffentlichungsstatus.

### Fehlende Voraussetzung in der bisherigen Build-Übergabe: Video-Assets

Folgende Dateien sind im neuen Arbeitsordner vorhanden, aber durch
`**/assets/lyrics/` bzw. `**/assets/audio/` ignoriert und nicht versioniert:

```text
videos/kisound/Network-Engineer-Album02/03_TrustSec/assets/lyrics/transcript.json
videos/kisound/Network-Engineer-Album02/03_TrustSec/assets/audio/analysis.json
videos/kisound/Network-Engineer-Album01/09-last-hop/assets/lyrics/transcript.json
videos/kisound/Network-Engineer-Album01/09-last-hop/assets/audio/analysis.json
```

`site.config.json` verlangt diese über `copy`; `src/lib/interactive.mjs:37`
kopiert sie, die Filme laden sie zur Laufzeit. **Ein frischer Checkout plus
Wiederherstellung der 44 inventarisierten Medien reicht allein nicht aus.**
In beiden genannten Video-Projekten vor dem Web-Build `npm run prepare-audio`
ausführen. Die vorhandenen `src/tools/prepare.mjs` prüfen die Quellmedien und
erzeugen die Dateien. Ergebnisse und allfällige Warnungen zum Beat-Raster prüfen;
der Review hat diese Analysen nicht neu berechnet. Alternativ müssen genau die
freigegebenen JSON-Dateien gezielt versioniert werden, inklusive korrekter
Ausnahmen für die ignorierten Elternverzeichnisse.

Ausserdem existieren 51 ignorierte lokale Set-Dateien in Album 01:

| Projekt | Dateien | Wiederherstellung |
| --- | ---: | --- |
| `00_Network_Engineers` | 21 | `npm run prepare` |
| `05_WiFi_Roaming` | 6 | `npm run prepare` |
| `09-last-hop` | 24 | `npm run sync-sets` |

Alle 51 sind bytegleich mit versionierten zentralen Dateien unter
`videos/kisound/assets/sets/`. Die ersten beiden Projekte haben einen npm-
`prepare`-Lifecycle-Hook; bei normalem `npm ci` wird er bereits ausgeführt.
Bei Installation mit `--ignore-scripts` muss er ausdrücklich nachgeholt werden.
Last Hop braucht den separaten `sync-sets`-Schritt. Der Web-Build stellt diese
lokalen Set-Kopien selbst nicht her. Vorhandene lokale Kopien können diese
fehlende Vorbereitung beim ersten Test verdecken.

### Schreibwirkung des Checks

`src/check.mjs:40–41` schreibt **die versionierte `audio-offsets.json`**.
Die bisherige Übergabe darf daher nicht als Zusage verstanden werden, dass
Build und Check zusammen ausschliesslich ignorierte Dateien verändern.
Zuerst den bytegleichen Import prüfen, danach den Check ausführen und einen
möglichen Offset-Diff als Messergebnis prüfen. Bei `rebuild_needed` erneut
bauen und den vollständigen Check wiederholen. Web-Codeänderungen sind dafür
nicht automatisch erforderlich.

## 2. Verbindliche Pfadzuordnung für Sessions

Basis ist jeweils `/Users/samuel.heinrich/0004_git/`:

| Alter Pfad relativ zur Basis | Neuer Pfad relativ zur Basis |
| --- | --- |
| `music/kisound` | `kisound/music/kisound` |
| `videos/kisound` | `kisound/videos/kisound` |
| `web/kisound` | `kisound/web/kisound` |

Unterpfade beibehalten, z. B. `Vibecoder/05_Hallucination`. Alle Session-CWDs
pauschal auf die Monorepo-Wurzel zu setzen würde relative Arbeitsbefehle verändern.
Repo-Gruppierung in der Oberfläche und Session-Arbeitsverzeichnis sind getrennte
Belange. Nur vollständige Pfadpräfixe an Verzeichnisgrenzen zuordnen.

Es gibt zusätzlich alte Codex-Verweise auf eine frühere Google-Drive-Kopie von
`0004_git/music/kisound`; auch sie müssen auf den neuen lokalen Musikpfad
abgebildet werden. Die genaue private Adresse steht im lokalen Inventar.

### Codex: nicht nur `cwd` in einer Datenbank

Untersucht: Codex CLI 0.162.1 und die tatsächlich vorhandenen lokalen Stores.

- `~/.codex/state_5.sqlite`: **19 relevante indexierte Threads**, davon 18
  im bisherigen lokalen Musikbaum und einer mit früherem CloudStorage-CWD.
  Track-Unterordner sind enthalten. Keine eigenen Web-/Video-CWDs gefunden.
- `~/.codex/sessions/`: **20 passende Rollout-JSONL-Dateien**, davon eine ohne
  zugehörigen Thread-Indexeintrag. Diese erhalten und separat prüfen; nicht
  löschen oder stillschweigend einen Datenbankeintrag erfinden.
- Alle 19 indexierten Threads verwenden `history_mode=paginated`.
  `~/.codex/thread_history_1.sqlite` enthält dazu 102 Turn-Einträge mit
  Rollout-Bytepositionen sowie 19 Projektionszustände. **Textersetzung in JSONL
  verschiebt diese Positionen. Nur `threads.cwd` zu ändern oder blind `sed`
  auszuführen ist deshalb keine vollständige Migration.**
- Zu prüfende strukturierte Felder: `session_meta.cwd`,
  `session_meta.runtime_workspace_roots[]`, `turn_context.cwd`,
  `turn_context.workspace_roots[]`,
  `turn_context.permission_profile.file_system.entries[].path.path`,
  `turn_context.file_system_sandbox_policy.entries[].path.path` und
  `threads.sandbox_policy`. Zwei Sandbox-Datensätze enthalten noch das frühere
  CloudStorage-Präfix. Rechte beim Umzug nicht ausweiten.
- `thread_turns.rollout_byte_offset`, `rollout_end_byte_offset` und
  `thread_history_projection_state.next_rollout_byte_offset` müssen zu den
  resultierenden Dateien passen. Auch abgeleitete `thread_items` und
  Echtzeitdaten prüfen. Eine unterstützte Neuzuordnung/Wiederaufnahme ist
  vorzuziehen; falls Offline-Rewriting nötig wird, muss es formatbewusst sein
  und alle abhängigen Projektionen konsistent halten. Hierfür wurde kein
  Migrationsprogramm ausgeführt oder als getestet freigegeben.
- `~/.codex/config.toml`: vorhandenen projektbezogenen Trust-Eintrag vom alten
  Musikpfad auf den neuen Musikpfad übertragen.
- `projects`/`project_roots` sind derzeit leer; `project_id` ist bei den
  betroffenen Threads null. In `.codex-global-state.json`, den geprüften
  Automations-CWDs und den üblichen VS Code/Cursor/VSCodium-Workspace-Stores
  wurden keine weiteren KISOUND-Zuordnungen gefunden. Beim Cutover neu prüfen.

Die lokale CLI bietet `codex resume --all`, `--include-non-interactive` und
`codex resume <ID> --cd <neuer-pfad>`. Das eignet sich zum gezielten
Wiederöffnen und Prüfen, belegt aber keine automatische vollständige Migration
aller bisherigen Metadaten. Allgemeine offizielle CLI-Dokumentation:
[Codex CLI](https://learn.chatgpt.com/docs/codex/cli).
Die obigen Datenbankdetails stammen aus der lokalen Untersuchung.

### Claude Code: Projektordner, Index, Memory und Dateiverlauf

Untersucht: Claude Code 2.1.296. **9 Hauptsessions plus 1 Subagent-Session**,
verteilt auf Musik (5 + 1) und Video (4). Dazu **10 Memory-Dateien** in zwei
getrennten Memory-Verzeichnissen. Kein eigener Web-Projektordner gefunden;
Web-Arbeiten sind in Musik- und Video-Verläufen enthalten.

Unter `~/.claude/projects/` gilt:

```text
-Users-samuel-heinrich-0004-git-music-kisound
  -> -Users-samuel-heinrich-0004-git-kisound-music-kisound
-Users-samuel-heinrich-0004-git-videos-kisound
  -> -Users-samuel-heinrich-0004-git-kisound-videos-kisound
```

- Vollständige Projektbäume mitnehmen: Haupt-JSONL, Session-Unterordner,
  `subagents`, `tool-results` und `memory`. Die beiden `MEMORY.md` nicht
  gegeneinander überschreiben.
- In `~/.claude.json` die entsprechenden `projects`-Schlüssel umschreiben,
  ihre Einstellungen und Session-IDs erhalten.
- `~/.claude/history.jsonl`: 116 passende `project`-Einträge in der Momentaufnahme,
  einschliesslich eines Musik-Album-Unterordners, zuordnen.
- Strukturierte `cwd`- und `trackingPath`-Felder prüfen. `trackingPath` enthält
  auch absolute Auto-Memory-Pfade unter dem alten codierten Projektordner.
- Bei `file-history-snapshot.snapshot.trackedFileBackups` sind teilweise
  **Objektschlüssel** absolute Pfade. Nur String-Werte umzuschreiben reicht
  nicht. Auch `file-history-delta`-Datensätze formatbewusst berücksichtigen.
- Session-/Parent-IDs erhalten; `~/.claude/file-history/<session-id>` bleibt
  nach Session-ID zugeordnet. Fremde Laufzeitmarker unter `~/.claude/sessions/`
  nicht ändern oder deren Prozesse beenden.

## 3. Ablauf für den Monorepo-Agenten

1. Web-Manifest unmittelbar vor dem Kopieren neu prüfen; 37 Dateien bytegleich
   importieren. Quellordner und deren uncommittierten Stand erhalten.
2. Medien wiederherstellen/verifizieren, Pakete in Web und 20 Video-Projekten
   installieren und die oben genannten Audio-/Set-Vorbereitungen ausführen.
   Dann `npm run build` und vollständiges `npm run check` im neuen Web-Ordner.
   Offset-Diff und erforderlichen Rebuild berücksichtigen.
3. Für den Session-Cutover alle schreibenden KISOUND-Sessions geordnet beenden,
   einschliesslich dieser Review-Session. Inventar danach aktualisieren.
   Vor Änderungen konsistente Backups der betroffenen SQLite-Stores und
   JSONL-/Konfigurations-/Memory-Dateien erstellen. Keine laufende SQLite-Datei
   allein ohne Berücksichtigung von WAL/SHM kopieren.
4. Session-Zuordnungen nach obiger Tabelle offline/mit geeigneter unterstützter
   Funktion umstellen; keine pauschale Ersetzung in Gesprächsinhalten,
   Git-URLs oder historischen Analyse-Provenienzen. Solche alten Pfade sind
   nicht automatisch aktive Abhängigkeiten. Vor Änderungen an JSON-Analysen
   deren vorhandene SHA-Verweise berücksichtigen.
5. Alle indexierten Session-IDs auf Vorhandensein prüfen, den zusätzlichen
   Rollout gesondert erhalten und einordnen. Claude-Hauptsessions, Subagenten,
   Memories und History-Zuordnungen nachzählen. Je Client mindestens eine alte
   lange Session und eine Session mit Unterordner-CWD öffnen; ältere Turns
   laden/paginieren, tatsächliches CWD und Dateizugriff am neuen Ort prüfen.
   Dateiverlauf nur prüfen, keine alte Dateiänderung testweise zurückspielen.
6. Erst nach erfolgreicher Prüfung neue Arbeitsordner aktiv verwenden und
   alte Ordner stilllegen. Bis dahin Rollback ermöglichen. Symlinks können
   vorübergehend Kompatibilität bieten, ersetzen aber die verlangte Umstellung
   der Session-Zuordnungen nicht.

## Nachweise und Grenzen

Die Bestandsaufnahme hat Quellcode, Manifest, Medieninventar, Paket-/Asset-
Abhängigkeiten und lokale Session-Strukturen gelesen. **Keine Session-Datei,
Datenbank oder Quelldatei wurde migriert; kein Web-Build oder Deploy ausgeführt.**
Die Session-Zahlen sind eine Momentaufnahme, da während des Reviews Sessions
aktiv waren. Das private Detailinventar mit IDs und konkreten Rollout-Pfaden
liegt ausschliesslich lokal (Dateimodus 0600):

```text
~/.codex/tmp/kisound-monorepo-review-20261013/session-inventory.json
```

Dieses Inventar und rohe Session-Stores nicht in Git aufnehmen. Die öffentliche
Übergabe enthält nur die für den Umzug benötigten Strukturinformationen.
