// The film's main stage: the built cyberspace from space.js, plus the route, the nine hops and the
// hero frame. Every shot runs through here; MOOD below gives each chapter its own character —
// density, speed, structure, colour — so the corridor of the transit run does not look like the
// breakdown of the outage or the calm of the bridge.
import * as THREE from 'three';
import { PAL, HOPS, ttlAt, warmth, hopsAt, BURN, SILENT_T } from '../config.js';
import { V, hash, clamp, smooth, remap } from '../core.js';
import { Frame } from '../frame.js';
import { Space } from '../space.js';
import { Traffic } from '../traffic.js';
import { FLIGHT, NODES, NODE_U, routeU, routePos, routeDir, nodeHit } from '../route.js';
import { Bulkhead, RouteWall, Monolith, LayerStack, Skyline, Screen } from '../props.js';

const HOP_Z = (n) => NODES[n].z;          // kept for set-piece placement; the path owns the rest
const Z_START = NODES[0].z;
// the scenes in the room at the end of the last hop, where the film changes scale
const ROOM_MODES = ['arrival', 'room', 'ack', 'lands', 'silent', 'ends'];

// Per shot mode: speed of the light, density of the near field, brightness, camera distance,
// and how much the camera leads the frame. Anything not listed falls back to `base`.
const MOOD = {
  base: { speed: 1.0, density: 0.7, gain: 1.0, dist: 1.0, fov: 38, shake: 1 },

  carrier: { speed: 0.15, density: 0.05, gain: 0.10, dist: 1.5, fov: 30 },
  route: { speed: 0.35, density: 0.20, gain: 0.30, dist: 1.4, fov: 34 },
  shore: { speed: 0.4, density: 0.25, gain: 0.38, dist: 2.2, fov: 46 },
  noise: { speed: 1.5, density: 1.0, gain: 0.45, dist: 1.1, fov: 44 },
  gap: { speed: 0.3, density: 0.3, gain: 0.34, dist: 2.6, fov: 50 },
  rise: { speed: 0.6, density: 0.5, gain: 0.6, dist: 2.4, fov: 48 },
  title: { speed: 0.5, density: 0.4, gain: 0.5, dist: 2.2, fov: 44 },
  plunge: { speed: 2.4, density: 1.0, gain: 0.9, dist: 0.45, fov: 62, view: 'down' },

  hop1: { speed: 1.4, density: 0.8, gain: 0.9, dist: 0.5, fov: 52 },
  hop2: { speed: 1.9, density: 1.0, gain: 1.0, dist: 0.8, fov: 50 },
  hop3: { speed: 2.6, density: 0.5, gain: 0.75, dist: 1.3, fov: 46, view: 'down' },   // the empty transit run
  firewall: { speed: 0.5, density: 0.35, gain: 0.8, dist: 0.9, fov: 40, view: 'down' },
  table: { speed: 0.4, density: 0.3, gain: 0.8, dist: 1.0, fov: 36, view: 'down' },
  prefix: { speed: 1.2, density: 0.7, gain: 1.0, dist: 0.8, fov: 42, view: 'down' },
  bright: { speed: 0.7, density: 0.4, gain: 0.7, dist: 1.6, fov: 34 },

  hopbyhop: { speed: 1.1, density: 0.7, gain: 0.9, dist: 1.4, fov: 42 },
  linkbylink: { speed: 1.3, density: 0.8, gain: 1.0, dist: 1.2, fov: 40, view: 'down' },
  ttl: { speed: 0.5, density: 0.3, gain: 0.8, dist: 0.32, fov: 30 },     // hard on the TTL cell
  turn: { speed: 1.6, density: 0.9, gain: 1.1, dist: 1.1, fov: 44, view: 'down' },

  chorusA: { speed: 2.0, density: 1.0, gain: 1.25, dist: 2.6, fov: 52 },
  chorusB: { speed: 1.2, density: 0.7, gain: 1.2, dist: 0.6, fov: 36 },
  chorusC: { speed: 2.8, density: 1.0, gain: 1.1, dist: 0.5, fov: 60, view: 'down' },
  chorusD: { speed: 0.9, density: 0.5, gain: 1.0, dist: 1.6, fov: 44 },
  chorusE: { speed: 1.8, density: 0.9, gain: 1.2, dist: 3.0, fov: 54, view: 'down' },
  chorusF: { speed: 1.0, density: 0.6, gain: 1.0, dist: 0.9, fov: 38 },
  heartbeat: { speed: 1.5, density: 0.9, gain: 1.15, dist: 1.5, fov: 44 },
  dissolve: { speed: 0.6, density: 0.4, gain: 0.5, dist: 1.8, fov: 40 },

  storms: { speed: 0.8, density: 1.0, gain: 0.5, dist: 1.0, fov: 44 },
  withdraw: { speed: 0.5, density: 0.5, gain: 0.35, dist: 1.3, fov: 40 },
  timeout: { speed: 0.3, density: 0.2, gain: 0.22, dist: 1.8, fov: 38 },
  death: { speed: 1.8, density: 0.5, gain: 0.30, dist: 0.7, fov: 46 },

  green: { speed: 1.0, density: 0.7, gain: 0.95, dist: 1.2, fov: 42 },
  breathe: { speed: 1.4, density: 0.9, gain: 1.05, dist: 1.4, fov: 44 },
  layers: { speed: 0.5, density: 0.4, gain: 0.9, dist: 0.9, fov: 38, view: 'down' },
  meet: { speed: 1.3, density: 0.9, gain: 1.0, dist: 1.3, fov: 42 },

  hop6: { speed: 1.6, density: 0.9, gain: 1.05, dist: 0.9, fov: 44 },
  light: { speed: 1.6, density: 0.9, gain: 1.1, dist: 1.0, fov: 42 },
  curve: { speed: 1.9, density: 1.0, gain: 1.1, dist: 1.4, fov: 46, view: 'down' },
  flip: { speed: 2.6, density: 1.0, gain: 1.3, dist: 1.1, fov: 50, view: 'down' },
  city: { speed: 0.8, density: 0.5, gain: 0.8, dist: 3.4, fov: 52 },

  console: { speed: 0.35, density: 0.2, gain: 0.55, dist: 0.7, fov: 34 },
  loss: { speed: 0.5, density: 0.3, gain: 0.6, dist: 0.8, fov: 34 },
  sfp: { speed: 0.4, density: 0.25, gain: 0.7, dist: 0.30, fov: 28 },
  ports: { speed: 0.4, density: 0.25, gain: 0.7, dist: 0.34, fov: 30 },
  l1l4: { speed: 0.6, density: 0.4, gain: 0.85, dist: 1.0, fov: 38, view: 'down' },
  air: { speed: 1.4, density: 0.7, gain: 0.9, dist: 1.1, fov: 44 },
  moving: { speed: 1.0, density: 0.6, gain: 0.8, dist: 3.0, fov: 50 },
  dawn: { speed: 0.5, density: 0.35, gain: 0.7, dist: 3.6, fov: 46 },

  build: { speed: 3.2, density: 1.0, gain: 1.1, dist: 0.9, fov: 54, view: 'down' },
  hold: { speed: 0.05, density: 0.15, gain: 0.55, dist: 0.5, fov: 30, shake: 0 },

  arrival: { speed: 1.2, density: 0.7, gain: 1.2, dist: 0.5, fov: 40 },
  room: { speed: 0.35, density: 0.2, gain: 0.8, dist: 1.6, fov: 38 },
  ack: { speed: 0.4, density: 0.2, gain: 0.7, dist: 1.0, fov: 36 },
  lands: { speed: 0.3, density: 0.15, gain: 0.7, dist: 1.2, fov: 36 },
  silent: { speed: 0.2, density: 0.10, gain: 0.45, dist: 1.6, fov: 38 },
  ends: { speed: 0.2, density: 0.08, gain: 0.40, dist: 2.0, fov: 40 },
  pullout: { speed: 0.4, density: 0.4, gain: 0.85, dist: 2.0, fov: 44 },
  topology: { speed: 0.3, density: 0.4, gain: 1.15, dist: 3.0, fov: 50 },
};
const mood = (m) => ({ ...MOOD.base, ...(MOOD[m] || {}) });

