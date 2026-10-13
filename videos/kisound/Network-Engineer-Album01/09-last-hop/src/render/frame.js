// The hero: an Ethernet frame as a physical object. Not a glowing orb — a long, flat slab of light
// travelling nose-first, segmented into its actual fields:
//
//   DST MAC │ SRC MAC │ 0800 │ IPv4 │ TTL │ SRC IP │ DST IP │ TCP │ PAYLOAD │ FCS
//   └──────────────── L2 frame ─────────────────────────────────────────────────┘
//                            └────────── L3 packet ──────────────┘
//                                                         └─ L4 ─┘
//
// Three things this buys the film:
//   · TTL is a readable field inside the IP header, not an abstract ring. In the flashback it burns
//     to zero in that very cell (DREHBUCH.md §4.3).
//   · The nested L2/L3/L4 cages are the bridge's "From layer one to layer four" — already built in.
//   · Travelling nose-first gives every shot an unambiguous direction, which is what a film about a
//     round trip needs: after the turn the frame simply flies the other way.
//
// One textured box, three wire cages, a nose and a tail: ten draw calls, no per-field meshes.
import * as THREE from 'three';
import { clamp, smooth, V } from './core.js';
import { PAL } from './config.js';
import { glowSprite, canvasTexture, textPlane, setText, edgeBox, MONO } from './world.js';

// [key, label, weight]. Weights are relative widths along the frame.
const FIELDS = [
  ['dmac', 'DST 00:1A:2B:3C:4D:5E', 3.4],
  ['smac', 'SRC 00:0C:29:8A:11:04', 3.4],
  ['type', '0800', 0.9],
  ['ver', 'IPv4', 0.9],
  ['ttl', 'TTL 64', 1.6],
  ['sip', '203.0.113.9', 2.2],
  ['dip', '192.168.1.254', 2.6],
  ['tcp', 'TCP 443', 1.4],
  ['pay', 'PAYLOAD', 5.0],
  ['fcs', 'FCS', 0.9],
];
const TOTAL = FIELDS.reduce((a, f) => a + f[2], 0);
// where each field sits along the frame, as 0..1 from the tail to the nose
const SPAN = (() => {
  const out = {}; let x = 0;
  for (const [k, , w] of FIELDS) { out[k] = [x / TOTAL, (x + w) / TOTAL]; x += w; }
  return out;
})();
const mid = (k) => (SPAN[k][0] + SPAN[k][1]) / 2;
// u runs 0 at the nose to 1 at the tail; this is where that u sits along the body
const zOf = (u) => (u - 0.5) * LEN;

const LEN = 7.2, WID = 1.05, HGT = 0.64;   // world units before `scale`

// The field strip. The cells are drawn DARK and OPAQUE with bright text on top, and the body is
// normal-blended, not additive: an additive slab adds itself to whatever is behind it, the bloom then
// pushes it to white and the field labels disappear. Dark body + glowing edges is what keeps them
// readable. The material colour tints the strip, so one texture serves both the cyan and amber halves
// of the film. Cached per TTL value — the 64→0 burn costs at most 65 small canvases.
// `rev` lays the FIELDS out back to front while drawing the glyphs the normal way round.
// Mirroring the texture instead would reverse the order and the letters together — which is exactly
// the trap: readable text then means the payload leads, and a leading payload means mirrored text.
function stripTexture(ttl, rev = false) {
  return canvasTexture(`frame|${ttl}|${rev ? 'r' : 'f'}`, 2048, 256, (g, w, h) => {
    g.fillStyle = '#05080e'; g.fillRect(0, 0, w, h);
    g.textBaseline = 'middle'; g.textAlign = 'center';
    for (const [key, label] of FIELDS) {
      let [a, b] = SPAN[key];
      if (rev) { const t0 = a; a = 1 - b; b = 1 - t0; }
      const x0 = a * w, x1 = b * w, cw = x1 - x0;
      const hero = key === 'ttl', head = key !== 'pay' && key !== 'fcs';
      // cell plate: headers sit on a lighter plate, the payload stays almost black
      g.fillStyle = hero ? 'rgba(150,190,220,0.30)' : head ? 'rgba(110,150,180,0.16)' : 'rgba(40,60,80,0.10)';
      g.fillRect(x0 + 3, 24, cw - 6, h - 48);
      if (key === 'pay') {
        g.save(); g.beginPath(); g.rect(x0 + 3, 24, cw - 6, h - 48); g.clip();
        g.font = `600 30px ${MONO}`; g.textAlign = 'left';
        const H = '0123456789abcdef';
        let s = 0x9e3779b9;
        for (let y = 58; y < h - 46; y += 40) {
          let line = '';
          for (let i = 0; i < 38; i++) { s = (s * 1664525 + 1013904223) >>> 0; line += H[s >>> 28]; }
          g.fillStyle = 'rgba(190,225,255,0.42)'; g.fillText(line, x0 + 14, y);
        }
        g.restore(); g.textAlign = 'center';
      }
      g.fillStyle = 'rgba(210,240,255,0.85)'; g.fillRect(x1 - 2, 16, 3, h - 32);
      const text = key === 'ttl' ? `TTL ${ttl}` : label;
      let size = hero ? 78 : 46;
      g.font = `700 ${size}px ${MONO}`;
      while (g.measureText(text).width > cw - 22 && size > 14) { size -= 2; g.font = `700 ${size}px ${MONO}`; }
      // near-white text on a dark plate: this is the contrast the additive version threw away
      g.fillStyle = hero ? '#ffffff' : 'rgba(228,244,255,0.96)';
      g.fillText(text, (x0 + x1) / 2, h / 2);
    }
    g.fillStyle = 'rgba(210,240,255,0.9)'; g.fillRect(0, 6, w, 5); g.fillRect(0, h - 11, w, 5);
  });
}

