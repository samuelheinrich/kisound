// The voyage: the Ethernet frame as a starship travels its nine hops through space. Warp jumps with streaking stars,
// stops at real places – a nebula, an orbital station, a gas giant, a star gate (the firewall), ringed planets, a
// pulsar for the turn, a MASSIVE wormhole, a system with three suns – and the last hop: out of warp in front of a blue
// world at sunrise, the ship becomes a beam of light and falls through the atmosphere onto one warm window.
// During warp the camera sits in the cockpit: syslog, traceroute, TTL and the star map run on its displays.
// Pure function of t: travel distance, warp and every animation are derived from the clock, never accumulated.
import * as THREE from 'three';
import { PAL, HOPS, MESSAGES, DEST, ttlAt, warmth, hopsAt, BURN, FLIP_T, TURN_T, STATUS_COL } from '../config.js';
import { V, hash, clamp, lerp, smooth, remap } from '../core.js';
import { glowSprite } from '../world.js';
import { Frame } from '../frame.js';

const MONO = '"JetBrains Mono", Menlo, monospace', SANS = '"Space Grotesk", system-ui, sans-serif';
const col = (h, k = 1) => new THREE.Color(PAL[h] || h).multiplyScalar(k);
const add = (p, o, pos, rot) => { if (pos) o.position.set(...pos); if (rot) o.rotation.set(...rot); p.add(o); return o; };
const mesh = (geo, mat) => new THREE.Mesh(geo, mat);
const basic = (c, k = 1, o = {}) => new THREE.MeshBasicMaterial({ color: col(c, k), toneMapped: false, ...o });
const additive = (c, k = 1, o = {}) => basic(c, k, { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, ...o });
const std = (c, r = .6, m = .2, o = {}) => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), roughness: r, metalness: m, ...o });

// ------------------------------------------------------------------ procedural textures (deterministic value noise)
function vn(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), h = (i, j) => hash(i + s * 17.3, j + s * 3.1);
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v); }
function fbm(x, y, s, o = 5) { let a = 0, f = 1, w = .5; for (let i = 0; i < o; i++) { a += w * vn(x * f, y * f, s + i); f *= 2.03; w *= .5; } return a; }
function pixels(w, h, fn, srgb = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), im = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const [r, gg, b, a] = fn(x / w, y / h), i = (y * w + x) * 4; im.data[i] = r; im.data[i + 1] = gg; im.data[i + 2] = b; im.data[i + 3] = a ?? 255; }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; return t; }
const ramp = (stops, k) => { k = clamp(k); let i = 1; while (i < stops.length - 1 && stops[i][0] < k) i++; const [a, ca] = stops[i - 1], [b, cb] = stops[i], u = clamp((k - a) / (b - a || 1)); return ca.map((v, j) => v + (cb[j] - v) * u); };
// a cloud for the nebula: soft round falloff × fbm, coloured by a ramp, alpha from density
const cloudTex = (seed, stops) => pixels(256, 256, (u, v) => { const dx = u - .5, dy = v - .5, r = Math.sqrt(dx * dx + dy * dy) * 2, f = fbm(u * 4 + seed, v * 4, seed, 5), d = clamp((f - .32) * 2.2) * clamp(1 - r) ** 1.6; const c = ramp(stops, f); return [c[0], c[1], c[2], 255 * d]; });
const bandTex = (seed, stops) => pixels(512, 256, (u, v) => { const n = fbm(u * 3 + seed, v * 24, seed, 4), b = .5 + .5 * Math.sin(v * 38 + n * 6 + seed), c = ramp(stops, clamp(.25 + .5 * b + .25 * fbm(u * 8, v * 40, seed + 9, 3))); return c; });
const ringTex = (seed, stops) => pixels(512, 4, (u) => { const n = fbm(u * 40, .5, seed, 4), gap = Math.abs(u - .62) < .03 ? .1 : 1, a = clamp((n - .25) * 2) * gap * smooth(remap(u, 0, .08)) * (1 - smooth(remap(u, .92, 1))); const c = ramp(stops, n); return [c[0], c[1], c[2], 255 * a]; });
const earthDay = () => pixels(1024, 512, (u, v) => { const lat = (v - .5) * Math.PI, n = fbm(u * 9, v * 4.5, 41, 6), land = n > .58, cl = clamp((fbm(u * 16 + 3, v * 8, 91, 5) - .64) * 3.2), ice = Math.abs(lat) > 1.36 + .1 * fbm(u * 9, v * 9, 7, 3);
  const base = ice ? [235, 240, 245] : land ? ramp([[0, [46, 92, 52]], [.55, [86, 110, 60]], [1, [140, 128, 92]]], fbm(u * 18, v * 9, 13, 4)) : ramp([[0, [10, 40, 95]], [1, [30, 95, 165]]], clamp((n - .3) * 4)); return base.map((c) => c + (245 - c) * cl * .85); });
function earthNight() { const W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90000; i++) { const u = hash(i, 101), v = .12 + .76 * hash(i, 102); if (fbm(u * 9, v * 4.5, 41, 6) < .585) continue; const city = fbm(u * 30, v * 15, 5, 3); if (hash(i, 103) > (city - .45) * 1.6) continue; const x = u * W, y = v * H, b = .5 + .5 * hash(i, 104);
    g.fillStyle = `rgba(255,${190 + 40 * b | 0},${120 + 40 * b | 0},${.25 * b})`; g.fillRect(x - 2, y - 2, 5, 5); g.fillStyle = `rgba(255,230,180,${.9 * b})`; g.fillRect(x, y, 1.4, 1.4); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const swirlTex = (seed, stops) => pixels(512, 512, (u, v) => { const dx = u - .5, dy = v - .5, r = Math.sqrt(dx * dx + dy * dy) * 2, a = Math.atan2(dy, dx), s = fbm(a * 2 + r * 9 + seed, r * 3, seed, 5), k = clamp(1 - Math.abs(r - .62) / .38), d = clamp((s - .25) * 1.8) * k ** 1.4 * smooth(remap(r, .36, .44)); const c = ramp(stops, s * .6 + (1 - r) * .5); return [c[0], c[1], c[2], 255 * d]; });
const tunnelTex = (seed) => pixels(256, 512, (u, v) => { const s = fbm(u * 6 + v * 2, v * 14, seed, 5), k = clamp((s - .3) * 2); const c = ramp([[0, [10, 20, 60]], [.5, [60, 140, 255]], [1, [255, 230, 200]]], k); return [c[0], c[1], c[2], 255 * k]; });
const galaxyTex = () => pixels(512, 512, (u, v) => { const dx = u - .5, dy = v - .5, r = Math.sqrt(dx * dx + dy * dy) * 2, a = Math.atan2(dy, dx), arm = .5 + .5 * Math.cos(2 * (a - r * 5.5)), n = fbm(u * 8, v * 8, 77, 5), d = clamp(1 - r) ** 1.3 * (.25 + .75 * arm * n) + clamp(1 - r * 4) ** 2;
  const c = ramp([[0, [40, 60, 140]], [.6, [150, 160, 230]], [1, [255, 230, 190]]], clamp(d * 1.3)); return [c[0], c[1], c[2], 255 * clamp(d * 1.4)]; });
const windowTex = () => pixels(64, 128, (u, v) => { const x = Math.floor(u * 8), y = Math.floor(v * 16), inWin = (u * 8) % 1 > .25 && (v * 16) % 1 > .3, r = hash(x, y); if (!inWin) return [14, 17, 24]; return r < .07 ? [255, 196, 120] : r < .1 ? [150, 190, 240] : [22, 27, 36]; });
function rockGeo(seed) { const g = new THREE.IcosahedronGeometry(1, 2), p = g.attributes.position, v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = .75 + .5 * fbm(v.x * 1.7 + seed, v.y * 1.7 + v.z, seed, 3); v.multiplyScalar(n); p.setXYZ(i, v.x, v.y * .8, v.z); } g.computeVertexNormals(); return g; }
function label(text, sub, color = '#e6f4ff', w = 6) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 200; const g = c.getContext('2d'); g.fillStyle = 'rgba(4,10,20,.6)'; g.fillRect(0, 0, 1024, 200); g.strokeStyle = 'rgba(140,210,255,.5)'; g.lineWidth = 3; g.strokeRect(2, 2, 1020, 196);
  g.font = `600 78px ${SANS}`; g.fillStyle = color; g.fillText(text, 30, 100); if (sub) { g.font = `38px ${MONO}`; g.fillStyle = '#9fc0d8'; g.fillText(sub, 30, 166); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, toneMapped: false })); s.scale.set(w, w * .195, 1); s.renderOrder = 20; return s;
}
function dynTex(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; let last = null;
  return { tex, set(key, draw) { if (key === last) return; last = key; g.clearRect(0, 0, w, h); draw(g, w, h); tex.needsUpdate = true; } }; }

