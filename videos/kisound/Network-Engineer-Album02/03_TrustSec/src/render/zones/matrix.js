// SGACL matrix + egress gate. A 5×5 wall of glass cells (rows = source group, columns = destination group),
// a portal gate in front of it. Modes:
//   teaser    hook 1: fast dolly along the wall, one policy cell answers per beat
//   permit    Source SGT → row, Destination SGT → column, SGT-ACL matched → cell, Access permitted → gate opens
//   traffic   hook 2: many flows, every packet hits its cell: green passes, red sparks
//   nomatch   the unknown's row (SGT 0) is scanned and stays dark
//   deny      the cell turns red, the gate slams shut, the unknown shatters on it
//   gate      the known client passes; its IP label is stripped off and stays outside
//   allgreen  outro: the whole matrix switches on in a cascade, traffic everywhere
import * as THREE from 'three';
import { PAL, GROUPS, POLICY, BEAT } from '../config.js';
import { V, clamp, lerp, smooth, hash, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';
import { hdr, textPlane, glowRing, floorGrid, ease, noise1, MONO } from '../world.js';

const N = 5, CS = 1.8, GAP = 0.22, PITCH = CS + GAP, GATE_Z = 9;
const cellPos = (r, c) => V((c - (N - 1) / 2) * PITCH, ((N - 1) / 2 - r) * PITCH + 5.2, 0);
const EMP = 0, SRV = 1, UNK = 4;
const lin3 = (c, k = 1) => { const x = hdr(c, k); return [x.r, x.g, x.b]; };

function curtainMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uCol: { value: hdr('deny', 1) }, uOpen: { value: 0 }, uT: { value: 0 }, uA: { value: 1 }, uHit: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uCol; uniform float uOpen, uT, uA, uHit; varying vec2 vP;
      float hexd(vec2 p){ p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.732))), p.x); }
      void main(){
        float r = length(vP);
        vec2 p = vP * 3.2; vec2 s = vec2(1.0, 1.732), h = s * 0.5;
        vec2 a = mod(p, s) - h, b = mod(p - h, s) - h; vec2 g = dot(a, a) < dot(b, b) ? a : b;
        float edge = smoothstep(0.42, 0.5, hexd(g));
        float open = smoothstep(uOpen * 3.4 - 0.4, uOpen * 3.4, r);   // dissolves from the centre outwards
        float shimmer = 0.5 + 0.5 * sin(r * 8.0 - uT * 4.0);
        float hit = uHit * exp(-r * 0.8);
        gl_FragColor = vec4(uCol * (edge * (0.5 + 0.5 * shimmer) + 0.08 + hit * 2.0) * open * uA * smoothstep(3.2, 2.9, r), 1.0);
      }`,
  });
}

export class MatrixZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    const sc = this.scene = new THREE.Scene();
    sc.fog = new THREE.FogExp2(0x02050a, 0.018);
    this.clear = 0x010306; this.speedRef = 12; this.bloom = 0.11;
    this.floor = floorGrid({ cell: 1, major: 5, color: '#0a1e2c', fade: 0.04 }); this.floor.position.y = -1; sc.add(this.floor);
    // cells
    this.cells = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const g = new THREE.Group(); g.position.copy(cellPos(r, c)); sc.add(g);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(CS, CS), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(CS, CS, 0.25)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      const ok = POLICY[r][c] === 1;
      const txt = textPlane(ok ? 'PERMIT' : 'DENY', { h: 0.26, color: ok ? PAL.permit : PAL.deny, k: 2.5, font: `700 72px ${MONO}` }); txt.position.z = 0.14;
      g.add(face, edge, txt);
      this.cells.push({ r, c, g, face, edge, txt, ok });
    }
    // headers
    this.rowLbl = GROUPS.map((gr, r) => { const l = textPlane(`${gr.sgt} ${gr.name}`, { h: 0.36, color: PAL[gr.key], k: 2.2, font: `700 72px ${MONO}`, align: 'right' }); l.position.copy(cellPos(r, 0)).add(V(-CS / 2 - 0.35, 0, 0)); sc.add(l); return l; });
    this.colLbl = GROUPS.map((gr, c) => { const l = textPlane(`${gr.sgt} ${gr.name}`, { h: 0.3, color: PAL[gr.key], k: 2.2, font: `700 72px ${MONO}` }); l.position.copy(cellPos(0, c)).add(V(0, CS / 2 + 0.4, 0)); sc.add(l); return l; });
    const src = textPlane('SOURCE SGT', { h: 0.3, color: PAL.dim, k: 1.6, font: `600 64px ${MONO}` }); src.position.copy(cellPos(2, 0)).add(V(-CS / 2 - 3.9, 0, 0)); src.rotation.z = Math.PI / 2; sc.add(src);
    const dst = textPlane('DESTINATION SGT', { h: 0.3, color: PAL.dim, k: 1.6, font: `600 64px ${MONO}` }); dst.position.copy(cellPos(0, 2)).add(V(0, CS / 2 + 1.05, 0)); sc.add(dst);
    const ttl = textPlane('SGACL · EGRESS POLICY', { h: 0.42, color: PAL.text, k: 1.8, font: `600 72px ${MONO}` }); ttl.position.copy(cellPos(0, 2)).add(V(0, CS / 2 + 1.75, 0)); sc.add(ttl);
    // highlight beams for row / column
    this.rowBeam = new THREE.Mesh(new THREE.PlaneGeometry(N * PITCH + 0.4, CS + 0.3), new THREE.MeshBasicMaterial({ color: hdr('employee', 0.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); this.rowBeam.position.z = -0.05; sc.add(this.rowBeam);
    this.colBeam = new THREE.Mesh(new THREE.PlaneGeometry(CS + 0.3, N * PITCH + 0.4), new THREE.MeshBasicMaterial({ color: hdr('server', 0.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); this.colBeam.position.z = -0.05; sc.add(this.colBeam);
    // gate
    this.gate = new THREE.Group(); this.gate.position.set(0, 3.2, GATE_Z); sc.add(this.gate);
    this.gateRing = glowRing(3.25, 0.09, 'deny', 3, 160); this.gate.add(this.gateRing);
    this.gateRing2 = glowRing(3.55, 0.025, 'deny', 2, 160); this.gate.add(this.gateRing2);
    this.curtain = new THREE.Mesh(new THREE.CircleGeometry(3.2, 96), curtainMaterial()); this.gate.add(this.curtain);
    const gl = textPlane('EGRESS · ENFORCEMENT', { h: 0.3, color: PAL.dim, k: 1.6, font: `600 64px ${MONO}` }); gl.position.set(0, -3.95, 0); this.gate.add(gl);
    // actors
    this.hero = new Packet({ color: PAL.employee, sgt: 10, scale: 0.5 }); sc.add(this.hero.group);
    this.unknown = new Packet({ color: PAL.unknown, scale: 0.5 }); sc.add(this.unknown.group);
    this.pts = new GlowPoints(2600); sc.add(this.pts.mesh);
    this.camPos = V(0, 4, 20);
  }

  cellState(t, shot) {
    // returns fn(cell) → { col, k, text } for the current mode
    const TL = this.tl, mode = shot.mode, kick = TL.kick(t), b = TL.beat(t);
    const base = (cell) => ({ col: '#2a4a60', k: 0.12, edge: 0.9, text: 0 });
    if (mode === 'permit') {
      const rowOn = t >= TL.seg(32).start, colOn = t >= TL.seg(33).start, match = TL.seg(34).start, perm = TL.seg(35).start;
      return (cell) => {
        const s = base(cell);
        if (rowOn && cell.r === EMP) { s.col = PAL.employee; s.k = 0.14; s.edge = 2.6; }
        if (colOn && cell.c === SRV) { s.col = PAL.server; s.k = 0.14; s.edge = 2.6; }
        if (cell.r === EMP && cell.c === SRV && t >= match) {
          const a = t - match; s.col = t >= perm ? PAL.permit : '#ffffff'; s.k = 0.6 + 2.5 * Math.exp(-a / 0.4) + (t >= perm ? 1.2 * Math.exp(-(t - perm) / 0.5) + 0.5 : 0); s.edge = 5; s.text = t >= perm ? 1 : 0;
        }
        return s;
      };
    }
    if (mode === 'teaser' || mode === 'traffic' || mode === 'allgreen') {
      const cascade = mode === 'allgreen' && !shot.id.startsWith('fin') ? shot.t[0] : -1e9;
      return (cell) => {
        const i = cell.r * N + cell.c, on = t >= cascade + i * BEAT * 0.25;
        const s = base(cell);
        if (!on) return s;
        const hit = hash(i, b.index) > (mode === 'teaser' ? 0.8 : 0.55) ? Math.exp(-b.phase * BEAT / 0.18) : 0;
        s.col = cell.ok ? PAL.permit : PAL.deny; s.k = (mode === 'allgreen' ? 0.2 : mode === 'teaser' ? 0.06 : 0.12) + hit * 1.1; s.edge = 1.4 + hit * 3; s.text = mode === 'teaser' ? hit : 1;
        return s;
      };
    }
    if (mode === 'nomatch' || mode === 'deny') {
      const scan = mode === 'nomatch' ? ((t - shot.t[0]) / (BEAT * 4)) % 1 : 1;
      const denyAt = TL.seg(53).start, slam = TL.seg(54).start;
      return (cell) => {
        const s = base(cell);
        if (cell.r === UNK) {
          s.col = '#8a949e'; s.edge = 1.6; s.k = 0.06;
          const sx = Math.abs(scan * N - 0.5 - cell.c) < 0.5; if (mode === 'nomatch' && sx) { s.k = 0.25 + 0.25 * kick; s.edge = 3.5; }
          if (mode === 'deny' && t >= denyAt && cell.c === EMP) { s.col = PAL.deny; s.k = 0.6 + 2 * Math.exp(-(t - denyAt) / 0.4) + (t >= slam ? 0.6 : 0); s.edge = 5; s.text = 1; }
        } else { s.col = '#1a2a36'; s.k = 0.06; s.edge = 0.5; }
        return s;
      };
    }
    if (mode === 'gate') return (cell) => { const s = base(cell); if (cell.r === EMP) { s.col = PAL.employee; s.k = 0.2; s.edge = 1.8; } if (cell.r === EMP && cell.c === SRV) { s.col = PAL.permit; s.k = 0.5 + kick; s.edge = 4; s.text = 1; } return s; };
    return base;
  }

  update(t, shot, tl) {
    this.camPos = this.camera(shot, tl).pos;
    const TL = this.tl, mode = shot.mode, kick = TL.kick(t);
    const st = this.cellState(t, shot);
    for (const cell of this.cells) {
      const s = st(cell);
      cell.face.material.color.copy(hdr(s.col, s.k * (1 + 0.3 * kick)));
      cell.edge.material.color.copy(hdr(s.col === '#2a4a60' ? '#5d8fb0' : s.col, s.edge));
      cell.txt.visible = s.text > 0.01; cell.txt.material.opacity = s.text;
    }
    // row/column beams
    const rowA = mode === 'permit' ? smooth(TL.span(t, TL.seg(32).start, TL.seg(32).start + 0.3)) : mode === 'nomatch' || mode === 'deny' ? 1 : 0;
    const colA = mode === 'permit' ? smooth(TL.span(t, TL.seg(33).start, TL.seg(33).start + 0.3)) : 0;
    const rowIdx = mode === 'permit' ? EMP : UNK;
    this.rowBeam.visible = rowA > 0; this.rowBeam.position.copy(cellPos(rowIdx, 2)).setZ(-0.05);
    this.rowBeam.material.color.copy(hdr(mode === 'permit' ? 'employee' : '#8a949e', 0.25 * rowA * (1 + kick)));
    this.colBeam.visible = colA > 0; this.colBeam.position.copy(cellPos(2, SRV)).setZ(-0.05);
    this.colBeam.material.color.copy(hdr('server', 0.25 * colA * (1 + kick)));
    // gate state
    const cu = this.curtain.material.uniforms; cu.uT.value = t;
    let gateCol = 'deny', open = 0, hitK = 0, gateVis = ['permit', 'deny', 'gate', 'nomatch'].includes(mode);
    if (mode === 'permit') { const p = TL.seg(35).start; gateCol = t >= p ? 'permit' : 'deny'; open = ease.out(TL.span(t, p, p + 0.6)); }
    if (mode === 'gate') { const o = TL.seg(66).start; gateCol = t >= o ? 'permit' : 'employee'; open = ease.out(TL.span(t, o, o + 0.5)); }
    if (mode === 'deny') { const slam = TL.seg(54).start; hitK = t >= slam ? Math.exp(-(t - slam) / 0.4) : 0; }
    this.gate.visible = gateVis && !(mode === 'permit' && t < TL.seg(34).start + 0.8);
    cu.uCol.value.copy(hdr(gateCol, 1.2)); cu.uOpen.value = open; cu.uHit.value = hitK;
    cu.uA.value = mode === 'permit' ? 0.1 + 0.9 * smooth(TL.span(t, TL.seg(34).start + 1, TL.seg(35).start)) : 1;
    this.gateRing.material.color.copy(hdr(gateCol, 3 + 3 * kick + 6 * hitK)); this.gateRing2.material.color.copy(hdr(gateCol, 1.5 + kick));
    this.gateRing.rotation.z = t * 0.3; this.gateRing2.rotation.z = -t * 0.2;
    // actors
    this.hero.group.visible = mode === 'permit' || mode === 'gate';
    this.unknown.group.visible = mode === 'nomatch' || mode === 'deny';
    const P = this.pts; P.begin();
    if (mode === 'permit') {
      const p = TL.seg(35).start, a = t - p;
      const z = t < p ? lerp(22, GATE_Z + 3.5, ease.out(TL.span(t, shot.t[0], shot.t[0] + 3))) : lerp(GATE_Z + 3.5, 0.4, ease.in(clamp(a / 1.4)));
      const target = cellPos(EMP, SRV);
      const k = t < p ? 0 : ease.inOut(clamp(a / 1.4));
      this.hero.group.position.set(lerp(0, target.x, k), lerp(3.2, target.y, k) + Math.sin(t * 1.4) * 0.1, z);
      this.hero.set({ t, band: 1, bandSpin: 1.5, core: 0.9 + 0.5 * kick, ip: 0, camPos: this.camPos });
      if (a > 1.4) this.burst(P, target, 'permit', a - 1.4, 1);
    }
    if (mode === 'gate') {
      const o = TL.seg(66).start, a = t - o, ipAt = TL.seg(65).start;
      const z = t < o ? lerp(24, GATE_Z + 2.8, ease.out(TL.span(t, shot.t[0], o))) : lerp(GATE_Z + 2.8, -4, ease.in(clamp(a / 1.6)));
      this.hero.group.position.set(0, 3.2 + Math.sin(t * 1.4) * 0.1, z);
      // the IP label: highlighted on "Nicht deine IP …", stripped off at the gate and left falling outside
      const ipHi = smooth(TL.span(t, ipAt, ipAt + 0.4));
      this.hero.set({ t, band: 1, bandSpin: 1.8, core: 0.9 + 0.5 * kick, ip: t < o ? 1 : 0, ipText: '10.20.31.44', ipDim: 0.7 + 0.6 * ipHi, camPos: this.camPos });
      if (t >= o) {
        // detached label as particles of text-coloured dust falling in front of the gate
        for (let j = 0; j < 40; j++) { const q = V((hash(j, 1) - 0.5) * 1.6, 3.2 - 1.1 - a * a * 2.5 * (0.5 + hash(j, 2)), GATE_Z + 2.9 + hash(j, 3) * 0.3); P.add(q, 0.018, lin3(PAL.text, 1.4), 0.5 * clamp(1 - a / 2.5)); }
        this.burst(P, V(0, 3.2, GATE_Z), 'permit', a, 0.6);
      }
    }
    if (mode === 'nomatch' || mode === 'deny') {
      const slam = TL.seg(54).start, a = t - slam;
      const gq = Math.floor(t * 12), gl = hash(gq, 7) > 0.7 ? 1 : 0;
      let z = mode === 'nomatch' ? lerp(22, GATE_Z + 5, ease.out(TL.span(t, shot.t[0], shot.t[1]))) : lerp(GATE_Z + 5, GATE_Z + 0.4, ease.in(TL.span(t, shot.t[0] + 0.6, slam)));
      this.unknown.group.visible = !(mode === 'deny' && a > 0);
      this.unknown.group.position.set(gl * (hash(gq, 1) - 0.5) * 0.6, 3.2 + gl * (hash(gq, 2) - 0.5) * 0.3, z);
      this.unknown.set({ t, rings: 0, core: 0.35 + 0.3 * gl });
      if (mode === 'deny' && a > 0) this.shatter(P, V(0, 3.2, GATE_Z + 0.4), a);
      this.fx.sat = 0.45; this.fx.glitch = mode === 'deny' ? 1.1 * Math.exp(-Math.max(0, a) / 0.3) * (a > 0 ? 1 : 0) + 0.04 : 0.06;
      if (mode === 'deny') this.fx.exposure = 1 + 1.2 * Math.exp(-Math.max(0, a) / 0.2) * (a > 0 ? 1 : 0);
    }
    if (mode === 'traffic' || mode === 'allgreen' || mode === 'teaser') this.traffic(P, t, mode);
    // ambient dust
    for (let j = 0; j < 200; j++) P.add(V((hash(j, 1) - 0.5) * 50, hash(j, 2) * 20 - 1, (hash(j, 3) - 0.8) * 40 + ((t * 0.4 * (0.5 + hash(j, 4))) % 4)), 0.02, lin3('#7fb3d5', 0.8), 0.25 * hash(j, 5));
    P.end();
    this.floor.material.uniforms.uPulse.value = kick * 0.6;
    this.floor.material.uniforms.uAcc.value.copy(hdr(mode === 'deny' || mode === 'nomatch' ? 'deny' : 'permit', 1));
  }

  burst(P, at, col, a, k) {
    if (a > 1.2) return;
    for (let j = 0; j < 70; j++) { const d = V(hash(j, 1) - 0.5, hash(j, 2) - 0.5, hash(j, 3) - 0.5).normalize(); P.add(at.clone().add(d.clone().multiplyScalar(ease.out(a / 0.9) * (1.5 + hash(j, 4) * 2.5))), 0.04, lin3(col, 4 * k), clamp(1 - a / 1.1), d.multiplyScalar(0.3)); }
  }
  // the unknown packet shatters into hex shards (fast outward, then drifting and falling)
  shatter(P, at, a) {
    for (let j = 0; j < 220; j++) {
      const d = V(hash(j, 1) - 0.5, hash(j, 2) - 0.5, hash(j, 3) * 0.8 + 0.2).normalize();
      const sp = 3 + hash(j, 4) * 9, r = sp * (1 - Math.exp(-a * 2.2)) / 2.2;
      const p = at.clone().add(d.clone().multiplyScalar(r)); p.y -= a * a * 0.6;
      const col = hash(j, 5) > 0.35 ? lin3('#b9c3cc', 2.2) : lin3('deny', 4);
      P.add(p, 0.025 + 0.03 * hash(j, 6), col, clamp(1 - a / 5.5) * (0.5 + 0.5 * hash(j, 7)), d.multiplyScalar(Math.max(0.05, 0.6 * Math.exp(-a * 2))));
    }
  }
  // flows: packets fly from behind the camera into their cell; permit continues through, deny sparks red
  traffic(P, t, mode) {
    const n = mode === 'teaser' ? 50 : 120;
    for (let i = 0; i < n; i++) {
      const r = Math.floor(hash(i, 1) * 4), c = Math.floor(hash(i, 2) * 5), ok = POLICY[r][c] === 1;
      const period = 1.6 + hash(i, 3) * 1.2, ph = ((t + hash(i, 4) * period) % period) / period;
      const cp = cellPos(r, c), start = V(cp.x * 0.3 + (hash(i, 5) - 0.5) * 12, cp.y * 0.5 + 2, 26);
      const col = lin3(GROUPS[r].key, 3.5);
      if (ph < 0.7) {
        const u = ease.in(ph / 0.7); P.add(start.clone().lerp(cp, u), 0.06, col, 0.9, V(0, 0, 1.2));
      } else {
        const a = (ph - 0.7) * period;
        if (ok) P.add(cp.clone().add(V(0, 0, -a * 20)), 0.06, lin3('permit', 3), clamp(1 - a * 2), V(0, 0, 1.2));
        else for (let j = 0; j < 6; j++) { const d = V(hash(i, j) - 0.5, hash(j, i) - 0.5, 0.6).normalize(); P.add(cp.clone().add(d.multiplyScalar(a * 4)), 0.03, lin3('deny', 4), clamp(1 - a * 2.5)); }
      }
    }
  }

  camera(shot, tl) {
    const TL = this.tl, t = shot.t[0] + tl, mode = shot.mode, d = shot.t[1] - shot.t[0];
    const wall = V(0, 5.2, 0);
    if (mode === 'permit') {
      // wide → row → column → cell → follow through the gate
      const k1 = ease.inOut(TL.span(t, TL.seg(32).start - 0.2, TL.seg(32).start + 0.8));
      const k2 = ease.inOut(TL.span(t, TL.seg(33).start - 0.2, TL.seg(33).start + 0.8));
      const k3 = ease.inOut(TL.span(t, TL.seg(34).start - 0.1, TL.seg(34).start + 0.6));
      const k4 = ease.inOut(TL.span(t, TL.seg(35).start, TL.seg(35).start + 1.6));
      const cell = cellPos(EMP, SRV);
      let pos = V(0, 4.5, 26), tgt = V(0, 4.2, 0);
      pos.lerp(V(-9, cellPos(EMP, 0).y + 1, 11), k1); tgt.lerp(cellPos(EMP, 1), k1);
      pos.lerp(V(cell.x + 5, 1.5, 10), k2); tgt.lerp(cellPos(2, SRV), k2);
      pos.lerp(V(cell.x + 1.4, cell.y + 0.6, 5.2), k3); tgt.lerp(cell, k3);
      pos.lerp(V(1.5, 4.2, GATE_Z + 7), k4); tgt.lerp(V(cell.x, 3.6, 0), k4);
      return { pos, target: tgt, fov: 40 };
    }
    if (mode === 'teaser') { const k = ease.inOut(tl / d); return { pos: V(lerp(-14, 12, k), lerp(9, 5, k), lerp(8, 11, k)), target: V(lerp(-4, 4, k), 4.8, 0), fov: 44 }; }
    if (mode === 'traffic' || (mode === 'allgreen' && shot.id.startsWith('fin'))) {
      const b = TL.beat(t), bar = Math.floor(b.b / 4), ph = b.b / 4 - bar;
      const side = (n) => (hash(n, 21) - 0.5) * 16, sw = lerp(side(bar - 1), side(bar), ease.out(ph / 0.15 * 0.6));
      return { pos: V(sw, 6 + noise1(t * 0.4, 5) * 2, 17 + noise1(t * 0.3, 6) * 3), target: wall, fov: 46 };
    }
    if (mode === 'allgreen') { const a = -0.7 + tl * 0.09, dd = 14 + tl * 1.1; return { pos: V(Math.sin(a) * dd, 6 + tl * 0.4, Math.cos(a) * dd), target: wall, fov: 44 }; }
    if (mode === 'nomatch') {
      const k = tl / d, sway = noise1(t * 0.6, 8);
      return { pos: V(-6 + k * 9 + sway, 1.5 + k * 1.5, GATE_Z + 12 - k * 3), target: V(cellPos(UNK, 2).x, cellPos(UNK, 2).y + 1, 0), fov: 42 };
    }
    if (mode === 'deny') {
      const slam = TL.seg(54).start, a = Math.max(0, t - slam);
      return { pos: V(3.5 - a * 0.3, 3.8 + a * 0.2, GATE_Z + 9 + a * 0.6), target: V(0, 3.4, GATE_Z - 1), fov: 42 };
    }
    // gate
    const o = TL.seg(66).start, k = ease.inOut(TL.span(t, o, o + 1.8));
    return { pos: V(lerp(2.8, 1.2, k), lerp(3.8, 4.4, k), lerp(GATE_Z + 8.5 - tl * 0.25, GATE_Z + 5, k)), target: V(0, 3.2, lerp(GATE_Z, -6, k)), fov: 40 };
  }
}
