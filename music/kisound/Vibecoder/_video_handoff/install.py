#!/usr/bin/env python3
"""Copy the prepared album into the video workspace without replacing files."""
import argparse
import hashlib
from pathlib import Path
import shutil

SOURCE = Path(__file__).resolve().parent / 'Vibecoder'
DEFAULT_DESTINATION = Path(__file__).resolve().parents[4] / 'videos' / 'kisound' / 'Vibecoder'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=DEFAULT_DESTINATION)
    parser.add_argument('--check', action='store_true', help='Only compare destination and show the planned copy.')
    args = parser.parse_args()
    destination = args.destination.expanduser().resolve()
    files = sorted(p for p in SOURCE.rglob('*') if p.is_file())
    directories = [SOURCE] + sorted(p for p in SOURCE.rglob('*') if p.is_dir())
    conflicts = []
    for directory in directories:
        target = destination / directory.relative_to(SOURCE)
        if target.exists() and not target.is_dir():
            conflicts.append(str(target))
    for path in files:
        target = destination / path.relative_to(SOURCE)
        if target.exists() and (not target.is_file() or sha(path) != sha(target)):
            conflicts.append(str(target))
    if conflicts:
        raise SystemExit('Vorhandene abweichende Dateien bleiben erhalten. Kopie abgebrochen:\n' + '\n'.join(conflicts))
    missing = [p for p in files if not (destination / p.relative_to(SOURCE)).exists()]
    print(f'Ziel: {destination}\nNeue Dateien: {len(missing)}; bereits identisch: {len(files)-len(missing)}')
    if args.check:
        print('Prüflauf: keine Dateien oder Ordner geschrieben.')
        return
    for directory in directories:
        (destination / directory.relative_to(SOURCE)).mkdir(parents=True, exist_ok=True)
    for path in missing:
        target = destination / path.relative_to(SOURCE)
        # Exclusive creation also protects against a file appearing after preflight.
        with path.open('rb') as source, target.open('xb') as output:
            shutil.copyfileobj(source, output)
    print('Drehbuch, Sprachfassungen und Platzhalterstruktur übertragen.')

if __name__ == '__main__':
    main()
