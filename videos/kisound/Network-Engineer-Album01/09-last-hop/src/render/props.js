// The chapter set pieces. The corridor in space.js is the world; these are the places in it that
// only one part of the film visits, so a chapter is somewhere rather than just a brightness setting.
//
//   Bulkhead   the firewall (verse 1) — a wall across the route that opens exactly one slit
//   RouteWall  the routing table (verse 1) — a wall of prefixes, one of which lights up
//   Monolith   the far-end server (pre-chorus) — where the query turns into the answer
//   LayerStack the four OSI planes (verse 2, bridge) — the film's "layer one to layer four"
//   Skyline    the city seen from outside (hook, bridge)
//   Room       the desk at the end of the last hop (final chorus, outro)
//
// Each one is built once and parked out of sight; `show(v)` fades it in. All pure functions of t.
import * as THREE from 'three';
import { PAL } from './config.js';
import { V, clamp, smooth } from './core.js';
import { canvasTexture, MONO, SANS, glowSprite, edgeBox } from './world.js';

const add = (o, c, k = 1) => { o.material.color.set(c).multiplyScalar(k); return o; };
const addMat = (color, k = 2, opacity = 1) => new THREE.MeshBasicMaterial({
  color: new THREE.Color(color).multiplyScalar(k), transparent: true, opacity,
  blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });

class Prop {
  constructor() { this.group = new THREE.Group(); this.group.visible = false; this.a = 0; }
  show(v) { this.a = clamp(v); this.group.visible = this.a > 0.004; return this.a; }
  fade(list, k = 1) { for (const m of list) m.material.opacity = this.a * k; }
}

// ---------------------------------------------------------------------------- firewall bulkhead
// A wall of ports across the route. Almost all of them are shut and burn red; the rule scan runs
// down the grid and one port goes green — the session that is permitted. Traffic that reaches a
// closed port bursts against it (see traffic.js), which is what makes the wall read as enforcement
// rather than as decoration.
export class Bulkhead extends Prop {
  constructor() {
    super();
    const NX = 14, NY = 9, PITCH = 2.05, CELL = 1.55;
    this.NX = NX; this.NY = NY;
    this.open = { x: 6, y: 4 };            // the one port the session is allowed through
    const geo = new THREE.BoxGeometry(CELL, CELL, 0.5);
    this.ports = new THREE.InstancedMesh(geo, addMat('#ffffff', 1.0, 0), NX * NY);
    this.ports.frustumCulled = false;
    this.cols = new Float32Array(NX * NY * 3);
    this.ports.instanceColor = new THREE.InstancedBufferAttribute(this.cols, 3);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1);
    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX; x++) {
        m.compose(V((x - (NX - 1) / 2) * PITCH, (y - (NY - 1) / 2) * PITCH, 0), q, sc);
        this.ports.setMatrixAt(y * NX + x, m);
      }
    }
    this.ports.instanceMatrix.needsUpdate = true;
    this.group.add(this.ports);
    // the plate the ports are cut into
    this.plate = new THREE.Mesh(new THREE.PlaneGeometry(NX * PITCH + 7, NY * PITCH + 7),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.grid), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    this.plate.position.z = -0.4;
    this.group.add(this.plate);
    // the rule scan sweeping down the grid
    this.scan = new THREE.Mesh(new THREE.PlaneGeometry(NX * PITCH + 7, 0.5), addMat(PAL.warn, 3, 0));
    this.group.add(this.scan);
    this.red = new THREE.Color(PAL.down);
    this.green = new THREE.Color(PAL.ok);
    this.warn = new THREE.Color(PAL.warn);
    this.tmp = new THREE.Color();
  }
  // p 0..1 through the shot: the scan runs down, then the one port opens
  update(t, p) {
    if (!this.show(1)) return;
    const NX = this.NX, NY = this.NY;
    const scanY = 1 - clamp(p / 0.62);
    const opened = smooth(clamp((p - 0.62) / 0.28));
    this.plate.material.opacity = 0.5;
    this.scan.material.opacity = (1 - opened) * (0.5 + 0.5 * Math.sin(t * 11));
    this.scan.position.y = (scanY - 0.5) * NY * 2.05;
    for (let y = 0; y < NY; y++) {
      for (let x = 0; x < NX; x++) {
        const i = y * NX + x;
        const isOpen = x === this.open.x && y === this.open.y;
        const checked = (1 - y / (NY - 1)) >= scanY - 0.08;
        let c = this.tmp;
        if (isOpen && opened > 0.02) c.copy(this.green).multiplyScalar(1.2 + 2.6 * opened);
        else if (checked) c.copy(this.red).multiplyScalar(0.5 + 0.35 * Math.sin(t * 3 + i));
        else c.copy(this.warn).multiplyScalar(0.10);
        this.cols[i * 3] = c.r; this.cols[i * 3 + 1] = c.g; this.cols[i * 3 + 2] = c.b;
      }
    }
    this.ports.instanceColor.needsUpdate = true;
    this.ports.material.opacity = 0.9;
  }
}

