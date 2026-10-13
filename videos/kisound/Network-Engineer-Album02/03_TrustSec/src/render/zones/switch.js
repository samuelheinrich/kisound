// Access switch in a dark rack (units: cm). A 48-port 1U switch without vendor branding, patch panel above,
// a second switch below, patch cables, per-port LEDs. Modes:
//   intro    camera glides along the port row in the dark, one LED waits (port 7)
//   connect  the client's cable clicks into port 7 on the beat, link LED jumps on, an EAPOL pulse leaves the port
//   outside  "Stay outside": port 19 turns red, the unknown endpoint hangs in front of it, camera pulls away
//   outro    finale bar: every port green, activity on the beat, fast sweep
import * as THREE from 'three';
import { PAL, BEAT } from '../config.js';
import { V, clamp, lerp, smooth, hash, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';
import { canvasTexture, glowSprite, ease, MONO } from '../world.js';

const W = 44, H = 4.4, D = 30; // chassis
const PORT_W = 1.3, PORT_H = 1.05, PITCH_X = 1.5, ROW_Y = [0.72, -0.62];
const HERO = 7, INTRUDER = 19;
// port n (1..48): odd top row, even bottom row; groups of 12 with a gap
function portPos(n) {
  const col = Math.floor((n - 1) / 2), grp = Math.floor(col / 6);
  return V(-W / 2 + 3.2 + col * PITCH_X + grp * 1.1, ROW_Y[(n - 1) % 2], H / 2 + 0.01);
}

function frontTexture() {
  return canvasTexture('switchFront', 4400, 440, (g, w, h) => {
    const s = w / W; // px per cm
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a3038'); gr.addColorStop(0.5, '#1b2027'); gr.addColorStop(1, '#14181d');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // brushed metal
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(255,255,255,${0.012 + (i % 7) * 0.003})`; g.fillRect(0, (i * 37) % h, w, 1); }
    // ports
    for (let n = 1; n <= 48; n++) {
      const p = portPos(n), cx = (p.x + W / 2) * s, cy = (H / 2 - p.y) * s;
      const pw = PORT_W * s, ph = PORT_H * s;
      g.fillStyle = '#07090b'; g.fillRect(cx - pw / 2, cy - ph / 2, pw, ph);
      g.fillStyle = '#0d1115'; g.fillRect(cx - pw / 2 + 6, cy - ph / 2 + 6, pw - 12, ph * 0.35);
      g.fillStyle = '#b08d3c'; for (let k = 0; k < 8; k++) g.fillRect(cx - pw * 0.34 + k * pw * 0.095, cy - ph * 0.4, pw * 0.04, ph * 0.18);
      g.fillStyle = '#05070a'; g.fillRect(cx - pw * 0.18, cy + ph * 0.28, pw * 0.36, ph * 0.22); // latch notch
      g.fillStyle = '#7d93a4'; g.font = `500 ${Math.round(0.3 * s)}px ${MONO}`; g.textAlign = 'center';
      g.fillText(String(n), cx + 0.25 * s, n % 2 ? cy - ph / 2 - 0.12 * s : cy + ph / 2 + 0.4 * s);
    }
    // SFP uplinks + console at the right
    for (let k = 0; k < 4; k++) { const x = (W / 2 + 13.4 + k * 1.9) * s, y = h / 2 - 0.45 * s; g.fillStyle = '#0a0c0f'; g.fillRect(x, y, 1.4 * s, 0.9 * s); g.strokeStyle = '#5f6d78'; g.lineWidth = 3; g.strokeRect(x, y, 1.4 * s, 0.9 * s); }
    g.fillStyle = '#8aa2b4'; g.font = `500 ${Math.round(0.36 * s)}px ${MONO}`; g.textAlign = 'left';
    g.fillText('UPLINK 1–4', (W / 2 + 13.4) * s, h / 2 + 1.1 * s); g.fillText('CONSOLE', (W / 2 + 21.2) * s, h / 2 + 1.1 * s);
    g.fillStyle = '#0a0c0f'; g.fillRect((W / 2 + 21.2) * s, h / 2 - 0.45 * s, 1.2 * s, 0.9 * s);
    // screws
    for (const x of [0.8, W - 0.8]) { g.fillStyle = '#3c444c'; g.beginPath(); g.arc(x * s, h / 2, 0.35 * s, 0, 7); g.fill(); }
  });
}

export class SwitchZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    const sc = this.scene = new THREE.Scene();
    sc.environment = ctx.env; sc.environmentIntensity = 0.35;
    sc.fog = new THREE.FogExp2(0x03060a, 0.012);
    this.clear = 0x010204; this.near = 0.1; this.far = 500; this.speedRef = 30; this.bloom = 0.1;
    sc.add(new THREE.HemisphereLight(0x3a5a78, 0x05070a, 0.25));
    this.key = new THREE.DirectionalLight(0xbfe4ff, 1.1); this.key.position.set(-40, 60, 50); sc.add(this.key);
    this.portLight = new THREE.PointLight(new THREE.Color(PAL.employee), 0, 30, 2); sc.add(this.portLight);
    // chassis stack: patch panel (above), access switch (hero), second switch (below)
    const metal = new THREE.MeshStandardMaterial({ color: 0x1a1f25, roughness: 0.38, metalness: 0.85 });
    const front = new THREE.MeshStandardMaterial({ map: frontTexture(), roughness: 0.45, metalness: 0.7 });
    const mk = (y, dim) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), metal); body.position.z = -D / 2; g.add(body);
      const f = new THREE.Mesh(new THREE.PlaneGeometry(W, H), dim ? front.clone() : front); f.position.z = 0.005; g.add(f);
      if (dim) f.material.color.setScalar(0.45);
      g.position.y = y; sc.add(g); return g;
    };
    this.sw = mk(0, false); mk(-H - 0.15, true); mk(H + 0.15, true); mk(-2 * (H + 0.15), true); mk(2 * (H + 0.15), true);
    // rack rails
    for (const x of [-W / 2 - 1.6, W / 2 + 1.6]) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(2.4, 120, 3), metal); r.position.set(x, 0, -0.8); sc.add(r);
    }
    // LEDs (instanced, one above-left of every port, plus the 4 uplinks)
    this.leds = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.26, 0.14), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), 48 * 3);
    const m4 = new THREE.Matrix4();
    let k = 0;
    for (const dy of [0, -(H + 0.15), H + 0.15]) for (let n = 1; n <= 48; n++) {
      const p = portPos(n); m4.makeTranslation(p.x - 0.5, p.y + (n % 2 ? 0.7 : -0.7) + dy, H / 2 + 0.03 - 2.2); this.leds.setMatrixAt(k++, m4);
    }
    this.leds.position.z = 2.2; sc.add(this.leds);
    this.ledCol = new THREE.Color();
    // patch cables from occupied ports, hanging down and away (dark jackets, subtle sheen)
    this.occupied = [1, 2, 3, 5, 6, 9, 10, 12, 14, 15, 17, 21, 22, 24, 26, 27, 30, 33, 34, 37, 40, 41, 43, 46];
    const cableCols = [0x1c3f66, 0x2a2f36, 0x4a4420, 0x1c3f66, 0x32363c];
    for (const n of this.occupied) this.scene.add(this.cable(portPos(n), cableCols[n % cableCols.length], n));
    // the hero cable + plug (animated)
    this.plug = this.makePlug(PAL.employee); sc.add(this.plug);
    // unknown endpoint
    this.unknown = new Packet({ color: PAL.unknown, scale: 0.9 }); sc.add(this.unknown.group);
    this.fx2 = new GlowPoints(400); sc.add(this.fx2.mesh);
    this.haze = glowSprite('#3a78a8', 90, 0.12); this.haze.position.set(10, 25, -30); sc.add(this.haze);
  }

  cable(p, color, seed) {
    const pts = [p.clone().add(V(0, 0, 1.4)), p.clone().add(V((hash(seed, 1) - 0.5) * 3, -3, 7)), p.clone().add(V((hash(seed, 2) - 0.5) * 8, -18, 11 + hash(seed, 3) * 6)), p.clone().add(V((hash(seed, 4) - 0.5) * 10, -60, 14))];
    const g = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3(pts);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.28, 8), new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 })));
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, 2.2, 12), new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(1.4), roughness: 0.4, metalness: 0.1 }));
    boot.rotation.x = Math.PI / 2; boot.position.copy(p).add(V(0, 0, 1.3)); g.add(boot);
    return g;
  }

  makePlug(color) {
    const g = new THREE.Group();
    const clear = new THREE.MeshStandardMaterial({ color: 0x6f8494, roughness: 0.15, metalness: 0.0, transparent: true, opacity: 0.35, depthWrite: false });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.82, 2.2), clear); body.position.z = 1.1; g.add(body);
    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 1.6), clear); latch.position.set(0, -0.46, 1.4); latch.rotation.x = -0.12; g.add(latch);
    const pins = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.5), new THREE.MeshStandardMaterial({ color: 0xd9b25a, roughness: 0.25, metalness: 1 })); pins.position.set(0, 0.34, 0.3); g.add(pins);
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 2.2, 14), new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.4), roughness: 0.35, emissive: new THREE.Color(color), emissiveIntensity: 0.2 })); boot.rotation.x = Math.PI / 2; boot.position.z = 3.2; g.add(boot); g.userData.boot = boot;
    const curve = new THREE.CatmullRomCurve3([V(0, 0, 4.2), V(0, -0.5, 10), V(3, -6, 22), V(8, -30, 40)]);
    const jacket = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.3, 10), new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.35), roughness: 0.45, emissive: new THREE.Color(color), emissiveIntensity: 0.15 }));
    g.add(jacket); g.userData.jacket = jacket;
    return g;
  }

  // port state → LED colour (linear, HDR)
  setLed(i, col, k) { this.ledCol.set(col).multiplyScalar(k); this.leds.setColorAt(i, this.ledCol); }

  update(t, shot, tl) {
    const TL = this.tl, mode = shot.mode, kick = TL.kick(t);
    const s2 = TL.seg(2).start, click = TL.nearestBeat(s2 + 0.35); // the plug clicks home on a beat right after "Client connected"
    const heroLink = mode === 'intro' ? 0 : mode === 'connect' ? (t >= click ? 1 : 0) : 1;
    const allGreen = mode === 'outro';
    // LEDs: connected ports flicker with activity (eighth notes), hero waits amber, intruder red when refused
    const e8 = Math.floor(t / (BEAT / 2));
    for (let row = 0; row < 3; row++) for (let n = 1; n <= 48; n++) {
      const i = row * 48 + n - 1, occ = this.occupied.includes(n) || allGreen || (row > 0 && hash(n, row) > 0.4);
      let col = '#000000', k = 0;
      if (row === 0 && n === HERO) {
        if (heroLink) { col = PAL.permit; k = 3 + 3 * kick; } else { col = '#ffae2e'; k = mode === 'intro' ? 1.5 + 1.5 * (0.5 + 0.5 * Math.sin(t * 3)) : 2; }
      } else if (row === 0 && n === INTRUDER && mode === 'outside') {
        col = PAL.deny; k = 5 + 3 * (Math.floor(t * 4) % 2);
      } else if (occ) {
        const act = hash(n * 3 + row, e8) > (allGreen ? 0.25 : 0.55);
        col = PAL.permit; k = (row === 0 ? 1 : 0.4) * (act ? 2.4 : 0.5) * (mode === 'intro' ? 0 : 1) * (allGreen ? 1.6 : 1);
      }
      this.setLed(i, col, k);
    }
    this.leds.instanceColor.needsUpdate = true;
    // plug: slides in along -z and clicks at `click`
    const hp = portPos(HERO);
    this.plug.visible = mode !== 'intro';
    const ins = mode === 'connect' ? ease.inOut(TL.span(t, shot.t[0] + 0.2, click)) : 1;
    this.plug.position.set(hp.x, hp.y, hp.z - 2.1 + (1 - ins) * 14);
    this.plug.rotation.set((1 - ins) * 0.25, (1 - ins) * -0.3, 0);
    const jk = this.plug.userData.jacket.material;
    jk.emissiveIntensity = 0.15 + (heroLink ? 0.6 * kick + 0.2 : 0);
    // port light: cyan bloom on link
    this.portLight.position.copy(hp).add(V(0, 0, 3));
    const flashK = mode === 'connect' ? Math.exp(-Math.max(0, t - click) / 0.25) * (t >= click ? 1 : 0) : 0;
    this.portLight.intensity = heroLink ? 40 + 400 * flashK + 60 * kick : 0;
    this.key.intensity = mode === 'intro' ? 0.22 + 0.25 * smooth(TL.span(t, 0, 7)) : allGreen ? 1.6 : 1.1;
    this.scene.environmentIntensity = mode === 'intro' ? 0.1 : 0.35;
    this.plug.userData.boot.material.emissiveIntensity = heroLink ? 0.5 + kick : 0.2;
    // particles: EAPOL pulse leaves the port after the click; red sparks for the intruder
    const P = this.fx2; P.begin();
    if (mode === 'connect' && t >= click) {
      const a = t - click;
      for (let j = 0; j < 40; j++) {
        const u = a * 18 - j * 0.35; if (u < 0) continue;
        P.add(hp.clone().add(V(Math.sin(j) * 0.1, Math.cos(j) * 0.1, 2.2 + u)), 0.14, [0.3, 1.8, 3], clamp(1 - u / 30) * 0.9, V(0, 0, 0.8));
      }
    }
    const up = portPos(INTRUDER);
    this.unknown.group.visible = mode === 'outside';
    if (mode === 'outside') {
      const gq = Math.floor(t * 12), gl = hash(gq, 7) > 0.6 ? 1 : 0;
      this.unknown.group.position.copy(up).add(V(gl * (hash(gq, 1) - 0.5) * 0.8, 0.2 + gl * (hash(gq, 2) - 0.5) * 0.4, 6 - TL.span(t, shot.t[0], shot.t[1]) * 1.5));
      this.unknown.set({ t, rings: 0, shell: 1, core: 0.35 + 0.3 * gl });
      for (let j = 0; j < 30; j++) {
        const a = ((t * 2 + hash(j, 1)) % 1);
        P.add(up.clone().add(V((hash(j, 2) - 0.5) * 3, (hash(j, 3) - 0.5) * 2, 0.5 + a * 3)), 0.06, [3, 0.25, 0.2], (1 - a) * 0.8);
      }
      this.fx = { sat: 0.55, glitch: 0.25 * (hash(Math.floor(t * 8), 3) > 0.7 ? 1 : 0.2) };
    }
    P.end();
    this.haze.material.opacity = mode === 'intro' ? 0.6 : 1;
  }

  camera(shot, tl) {
    const TL = this.tl, t = shot.t[0] + tl, mode = shot.mode, d = shot.t[1] - shot.t[0];
    const hp = portPos(HERO);
    if (mode === 'intro') {
      // low glide along the port row from port 40 towards port 7, slowly turning to face it
      const k = ease.inOut(tl / d);
      const x = lerp(12, hp.x + 3, k);
      return { pos: V(x + 4, lerp(6.5, 3.2, k), lerp(17, 10.5, k)), target: V(x - lerp(8, 3, k), 0.4, 0), fov: 34 };
    }
    if (mode === 'connect') {
      const click = TL.nearestBeat(TL.seg(2).start + 0.35), back = ease.inOut(TL.span(t, click + 0.3, shot.t[1]));
      return { pos: V(hp.x + lerp(5.5, 9, back), hp.y + lerp(1.8, 4.5, back), lerp(7.5, 16, back)), target: V(hp.x, hp.y, 1 + back * 2), fov: 32 };
    }
    if (mode === 'outside') {
      const up = portPos(INTRUDER), k = ease.in(tl / d);
      return { pos: V(up.x - 3 + k * 6, up.y + 1 + k * 10, 12 + k * 40), target: V(up.x, up.y, 4 - k * 2), fov: 34 };
    }
    // outro: fast sweep across the whole face
    const k = ease.inOut(tl / d);
    return { pos: V(lerp(-26, 26, k), lerp(8, 3, k), 24 - 6 * Math.sin(k * Math.PI)), target: V(lerp(-14, 14, k), 0, 0), fov: 38 };
  }
}
