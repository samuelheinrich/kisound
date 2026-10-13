// The whole segmented network from above: a core in the centre, four group islands around it, traffic arcs only
// between group pairs the SGACL policy permits, an enforcement perimeter at the edge. Modes:
//   build   status panel: five checks fill with the system messages while the camera cranes up
//   final   the drop: every island and allowed flow ignites, the camera swoops over the network
//   deny    the unknown tries to get in twice at the perimeter and is thrown back
//   end     finale bar: fast pull-back over the whole network
import * as THREE from 'three';
import { PAL, GROUPS, POLICY } from '../config.js';
import { V, clamp, lerp, smooth, hash, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';
import { hdr, device, setDeviceGlow, textPlane, glowRing, floorGrid, ease, MONO } from '../world.js';

const G4 = GROUPS.slice(0, 4), R_ISL = 22, R_PER = 46;
const islandPos = (i) => { const a = Math.PI / 4 + i * Math.PI / 2; return V(Math.cos(a) * R_ISL, 0, Math.sin(a) * R_ISL); };
const lin3 = (c, k = 1) => { const x = hdr(c, k); return [x.r, x.g, x.b]; };

export class OverviewZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    const sc = this.scene = new THREE.Scene();
    sc.fog = new THREE.FogExp2(0x02050a, 0.008);
    sc.environment = ctx.env; sc.environmentIntensity = 0.3;
    this.clear = 0x010306; this.near = 0.2; this.far = 900; this.speedRef = 40; this.bloom = 0.11;
    sc.add(new THREE.HemisphereLight(0x3d6a90, 0x020304, 0.5));
    this.floor = floorGrid({ cell: 2, major: 5, color: '#0a1c2a', fade: 0.012, size: 1600 }); sc.add(this.floor);
    // core: stacked rings + a column
    this.core = new THREE.Group(); sc.add(this.core);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 7, 6), new THREE.MeshStandardMaterial({ color: 0x0b1117, metalness: 0.8, roughness: 0.35 })); col.position.y = 3.5; this.core.add(col);
    this.coreRings = [1, 3, 5].map((y, i) => { const r = glowRing(2.2 + i * 0.4, 0.05, 'ise', 3); r.rotation.x = Math.PI / 2; r.position.y = y; this.core.add(r); return r; });
    this.coreGlow = glowRing(5, 0.06, 'employee', 2); this.coreGlow.rotation.x = Math.PI / 2; this.coreGlow.position.y = 0.05; this.core.add(this.coreGlow);
    // islands
    this.islands = G4.map((g, i) => {
      const grp = new THREE.Group(); grp.position.copy(islandPos(i)); sc.add(grp);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.4, 0.8, 64), new THREE.MeshStandardMaterial({ color: 0x0b1117, roughness: 0.35, metalness: 0.8 })); disc.position.y = -0.4; grp.add(disc);
      const rim = glowRing(6.1, 0.08, g.key, 3); rim.rotation.x = Math.PI / 2; rim.position.y = 0.02; grp.add(rim);
      const ds = [];
      for (let k = 0; k < 6; k++) { const d = device(g.device, g.key); const a = (k / 6) * Math.PI * 2; d.position.set(Math.cos(a) * 3.4, 0, Math.sin(a) * 3.4); d.rotation.y = -a + Math.PI / 2; d.scale.setScalar(1.3); grp.add(d); ds.push(d); }
      const lbl = textPlane(`SGT ${g.sgt} · ${g.name}`, { h: 1.3, color: PAL[g.key], k: 2.4, font: `700 72px ${MONO}` }); lbl.position.set(0, 5.5, 0); grp.add(lbl);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 80, 12, 1, true), new THREE.MeshBasicMaterial({ color: hdr(g.key, 1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); beam.position.y = 40; grp.add(beam);
      return { grp, rim, ds, lbl, beam, g };
    });
    // flows: arcs between allowed group pairs (and to the core)
    this.flows = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (!POLICY[r][c] || r === c) continue;
      const a = islandPos(r), b = islandPos(c), mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 7 + 3 * hash(r, c);
      const side = V(-(b.z - a.z), 0, b.x - a.x).normalize().multiplyScalar(2.2); // two directions of a pair don't overlap
      const curve = new THREE.QuadraticBezierCurve3(a.clone().add(V(0, 1.5, 0)).add(side), mid.add(side), b.clone().add(V(0, 1.5, 0)).add(side));
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.06, 6), new THREE.MeshBasicMaterial({ color: hdr(G4[r].key, 1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      sc.add(tube); this.flows.push({ r, c, curve, tube });
    }
    // perimeter + gate
    this.perim = glowRing(R_PER, 0.12, 'ise', 1.5, 256); this.perim.rotation.x = Math.PI / 2; this.perim.position.y = 0.05; sc.add(this.perim);
    this.gateP = V(0, 3.5, R_PER);
    this.gate = glowRing(3.2, 0.1, 'deny', 3); this.gate.position.copy(this.gateP); sc.add(this.gate);
    this.unknown = new Packet({ color: PAL.unknown, scale: 0.8 }); sc.add(this.unknown.group);
    // status panel (build)
    this.panel = this.buildPanel(); sc.add(this.panel);
    this.pts = new GlowPoints(3000); sc.add(this.pts.mesh);
    this.camPos = V(0, 30, 60);
  }

  buildPanel() {
    const g = new THREE.Group(); g.position.set(0, 12, 8);
    const names = ['IDENTITY', 'SGT', 'SGT-ACL', 'POLICY', 'NETWORK'];
    const head = textPlane('TRUSTSEC · STATUS', { h: 0.55, color: PAL.dim, k: 1.8, font: `600 72px ${MONO}`, align: 'left' }); head.position.set(-5.2, 3.6, 0); g.add(head);
    this.checks = names.map((n, i) => {
      const y = 2.4 - i * 1.25;
      const lbl = textPlane(n, { h: 0.55, color: PAL.text, k: 1.8, font: `600 72px ${MONO}`, align: 'left' }); lbl.position.set(-5.2, y, 0);
      const track = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 0.34), new THREE.MeshBasicMaterial({ color: hdr('#1b3446', 1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); track.position.set(1.7, y, 0);
      const fill = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 0.34).translate(2.8, 0, 0), new THREE.MeshBasicMaterial({ color: hdr('permit', 2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); fill.position.set(1.7 - 2.8, y, 0.01);
      const ok = textPlane('OK', { h: 0.55, color: PAL.permit, k: 3, font: `700 72px ${MONO}`, align: 'left' }); ok.position.set(4.9, y, 0.02);
      g.add(lbl, track, fill, ok);
      return { lbl, fill, ok };
    });
    return g;
  }

  update(t, shot, tl) {
    this.camPos = this.camera(shot, tl).pos;
    const TL = this.tl, mode = shot.mode, kick = TL.kick(t), low = TL.env('low', t);
    const ignite = mode === 'build' ? 0.25 : 1;
    const drop = mode === 'final' ? Math.exp(-tl / 0.5) : 0;
    // islands + devices
    this.islands.forEach((o, i) => {
      o.rim.material.color.copy(hdr(o.g.key, (2 + 4 * kick + 6 * drop) * ignite));
      o.ds.forEach((d, k) => setDeviceGlow(d, PAL[o.g.key], (1.2 + (hash(k, TL.beat(t).index + i) > 0.7 ? 2 : 0)) * ignite));
      o.beam.material.color.copy(hdr(o.g.key, (0.4 + 1.2 * kick) * ignite * (mode === 'build' ? 0 : 1)));
      o.lbl.lookAt(this.camPos);
    });
    this.flows.forEach((f) => f.tube.material.color.copy(hdr(G4[f.r].key, (0.35 + 0.5 * kick + 3 * drop) * (mode === 'build' ? 0.15 : 1))));
    this.coreRings.forEach((r, i) => { r.material.color.copy(hdr('ise', 2 + 3 * kick)); r.rotation.z = t * (0.4 + i * 0.3); });
    this.coreGlow.material.color.copy(hdr('employee', 2 + 4 * kick + 8 * drop));
    this.floor.material.uniforms.uPulse.value = kick * 0.35; this.floor.material.uniforms.uGain.value = 0.6;
    this.floor.material.uniforms.uRing.value = mode === 'final' && tl < 3 ? tl * 30 : 0;
    this.floor.material.uniforms.uRingCol.value.copy(hdr('employee', 2.5 * clamp(1 - tl / 3)));
    this.perim.material.color.copy(hdr(mode === 'deny' ? 'deny' : 'ise', 1.2 + kick));
    // status panel: visible in build, fifth check lands early in final, then the panel flies up and fades
    const panelA = mode === 'build' ? 1 : mode === 'final' ? 1 - smooth(TL.span(t, TL.seg(71).end + 0.3, TL.seg(71).end + 1.3)) : 0;
    this.panel.visible = panelA > 0.01;
    if (this.panel.visible) {
      this.panel.lookAt(this.camPos);
      this.panel.position.y = 12 + (mode === 'final' ? tl * tl * 1.5 : 0);
      this.checks.forEach((c, i) => {
        const s = TL.seg(67 + i), a = TL.span(t, s.start, s.start + 0.5);
        c.fill.scale.x = Math.max(0.001, ease.out(a));
        c.fill.material.color.copy(hdr('permit', (1.2 + 3 * Math.exp(-Math.max(0, t - s.start - 0.5) / 0.3) * (a >= 1 ? 1 : 0)) * panelA));
        c.ok.visible = a >= 1; c.ok.material.opacity = panelA; c.lbl.material.opacity = panelA * (a > 0 ? 1 : 0.45);
      });
    }
    // unknown at the perimeter (deny)
    const P = this.pts; P.begin();
    this.unknown.group.visible = mode === 'deny';
    this.gate.visible = mode === 'deny' || mode === 'final';
    let hit = 0;
    if (mode === 'deny') {
      const hits = [81, 83].map((id) => TL.seg(id).start);
      let z = R_PER + 14;
      for (const h of hits) {
        const a = t - h;
        if (a > -1.6 && a < 0) z = lerp(R_PER + 14, R_PER + 1.2, ease.in((a + 1.6) / 1.6));
        if (a >= 0 && a < 2.4) { z = R_PER + 1.2 + ease.out(a / 0.8) * 13; hit = Math.max(hit, Math.exp(-a / 0.35)); this.spark(P, this.gateP, a); }
      }
      const gq = Math.floor(t * 12), gl = hash(gq, 7) > 0.7 ? 1 : 0;
      this.unknown.group.position.set(gl * (hash(gq, 1) - 0.5) * 0.8, 3.5, z);
      this.unknown.set({ t, rings: 0, core: 0.35 + 0.3 * gl });
      this.fx.glitch = 0.9 * hit; this.fx.exposure = 1 + 0.6 * hit;
    }
    this.gate.material.color.copy(hdr('deny', 2 + 10 * hit + kick));
    this.gate.scale.setScalar(1 + 0.3 * hit);
    // traffic along the allowed flows
    if (mode !== 'build') {
      for (const f of this.flows) for (let j = 0; j < 14; j++) {
        const sp = 0.35 + hash(f.r * 5 + f.c, j) * 0.3, u = (t * sp + j / 14 + hash(f.r, f.c)) % 1;
        P.add(f.curve.getPointAt(u), 0.16, lin3(G4[f.r].key, 3.5), 0.9, f.curve.getTangentAt(u).multiplyScalar(0.8));
      }
      // denied attempts: short red sparks between islands that may not talk (printer → employee etc.)
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        if (POLICY[r][c] || r === c) continue;
        const b = TL.beat(t), id = b.index + r * 7 + c * 3;
        if (hash(id, 9) > 0.8) { const a = islandPos(r), dir = islandPos(c).sub(a).normalize(); const u = b.phase; const p = a.clone().add(dir.multiplyScalar(6.5 + u * 3)); p.y = 1.5; P.add(p, 0.12, lin3('deny', 4), clamp(1 - u * 1.3), dir.multiplyScalar(0.8)); }
      }
    }
    // ambient sparks rising from the core
    for (let j = 0; j < 160; j++) { const a = hash(j, 1) * 6.283, r = 1 + hash(j, 2) * 4, y = ((t * (1 + hash(j, 3) * 2) + hash(j, 4) * 20) % 20); P.add(V(Math.cos(a) * r, y, Math.sin(a) * r), 0.035, lin3('employee', 2), 0.4 * (1 - y / 20) * ignite); }
    P.end();
  }

  spark(P, at, a) {
    for (let j = 0; j < 160; j++) {
      const d = V(hash(j, 1) - 0.5, hash(j, 2) - 0.3, 0.4 + hash(j, 3)).normalize();
      const r = (6 + hash(j, 4) * 12) * (1 - Math.exp(-a * 3)) / 3;
      P.add(at.clone().add(d.clone().multiplyScalar(r)), 0.07, lin3('deny', 4), clamp(1 - a / 1.6), d.multiplyScalar(0.8));
    }
  }

  camera(shot, tl) {
    const TL = this.tl, t = shot.t[0] + tl, mode = shot.mode, d = shot.t[1] - shot.t[0];
    if (mode === 'build') {
      const k = ease.inOut(tl / d);
      return { pos: V(lerp(3, 0, k), lerp(9, 22, k * k), lerp(24, 30, k)), target: V(0, lerp(10.5, 9, k * k), 0), fov: lerp(38, 44, k) };
    }
    if (mode === 'final') {
      // big orbit; every two bars a swoop down towards the islands and back up
      const b = TL.beat(t), ph = (b.b / 8) % 1, swoop = Math.sin(Math.PI * ph) ** 2;
      const a = tl * 0.2 + 0.4, R = lerp(58, 34, swoop), h = lerp(46, 12, swoop);
      return { pos: V(Math.sin(a) * R, h, Math.cos(a) * R), target: V(0, lerp(0, 4, swoop), 0), fov: 50 };
    }
    if (mode === 'deny') {
      // near the gate for each attempt, high and wide in between
      const near = Math.max(...[81, 83].map((id) => { const s = TL.seg(id).start; return smooth(TL.span(t, s - 2.2, s - 1.2)) * (1 - smooth(TL.span(t, s + 1.4, s + 2.6))); }));
      const a = 0.25 + tl * 0.05;
      const far = V(Math.sin(a) * 70, 40, Math.cos(a) * 70);
      const close = V(9, 6.5, R_PER + 16);
      return { pos: far.lerp(close, near), target: V(0, 0, 0).lerp(V(0, 3.5, R_PER + 2), near), fov: 48 };
    }
    // end: fast pull back
    const k = ease.in(tl / d);
    return { pos: V(Math.sin(0.5 + k) * lerp(30, 140, k), lerp(20, 120, k), Math.cos(0.5 + k) * lerp(30, 140, k)), target: V(0, 0, 0), fov: 50 };
  }
}