export class CyberZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    this.sets = ctx.sets;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(new THREE.Color(PAL.bg), 0.0125);
    this.clear = new THREE.Color(PAL.bg).getHex();
    this.speedRef = 26; this.bloom = 0.07; this.bloomThr = 1.35; this.far = 900;

    this.space = new Space();
    this.scene.add(this.space.group);

    // floor: a wide plate under the corridor so the world has a ground
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(260, 520), new THREE.ShaderMaterial({
      uniforms: { uCol: { value: new THREE.Color(PAL.grid) }, uAcc: { value: new THREE.Color(PAL.cyan) }, uT: { value: 0 }, uPulse: { value: 0 }, uGain: { value: 1 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `uniform vec3 uCol, uAcc; uniform float uT, uPulse, uGain; varying vec3 vW;
        float line(float x, float w){ float d = abs(fract(x - 0.5) - 0.5) / fwidth(x); return 1.0 - clamp(d - w, 0.0, 1.0); }
        void main(){
          vec2 p = vec2(vW.x, vW.z);
          float minor = max(line(p.x, 0.2), line(p.y, 0.2));
          float major = max(line(p.x / 8.0, 0.6), line(p.y / 8.0, 0.6));
          float run = smoothstep(0.86, 1.0, fract(p.y * 0.02 + uT * 0.30));
          float fade = exp(-length(vW.xz - vec2(0.0, -110.0)) * 0.006);
          vec3 c = uCol * (0.8 * minor + 2.0 * major) + uAcc * (major * uPulse * 2.2 + run * 0.5);
          gl_FragColor = vec4(c * fade * uGain, 1.0);
        }`,
    }));
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.z = -110;
    this.floor.frustumCulled = false;
    this.scene.add(this.floor);

    // the nine hops as gates on the route, each turned to face the direction of travel
    const bq = new THREE.Quaternion(), bm = new THREE.Matrix4();
    this.nodes = HOPS.map((h) => {
      const u = NODE_U[h.n], p = FLIGHT.at(u), f = FLIGHT.tangent(u);
      const side = new THREE.Vector3().crossVectors(V(0, 1, 0), f).normalize();
      const up = new THREE.Vector3().crossVectors(f, side).normalize();
      bm.makeBasis(side, up, f); bq.setFromRotationMatrix(bm);
      const g = new THREE.Group(); g.position.copy(p); g.quaternion.copy(bq);
      const R = h.last ? 5.2 : 3.4;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.09, 6, 72),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      g.add(ring);
      // a gantry so a hop is a place the frame flies into, not a hoop it passes
      const gantry = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: new THREE.Color(PAL.grid), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }), 12);
      const m = new THREE.Matrix4(), q0 = new THREE.Quaternion(), sc = new THREE.Vector3();
      const B = R + 2.4;
      [[0, B, 2 * B, 0.36], [0, -B, 2 * B, 0.36], [B, 0, 0.36, 2 * B], [-B, 0, 0.36, 2 * B]].forEach(([x, y, w, hh], k) => {
        sc.set(w, hh, 0.22); m.compose(V(x, y, 0), q0, sc); gantry.setMatrixAt(k, m);
        sc.set(0.26, 0.26, 9); m.compose(V(x * 0.98, y * 0.98, -4.5), q0, sc); gantry.setMatrixAt(4 + k, m);
        sc.set(0.26, 0.26, 9); m.compose(V(x * 0.98, y * 0.98, 4.5), q0, sc); gantry.setMatrixAt(8 + k, m);
      });
      gantry.instanceMatrix.needsUpdate = true; gantry.frustumCulled = false;
      g.add(gantry);
      this.scene.add(g);
      return { h, group: g, ring, gantry };
    });

    // the route itself, drawn from the real curve
    this.route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(FLIGHT.curve.getPoints(600)),
      new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.route.frustumCulled = false;
    this.scene.add(this.route);

    // the destination: visible from the first minute, only ever grows
    this.dest = new THREE.Sprite(new THREE.SpriteMaterial({
      color: new THREE.Color(PAL.amber), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      map: (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
        const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(0.25, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })(),
    }));
    this.dest.position.copy(FLIGHT.at(NODE_U[9]));
    this.scene.add(this.dest);

    // chapter set pieces, parked at the point of the route where their scene happens
    this.bulkhead = new Bulkhead();
    this.routeWall = new RouteWall(HOP_Z(5) + 8);
    this.monolith = new Monolith(HOP_Z(5) - 52);     // the far-end server: ahead of the turn, where we reach it
    this.layers = new LayerStack();
    this.skyline = new Skyline();
    this.screen = new Screen();
    for (const p of [this.bulkhead, this.routeWall, this.monolith, this.layers, this.skyline]) this.scene.add(p.group);

    // The Blender sets. They carry MeshStandardMaterial, so the scene needs an environment —
    // there are no lights in this film, everything else is emissive or a shader.
    this.scene.environment = ctx.env;
    // Authored at real scale in metres; GEAR is the factor that makes each read at packet scale.
    const GEAR = {
      'port-macro': 340, 'switch-48p': 42, 'router-core': 40, 'rack-aisle': 9,
      'ap-ceiling': 12, 'laptop': 12, 'office': 12, 'city-block': 1.0,
    };
    this.gear = {};
    for (const [id, sc] of Object.entries(GEAR)) {
      if (!this.sets || !this.sets.sets.has(id)) continue;
      const g = this.sets.instance(id);
      g.scale.setScalar(sc);
      g.visible = false;
      g.traverse((o) => { if (o.isMesh && o.material) { o.material = o.material.clone(); o.material.envMapIntensity = 0.14; o.material.emissiveIntensity = 2.6; } });
      this.scene.add(g);
      this.gear[id] = g;
    }
    // the city is a tile: three of them make a skyline to fly over
    this.city = [];
    if (this.sets && this.sets.sets.has('city-block')) {
      for (let i = 0; i < 3; i++) {
        const g = this.sets.instance('city-block');
        g.traverse((o) => { if (o.isMesh && o.material) { o.material = o.material.clone(); o.material.envMapIntensity = 0.22; o.material.emissiveIntensity = 3.0; } });
        g.visible = false; this.scene.add(g); this.city.push(g);
      }
    }

    this.traffic = new Traffic({ count: 64 });
    this.scene.add(this.traffic.group);

    this.frame = new Frame({ color: PAL.cyanHot, scale: 0.85 });
    this.scene.add(this.frame.group);

    this.cyan = new THREE.Color(PAL.cyan); this.amber = new THREE.Color(PAL.amber);
    this.hotC = new THREE.Color(PAL.cyanHot); this.hotA = new THREE.Color(PAL.amberHot);
    this.tmp = new THREE.Color(); this.tmp2 = new THREE.Color();
  }

  // predicted shots stutter: quantise time so the first chorus reads as a projection, not as footage
  stutter(t, shot) { return shot.predict ? Math.floor(t * 12) / 12 : t; }

  // The room at the end of the last hop, in world space. The laptop is placed on the office's
  // `laptop` anchor and turned to face the desk, so every point inside it needs that same turn —
  // this is the one place that knows about it.
  ROOM_S = 12;
  roomBase() { return FLIGHT.at(NODE_U[9]).add(FLIGHT.tangent(NODE_U[9]).multiplyScalar(26)).add(V(0, -2, 0)); }
  officePoint(name) {
    const a = this.sets && this.sets.anchor('office', name);
    return a ? this.roomBase().add(a.pos.clone().multiplyScalar(this.ROOM_S)) : null;
  }
  lapPoint(name) {
    if (!this.sets || !this.sets.anchor('laptop', name)) return null;
    const lap = this.officePoint('laptop');
    if (!lap) return null;
    // The laptop is placed unrotated: its screen already faces the chair side of the desk, which is
    // where the office's camera stands are. Turning it 180° pointed the screen at the window.
    return lap.clone().add(this.sets.at('laptop', name).multiplyScalar(this.ROOM_S));
  }

  // Where the frame is, and which way it is going. Both come from the route, which advances
  // continuously — that is what makes the world arrive instead of drift past.
  framePos(t) { return routePos(t); }
  frameDir(t) { return routeDir(t); }
  // basis with the frame's nose (local -Z) pointing along travel
  frameBasis(t, q) {
    const f = this.frameDir(t);
    const side = new THREE.Vector3().crossVectors(V(0, 1, 0), f).normalize();
    const up = new THREE.Vector3().crossVectors(f, side).normalize();
    const m = new THREE.Matrix4().makeBasis(side.clone().negate(), up, f.clone().negate());
    q.setFromRotationMatrix(m);
    return { f, side, up };
  }

  update(t, shot, tl, index) {
    this.camPos = this.camera(shot, tl, index).pos;
    const ts = this.stutter(t, shot);
    const M = mood(shot.mode);
    const kick = this.tl.kick(ts) * (0.35 + 0.65 * this.tl.env('low', ts));
    const energy = this.tl.env('rms', ts);
    const w = warmth(ts), reached = hopsAt(ts);
    const dead = ts >= BURN[0] && ts < BURN[1] + 0.9;
    const past = !!shot.flash;
    const u = routeU(ts);
    const fpos = this.framePos(ts);
    const col = this.tmp.copy(this.cyan).lerp(this.amber, w);
    const hot = this.tmp2.copy(this.hotC).lerp(this.hotA, w);
    const dim = past ? 0.45 : 1;

    this.space.update(ts, {
      warmth: w, speed: M.speed * (0.7 + 0.6 * energy), gain: M.gain * (0.85 + 0.35 * energy),
      u, pulse: kick, density: M.density * (0.6 + 0.6 * energy), dim,
    });
    // other traffic, and the firewall gate that blocks it while the rules are still being checked
    const gateU = shot.mode === 'firewall' ? NODE_U[4] : null;
    this.traffic.update(ts, { warmth: w, gain: M.gain, dim, lanes: (past ? 0.3 : 0.6) * M.density, gate: gateU });

    const fu = this.floor.material.uniforms;
    fu.uT.value = ts * M.speed; fu.uPulse.value = past ? 0 : kick;
    fu.uGain.value = (0.26 + 0.32 * energy) * M.gain * dim; fu.uAcc.value.copy(col);

    // route and gates
    this.route.material.color.copy(col).multiplyScalar(1.7);
    this.route.material.opacity = 0.5 * dim * (1 - smooth(remap(ts, SILENT_T, SILENT_T + 2.6)));
    this.nodes.forEach(({ h, group, ring, gantry }) => {
      const on = h.n <= reached;
      const hit = nodeHit(ts, h.n, 1.1);
      ring.material.color.copy(h.n > 5 ? this.amber : this.cyan).multiplyScalar(on ? 3.2 : 0.55);
      ring.material.opacity = (on ? 0.55 : 0.10) * dim;
      ring.scale.setScalar(1 + 0.10 * kick * (on ? 1 : 0) + hit * 0.45);
      ring.material.opacity = Math.min(1.4, ring.material.opacity + hit * 0.8);
      gantry.material.color.copy(on ? col : new THREE.Color(PAL.grid));
      gantry.material.opacity = (on ? 0.26 : 0.09) * dim;
      group.rotateZ(0);   // the gate is oriented to the route; no spin
    });

    // the destination stays a point of light: it fades as the camera closes in, or it washes the frame
    const arrive = smooth(remap(ts, 215, 222));
    const near = clamp((this.camPos.distanceTo(this.dest.position) - 8) / 60);
    this.dest.material.opacity = (0.30 + 0.30 * w + 0.25 * arrive) * near * dim;
    this.dest.scale.setScalar(4 + 9 * w + 12 * arrive + 1.8 * kick);

    // the hero
    const die = dead ? clamp((ts - BURN[0]) / (BURN[1] - BURN[0])) : 0;
    this.frame.tint(dead ? PAL.down : hot.getStyle());
    this.frame.group.visible = !(dead && ts > BURN[1] + 0.6);
    const screen = ROOM_MODES.includes(shot.mode) ? this.lapPoint('screen') : null;
    if (screen) {
      // the arrival stops AT the screen and never passes through it
      const ant = this.lapPoint('antenna') || screen;
      const k = shot.mode === 'arrival' ? clamp(tl / 5) : 1;
      const stop = screen.clone().add(V(0, 0.15, 0.9));
      const lead = k < 0.72 ? ant : stop;
      const from = ant.clone().add(V(11, 8, 19));
      this.frame.group.position.lerpVectors(from, lead, smooth(k < 0.72 ? k / 0.72 : 1));
      this.frame.group.lookAt(screen);
    } else {
      this.frame.group.position.copy(fpos);
      this.frameBasis(ts, this.frame.group.quaternion);
    }
    if (die > 0) this.frame.group.rotateZ(die * 1.6), this.frame.group.rotateX(die * 0.5);
    const shrink = ROOM_MODES.includes(shot.mode) ? (shot.mode === 'arrival' ? 1 - 0.86 * clamp(tl / 5) : 0.14) : 1;
    this.frame.group.scale.setScalar(0.85 * shrink * (1 + 0.07 * kick) * (dead ? clamp(1 - (ts - BURN[1]) / 0.6) : 1));
    this.frame.set({
      t: ts, ttl: ttlAt(ts), body: past ? 0.8 : 1,
      core: (dead ? 0.25 : 0.85) + 0.4 * kick,
      layers: shot.mode === 'layers' || shot.mode === 'l1l4' ? clamp(tl / 0.8) : 0,
      wake: (0.35 + 1.0 * energy) * M.speed, camPos: this.camPos,
    });

    // ---- chapter set pieces: only the one this scene belongs to is on
    const mode = shot.mode;
    const p01 = clamp(tl / Math.max(0.1, shot.t[1] - shot.t[0]));
    for (const pr of [this.bulkhead, this.routeWall, this.monolith, this.layers, this.skyline, this.screen]) pr.group.visible = false;
    for (const g of Object.values(this.gear)) g.visible = false;
    for (const g of this.city) g.visible = false;

    const fdir = this.frameDir(ts);
    // the tangent already points along travel, so ahead is a POSITIVE step along it
    const ahead = (d) => fpos.clone().add(fdir.clone().multiplyScalar(d));
    const sideVec = () => new THREE.Vector3().crossVectors(V(0, 1, 0), fdir).normalize();
    // set pieces stand across the route, facing back the way the frame is coming from
    const faceRoute = (g, at) => {
      g.position.copy(at);
      g.rotation.set(0, Math.atan2(-fdir.x, -fdir.z), 0);
      return g;
    };
    const put = (id, lat, lift, dist, extraY = 0) => {
      const g = this.gear[id]; if (!g) return null;
      g.visible = true;
      faceRoute(g, ahead(dist).add(sideVec().multiplyScalar(lat)).add(V(0, lift, 0)));
      g.rotation.y += extraY;
      return g;
    };

    if (mode === 'firewall') { faceRoute(this.bulkhead.group, ahead(30)); this.bulkhead.update(ts, p01); }
    if (mode === 'table' || mode === 'prefix') {
      faceRoute(this.routeWall.group, ahead(26));
      this.routeWall.update(ts, p01, mode === 'prefix' ? clamp(tl / 0.9) : 0);
    }
    if (mode === 'ttl' || mode === 'turn' || mode === 'linkbylink') {
      faceRoute(this.monolith.group, ahead(mode === 'turn' ? 40 : 90));
      this.monolith.update(ts, mode === 'linkbylink' ? 0.35 : 1, mode === 'turn' ? clamp((tl - 1.2) / 1.6) : 0);
    }
    if (mode === 'layers' || mode === 'l1l4') {
      faceRoute(this.layers.group, ahead(16));
      this.layers.update(ts, 1, mode === 'layers' ? clamp(tl / 1.4) : 1 - clamp(tl / 2.2) * 0.55);
    }

    if (mode === 'plunge' || mode === 'hop1') put('port-macro', 0, 0, 30);
    if (mode === 'hop1' || mode === 'hop2') put('switch-48p', 0, 0, 46);
    if (mode === 'chorusC' || mode === 'chorusE') put('switch-48p', 0, 0, 38);
    if (mode === 'hop6' || mode === 'l1l4') put('router-core', 0, 0, 40);
    if (mode === 'rise' || mode === 'build' || mode === 'breathe') put('rack-aisle', 19, -13, 44);
    if (mode === 'chorusD' || mode === 'air') put('ap-ceiling', 0, 12, 20, Math.PI);
    if (mode === 'city' || mode === 'moving' || mode === 'dawn' || mode === 'topology' || mode === 'pullout') {
      this.city.forEach((g, i) => {
        g.visible = true;
        g.position.copy(ahead(120 + i * 70).add(sideVec().multiplyScalar((i - 1) * 74)).add(V(0, -28, 0)));
        g.rotation.y = i * 0.7;
      });
    }

    if (ROOM_MODES.includes(mode)) {
      // The room is an absolute place at the end of the route, not something positioned relative to
      // the frame — `put` is for set pieces the frame flies towards.
      const base = this.roomBase();
      const place = (id, at, ry = 0) => {
        const g = this.gear[id]; if (!g) return null;
        g.visible = true; g.position.copy(at); g.rotation.set(0, ry, 0); return g;
      };
      place('office', base);
      if (this.sets && this.sets.anchor('office', 'laptop')) place('laptop', this.officePoint('laptop'));
      place('ap-ceiling', base.clone().add(V(6.5, 26, -6)), Math.PI);

      // the live screen hangs off the laptop set, at the anchor the model carries
      const lap = this.gear['laptop'], anch = this.sets && this.sets.anchor('laptop', 'screen');
      if (lap && anch) {
        if (this.screen.group.parent !== lap) lap.add(this.screen.group);
        this.screen.group.position.copy(anch.pos);
        this.screen.group.quaternion.copy(anch.quat);
        this.screen.group.rotateY(Math.PI);   // the anchor's +Z is the lid's OUTSIDE; the panel faces the user
      }
      this.screen.update(ts, mode === 'arrival' ? clamp((tl - 1.5) / 2.5) : 1,
        { env: energy, kick, dawn: clamp((ts - 228) / 14) });
    }

    this.fx.sat = past ? 0.25 : 1;
    this.fx.glitch = past ? 0.35 + 0.5 * (dead ? 1 : 0) : shot.predict ? 0.18 + 0.25 * kick : 0.03;
    this.fx.vignette = past ? 0.72 : 0.38;
    this.fx.exposure = past ? 0.72 : 1;
    this.fx.shake = M.shake ?? 1;
    this.fx.ca = M.speed > 2 ? 0.12 * (M.speed - 2) : 0;
  }

  // The camera rides the route with the frame and ORBITS it, in the plane across the direction of
  // travel. Because the whole rig advances along the curve, static geometry actually comes towards
  // the lens instead of sliding past — which a fixed side view never gave.
  //
  // `view` still exists for the set pieces that stand across the route (the firewall bulkhead, the
  // routing walls, the server): those are framed from behind, looking down the corridor.
  camera(shot, tl, index) {
    const ts = this.stutter(shot.t[0] + tl, shot);
    const tls = ts - shot.t[0];
    const M = mood(shot.mode);
    const out = shot.mode === 'pullout' ? clamp(tls / 7.6) ** 1.4
      : shot.mode === 'topology' ? 0.72
      : shot.mode === 'descend' ? (1 - clamp(tls / 6)) ** 1.4 : 0;

    if (ROOM_MODES.includes(shot.mode) && this.sets && this.sets.sets.has('office')) {
      const look = this.lapPoint('screen') || this.officePoint('laptop');
      const stand = { arrival: ['laptop', 'cam.screen'], room: ['office', 'cam.over'], ack: ['office', 'cam.over'],
                      lands: ['office', 'cam.over'], silent: ['office', 'cam.wide'], ends: ['office', 'cam.window'] }[shot.mode];
      const pos = stand[0] === 'laptop' ? this.lapPoint(stand[1]) : this.officePoint(stand[1]);
      if (pos && look) {
        const drift = tls * 0.35;
        return {
          pos: pos.clone().add(V(Math.sin(drift * 0.4) * 0.5, 0.18 * Math.sin(drift * 0.3), 0)),
          target: look, fov: shot.mode === 'arrival' ? 34 : 40,
        };
      }
    }

    const u = routeU(ts);
    const p = FLIGHT.at(u), f = FLIGHT.tangent(u);
    const side = new THREE.Vector3().crossVectors(V(0, 1, 0), f).normalize();
    const up = new THREE.Vector3().crossVectors(f, side).normalize();

    if (M.view === 'down' || M.view === 'back') {
      const fwd = M.view === 'down' ? 1 : -1;
      const back = (5 + 5 * Math.min(1.6, M.dist));
      const sway = Math.sin(tls * 0.3 + index * 1.7) * 1.1 * Math.min(1.6, M.dist);
      return {
        pos: p.clone().add(f.clone().multiplyScalar(-fwd * back)).add(side.clone().multiplyScalar(sway)).add(up.clone().multiplyScalar(0.8 + 1.4 * hash(index, 5))),
        target: p.clone().add(f.clone().multiplyScalar(fwd * 40)).add(up.clone().multiplyScalar(0.8)),
        fov: M.fov,
      };
    }

    // Orbit: the camera sits BEHIND and beside the frame and looks at it, while the whole rig rides
    // the curve. The angle sweeps through the shot, so no two seconds share a vantage.
    const spin = M.orbit ?? 0.5;
    const a = hash(index, 3) * Math.PI * 2 + tls * spin;
    const r = (3.4 + 2.2 * hash(index, 4)) * Math.min(1.7, M.dist);
    const back = (3.0 + 3.0 * hash(index, 9)) * Math.min(1.8, M.dist);
    const pos = p.clone()
      .add(side.clone().multiplyScalar(Math.cos(a) * r))
      .add(up.clone().multiplyScalar(Math.sin(a) * r * 0.6 + 0.5))
      .add(f.clone().multiplyScalar(-back));
    const target = p.clone().add(f.clone().multiplyScalar(1.2));
    if (out > 0.001) {
      pos.add(up.clone().multiplyScalar(out * 120)).add(f.clone().multiplyScalar(-out * 150));
      target.add(f.clone().multiplyScalar(out * 40));
    }
    return { pos, target, fov: M.fov + 14 * out };
  }

}
