// The hero: a packet as a 3D object – bright core, header rings, encrypted shell
// (random hex glyphs = ciphertext, never readable payload) – plus what this film is about:
//   band  the SGT ring: a wide glowing band with "SGT 10 · EMPLOYEE" running around it (the identity)
//   ip    a small address label that is deliberately less important than the band
import * as THREE from 'three';
import { mulberry32, clamp, smooth } from './core.js';
import { PAL, GROUPS } from './config.js';
import { glowSprite, canvasTexture, textPlane, setText, MONO, ease } from './world.js';

let _hexTex = null;
function cipherTexture() {
  if (_hexTex) return _hexTex;
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 1024, 512);
  const r = mulberry32(99), H = '0123456789abcdef';
  g.font = '600 22px Menlo, "SF Mono", monospace'; g.textBaseline = 'top';
  for (let y = 0; y < 512; y += 26) for (let x = 0; x < 1024; x += 30) {
    const a = 0.25 + r() * 0.75; g.fillStyle = `rgba(255,255,255,${a})`;
    g.fillText(H[Math.floor(r() * 16)] + H[Math.floor(r() * 16)], x + 2, y + 2);
  }
  _hexTex = new THREE.CanvasTexture(c); _hexTex.wrapS = _hexTex.wrapT = THREE.RepeatWrapping; _hexTex.anisotropy = 8;
  return _hexTex;
}
function dashTexture(n, duty) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 4; const g = c.getContext('2d');
  g.fillStyle = '#fff'; for (let i = 0; i < n; i++) g.fillRect((i / n) * 512, 0, (512 / n) * duty, 4);
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
}
// band texture: tag text repeated around the circumference, framed by two lines
function bandTexture(group) {
  return canvasTexture(`band|${group.sgt}`, 2048, 128, (g, w, h) => {
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.fillRect(0, 6, w, 5); g.fillRect(0, h - 11, w, 5);
    g.font = `700 64px ${MONO}`; g.textBaseline = 'middle';
    const label = `SGT ${group.sgt} · ${group.name} · `;
    const lw = g.measureText(label).width, n = Math.max(1, Math.round(w / lw)), sx = w / (n * lw);
    g.save(); g.scale(sx, 1);
    for (let i = 0; i < n; i++) g.fillText(label, i * lw, h / 2 + 3);
    g.restore();
  });
}

export class Packet {
  constructor({ color = PAL.employee, scale = 1, sgt = null } = {}) {
    this.group = new THREE.Group(); this.group.scale.setScalar(scale);
    const col = new THREE.Color(color); this.col = col;
    this.core = glowSprite(col, 1.6, 6); this.group.add(this.core);
    this.hot = glowSprite('#ffffff', 0.5, 5); this.group.add(this.hot);
    this.halo = glowSprite(col, 5, 0.6); this.group.add(this.halo);
    // header rings (L2/L3/L4 idea – no labels): dashed tori at different tilts
    this.rings = [[1.25, 24, 0.55, 0.0], [1.55, 40, 0.3, 1.1], [1.85, 12, 0.7, 2.2]].map(([R, n, duty, tilt], i) => {
      const m = new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(3.2), alphaMap: dashTexture(n, duty), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.025, 6, 160), m);
      ring.rotation.set(Math.PI / 2 + tilt * 0.35, tilt, 0);
      this.group.add(ring); return ring;
    });
    const shellMat = new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(1.4), alphaMap: cipherTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.shell = new THREE.Mesh(new THREE.SphereGeometry(1.0, 48, 24), shellMat); this.group.add(this.shell);
    this.wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.06, 1)), new THREE.LineBasicMaterial({ color: col.clone().multiplyScalar(2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.group.add(this.wire);
    // SGT band (+ two edge rings), in its own pivot so it can tilt independently
    this.bandPivot = new THREE.Group(); this.group.add(this.bandPivot);
    const grp = GROUPS.find((g) => g.sgt === sgt);
    if (grp) {
      const bc = new THREE.Color(PAL[grp.key]);
      const tex = bandTexture(grp); tex.wrapS = THREE.RepeatWrapping;
      this.band = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.36, 160, 1, true),
        new THREE.MeshBasicMaterial({ map: tex, color: bc.clone().multiplyScalar(2.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      this.bandPivot.add(this.band);
      this.bandEdges = [0.2, -0.2].map((y) => { const r = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.012, 6, 200), new THREE.MeshBasicMaterial({ color: bc.clone().multiplyScalar(5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); r.rotation.x = Math.PI / 2; r.position.y = y; this.bandPivot.add(r); return r; });
      this.bandPivot.rotation.set(0.32, 0, -0.18);
    }
    // IP label (billboard)
    this.ip = textPlane('10.20.31.44', { h: 0.34, color: PAL.dim, k: 1.6, font: `500 72px ${MONO}` });
    this.ip.position.set(0, -2.25, 0); this.group.add(this.ip);
  }
  // rings 0..1 (sequential), shell 0..1, core brightness, band 0..1 (snap-on), ip 0..1 + text, camPos for billboards
  set({ t = 0, rings = 1, shell = 1, core = 1, band = 0, bandSnap = null, bandSpin = 0.6, ip = 0, ipText = null, ipDim = 1, camPos = null }) {
    this.core.material.opacity = Math.min(core, 1.5); this.hot.material.opacity = Math.min(core, 1.5); this.halo.material.opacity = core * 0.8;
    this.rings.forEach((ring, i) => {
      const a = smooth(clamp(rings * 3 - i));
      ring.material.opacity = a; ring.visible = a > 0.01;
      ring.scale.setScalar(1 + (1 - a) * 1.6);
      ring.rotation.z = t * (0.8 + i * 0.5) * (i % 2 ? -1 : 1);
    });
    const sa = smooth(shell);
    this.shell.visible = this.wire.visible = sa > 0.01;
    this.shell.material.opacity = sa * 0.55; this.wire.material.opacity = sa * 0.7;
    this.shell.scale.setScalar(0.7 + 0.3 * sa); this.wire.scale.setScalar(0.7 + 0.3 * sa);
    this.shell.material.alphaMap.offset.set(t * 0.07, t * 0.11);
    this.shell.rotation.y = t * 0.6; this.wire.rotation.set(t * 0.3, t * 0.45, 0);
    if (this.band) {
      const b = clamp(band), sn = bandSnap ?? b, s = sn >= 1 ? 1 : 2.4 - 1.4 * ease.back(sn);
      this.bandPivot.visible = b > 0.001;
      this.bandPivot.scale.set(s, 1, s);
      const op = smooth(b * (bandSnap == null ? 2.5 : 1));
      this.band.material.opacity = op; this.bandEdges.forEach((e) => (e.material.opacity = op));
      this.band.rotation.y = -t * bandSpin;
    }
    this.ip.visible = ip > 0.01;
    if (this.ip.visible) {
      if (ipText) setText(this.ip, ipText, { font: `500 72px ${MONO}` });
      this.ip.material.opacity = ip * ipDim;
      if (camPos) { this.group.updateMatrixWorld(true); this.ip.lookAt(camPos); }
    }
  }
}
