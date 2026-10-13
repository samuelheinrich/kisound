// The fabric: an endless digital landscape. Lanes every 6 units carry light pulses (traffic), rack towers stand
// between the lanes. The camera either flies low through the canyons or looks at a staged set piece.
// Modes:
//   launch   the first drop: chase flight behind the hero packet
//   devices  four clients receive their group colour, one per bar
//   groups   four islands rise ("Client oder Server, Phone oder Print"), pillars of light on "Jeder bekommt …"
//   islands  Source group ↔ destination group: a light bridge with policy checkpoints
//   flow     fast flight; on "Deine Identität bestimmt den Ort" the traffic sorts itself by colour per lane
//   return   flight towards the server beacon; the route lights up ahead ("Die Policy sagt, wohin es geht")
//   victory  outro: flight with bar-wise climbs above the towers, everything green and alive
import * as THREE from 'three';
import { PAL, GROUPS, BEAT } from '../config.js';
import { V, clamp, lerp, smooth, hash, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';
import { hdr, device, setDeviceGlow, textPlane, glowTube, glowRing, ease, noise1, MONO } from '../world.js';

const CELL = 6, LANE_X = 3, WIN = 13; // tower window: ±WIN cells around the camera
const G4 = GROUPS.slice(0, 4);
const lin3 = (c, k = 1) => { const x = hdr(c, k); return [x.r, x.g, x.b]; };
const FLY = ['launch', 'flow', 'return', 'victory'];

function groundMaterial() {
  const u = { uT: { value: 0 }, uKick: { value: 0 }, uSort: { value: 0 }, uGreen: { value: 0 }, uSpeed: { value: 14 }, uCam: { value: new THREE.Vector2() }, uRoute: { value: 0 }, uRouteZ: { value: new THREE.Vector2() }, uBase: { value: hdr('#0d3350', 1) }, uGain: { value: 1 } };
  G4.forEach((g, i) => (u[`uC${i}`] = { value: hdr(g.key, 1) }));
  return new THREE.ShaderMaterial({
    uniforms: u, depthWrite: true,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uT, uKick, uSort, uGreen, uSpeed, uRoute, uGain; uniform vec2 uCam, uRouteZ; uniform vec3 uBase, uC0, uC1, uC2, uC3; varying vec3 vW;
      float h1(float n){ return fract(sin(n * 127.1 + 11.3) * 43758.5453); }
      vec3 gcol(float k){ k = floor(k * 4.0); vec3 c = k < 1.0 ? uC0 : k < 2.0 ? uC1 : k < 3.0 ? uC2 : uC3; return mix(c, vec3(0.25, 1.6, 0.6), uGreen * 0.5); }
      float lineAA(float d, float w){ float fw = fwidth(d); return 1.0 - smoothstep(w, w + fw * 1.5, d); }
      void main(){
        vec2 p = vW.xz, q = p / 6.0, cell = floor(q), f = fract(q) - 0.5;
        float dx = abs(f.y) * 6.0, dz = abs(f.x) * 6.0;             // distance to the x-lane / z-lane centre line
        float lx = lineAA(dx, 0.05), lz = lineAA(dz, 0.05);
        float hx = exp(-dx * dx * 6.0), hz = exp(-dz * dz * 6.0);
        float rowH = h1(cell.y * 1.7 + 3.1), colH = h1(cell.x * 2.3 + 7.7);
        float ax = p.x / 36.0 - uT * uSpeed * (0.5 + rowH) / 36.0 + rowH;
        float az = p.y / 36.0 + uT * uSpeed * (0.7 + colH) / 36.0 + colH;
        float px = exp(-pow((fract(ax) - 0.5) * 36.0 / 1.6, 2.0));
        float pz = exp(-pow((fract(az) - 0.5) * 36.0 / 1.6, 2.0));
        vec3 cx = gcol(mix(h1(floor(ax) + cell.y * 13.0), rowH, uSort));
        vec3 cz = gcol(mix(h1(floor(az) + cell.x * 17.0), colH, uSort));
        float nearCam = smoothstep(4.0, 18.0, length(vW.xz - uCam));
        vec3 col = uBase * (lx + lz) * 0.55 + uBase * (hx + hz) * 0.05 + (cx * px * hx * 2.6 + cz * pz * hz * 2.6) * nearCam;
        // fine circuit traces between the lanes
        vec2 q2 = p / 1.5, c2 = floor(q2), f2 = abs(fract(q2) - 0.5);
        float tr = lineAA(f2.y * 1.5, 0.012) * step(0.62, h1(c2.y * 3.1 + floor(c2.x / 3.0) * 7.3))
                 + lineAA(f2.x * 1.5, 0.012) * step(0.7, h1(c2.x * 5.7 + floor(c2.y / 3.0) * 2.9));
        col += uBase * tr * 0.22 * step(0.9, max(dx, dz));
        // route highlight on the lane the camera flies (return mode)
        col += vec3(0.25, 1.8, 0.7) * uRoute * nearCam * exp(-pow(p.x - 3.0, 2.0) * 30.0) * step(uRouteZ.y, p.y) * step(p.y, uRouteZ.x) * 0.7;
        col *= (1.0 + uKick * 0.7) * uGain;
        float fade = exp(-length(vW.xz - uCam) * 0.011);
        gl_FragColor = vec4(col * fade + vec3(0.002, 0.004, 0.007), 1.0);
      }`,
  });
}

export class FabricZone {
  constructor(ctx) {
    this.tl = ctx.timeline; this.shots = ctx.shots;
    const sc = this.scene = new THREE.Scene();
    sc.fog = new THREE.FogExp2(0x02050a, 0.011);
    sc.environment = ctx.env; sc.environmentIntensity = 0.3;
    this.clear = 0x010307; this.near = 0.1; this.far = 450; this.speedRef = 40; this.bloom = 0.1;
    sc.add(new THREE.HemisphereLight(0x3d6a90, 0x020304, 0.5));
    const dl = new THREE.DirectionalLight(0x9fd8ff, 0.6); dl.position.set(-30, 50, 20); sc.add(dl);
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), groundMaterial()); this.ground.rotation.x = -Math.PI / 2; sc.add(this.ground);
    // towers: body + glowing cap + LED strip (instanced, re-placed around the camera every frame)
    const N = (2 * WIN + 1) ** 2;
    this.bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x0b1117, roughness: 0.4, metalness: 0.75 }), N);
    this.caps = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.06, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
    this.strips = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 1, 0.08), new THREE.MeshBasicMaterial({ color: 0xffffff }), N * 2);
    for (const m of [this.bodies, this.caps, this.strips]) { m.frustumCulled = false; sc.add(m); }
    this.m4 = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.c = new THREE.Color();
    // hero + traffic
    this.hero = new Packet({ color: PAL.employee, sgt: 10, scale: 0.42 }); sc.add(this.hero.group);
    this.pts = new GlowPoints(1400); sc.add(this.pts.mesh);
    // set pieces: devices with their small tagged packets, islands, bridge
    this.devs = G4.map((g, i) => {
      const d = device(g.device, g.key); d.scale.setScalar(1.6); sc.add(d);
      const p = new Packet({ color: PAL[g.key], sgt: g.sgt, scale: 0.28 }); sc.add(p.group);
      const lbl = textPlane(`SGT ${g.sgt} · ${g.name}`, { h: 0.34, color: PAL[g.key], k: 2.2, font: `700 72px ${MONO}` }); sc.add(lbl);
      return { d, p, lbl, g };
    });
    this.islands = G4.map((g) => {
      const grp = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(4, 4.3, 0.6, 64), new THREE.MeshStandardMaterial({ color: 0x0b1117, roughness: 0.35, metalness: 0.8 })); disc.position.y = -0.3; grp.add(disc);
      const rim = glowRing(4.05, 0.05, g.key, 3); rim.rotation.x = Math.PI / 2; rim.position.y = 0.02; grp.add(rim);
      const kinds = [g.device, g.device, g.device];
      const ds = kinds.map((k, i) => { const d = device(k, g.key); d.scale.setScalar(1.1); d.position.set((i - 1) * 2.2, 0, (i % 2) * 1.2 - 0.6); d.rotation.y = (i - 1) * 0.35; grp.add(d); return d; });
      const lbl = textPlane(`SGT ${g.sgt} · ${g.name}`, { h: 0.6, color: PAL[g.key], k: 2.4, font: `700 72px ${MONO}` }); lbl.position.set(0, 3.6, 0); grp.add(lbl);
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.9, 60, 48, 1, true), new THREE.ShaderMaterial({
        uniforms: { uCol: { value: hdr(g.key, 1) }, uA: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: 'uniform vec3 uCol; uniform float uA; varying vec2 vUv; void main(){ float s = 0.35 + 0.65 * smoothstep(0.7, 1.0, fract(vUv.x * 24.0)); gl_FragColor = vec4(uCol * uA * pow(1.0 - vUv.y, 4.0) * 0.32 * s, 1.0); }',
      }));
      pillar.position.y = 30; grp.add(pillar);
      sc.add(grp);
      return { grp, rim, ds, lbl, pillar, g };
    });
    this.bridge = glowTube([V(-5.5, 0.6, 0), V(-2.5, 3.2, 0), V(2.5, 3.2, 0), V(5.5, 0.6, 0)], 0.08, 'permit', 2, 120); sc.add(this.bridge);
    this.bridge.geometry.setDrawRange(0, 0);
    this.gates = [-2.6, 0, 2.6].map((x) => { const r = glowRing(0.9, 0.035, 'permit', 2); r.position.set(x, 3.2 + (x === 0 ? 0.1 : -0.05), 0); r.rotation.y = Math.PI / 2; sc.add(r); return r; });
    this.bridgePk = new Packet({ color: PAL.employee, sgt: 10, scale: 0.3 }); sc.add(this.bridgePk.group);
    this.beacon = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.5, 200, 32, 1, true), new THREE.MeshBasicMaterial({ color: hdr('server', 2.5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    sc.add(this.beacon);
  }

  // ---------------------------------------------------------------- flight path (fly modes)
  flight(shot, tl) {
    const idx = this.shots.indexOf(shot);
    const v = { launch: 26, flow: 34, return: 22, victory: 32 }[shot.mode];
    const ramp = shot.mode === 'launch' ? 0.8 : 0.2;
    const s = v * (tl + ramp * (Math.exp(-tl / ramp) - 1)); // smooth start from 0
    const z0 = -200 - Math.floor(hash(idx, 1) * 40) * CELL * 4;
    let y = 1.7 + 0.5 * Math.sin(s * 0.045);
    if (shot.mode === 'victory') {
      const b = this.tl.beat(shot.t[0] + tl), ph = (b.b / 8) % 1; // climb and dive every two bars
      y += 12 * Math.sin(Math.PI * ph) ** 2;
    }
    const x = LANE_X + 0.9 * Math.sin(s * 0.05);
    const pos = V(x, y, z0 - s);
    const look = V(LANE_X + 0.9 * Math.sin((s + 14) * 0.05), y - 0.5 - (shot.mode === 'victory' ? 2 * Math.cos(Math.PI * ((this.tl.beat(shot.t[0] + tl).b / 8) % 1)) : 0), z0 - s - 14);
    const roll = -0.22 * Math.cos(s * 0.05) + noise1(tl * 0.7, idx) * 0.03;
    const fwd = look.clone().sub(pos).normalize();
    const up = V(0, 1, 0).applyAxisAngle(fwd, roll);
    return { pos, target: look, up, s, z0, fov: 48 + (shot.mode === 'victory' ? 4 : 0) };
  }

  placeTowers(cam, staged) {
    const ci = Math.round(cam.x / CELL), cj = Math.round(cam.z / CELL);
    let n = 0, ns = 0;
    for (let i = ci - WIN; i <= ci + WIN; i++) for (let j = cj - WIN; j <= cj + WIN; j++) {
      const h0 = hash(i * 0.37, j * 0.73);
      const x = i * CELL, z = j * CELL;
      if (h0 < 0.3 || (staged && x * x + z * z < 44 * 44)) continue;
      const h = 2.6 + Math.pow(hash(i, j + 5), 2.2) * 11, w = 1.6 + hash(i + 3, j) * 1.8;
      this.m4.compose(V(x, h / 2, z), this.q, V(w, h, w)); this.bodies.setMatrixAt(n, this.m4);
      this.m4.compose(V(x, h + 0.03, z), this.q, V(w, 1, w)); this.caps.setMatrixAt(n, this.m4);
      const g = G4[Math.floor(hash(i + 9, j + 1) * 4)];
      const k = this.capK * 0.28 * (0.5 + hash(i, j + 11));
      this.c.set(PAL[this.greenAll ? (hash(i, j) > 0.4 ? 'permit' : g.key) : g.key]).multiplyScalar(k); this.caps.setColorAt(n, this.c);
      // LED strips on two corners, flickering with the traffic
      for (const sx of [-1, 1]) {
        this.m4.compose(V(x + sx * w / 2, h * 0.5, z + w / 2), this.q, V(1, h * 0.9, 1)); this.strips.setMatrixAt(ns, this.m4);
        this.c.set(PAL[g.key]).multiplyScalar((hash(i + sx, j + this.e8) > 0.5 ? 1.6 : 0.3) * this.capK); this.strips.setColorAt(ns++, this.c);
      }
      n++;
    }
    this.bodies.count = this.caps.count = n; this.strips.count = ns;
    for (const m of [this.bodies, this.caps, this.strips]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
  }

  update(t, shot, tl) {
    const TL = this.tl, mode = shot.mode, kick = TL.kick(t), fly = FLY.includes(mode);
    const cam = this.camera(shot, tl);
    const gm = this.ground.material.uniforms;
    gm.uT.value = t; gm.uKick.value = kick * (0.4 + 0.6 * TL.env('low', t)); gm.uCam.value.set(cam.pos.x, cam.pos.z);
    gm.uSpeed.value = fly ? 26 : 10;
    gm.uSort.value = mode === 'flow' && shot.id !== 'fin_2' ? smooth(TL.span(t, TL.seg(41).start, TL.seg(41).start + 0.8)) : mode === 'victory' ? 1 : 0;
    gm.uGreen.value = mode === 'victory' ? 1 : 0;
    gm.uGain.value = mode === 'launch' ? 1 + 0.8 * Math.exp(-tl / 0.5) : 1;
    this.ground.position.set(cam.pos.x, 0, cam.pos.z);
    this.capK = (1.2 + 2.2 * kick) * (mode === 'victory' ? 1.4 : 1); this.greenAll = mode === 'victory'; this.e8 = Math.floor(t / (BEAT / 2));
    this.placeTowers(cam.pos, !fly);
    // hero ahead of the camera
    this.hero.group.visible = fly;
    if (fly) {
      const f = this.flight(shot, tl), s = f.s + 7;
      const hp = V(LANE_X + 0.9 * Math.sin(s * 0.05) + noise1(t * 0.8, 3) * 0.3, f.pos.y - 0.55 + noise1(t, 4) * 0.15, f.z0 - s);
      this.hero.group.position.copy(hp);
      this.hero.set({ t, core: 0.9 + 0.5 * kick, band: 1, bandSpin: 2.2, camPos: cam.pos });
    }
    // route highlight (return)
    gm.uRoute.value = mode === 'return' ? smooth(TL.span(t, TL.seg(64).start, TL.seg(64).start + 0.5)) : 0;
    if (mode === 'return') { const f = this.flight(shot, tl), grow = ease.out(TL.span(t, TL.seg(64).start, TL.seg(64).start + 1.5)); gm.uRouteZ.value.set(f.pos.z - 2, f.pos.z - 2 - grow * 200); }
    this.beacon.visible = mode === 'return';
    if (mode === 'return') { const f = this.flight(shot, 0); this.beacon.position.set(LANE_X, 100, f.z0 - 22 * (shot.t[1] - shot.t[0]) - 60); this.beacon.material.color.copy(hdr('server', 2 + 2 * kick)); }
    // set pieces
    this.updateDevices(t, shot, mode === 'devices');
    this.updateIslands(t, shot, mode);
    // traffic particles overhead the lane (fly modes) + sparks
    const P = this.pts; P.begin();
    if (fly) {
      const f = this.flight(shot, tl);
      for (let i = 0; i < 260; i++) {
        const lane = [-4.2, -2.2, 2.2, 4.2][i % 4], g = G4[Math.floor(hash(i, 1) * 4)];
        let col = lin3(g.key, 3);
        if (mode === 'flow' && gm.uSort.value > 0.5) col = lin3(G4[i % 4].key, 3);
        if (mode === 'victory') col = hash(i, 5) > 0.5 ? lin3('permit', 3) : col;
        const L = 140, z = f.z0 - f.s + 20 - ((hash(i, 2) * L + t * (20 + hash(i, 3) * 25)) % L);
        const y = f.pos.y + 1.6 + hash(i, 4) * 4 + (mode === 'victory' ? hash(i, 6) * 6 : 0);
        P.add(V(LANE_X + lane + (hash(i, 7) - 0.5) * 0.6, y, z), 0.045, col, 0.8, V(0, 0, 1.6));
      }
    }
    P.end();
    if (mode === 'launch') this.fx.ca = 0.6 * Math.exp(-tl / 0.5);
  }

  updateDevices(t, shot, on) {
    const TL = this.tl;
    this.devs.forEach((o, i) => {
      o.d.visible = o.p.group.visible = o.lbl.visible = on;
      if (!on) return;
      const x = (i - 1.5) * 6;
      o.d.position.set(x, 0, 0);
      const at = TL.nearestBeat(shot.t[0] + 0.05 + i * 4 * BEAT), a = t - at, lit = a >= 0;
      const fl = lit ? Math.exp(-a / 0.3) : 0;
      setDeviceGlow(o.d, lit ? PAL[o.g.key] : '#3b4a56', lit ? 2 + 5 * fl + TL.kick(t) : 0.8);
      o.p.group.position.set(x, 3.4 + Math.sin(t * 1.5 + i) * 0.1, 0);
      o.p.group.scale.setScalar(0.28 * (lit ? 1 : 0.001));
      o.p.set({ t, core: 0.9 + 0.4 * TL.kick(t), band: lit ? 1 : 0, bandSnap: ease.out(clamp(a / 0.25)), bandSpin: 1.2, camPos: this.camPos });
      o.lbl.position.set(x, 5.0, 0); o.lbl.material.opacity = smooth(clamp(a / 0.3)); o.lbl.lookAt(this.camPos || V(0, 3, 12));
    });
  }

  updateIslands(t, shot, mode) {
    const TL = this.tl, show = mode === 'groups' || mode === 'islands';
    this.bridge.visible = this.bridgePk.group.visible = mode === 'islands';
    this.gates.forEach((g) => (g.visible = mode === 'islands'));
    this.islands.forEach((o, i) => {
      o.grp.visible = show && (mode === 'groups' || i === 0 || i === 1);
      if (!o.grp.visible) return;
      let rise = 1, pillar = 0;
      if (mode === 'groups') {
        const at = TL.nearestBeat(TL.seg(26).start + i * 2 * BEAT); rise = ease.back(TL.span(t, at - 0.1, at + 0.35));
        pillar = smooth(TL.span(t, TL.seg(27).start, TL.seg(27).start + 0.4)) * (0.6 + 0.4 * TL.kick(t));
        const pos = [V(-11, 0, -8), V(11, 0, -8), V(11, 0, 10), V(-11, 0, 10)][i];
        o.grp.position.set(pos.x, -4 + 4 * rise, pos.z);
      } else {
        o.grp.position.set(i === 0 ? -9.5 : 9.5, 0, 0);
      }
      o.grp.visible = o.grp.visible && rise > 0.01;
      o.pillar.material.uniforms.uA.value = pillar;
      o.rim.material.color.copy(hdr(o.g.key, 2 + 3 * TL.kick(t)));
      o.ds.forEach((d) => setDeviceGlow(d, PAL[o.g.key], 1.6 + TL.kick(t)));
      o.lbl.lookAt(this.camPos || V(0, 10, 30));
    });
    if (mode === 'islands') {
      // bridge builds, then packets cross on the beat; checkpoints flash green as they pass
      const build = ease.inOut(TL.span(t, shot.t[0] + 0.2, shot.t[0] + 1.8));
      this.bridge.geometry.setDrawRange(0, Math.floor(this.bridge.geometry.index.count * build / 6) * 6);
      const cycle = 4 * BEAT, u = ((t - shot.t[0] - 1.8) / cycle) % 1, on = t > shot.t[0] + 1.8;
      const curve = this.bridge.userData.curve;
      this.bridgePk.group.visible = on;
      if (on) { this.bridgePk.group.position.copy(curve.getPointAt(ease.inOut(u))).add(V(0, 0.2, 0)); this.bridgePk.set({ t, band: 1, bandSpin: 2, camPos: this.camPos }); }
      const px = on ? curve.getPointAt(ease.inOut(u)).x : -99;
      this.gates.forEach((g) => { const d = Math.abs(px - g.position.x); g.material.color.copy(hdr(d < 0.5 ? 'permit' : '#2f6b4c', d < 0.5 ? 6 : 1.5)); g.scale.setScalar(d < 0.5 ? 1.25 : 1); });
      this.bridge.material.color.copy(hdr('permit', 1.5 + 1.5 * TL.kick(t)));
    }
  }

  camera(shot, tl) {
    const mode = shot.mode, d = shot.t[1] - shot.t[0];
    let c;
    if (FLY.includes(mode)) { const f = this.flight(shot, tl); c = { pos: f.pos, target: f.target, up: f.up, fov: f.fov }; }
    else if (mode === 'devices') { const k = ease.inOut(tl / d); c = { pos: V(lerp(-12, 12, k), 3.2, 8.2), target: V(lerp(-8, 8, k), 2.3, 0), fov: 40 }; }
    else if (mode === 'groups') { const a = 0.6 + tl * 0.12; c = { pos: V(Math.sin(a) * 30, 17 - tl * 0.6, Math.cos(a) * 30), target: V(0, 0, 1), fov: 42 }; }
    else { const k = tl / d; c = { pos: V(lerp(-3, 3, k), 4.2, 15.5 - k * 2), target: V(0, 2, 0), fov: 40 }; }
    this.camPos = c.pos;
    return c;
  }
}
