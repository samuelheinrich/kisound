// Shared scene building blocks for all zones: colours, text in 3D, glow lines, device silhouettes, smooth noise.
import * as THREE from 'three';
import { PAL, GROUPS } from './config.js';
import { glowTexture, clamp, hash } from './core.js';

export const MONO = '"JetBrains Mono", Menlo, monospace', SANS = '"Space Grotesk", system-ui, sans-serif';

// HDR colour: palette key or hex, multiplied (values > 1 bloom)
export const hdr = (c, k = 1) => new THREE.Color(PAL[c] || c).multiplyScalar(k);
export const groupColor = (sgt) => PAL[(GROUPS.find((g) => g.sgt === sgt) || GROUPS[0]).key];

// smooth deterministic 1D noise in [-1, 1] (sum of sines with hashed phases) – camera shake without jitter
export function noise1(t, seed = 0) {
  let v = 0;
  for (let i = 0; i < 3; i++) v += Math.sin(t * (1.7 + i * 2.3 + hash(seed, i) * 0.9) + hash(seed, i + 9) * 6.283) / (i + 1);
  return v / 1.83;
}

// ------------------------------------------------------------------ canvas textures + text planes
const texCache = new Map();
export function canvasTexture(key, w, h, draw) {
  if (key && texCache.has(key)) return texCache.get(key);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (key) texCache.set(key, t);
  return t;
}
// white text on transparent, tinted by the material colour. Returns texture + aspect.
export function textTexture(text, { font = `600 96px ${SANS}`, pad = 16, spacing = 0 } = {}) {
  const key = `txt|${font}|${spacing}|${text}`;
  if (texCache.has(key)) return texCache.get(key);
  const m = document.createElement('canvas').getContext('2d'); m.font = font; m.letterSpacing = `${spacing}px`;
  const px = parseInt(font.match(/(\d+)px/)[1], 10);
  const w = Math.ceil(m.measureText(text).width + pad * 2), h = Math.ceil(px * 1.35 + pad * 2);
  const tex = canvasTexture(null, w, h, (g) => {
    g.font = font; g.letterSpacing = `${spacing}px`; g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(text, pad, h / 2 + px * 0.04);
  });
  const out = { tex, aspect: w / h };
  texCache.set(key, out);
  return out;
}
// a text plane of world height `h` (the glyph box), additive + HDR tint by default
export function textPlane(text, { h = 1, color = PAL.text, k = 1.5, font, spacing = 0, additive = true, align = 'center' } = {}) {
  const { tex, aspect } = textTexture(text, { font, spacing });
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: hdr(color, k), side: THREE.DoubleSide, fog: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false });
  const geo = new THREE.PlaneGeometry(h * aspect, h);
  if (align === 'left') geo.translate((h * aspect) / 2, 0, 0);
  if (align === 'right') geo.translate(-(h * aspect) / 2, 0, 0);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.width = h * aspect;
  return mesh;
}
// swap the text of an existing text plane (keeps height and alignment)
export function setText(mesh, text, { font, spacing = 0, align = 'center' } = {}) {
  if (mesh.userData.text === text) return;
  mesh.userData.text = text;
  const { tex, aspect } = textTexture(text, { font, spacing });
  const h = mesh.geometry.parameters.height;
  mesh.material.map = tex; mesh.material.needsUpdate = true;
  mesh.geometry.dispose(); mesh.geometry = new THREE.PlaneGeometry(h * aspect, h);
  if (align === 'left') mesh.geometry.translate((h * aspect) / 2, 0, 0);
}

