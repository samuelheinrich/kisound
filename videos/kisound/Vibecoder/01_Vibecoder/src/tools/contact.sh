#!/usr/bin/env bash
# Contact sheets from the browser QA shots. Requires ImageMagick.
set -euo pipefail
lang="${1:-}"
if [[ "$lang" != de && "$lang" != en ]]; then
  echo 'Aufruf: src/tools/contact.sh de|en' >&2
  exit 2
fi
root="$(cd "$(dirname "$0")/../.." && pwd)"
source_dir="$root/output/qa/browser-$lang"
target_dir="$root/output/qa/contact-$lang"
mkdir -p "$target_dir"
for first in 1 25 49; do
  files=()
  for ((n=first; n<first+24; n++)); do
    printf -v id 'S%03d' "$n"
    file="$source_dir/$id.png"
    [[ -f "$file" ]] || { echo "Standbild fehlt: $file" >&2; exit 1; }
    files+=("$file")
  done
  magick montage -label '%t' "${files[@]}" -font "$root/assets/fonts/SpaceGrotesk.ttf" \
    -pointsize 16 -background '#10141c' -fill white -geometry 320x180+4+14 -tile 6x4 \
    "$target_dir/$(printf 'shots-%03d-%03d.jpg' "$first" "$((first+23))")"
done
echo "$target_dir"
