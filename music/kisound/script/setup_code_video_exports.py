#!/usr/bin/env python3
"""Install global kisound-render, connect existing npm scripts, never render a video.
Default: preflight only. --apply installs after successful checks.
"""
import argparse
import datetime
import json
import os
from pathlib import Path
import shlex
import subprocess
import tarfile
import tempfile

MARKER = '<!-- global-kisound-render -->'
RECOVERY_MARKER = '<!-- kisound-render-checkpoints -->'
RECOVERY_END = '<!-- /kisound-render-checkpoints -->'
RECOVERY_GUIDE = '''

<!-- kisound-render-checkpoints -->
### Wiederaufnahme nach einem Chrome-Abbruch

Der globale Export rendert standardmässig in Abschnitten von 20 Sekunden mit einem
Chrome-Prozess. Jeder Abschnitt wird geprüft und als Checkpoint gespeichert. Chrome
startet für jeden Abschnitt neu. Ein fehlgeschlagener Abschnitt wird bis zu zweimal
wiederholt. Bildnummern beziehen sich stets auf die gesamte Timeline.

Nach einem Abbruch den ausgegebenen Arbeitsordner verwenden, von jedem Ordner aus:

```sh
kisound-render --resume "/Pfad/zum/kisound-export-ABC123"
```

Optional zuerst `--check` ergänzen. Bei `--resume` weder `4k`/`1080p` noch neue
Renderparameter angeben: Einstellungen, Song und Ausgabe stammen aus dem Checkpoint.
Geprüfte Abschnitte werden übernommen; beschädigte Abschnitte werden erneut gerendert.
`--check` prüft Quellen/Einstellungen, aber decodiert keine Abschnitte.
Änderungen an Quellcode, Assets oder Renderer verhindern die Wiederaufnahme; dann einen
neuen Export starten. Während eines Exports die Projektdateien nicht bearbeiten.

Neue Exporte erlauben `--chunk-seconds 5..60` (Standard 20) und `--retries 0..5`
(Standard 2). `--jobs 1` ist nun für beide Auflösungen Standard. Beispiel:

```sh
kisound-render 4k --chunk-seconds 10
```

Fertige Abschnitte werden ohne erneute Bildcodierung zusammengefügt. Das Originalaudio
wird einmal vollständig eingebettet. Bildzahl, FPS, Auflösung, Audiodauer und vollständige
Videodecodierung werden vor der Ausgabe geprüft. Fehlerlogs enthalten Browser-Abbruch-
ereignisse, soweit Chrome diese noch meldet. Nach Erfolg wird der Arbeitsordner gelöscht,
mit `--keep-temp` bleibt er erhalten. Bei Fehlern bleibt er immer erhalten. Er kann gross
werden; `--temp-dir` wählt bei neuen Exporten einen anderen lokalen Datenträger.

Die Wiederaufnahme benötigt `checkpoint.json` aus dieser Version. Alte abgebrochene
Exporte ohne Checkpoint, beispielsweise `kisound-export-Rf2zLF`, müssen neu gestartet
werden. Ihre Dateien bleiben unberührt. Die Änderung verhindert nicht jede mögliche
GPU-/Chrome-Störung, begrenzt aber den verlorenen Fortschritt auf einen Abschnitt.

Neue Szenen müssen `renderFrame(n)` auch direkt mit beliebigen absoluten Bildnummern
aufrufen können. Animationen müssen aus der Zeit berechnet werden, ohne vom zuletzt
gerenderten Frame abzuhängen. Quellprüfsummen umfassen `src/`, `assets/`, Audio,
JSON-/Code-Dateien im Projektstamm (inklusive Audioanalyse), Konfiguration,
Paket-/Lockdateien sowie die gemeinsamen Renderer. Externe dynamische
Ressourcen oder manuelle Änderungen in `node_modules` sind damit nicht abgesichert.
<!-- /kisound-render-checkpoints -->
''' 
GUIDE = '''

<!-- global-kisound-render -->
## Globaler Videoexport: bestehende und neue Projekte

In jedem fertig eingerichteten Songordner (auch in dessen Unterordnern):

```sh
kisound-render 1080p
```

oder:

```sh
kisound-render 4k
```

Nur prüfen, ohne einen Render zu starten:

```sh
kisound-render 4k --check
```

Ein beliebiges Projekt von einem anderen Ordner aus wählen:

```sh
kisound-render 4k --project "/Pfad/zum/Video-Song" --check
```

Der globale Befehl braucht keine neuen npm-Einträge pro Song. Er findet den Projektordner
an `src/render/index.html` und `src/render/render.mjs`. Er übernimmt eine vorhandene
`render-export.json`; ohne diese Datei erkennt er genau eine Audiodatei in `assets/audio`.
Bei mehreren Fassungen muss die Quelle eindeutig gewählt werden:

```sh
kisound-render 4k --audio "assets/audio/finale.wav"
```

Die Quelle wird nicht geändert. Bildrate und Bildzahl stammen aus dem Film. Auflösungen:
1920 × 1080 oder 3840 × 2160. Standardmässig erhält jeder Export im Song-Unterordner `output/`
einen Zeitstempel sowie ein Log und einen JSON-Prüfbericht. Bestehende Dateien werden nicht
überschrieben. Optional sind `--out`, `--jobs`, `--encoder`, `--crf`, `--chrome` und `--temp-dir`.
Details: `kisound-render --help` und das zentrale `tools/export-video.mjs`.

Neue Projekte müssen die vorhandene kisound-Renderer-Schnittstelle verwenden: lokale
Node-Abhängigkeiten inklusive `puppeteer-core`, `#stage`-Canvas, `window.renderFrame`,
`window.FILM`, `window.__ready`/`window.__error`, sowie `FPS`, `FRAMES`, `DURATION` im
Timeline-Modul. Ein Ordner mit nur Analyse/Lyrics lässt sich noch nicht als Video rendern.
Abweichende Pfade und Titel/Interpret können in `render-export.json` konfiguriert werden.

Für vorhandene, bei der Einrichtung gefundene Projekte funktionieren zusätzlich
`npm run export:1080p`, `npm run export:4k` und `npm run export:check -- --resolution 4k`.
Bei künftigen Projekten direkt `kisound-render` verwenden oder die Einrichtung erneut starten,
um auch die optionalen npm-Kurzbefehle hinzuzufügen. Der globale Befehl ist eine zsh-Funktion;
neue Terminalfenster laden sie aus `.zshrc`. Das Einrichtungsprogramm zeigt den `source`-Befehl
für das bereits offene Terminal. Es startet selbst nie einen Videoexport.
'''

