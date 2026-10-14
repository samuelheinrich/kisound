// Shared frame-accurate renderer for all kisound videos (carried over from an earlier film project).
// Each film's src/render/render.mjs is a thin wrapper that calls run(<film root>).
//
// Pipeline (video):
//   page renders frame N (GPU) → composites WebGL + overlay canvas → raw RGBA via HTTP POST (no PNG, no base64)
//   → local server → ffmpeg stdin. While frame N is transferred/encoded, the page already renders frame N+1.
//   --jobs N runs N headless Chrome instances on frame ranges (ProRes segments via the Apple Media Engine),
//   then concatenates them and encodes once.
//
// Usage (from a film folder):
//   node src/render/render.mjs --width 1920 --height 1080 --mb 4 --audio output/x.wav --out output/x.mp4
//   options:
//     --encoder vt|x264|prores   vt = h264_videotoolbox (hardware, fast), x264 = libx264 (best quality/size),
//                                 prores = ProRes 422 HQ .mov via videotoolbox (master/intermediate)
//     --q 80                      VideoToolbox quality (1–100)          --crf 14 / --preset slow   x264 settings
//     --jobs 2                    parallel Chrome instances (segments are ProRes, final pass uses --encoder)
//     --master output/x.mov       keep the concatenated ProRes master
//     --from/--to <frame>         frame range     --capture png   legacy screenshot capture
//     --stills 1,2.5 --dir d      single PNG stills (screenshots)
import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav' };

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) { const v = argv[i + 1]; a[argv[i].slice(2)] = v && !v.startsWith('--') ? v : true; }
  return a;
}

// static server for the film + endpoint receiving raw frames
function createServer(root, onFrame) {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const u = new URL(req.url, 'http://x');
      if (req.method === 'POST' && u.pathname === '/__frame') {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', async () => {
          try { await onFrame(+u.searchParams.get('job'), +u.searchParams.get('f'), Buffer.concat(chunks)); res.writeHead(204); res.end(); }
          catch (e) { res.writeHead(500); res.end(String(e)); }
        });
        return;
      }
      const p = decodeURIComponent(u.pathname);
      const f = path.join(root, p === '/' ? '/src/render/index.html' : p);
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(p === '/favicon.ico' ? 204 : 404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(res);
    });
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

const COLOR = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];
const toYUV = (fmt) => ['-vf', `scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=accurate_rnd+full_chroma_int,format=${fmt}`];
function videoCodecArgs(enc, a, W) {
  if (enc === 'vt') return [...toYUV('yuv420p'), '-c:v', 'h264_videotoolbox', '-q:v', String(a.q || 80), '-profile:v', 'high', '-allow_sw', '0', ...COLOR];
  if (enc === 'prores') return [...toYUV('p210le'), '-c:v', 'prores_videotoolbox', '-profile:v', 'hq', ...COLOR];
  return [...toYUV('yuv420p'), '-c:v', 'libx264', '-preset', String(a.preset || 'medium'), '-crf', String(a.crf || (W >= 3840 ? 14 : 16)),
    '-profile:v', 'high', '-tune', 'film', '-x264-params', 'aq-mode=3:deblock=-1,-1:colorprim=bt709:transfer=bt709:colormatrix=bt709', ...COLOR];
}
const audioArgs = (audio, fromSec) => (audio ? { input: ['-ss', String(fromSec), '-i', audio], codec: ['-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-shortest'] } : { input: [], codec: [] });

