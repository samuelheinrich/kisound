// 2D text layer above the WebGL frame. Shows only what the computer voice says:
//   - system messages as a live log (IOS-style syslog lines, typed in sync with the voice)
//   - "Cisco TrustSec." as the big title that decodes itself out of hex
// plus the end card and, in animatic mode, the shot card. Every element is a pure function of t.
import { PAL, LOG_TAGS, statusOf, ENDCARD, DURATION } from '../config.js';
import { clamp, remap, smooth, hash } from '../core.js';

const MONO = '"JetBrains Mono", Menlo, monospace', SANS = '"Space Grotesk", system-ui, sans-serif';
const HEX = '0123456789ABCDEF';
const LOG = { hold: 5.0, fadeIn: 0.06, fadeOut: 0.6, maxLines: 5, rankAlpha: [1, 0.62, 0.42, 0.28, 0.18] };
const tagOf = (text) => (LOG_TAGS.find(([re]) => re.test(text)) || [null, 'SYS-6-INFO'])[1];
const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(2).padStart(5, '0')}`;
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

export class TextOverlay {
  constructor({ canvas, timeline, shots, animatic }) {
    this.c = canvas; this.g = canvas.getContext('2d'); this.tl = timeline; this.shots = shots; this.animatic = animatic;
    this.W = canvas.width; this.H = canvas.height;
    this.log = timeline.shown.filter((s) => s.kind === 'system').map((s) => ({ ...s, tag: tagOf(s.text), status: statusOf(s.text) }));
    this.titles = timeline.shown.filter((s) => s.kind === 'title');
  }

  draw(t, { shot, index }) {
    const g = this.g; g.clearRect(0, 0, this.W, this.H);
    this.drawLog(t);
    for (const s of this.titles) this.drawTitle(t, s);
    if (shot.id === 'endcard') this.drawEndcard(t, shot);
    if (this.animatic) this.drawCard(t, shot, index);
  }

  // ---------------------------------------------------------------- live log, bottom left
  drawLog(t) {
    const { g, W, H } = this;
    const live = this.log.filter((s) => s.start <= t && t < s.end + LOG.hold + LOG.fadeOut).slice(-LOG.maxLines);
    if (!live.length) return;
    const size = Math.round(H * 0.021), lh = Math.round(size * 1.62), x0 = Math.round(W * 0.055), yBase = Math.round(H * 0.885);
    // legibility: soft dark gradient in the corner, as strong as the newest line is visible
    const vis = Math.max(...live.map((s) => this.lineAlpha(t, s)));
    const gr = g.createRadialGradient(x0, yBase, 0, x0, yBase, W * 0.42);
    gr.addColorStop(0, `rgba(2,5,8,${0.62 * vis})`); gr.addColorStop(1, 'rgba(2,5,8,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.textBaseline = 'alphabetic';
    live.forEach((s, k) => {
      const rank = live.length - 1 - k, y = yBase - rank * lh;
      const a = this.lineAlpha(t, s) * LOG.rankAlpha[rank];
      if (a <= 0.005) return;
      // typing follows the voice: the text is complete at 75 % of the spoken segment
      const typed = clamp((t - s.start) / Math.max(0.25, (s.end - s.start) * 0.75));
      const msg = s.text.slice(0, Math.ceil(typed * s.text.length));
      let x = x0;
      g.font = `400 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.dim, a * 0.8);
      g.fillText(mmss(s.start), x, y); x += g.measureText('00:00.00  ').width;
      g.font = `700 ${size}px ${MONO}`; g.fillStyle = rgba(PAL[s.status] || PAL.text, a);
      const tag = `%${s.tag}:`; g.fillText(tag, x, y); x += g.measureText(tag + ' ').width;
      g.font = `400 ${size}px ${MONO}`; g.fillStyle = rgba(PAL.text, a);
      g.fillText(msg, x, y);
      // block cursor on the newest line while typing and shortly after, blinking on the beat
      if (rank === 0 && t < s.end + 0.6 && (typed < 1 || this.tl.beat(t).phase < 0.5)) {
        const cx = x + g.measureText(msg).width + size * 0.12;
        g.fillStyle = rgba(PAL[s.status] || PAL.text, a * 0.9); g.fillRect(cx, y - size * 0.82, size * 0.56, size * 1.0);
      }
    });
  }
  lineAlpha(t, s) {
    return smooth(remap(t, s.start, s.start + LOG.fadeIn)) * (1 - smooth(remap(t, s.end + LOG.hold, s.end + LOG.hold + LOG.fadeOut)));
  }

  // ---------------------------------------------------------------- title: hex glyphs lock into the letters
  drawTitle(t, s) {
    const cut = (this.shots.find((sh) => sh.t[0] > s.end + 0.5) || { t: [s.end + 3] }).t[0];
    const out0 = Math.min(s.end + 2.2, cut - 0.55), a = smooth(remap(t, s.start - 0.1, s.start + 0.15)) * (1 - smooth(remap(t, out0, out0 + 0.5)));
    if (a <= 0.005) return;
    const { g, W, H } = this, text = 'CISCO TRUSTSEC', size = Math.round(H * 0.082), sp = size * 0.2;
    g.font = `600 ${size}px ${SANS}`; g.textBaseline = 'middle';
    const widths = [...text].map((ch) => g.measureText(ch).width), total = widths.reduce((p, w) => p + w + sp, -sp);
    let x = (W - total) / 2; const y = H * 0.46, frame = Math.floor(t * 30);
    const lock = (i) => s.start + 0.2 + i * 0.07;
    [...text].forEach((ch, i) => {
      const w = widths[i];
      if (ch !== ' ') {
        const locked = t >= lock(i);
        const glyph = locked ? ch : HEX[Math.floor(hash(i, frame) * 16)];
        g.font = locked ? `600 ${size}px ${SANS}` : `500 ${Math.round(size * 0.8)}px ${MONO}`;
        g.fillStyle = locked ? rgba(PAL.text, a) : rgba(PAL.employee, a * 0.85);
        g.textAlign = 'center'; g.fillText(glyph, x + w / 2, y);
      }
      x += w + sp;
    });
    g.textAlign = 'left';
    // thin rule under the title, drawn from the centre when all letters are locked
    const r = smooth(remap(t, lock(text.length), lock(text.length) + 0.5));
    g.fillStyle = rgba(PAL.employee, a * 0.8); g.fillRect(W / 2 - (total / 2) * r, y + size * 0.72, total * r, Math.max(1, H * 0.002));
  }

  // ---------------------------------------------------------------- end card
  drawEndcard(t, shot) {
    const { g, W, H } = this, a = smooth(remap(t, shot.t[0] + 0.3, shot.t[0] + 1.3)) * (1 - smooth(remap(t, DURATION - 2.5, DURATION - 0.5)));
    if (a <= 0.005) return;
    const gr = g.createRadialGradient(W / 2, H * 0.48, 0, W / 2, H * 0.48, W * 0.45);
    gr.addColorStop(0, `rgba(2,5,8,${0.85 * a})`); gr.addColorStop(1, 'rgba(2,5,8,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `600 ${Math.round(H * 0.05)}px ${SANS}`; g.fillStyle = rgba(PAL.text, a);
    g.letterSpacing = `${Math.round(H * 0.008)}px`; g.fillText(ENDCARD.artist.toUpperCase(), W / 2, H * 0.44);
    g.font = `400 ${Math.round(H * 0.022)}px ${MONO}`; g.fillStyle = rgba(PAL.dim, a); g.letterSpacing = '0px';
    g.fillText(`${ENDCARD.album}  ·  ${ENDCARD.track}`, W / 2, H * 0.52);
    g.letterSpacing = '0px';
    g.textAlign = 'left';
  }

  // ---------------------------------------------------------------- animatic: shot card, top left
  drawCard(t, shot, index) {
    const { g, W, H } = this, x = W * 0.04, s = H / 1080;
    const b = this.tl.beat(t), kick = this.tl.kick(t), boxR = x - 18 * s + W * 0.46 - 14 * s;
    g.fillStyle = 'rgba(3,7,11,0.72)'; g.fillRect(x - 18 * s, H * 0.04 - 14 * s, W * 0.46, 150 * s);
    g.fillStyle = PAL[shot.motif] || PAL.text; g.fillRect(x - 18 * s, H * 0.04 - 14 * s, 5 * s, 150 * s);
    g.textBaseline = 'top';
    g.font = `400 ${Math.round(15 * s)}px ${MONO}`; g.fillStyle = PAL.dim;
    g.fillText(`ANIMATIC · SHOT ${String(index + 1).padStart(2, '0')}/${this.shots.length} · ${shot.id} · ${mmss(shot.t[0])}–${mmss(shot.t[1])} · ${shot.in || 'cut'}`, x, H * 0.04);
    g.font = `600 ${Math.round(34 * s)}px ${SANS}`; g.fillStyle = PAL.text;
    g.fillText(shot.label, x, H * 0.04 + 24 * s);
    g.font = `400 ${Math.round(16 * s)}px ${MONO}`; g.fillStyle = '#a9c2d0';
    this.wrap(shot.note, x, H * 0.04 + 70 * s, W * 0.42, 22 * s);
    // beat indicator: four squares, the current beat lit, brightness = kick pulse
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
