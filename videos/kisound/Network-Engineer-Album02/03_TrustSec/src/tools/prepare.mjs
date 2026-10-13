// Prepares everything the film reads from the music repository (run once, and again whenever the release WAV or
// the transcript changes):
//   1. checks that the transcript belongs to this exact release WAV (filename and sha256)
//   2. assets/audio/trustsec.wav     byte-identical release WAV – the player's master clock and the render's audio
//   3. assets/lyrics/transcript.json copy of the timed transcript
//   4. assets/audio/analysis.json    beat grid + per-frame envelopes (full / low / high band) + kick onsets
// The analysis is computed here once, not live in the browser, so every frame stays a pure function of t.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { FPS, DURATION, GRID } from '../render/config.js';
import { classify } from '../render/timeline.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// Source of truth: the track folder in this repository (music/kisound/…)
const SOURCE = path.resolve(root, '../../../../music/kisound/Network-Engineer-Album02/03_TrustSec');
const RELEASE_WAV = path.join(SOURCE, '03_TrustSec_1.0.wav');
const TRANSCRIPT = path.join(SOURCE, '03_TrustSec_Transkript.json');
const OUT_WAV = path.join(root, 'assets/audio/trustsec.wav');
const OUT_ANALYSIS = path.join(root, 'assets/audio/analysis.json');
const OUT_TRANSCRIPT = path.join(root, 'assets/lyrics/transcript.json');

const SR = 12000; // analysis sample rate (mono)

function run(args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], { stdio: ['ignore', capture ? 'pipe' : 'inherit', 'inherit'] });
    const chunks = [];
    if (capture) p.stdout.on('data', (c) => chunks.push(c));
    p.on('close', (c) => (c === 0 ? resolve(capture ? Buffer.concat(chunks) : null) : reject(new Error(`ffmpeg exit ${c}`))));
  });
}
async function decode(filter) {
  const buf = await run(['-i', OUT_WAV, '-ac', '1', '-ar', String(SR), ...(filter ? ['-af', filter] : []), '-f', 'f32le', '-'], { capture: true });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}