function ffmpeg(args, label) {
  const proc = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: ['pipe', 'inherit', 'inherit'] });
  proc.done = new Promise((res, rej) => proc.on('error', rej).on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg (${label}) exit ${c}`)))));
  proc.done.catch(() => {}); // handled below; avoid an early unhandled rejection
  proc.stdin.on('error', () => {});
  return proc;
}

// injected into the page: render → composite → POST, pipelined by one frame
const CAPTURE = async (from, to, job, W, H) => {
  const layers = [...document.querySelectorAll('#stage canvas')];
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true, alpha: false });
  let pending = null;
  for (let f = from; f < to; f++) {
    window.renderFrame(f);
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    for (const l of layers) g.drawImage(l, 0, 0);
    const data = g.getImageData(0, 0, W, H).data;
    if (pending) { const r = await pending; if (!r.ok) throw new Error('frame upload failed ' + r.status); }
    // Blob bodies take Chrome's fast upload path (~30 ms for 8 MB vs ~300 ms for a typed array)
    pending = fetch(`/__frame?job=${job}&f=${f}`, { method: 'POST', body: new Blob([data]) });
  }
  if (pending) { const r = await pending; if (!r.ok) throw new Error('final frame upload failed ' + r.status); }
  return true;
};

export async function run(filmRootUrl) {
  const root = path.resolve(fileURLToPath(filmRootUrl));
  const a = parseArgs(process.argv.slice(2));
  const W = +(a.width || 1920), H = +(a.height || 1080), MB = +(a.mb || 1);
  const CHROME = a.chrome || process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const { default: puppeteer } = await import(pathToFileURL(path.join(root, 'node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js')).href);

  const browsers = new Set(), closing = new WeakSet(), encoders = new Set();
  let tick, tmp, stopping = false;
  const closeBrowser = async (browser) => {
    if (closing.has(browser)) return;
    closing.add(browser);
    const timer = setTimeout(() => {
      const proc = browser.process();
      try { process.kill(-proc.pid, 'SIGKILL'); } catch { try { proc.kill('SIGKILL'); } catch {} }
    }, 4000);
    try { await browser.close(); } catch {} finally { clearTimeout(timer); }
  };
  const cleanup = async () => {
    clearInterval(tick);
    await Promise.all([...browsers].map(closeBrowser));
    for (const proc of encoders) if (proc.exitCode === null && proc.signalCode === null) {
      proc.stdin.destroy(); proc.kill('SIGTERM');
      const timer = setTimeout(() => proc.kill('SIGKILL'), 2000);
      try { await proc.done; } catch {} finally { clearTimeout(timer); }
    }
    srv.closeAllConnections(); srv.close();
  };
  const signalStop = () => {
    if (stopping) return; stopping = true;
    cleanup().finally(() => process.exit(130));
  };
  const encode = (args, label) => { const proc = ffmpeg(args, label); encoders.add(proc); return proc; };
  const sinks = new Map(); // job → ffmpeg process
  let received = 0;
  const onFrame = async (job, f, buf) => {
    if (buf.length !== W * H * 4) throw new Error(`frame ${f}: ${buf.length} bytes, expected ${W * H * 4}`);
    const proc = sinks.get(job);
    if (!proc || proc.stdin.destroyed) throw new Error('Frame encoder is no longer available');
    await new Promise((resolve, reject) => proc.stdin.write(buf, error => error ? reject(error) : resolve()));
    received++;
  };
  const srv = await createServer(root, onFrame);
  const base = `http://127.0.0.1:${srv.address().port}`;
  process.on('SIGINT', signalStop); process.on('SIGTERM', signalStop);
  try {

  const openPage = async () => {
    const browser = await puppeteer.launch({
      executablePath: CHROME, headless: true, protocolTimeout: 0,
      args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-gpu-driver-bug-workarounds', `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--hide-scrollbars', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
    });
    browsers.add(browser);
    browser.process()?.on('exit', (code, signal) => console.error(`[chrome-exit] pid=${browser.process()?.pid} code=${code} signal=${signal} intentional=${closing.has(browser)}`));
    browser.on('disconnected', () => console.error(`[chrome-disconnected] intentional=${closing.has(browser)}`));
    const page = await browser.newPage();
    page.on('error', e => console.error('[page-crash]', e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) console.log('[page]', m.text()); });
    page.on('pageerror', (e) => console.log('[pageerror]', e.message));
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await page.goto(`${base}/?w=${W}&h=${H}&mb=${MB}${a.lang ? `&lang=${encodeURIComponent(a.lang)}` : ''}`, { waitUntil: 'load' });
    await page.waitForFunction('window.__ready || window.__error', { timeout: 120000 });
    const err = await page.evaluate('window.__error');
    if (err) throw new Error(err);
    return { browser, page };
  };

  // ---------------------------------------------------------------- stills (screenshots)
  if (a.stills) {
    const { browser, page } = await openPage();
    const dir = path.resolve(root, a.dir || 'output/stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of String(a.stills).split(',').map(Number)) {
      await page.evaluate((v) => window.renderTime(v), t);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const f = path.join(dir, `still_${t.toFixed(2).padStart(6, '0')}s_${W}x${H}.png`);
      fs.writeFileSync(f, await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } }));
      console.log('wrote', f);
    }
    await closeBrowser(browser); srv.close();
    return;
  }

  // ---------------------------------------------------------------- video
  const probe = await openPage();
  const { FPS, FRAMES } = await probe.page.evaluate('window.FILM');
  const from = +(a.from || 0), to = Math.min(FRAMES, +(a.to || FRAMES));
  const jobs = Math.max(1, Math.min(+(a.jobs || 1), 4));
  const enc = a.encoder || 'x264';
  const out = path.resolve(root, a.out || 'output/render.mp4');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const audio = a.audio ? path.resolve(root, a.audio) : null;
  const segmented = jobs > 1 || !!a.master;
  const rawIn = ['-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-'];
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'film-render-'));
  const t0 = Date.now(), total = to - from;
  tick = setInterval(() => {
    const el = (Date.now() - t0) / 1000, fps = received / Math.max(el, 1e-3);
    process.stdout.write(`\rframe ${received}/${total}  ${fps.toFixed(2)} fps  ETA ${((total - received) / Math.max(fps, 1e-3) / 60).toFixed(1)} min   `);
  }, 1000);

  // frame ranges per job
  const ranges = [];
  for (let j = 0; j < jobs; j++) ranges.push([from + Math.round((total * j) / jobs), from + Math.round((total * (j + 1)) / jobs)]);
  const segs = ranges.map((_, j) => path.join(tmp, `seg_${j}.mov`));
  const procs = ranges.map((r, j) => {
    if (!segmented) {
      const au = audioArgs(audio, from / FPS);
      return encode([...rawIn, ...au.input, ...videoCodecArgs(enc, a, W), ...au.codec, '-movflags', '+faststart', out], 'encode');
    }
    return encode([...rawIn, ...videoCodecArgs('prores', a, W), segs[j]], `segment ${j}`);
  });
  procs.forEach((p, j) => { sinks.set(j, p); encoders.add(p); });

  // render all jobs in parallel (job 0 reuses the probe instance)
  const instances = [probe, ...(await Promise.all(ranges.slice(1).map(() => openPage())))];
  const capturing = Promise.all(instances.map(async ({ page }, j) => {
    await page.evaluate(`window.__capture = ${CAPTURE.toString()}`);
    await page.evaluate((r0, r1, job, w, h) => window.__capture(r0, r1, job, w, h), ranges[j][0], ranges[j][1], j, W, H);
    procs[j].stdin.end();
  }));
  await Promise.all([capturing, ...procs.map((p) => p.done)]);
  clearInterval(tick);
  await Promise.all(instances.map(({ browser }) => closeBrowser(browser)));
  srv.close();
  const renderSec = (Date.now() - t0) / 1000;
  process.stdout.write(`\rframes ${received}/${total} rendered in ${(renderSec / 60).toFixed(1)} min (${(received / renderSec).toFixed(2)} fps)          \n`);

  if (segmented) {
    // concatenate ProRes segments (lossless copy), optionally keep as master, then one final encode
    const list = path.join(tmp, 'list.txt');
    fs.writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
    let src = ['-f', 'concat', '-safe', '0', '-i', list];
    if (a.master) {
      const master = path.resolve(root, a.master);
      await encode([...src, '-c', 'copy', ...COLOR, master], 'master').done;
      console.log('wrote master', master);
      src = ['-i', master];
    }
    if (!(enc === 'prores' && a.master)) {
      const t1 = Date.now();
      const au = audioArgs(audio, from / FPS);
      const vargs = videoCodecArgs(enc, a, W).map((v) => v.replace('in_range=full', 'in_range=tv'));
      await encode(['-color_range', 'tv', ...src, ...au.input, '-map', '0:v', ...(audio ? ['-map', '1:a'] : []), ...vargs, ...au.codec, '-movflags', '+faststart', out], 'final encode').done;
      console.log(`final encode ${((Date.now() - t1) / 1000).toFixed(0)} s`);
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('wrote', out);
  } finally {
    await cleanup();
    process.off('SIGINT', signalStop); process.off('SIGTERM', signalStop);
  }
}
