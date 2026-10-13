// Browser player: real-time review of a film with sample-synced audio, scrubbing and markers.
// Master clock = Web Audio clock (sample accurate). Without audio file it falls back to performance.now().
// Keys: Space play/pause · ←/→ ±1 s (Shift: ±1 frame) · Home/End · 1–9 jump to marker · L loop · M mute · F fullscreen

const CSS = `
  html, body { margin: 0; height: 100%; background: #05080c; overflow: hidden; font: 13px/1.2 system-ui, -apple-system, sans-serif; color: #cfe3ee; }
  #stage { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
  #hud { display: none; }
  #player { position: fixed; left: 0; right: 0; bottom: 0; height: 74px; background: rgba(8,14,20,.94); border-top: 1px solid #1d3345;
    display: grid; grid-template-columns: auto auto 1fr auto; grid-template-rows: 26px 40px; column-gap: 12px; padding: 4px 14px 0; box-sizing: border-box; user-select: none; }
  #player button { background: #0f2231; color: #cfe3ee; border: 1px solid #23445c; border-radius: 6px; height: 30px; min-width: 34px; cursor: pointer; font-size: 14px; }
  #player button:hover { border-color: #00b3e2; }
  #player button.on { background: #00587a; border-color: #00b3e2; }
  #pp { grid-row: 1 / span 2; align-self: center; width: 46px; height: 46px !important; font-size: 20px !important; }
  #title { grid-column: 2 / span 2; align-self: end; color: #7fa7bd; letter-spacing: .04em; }
  #time { grid-column: 4; align-self: end; text-align: right; font-variant-numeric: tabular-nums; color: #e8f6ff; white-space: nowrap; }
  #track { grid-column: 2 / span 2; grid-row: 2; position: relative; height: 34px; margin-top: 3px; cursor: pointer; }
  #track canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  #tools { grid-column: 4; grid-row: 2; display: flex; gap: 6px; align-items: center; justify-content: flex-end; }
  #home { color: #cfe3ee; text-decoration: none; border: 1px solid #23445c; border-radius: 6px; height: 28px; line-height: 28px; padding: 0 10px; background: #0f2231; margin-right: 6px; }
  #home:hover { border-color: #00b3e2; }
  #player select { background: #0f2231; color: #cfe3ee; border: 1px solid #23445c; border-radius: 6px; height: 30px; }
  #msg { position: fixed; top: 12px; left: 50%; transform: translateX(-50%); background: rgba(8,14,20,.9); border: 1px solid #23445c; padding: 6px 12px; border-radius: 6px; color: #9fc3d6; display: none; }
`;