// ---------------------------------------------------------------------------- routing table wall
export class RouteWall extends Prop {
  constructor(z) {
    super();
    this.group.position.z = z;
    const tex = canvasTexture('rib', 1024, 1024, (g, w, h) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
      g.font = `600 22px ${MONO}`; g.textBaseline = 'top';
      let s = 0x2f9a13;
      for (let y = 6; y < h; y += 29) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const line = `${(s >>> 24) % 223}.${(s >>> 16) % 255}.${(s >>> 8) % 255}.0/${[16, 19, 20, 22, 24][(s >>> 4) % 5]}   via  10.${(s >>> 12) % 255}.0.1   metric ${10 + ((s >>> 2) % 90)}`;
        g.fillStyle = `rgba(255,255,255,${0.08 + ((s >>> 6) % 10) / 10 * 0.22})`;
        g.fillText(line, 14, y);
      }
    });
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 6);
    this.walls = [-1, 1].map((s) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(64, 30), new THREE.MeshBasicMaterial({
        map: tex.clone(), color: new THREE.Color(PAL.cyan), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      m.material.map.wrapS = m.material.map.wrapT = THREE.RepeatWrapping; m.material.map.repeat.set(2, 6);
      m.rotation.y = s * Math.PI / 2;
      m.position.set(s * 12, 10, 0);
      this.group.add(m); return m;
    });
    // the one prefix that wins
    this.hit = new THREE.Mesh(new THREE.PlaneGeometry(22, 0.9), addMat(PAL.amberHot, 2.4, 0));
    this.hit.rotation.y = -Math.PI / 2;
    this.hit.position.set(-11.7, 8.5, 0);
    this.group.add(this.hit);
    this.label = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.1), new THREE.MeshBasicMaterial({
      map: canvasTexture('prefixhit', 1024, 86, (g, w, h) => {
        g.clearRect(0, 0, w, h);
        g.font = `700 52px ${MONO}`; g.textBaseline = 'middle'; g.fillStyle = '#fff';
        g.fillText('203.0.113.0/24  via ix-fra-01  metric 20', 12, h / 2);
      }), color: new THREE.Color(PAL.amberHot), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    this.label.rotation.y = -Math.PI / 2;
    this.label.position.set(-11.5, 8.5, 0.2);
    this.group.add(this.label);
  }
  update(t, p, lit) {
    if (!this.show(1)) return;
    this.walls.forEach((m, i) => { m.material.opacity = 0.30; m.material.map.offset.y = t * 0.05 + i * 0.4; });
    const k = smooth(clamp(lit));
    this.hit.material.opacity = k * (0.55 + 0.45 * Math.sin(t * 7));
    this.hit.scale.x = 0.4 + 0.6 * k;
    this.label.material.opacity = k * 0.95;
  }
}

