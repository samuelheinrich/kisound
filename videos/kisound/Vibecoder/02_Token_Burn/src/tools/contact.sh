#!/bin/zsh
# Renders the middle of every shot for one version and builds contact sheets of 8 frames:
# src/tools/contact.sh de|en [outdir]
L=${1:-de};O=${2:-output/qa/contact-$L}
T=$(TOKEN_BURN_LANG=$L node --input-type=module -e "import('./src/render/config.js').then(m=>console.log(m.SHOTS.map(s=>((s.start+s.end)/2).toFixed(2)).join(' ')))")
rm -rf $O;node src/tools/stills.mjs --lang $L --out $O --w 640 ${=T} >/dev/null || exit 1
F=($O/$L-*.png);i=0;while (( i < ${#F} ));do python3 src/tools/sheet.py $O/sheet-$((i/8+1)).png ${F[@]:$i:8};i=$((i+8));done
ls $O/sheet-*.png
