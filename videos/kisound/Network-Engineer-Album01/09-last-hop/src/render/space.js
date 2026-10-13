// The machine city the route runs through. Everything here is built ALONG the flight path in
// route.js, so the corridor bends with the route and a camera flying it sees structure arriving
// from the distance rather than sliding past sideways.
//
//   ribs        the structural corridor, oriented to the curve
//   mainframe   dense blocks packed either side — the city itself, the thing that must come closer
//   fibres      tubes following the curve, with light running along them
//   towers      a far horizon in world space
//   streaks     near-field light emitted around the frame, along the local heading
//
// Structure is static and the camera moves through it; only light moves on its own. That separation
// is what keeps a 295 s film from either crawling or turning into strobing noise.
import * as THREE from 'three';
import { PAL } from './config.js';
import { hash, clamp, V, GlowPoints } from './core.js';
import { FLIGHT, NODES } from './route.js';

const SAMPLES = 150;

// a basis at arc fraction u: forward along the curve, up as level as the turn allows
function basisAt(u, q, m) {
  const p = FLIGHT.at(u), f = FLIGHT.tangent(u);
  const up = Math.abs(f.y) > 0.95 ? V(0, 0, 1) : V(0, 1, 0);
  const side = new THREE.Vector3().crossVectors(up, f).normalize();
  const realUp = new THREE.Vector3().crossVectors(f, side).normalize();
  m.makeBasis(side, realUp, f);
  q.setFromRotationMatrix(m);
  return { p, f, side, up: realUp };
}

function fibreMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(color) }, uT: { value: 0 }, uGain: { value: 1 }, uSpeed: { value: 0.07 }, uRate: { value: 26 }, uDir: { value: 1 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uCol; uniform float uT, uGain, uSpeed, uRate, uDir; varying vec2 vU;
      void main(){
        float p = fract(vU.x * uRate - uT * uSpeed * uRate * uDir);
        float pulse = exp(-pow((p - 0.5) * 9.0, 2.0));
        gl_FragColor = vec4(uCol * (0.05 + pulse * 2.1) * uGain, 1.0);
      }`,
  });
}

export class Space {
  constructor({ mainframe = 1100, towers = 520, streaks = 300 } = {}) {
    this.group = new THREE.Group();
    this.cyan = new THREE.Color(PAL.cyan);
    this.amber = new THREE.Color(PAL.amber);
    this.col = new THREE.Color(PAL.cyan);
    const q = new THREE.Quaternion(), m4 = new THREE.Matrix4(), m = new THREE.Matrix4(), s = new THREE.Vector3();

    // ---- ribs: a square corridor that follows the curve
    const R = 11;
    this.ribs = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.col.clone(), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
      SAMPLES * 4);
    for (let i = 0; i < SAMPLES; i++) {
      const u = i / (SAMPLES - 1);
      const { p } = basisAt(u, q, m4);
      const wob = 1 + 0.18 * Math.sin(i * 0.5) + 0.12 * hash(i, 11);
      const rr = R * wob, bar = 0.16;
      [[0, rr, 2 * rr, bar], [0, -rr, 2 * rr, bar], [rr, 0, bar, 2 * rr], [-rr, 0, bar, 2 * rr]].forEach(([x, y, w, h], k) => {
        s.set(w, h, bar * (1 + 2.5 * hash(i, k)));
        const off = V(x, y, 0).applyQuaternion(q).add(p);
        m.compose(off, q, s);
        this.ribs.setMatrixAt(i * 4 + k, m);
      });
    }
    this.ribs.instanceMatrix.needsUpdate = true; this.ribs.frustumCulled = false;
    this.group.add(this.ribs);

    // ---- mainframe: dense blocks packed along both flanks. This is the city.
    this.blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.grid), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
      mainframe);
    this.lit = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.col.clone(), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
      mainframe);
    for (let i = 0; i < mainframe; i++) {
      const u = hash(i, 51);
      const { p } = basisAt(u, q, m4);
      const sideSign = hash(i, 52) > 0.5 ? 1 : -1;
      const lat = sideSign * (R + 13 + 78 * hash(i, 53) ** 1.7);
      const vert = -14 + 58 * hash(i, 54) ** 1.6;
      const w = 1.6 + 7 * hash(i, 55), h = 2 + 26 * hash(i, 56) ** 1.4, d = 2 + 14 * hash(i, 57);
      const along = (hash(i, 58) - 0.5) * 26;
      const off = V(lat, vert, along).applyQuaternion(q).add(p);
      s.set(w, h, d);
      m.compose(off, q, s);
      this.blocks.setMatrixAt(i, m);
      // a lit face on each block: the windows of the machine city
      s.set(w * 0.62, h * 0.10, d * 0.62);
      const off2 = V(lat - sideSign * w * 0.52, vert + h * (0.15 + 0.5 * hash(i, 59)), along).applyQuaternion(q).add(p);
      m.compose(off2, q, s);
      this.lit.setMatrixAt(i, m);
    }
    this.blocks.instanceMatrix.needsUpdate = true; this.lit.instanceMatrix.needsUpdate = true;
    this.blocks.frustumCulled = this.lit.frustumCulled = false;
    this.group.add(this.blocks, this.lit);

    // ---- fibres: parallel tubes following the curve
    this.fibres = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.4, rr = 7.2 + 2.6 * hash(i, 61);
      const pts = [];
      for (let k = 0; k <= 160; k++) {
        const { p } = basisAt(k / 160, q, m4);
        pts.push(V(Math.cos(a) * rr, Math.sin(a) * rr, 0).applyQuaternion(q).add(p));
      }
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.075 + 0.05 * hash(i, 62), 5, false),
        fibreMaterial(PAL.cyan));
      tube.frustumCulled = false;
      tube.material.uniforms.uRate.value = 26 + 30 * hash(i, 63);
      tube.material.uniforms.uSpeed.value = 0.05 + 0.07 * hash(i, 64);
      this.group.add(tube); this.fibres.push(tube);
    }

    // ---- towers: a far horizon in world space, beyond the corridor
    this.towers = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.col.clone(), transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }),
      towers);
    const zA = NODES[0].z, zB = NODES[NODES.length - 1].z;
    for (let i = 0; i < towers; i++) {
      const side = hash(i, 31) > 0.5 ? 1 : -1;
      const x = side * (90 + 230 * hash(i, 32) ** 1.5);
      const z = zA + 80 - hash(i, 33) * (zA - zB + 220);
      const h = 8 + 110 * hash(i, 34) ** 2.4, w = 4 + 16 * hash(i, 35);
      s.set(w, h, w * (0.6 + hash(i, 36)));
      m.compose(V(x, h / 2 - 12, z), new THREE.Quaternion(), s);
      this.towers.setMatrixAt(i, m);
    }
    this.towers.instanceMatrix.needsUpdate = true; this.towers.frustumCulled = false;
    this.group.add(this.towers);

    // ---- streaks: near-field light around the frame, along the local heading
    this.streakN = streaks;
    this.streaks = new GlowPoints(streaks, { sizeAttenuation: true });
    this.streaks.mesh.frustumCulled = false;
    this.group.add(this.streaks.mesh);
    this._q = q; this._m4 = m4;
  }

  // u is the frame's own position on the route, so the near field always sits around the action
  update(t, { warmth = 0, speed = 1, gain = 1, u = 0, pulse = 0, density = 1, dim = 1 } = {}) {
    const col = this.col.copy(this.cyan).lerp(this.amber, warmth);
    this.ribs.material.color.copy(col);
    this.ribs.material.opacity = (0.09 + 0.10 * pulse) * gain * dim;
    this.blocks.material.opacity = 0.20 * gain * dim;
    this.lit.material.color.copy(col);
    this.lit.material.opacity = (0.085 + 0.09 * pulse) * gain * dim;
    this.towers.material.color.copy(col);
    this.towers.material.opacity = (0.055 + 0.05 * pulse) * gain * dim;
    for (const f of this.fibres) {
      const un = f.material.uniforms;
      un.uT.value = t; un.uGain.value = (0.22 + 0.6 * pulse) * gain * dim;
      un.uCol.value.copy(col);
    }

    // streaks live in a window of arc length around the frame and stream backwards past the lens
    const q = this._q, m4 = this._m4;
    const span = 0.055, n = Math.round(this.streakN * clamp(density));
    const c3 = [col.r * 3.2, col.g * 3.2, col.b * 3.2];
    const f = this.streaks; f.begin();
    for (let i = 0; i < n; i++) {
      const phase = ((t * (0.004 + 0.016 * hash(i, 43)) * speed + hash(i, 44)) % 1 + 1) % 1;
      const uu = clamp(u + span * 1.2 - phase * span * 2.2);
      const { p } = basisAt(uu, q, m4);
      const a = hash(i, 41) * Math.PI * 2, r = 2.6 + 9 * hash(i, 42) ** 1.4;
      const pos = V(Math.cos(a) * r, Math.sin(a) * r, 0).applyQuaternion(q).add(p);
      const len = (1.0 + 3.4 * hash(i, 45)) * Math.min(1.7, speed);
      f.add(pos, 0.035 + 0.05 * hash(i, 46), c3, 0.30 * gain * dim, FLIGHT.tangent(uu).multiplyScalar(-len));
    }
    f.end();
  }
}
