# Globaler kisound-Export, auch für künftige Projekte.
typeset -g KISOUND_RENDER_MODULE="${${(%):-%x}:A:h}/kisound-render.mjs"
function kisound-render() { command node "$KISOUND_RENDER_MODULE" "$@"; }