const pct = (arr, p) => { const s = Float64Array.from(arr).sort(); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

// RMS per video frame → dB → 0..255, normalised between the 2nd and 99.5th percentile
function envelope(x) {
  const hop = SR / FPS, n = Math.ceil(DURATION * FPS), db = new Float64Array(n);
  for (let f = 0; f < n; f++) {
    let s = 0; const a = Math.round(f * hop), b = Math.min(x.length, Math.round((f + 1) * hop));
    for (let i = a; i < b; i++) s += x[i] * x[i];
    db[f] = 10 * Math.log10(s / Math.max(1, b - a) + 1e-12);
  }
  const lo = pct(db, 0.02), hi = pct(db, 0.995);
  return Array.from(db, (v) => Math.round(255 * Math.min(1, Math.max(0, (v - lo) / (hi - lo)))));
}

// onset strength: half-wave rectified change of log energy, hop 1/400 s
function onsets(x, hopS = 1 / 400) {
  const hop = Math.round(SR * hopS), n = Math.floor(x.length / hop), e = new Float64Array(n), o = new Float64Array(n);
  for (let k = 0; k < n; k++) { let s = 0; for (let i = k * hop; i < (k + 1) * hop; i++) s += x[i] * x[i]; e[k] = Math.log10(s / hop + 1e-9); }
  for (let k = 1; k < n; k++) o[k] = Math.max(0, e[k] - e[k - 1]);
  return { o, rate: SR / hop };
}
const at = (o, i) => { const j = Math.floor(i), f = i - j; return j + 1 < o.length && j >= 0 ? o[j] * (1 - f) + o[j + 1] * f : 0; };

// comb search: tempo and phase that put the most onset energy on the beat grid
function combScore(o, rate, bpm, phaseSteps) {
  const P = (60 / bpm) * rate; let best = [-1, 0];
  for (let q = 0; q < phaseSteps; q++) {
    const ph = (q / phaseSteps) * P; let s = 0, n = 0;
    for (let i = ph; i < o.length; i += P) { s += at(o, i); n++; }
    s /= n; // mean, not sum – a sum favours faster tempi (more beats)
    if (s > best[0]) best = [s, ph / rate];
  }
  return best;
}
function tempo(o, rate) {
  let best = { bpm: 0, score: -1, phase: 0 };
  for (let b = 110; b <= 170; b += 0.1) { const [s, ph] = combScore(o, rate, b, 48); if (s > best.score) best = { bpm: b, score: s, phase: ph }; }
  const c = best.bpm;
  for (let b = c - 0.15; b <= c + 0.15; b += 0.002) { const [s, ph] = combScore(o, rate, b, 400); if (s > best.score) best = { bpm: b, score: s, phase: ph }; }
  return best;
}
// local phase error of the global grid per window of 16 beats (ms) – shows whether the grid drifts
function drift(o, rate, bpm, phase) {
  const beat = 60 / bpm, out = [];
  for (let w = phase; w + 16 * beat < o.length / rate; w += 16 * beat) {
    let best = [-1, 0];
    for (let d = -0.04; d <= 0.04; d += 0.001) {
      let s = 0; for (let k = 0; k < 16; k++) s += at(o, (w + d + k * beat) * rate);
      if (s > best[0]) best = [s, d];
    }
    out.push({ t: +w.toFixed(2), ms: Math.round(best[1] * 1000), strength: +(best[0] / 16).toFixed(3) });
  }
  return out;
}
// kick onsets: per grid beat the strongest low-band onset within ±80 ms (the rolling bass between the beats is
// ignored). Beats without a clear onset (breakdowns) get no kick. Exact audio time, not the grid time.
function kicks(o, rate, bpm, phase) {
  const beat = 60 / bpm, w = Math.round(0.08 * rate), cand = [];
  for (let t = phase; t < o.length / rate; t += beat) {
    const c = Math.round(t * rate); let m = -1, mi = c;
    for (let i = Math.max(1, c - w); i <= Math.min(o.length - 2, c + w); i++) if (o[i] > m) { m = o[i]; mi = i; }
    cand.push([mi / rate, m]);
  }
  const thr = Math.max(0.08, pct(cand.map((c) => c[1]), 0.5) * 0.35);
  return cand.filter((c) => c[1] > thr).map((c) => +c[0].toFixed(3));
}

async function main() {
  for (const f of [RELEASE_WAV, TRANSCRIPT]) if (!fs.existsSync(f)) throw new Error(`fehlt: ${f}`);
  const transcript = JSON.parse(fs.readFileSync(TRANSCRIPT, 'utf8'));
  const sha = crypto.createHash('sha256').update(fs.readFileSync(RELEASE_WAV)).digest('hex');
  if (transcript.source_audio !== path.basename(RELEASE_WAV) || transcript.source_audio_sha256 !== sha)
    throw new Error(`Transkript passt nicht zur Release-WAV (sha256 ${sha} ≠ ${transcript.source_audio_sha256})`);
  if (Math.abs((transcript.duration_seconds ?? DURATION) - DURATION) > 0.5)
    throw new Error(`config.js DURATION=${DURATION}, Transkript sagt ${transcript.duration_seconds} s`);

  fs.mkdirSync(path.dirname(OUT_WAV), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_TRANSCRIPT), { recursive: true });
  console.log('Finale Release-WAV unverändert kopieren …');
  fs.copyFileSync(RELEASE_WAV, OUT_WAV);
  fs.writeFileSync(OUT_TRANSCRIPT, JSON.stringify(transcript, null, 1));

  console.log('Analyse …');
  const [full, low, high] = await Promise.all([decode(null), decode('lowpass=f=120,lowpass=f=120'), decode('highpass=f=5000,highpass=f=5000')]);
  const lo = onsets(low), fu = onsets(full);
  const T = tempo(lo.o, lo.rate);
  const beat = 60 / T.bpm;
  const dr = drift(lo.o, lo.rate, T.bpm, T.phase);
  // downbeat: of the four beat phases, the one where full-band onsets (crashes, section changes) are strongest
  let bar = [-1, 0];
  for (let q = 0; q < 4; q++) {
    let s = 0; for (let t = T.phase + q * beat; t < DURATION; t += 4 * beat) s += at(fu.o, t * fu.rate) + at(fu.o, (t + 0.01) * fu.rate);
    if (s > bar[0]) bar = [s, q];
  }
  const analysis = {
    source: path.basename(RELEASE_WAV), sha256: sha, fps: FPS, duration: DURATION,
    bpm: +T.bpm.toFixed(3), beat0: +(T.phase + bar[1] * beat).toFixed(4), // time of a downbeat (bar line)
    drift: dr,
    env: { rms: envelope(full), low: envelope(low), high: envelope(high) },
    kicks: kicks(lo.o, lo.rate, T.bpm, T.phase),
  };
  fs.writeFileSync(OUT_ANALYSIS, JSON.stringify(analysis));

  // the shot list places cuts with bar() from GRID in config.js – warn if the measurement moved
  const gridOff = (analysis.beat0 - GRID.beat0) + 160 * 4 * (60 / analysis.bpm - 60 / GRID.bpm);
  if (Math.abs(analysis.bpm - GRID.bpm) > 0.01 || Math.abs(gridOff) > 0.02)
    console.warn(`WARNUNG: gemessenes Raster (BPM ${analysis.bpm}, beat0 ${analysis.beat0}) weicht von GRID in config.js ab – GRID anpassen.`);
  const strong = dr.filter((d) => d.strength > 0.05), maxMs = Math.max(0, ...strong.map((d) => Math.abs(d.ms)));
  console.log(`BPM ${analysis.bpm}  ·  Takt ${(4 * beat).toFixed(3)} s  ·  erster Taktbeginn ${analysis.beat0} s  ·  Kicks ${analysis.kicks.length}`);
  console.log(`Raster-Abweichung (Fenster mit Kick): max ${maxMs} ms  ·  ${dr.map((d) => d.ms).join(' ')}`);
  const sys = classify(transcript.segments).filter((s) => s.kind !== 'lyric' && s.kind !== 'hook');
  console.log(`Systemmeldungen im Bild: ${sys.length}`);
  for (const s of sys) console.log(`  ${s.start.toFixed(2).padStart(6)}  ${s.kind.padEnd(6)} ${s.text}`);
  console.log('wrote', path.relative(root, OUT_WAV), path.relative(root, OUT_ANALYSIS), path.relative(root, OUT_TRANSCRIPT));
}
main().catch((e) => { console.error(e.message); process.exit(1); });
