#!/usr/bin/env python3
"""Record the local audio and licence files required alongside this source repo."""

import argparse
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MUSIC = ROOT / "music" / "kisound"
MANIFEST = ROOT / "media-inventory.tsv"
MEDIA_EXTENSIONS = {".wav", ".mp3", ".flac", ".m4a", ".pdf"}
DELIVERY_DIRS = {"xx_mp3", "xx_flac", "xx_youtube", "xx_soundcloud", "xx_telegram"}


def digest(path: Path) -> str:
    sha = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(4 * 1024 * 1024), b""):
            sha.update(chunk)
    return sha.hexdigest()


def inventory() -> str:
    lines = ["path\tbytes\tsha256"]
    for path in sorted(MUSIC.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in MEDIA_EXTENSIONS:
            continue
        relative = path.relative_to(ROOT)
        if any(part in DELIVERY_DIRS for part in relative.parts):
            continue
        lines.append(f"{relative.as_posix()}\t{path.stat().st_size}\t{digest(path)}")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="compare local media with the recorded inventory")
    args = parser.parse_args()
    current = inventory()
    if args.check:
        if not MANIFEST.exists() or MANIFEST.read_text() != current:
            print("Media inventory differs from local files: regenerate with tools/media_inventory.py")
            return 1
        print(f"Verified {len(current.splitlines()) - 1} local media files")
        return 0
    MANIFEST.write_text(current)
    print(f"Recorded {len(current.splitlines()) - 1} local media files in {MANIFEST.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