// ------------------------------------------------------------------ the scene plan: which place, how fast, where the camera is
// warp: 0 = drifting, 1 = full warp. A number, or [from, to] ramped over the shot, or 'pulse' (jump, drop out, jump …).
const M = {
  carrier: { sets: ['nebula'], warp: 0, cam: 'void' }, route: { sets: ['nebula'], warp: .01, cam: 'push' }, shore: { sets: ['nebula'], warp: .01, cam: 'vista' },
  noise: { sets: ['nebula', 'rocks'], warp: .06, cam: 'through' }, gap: { sets: ['nebula'], warp: 0, cam: 'pov', pov: 1, nav: 'gap' },
  rise: { sets: ['nebula'], warp: 0, cam: 'reveal', power: 1 }, title: { sets: ['nebula'], warp: 0, cam: 'hero' }, plunge: { sets: ['nebula'], warp: [0, 1], cam: 'chase' },
  hop1: { sets: ['station'], warp: [.9, .02], cam: 'station' }, hop2: { sets: ['giant'], warp: .35, cam: 'flyby' }, hop3: { sets: [], warp: 1, cam: 'pov', pov: 1 },
  firewall: { sets: ['gate'], warp: .02, cam: 'gate' }, table: { sets: [], warp: .05, cam: 'pov', pov: 1, nav: 'route' }, prefix: { sets: ['ringed'], warp: [.6, .02], cam: 'reveal2' },
  bright: { sets: ['ringed'], warp: .02, cam: 'long' }, hopbyhop: { sets: ['jumps'], warp: 'pulse', cam: 'chase' }, linkbylink: { sets: [], warp: 1, cam: 'pov', pov: 1 },
  ttl: { sets: ['nebula'], warp: .04, cam: 'ttl' }, room: { sets: ['room'], warp: 0, cam: 'room' }, ack: { sets: ['room'], warp: 0, cam: 'roomAck' }, turn: { sets: ['pulsar'], warp: .05, cam: 'slingshot', ship: 'slingshot' },
  chorusA: { sets: ['map'], cam: 'map' }, chorusB: { sets: ['earth', 'pin'], cam: 'earthPin' }, chorusC: { sets: ['wormhole'], cam: 'wormFar' }, chorusD: { sets: ['trisun'], cam: 'trisun' },
  chorusE: { sets: ['map'], cam: 'mapFull' }, chorusF: { sets: ['earth', 'pin'], cam: 'earthOrbit' }, heartbeat: { sets: [], warp: 'beat', cam: 'pov', pov: 1 }, dissolve: { sets: ['nebula'], warp: [.7, 0], cam: 'chase' },
  storms: { sets: ['storm'], warp: .03, cam: 'storm', past: 1 }, withdraw: { sets: ['gate'], warp: 0, cam: 'gate', past: 1, collapse: 1 }, timeout: { sets: ['probes'], warp: 0, cam: 'probes', past: 1 },
  death: { sets: ['binary'], warp: 0, cam: 'death', past: 1, ship: 'death' },
  green: { sets: ['wormhole'], warp: .02, cam: 'wormFar' }, breathe: { sets: ['wormhole'], warp: .15, cam: 'wormNear' }, layers: { sets: ['tunnel'], warp: .5, cam: 'tunnel' }, meet: { sets: ['tunnel'], warp: .85, cam: 'tunnelChase' },
  hop6: { sets: ['trisun'], warp: [1, .05], cam: 'exit' }, light: { sets: ['trisun'], warp: .03, cam: 'sunrise3' }, curve: { sets: ['trisun', 'ringed2'], warp: .1, cam: 'curve' },
  flip: { sets: ['trisun'], warp: .3, cam: 'flip' }, city: { sets: ['night'], warp: 0, cam: 'cityOrbit' },
  console: { sets: ['trisun'], warp: 0, cam: 'pov', pov: 1, calm: 1 }, loss: { sets: ['trisun'], warp: .05, cam: 'side' }, sfp: { sets: ['trisun'], warp: .05, cam: 'engine' },
  ports: { sets: ['trisun'], warp: .05, cam: 'nacelle' }, l1l4: { sets: ['ringed2', 'slab'], warp: .12, cam: 'rings' }, air: { sets: ['ringed2'], warp: .1, cam: 'limb' },
  moving: { sets: ['ringed2'], warp: .08, cam: 'clouds' }, dawn: { sets: ['ringed2', 'trisun'], warp: .02, cam: 'dawn' },
  build: { sets: ['montage'], warp: 'build', cam: 'montage' }, hold: { sets: ['nebula'], warp: 0, cam: 'chase', freeze: 1 },
  // final chorus (the same mode names as the predicted chorus, without `predict`)
  finalA: { sets: ['earth', 'pin'], warp: [1, 0], cam: 'arrive' }, finalC: { sets: ['earth', 'relay'], warp: .03, cam: 'relay' }, finalE: { sets: ['earth', 'beam'], warp: 0, cam: 'beam', ship: 'beam' },
  arrival: { sets: ['earth', 'city'], warp: 0, cam: 'descent' }, pullout: { sets: ['earth', 'city', 'map'], warp: 0, cam: 'pullout' }, topology: { sets: ['map'], warp: 0, cam: 'topology' },
  descend: { sets: ['earth', 'city'], warp: 0, cam: 'descend' },
};
// the journeys through the scales show one place at a time: orbit, city, galaxy
const phaseOf = (mode, k) => mode === 'arrival' || mode === 'descent' ? (k < .45 ? 'earth' : 'city') : mode === 'pullout' ? (k < .35 ? 'city' : k < .65 ? 'earth' : 'map') : mode === 'descend' ? (k < .4 ? 'map' : k < .7 ? 'earth' : 'city') : null;
const modeOf = (shot) => (!shot.predict && ['chorusA', 'chorusC', 'chorusE'].includes(shot.mode)) ? 'final' + shot.mode.slice(-1) : shot.mode;
const BEAT = 60 / 131.746;
// the wormhole: centre 1800 ahead, scaled ×4 (horizon radius 440, disk to 2080); the ship flies 0 → WORM_IN during `breathe`
const WORM_Z = 1800, WORM_S = 4, WORM_IN = 1330;
const wormShipZ = (mode, k) => mode === 'green' ? -lerp(0, 120, k) : mode === 'breathe' ? -lerp(120, WORM_IN, k ** 1.6) : 0;
function warpOf(spec, k, tl) { if (typeof spec === 'number') return spec; if (Array.isArray(spec)) return lerp(spec[0], spec[1], smooth(k)); if (spec === 'pulse') return smooth(clamp(Math.sin(tl / BEAT * Math.PI / 2) * 1.6)); if (spec === 'beat') return .9; if (spec === 'build') return clamp(.25 + .85 * k ** 1.5); return 0; }
const SUNDIR = { nebula: [.6, .5, .4], station: [.8, .3, .2], giant: [.9, .2, -.1], gate: [.4, .6, .5], ringed: [1, .25, .2], pulsar: [0, .3, -1], storm: [-.5, .5, .3], binary: [0, .4, -1],
  wormhole: [0, .2, -1], tunnel: [0, 0, -1], trisun: [-.4, .1, -1], ringed2: [-.4, .1, -1], night: [0, .1, -1], earth: [.65, .3, -.7], city: [.1, .05, -1], map: [0, 1, 0], jumps: [.6, .4, .3], rocks: [.6, .5, .4], probes: [0, 1, 0] };

