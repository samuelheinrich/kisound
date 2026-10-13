// Thin wrapper – the shared frame-accurate renderer lives in videos/kisound/tools/render.mjs
// Options: see the header of that file.
import { run } from '../../../../tools/render.mjs';
await run(new URL('../..', import.meta.url));