// ------------------------------------------------------------------ glow helpers
export function glowSprite(color, size, k = 1) {
  const m = new THREE.SpriteMaterial({ map: glowTexture(), color: hdr(color, k), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
  const s = new THREE.Sprite(m); s.scale.setScalar(size); return s;
}
// emissive line (thin tube) along points; material colour set per frame for pulses
export function glowTube(points, radius, color, k = 2, segs = 64) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))), false, 'catmullrom', 0.1);
  const m = new THREE.MeshBasicMaterial({ color: hdr(color, k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, radius, 6, false), m);
  mesh.userData.curve = curve;
  return mesh;
}
// animated additive ring (torus) used for scans, stamps, portals
export function glowRing(R, r, color, k = 3, seg = 128) {
  return new THREE.Mesh(new THREE.TorusGeometry(R, r, 8, seg), new THREE.MeshBasicMaterial({ color: hdr(color, k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
}
export function edgeBox(w, h, d, color, k = 2) {
  const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: hdr(color, k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
}

// ------------------------------------------------------------------ device silhouettes (dark glass bodies with light edges)
const bodyMat = () => new THREE.MeshStandardMaterial({ color: 0x0b1118, roughness: 0.35, metalness: 0.6 });
// a dark body with glowing edges as one sub-group (position/rotate the returned group)
function part(parent, geo, color, k = 2) {
  const p = new THREE.Group();
  p.add(new THREE.Mesh(geo, bodyMat()));
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), new THREE.LineBasicMaterial({ color: hdr(color, k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  p.add(e); parent.add(p);
  (parent.userData.edges = parent.userData.edges || []).push(e);
  return p;
}
const screenMat = (color, k) => new THREE.MeshBasicMaterial({ color: hdr(color, k), side: THREE.DoubleSide });
// kind: laptop | phone | printer | server – all ~1 unit tall, standing on y = 0
export function device(kind, color) {
  const g = new THREE.Group(); g.userData.edges = [];
  if (kind === 'laptop') {
    part(g, new THREE.BoxGeometry(1.4, 0.06, 0.95), color).position.y = 0.03;
    const lid = new THREE.Group(); lid.position.set(0, 0.06, -0.47); lid.rotation.x = -0.28; g.add(lid);
    const l = new THREE.Group(); lid.add(l); l.userData.edges = g.userData.edges;
    part(l, new THREE.BoxGeometry(1.4, 0.9, 0.04), color).position.y = 0.45;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.78), screenMat(color, 0.5)); scr.position.set(0, 0.45, 0.025); lid.add(scr);
    g.userData.screen = scr;
  } else if (kind === 'phone') {
    part(g, new THREE.BoxGeometry(0.5, 1.0, 0.07), color).position.y = 0.55;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.88), screenMat(color, 0.5)); scr.position.set(0, 0.55, 0.04); g.add(scr);
    g.rotation.x = -0.12; g.userData.screen = scr;
  } else if (kind === 'printer') {
    part(g, new THREE.BoxGeometry(1.2, 0.55, 0.9), color).position.y = 0.275;
    const tray = part(g, new THREE.BoxGeometry(0.9, 0.04, 0.45), color); tray.position.set(0, 0.62, 0.1); tray.rotation.x = -0.35;
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.35), screenMat(color, 0.6)); paper.position.set(0, 0.72, 0.05); paper.rotation.x = -1.2; g.add(paper);
    g.userData.screen = paper;
  } else {
    for (let i = 0; i < 4; i++) part(g, new THREE.BoxGeometry(1.1, 0.22, 0.9), color).position.y = 0.13 + i * 0.25;
    const leds = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.95), screenMat(color, 3)); leds.position.set(0.45, 0.5, 0.46); g.add(leds);
    g.userData.screen = leds;
  }
  return g;
}
export function setDeviceGlow(dev, color, k) {
  for (const e of dev.userData.edges) e.material.color.copy(hdr(color, k));
  if (dev.userData.screen) dev.userData.screen.material.color.copy(hdr(color, k * 0.3));
}

// ------------------------------------------------------------------ environment for metallic surfaces
let _env = null;
export async function makeEnv(renderer) {
  if (_env) return _env;
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const pm = new THREE.PMREMGenerator(renderer);
  _env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  return _env;
}
export const ease = { out: (x) => 1 - (1 - clamp(x)) ** 3, in: (x) => clamp(x) ** 3, inOut: (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; }, back: (x) => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; } };

// ------------------------------------------------------------------ infinite-looking floor grid (additive lines, distance fade)
export function floorGrid({ size = 600, cell = 1, major = 8, color = PAL.grid, accent = PAL.employee, fade = 0.03 } = {}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uCol: { value: hdr(color, 1) }, uAcc: { value: hdr(accent, 1) }, uScroll: { value: new THREE.Vector2() }, uPulse: { value: 0 }, uGain: { value: 1 }, uFade: { value: fade }, uCell: { value: cell }, uMajor: { value: major }, uRing: { value: 0 }, uRingCol: { value: hdr(accent, 1) } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform vec3 uCol, uAcc, uRingCol; uniform vec2 uScroll; uniform float uPulse, uGain, uFade, uCell, uMajor, uRing; varying vec3 vW;
      float line(float x, float w){ float d = abs(fract(x - 0.5) - 0.5) / fwidth(x); return 1.0 - clamp(d - w, 0.0, 1.0); }
      void main(){
        vec2 p = (vW.xz + uScroll) / uCell;
        float minor = max(line(p.x, 0.15), line(p.y, 0.15));
        float major = max(line(p.x / uMajor, 0.5), line(p.y / uMajor, 0.5));
        float dist = length(vW.xz);
        float fade = exp(-dist * uFade);
        vec3 c = uCol * (0.4 * minor + 1.1 * major) + uAcc * major * uPulse * 2.0;
        // expanding ring (shockwave on the floor)
        c += uRingCol * exp(-pow((dist - uRing) * 0.8, 2.0)) * step(0.01, uRing) * 1.5;
        gl_FragColor = vec4(c * fade * uGain, 1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat); m.rotation.x = -Math.PI / 2;
  return m;
}