// a cage around a span of the frame, used for the L2 / L3 / L4 nesting
function cage(from, to, pad, color, k) {
  const len = (to - from) * LEN;
  const box = edgeBox(WID + pad, HGT + pad, len, color, k);
  box.position.z = zOf((from + to) / 2);
  return box;
}

export class Frame {
  constructor({ color = PAL.cyan, scale = 1, ttl = 64 } = {}) {
    this.group = new THREE.Group(); this.group.scale.setScalar(scale);
    const col = new THREE.Color(color); this.col = col; this.ttl = ttl;

    // The body is a dark solid with the field strip on explicit side panels. A single textured box
    // cannot work: BoxGeometry's UVs run opposite ways on its +X and -X faces, so the header would
    // lead on one side of the frame and trail on the other. Panels let both sides agree.
    //
    // The header LEADS. The frame flies nose-first towards -Z, so DST/SRC/IPv4/TTL sit at the nose
    // and PAYLOAD/FCS trail at the tail — which is how a frame actually goes on the wire.
    this.body = new THREE.Mesh(new THREE.BoxGeometry(WID, HGT, LEN),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#05080e'), transparent: true, opacity: 1, depthWrite: true, side: THREE.FrontSide }));
    this.group.add(this.body);

    // Which variant a flank needs follows from where its own +X ends up. On the -X panel local +X
    // points at the TAIL, so u=0 is the nose and the strip runs as drawn. On the +X panel local +X
    // points at the NOSE, so that side needs the reversed layout to keep DST/SRC/TTL leading.
    const panelMat = (map) => new THREE.MeshBasicMaterial({
      map, color: col.clone().multiplyScalar(0.55).addScalar(0.55), transparent: true, opacity: 1,
      depthWrite: false, side: THREE.FrontSide });
    this.panels = [];
    const left = new THREE.Mesh(new THREE.PlaneGeometry(LEN, HGT), panelMat(stripTexture(ttl, false)));
    left.rotation.y = -Math.PI / 2; left.position.x = -WID / 2 - 0.004;
    const right = new THREE.Mesh(new THREE.PlaneGeometry(LEN, HGT), panelMat(stripTexture(ttl, true)));
    right.rotation.y = Math.PI / 2; right.position.x = WID / 2 + 0.004;
    // Top and bottom are built from an explicit basis rather than Euler angles: `rotation.set(-PI/2,
    // 0, 0)` leaves the strip running ACROSS the frame, which shows up as a second label axis at
    // right angles to the first. makeBasis states outright where each local axis has to end up.
    //   local +X -> along the body (u grows towards the tail)   local +Z -> the face normal
    const face = (xAxis, yAxis, zAxis, rev, at) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(LEN, WID), panelMat(stripTexture(ttl, rev)));
      m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis));
      m.position.copy(at);
      return m;
    };
    const top = face(V(0, 0, 1), V(1, 0, 0), V(0, 1, 0), false, V(0, HGT / 2 + 0.004, 0));
    const bottom = face(V(0, 0, -1), V(1, 0, 0), V(0, -1, 0), true, V(0, -HGT / 2 - 0.004, 0));
    this.group.add(left, right, top, bottom);
    this.panels.push(left, right, top, bottom);

    // nested encapsulation cages – L2 is the whole frame, L3 the IP part, L4 the TCP part onwards
    this.l2 = cage(0, 1, 0.10, color, 2.6); this.group.add(this.l2);
    this.l3 = cage(SPAN.ver[0], SPAN.tcp[0], 0.02, PAL.cyanHot, 2.2); this.group.add(this.l3);
    this.l4 = cage(SPAN.tcp[0], SPAN.fcs[0], -0.06, PAL.amberHot, 2.2); this.group.add(this.l4);
    for (const c of [this.l3, this.l4]) { c.material.transparent = true; c.material.opacity = 0; }

    // the TTL cell gets its own emissive patch so it can go amber, then red, independent of the tint
    this.ttlGlow = new THREE.Mesh(new THREE.PlaneGeometry((SPAN.ttl[1] - SPAN.ttl[0]) * LEN * 0.92, HGT * 0.92),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.warn), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    this.ttlGlow.rotation.y = Math.PI / 2;
    this.ttlGlow.position.set(0, 0, zOf(mid('ttl')));   // inside the body: visible from both sides
    this.group.add(this.ttlGlow);

    // nose (leading edge, -Z) and the wake behind it
    this.nose = glowSprite(col, 1.5, 5); this.nose.position.z = -LEN / 2; this.group.add(this.nose);
    this.hot = glowSprite('#ffffff', 0.45, 5); this.hot.position.z = -LEN / 2; this.group.add(this.hot);
    this.tail = new THREE.Mesh(new THREE.PlaneGeometry(WID * 0.8, 1),
      new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(2.4), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
        map: canvasTexture('wake', 8, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, '#fff'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) }));
    this.tail.rotation.x = -Math.PI / 2; this.group.add(this.tail);

    // address label, billboarded, deliberately quieter than the frame itself
    this.ip = textPlane('192.168.1.254', { h: 0.34, color: PAL.dim, k: 1.6, font: `500 72px ${MONO}` });
    this.ip.position.set(0, -1.5, 0); this.group.add(this.ip);
  }

  // recolour everything for the cyan → amber flip at "Destination comes alive"
  tint(color) {
    const col = new THREE.Color(color); this.col = col;
    for (const p of this.panels) p.material.color.copy(col).multiplyScalar(0.55).addScalar(0.55);
    this.l2.material.color.copy(col).multiplyScalar(2.6);
    this.nose.material.color.copy(col);
    this.tail.material.color.copy(col).multiplyScalar(2.4);
  }

  // ttl: the number in the IP header · layers 0..1: reveal the L3/L4 cages · wake: length of the trail
  set({ t = 0, ttl = null, core = 1, body = 1, layers = 0, wake = 1, ip = 0, ipText = null, ipDim = 1, camPos = null }) {
    if (ttl !== null && ttl !== this.ttl) {
      this.ttl = ttl;
      const fwd = stripTexture(ttl, false), rev = stripTexture(ttl, true);
      this.panels[0].material.map = fwd; this.panels[1].material.map = rev;
      this.panels[2].material.map = fwd; this.panels[3].material.map = rev;
    }
    const ba = smooth(body);
    this.body.material.opacity = ba; this.body.visible = ba > 0.01;
    for (const p of this.panels) { p.material.opacity = ba; p.visible = ba > 0.01; }
    this.nose.material.opacity = Math.min(core, 1.5); this.hot.material.opacity = Math.min(core * 0.9, 1.4);
    this.l2.material.opacity = smooth(body) * 0.9;
    const la = smooth(clamp(layers));
    this.l3.material.opacity = la * 0.85; this.l4.material.opacity = la * 0.85;
    this.l3.visible = this.l4.visible = la > 0.01;
    // the TTL cell warms as the budget runs down and goes red once it is critical
    const low = clamp((58 - this.ttl) / 58);
    this.ttlGlow.material.color.set(this.ttl <= 8 ? PAL.down : PAL.warn);
    this.ttlGlow.material.opacity = (0.12 + 0.75 * low ** 2) * smooth(body) * (0.8 + 0.2 * Math.sin(t * 6));
    // wake: a flat ribbon behind the nose, length follows speed
    this.tail.scale.set(1, Math.max(0.001, wake * 3.4), 1);
    this.tail.position.z = LEN / 2 + (wake * 3.4) / 2;
    this.tail.material.opacity = 0.42 * clamp(wake);
    this.ip.visible = ip > 0.01;
    if (this.ip.visible) {
      if (ipText) setText(this.ip, ipText, { font: `500 72px ${MONO}` });
      this.ip.material.opacity = ip * ipDim;
      if (camPos) { this.group.updateMatrixWorld(true); this.ip.lookAt(camPos); }
    }
  }
}