// ---------------------------------------------------------------------------- the far-end server
export class Monolith extends Prop {
  constructor(z) {
    super();
    this.group.position.z = z;
    this.slab = new THREE.Mesh(new THREE.BoxGeometry(22, 46, 6), new THREE.ShaderMaterial({
      uniforms: { uCol: { value: new THREE.Color(PAL.amber) }, uT: { value: 0 }, uA: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 uCol; uniform float uT, uA; varying vec3 vP;
        void main(){
          float grad = 1.0 - (vP.y + 23.0) / 46.0;
          float seams = smoothstep(0.93, 1.0, fract(vP.x * 0.35 + 0.5)) * 0.35
                      + smoothstep(0.96, 1.0, fract(vP.y * 0.13)) * 0.22;
          float scan = smoothstep(0.985, 1.0, fract(vP.y * 0.06 - uT * 0.11)) * 0.9;
          float rim = smoothstep(7.0, 11.0, abs(vP.x)) * 0.5 + smoothstep(15.0, 23.0, abs(vP.y)) * 0.3;
          vec3 c = uCol * (0.02 + 0.10 * grad * grad + seams + scan + rim * 0.5);
          gl_FragColor = vec4(c * uA, 1.0);
        }`,
    }));
    this.slab.position.y = 22;
    this.group.add(this.slab);
    this.core = glowSprite(PAL.amberHot, 7, 3);
    this.core.position.set(0, 17, -3.2);
    this.group.add(this.core);
  }
  update(t, a, hit) {
    if (!this.show(a)) return;
    this.slab.material.uniforms.uT.value = t;
    this.slab.material.uniforms.uA.value = this.a;
    this.core.material.opacity = this.a * (0.25 + 1.5 * clamp(hit));
    this.core.scale.setScalar(1 + 2.4 * clamp(hit));
  }
}

// ---------------------------------------------------------------------------- the four OSI layers
export class LayerStack extends Prop {
  constructor() {
    super();
    const NAMES = ['L1 · SIGNAL', 'L2 · FRAME', 'L3 · PACKET', 'L4 · SEGMENT'];
    this.planes = NAMES.map((name, i) => {
      const tex = canvasTexture('osi' + i, 1024, 256, (g, w, h) => {
        g.clearRect(0, 0, w, h);
        g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 3;
        g.strokeRect(6, 6, w - 12, h - 12);
        g.font = `700 54px ${MONO}`; g.textBaseline = 'middle'; g.fillStyle = 'rgba(255,255,255,0.95)';
        g.fillText(name, 30, h / 2);
        g.fillStyle = 'rgba(255,255,255,0.28)';
        for (let x = 430; x < w - 40; x += 26) g.fillRect(x, h / 2 - 22, 12, 44);
      });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 1.35), new THREE.MeshBasicMaterial({
        map: tex, color: new THREE.Color(i < 2 ? PAL.cyan : PAL.amber), transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      this.group.add(m); return m;
    });
  }
  // spread 0 = collapsed into one, 1 = four separate planes stacked in depth
  update(t, a, spread) {
    if (!this.show(a)) return;
    const s = smooth(clamp(spread));
    this.planes.forEach((m, i) => {
      const k = i - 1.5;
      m.position.set(k * 0.5 * s, 1.5 + k * 1.15 * s, -k * 3.4 * s);
      // the stack is framed from the 'back' view, so the planes face -Z or the labels read mirrored
      m.rotation.set(-0.2 * s, Math.PI + 0.22 * s, 0);
      m.material.opacity = this.a * (0.30 + 0.55 * s);
    });
  }
}

// ---------------------------------------------------------------------------- the city outside
export class Skyline extends Prop {
  constructor({ count = 260 } = {}) {
    super();
    const geo = new THREE.BoxGeometry(1, 1, 1);
    this.blocks = new THREE.InstancedMesh(geo, addMat(PAL.grid, 1.2, 0), count);
    const lit = new THREE.InstancedMesh(geo, addMat(PAL.dawn, 2.6, 0), count);
    this.lit = lit;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    let seed = 0x1234567;
    const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed >>> 8) / 16777216; };
    for (let i = 0; i < count; i++) {
      const x = (r() - 0.5) * 300, z = -r() * 320 - 20;
      const h = 6 + 70 * r() ** 2.6, w = 5 + 16 * r();
      s.set(w, h, w * (0.7 + r() * 0.8));
      m.compose(V(x, h / 2, z), q, s);
      this.blocks.setMatrixAt(i, m);
      // a handful of lit windows per block, as a thin slab on its face
      s.set(w * 0.5, h * 0.06, 0.4);
      m.compose(V(x, h * (0.2 + 0.6 * r()), z + s.z * 0.5 + w * 0.36), q, s);
      lit.setMatrixAt(i, m);
    }
    this.blocks.instanceMatrix.needsUpdate = true; lit.instanceMatrix.needsUpdate = true;
    this.blocks.frustumCulled = lit.frustumCulled = false;
    this.group.add(this.blocks, lit);
  }
  update(t, a, dawn = 0) {
    if (!this.show(a)) return;
    this.blocks.material.opacity = this.a * 0.5;
    this.lit.material.opacity = this.a * (0.4 + 0.6 * clamp(dawn)) * (0.85 + 0.15 * Math.sin(t * 0.7));
    this.lit.material.color.set(PAL.dawn).multiplyScalar(2.2 + 1.6 * clamp(dawn));
  }
}

// ---------------------------------------------------------------------------- the screen at the end
// The desk, the laptop and the room are Blender sets. What stays here is the only part that has to
// move per frame: the screen content and the waveform that pulses on the track's own kick. It is
// authored in METRES and parented to the laptop set at its `screen` anchor, so the model owns the
// placement and this code owns the animation.
export class Screen extends Prop {
  constructor() {
    super();
    const W = 0.284, H = 0.183;
    this.panel = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({
      map: canvasTexture('screen', 1024, 660, (g, w, h) => {
        g.fillStyle = '#04070c'; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(30,168,255,0.16)'; g.fillRect(0, 0, w, 74);
        g.font = `600 30px ${SANS}`; g.fillStyle = 'rgba(160,196,220,0.9)'; g.textBaseline = 'middle';
        g.fillText('NETWORK ENGINEER', 30, 37);
        g.font = `700 62px ${SANS}`; g.fillStyle = 'rgba(232,244,255,0.92)';
        g.fillText('09  LAST HOP', 30, 168);
        g.font = `500 27px ${MONO}`; g.fillStyle = 'rgba(109,132,150,0.9)';
        g.fillText('192.168.1.254  ·  ttl 62  ·  8.94 ms', 30, 232);
        g.font = `500 30px ${SANS}`; g.fillStyle = 'rgba(160,196,220,0.82)';
        g.fillText('SAMUEL HEINRICH', 30, 292);
        g.fillStyle = 'rgba(63,224,138,0.75)'; g.fillRect(30, 600, 240, 4);
      }),
      transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
    }));
    // The `screen` anchor on the laptop set already describes the face the user looks at, including
    // the lid's recline, so the panel needs no correction here — only a nudge off the bezel it is
    // coplanar with.
    this.panel.position.z = 0.004;
    this.group.add(this.panel);
    // the waveform from the cover, on the lower third of the screen
    this.wave = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), addMat(PAL.cyan, 2.2, 0), 72);
    this.wave.frustumCulled = false;
    this.group.add(this.wave);
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._s = new THREE.Vector3();
    this.glow = glowSprite(PAL.dawn, 0.5, 0.9);
    this.glow.position.set(0, 0, 0.03);
    this.group.add(this.glow);
  }
  update(t, a, { env = 0, kick = 0, dawn = 0 } = {}) {
    if (!this.show(a)) return;
    this.panel.material.opacity = this.a;
    this.glow.material.opacity = this.a * (0.08 + 0.22 * clamp(dawn));
    const m = this._m, q = this._q, s = this._s;
    for (let i = 0; i < 72; i++) {
      const u = i / 71;
      const amp = 0.004 + 0.030 * Math.abs(Math.sin(u * 17 + t * 0.9)) * (0.35 + 0.9 * env) * (1 + 0.5 * kick);
      s.set(0.0022, amp, 1);
      m.compose(V(-0.125 + u * 0.250, -0.052, 0.006), q, s);
      this.wave.setMatrixAt(i, m);
    }
    this.wave.instanceMatrix.needsUpdate = true;
    this.wave.material.opacity = this.a * 0.9;
  }
}
