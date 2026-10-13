// 2D text layer above the WebGL frame. Machine output only — nothing sung ever appears here (DREHBUCH.md §3.3):
//   - the traceroute panel, top left, one line per hop reached
//   - the syslog, bottom left, typed as it fires
//   - the HUD block, top right: hop counter, TTL, destination
//   - the title (once), the end card, and in animatic mode the shot card
// Every element is a pure function of t.
import { PAL, ENDCARD, TITLE, DURATION, HOPS, DEST, STATUS_COL } from '../config.js';
import { clamp, remap, smooth, hash } from '../core.js';

const MONO = '"JetBrains Mono", Menlo, monospace', SANS = '"Space Grotesk", system-ui, sans-serif';
const HEX = '0123456789ABCDEF';
const LOG = { hold: 4.2, fadeIn: 0.06, fadeOut: 0.6, type: 0.55, maxLines: 5, rankAlpha: [1, 0.62, 0.42, 0.28, 0.18] };
const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(2).padStart(5, '0')}`;
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
const byN = new Map(HOPS.map((h) => [h.n, h]));

export class TextOverlay {
  constructor({ canvas, timeline, shots, animatic }) {
    this.c = canvas; this.g = canvas.getContext('2d'); this.tl = timeline; this.shots = shots; this.animatic = animatic;
    this.W = canvas.width; this.H = canvas.height;
    this.log = timeline.shown;
    this.titleShot = shots.find((s) => s.mode === 'title');
    this.hopMsgs = timeline.shown.filter((m) => m.hop);
  }

  draw(t, { shot, index }) {
    const g = this.g; g.clearRect(0, 0, this.W, this.H);
    const end = shot.id === 'endcard';
    // in the cockpit the syslog, traceroute and TTL run on the displays instead
    if (!end && !shot.pov) { this.drawTrace(t, shot); this.drawLog(t); this.drawHud(t, shot); }
    if (this.titleShot) this.drawTitle(t, this.titleShot);
    if (end) this.drawEndcard(t, shot);
    if (this.animatic) this.drawCard(t, shot, index);
  }

  // ---------------------------------------------------------------- traceroute panel, top left
  // Builds over the whole film: one line per hop whose message has fired. Fades out with the instrumentation.
  drawTrace(t, shot) {
    const { g, W, H } = this;
    const fired = this.hopMsgs.filter((m) => t >= m.start);
    if (!fired.length) return;
    // dies with "The route is silent." and stays away afterwards
    const a = smooth(remap(t, fired[0].start, fired[0].start + 0.4)) * (1 - smooth(remap(t, 243.7, 246.5)));
    if (a <= 0.005) return;
    const size = Math.round(H * 0.0175), lh = Math.round(size * 1.55);
    const x0 = Math.round(W * 0.055), y0 = Math.round(H * (this.animatic ? 0.215 : 0.075));
    g.textBaseline = 'top'; g.textAlign = 'left';
    g.font = `700 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.dim, a * 0.85);
    g.fillText(`traceroute to ${DEST.ip}, ${DEST.hops} hops max`, x0, y0);
    fired.forEach((m, i) => {
      const h = byN.get(m.hop); if (!h) return;
      const la = a * clamp((t - m.start) / 0.35) * (h.last ? 1 : 0.78);
      const y = y0 + (i + 1.6) * lh;
      const col = h.last ? PAL.amberHot : m.hop > 5 ? PAL.amber : PAL.cyan;
      g.font = `400 ${size}px ${MONO}`;
      g.fillStyle = rgba(PAL.dim, la * 0.9); g.fillText(String(h.n).padStart(2, ' '), x0, y);
      g.fillStyle = rgba(col, la); g.fillText((h.ip || h.node).padEnd(16, ' '), x0 + size * 2.2, y);
      g.fillStyle = rgba(PAL.dim, la * 0.8); g.fillText(`${h.rtt.toFixed(2)} ms`, x0 + size * 13.6, y);
    });
    // the gap that is still missing – the whole point of the film
    if (fired.length < HOPS.length) {
      const y = y0 + (fired.length + 1.6) * lh;
      const blink = this.tl.beat(t).phase < 0.5 ? 0.5 : 0.18;
      g.font = `400 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.dim, a * blink);
      g.fillText(`${String(fired.length + 1).padStart(2, ' ')}  * * *`, x0, y);
    }
  }

  // ---------------------------------------------------------------- live log, bottom left
  drawLog(t) {
    const { g, W, H } = this;
    const live = this.log.filter((s) => s.start <= t && t < s.start + LOG.hold + LOG.fadeOut).slice(-LOG.maxLines);
    if (!live.length) return;
    const size = Math.round(H * 0.021), lh = Math.round(size * 1.62), x0 = Math.round(W * 0.055), yBase = Math.round(H * 0.885);
    const vis = Math.max(...live.map((s) => this.lineAlpha(t, s)));
    const gr = g.createRadialGradient(x0, yBase, 0, x0, yBase, W * 0.42);
    gr.addColorStop(0, `rgba(2,5,8,${0.62 * vis})`); gr.addColorStop(1, 'rgba(2,5,8,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    live.forEach((s, k) => {
      const rank = live.length - 1 - k, y = yBase - rank * lh;
      const a = this.lineAlpha(t, s) * LOG.rankAlpha[rank];
      if (a <= 0.005) return;
      const typed = clamp((t - s.start) / LOG.type);
      const msg = s.text.slice(0, Math.ceil(typed * s.text.length));
      const col = PAL[STATUS_COL[s.status] || 'text'] || PAL.text;
      // the flashback stamps its lines with the date they happened
      const stamp = s.past ? 'Mar 14 03:11' : mmss(s.start);
      let x = x0;
      g.font = `400 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.dim, a * 0.8);
      g.fillText(stamp, x, y); x += g.measureText(s.past ? 'Mar 14 03:11  ' : '00:00.00  ').width;
      g.font = `700 ${size}px ${MONO}`; g.fillStyle = rgba(col, a);
      const tag = `%${s.tag}:`; g.fillText(tag, x, y); x += g.measureText(tag + ' ').width;
      g.font = `400 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.text, a);
      g.fillText(msg, x, y);
      if (rank === 0 && t < s.start + LOG.type + 0.6 && (typed < 1 || this.tl.beat(t).phase < 0.5)) {
        const cx = x + g.measureText(msg).width + size * 0.12;
        g.fillStyle = rgba(col, a * 0.9); g.fillRect(cx, y - size * 0.82, size * 0.56, size * 1.0);
      }
    });
  }
  lineAlpha(t, s) {
    return smooth(remap(t, s.start, s.start + LOG.fadeIn)) * (1 - smooth(remap(t, s.start + LOG.hold, s.start + LOG.hold + LOG.fadeOut)));
  }

  // ---------------------------------------------------------------- HUD block, top right (cover style)
  drawHud(t, shot) {
    const { g, W, H } = this;
    const a = smooth(remap(t, 20.5, 21.5)) * (1 - smooth(remap(t, 243.7, 246.5)));
    if (a <= 0.005) return;
    const reached = this.hopMsgs.filter((m) => t >= m.start).length;
    // TTL: whatever the last reached hop left behind; 64 before the first and right after the turn
    const turned = t >= 74.6;
    const ttl = reached ? byN.get(this.hopMsgs.filter((m) => t >= m.start).slice(-1)[0].hop).ttl : 64;
    const size = Math.round(H * 0.0175), lh = Math.round(size * 1.62);
    const x1 = Math.round(W * 0.945), y0 = Math.round(H * 0.075);
    const rows = [
      ['HOP', `${String(reached).padStart(2, '0')} / ${DEST.hops}`, reached >= 9 ? PAL.ok : PAL.text],
      ['TTL', String(ttl), ttl < 58 ? PAL.warn : PAL.text],
      ['DEST', DEST.ip, turned ? PAL.amber : PAL.dim],
      ['STATUS', t >= 240.8 ? 'REACHABLE' : shot.predict ? 'PREDICTED' : 'IN TRANSIT', t >= 240.8 ? PAL.ok : shot.predict ? PAL.cyan : PAL.dim],
    ];
    g.textBaseline = 'top';
    g.textAlign = 'right'; g.font = `700 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.dim, a * 0.8);
    g.fillText('PATH STATUS', x1, y0);
    rows.forEach(([k, v, col], i) => {
      const y = y0 + (i + 1.6) * lh;
      g.textAlign = 'right'; g.font = `400 ${size}px ${MONO}`;
      g.fillStyle = rgba(col, a); g.fillText(v, x1, y);
      g.textAlign = 'right'; g.fillStyle = rgba(PAL.dim, a * 0.75);
      g.fillText(k, x1 - size * 7.2, y);
    });
    g.textAlign = 'left';
  }

  // ---------------------------------------------------------------- title: hex glyphs lock into the letters
  drawTitle(t, shot) {
    const a = smooth(remap(t, shot.t[0] + 0.15, shot.t[0] + 0.4)) * (1 - smooth(remap(t, shot.t[1] - 0.7, shot.t[1] - 0.2)));
    if (a <= 0.005) return;
    const { g, W, H } = this, text = TITLE, size = Math.round(H * 0.095), sp = size * 0.22;
    g.font = `600 ${size}px ${SANS}`; g.textBaseline = 'middle';
    const widths = [...text].map((ch) => g.measureText(ch).width), total = widths.reduce((p, w) => p + w + sp, -sp);
    let x = (W - total) / 2; const y = H * 0.46, frame = Math.floor(t * 30);
    const lock = (i) => shot.t[0] + 0.25 + i * 0.075;
    [...text].forEach((ch, i) => {
      const w = widths[i];
      if (ch !== ' ') {
        const locked = t >= lock(i);
        const glyph = locked ? ch : HEX[Math.floor(hash(i, frame) * 16)];
        g.font = locked ? `600 ${size}px ${SANS}` : `500 ${Math.round(size * 0.8)}px ${MONO}`;
        g.fillStyle = locked ? rgba(PAL.text, a) : rgba(PAL.cyan, a * 0.85);
        g.textAlign = 'center'; g.fillText(glyph, x + w / 2, y);
      }
      x += w + sp;
    });
    g.textAlign = 'left';
    const r = smooth(remap(t, lock(text.length), lock(text.length) + 0.5));
    g.fillStyle = rgba(PAL.cyan, a * 0.8); g.fillRect(W / 2 - (total / 2) * r, y + size * 0.72, total * r, Math.max(1, H * 0.002));
  }

  // ---------------------------------------------------------------- end card: the ping statistics
  drawEndcard(t, shot) {
    const { g, W, H } = this;
    const a = smooth(remap(t, shot.t[0] + 0.4, shot.t[0] + 1.6)) * (1 - smooth(remap(t, DURATION - 4.2, DURATION - 2.2)));
    if (a <= 0.005) return;
    const gr = g.createRadialGradient(W / 2, H * 0.48, 0, W / 2, H * 0.48, W * 0.5);
    gr.addColorStop(0, `rgba(2,5,8,${0.9 * a})`); gr.addColorStop(1, 'rgba(2,5,8,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const size = Math.round(H * 0.0225), lh = Math.round(size * 1.75);
    const lines = [
      [`--- ${DEST.ip} ping statistics ---`, PAL.dim],
      [`${DEST.hops} hops traversed, 1 packet transmitted, 1 received, 0% packet loss`, PAL.text],
      [`rtt min/avg/max/mdev = ${DEST.rtt.toFixed(2)}/${DEST.rtt.toFixed(2)}/${DEST.rtt.toFixed(2)}/0.00 ms   ttl=${DEST.ttl}`, PAL.text],
      ['', PAL.text],
      ['--- network-engineer ping statistics ---', PAL.dim],
      ['10 tracks transmitted, 10 received, 0% packet loss', PAL.text],
      ['', PAL.text],
      ['route complete.', PAL.ok],
    ];
    g.font = `400 ${size}px ${MONO}`; g.textBaseline = 'middle'; g.textAlign = 'left';
    const wide = Math.max(...lines.map(([s]) => g.measureText(s).width));
    const x0 = Math.round((W - wide) / 2), y0 = H * 0.44 - (lines.length - 1) * lh / 2;
    // the lines type in one after another, a beat apart
    lines.forEach(([s, col], i) => {
      const la = a * clamp((t - (shot.t[0] + 0.9 + i * 0.22)) / 0.3);
      if (la <= 0.005 || !s) return;
      g.fillStyle = rgba(col, la); g.fillText(s, x0, y0 + i * lh);
    });
    const ca = a * clamp((t - (shot.t[0] + 3.2)) / 0.8);
    if (ca > 0.005) {
      g.textAlign = 'center'; g.font = `600 ${Math.round(H * 0.019)}px ${SANS}`;
      g.letterSpacing = `${Math.round(H * 0.006)}px`; g.fillStyle = rgba(PAL.dim, ca);
      g.fillText(`${TITLE}  ·  ${ENDCARD.artist.toUpperCase()}  ·  ${ENDCARD.album.toUpperCase()}`, W / 2, y0 + lines.length * lh + H * 0.055);
      g.letterSpacing = '0px'; g.textAlign = 'left';
    }
  }

  // ---------------------------------------------------------------- animatic: shot card, top left
  drawCard(t, shot, index) {
    const { g, W, H } = this, x = W * 0.04, s = H / 1080;
    const b = this.tl.beat(t), kick = this.tl.kick(t), boxR = x - 18 * s + W * 0.46 - 14 * s;
    g.fillStyle = 'rgba(3,7,11,0.72)'; g.fillRect(x - 18 * s, H * 0.04 - 14 * s, W * 0.46, 150 * s);
    g.fillStyle = PAL[shot.motif] || PAL.text; g.fillRect(x - 18 * s, H * 0.04 - 14 * s, 5 * s, 150 * s);
    g.textBaseline = 'top'; g.textAlign = 'left';
    g.font = `400 ${Math.round(15 * s)}px ${MONO}`; g.fillStyle = PAL.dim;
    g.fillText(`ANIMATIC · SHOT ${String(index + 1).padStart(2, '0')}/${this.shots.length} · ${shot.id} · ${mmss(shot.t[0])}–${mmss(shot.t[1])} · ${shot.in || 'cut'}`, x, H * 0.04);
    g.font = `600 ${Math.round(34 * s)}px ${SANS}`; g.fillStyle = PAL.text;
    g.fillText(shot.label, x, H * 0.04 + 24 * s);
    g.font = `400 ${Math.round(16 * s)}px ${MONO}`; g.fillStyle = '#a9c2d0';
    this.wrap(shot.note, x, H * 0.04 + 70 * s, W * 0.42, 22 * s);
    for (let i = 0; i < 4; i++) {
      const on = i === b.inBar;
      g.fillStyle = on ? rgba(PAL[shot.motif] || PAL.text, 0.35 + 0.65 * kick) : 'rgba(120,150,170,0.25)';
      g.fillRect(boxR - (4 - i) * 22 * s, H * 0.04, 16 * s, 16 * s);
    }
    g.font = `400 ${Math.round(15 * s)}px ${MONO}`; g.fillStyle = PAL.dim; g.textAlign = 'right';
    g.fillText(`Takt ${b.bar}.${b.inBar + 1}`, boxR - 4 * 22 * s - 12 * s, H * 0.04);
    g.textAlign = 'left';
  }
  wrap(text, x, y, maxW, lh) {
    const g = this.g; let line = '';
    for (const word of text.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y); y += lh; line = word; } else line = test;
    }
    if (line) g.fillText(line, x, y);
  }
}