export async function startPlayer({ film, duration, fps, markers = [], bpm = 0, beat0 = 0, audioUrl, W, H, title = '' }) {
  const style = document.createElement('style'); style.textContent = CSS; document.head.append(style);
  const stage = document.getElementById('stage');
  const bar = document.createElement('div'); bar.id = 'player';
  bar.innerHTML = `<button id="pp" title="Play/Pause (Leertaste)">▶</button><div id="title"></div><div id="time"></div>
    <div id="track"><canvas></canvas></div>
    <div id="tools"><a id="home" href="/" title="Zur Film-Übersicht">☰ Übersicht</a><select id="rate" title="Geschwindigkeit"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option></select>
    <button id="loop" class="on" title="Schleife (L)">⟲</button><button id="mute" title="Ton (M)">🔊</button><button id="fs" title="Vollbild (F)">⛶</button></div>`;
  document.body.append(bar);
  const msg = document.createElement('div'); msg.id = 'msg'; document.body.append(msg);
  const $ = (id) => document.getElementById(id);
  if (location.pathname === '/' || location.pathname === '') $('home').style.display = 'none';
  $('title').textContent = title + `  ·  ${W}×${H}  ·  Live-Vorschau (ohne Bewegungsunschärfe)`;
  const note = (s, ms = 2500) => { msg.textContent = s; msg.style.display = 'block'; clearTimeout(note.h); note.h = setTimeout(() => (msg.style.display = 'none'), ms); };

  // ---- fit stage into the window above the control bar
  const fit = () => {
    const aw = window.innerWidth, ah = window.innerHeight - 74;
    const s = Math.min(aw / W, ah / H);
    stage.style.transform = `translate(${(aw - W * s) / 2}px, ${(ah - H * s) / 2}px) scale(${s})`;
    drawTrack();
  };

  // ---- audio clock
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = ctx.createGain(); gain.connect(ctx.destination);
  let buffer = null;
  try {
    const r = await fetch(audioUrl);
    if (!r.ok) throw new Error(r.status);
    buffer = await ctx.decodeAudioData(await r.arrayBuffer());
  } catch { note('Kein Ton gefunden – zuerst „npm run prepare-audio“ ausführen. Wiedergabe läuft stumm.', 6000); }
  const st = { playing: false, offset: 0, start: 0, rate: 1, loop: true, src: null, muted: false };
  const now = () => (buffer ? ctx.currentTime : performance.now() / 1000);
  const current = () => (st.playing ? st.offset + (now() - st.start) * st.rate : st.offset);
  const stopSrc = () => { if (st.src) { try { st.src.stop(); } catch {} st.src.disconnect(); st.src = null; } };
  const startSrc = () => {
    if (!buffer) return;
    const s = ctx.createBufferSource(); s.buffer = buffer; s.playbackRate.value = st.rate; s.connect(gain);
    s.start(0, Math.min(st.offset, buffer.duration - 0.001)); st.src = s;
  };
  const play = async () => {
    if (st.offset >= duration - 1 / fps) st.offset = 0;
    await ctx.resume();
    st.start = now(); st.playing = true; startSrc(); $('pp').textContent = '❚❚';
  };
  const pause = () => { st.offset = current(); st.playing = false; stopSrc(); $('pp').textContent = '▶'; };
  const seek = (t) => {
    const was = st.playing; if (was) pause();
    st.offset = Math.max(0, Math.min(duration - 1 / fps, t));
    if (was) play();
  };
  const toggle = () => (st.playing ? pause() : play());

  // ---- timeline (markers, bar grid, playhead)
  const tc = $('track').querySelector('canvas');
  function drawTrack(t = current()) {
    const r = tc.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (tc.width !== Math.round(r.width * dpr)) { tc.width = Math.round(r.width * dpr); tc.height = Math.round(r.height * dpr); }
    const g = tc.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = r.width, h = r.height, X = (s) => (s / duration) * w;
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#0c1a25'; g.fillRect(0, 12, w, 12);
    g.fillStyle = '#006f99'; g.fillRect(0, 12, X(t), 12);
    if (bpm) { const barLen = (60 / bpm) * 4; for (let b = beat0, k = 0; b < duration; b += barLen, k++) { g.fillStyle = k % 4 ? '#1c3446' : '#2f5874'; g.fillRect(Math.round(X(b)), k % 4 ? 18 : 14, 1, k % 4 ? 6 : 10); } }
    g.font = '10px system-ui'; g.textBaseline = 'top';
    markers.forEach((m, i) => {
      const x = Math.round(X(m.t));
      g.fillStyle = '#00b3e2'; g.fillRect(x, 10, 1.5, 16);
      // label clipped to the space before the next marker
      const room = (i + 1 < markers.length ? X(markers[i + 1].t) : w) - x - 8;
      let lab = `${i + 1} ${m.label}`;
      while (lab.length > 2 && g.measureText(lab).width > room) lab = lab.slice(0, -2) + '…';
      g.fillStyle = '#8fbad0'; g.fillText(lab, x + 3, 0);
    });
    g.fillStyle = '#ffffff'; g.fillRect(X(t) - 1, 6, 2, 22);
  }
  let dragging = false, resume = false;
  const tAt = (e) => { const r = tc.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * duration; };
  $('track').addEventListener('pointerdown', (e) => { dragging = true; resume = st.playing; if (st.playing) pause(); st.offset = Math.max(0, tAt(e)); $('track').setPointerCapture(e.pointerId); });
  $('track').addEventListener('pointermove', (e) => { if (dragging) st.offset = Math.max(0, Math.min(duration - 1 / fps, tAt(e))); });
  $('track').addEventListener('pointerup', () => { dragging = false; if (resume) play(); });

  // ---- controls
  $('pp').onclick = toggle;
  $('loop').onclick = () => { st.loop = !st.loop; $('loop').classList.toggle('on', st.loop); };
  $('mute').onclick = () => { st.muted = !st.muted; gain.gain.value = st.muted ? 0 : 1; $('mute').textContent = st.muted ? '🔇' : '🔊'; };
  $('fs').onclick = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  $('rate').onchange = (e) => { const was = st.playing; if (was) pause(); st.rate = +e.target.value; if (was) play(); };
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT') return;
    const step = e.shiftKey ? 1 / fps : 1;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.code === 'ArrowRight') seek(current() + step);
    else if (e.code === 'ArrowLeft') seek(current() - step);
    else if (e.code === 'Home') seek(0);
    else if (e.code === 'End') seek(duration);
    else if (e.key === 'l' || e.key === 'L') $('loop').click();
    else if (e.key === 'm' || e.key === 'M') $('mute').click();
    else if (e.key === 'f' || e.key === 'F') $('fs').click();
    else if (/^[1-9]$/.test(e.key) && markers[+e.key - 1]) seek(markers[+e.key - 1].t);
  });
  window.addEventListener('resize', fit);
  fit();

  // ---- render loop
  let last = performance.now(), fpsAvg = 60;
  const loop = () => {
    let t = current();
    if (st.playing && t >= duration) {
      if (st.loop) { st.offset = 0; st.start = now(); stopSrc(); startSrc(); t = 0; }
      else { pause(); st.offset = duration - 1 / fps; t = st.offset; }
    }
    film.render(Math.min(t, duration - 1 / fps), 1);
    const n = performance.now(); fpsAvg = fpsAvg * 0.95 + (1000 / Math.max(1, n - last)) * 0.05; last = n;
    const beat = bpm ? Math.floor((t - beat0) / (60 / bpm)) : 0;
    const barTxt = bpm ? `  ·  Takt ${Math.floor(beat / 4) + 1}.${(((beat % 4) + 4) % 4) + 1}` : '';
    $('time').textContent = `${t.toFixed(2).padStart(5, '0')} s / ${duration.toFixed(0)} s${barTxt}  ·  Frame ${Math.floor(t * fps)}  ·  ${fpsAvg.toFixed(0)} fps`;
    drawTrack(t);
    requestAnimationFrame(loop);
  };
  loop();
  return { play, pause, seek, current };
}
