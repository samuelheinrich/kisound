// Bootstrap: fonts, transcript + audio analysis, film; exposes frame hooks (renderer) or starts the browser player.
import * as THREE from 'three';
import { Film } from './film.js';
import { Timeline } from './timeline.js';
import { FPS, FRAMES, DURATION, CHAPTERS, ANIMATIC, SETS } from './config.js';
import { makeEnv } from './world.js';
import { SetLibrary } from './assets.js';

// Web interface: a hosting page may set window.KISOUND_PAGE {defaultRes, animatic}; the local preview needs nothing.
const PAGE = window.KISOUND_PAGE || {};
const q = new URLSearchParams(location.search);
const PLAYER = !q.has('w');
const RES = { 540: [960, 540], 720: [1280, 720], 1080: [1920, 1080], 1440: [2560, 1440], 2160: [3840, 2160] }[q.get('res') || PAGE.defaultRes || '1080'] || [1920, 1080];
const W = PLAYER ? RES[0] : +q.get('w'), H = PLAYER ? RES[1] : +(q.get('h') || 1080), MB = +(q.get('mb') || 1);
const json = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(`${url} fehlt – zuerst „npm run prepare-audio“ ausführen`); return r.json(); };

async function boot() {
  const stage = document.getElementById('stage');
  stage.style.width = W + 'px'; stage.style.height = H + 'px';
  const [transcript, analysis] = await Promise.all([json('assets/lyrics/transcript.json'), json('assets/audio/analysis.json'),
    document.fonts.load('400 40px "JetBrains Mono"'), document.fonts.load('700 40px "JetBrains Mono"'), document.fonts.load('600 40px "Space Grotesk"')]);
  await document.fonts.ready;
  const timeline = new Timeline(transcript, analysis);
  const canvas = document.createElement('canvas');
  const overlay = document.createElement('canvas'); overlay.width = W; overlay.height = H;
  stage.append(canvas, overlay);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1); renderer.setSize(W, H, true);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping; renderer.autoClear = false;
  const env = await makeEnv(renderer);
  const sets = await new SetLibrary().load(SETS);
  const film = new Film({ renderer, width: W, height: H, overlay, timeline, env, sets, animatic: q.has('animatic') ? q.get('animatic') !== '0' : (PAGE.animatic ?? ANIMATIC) });
  window.film = film;
  // warm-up: upload every dynamic texture and compile every shader once, so the first rendered frame equals any later render of it
  for (const t of [19, 40, 129, 209, 217, 265]) film.render(t, 1);
  window.renderFrame = (frame) => { film.render(frame / FPS, MB); renderer.getContext().finish(); return true; };
  window.renderTime = (t) => { film.render(t, MB); return true; };
  window.FILM = { FPS, FRAMES, W, H };
  if (PLAYER) {
    const { startPlayer } = await import('./player.js');
    const markers = CHAPTERS.map(([label, t]) => ({ t, label }));
    await startPlayer({ film, duration: DURATION, fps: FPS, markers, bpm: analysis.bpm, beat0: analysis.beat0, audioUrl: 'assets/audio/lasthop.wav', W, H, title: 'Network Engineer · 09 Last Hop' });
  } else film.render(+(q.get('t') || 0), 1);
  window.__ready = true;
}
boot().catch((e) => {
  window.__error = String((e && e.stack) || e); console.error(e);
  document.body.insertAdjacentHTML('beforeend', `<pre style="color:#ff6b6b;font:16px monospace;padding:24px;white-space:pre-wrap">${String(e.message || e)}</pre>`);
});