export class CosmosZone {
  constructor(ctx) {
    this.shots = ctx.shots; this.timeline = ctx.timeline; this.near = .05; this.far = 6000; this.exposure = 1; this.bloom = .14; this.bloomThr = .85; this.clear = 0x000000; this.speedRef = 40;
    const s = this.scene = new THREE.Scene();
    this.hemi = new THREE.HemisphereLight(0x8fa6c8, 0x05070c, .35); s.add(this.hemi); this.sun = new THREE.DirectionalLight(0xffffff, 2.6); s.add(this.sun); s.add(this.sun.target);
    this.sets = {}; const S = (name) => { const g = new THREE.Group(); g.visible = false; s.add(g); this.sets[name] = g; return g; };
    this.buildSky(); this.buildStars();
    this.buildNebula(S('nebula')); this.buildRocks(S('rocks')); this.buildStation(S('station')); this.buildGiant(S('giant')); this.buildGate(S('gate')); this.buildRinged(S('ringed'), 'ringed');
    this.buildJumps(S('jumps')); this.buildPulsar(S('pulsar')); this.buildMap(S('map')); this.buildEarth(S('earth')); this.buildPin(S('pin')); this.buildWormhole(S('wormhole')); this.buildTunnel(S('tunnel'));
    this.buildTrisun(S('trisun')); this.buildRinged(S('ringed2'), 'ringed2'); this.buildSlab(S('slab')); this.buildNight(S('night')); this.buildStorm(S('storm')); this.buildProbes(S('probes')); this.buildBinary(S('binary'));
    this.buildRelay(S('relay')); this.buildBeam(S('beam')); this.buildCity(S('city')); this.buildRoom(S('room'));
    this.ship = this.buildShip(); this.cockpit = this.buildCockpit();
    this.travel = this.precomputeTravel();
  }
  // -------------------------------------------------------------- travel distance as a pure function of t (integral of the warp speed)
  warpAt(t) { const sh = this.shots.find((x) => t >= x.t[0] && t < x.t[1]) || this.shots.at(-1), m = M[modeOf(sh)] || {}, dur = sh.t[1] - sh.t[0], tl = t - sh.t[0]; return { w: m.freeze ? 0 : warpOf(m.warp ?? 0, tl / dur, tl), sh, m }; }
  precomputeTravel() { const step = 1 / 120, n = Math.ceil(300 / step) + 2, d = new Float32Array(n); let acc = 0; for (let i = 0; i < n; i++) { d[i] = acc; const { w } = this.warpAt(i * step); acc += (3 + 900 * w * w) * step; } return { d, step }; }
  dist(t) { const { d, step } = this.travel, x = clamp(t / step, 0, d.length - 2), i = Math.floor(x); return lerp(d[i], d[i + 1], x - i); }
  // -------------------------------------------------------------- sky, stars and the warp streaks
  buildSky() {
    const pts = [], cols = []; for (let i = 0; i < 6000; i++) { const u = hash(i, 1) * 2 - 1, a = hash(i, 2) * Math.PI * 2, r = 2600, q = Math.sqrt(1 - u * u); pts.push(r * q * Math.cos(a), r * u, r * q * Math.sin(a)); const c = new THREE.Color().setHSL(.55 + .15 * hash(i, 3), .4, .6 + .4 * hash(i, 4)); cols.push(c.r, c.g, c.b); }
    const g = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)).setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    this.sky = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false })); this.scene.add(this.sky);
    const band = mesh(new THREE.SphereGeometry(2500, 48, 32), new THREE.MeshBasicMaterial({ map: pixels(512, 256, (u, v) => { const b = Math.exp(-((v - .5 - .08 * Math.sin(u * 6.28)) ** 2) / .006), n = fbm(u * 12, v * 8, 3, 5); const k = b * (.4 + .6 * n); return [40 + 120 * k, 50 + 110 * k, 80 + 140 * k]; }), side: THREE.BackSide, transparent: true, opacity: .55, depthWrite: false, toneMapped: false }));
    band.rotation.set(.6, .3, .9); this.scene.add(band); this.band = band;
  }
  buildStars() {
    const N = 2400, seed = new Float32Array(N * 2 * 3), side = new Float32Array(N * 2); for (let i = 0; i < N; i++) for (let k = 0; k < 2; k++) { seed.set([hash(i, 11), hash(i, 12), hash(i, 13)], (i * 2 + k) * 3); side[i * 2 + k] = k; }
    const g = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3)).setAttribute('seed', new THREE.BufferAttribute(seed, 3)).setAttribute('side', new THREE.BufferAttribute(side, 1));
    this.streakMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uOff: { value: 0 }, uBox: { value: 600 }, uLen: { value: 0 }, uCam: { value: new THREE.Vector3() }, uCol: { value: new THREE.Color(1, 1, 1) }, uK: { value: 1 } },
      vertexShader: `attribute vec3 seed; attribute float side; uniform float uOff,uBox,uLen; uniform vec3 uCam; varying float vA;
        void main(){ vec3 p = seed*uBox; p.z = mod(p.z + uOff, uBox); p -= uBox*0.5; p += uCam; p.z += 0.0; vec3 q = p - vec3(0.0,0.0,1.0)*max(uLen,0.25)*side;
          float d = length(p.xy-uCam.xy); vA = smoothstep(uBox*0.5, uBox*0.15, length(p-uCam)) * smoothstep(1.5, 6.0, d) * (1.0 - 0.85*side);
          gl_Position = projectionMatrix*viewMatrix*vec4(q,1.0); }`,
      fragmentShader: 'uniform vec3 uCol; uniform float uK; varying float vA; void main(){ gl_FragColor = vec4(uCol*vA*uK, vA); }' });
    this.streaks = new THREE.LineSegments(g, this.streakMat); this.streaks.frustumCulled = false; this.scene.add(this.streaks);
  }
  // -------------------------------------------------------------- places
  sprites(g, n, tex, { r0, r1, dir = null, spread = 1, size = [200, 600], k = 1, seed = 1 }) { for (let i = 0; i < n; i++) { const m = new THREE.SpriteMaterial({ map: tex[i % tex.length], color: new THREE.Color(1, 1, 1).multiplyScalar(k * (.6 + .4 * hash(i, seed))), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false });
    const sp = new THREE.Sprite(m), u = hash(i, seed + 1) * 2 - 1, a = hash(i, seed + 2) * Math.PI * 2, q = Math.sqrt(1 - u * u), r = lerp(r0, r1, hash(i, seed + 3)); let p = V(q * Math.cos(a), u * .5, q * Math.sin(a));
    if (dir) p = V(...dir).normalize().add(p.multiplyScalar(spread)).normalize(); sp.position.copy(p.multiplyScalar(r)); const sz = lerp(size[0], size[1], hash(i, seed + 4)); sp.scale.set(sz, sz, 1); m.rotation = hash(i, seed + 5) * 6.28; g.add(sp); } }
  buildNebula(g) {
    const t = [cloudTex(1, [[0, [40, 20, 90]], [.5, [140, 60, 200]], [1, [255, 140, 210]]]), cloudTex(2, [[0, [10, 40, 90]], [.5, [40, 140, 210]], [1, [180, 240, 255]]]), cloudTex(3, [[0, [60, 20, 60]], [.6, [220, 90, 140]], [1, [255, 200, 160]]])];
    this.sprites(g, 70, t, { r0: 700, r1: 1600, size: [500, 1300], k: .55, seed: 3 }); this.sprites(g, 50, t, { r0: 500, r1: 1100, dir: [.2, .1, -1], spread: .5, size: [300, 900], k: .9, seed: 9 });
    this.shore = glowSprite(new THREE.Color(PAL.dawn).multiplyScalar(3), 120); add(g, this.shore, [260, 60, -1100]);
  }
  buildRocks(g) { const geo = rockGeo(3), m = new THREE.InstancedMesh(geo, std(0x7a746c, .95, .05), 260), d = new THREE.Object3D(); for (let i = 0; i < 260; i++) { d.position.set((hash(i, 21) - .5) * 160, (hash(i, 22) - .5) * 60, -hash(i, 23) * 400 + 60); d.rotation.set(hash(i, 24) * 6, hash(i, 25) * 6, 0); d.scale.setScalar(.6 + hash(i, 26) ** 3 * 9); d.updateMatrix(); m.setMatrixAt(i, d.matrix); } g.add(m); this.rocks = m;
    this.traffic = []; for (let i = 0; i < 24; i++) { const sp = glowSprite(new THREE.Color().setHSL(.5 + .2 * hash(i, 30), .6, .6).multiplyScalar(3), 1.6); g.add(sp); this.traffic.push(sp); } }
  buildStation(g) { add(g, mesh(new THREE.TorusGeometry(26, 2.2, 16, 96), std(0x9aa6b2, .45, .7)), [0, 0, -14]); add(g, mesh(new THREE.TorusGeometry(26, .25, 6, 96), additive(PAL.cyanHot, 2)), [0, 0, -12.7]);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, sp = mesh(new THREE.CylinderGeometry(.5, .5, 24, 8), std(0x7a8692, .5, .7)); sp.position.set(Math.cos(a) * 13, Math.sin(a) * 13, -14); sp.rotation.z = a + Math.PI / 2; g.add(sp); }
    add(g, mesh(new THREE.CylinderGeometry(4, 4, 10, 24), std(0x8a96a2, .4, .7)), [0, 0, -14], [Math.PI / 2, 0, 0]); this.dockLights = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, l = glowSprite(new THREE.Color(i % 2 ? PAL.cyanHot : PAL.amberHot).multiplyScalar(4), 1.2); l.position.set(Math.cos(a) * 26, Math.sin(a) * 26, -11.4); g.add(l); this.dockLights.push(l); }
    const p = mesh(new THREE.SphereGeometry(500, 64, 48), std(0xffffff, .9, 0, { map: bandTex(5, [[0, [40, 60, 90]], [.5, [90, 120, 150]], [1, [180, 190, 200]]]) })); p.position.set(-200, -620, -500); g.add(p); this.stationPlanet = p; }
  buildGiant(g) { const p = mesh(new THREE.SphereGeometry(160, 64, 48), std(0xffffff, .85, 0, { map: bandTex(7, [[0, [120, 70, 40]], [.4, [200, 140, 90]], [.7, [230, 210, 170]], [1, [160, 90, 60]]]) })); g.add(p); this.giant = p; }
  buildRinged(g, key) { const cream = key === 'ringed', r = cream ? 90 : 110; const p = mesh(new THREE.SphereGeometry(r, 96, 64), std(0xffffff, .85, 0, { map: bandTex(cream ? 11 : 23, cream ? [[0, [190, 160, 110]], [.5, [230, 210, 160]], [1, [170, 130, 90]]] : [[0, [60, 120, 150]], [.5, [120, 190, 210]], [1, [200, 235, 240]]]) }));
    const geo = new THREE.RingGeometry(r * 1.25, r * 2.3, 256, 1), pos = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < pos.count; i++) { const rr = Math.hypot(pos.getX(i), pos.getY(i)); uv.setXY(i, (rr - r * 1.25) / (r * 1.05), .5); }
    const ring = mesh(geo, new THREE.MeshBasicMaterial({ map: ringTex(cream ? 3 : 8, cream ? [[0, [160, 140, 110]], [1, [240, 225, 200]]] : [[0, [120, 160, 190]], [1, [220, 240, 250]]]), transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
    ring.rotation.x = Math.PI / 2 - .32; const grp = new THREE.Group(); grp.add(p, ring); grp.rotation.z = cream ? .38 : -.25; g.add(grp); this[key] = grp; this[key + 'R'] = r; }
  buildGate(g) { this.gateSegs = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, seg = mesh(new THREE.BoxGeometry(3.6, 1.6, 2.4), std(0x3a4654, .4, .8)); seg.position.set(Math.cos(a) * 12, Math.sin(a) * 12, -30); seg.rotation.z = a + Math.PI / 2; g.add(seg); this.gateSegs.push({ seg, a });
      const l = mesh(new THREE.BoxGeometry(.5, .5, .5), basic(PAL.warn, 3)); l.position.set(Math.cos(a) * 10.7, Math.sin(a) * 10.7, -28.7); g.add(l); this.gateSegs[i].light = l; }
    this.gateRing = add(g, mesh(new THREE.TorusGeometry(12, .2, 8, 96), additive(PAL.cyanHot, 2)), [0, 0, -28.6]); this.scan = add(g, mesh(new THREE.CircleGeometry(11, 64), additive(PAL.cyan, .25, { side: THREE.DoubleSide })), [0, 0, -30]);
    this.scanBar = add(g, mesh(new THREE.BoxGeometry(22, .15, .1), additive(PAL.cyanHot, 3)), [0, 0, -29.5]); }
  buildJumps(g) { this.jumpStars = [PAL.cyanHot, PAL.amberHot, '#ff8fb0', '#9fffd0', '#c9a6ff'].map((c, i) => { const sp = glowSprite(new THREE.Color(c).multiplyScalar(5), 160); sp.position.set((i - 2) * 140, 30 * Math.sin(i), -700); sp.visible = false; g.add(sp); return sp; }); }
  buildPulsar(g) { this.pulsar = new THREE.Group(); this.pulsar.position.set(0, 0, -60); g.add(this.pulsar); add(this.pulsar, glowSprite(new THREE.Color(1, 1, 1).multiplyScalar(8), 14)); add(this.pulsar, mesh(new THREE.SphereGeometry(1.6, 24, 16), basic('#ffffff', 6)));
    this.jets = new THREE.Group(); this.pulsar.add(this.jets); for (const s of [1, -1]) { const j = mesh(new THREE.ConeGeometry(4, 160, 24, 1, true), additive('#8fd8ff', .8, { side: THREE.DoubleSide })); j.position.y = s * 80; j.rotation.x = s > 0 ? Math.PI : 0; this.jets.add(j); }
    this.pdisk = add(this.pulsar, mesh(new THREE.RingGeometry(4, 22, 96), new THREE.MeshBasicMaterial({ map: swirlTex(5, [[0, [60, 80, 200]], [1, [255, 240, 220]]]), transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })), null, [Math.PI / 2, 0, 0]); }
  buildWormhole(g) { const W = this.worm = new THREE.Group(); W.position.set(0, 0, -WORM_Z); W.scale.setScalar(WORM_S); g.add(W);
    // the throat: black at the rim, the other side (the blue tunnel) glows in the middle
    add(W, mesh(new THREE.SphereGeometry(110, 96, 64), new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 } }, vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
      fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float c=max(dot(vN,vV),0.0); float k=pow(c,6.0); vec3 other=mix(vec3(0.02,0.05,0.18),vec3(0.35,0.6,1.6),k)*k; gl_FragColor=vec4(other,1.0); }' })));
    this.einstein = add(W, mesh(new THREE.TorusGeometry(118, 3.2, 16, 200), additive('#fff2d8', 4)));
    const disk = mesh(new THREE.RingGeometry(120, 520, 256, 1), new THREE.MeshBasicMaterial({ map: swirlTex(9, [[0, [120, 40, 20]], [.4, [255, 120, 40]], [.8, [255, 220, 160]], [1, [255, 255, 255]]]), transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
    disk.material.color.multiplyScalar(1.4); this.wdisk = disk; const tilt = new THREE.Group(); tilt.rotation.x = 1.42; tilt.add(disk); W.add(tilt);
    const disk2 = mesh(new THREE.RingGeometry(112, 300, 192, 1), disk.material.clone()); disk2.material.color.setRGB(.45, .35, .7); this.wdisk2 = disk2; const t2 = new THREE.Group(); t2.rotation.set(-.2, 0, .1); t2.add(disk2); W.add(t2);
    add(W, glowSprite(new THREE.Color(1, .7, .4).multiplyScalar(.5), 700));
    this.wLabel = add(g, label('Wurmloch · Ersatzpfad', 'BGP 203.0.113.10 up · converged in 1842 ms', '#ffe2b0', 300), [0, 900, -WORM_Z]); }
  buildTunnel(g) { const tex = tunnelTex(4); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 6); this.tunnelTex = tex;
    add(g, mesh(new THREE.CylinderGeometry(18, 18, 2400, 64, 1, true), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, color: new THREE.Color(1.6, 1.6, 1.8) })), [0, 0, -1000], [Math.PI / 2, 0, 0]);
    this.tRings = new THREE.InstancedMesh(new THREE.TorusGeometry(16.5, .18, 6, 80), additive('#bfe4ff', 2.2), 40); g.add(this.tRings);
    this.streams = new THREE.InstancedMesh(new THREE.SphereGeometry(.18, 6, 4), additive('#ffd9a8', 3), 300); g.add(this.streams); }
  buildTrisun(g) { this.suns = [['#fff2c8', 34, [-300, 60, -1100]], ['#ffb066', 22, [180, -10, -950]], ['#a9d8ff', 14, [520, -140, -1300]]].map(([c, r, p]) => { const grp = new THREE.Group(); grp.position.set(...p); g.add(grp);
      add(grp, mesh(new THREE.SphereGeometry(r, 32, 24), basic(c, 6))); add(grp, glowSprite(new THREE.Color(c).multiplyScalar(3.5), r * 14)); add(grp, glowSprite(new THREE.Color(c).multiplyScalar(1.4), r * 40)); const fl = add(grp, mesh(new THREE.PlaneGeometry(r * 60, r * .5), additive(c, 1.2, { side: THREE.DoubleSide }))); return grp; });
    const p = mesh(new THREE.SphereGeometry(60, 64, 48), std(0xffffff, .8, 0, { map: earthDay() })); p.position.set(-120, -40, -380); g.add(p); this.triPlanet = p;
    add(g, label('3-Sonnen-System · ix-zrh-01', 'Hop 6 · ttl 63', '#ffe2b0', 120), [0, 160, -900]); }
  earthMat(r) { return new THREE.ShaderMaterial({ uniforms: { day: { value: this.dayTex ??= earthDay() }, night: { value: this.nightTex ??= earthNight() }, sunDir: { value: new THREE.Vector3(.65, .3, -.7).normalize() }, uCity: { value: 2.2 } },
    vertexShader: 'varying vec3 vN; varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: `uniform sampler2D day,night; uniform vec3 sunDir; uniform float uCity; varying vec3 vN; varying vec2 vUv; varying vec3 vW;
      void main(){ vec3 n=normalize(vN); float d=dot(n,normalize(sunDir)); float dayK=smoothstep(-0.12,0.22,d); vec3 tex=texture2D(day,vUv).rgb; vec3 c=tex*max(d,0.0)*1.05+tex*vec3(0.03,0.05,0.09);
        vec3 l=texture2D(night,vUv).rgb*(1.0-dayK)*uCity; vec3 v=normalize(cameraPosition-vW); float rim=pow(1.0-max(dot(n,v),0.0),3.0);
        vec3 atm=vec3(0.35,0.6,1.0)*rim*(0.2+0.9*smoothstep(-0.35,0.4,d)); vec3 dawn=vec3(1.0,0.45,0.15)*exp(-pow(d*6.0,2.0))*0.22*(0.3+rim);
        gl_FragColor=vec4(c+l+atm+dawn,1.0); }` }); }
  atmo(r, c = '#5aa8ff') { return mesh(new THREE.SphereGeometry(r * 1.035, 64, 48), new THREE.ShaderMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide, uniforms: { c: { value: new THREE.Color(c) } },
    vertexShader: 'varying vec3 n; varying vec3 v; void main(){ n=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); v=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; varying vec3 n; varying vec3 v; void main(){ float f=pow(1.-abs(dot(n,v)),2.4); gl_FragColor=vec4(c*f*1.6,f); }' })); }
  buildEarth(g) { const R = this.earthR = 260; this.earth = new THREE.Group(); this.earth.position.set(0, -300, -420); g.add(this.earth); this.earthM = this.earthMat(R); add(this.earth, mesh(new THREE.SphereGeometry(R, 128, 96), this.earthM)); add(this.earth, this.atmo(R)); this.earth.rotation.set(-.55, 2.6, 0);
    this.earthSun = add(g, glowSprite(new THREE.Color(PAL.dawn).multiplyScalar(3), 220), [1300, 300, -1700]); add(g, glowSprite(new THREE.Color(1, .9, .8).multiplyScalar(1.2), 700), [1300, 300, -1700]);
    add(g, label('Ziel · 192.168.1.254', 'Hop 9 · the last hop', '#ffd08a', 120), [0, 40, -500]); this.earthLabel = g.children.at(-1); }
  // the point on the planet where the window is: in the earth group's local frame
  windowLocal() { return V(0, 1, 0).applyAxisAngle(V(1, 0, 0), .9).multiplyScalar(this.earthR); }
  buildPin(g) { const p = this.pin = new THREE.Group(); g.add(p); add(p, mesh(new THREE.ConeGeometry(5, 14, 32), basic(PAL.amberHot, 3)), [0, 7, 0], [Math.PI, 0, 0]); add(p, mesh(new THREE.SphereGeometry(6, 24, 16), basic(PAL.amberHot, 3)), [0, 15, 0]); add(p, mesh(new THREE.TorusGeometry(10, .6, 8, 48), additive(PAL.amberHot, 2)), [0, .5, 0], [Math.PI / 2, 0, 0]); add(p, glowSprite(new THREE.Color(PAL.amberHot).multiplyScalar(3), 60), [0, 15, 0]); }
  buildSlab(g) { const m = new THREE.InstancedMesh(rockGeo(7), std(0xdfe6ec, .8, .05), 900), d = new THREE.Object3D(); for (let i = 0; i < 900; i++) { d.position.set((hash(i, 41) - .5) * 120, (hash(i, 42) - .5) * 4 - 1.5, -hash(i, 43) * 300 + 30); d.rotation.set(hash(i, 44) * 6, hash(i, 45) * 6, 0); d.scale.setScalar(.05 + hash(i, 46) ** 5 * 1.4); d.updateMatrix(); m.setMatrixAt(i, d.matrix); } g.add(m); this.slab = m; }
  buildNight(g) { const R = 220, p = this.night = new THREE.Group(); p.position.set(0, -260, -120); g.add(p); this.nightM = this.earthMat(R); this.nightM.uniforms.sunDir.value.set(.8, .1, -.6).normalize(); this.nightM.uniforms.uCity.value = 2.6; add(p, mesh(new THREE.SphereGeometry(R, 128, 96), this.nightM)); add(p, this.atmo(R, '#7fb4ff')); p.rotation.set(-.7, 1.2, 0);
    add(g, label('Zielnetz lebt', 'destination network is alive', '#ffd08a', 90), [0, 70, -260]); }
  buildStorm(g) { const t = [cloudTex(31, [[0, [60, 10, 10]], [.5, [200, 80, 30]], [1, [255, 220, 120]]]), cloudTex(32, [[0, [40, 20, 10]], [.6, [180, 120, 40]], [1, [255, 240, 180]]])]; this.sprites(g, 60, t, { r0: 80, r1: 500, dir: [0, 0, -1], spread: .7, size: [120, 500], k: 1.1, seed: 31 });
    this.bolts = []; for (let i = 0; i < 6; i++) { const pts = []; let p = V((hash(i, 50) - .5) * 200, 60, -200 - hash(i, 51) * 200); for (let k = 0; k < 14; k++) { pts.push(p.clone()); p = p.clone().add(V((hash(i, k) - .5) * 30, -10 - hash(k, i) * 6, (hash(i * 3, k) - .5) * 30)); } const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col('#fff2c0', 4), transparent: true, toneMapped: false })); g.add(l); this.bolts.push(l); } }
  buildProbes(g) { this.probes = []; for (let i = 0; i < 9; i++) { const sp = glowSprite(new THREE.Color(PAL.dim).multiplyScalar(3), 1.4); g.add(sp); this.probes.push(sp); } this.probeText = add(g, label('* * *', 'request timed out', '#9fb4c4', 18), [0, 8, -60]); }
  buildBinary(g) { this.bin = [['#ffd06a', 9], ['#ff6a4a', 6]].map(([c, r]) => { const grp = new THREE.Group(); g.add(grp); add(grp, mesh(new THREE.SphereGeometry(r, 32, 24), basic(c, 3))); add(grp, glowSprite(new THREE.Color(c).multiplyScalar(1.4), r * 7)); return grp; }); }
  buildRelay(g) { const r = this.relay = new THREE.Group(); r.position.set(0, 0, -40); g.add(r); add(r, mesh(new THREE.TorusGeometry(14, 1.2, 12, 64), std(0xb0bac4, .4, .8))); add(r, mesh(new THREE.TorusGeometry(14, .2, 6, 64), additive(PAL.amberHot, 2.5)), [0, 0, 1.3]);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2, arm = mesh(new THREE.BoxGeometry(1, 30, 1), std(0x8a96a2, .5, .7)); arm.position.set(Math.cos(a) * 28, Math.sin(a) * 28, 0); arm.rotation.z = a + Math.PI / 2; r.add(arm); add(r, mesh(new THREE.CylinderGeometry(3, 3, .4, 24), std(0xc0c8d0, .3, .8)), [Math.cos(a) * 44, Math.sin(a) * 44, 0], [Math.PI / 2, 0, 0]); }
    add(r, label('HOP 8 · acc-sw-07 · Relais', 'MAC 00:1A:2B:3C:4D:5E learned · Gi1/0/7', '#ffd08a', 30), [0, 22, 0]); }
  buildBeam(g) { this.beam = add(g, mesh(new THREE.CylinderGeometry(.6, .6, 1, 16, 1, true), additive(PAL.amberHot, 4, { side: THREE.DoubleSide }))); this.beamGlow = add(g, glowSprite(new THREE.Color(PAL.amberHot).multiplyScalar(4), 12)); this.beamLabel = add(g, label('HOP 9 · wireless', 'unicast to 00:1A:2B:3C:4D:5E · 1 attempt', '#ffd08a', 24)); }
  buildCity(g) { // a city at dawn around one warm window
    const sky = mesh(new THREE.SphereGeometry(1800, 32, 24), new THREE.MeshBasicMaterial({ map: pixels(16, 256, (u, v) => ramp([[0, [10, 18, 48]], [.48, [60, 70, 120]], [.56, [255, 150, 90]], [.62, [120, 80, 90]], [1, [20, 18, 26]]], v)), side: THREE.BackSide, depthWrite: false, toneMapped: false }));
    this.citySky = sky; g.add(sky); add(g, glowSprite(new THREE.Color(PAL.dawn).multiplyScalar(3), 700), [-600, 40, -1500]); add(g, mesh(new THREE.PlaneGeometry(4000, 4000), std(0x0b0f16, .95, 0)), [0, -.1, 0], [-Math.PI / 2, 0, 0]);
    const wt = windowTex(); wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(3, 6); const bm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: wt, color: new THREE.Color(1.1, 1.1, 1.2) }), 900), d = new THREE.Object3D(); let n = 0;
    for (let i = 0; i < 1400 && n < 900; i++) { const x = (hash(i, 61) - .5) * 1600, z = -hash(i, 62) * 1600 + 200; if (Math.abs(x) < 30 && z > -140) continue; const h = 12 + hash(i, 63) ** 2 * 110; d.position.set(x, h / 2, z); d.scale.set(14 + hash(i, 64) * 22, h, 14 + hash(i, 65) * 22); d.updateMatrix(); bm.setMatrixAt(n++, d.matrix); }
    bm.count = n; g.add(bm); const home = add(g, mesh(new THREE.BoxGeometry(26, 60, 22), new THREE.MeshBasicMaterial({ map: wt, color: new THREE.Color(.7, .7, .8) })), [0, 30, -100]);
    this.win = add(g, mesh(new THREE.PlaneGeometry(2.2, 1.6), basic(PAL.amberHot, 3)), [2, 34, -88.9]); this.winGlow = add(g, glowSprite(new THREE.Color(PAL.amberHot).multiplyScalar(2.5), 9), [2, 34, -88.6]); }
  // the last hop's destination: a real room at dawn behind the warm window – desk, the laptop that plays this track
  buildRoom(g) { const wood = std(0x9a7452, .55, .05), wall = std(0xd9d2c8, .9, 0), dark = std(0x23272d, .5, .4);
    add(g, mesh(new THREE.PlaneGeometry(6, 5), std(0x6b5a48, .7, 0)), [0, 0, 0], [-Math.PI / 2, 0, 0]); add(g, mesh(new THREE.PlaneGeometry(6, 3), wall), [-3, 1.5, 0], [0, Math.PI / 2, 0]); add(g, mesh(new THREE.PlaneGeometry(6, 3), wall), [3, 1.5, 0], [0, -Math.PI / 2, 0]); add(g, mesh(new THREE.PlaneGeometry(6, 5), std(0xe8e2d8, .95, 0)), [0, 2.8, 0], [Math.PI / 2, 0, 0]);
    // window wall with the dawn city
    const view = pixels(1024, 512, (u, v) => { let c = ramp([[0, [40, 50, 100]], [.45, [150, 120, 150]], [.62, [255, 170, 110]], [.7, [255, 210, 160]], [1, [60, 50, 60]]], v); const sx = u - .3, sy = v - .64, sun = Math.exp(-(sx * sx + sy * sy) / .002); c = c.map((x) => Math.min(255, x + 255 * sun));
      const b = Math.floor(u * 40), h = .62 + .25 * hash(b, 7) ** 2; if (v > h) { const lit = hash(Math.floor(u * 160), Math.floor(v * 90)) < .06 && (u * 160) % 1 > .3 && (v * 90) % 1 > .35; c = lit ? [255, 200, 130] : [26 + 20 * (1 - v), 22, 34]; } return c; });
    add(g, mesh(new THREE.PlaneGeometry(4.6, 2.2), new THREE.MeshBasicMaterial({ map: view, toneMapped: false, color: new THREE.Color(1.15, 1.1, 1.05) })), [0, 1.5, -2.6]);
    for (const [w, h, x, y] of [[6, .4, 0, 2.8], [6, .4, 0, .2], [.7, 2.6, -2.65, 1.5], [.7, 2.6, 2.65, 1.5]]) add(g, mesh(new THREE.PlaneGeometry(w, h), wall), [x, y, -2.5]); add(g, mesh(new THREE.BoxGeometry(.05, 2.2, .06), dark), [0, 1.5, -2.52]); add(g, mesh(new THREE.BoxGeometry(4.6, .05, .06), dark), [0, 1.5, -2.52]);
    this.roomSun = new THREE.SpotLight(0xffc89a, 40, 12, .7, .6, 1.2); this.roomSun.position.set(-1.2, 2.2, -3.2); this.roomSun.target.position.set(.6, .7, 0); g.add(this.roomSun, this.roomSun.target); g.add(new THREE.HemisphereLight(0xffe4cc, 0x3a2a24, .9));
    // desk, chair, lamp, plant, mug
    add(g, mesh(new THREE.BoxGeometry(1.8, .05, .8), wood), [0, .74, -1.6]); for (const x of [-.85, .85]) for (const z of [-1.95, -1.25]) add(g, mesh(new THREE.CylinderGeometry(.02, .02, .72, 8), dark), [x, .36, z]);
    add(g, mesh(new THREE.BoxGeometry(.5, .07, .48), std(0x2c3a4e, .8, 0)), [.05, .48, -.75]); add(g, mesh(new THREE.BoxGeometry(.48, .6, .06), std(0x2c3a4e, .8, 0)), [.05, .82, -.52], [-.12, 0, 0]);
    add(g, mesh(new THREE.CylinderGeometry(.04, .035, .1, 16), std(0xf2f2f0, .4, 0)), [.55, .8, -1.45]); add(g, mesh(new THREE.CylinderGeometry(.13, .1, .26, 16), std(0xd8cfc0, .8, 0)), [-.75, .9, -1.85]); for (let i = 0; i < 7; i++) add(g, mesh(new THREE.ConeGeometry(.06, .4, 8), std(0x4f8a4f, .8, 0)), [-.75 + .08 * Math.cos(i), 1.15, -1.85 + .08 * Math.sin(i)], [.3 * Math.sin(i * 1.7), 0, .3 * Math.cos(i * 1.3)]);
    // the laptop, screen live
    const lap = new THREE.Group(); lap.position.set(.05, .77, -1.55); g.add(lap); const alu = std(0xb7c0ca, .3, .8); add(lap, mesh(new THREE.BoxGeometry(.36, .016, .25), alu), [0, 0, 0]); add(lap, mesh(new THREE.PlaneGeometry(.31, .12), std(0x22262c, .7, .2)), [0, .009, .04], [-Math.PI / 2, 0, 0]);
    const lid = new THREE.Group(); lid.position.set(0, .008, -.125); lid.rotation.x = -.28; lap.add(lid); add(lid, mesh(new THREE.BoxGeometry(.36, .23, .01), alu), [0, .115, -.006]); this.roomScreen = dynTex(1024, 640); add(lid, mesh(new THREE.PlaneGeometry(.33, .2), new THREE.MeshBasicMaterial({ map: this.roomScreen.tex, toneMapped: false })), [0, .117, .0005]);
    this.roomGlow = add(lid, glowSprite(new THREE.Color(PAL.amberHot).multiplyScalar(.6), .7), [0, .12, .05]);
    // dust in the sunbeam
    this.dust = new THREE.InstancedMesh(new THREE.SphereGeometry(.004, 4, 3), additive('#ffe2c0', 2), 160); g.add(this.dust); }
  buildMap(g) { add(g, mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshBasicMaterial({ map: galaxyTex(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, color: new THREE.Color(1.2, 1.2, 1.3) })), [0, -20, 0], [-Math.PI / 2, 0, 0]);
    this.nodes = HOPS.map((h, i) => { const a = -1.9 + i * .44, r = 300 + i * 70, p = V(Math.cos(a) * r, 10 + 8 * Math.sin(i * 1.7), Math.sin(a) * r); const s = glowSprite(new THREE.Color(i === 8 ? PAL.amberHot : PAL.cyanHot).multiplyScalar(4), 50); s.position.copy(p); g.add(s);
      const l = label(`${h.n} · ${h.node}`, h.ip ? `${h.ip} · ttl ${h.ttl}` : `${h.port} · L2`, i === 8 ? '#ffd08a' : '#cfeaff', 130); l.position.copy(p).add(V(0, 60, 0)); g.add(l); return { p, s, l }; });
    const curve = new THREE.CatmullRomCurve3(this.nodes.map((n) => n.p)); this.routeCurve = curve; this.routeLine = add(g, mesh(new THREE.TubeGeometry(curve, 400, 3, 8, false), additive(PAL.amberHot, 2.4))); this.routeGeo = this.routeLine.geometry; }
  // -------------------------------------------------------------- the ship: the Ethernet frame as hull, plus canopy, nacelles, engines
  buildShip() { const f = this.frame = new Frame({ color: PAL.cyanHot, scale: 1 }), g = f.group; this.scene.add(g); const hull = std(0x2a3442, .35, .8), dark = std(0x0b1118, .3, .7);
    this.canopy = add(g, mesh(new THREE.SphereGeometry(.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), std(0x0a1a2a, .05, .9, { transparent: true, opacity: .85 })), [0, .3, -2.7], [0, 0, 0]); this.canopy.scale.set(1, .7, 2.2);
    this.nac = []; for (const s of [-1, 1]) { const n = new THREE.Group(); n.position.set(s * 1.45, .05, .9); g.add(n); add(n, mesh(new THREE.CylinderGeometry(.22, .28, 4.4, 16), hull), null, [Math.PI / 2, 0, 0]); add(g, mesh(new THREE.BoxGeometry(.9, .08, .7), dark), [s * .95, .05, .9]);
      const ring = add(n, mesh(new THREE.TorusGeometry(.3, .06, 8, 32), additive(PAL.cyanHot, 2)), [0, 0, -1.6]); const core = add(n, mesh(new THREE.CylinderGeometry(.17, .17, 3.4, 12, 1, true), additive(PAL.cyan, 1.2, { side: THREE.DoubleSide })), [0, 0, .2], [Math.PI / 2, 0, 0]);
      const tip = add(n, glowSprite(new THREE.Color(s < 0 ? '#ff4040' : '#40ff80').multiplyScalar(4), .5), [0, 0, -2.25]); this.nac.push({ n, ring, core, tip }); }
    this.engines = []; for (const x of [-.32, 0, .32]) { const e = add(g, mesh(new THREE.CylinderGeometry(.16, .22, .5, 16), dark), [x, 0, 3.75], [Math.PI / 2, 0, 0]); const plume = add(g, mesh(new THREE.ConeGeometry(.17, 1, 16, 1, true), additive(PAL.cyanHot, 2, { side: THREE.DoubleSide })), [x, 0, 4.3], [-Math.PI / 2, 0, 0]); const gl = add(g, glowSprite(new THREE.Color(PAL.cyanHot).multiplyScalar(3), 1.2), [x, 0, 4.05]); this.engines.push({ plume, gl }); }
    return f; }
  buildCockpit() { // canopy pillars in the corners, a slanted dashboard with three displays, HUD reticle
    const c = new THREE.Group(); this.scene.add(c); const frameM = std(0x161d26, .45, .7), panelM = std(0x0b1016, .6, .4), trim = additive(PAL.cyan, 1.2);
    for (const s2 of [-1, 1]) { const p = add(c, mesh(new THREE.BoxGeometry(.07, 1.7, .07), frameM), [s2 * .92, .2, -.95]); p.rotation.z = -s2 * .42; add(c, mesh(new THREE.BoxGeometry(.012, 1.7, .012), trim), [s2 * .89, .2, -.92], [0, 0, -s2 * .42]); }
    add(c, mesh(new THREE.BoxGeometry(2.8, .05, .05), frameM), [0, .66, -1.0]);
    const dash = add(c, mesh(new THREE.BoxGeometry(2.6, .06, .62), panelM), [0, -.5, -.82], [.42, 0, 0]); add(c, mesh(new THREE.BoxGeometry(2.6, .01, .012), trim), [0, -.41, -1.07]); add(c, mesh(new THREE.BoxGeometry(2.6, .4, .05), panelM), [0, -.74, -.7]);
    this.screens = [[-.56, 'log'], [0, 'trace'], [.56, 'nav']].map(([x, kind]) => { const t = dynTex(768, 480), rot = [-.42, -x * .45, 0];
      const m = add(c, mesh(new THREE.PlaneGeometry(.5, .31), new THREE.MeshBasicMaterial({ map: t.tex, toneMapped: false })), [x, -.43, -.86], rot); add(c, mesh(new THREE.BoxGeometry(.53, .34, .02), frameM), [x, -.434, -.872], rot); return { t, kind }; });
    this.reticle = add(c, mesh(new THREE.RingGeometry(.03, .032, 64), additive(PAL.cyanHot, 1.3, { side: THREE.DoubleSide })), [0, .04, -1.0]); for (let i = 0; i < 4; i++) add(c, mesh(new THREE.PlaneGeometry(.022, .0025), additive(PAL.cyanHot, 1.3, { side: THREE.DoubleSide })), [Math.cos(i * Math.PI / 2) * .05, .04 + Math.sin(i * Math.PI / 2) * .05, -1.0], [0, 0, i * Math.PI / 2]);
    this.leds = []; for (let i = 0; i < 14; i++) { const l = add(c, mesh(new THREE.BoxGeometry(.016, .008, .008), basic(i % 3 ? PAL.ok : PAL.cyanHot, 2)), [-1.0 + i * .155, -.6, -.68]); this.leds.push(l); }
    return c; }
  drawScreen(sc, t, shot, w) { const T = (g, s, x, y, size, c, wt = 400) => { g.font = `${wt} ${size}px ${MONO}`; g.fillStyle = c; g.fillText(s, x, y); };
    const fired = MESSAGES.filter((m) => m.t <= t && !(m.past && (t < 109.4 || t > 123.9))); const hops = fired.filter((m) => m.hop).length, ttl = ttlAt(t), k = Math.floor(t * 4);
    const key = `${sc.kind}|${fired.length}|${ttl}|${k}|${shot.id}`;
    sc.t.set(key, (g, W, H) => { g.fillStyle = '#04080e'; g.fillRect(0, 0, W, H); g.fillStyle = '#0c1a2a'; g.fillRect(0, 0, W, 40); g.strokeStyle = 'rgba(80,170,255,.4)'; g.strokeRect(1, 1, W - 2, H - 2);
      if (sc.kind === 'log') { T(g, 'SYSLOG · frame 0x4f2a', 14, 28, 20, '#7fb8e0', 600); fired.slice(-9).forEach((m, i) => { const c = PAL[STATUS_COL[m.status]] || PAL.text; T(g, `%${m.tag}`, 14, 78 + i * 44, 18, c, 700); T(g, m.text.slice(0, 44), 14, 98 + i * 44, 17, '#cfe2ee'); }); }
      else if (sc.kind === 'trace') { T(g, `traceroute ${DEST.ip}`, 14, 28, 20, '#7fb8e0', 600); fired.filter((m) => m.hop).forEach((m) => { const h = HOPS[m.hop - 1]; T(g, `${String(h.n).padStart(2)}  ${(h.ip || h.port).padEnd(14)} ${h.rtt.toFixed(2)} ms`, 14, 70 + (h.n - 1) * 34, 20, h.last ? PAL.amberHot : '#cfe2ee'); });
        T(g, 'TTL', 470, 360, 26, '#7fb8e0', 700); T(g, String(ttl), 470, 440, 86, ttl <= 8 ? PAL.down : ttl < 62 ? PAL.warn : PAL.cyanHot, 700); T(g, `WARP ${w.toFixed(2)}`, 14, 450, 30, w > .5 ? PAL.amberHot : '#7fb8e0', 700); }
      else { T(g, `NAV · ${hops} / 9 hops`, 14, 28, 20, '#7fb8e0', 600); const gap = (M[modeOf(shot)] || {}).nav === 'gap'; for (let i = 0; i < 9; i++) { const x = 60 + i * 80, y = 240 + 60 * Math.sin(i * .9), on = i < hops; g.fillStyle = on ? (i === 8 ? PAL.amberHot : PAL.cyanHot) : '#28405a'; g.beginPath(); g.arc(x, y, i === 8 ? 16 : 11, 0, 7); g.fill(); if (i) { g.strokeStyle = on ? PAL.cyan : (gap && i === 8 ? 'rgba(255,200,120,.25)' : '#28405a'); g.setLineDash(gap && i === 8 ? [6, 8] : []); g.lineWidth = 4; g.beginPath(); g.moveTo(x - 80, 240 + 60 * Math.sin((i - 1) * .9)); g.lineTo(x, y); g.stroke(); g.setLineDash([]); } }
        T(g, shot.predict ? 'PREDICTED · not yet observed' : `DEST ${DEST.ip}`, 14, 440, 24, shot.predict ? PAL.warn : PAL.amberHot, 700); } }); }
  // -------------------------------------------------------------- per frame
  update(ts, shot, tl, index) {
    const mode = modeOf(shot), m = M[mode] || M.chase || {}, dur = shot.t[1] - shot.t[0], k = clamp(tl / dur), t = m.freeze ? shot.t[0] : ts, w = m.freeze ? 0 : warpOf(m.warp ?? 0, k, tl), beat = this.timeline.kick(ts);
    this.mode = mode; this.m = m; this.k = k; this.w = w;
    const vis = new Set(m.sets || []); if (m.sets?.[0] === 'montage') vis.add(this.montageSet(k)); const ph = phaseOf(mode, k); if (ph) { vis.clear(); vis.add(ph); if (ph === 'earth' && mode === 'finalE') vis.add('beam'); }
    for (const [name, g] of Object.entries(this.sets)) g.visible = vis.has(name);
    const sd = SUNDIR[m.sets?.[0] === 'montage' ? this.montageSet(k) : (m.sets || [])[0]] || [.6, .5, .4]; this.sun.position.set(...sd).multiplyScalar(100); this.sun.target.position.set(0, 0, 0);
    // stars: streaks scale with warp; travel is the integral of the warp speed
    const cam = this.camera(shot, tl, index); this.streakMat.uniforms.uCam.value.copy(cam.pos); this.streakMat.uniforms.uOff.value = this.dist(t) % 600; this.streakMat.uniforms.uLen.value = 2 + 260 * w * w;
    this.streakMat.uniforms.uCol.value.copy(new THREE.Color(PAL.cyanHot).lerp(new THREE.Color(PAL.amberHot), warmth(ts) * .6)).lerp(new THREE.Color(1, 1, 1), .5); this.streakMat.uniforms.uK.value = .7 + 2.3 * w;
    this.sky.position.copy(cam.pos); this.band.position.copy(cam.pos); const indoor = m.sets?.[0] === 'room'; this.sky.visible = this.band.visible = this.streaks.visible = !indoor;
    this.updateShip(t, ts, shot, mode, m, k, tl, w, beat); this.updateSets(t, ts, shot, mode, m, k, tl, w, beat);
    // cockpit
    this.cockpit.visible = !!m.pov; if (m.pov) { this.cockpit.position.copy(cam.pos); const q = new THREE.Matrix4().lookAt(cam.pos, cam.target, V(0, 1, 0)); this.cockpit.quaternion.setFromRotationMatrix(q);
      for (const sc of this.screens) this.drawScreen(sc, ts, shot, w); this.leds.forEach((l, i) => l.material.color.copy(col(i % 3 ? PAL.ok : PAL.cyanHot, (Math.floor(ts * 5 + i * 1.7) % 4) ? 2 : .4))); }
    // post: warp aberration, past = desaturated, predicted = glitch
    // in the cockpit the camera is bolted to the ship: no shake, no kick punch, no glitch – only the stars move
    this.fx.ca = m.pov ? .12 * w : w * .9; this.fx.shake = m.pov ? 0 : .4 + 2.2 * w; this.fx.sat = m.past ? .22 : 1; this.fx.glitch = shot.predict && !m.pov ? .25 + .5 * (Math.floor(ts * 6) % 5 === 0) : 0; this.fx.vignette = m.pov ? .55 : .42; this.fx.punch = m.pov ? 0 : .6 + .8 * w;
    this.exposure = mode === 'death' ? 1 - .7 * clamp((ts - 122) / 1.2) : 1;
  }
  montageSet(k) { const seq = ['nebula', 'gate', 'ringed', 'pulsar', 'wormhole', 'trisun', 'ringed2', 'earth'], i = Math.min(seq.length - 1, Math.floor(k * seq.length)); return seq[i]; }
  updateShip(t, ts, shot, mode, m, k, tl, w, beat) {
    const f = this.frame, g = f.group, warm = warmth(ts), tint = new THREE.Color(PAL.cyanHot).lerp(new THREE.Color(PAL.amberHot), warm); const homeward = ts >= TURN_T;
    const hidden = ['chorusA', 'chorusE', 'map', 'topology', 'arrival', 'pullout', 'descend', 'city', 'finalE', 'room', 'ack'].includes(mode) && mode !== 'finalE' || m.pov; g.visible = !hidden;
    g.position.set(0, 0, 0); g.quaternion.identity(); g.scale.setScalar(1);
    if (m.ship === 'slingshot') { const a = lerp(-.4, Math.PI + .4, smooth(k)), R = 22; g.position.set(Math.sin(a) * R, 0, -60 + Math.cos(a) * R); const da = .01, a2 = a + da; const dir = V(Math.sin(a2) * R - Math.sin(a) * R, 0, Math.cos(a2) * R - Math.cos(a) * R).normalize(); g.lookAt(g.position.clone().sub(dir)); }
    if (m.ship === 'death') { const a = tl * 2.4, R = lerp(26, 6, k); g.position.set(Math.cos(a) * R, Math.sin(a * .5) * 4, -60 + Math.sin(a) * R * .6); g.rotation.set(0, -a, .4); f.tint(new THREE.Color(PAL.down)); g.visible = ts < BURN[1] + .6; g.scale.setScalar(ts > BURN[1] ? clamp(1 - (ts - BURN[1]) / .6) : 1); }
    else f.tint(tint);
    if (mode === 'firewall') g.position.z = -lerp(0, 40, smooth(remap(k, .72, 1)));
    if (mode === 'finalC') g.position.z = -lerp(0, 50, smooth(k));
    if (mode === 'green' || mode === 'breathe') g.position.z = wormShipZ(mode, k);
    if (mode === 'finalE') { const v = smooth(remap(k, 0, .35)); g.visible = v < 1; g.scale.setScalar(1 - v * .9); }
    const thrust = clamp(.25 + w * 1.2 + (m.power ? smooth(k) : 0)); this.engines.forEach((e, i) => { e.plume.scale.set(1, .4 + thrust * (2 + 6 * w) * (1 + .15 * Math.sin(ts * 40 + i)), 1); e.plume.position.z = 4.05 + e.plume.scale.y * .5; e.plume.material.color.copy(tint).multiplyScalar(1.5 + 2 * thrust); e.gl.material.color.copy(tint).multiplyScalar(2 + 3 * thrust); });
    this.nac.forEach((n, i) => { n.ring.material.color.copy(tint).multiplyScalar(1 + 5 * w + 1.5 * beat); n.core.material.color.copy(tint).multiplyScalar(.4 + 3 * w); n.tip.material.color.copy(col(i ? '#40ff80' : '#ff4040', Math.floor(ts * 1.2) % 2 ? 4 : .4)); n.ring.position.z = -1.6 + ((ts * (1 + 8 * w)) % 1) * 3.2; });
    f.set({ t: ts, ttl: ttlAt(ts), core: 1, body: 1, layers: mode === 'l1l4' ? 1 : 0, wake: .2 + w * 1.5, ip: 0, camPos: null });
    if (homeward && !['death'].includes(mode)) g.rotateY(0);
  }
  updateSets(t, ts, shot, mode, m, k, tl, w, beat) {
    if (this.sets.rocks.visible) { const off = (this.dist(t) % 400); this.rocks.position.z = off; this.traffic.forEach((sp, i) => { const u = ((t * (.05 + .05 * hash(i, 71)) + hash(i, 72)) % 1); sp.position.set(lerp(-120, 120, u) * (i % 2 ? 1 : -1), (hash(i, 73) - .5) * 50, -60 - hash(i, 74) * 300); }); }
    if (this.sets.station.visible) { this.dockLights.forEach((l, i) => l.material.color.copy(col(i % 2 ? PAL.cyanHot : PAL.amberHot, (Math.floor(ts * 6) + i) % 4 ? 3 : .5))); this.sets.station.position.z = this.dist(t) - this.dist(shot.t[0]) - 10; this.stationPlanet.rotation.y = ts * .01; }
    if (this.sets.giant.visible) { this.giant.position.set(lerp(260, 120, k), -60, lerp(-700, -260, k)); this.giant.rotation.y = ts * .02; }
    if (this.sets.gate.visible) { const permit = ts >= 46.8, coll = m.collapse ? smooth(k) : 0; this.gateSegs.forEach(({ seg, a, light }, i) => { const r = 12 + coll * (20 + 30 * hash(i, 81)); seg.position.set(Math.cos(a) * r, Math.sin(a) * r, -30 - coll * 20 * hash(i, 82)); seg.rotation.set(coll * 3 * hash(i, 83), coll * 2, a + Math.PI / 2 + coll * hash(i, 84) * 4);
        light.position.set(Math.cos(a) * (r - 1.3), Math.sin(a) * (r - 1.3), -28.7 - coll * 20 * hash(i, 82)); light.material.color.copy(col(m.collapse ? PAL.down : permit ? PAL.ok : ((Math.floor(ts * 8) + i) % 3 ? PAL.warn : '#332a10'), m.collapse ? 3 * (1 - coll) : 3)); });
      this.gateRing.visible = !m.collapse; this.scan.visible = this.scanBar.visible = !m.collapse && !permit; this.scanBar.position.y = 11 * Math.cos(ts * 2.2); this.gateRing.material.color.copy(col(permit ? PAL.ok : PAL.cyanHot, 2 + 2 * beat)); }
    if (this.sets.ringed.visible) { this.ringed.position.set(lerp(-60, -90, k), lerp(-40, -30, k), mode === 'prefix' ? lerp(-900, -420, smooth(k)) : -420); this.ringed.children[0].rotation.y = ts * .015; }
    if (this.sets.ringed2.visible) { const pos = { curve: [260, -40, -700], l1l4: [80, -20, -260], air: [0, -126, -60], moving: [0, -130, -40], dawn: [-60, -80, -380] }[mode] || [120, -60, -420]; this.ringed2.position.set(...pos); this.ringed2.children[0].rotation.y = ts * .012; }
    if (this.sets.slab.visible) this.slab.position.z = (this.dist(t) % 300);
    if (this.sets.jumps.visible) this.jumpStars.forEach((s, i) => { s.visible = Math.floor(tl / (BEAT * 2)) % 5 === i && w < .4; });
    if (this.sets.pulsar.visible) { this.jets.rotation.set(.35 * Math.sin(ts * .8), ts * .6, .25 * Math.cos(ts * .8)); this.pdisk.rotation.z = ts * 1.5; }
    if (this.sets.wormhole.visible) { this.wdisk.rotation.z = ts * .12; this.wdisk2.rotation.z = -ts * .2; this.einstein.material.color.copy(col('#fff2d8', 3 + 2 * beat)); this.worm.position.z = -WORM_Z; }
    if (this.sets.tunnel.visible) { const d = this.dist(t); this.tunnelTex.offset.set(ts * .05, -(d * .004) % 1); const dd = new THREE.Object3D(); for (let i = 0; i < 40; i++) { dd.position.set(0, 0, ((i * 40 + d) % 1600) - 1500); dd.rotation.set(0, 0, i * .3); dd.updateMatrix(); this.tRings.setMatrixAt(i, dd.matrix); } this.tRings.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 300; i++) { const z = ((hash(i, 91) * 1600 + d * (1 + hash(i, 92))) % 1600) - 1500, a = hash(i, 93) * 6.28 + z * .01 + ts, r = 15 * (1 - smooth(remap(-z, 0, 1500))) * (mode === 'meet' ? 1 - .6 * k : 1); dd.position.set(Math.cos(a) * r, Math.sin(a) * r, z); dd.scale.setScalar(1); dd.updateMatrix(); this.streams.setMatrixAt(i, dd.matrix); } this.streams.instanceMatrix.needsUpdate = true; }
    if (this.sets.trisun.visible) { this.suns[2].position.y = mode === 'light' ? lerp(-300, -60, smooth(k)) : -60; this.triPlanet.rotation.y = ts * .02; const flip = mode === 'flip' ? smooth(remap(ts, FLIP_T, FLIP_T + .8)) : warmth(ts); this.suns.forEach((s, i) => s.children[1].material.color.copy(new THREE.Color(['#fff2c8', '#ffb066', '#a9d8ff'][i]).multiplyScalar(3.5 + 3 * flip * (i === 1)))); }
    if (this.sets.night.visible) this.night.rotation.y = 1.2 + ts * .004;
    if (this.sets.earth.visible) { this.earth.rotation.y = 2.6 + ts * .002; const wl = this.windowLocal(); this.earth.updateMatrixWorld(); const wp = wl.clone().applyMatrix4(this.earth.matrixWorld); this.pin.position.copy(wp); this.pin.lookAt(this.earth.position); this.pin.rotateX(-Math.PI / 2); this.pin.visible = this.sets.pin.visible; this.pin.scale.setScalar(this.sets.pin.visible ? 1 + .15 * beat : 0); this.windowWorld = wp;
      if (this.sets.beam.visible) { const from = V(0, 0, 0), to = wp, len = from.distanceTo(to), v = smooth(remap(k, .05, .6)); this.beam.position.copy(from).lerp(to, v * .5); this.beam.scale.set(1 + 2 * beat, Math.max(.01, len * v), 1 + 2 * beat); this.beam.lookAt(to); this.beam.rotateX(Math.PI / 2); this.beamGlow.position.copy(from).lerp(to, v); this.beamLabel.position.copy(this.beamGlow.position).add(V(0, 8, 0)); } }
    if (this.sets.storm.visible) this.bolts.forEach((b, i) => { const on = (Math.floor(tl / (BEAT / 2)) + i * 3) % 7 === 0; b.material.opacity = on ? 1 : 0; });
    if (this.sets.probes.visible) this.probes.forEach((p, i) => { const u = clamp((tl - i * .35) / 3); p.position.set((i - 4) * 3, Math.sin(i) * 2, -u * 120); p.material.color.copy(col(PAL.dim, 3 * (1 - u))); });
    if (this.sets.binary.visible) { const a = ts * .4; this.bin[0].position.set(Math.cos(a) * 30, 0, -60 + Math.sin(a) * 18); this.bin[1].position.set(-Math.cos(a) * 44, 0, -60 - Math.sin(a) * 26); }
    if (this.sets.relay.visible) this.relay.rotation.z = ts * .25;
    if (this.sets.room.visible) { const kick = beat, d = new THREE.Object3D(); for (let i = 0; i < 160; i++) { const u = (hash(i, 111) + ts * .01 * (.5 + hash(i, 112))) % 1; d.position.set(lerp(-1.2, .9, hash(i, 113)) + .1 * Math.sin(ts * .3 + i), lerp(2.0, .6, u), lerp(-2.4, -.4, hash(i, 114))); d.updateMatrix(); this.dust.setMatrixAt(i, d.matrix); } this.dust.instanceMatrix.needsUpdate = true;
      const end = shot.id === 'endcard', ack = mode === 'ack'; this.roomGlow.material.color.copy(col(PAL.amberHot, .5 + .5 * kick));
      this.roomScreen.set(`${Math.floor(ts * 8)}|${ack}|${end}`, (g, W, H) => { g.fillStyle = '#0a0d12'; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(W / 2, H * .45, 10, W / 2, H * .45, W * .6); gr.addColorStop(0, 'rgba(255,140,60,.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        g.font = `600 30px ${MONO}`; g.fillStyle = '#7f97a8'; g.fillText('NETWORK ENGINEER · SAMUEL HEINRICH', 50, 70); g.font = `700 92px ${SANS}`; g.fillStyle = '#fff1dc'; g.fillText('09  LAST HOP', 50, 190);
        g.font = `32px ${MONO}`; g.fillStyle = PAL.amberHot; g.fillText(`${DEST.ip} · ${DEST.hops} hops · ttl ${DEST.ttl} · ${DEST.rtt} ms`, 50, 250); g.fillStyle = PAL.ok; g.fillText(ack ? 'ack 1 · window 65535' : 'REACHABLE · 0% packet loss', 50, 300);
        for (let i = 0; i < 48; i++) { const h = 20 + 140 * Math.abs(Math.sin(i * .7 + ts * 2.1)) * (.4 + .6 * Math.abs(Math.sin(i * .23 + ts * .5))) * (.6 + .6 * kick); g.fillStyle = i / 48 < ((ts - 228) / 67) ? '#ffb070' : '#3a4250'; g.fillRect(50 + i * 19, 520 - h, 12, h); }
        g.fillStyle = '#3a4250'; g.fillRect(50, 560, W - 100, 6); g.fillStyle = PAL.amberHot; g.fillRect(50, 560, (W - 100) * clamp((ts - 0) / 294.7), 6); }); }
    if (this.sets.city.visible) { this.winGlow.material.color.copy(col(PAL.amberHot, 2.5 + 2 * beat)); }
    if (this.sets.map.visible) { const n = mode === 'chorusA' ? Math.floor(k * 9) : mode === 'chorusE' || mode === 'topology' || mode === 'pullout' ? 9 : hopsAt(ts); this.nodes.forEach((o, i) => { o.s.material.color.copy(col(i === 8 ? PAL.amberHot : PAL.cyanHot, i < Math.max(1, n) ? 4 + 2 * beat : .6)); o.l.material.opacity = i < Math.max(1, n) ? 1 : .25; });
      const prog = mode === 'topology' ? smooth(k * 1.2) : mode === 'chorusA' ? k : 1; this.routeGeo.setDrawRange(0, Math.floor(this.routeGeo.index.count * prog / 6) * 6); this.routeLine.material.color.copy(col(shot.predict ? PAL.cyanHot : PAL.amberHot, 2.4 + beat)); }
  }
  // -------------------------------------------------------------- cameras (pure)
  camera(shot, tl) {
    const mode = modeOf(shot), m = M[mode] || {}, dur = shot.t[1] - shot.t[0], k = clamp(tl / dur), e = smooth(k), look = (p, tg, fov = 40, up) => ({ pos: p.isVector3 ? p : V(...p), target: tg.isVector3 ? tg : V(...tg), fov, up }), ts = shot.t[0] + tl;
    const shipAt = () => { if (m.ship === 'slingshot') { const a = lerp(-.4, Math.PI + .4, smooth(k)), R = 22; return V(Math.sin(a) * R, 0, -60 + Math.cos(a) * R); } if (mode === 'firewall') return V(0, 0, -lerp(0, 40, smooth(remap(k, .72, 1)))); return V(0, 0, 0); };
    switch (m.cam) {
      case 'void': return look([0, .6, lerp(30, 24, e)], [0, 0, -40], 30);
      case 'push': return look([lerp(10, 6, e), lerp(2.2, 1.6, e), lerp(16, 10, e)], [0, 0, -2], 36);
      case 'vista': return look([lerp(-9, -6, e), lerp(3, 2.2, e), lerp(9, 7, e)], [lerp(20, 60, e), 10, -300], 46);
      case 'through': return look([lerp(4, -3, e), 2.4, lerp(12, 9, e)], [0, 0, -30], 50);
      case 'pov': return look([0, .3, -2.9], [0, .25, -40], 70);
      case 'reveal': { const a = lerp(-1.2, .9, e); return look([Math.sin(a) * lerp(14, 9, e), lerp(5, 1.4, e), Math.cos(a) * lerp(14, 9, e)], [0, 0, 0], 40); }
      case 'hero': return look([lerp(6.5, 5.5, e), lerp(-1.1, -.9, e), lerp(-3, -6, e)], [0, .2, 1], 44);
      case 'chase': return look([lerp(2.5, 1.6, e), lerp(2.2, 1.6, e), lerp(11, 9, e)], [0, 0, -8], 54);
      case 'station': return look([lerp(-8, -12, e), lerp(3, 6, e), lerp(14, 22, e)], [0, 0, -14], 54);
      case 'flyby': return look([-6, 2.5, 8], [lerp(80, 120, e), -30, lerp(-400, -260, e)], 52);
      case 'gate': { const sp = shipAt(); return look([lerp(-9, -6, e), lerp(4, 2.5, e), sp.z + lerp(16, 11, e)], [0, 0, -30], 46); }
      case 'reveal2': return look([lerp(8, 4, e), lerp(-1, 2, e), lerp(7, 10, e)], [-60, -30, -420], lerp(38, 46, e));
      case 'long': return look([lerp(14, 18, e), 3, 18], [-50, -20, -300], 40);
      case 'ttl': return look([lerp(1.35, 1.05, e), .18, lerp(-.95, -.7, e)], [0, 0, -.57], 32);
      case 'slingshot': { const sp = shipAt(); return look(V(lerp(60, 50, e), lerp(26, 20, e), lerp(-10, -30, e)), sp.clone().lerp(V(0, 0, -60), .35), 46); }
      case 'map': return look([lerp(-200, 200, e), lerp(900, 800, e), lerp(900, 700, e)], [0, 0, 0], 48);
      case 'mapFull': return look([0, 1300, 900], [100, 0, 0], 50);
      case 'earthOrbit': return look([lerp(420, 340, e), lerp(60, 90, e), lerp(-60, -140, e)], [0, -300, -420], 46);
      case 'earthPin': return look([30, 40, lerp(-60, -100, e)], [0, -20, -420], 40);
      case 'wormFar': return mode === 'chorusC' ? look([lerp(-300, 300, e), 120, 1200], [0, 0, -WORM_Z], 48) : look([lerp(-26, -18, e), lerp(9, 6, e), lerp(30, 22, e) + wormShipZ(mode, k)], [0, 60, -WORM_Z], 62);
      case 'wormNear': { const z = wormShipZ(mode, k), back = lerp(34, 60, k); return look([lerp(-8, -3, e), lerp(7, 4, e), z + back], [0, lerp(40, 0, e), -WORM_Z], lerp(60, 70, e)); }
      case 'tunnel': return look([0, lerp(2, 0, e), 9], [0, 0, -60], 70);
      case 'tunnelChase': return look([lerp(2, -2, e), 1.6, 8], [0, 0, -40], 66);
      case 'trisun': return look([0, 10, 30], [100, 0, -1000], 50);
      case 'window': return look([lerp(10, 4, e), lerp(40, 35, e), lerp(-40, -80, e)], [2, 34, -89], 40);
      case 'storm': return look([lerp(-6, 6, e), 2, 12], [0, 0, -200], 54);
      case 'probes': return look([3, 2, 10], [0, 0, -60], 44);
      case 'death': return look([lerp(40, 30, e), 18, 40], [0, 0, -60], 46);
      case 'exit': return look([lerp(3, -4, e), lerp(1.5, 3, e), lerp(9, 14, e)], [100, 0, -1000], 56);
      case 'sunrise3': return look([-5, 2, 10], [400, -60, -1300], 46);
      case 'curve': { const a = lerp(-.5, .6, e); return look([Math.sin(a) * 16, 4, Math.cos(a) * 16], [80, -20, -600], 52); }
      case 'flip': return look([lerp(5, 3, e), 1.6, lerp(9, 7, e)], [0, 0, -40], 56);
      case 'cityOrbit': return look([0, lerp(20, 0, e), lerp(60, 20, e)], [0, -120, -140], 50);
      case 'side': return look([lerp(9, 8, e), .8, lerp(-2, 2, e)], [0, 0, 0], 40);
      case 'engine': return look([lerp(2.6, 2.1, e), .9, lerp(7.6, 6.9, e)], [0, 0, 3.8], 36);
      case 'nacelle': return look([lerp(3.8, 3.3, e), .9, lerp(-2.6, -2.0, e)], [1.45, .05, .5], 36);
      case 'rings': return look([lerp(-4, 4, e), lerp(2.5, 1, e), 9], [0, 0, -40], 58);
      case 'limb': return look([lerp(-6, 6, e), 3, 10], [0, -40, -200], 54);
      case 'clouds': return look([lerp(10, 6, e), 3.5, 9], [0, -10, -60], 50);
      case 'dawn': return look([lerp(-4, -8, e), 2, 12], [-200, -40, -600], 46);
      case 'montage': { const i = Math.min(7, Math.floor(k * 8)), kk = k * 8 - i; const views = [[[3, 2, 10], [0, 0, -30]], [[-8, 3, 14], [0, 0, -30]], [[6, 2, 10], [-60, -30, -420]], [[30, 15, 0], [0, 0, -60]], [[-5, 2, 12], [0, 0, -900]], [[0, 6, 22], [100, 0, -1000]], [[-6, 2, 12], [120, -60, -420]], [[20, 20, 40], [0, -300, -420]]][i]; return look(V(...views[0]).add(V(0, 0, -3 * kk)), views[1], 56); }
      case 'arrive': return look([lerp(6, 3, e), lerp(2, 4, e), lerp(12, 20, e)], [0, -150, -420], lerp(56, 46, e));
      case 'relay': return look([lerp(-12, -18, e), lerp(5, 8, e), lerp(10, -10, e)], [0, 0, -40], 50);
      case 'beam': return look([lerp(30, 60, e), lerp(30, 40, e), lerp(40, 20, e)], [0, -110, -300], 46);
      case 'descent': { // from orbit down to the dawn city and to the one window
        if (k < .45) { const u = smooth(k / .45); return look([lerp(0, 0, u), lerp(60, -20, u), lerp(80, -200, u)], [0, -300, -420], lerp(50, 60, u)); }
        const u = smooth((k - .45) / .55); return look([lerp(60, 6, u), lerp(220, 35, u), lerp(260, -82, u)], [2, 34, -89], lerp(55, 30, u)); }
      case 'pullout': { if (k < .35) { const u = smooth(k / .35); return look([lerp(4, 160, u), lerp(35, 520, u), lerp(-80, 420, u)], [2, 34, -89], lerp(30, 60, u)); }
        if (k < .65) { const u = smooth((k - .35) / .3); return look([lerp(20, 120, u), lerp(-20, 260, u), lerp(-120, 600, u)], [0, -300, -420], lerp(55, 45, u)); } const u = smooth((k - .65) / .35); return look([lerp(200, 0, u), lerp(800, 1600, u), lerp(900, 1100, u)], [0, 0, 0], 55); }
      case 'topology': return look([lerp(-400, 300, e), lerp(1300, 1100, e), lerp(1000, 800, e)], [80, 0, 0], 50);
      case 'descend': { if (k < .4) { const u = smooth(k / .4); return look([lerp(0, 100, u), lerp(1600, 500, u), lerp(1100, 300, u)], [lerp(0, 300, u), 0, lerp(0, -100, u)], 55); }
        if (k < .7) { const u = smooth((k - .4) / .3); return look([lerp(120, 10, u), lerp(260, -20, u), lerp(600, -140, u)], [0, -300, -420], lerp(45, 58, u)); } const u = smooth((k - .7) / .3); return look([lerp(160, 6, u), lerp(520, 35, u), lerp(420, -82, u)], [2, 34, -89], lerp(60, 30, u)); }
      case 'room': return shot.id === 'endcard' ? look([lerp(1.3, 1.25, e), 1.3, lerp(-.35, -.45, e)], [-.1, 1.05, -1.9], 46) : look([lerp(2.3, 1.2, e), lerp(1.55, 1.25, e), lerp(1.2, -.55, e)], [lerp(-.3, .02, e), lerp(1.25, .92, e), -1.75], lerp(54, 40, e));
      case 'roomAck': return look([lerp(.3, .22, e), lerp(1.0, .98, e), lerp(-1.05, -1.15, e)], [.05, .9, -1.68], 34);
      default: return look([3, 2, 10], [0, 0, -20], 50);
    }
  }
}

export const cosmosPov = (shot) => !!(M[modeOf(shot)] || {}).pov;
export const ROOM_ONLY = [];
