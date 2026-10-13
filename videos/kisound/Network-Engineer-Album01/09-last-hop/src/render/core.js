// Shared core: math, deterministic noise, camera paths, materials helpers, HDR post pipeline.
import * as THREE from 'three';

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const remap = (t, a, b) => clamp((t - a) / (b - a));
export const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smoother = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const easeInCubic = (x) => clamp(x) ** 3;
export const easeOutCubic = (x) => 1 - (1 - clamp(x)) ** 3;
export const easeInOutCubic = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
export const easeInOutSine = (x) => -(Math.cos(Math.PI * clamp(x)) - 1) / 2;
export const win = (t, a, b, fi = 0.2, fo = 0.2) => smooth(remap(t, a, a + fi)) * (1 - smooth(remap(t, b - fo, b)));
export const hash = (i, j = 0) => { const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); };
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const lin1 = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const hexLin = (h) => { const n = parseInt(h.slice(1), 16); return [lin1(((n >> 16) & 255) / 255), lin1(((n >> 8) & 255) / 255), lin1((n & 255) / 255)]; };

// ------------------------------------------------------------------ keyed camera path (Hermite through keys)
// keys: [{ t, p:[x,y,z], g:[x,y,z], fov?, k? }]  (t in local seconds of the shot)
export function keyedCamera(keys) {
  const n = keys.length;
  const tang = (field) => keys.map((k, i) => {
    if (i === 0 || i === n - 1) return [0, 0, 0];
    const dt = keys[i + 1].t - keys[i - 1].t;
    return [0, 1, 2].map((q) => ((keys[i + 1][field][q] - keys[i - 1][field][q]) / dt) * (k.k ?? 1));
  });
  const tp = tang('p'), tg = tang('g');
  const evalF = (t, field, tan) => {
    if (t <= keys[0].t) return keys[0][field].slice();
    if (t >= keys[n - 1].t) return keys[n - 1][field].slice();
    let i = 0; while (keys[i + 1].t < t) i++;
    const k0 = keys[i], k1 = keys[i + 1], h = k1.t - k0.t, s = (t - k0.t) / h, s2 = s * s, s3 = s2 * s;
    const a = 2 * s3 - 3 * s2 + 1, b = s3 - 2 * s2 + s, c = -2 * s3 + 3 * s2, d = s3 - s2;
    return [0, 1, 2].map((q) => a * k0[field][q] + b * h * tan[i][q] + c * k1[field][q] + d * h * tan[i + 1][q]);
  };
  const fovAt = (t) => {
    if (t <= keys[0].t) return keys[0].fov ?? 40;
    for (let i = 0; i < n - 1; i++) if (t <= keys[i + 1].t) return lerp(keys[i].fov ?? 40, keys[i + 1].fov ?? 40, smooth((t - keys[i].t) / (keys[i + 1].t - keys[i].t)));
    return keys[n - 1].fov ?? 40;
  };
  return (t) => ({ pos: V(...evalF(t, 'p', tp)), target: V(...evalF(t, 'g', tg)), up: V(0, 1, 0), fov: fovAt(t) });
}

// ------------------------------------------------------------------ spline flight: position by eased arc length, look ahead, banking
export function splineFlight(points, { closed = false, tension = 0.5 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : V(...p))), closed, 'centripetal', tension);
  curve.arcLengthDivisions = 2000;
  const L = curve.getLength();
  return {
    curve, L,
    at: (u) => curve.getPointAt(clamp(u)),
    tangent: (u) => curve.getTangentAt(clamp(u)),
    // camera at arc-length fraction u, looking `ahead` metres further along; bank from curvature
    frame(u, ahead, lift = V(0, 0, 0), bankK = 0) {
      const p = curve.getPointAt(clamp(u));
      const ua = clamp(u + ahead / L);
      const g = curve.getPointAt(ua);
      if (ua >= 1 && u < 1) g.add(curve.getTangentAt(1).multiplyScalar(ahead * (1 - (1 - u) * L / ahead)));
      const t0 = curve.getTangentAt(clamp(u)), t1 = curve.getTangentAt(clamp(u + (ahead * 0.6) / L));
      const turn = t0.clone().cross(t1).y; // yaw rate → bank
      const up = V(0, 1, 0).applyAxisAngle(t0, clamp(-turn * bankK, -0.6, 0.6));
      return { pos: p.add(lift), target: g.add(lift), up };
    },
  };
}