def discover(root):
    return sorted(
        p.parent.parent.parent for album in root.iterdir() if album.is_dir() and not album.name.startswith(('.', '_'))
        for p in album.glob('*/src/render/index.html') if (p.parent / 'render.mjs').is_file()
    )

def plan_changes(root, projects, zshrc):
    source = Path(__file__).with_name('kisound-render.mjs')
    global_js = root / 'tools/kisound-render.mjs'
    shell_file = root / 'tools/kisound-render.zsh'
    changes = {global_js: source.read_bytes(), shell_file: (
        '# Globaler kisound-Export, auch für künftige Projekte.\n'
        f'function kisound-render() {{ command node {shlex.quote(str(global_js))} "$@"; }}\n'
    ).encode()}
    for name in ('export-video.mjs', 'render-checkpoints.mjs', 'render.mjs'):
        changes[root / 'tools' / name] = Path(__file__).with_name(name).read_bytes()
    for project in projects:
        package_file = project / 'package.json'
        if not package_file.is_file():
            continue
        data = json.loads(package_file.read_text())
        relative = os.path.relpath(global_js, project)
        command = 'node ' + shlex.quote(relative)
        data.setdefault('scripts', {}).update({
            'export:1080p': command + ' 1080p',
            'export:4k': command + ' 4k',
            'export:check': command + ' --check',
        })
        changes[package_file] = (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode()
    for readme in [root / 'README.md', *(p / 'README.md' for p in projects)]:
        text = readme.read_text() if readme.exists() else '# Video-Projekt\n'
        if MARKER not in text:
            text = text.rstrip() + GUIDE
        if RECOVERY_MARKER in text:
            start = text.index(RECOVERY_MARKER)
            end = text.index(RECOVERY_END, start) + len(RECOVERY_END)
            text = text[:start].rstrip() + RECOVERY_GUIDE + text[end:].lstrip('\n')
        else:
            text = text.rstrip() + RECOVERY_GUIDE
        changes[readme] = text.encode()
    shell_text = zshrc.read_text() if zshrc.exists() else ''
    source_line = 'source ' + shlex.quote(str(shell_file))
    if source_line not in shell_text.splitlines():
        changes[zshrc] = (shell_text.rstrip() + '\n\n# kisound: globaler Musikvideo-Export\n' + source_line + '\n').encode()
    return {p: b for p, b in changes.items() if not p.exists() or p.read_bytes() != b}, source_line

def check(root, projects):
    source = Path(__file__).with_name('kisound-render.mjs')
    env = {**os.environ, 'KISOUND_EXPORT_MODULE': str(Path(__file__).with_name('export-video.mjs').resolve())}
    for project in projects:
        for resolution in ('1080p', '4k'):
            print(f'Prüfe {project.relative_to(root)}: {resolution}', flush=True)
            subprocess.run(['node', str(source), resolution, '--project', str(project), '--check'],
                           env=env, check=True)

def apply(root, changes):
    if not changes:
        print('Bereits eingerichtet. Keine Änderungen nötig.')
        return
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    archive = root / '_revisions' / f'global-export-setup-{stamp}.tar.gz'
    archive.parent.mkdir(parents=True, exist_ok=True)
    originals = {p: p.read_bytes() if p.exists() else None for p in changes}
    with tarfile.open(archive, 'x:gz') as tar:
        for file in changes:
            if file.exists():
                name = str(file.relative_to(root)) if file.is_relative_to(root) else 'shell/zshrc'
                tar.add(file, arcname=name)
    written = []
    try:
        for file, content in changes.items():
            file.parent.mkdir(parents=True, exist_ok=True)
            fd, name = tempfile.mkstemp(prefix='.kisound-setup-', dir=file.parent)
            try:
                with os.fdopen(fd, 'wb') as out:
                    out.write(content)
                os.chmod(name, file.stat().st_mode & 0o777 if file.exists() else 0o644)
                os.replace(name, file)
                written.append(file)
            finally:
                Path(name).unlink(missing_ok=True)
    except Exception:
        for file in reversed(written):
            if originals[file] is None:
                file.unlink(missing_ok=True)
            else:
                file.write_bytes(originals[file])
        raise
    print(f'Vorheriger Zustand gesichert: {archive}')
    for file in changes:
        print(f'Aktualisiert: {file}')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--video-root', type=Path,
                        default=Path(__file__).resolve().parents[3] / 'videos/kisound')
    parser.add_argument('--zshrc', type=Path, default=Path(os.environ.get('ZDOTDIR', Path.home())) / '.zshrc')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    root = args.video_root.resolve()
    if not (root / 'tools/export-video.mjs').is_file():
        raise RuntimeError(f'Gemeinsamer Exporter fehlt: {root}')
    projects = discover(root)
    if not projects:
        raise RuntimeError('Keine fertigen Video-Projekte gefunden.')
    changes, source_line = plan_changes(root, projects, args.zshrc.expanduser().resolve())
    check(root, projects)
    print(f'{len(projects) * 2} Prüfungen bestanden; {len(changes)} Dateiänderungen vorbereitet.')
    if args.apply:
        apply(root, changes)
        print('\nIm offenen Terminal einmal ausführen:\n' + source_line)
        print('\nDanach in jedem Songordner: kisound-render 4k')
    else:
        print('Noch nichts installiert. Zum Einrichten denselben Befehl mit --apply ausführen.')
    print('Kein Video gerendert.')

if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, OSError, ValueError, subprocess.CalledProcessError) as error:
        raise SystemExit(f'Einrichtung fehlgeschlagen: {error}')
