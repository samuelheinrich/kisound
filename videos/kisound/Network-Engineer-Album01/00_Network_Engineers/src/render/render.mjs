// Shared local renderer: WebGL + title/status canvas -> FFmpeg.
import { run } from '../../../../tools/render.mjs';
await run(new URL('../..', import.meta.url));