// ------------------------------------------------------------------ materials
export function stdMat(color, rough = 0.5, metal = 0, extra = {}) { return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra }); }
export function physMat(color, rough = 0.4, metal = 0, extra = {}) { return new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: metal, ...extra }); }
export function glowMat(color, intensity = 1, extra = {}) {
  const m = new THREE.MeshBasicMaterial({ color, ...extra });
  m.color.multiplyScalar(intensity);
  return m;
}
// additive soft sprite texture (radial)
let _glowTex = null;
export function glowTexture() {
  if (_glowTex) return _glowTex;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  _glowTex = new THREE.CanvasTexture(c); _glowTex.colorSpace = THREE.NoColorSpace;
  return _glowTex;
}
export function glowSprite(color, size, intensity = 1) {
  const m = new THREE.SpriteMaterial({ map: glowTexture(), color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  m.color.multiplyScalar(intensity);
  const s = new THREE.Sprite(m); s.scale.setScalar(size);
  return s;
}

// ------------------------------------------------------------------ instanced glowing points (additive billboards, per-instance colour & size)
export class GlowPoints {
  constructor(max, { sizeAttenuation = true } = {}) {
    this.max = max;
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    this.P = new Float32Array(max * 4); this.C = new Float32Array(max * 4); this.D = new Float32Array(max * 3);
    g.setAttribute('iP', new THREE.InstancedBufferAttribute(this.P, 4).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('iC', new THREE.InstancedBufferAttribute(this.C, 4).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('iD', new THREE.InstancedBufferAttribute(this.D, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending,
      vertexShader: `attribute vec4 iP; attribute vec4 iC; attribute vec3 iD; varying vec2 vL; varying float vHalf; varying float vR; varying vec4 vC; varying float vNear;
        void main(){
          // iP.xyz = centre, iP.w = radius (world); iD = streak vector → capsule from p to p+iD (view-space)
          vec4 a = modelViewMatrix * vec4(iP.xyz, 1.0);
          vec4 b = modelViewMatrix * vec4(iP.xyz + iD, 1.0);
          vec2 dir = b.xy - a.xy; float len = length(dir);
          vec2 ax = len > 1e-6 ? dir / len : vec2(1.0, 0.0); vec2 ay = vec2(-ax.y, ax.x);
          float half_ = len * 0.5;
          vec2 lc = vec2(position.x * (half_ + iP.w * 2.2), position.y * iP.w * 2.2); // quad covers the full gaussian falloff
          vec4 mv = vec4(mix(a.xyz, b.xyz, 0.5), 1.0);
          mv.xy += ax * lc.x + ay * lc.y;
          vL = lc; vHalf = half_; vR = iP.w; vC = iC;
          // near fade: a glow whose billboard would reach the camera plane is faded out (avoids screen-filling blobs)
          float ext = iP.w * 2.2; float dz = -min(a.z, b.z);
          vNear = smoothstep(ext * 0.6, ext * 1.6, dz);
          gl_Position = projectionMatrix * mv;
          if (vNear <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
        }`,
      fragmentShader: `varying vec2 vL; varying float vHalf; varying float vR; varying vec4 vC; varying float vNear;
        void main(){
          float dx = max(abs(vL.x) - vHalf, 0.0);
          float r = length(vec2(dx, vL.y)) / vR;
          float a = exp(-r * r * 3.2) + 0.6 * exp(-r * r * 22.0);
          a *= vNear * vC.a * (vHalf > 0.0 ? mix(1.0, 0.35 + 0.65 * (0.5 + 0.5 * vL.x / max(vHalf, 1e-6)), 0.8) : 1.0);
          if (a < 0.003) discard; gl_FragColor = vec4(vC.rgb * a, 1.0); }`,
    });
    this.mesh = new THREE.Mesh(g, this.mat); this.mesh.frustumCulled = false; this.mesh.renderOrder = 20;
    this.n = 0;
  }
  begin() { this.n = 0; }
  add(p, r, col, a = 1, streak = null) {
    if (this.n >= this.max || a <= 0.002) return;
    const i = this.n++;
    this.P[i * 4] = p.x; this.P[i * 4 + 1] = p.y; this.P[i * 4 + 2] = p.z; this.P[i * 4 + 3] = r;
    this.C[i * 4] = col[0]; this.C[i * 4 + 1] = col[1]; this.C[i * 4 + 2] = col[2]; this.C[i * 4 + 3] = a;
    this.D[i * 3] = streak ? streak.x : 0; this.D[i * 3 + 1] = streak ? streak.y : 0; this.D[i * 3 + 2] = streak ? streak.z : 0;
  }
  end() {
    this.geo.instanceCount = this.n;
    for (const k of ['iP', 'iC', 'iD']) { const at = this.geo.getAttribute(k); at.needsUpdate = true; at.clearUpdateRanges(); at.addUpdateRange(0, this.n * at.itemSize); }
  }
}

// ------------------------------------------------------------------ HDR post: scene → bloom → (flash, speed CA) → ACES → grain; accumulation for motion blur
export function makePost(renderer, W, H) {
  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const acc = new THREE.WebGLRenderTarget(W, H, { type: THREE.FloatType, depthBuffer: false });
  const mips = [];
  let w = W >> 1, h = H >> 1;
  for (let i = 0; i < 6; i++) { mips.push(new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), { type: THREE.HalfFloatType, depthBuffer: false })); w >>= 1; h >>= 1; }
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  const fs = new THREE.Scene(); fs.add(quad);
  const vs = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const down = new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uThr: { value: -1 } }, vertexShader: vs, depthTest: false, depthWrite: false,
    fragmentShader: `uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThr; varying vec2 vUv;
      vec3 s(vec2 o){ return texture2D(tSrc, vUv + o*uTexel).rgb; }
      void main(){
        vec3 a=s(vec2(-2,-2)),b=s(vec2(0,-2)),c=s(vec2(2,-2)),d=s(vec2(-1,-1)),e=s(vec2(1,-1)),f=s(vec2(-2,0)),g=s(vec2(0,0)),
             h=s(vec2(2,0)),i=s(vec2(-1,1)),j=s(vec2(1,1)),k=s(vec2(-2,2)),l=s(vec2(0,2)),m=s(vec2(2,2));
        vec3 col = (d+e+i+j)*0.125 + (a+b+f+g)*0.03125 + (b+c+g+h)*0.03125 + (f+g+k+l)*0.03125 + (g+h+l+m)*0.03125;
        if (uThr >= 0.0) { float br = max(col.r, max(col.g, col.b)); col *= max(br - uThr, 0.0) / max(br, 1e-4); }
        gl_FragColor = vec4(min(col, vec3(50.0)), 1.0);
      }`,
  });
  const up = new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() } }, vertexShader: vs, depthTest: false, depthWrite: false, transparent: true,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    fragmentShader: `uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv;
      vec3 s(vec2 o){ return texture2D(tSrc, vUv + o*uTexel).rgb; }
      void main(){ vec3 c = s(vec2(0))*4.0 + (s(vec2(-1,0))+s(vec2(1,0))+s(vec2(0,-1))+s(vec2(0,1)))*2.0 + s(vec2(-1,-1))+s(vec2(1,-1))+s(vec2(-1,1))+s(vec2(1,1)); gl_FragColor = vec4(c/16.0, 1.0); }`,
  });
  const comp = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: rt.texture }, tBloom: { value: mips[0].texture }, uBloom: { value: 0.06 }, uExpo: { value: 1 }, uWeight: { value: 1 },
      uFrame: { value: 0 }, uAspect: { value: W / H }, uGrain: { value: 0.016 }, uFlash: { value: 0 }, uFlashCol: { value: new THREE.Vector3(0.6, 0.9, 1) },
      uCA: { value: 0 }, uVig: { value: 0.3 }, uSat: { value: 1 }, uGlitch: { value: 0 },
    },
    vertexShader: vs, depthTest: false, depthWrite: false, transparent: true, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    fragmentShader: `uniform sampler2D tScene, tBloom; uniform float uBloom, uExpo, uWeight, uFrame, uAspect, uGrain, uFlash, uCA, uVig, uSat, uGlitch; uniform vec3 uFlashCol; varying vec2 vUv;
      vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
      vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
      float h12(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uFrame * 0.618) * 43758.5453); }
      float hb(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      void main(){
        vec2 uv = vUv;
        // digital glitch: horizontal block displacement, pattern changes every 3 frames (deterministic)
        if (uGlitch > 0.0) {
          float fr = floor(uFrame / 3.0), row = floor(uv.y * 28.0);
          float r = hb(vec2(row, fr));
          if (r < uGlitch * 0.4) uv.x += (hb(vec2(row + 17.0, fr)) - 0.5) * 0.09 * uGlitch;
        }
        vec2 c = (uv - 0.5);
        // radial chromatic aberration grows with speed (and glitch)
        vec2 o = c * uCA * 0.012 + vec2(uGlitch * 0.006, 0.0);
        vec3 hdr = vec3(texture2D(tScene, uv + o).r, texture2D(tScene, uv).g, texture2D(tScene, uv - o).b);
        hdr += texture2D(tBloom, uv).rgb * uBloom;
        float r = length(c * vec2(uAspect, 1.0));
        hdr *= 1.0 - uVig * smoothstep(0.35, 1.05, r);
        hdr += uFlashCol * uFlash * (1.0 + 2.0 * exp(-r * r * 6.0));
        vec3 tm = aces(hdr * uExpo);
        tm = mix(vec3(dot(tm, vec3(0.2126, 0.7152, 0.0722))), tm, uSat);
        vec3 col = toSRGB(tm);
        col += (h12(gl_FragCoord.xy) - 0.5) * uGrain;
        gl_FragColor = vec4(clamp(col, 0.0, 1.0) * uWeight, 1.0);
      }`,
  });
  const copy = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: acc.texture } }, vertexShader: vs, depthTest: false, depthWrite: false,
    fragmentShader: 'uniform sampler2D tSrc; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(tSrc, vUv).rgb, 1.0); }' });

  return {
    comp,
    render(scene, camera, i, n, params) {
      renderer.setRenderTarget(rt); renderer.setClearColor(params.clear ?? 0x000000, 1); renderer.clear();
      renderer.render(scene, camera);
      let src = rt;
      mips.forEach((m, k) => {
        quad.material = down; down.uniforms.tSrc.value = src.texture; down.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
        down.uniforms.uThr.value = k === 0 ? params.bloomThr ?? 1.0 : -1;
        renderer.setRenderTarget(m); renderer.render(fs, cam); src = m;
      });
      for (let k = mips.length - 1; k > 0; k--) {
        quad.material = up; up.uniforms.tSrc.value = mips[k].texture; up.uniforms.uTexel.value.set(1 / mips[k].width, 1 / mips[k].height);
        renderer.setRenderTarget(mips[k - 1]); renderer.render(fs, cam);
      }
      const C = comp.uniforms;
      C.uBloom.value = params.bloom ?? 0.06; C.uExpo.value = params.exposure ?? 1; C.uFrame.value = params.frame ?? 0;
      C.uFlash.value = params.flash ?? 0; C.uCA.value = params.ca ?? 0; C.uVig.value = params.vignette ?? 0.3;
      C.uSat.value = params.sat ?? 1; C.uGlitch.value = params.glitch ?? 0;
      if (params.flashCol) C.uFlashCol.value.set(...params.flashCol);
      quad.material = comp;
      if (n === 1) {
        C.uWeight.value = 1; comp.blending = THREE.NoBlending; comp.needsUpdate = true;
        renderer.setRenderTarget(null); renderer.render(fs, cam);
        comp.blending = THREE.CustomBlending; comp.needsUpdate = true;
        return;
      }
      renderer.setRenderTarget(acc);
      if (i === 0) { renderer.setClearColor(0, 0); renderer.clear(); }
      C.uWeight.value = 1 / n; renderer.render(fs, cam);
      if (i === n - 1) { quad.material = copy; renderer.setRenderTarget(null); renderer.render(fs, cam); }
    },
  };
}
