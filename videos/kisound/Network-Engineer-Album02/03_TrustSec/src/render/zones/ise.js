// The ISE chamber: a dark hall with a monolith (the identity engine) whose "eye" watches a pedestal.
// Modes:
//   request   chase cam behind the EAPOL/RADIUS pulse from the switch to the monolith on the horizon
//   scan      scan rings + light curtain around the client; frontal push-in on "Who are you?"
//   card      the ID card assembles row by row on the beat
//   triangle  802.1X: client – switch – ISE as three nodes, request and answer run along the beams
//   profile   close on the card: device, user, role dock in; authorisation turns green
//   unknown   colour drains, the scan rings break on the unknown endpoint, the card stays empty
//   dialog    interrogation: eye (question) against glitching unknown (answer), "Access denied" knocks it back
//   known     the known client returns: scan succeeds in one sweep, colour floods back
import * as THREE from 'three';
import { PAL, BEAT } from '../config.js';
import { V, clamp, lerp, smooth, hash, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';
import { hdr, textPlane, glowRing, glowTube, floorGrid, canvasTexture, noise1, ease, MONO } from '../world.js';

const MONO_Z = -14, EYE_Y = 16;
const lin3 = (c, k = 1) => { const x = hdr(c, k); return [x.r, x.g, x.b]; };

function monolithMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uCol: { value: hdr('ise', 1) }, uEye: { value: hdr('ise', 4) }, uGain: { value: 1 } },
    vertexShader: 'varying vec3 vP; varying vec3 vN; void main(){ vP = position; vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uT, uGain; uniform vec3 uCol, uEye; varying vec3 vP; varying vec3 vN;
      void main(){
        float front = step(0.5, vN.z);
        // the slab has a visible surface: vertical gradient, panel seams, slow scan – never a thin bright outline
        float grad = 1.0 - (vP.y + 11.0) / 22.0;
        vec3 c = vec3(0.005, 0.009, 0.014) * (0.45 + 0.9 * grad * grad);
        float seams = smoothstep(0.93, 1.0, fract(vP.x * 0.58 + 0.5)) * 0.05 + smoothstep(0.96, 1.0, fract(vP.y * 0.22)) * 0.035;
        float scan = smoothstep(0.975, 1.0, fract(vP.y * 0.5 - uT * 0.35)) * 0.16;
        // soft wide rim, so the edge reads as a lit flank and not as a frame drawn over the scene
        float rim = smoothstep(1.9, 3.25, abs(vP.x)) * 0.30 + smoothstep(7.0, 11.0, abs(vP.y)) * 0.18;
        float eye = exp(-pow((vP.y - 5.0) * 4.0, 2.0)) * smoothstep(3.1, 0.8, abs(vP.x));
        float halo = exp(-pow((vP.y - 5.0) * 0.85, 2.0)) * 0.05;
        c += (uCol * (seams + scan + rim) * 0.45 * uGain + uEye * (eye + halo)) * front + uCol * (0.025 + rim * 0.12) * (1.0 - front);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}

export class IseZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    const sc = this.scene = new THREE.Scene();
    sc.fog = new THREE.FogExp2(0x02050a, 0.022);
    sc.environment = ctx.env; sc.environmentIntensity = 0.25;
    this.clear = 0x010306; this.speedRef = 10; this.bloom = 0.11;
    sc.add(new THREE.HemisphereLight(0x5a7a98, 0x020304, 0.4));
    this.floor = floorGrid({ cell: 1, major: 6, color: '#0b2130', fade: 0.045 }); sc.add(this.floor);
    // monolith + edges
    this.monoMat = monolithMaterial();
    this.mono = new THREE.Mesh(new THREE.BoxGeometry(6.5, 22, 2.6), this.monoMat); this.mono.position.set(0, 11, MONO_Z); sc.add(this.mono);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.7, 4.4), new THREE.MeshStandardMaterial({ color: 0x0a1016, roughness: 0.4, metalness: 0.7 }));
    plinth.position.set(0, 0.35, MONO_Z); sc.add(plinth);
    this.eyeLight = new THREE.PointLight(0xffffff, 0, 60, 1.6); this.eyeLight.position.set(0, EYE_Y, MONO_Z + 3); sc.add(this.eyeLight);
    // pedestal
    this.pedRing = glowRing(2.3, 0.03, 'ise', 2); this.pedRing.rotation.x = Math.PI / 2; this.pedRing.position.y = 0.02; sc.add(this.pedRing);
    const disc = this.disc = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.4, 0.3, 64), new THREE.MeshStandardMaterial({ color: 0x0a1016, roughness: 0.3, metalness: 0.8 })); disc.position.y = 0.15; sc.add(disc);
    // client packets
    this.hero = new Packet({ color: PAL.employee, sgt: 10, scale: 0.62 }); sc.add(this.hero.group);
    this.unknown = new Packet({ color: PAL.unknown, scale: 0.62 }); sc.add(this.unknown.group);
    // scan rings as arcs (so they can break apart)
    this.arcs = [];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.025, 6, 40, (Math.PI * 2) / 6 - 0.06), new THREE.MeshBasicMaterial({ color: hdr('ise', 4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.userData = { r, k }; sc.add(m); this.arcs.push(m);
    }
    this.curtain = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 3.6, 64, 1, true), new THREE.ShaderMaterial({
      uniforms: { uCol: { value: hdr('ise', 0.6) }, uT: { value: 0 }, uA: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uCol; uniform float uT, uA; varying vec2 vUv;
        void main(){ float l = smoothstep(0.8, 1.0, fract(vUv.x * 60.0)) * 0.6 + 0.15; float v = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
          gl_FragColor = vec4(uCol * l * v * uA, 1.0); }`,
    }));
    this.curtain.position.y = 1.9; sc.add(this.curtain);
    // ID card
    this.card = this.buildCard(); sc.add(this.card);
    // 802.1X triangle: switch box + beams + labels
    this.tri = new THREE.Group(); sc.add(this.tri);
    const swBox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 1.6), new THREE.MeshStandardMaterial({ color: 0x151b22, metalness: 0.8, roughness: 0.35 }));
    swBox.position.set(0, 0.6, 5); this.tri.add(swBox);
    const swEdge = this.swEdge = new THREE.LineSegments(new THREE.EdgesGeometry(swBox.geometry), new THREE.LineBasicMaterial({ color: hdr('employee', 2), transparent: true, blending: THREE.AdditiveBlending })); swEdge.position.copy(swBox.position); this.tri.add(swEdge);
    this.nodes = { client: V(-7, 1.2, 3), sw: V(0, 0.9, 5), ise: V(0, 3.4, MONO_Z + 1.6) };
    this.beamA = glowTube([this.nodes.client, V(-3.5, 1.4, 4.6), this.nodes.sw], 0.05, 'employee', 1.8); this.tri.add(this.beamA);
    this.beamB = glowTube([this.nodes.sw, V(0, 1.5, -2), this.nodes.ise], 0.05, 'ise', 1.4); this.tri.add(this.beamB);
    // port LED on the authenticator: amber while unauthorised, green once the Access-Accept arrives
    this.port = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.18), new THREE.MeshBasicMaterial({ color: hdr('#ffae2e', 3), toneMapped: false }));
    this.port.position.set(-1.1, 0.83, 5.0); this.port.rotation.x = -Math.PI / 2; this.tri.add(this.port);
    // labels sit clear of the beams: EAPOL above its beam, RADIUS beside its beam, node names in front of the nodes
    const la = textPlane('EAPOL', { h: 0.7, color: PAL.employee, k: 1.8, font: `700 72px ${MONO}` }); la.position.set(-3.9, 2.6, 4.4); this.tri.add(la);
    const lb = textPlane('RADIUS', { h: 0.7, color: PAL.ise, k: 1.4, font: `700 72px ${MONO}` }); lb.position.set(2.6, 3.4, -3); this.tri.add(lb);
    const ls = textPlane('AUTHENTICATOR', { h: 0.42, color: PAL.dim, k: 1.2, font: `500 64px ${MONO}` }); ls.position.set(0, 0.28, 6.8); this.tri.add(ls);
    const lc = textPlane('SUPPLICANT', { h: 0.42, color: PAL.dim, k: 1.2, font: `500 64px ${MONO}` }); lc.position.set(-7, 0.28, 4.6); this.tri.add(lc);
    const ld = textPlane('POLICY SERVER', { h: 0.62, color: PAL.dim, k: 1.2, font: `500 64px ${MONO}` }); ld.position.set(0, 1.35, MONO_Z + 3.6); this.tri.add(ld);
    const lh = textPlane('802.1X · PORT-BASED ACCESS CONTROL', { h: 0.5, color: PAL.text, k: 1.6, font: `600 72px ${MONO}` }); lh.position.set(-2, 7.4, 1); this.tri.add(lh);
    this.triLabels = [la, lb, ls, lc, ld, lh];
    this.cert = this.buildCert(); this.tri.add(this.cert);
    this.pts = new GlowPoints(1500); sc.add(this.pts.mesh);
    this.camPos = V(0, 3, 10);
  }

  // the client's EAP-TLS certificate: a small card that travels to the policy server and is checked there
  buildCert() {
    const g = new THREE.Group();
    const tex = canvasTexture('cert', 640, 400, (c, w, h) => {
      c.fillStyle = '#081a26'; c.fillRect(0, 0, w, h);
      c.strokeStyle = '#7fe3ff'; c.lineWidth = 8; c.strokeRect(12, 12, w - 24, h - 24);
      c.fillStyle = '#7fe3ff'; c.fillRect(12, 12, w - 24, 62);
      c.fillStyle = '#04141d'; c.font = '700 40px "JetBrains Mono", monospace'; c.textBaseline = 'middle';
      c.fillText('EAP-TLS', 34, 44);
      c.fillStyle = '#dff4ff'; c.font = '500 30px "JetBrains Mono", monospace';
      c.fillText('CN = laptop-0142', 34, 128);
      c.fillText('OU = corp\\employee', 34, 176);
      c.fillStyle = '#8fb3c6';
      c.fillText('ISSUER  CORP-CA', 34, 232);
      c.fillText('VALID   2026-01-01', 34, 276);
      for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(143,179,198,0.5)'; c.fillRect(34, 316 + i * 18, 300 - i * 70, 7); }
      // seal
      c.strokeStyle = '#3fe08a'; c.lineWidth = 7; c.beginPath(); c.arc(540, 300, 52, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(514, 300); c.lineTo(534, 322); c.lineTo(568, 280); c.stroke();
    });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.44), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
    g.add(card);
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.3, 1.44)), new THREE.LineBasicMaterial({ color: hdr('ise', 3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    g.add(frame);
    // scan bar that sweeps the card while the policy server checks it
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(2.38, 0.09), new THREE.MeshBasicMaterial({ color: hdr('ise', 5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    bar.position.z = 0.02; g.add(bar);
    g.userData = { card, frame, bar };
    return g;
  }

  buildCard() {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.9), new THREE.MeshBasicMaterial({ color: hdr('#0e2a3a', 0.9), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    g.add(panel);
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(4.4, 2.9)), new THREE.LineBasicMaterial({ color: hdr('ise', 2), transparent: true, blending: THREE.AdditiveBlending }));
    g.add(frame);
    const head = textPlane('ISE · SESSION', { h: 0.26, color: PAL.dim, k: 1.6, font: `600 64px ${MONO}`, align: 'left' }); head.position.set(-2.0, 1.12, 0.01); g.add(head);
    const rows = [['USER', 'corp\\employee'], ['DEVICE', 'laptop-0142'], ['METHOD', '802.1X · EAP-TLS'], ['ROLE', 'EMPLOYEE']];
    const unk = ['—', 'unknown', 'none', '—'];
    this.rows = rows.map(([k, v], i) => {
      const y = 0.55 - i * 0.5;
      const key = textPlane(k, { h: 0.24, color: PAL.dim, k: 1.4, font: `500 64px ${MONO}`, align: 'left' }); key.position.set(-2.0, y, 0.01);
      const val = textPlane(v, { h: 0.3, color: PAL.text, k: 1.8, font: `600 72px ${MONO}`, align: 'left' }); val.position.set(-0.5, y, 0.01);
      const bad = textPlane(unk[i], { h: 0.3, color: PAL.deny, k: 2.2, font: `600 72px ${MONO}`, align: 'left' }); bad.position.set(-0.5, y, 0.01);
      const bar = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 0.42), new THREE.MeshBasicMaterial({ color: hdr('permit', 1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      bar.position.set(0, y, 0.005); g.add(key, val, bad, bar);
      return { key, val, bad, bar };
    });
    this.cardFrame = frame; this.cardPanel = panel;
    g.position.set(-3.6, 2.1, -0.6); g.rotation.y = Math.PI + 0.38; // faces the ISE-side cameras
    return g;
  }
  // row reveal times per mode (absolute seconds), null = hidden
  rowTimes(mode) {
    const TL = this.tl;
    if (mode === 'card') { const s = TL.seg(6).start; return [0, 1, 2, 3].map((i) => TL.nearestBeat(s + 0.1 + i * 2 * BEAT)); }
    if (mode === 'profile') { const a = TL.seg(10).start, b = TL.seg(11).start; return [TL.nearestBeat(a + 1.6), TL.nearestBeat(a + 0.2), TL.nearestBeat(a + 0.9), TL.nearestBeat(b + 0.1)]; }
    if (mode === 'known') return [-1, -1, -1, -1];
    if (mode === 'unknown') { const s = TL.seg(46).start; return [0, 1, 2, 3].map((i) => s + i * BEAT); }
    return null;
  }

  update(t, shot, tl) {
    this.camPos = this.camera(shot, tl).pos;
    const TL = this.tl, mode = shot.mode, kick = TL.kick(t), low = TL.env('low', t);
    this.monoMat.uniforms.uT.value = t;
    const unknownMode = mode === 'unknown' || mode === 'dialog';
    const eyeCol = mode === 'known' ? 'employee' : unknownMode ? (mode === 'dialog' ? 'query' : 'deny') : 'ise';
    let eyeK = 3 + 2 * kick;
    // client selection
    const hero = this.hero, unk = this.unknown;
    hero.group.visible = !unknownMode && mode !== 'request'; unk.group.visible = unknownMode;
    const bandOn = mode === 'known' ? 1 : mode === 'triangle' ? smooth(TL.span(t, this.triTimes().client, this.triTimes().client + 0.45)) : 0;
    hero.group.position.set(0, 1.9 + Math.sin(t * 1.3) * 0.06, 0);
    hero.set({ t, rings: 1, shell: 1, core: 0.8 + 0.5 * kick, band: bandOn, camPos: this.camPos });
    const gq = Math.floor(t * 12), gl = unknownMode && hash(gq, 7) > 0.72 ? 1 : 0;
    unk.group.position.set(gl * (hash(gq, 1) - 0.5) * 0.5, 1.9 + gl * (hash(gq, 2) - 0.5) * 0.3, 0);
    unk.set({ t, rings: 0, shell: 1, core: 0.35 + 0.35 * gl });
    // scan arcs
    const scanning = ['scan', 'card', 'unknown', 'known', 'profile'].includes(mode);
    const breakT = mode === 'unknown' ? TL.seg(45).start + 0.5 : Infinity;
    const arcCol = mode === 'known' ? 'permit' : unknownMode ? '#c9d3dc' : 'ise';
    const scanSpeed = mode === 'known' ? 2.4 : 1.2;
    // close-up on "Who are you?": the rings pass right in front of the lens – keep them dim there (no flicker)
    const near = mode === 'scan' ? smooth(TL.span(t, TL.seg(5).start - 0.2, TL.seg(5).start + 0.2)) * (1 - smooth(TL.span(t, TL.seg(5).end + 0.3, shot.t[1]))) : 0;
    this.arcs.forEach((m) => {
      const { r, k } = m.userData;
      m.visible = scanning;
      if (!scanning) return;
      const y = 1.9 + Math.sin(t * scanSpeed + r * 2.1) * 1.7;
      const a0 = (k / 6) * Math.PI * 2 + t * (0.6 + r * 0.3) * (r % 2 ? -1 : 1);
      const br = clamp((t - breakT) / 1.2);
      const out = br * (2 + hash(r, k) * 5), fall = br * br * 4;
      m.position.set(Math.cos(a0 + 0.5) * out, y - fall + br * (hash(k, r) - 0.5) * 3, Math.sin(a0 + 0.5) * out);
      m.rotation.set(Math.PI / 2 + br * hash(r, k + 3) * 3, br * hash(r, k + 5) * 2, a0);
      const flick = unknownMode && t > breakT ? (hash(gq + r * 7, k) > 0.5 ? 1 : 0.2) : 1;
      m.material.color.copy(hdr(arcCol, (1.8 + 1.2 * kick) * (1 - br * 0.8) * flick * (1 - 0.75 * near)));
    });
    const cur = this.curtain.material.uniforms;
    cur.uA.value = scanning ? (mode === 'unknown' ? 1 - clamp((t - breakT) / 0.6) : 1) * (0.18 + 0.15 * kick) : 0;
    cur.uCol.value.copy(hdr(arcCol, 0.6));
    // card
    const times = this.rowTimes(mode);
    this.card.visible = !!times && mode !== 'scan';
    if (this.card.visible) {
      this.card.rotation.y = Math.PI + 0.38 + Math.sin(t * 0.4) * 0.04;
      this.rows.forEach((row, i) => {
        const a = t - times[i], on = a >= 0;
        const good = mode !== 'unknown';
        row.key.visible = true;
        row.val.visible = on && good; row.bad.visible = on && !good;
        const flash = on ? Math.exp(-a / 0.3) : 0;
        const barCol = good ? (i === 3 ? 'permit' : 'ise') : 'deny';
        row.bar.material.color.copy(hdr(barCol, 0.08 + 0.9 * flash + (i === 3 && on && good ? 0.18 : 0)));
        const sc = on ? 1 + 0.12 * flash : 1; row.val.scale.setScalar(sc); row.bad.scale.setScalar(sc);
      });
      const frameCol = mode === 'unknown' ? 'deny' : mode === 'known' ? 'permit' : 'ise';
      this.cardFrame.material.color.copy(hdr(frameCol, 2 + kick));
    }
    // triangle
    this.tri.visible = mode === 'triangle' || mode === 'request';
    this.triLabels.forEach((l) => { l.visible = mode === 'triangle'; if (l.visible) l.lookAt(this.camPos); });
    this.cert.visible = this.port.visible = mode === 'triangle';
    this.beamA.visible = this.beamB.visible = mode === 'triangle';
    if (mode === 'triangle') { hero.group.position.copy(this.nodes.client); }
    this.disc.visible = this.pedRing.visible = mode !== 'triangle' && mode !== 'request';
    // particles: pulses along beams (triangle), request pulse (request), deny knock-back (dialog)
    const P = this.pts; P.begin();
    if (mode === 'triangle') {
      const s1 = TL.seg(8).start, s2 = TL.seg(9).start;
      const pulse = (curve, a, col, n = 14) => { if (a < 0 || a > 1) return; for (let j = 0; j < n; j++) { const u = a - j * 0.014; if (u < 0) break; P.add(curve.getPointAt(clamp(u)), 0.1 * (1 - j / n), col, (1 - j / n)); } };
      const bpm = BEAT * 2;
      // Choreography on the beat grid: EAPOL identity request → certificate presented → RADIUS carries it to the
      // policy server → the server checks it → Access-Accept comes back and the port turns green.
      const T = this.triTimes();
      pulse(this.beamA.userData.curve, (t - T.s1) / (BEAT * 3), lin3('employee', 4));
      pulse(this.beamB.userData.curve, (t - T.send) / T.out, lin3('ise', 4));
      const ansA = (t - T.accept) / T.back, ansB = (t - T.sw) / (BEAT * 2);
      if (ansA >= 0 && ansA <= 1) pulse({ getPointAt: (u) => this.beamB.userData.curve.getPointAt(1 - u) }, ansA, lin3('permit', 2.5));
      if (ansB >= 0 && ansB <= 1) pulse({ getPointAt: (u) => this.beamA.userData.curve.getPointAt(1 - u) }, ansB, lin3('permit', 2.5));
      // constant packet flow along the beams on eighth notes
      for (let j = 0; j < 16; j++) { const u = ((t / (BEAT * 4)) + j / 16) % 1; P.add(this.beamA.userData.curve.getPointAt(u), 0.05, lin3('employee', 2), 0.5); P.add(this.beamB.userData.curve.getPointAt(u), 0.05, lin3('ise', 2), 0.35); }
      // the certificate itself
      const cu = this.cert.userData;
      const born = ease.back(TL.span(t, T.cert, T.cert + 0.35));
      const fly = ease.inOut(TL.span(t, T.send, T.send + T.out));
      const gone = TL.span(t, T.accept, T.accept + 0.4);
      this.cert.visible = t >= T.cert && gone < 1;
      if (this.cert.visible) {
        const at = fly > 0 ? this.beamB.userData.curve.getPointAt(fly).add(V(0, 0.9 * (1 - fly) + 2.2 * fly, 0))
          : this.nodes.client.clone().add(V(0.7, 1.5, 0.7));
        this.cert.position.copy(at);
        this.cert.lookAt(this.camPos);
        this.cert.scale.setScalar((0.2 + 0.8 * born) * (1 + 1.6 * fly) * (1 - gone));
        // the scan bar sweeps the card while the policy server is checking, then the seal flashes green
        const checking = t >= T.check && t < T.accept;
        cu.bar.visible = checking;
        if (checking) cu.bar.position.y = (((t - T.check) / 0.7) % 1 - 0.5) * 1.4;
        const ok = t >= T.accept ? Math.exp(-(t - T.accept) / 0.25) : 0;
        cu.frame.material.color.copy(hdr(t >= T.accept ? 'permit' : 'ise', 2.5 + 3 * ok + 2 * kick * (checking ? 1 : 0)));
        if (checking) eyeK += 2.5 + 2 * Math.sin(t * 9);
      }
      // authenticator port: amber until the Access-Accept lands at the switch, green after
      const acc = t >= T.sw, aGlow = acc ? Math.exp(-(t - T.sw) / 0.35) : 0;
      this.port.material.color.copy(hdr(acc ? 'permit' : '#ffae2e', acc ? 4 + 6 * aGlow + 3 * kick : 2.5));
      this.swEdge.material.color.copy(hdr(acc ? 'permit' : 'employee', 2 + 4 * aGlow));
      eyeK += 8 * Math.exp(-Math.max(0, t - T.check) / 0.4) * (t >= T.check ? 1 : 0);
    }
    if (mode === 'request') {
      const u = this.reqU(t, shot), p = this.reqPoint(u);
      const back = this.reqPoint(u - 0.12).sub(p);
      P.add(p, 0.07, lin3('employee', 4), 1, back); P.add(p, 0.12, lin3('ise', 3), 0.9);
      eyeK += 6 * smooth(TL.span(t, shot.t[1] - 1.3, shot.t[1] - 0.2));
      // floor sparks trailing the pulse
      for (let j = 0; j < 60; j++) { const q = this.reqPoint(u - hash(j, 1) * 0.15); P.add(q.add(V((hash(j, 2) - 0.5) * 2, -q.y + 0.05, 0)), 0.05, lin3('employee', 2), 0.5 * hash(j, 3)); }
    }
    if (mode === 'dialog') {
      const den = TL.seg(59).start, a = t - den;
      if (a > 0 && a < 2) {
        for (let j = 0; j < 90; j++) { const ang = hash(j, 1) * 6.283, r = ease.out(a / 1.2) * (2 + hash(j, 2) * 4), dir = V(Math.cos(ang), Math.sin(ang) * 0.6, -0.4 - hash(j, 3)).normalize(); P.add(unk.group.position.clone().add(dir.clone().multiplyScalar(r)), 0.03, lin3('deny', 5), clamp(1 - a / 1.4), dir.multiplyScalar(0.5)); }
        this.floor.material.uniforms.uRing.value = a * 14; this.floor.material.uniforms.uRingCol.value.copy(hdr('deny', 3 * clamp(1 - a / 1.6)));
        unk.group.position.z -= ease.out(a / 0.8) * 3; unk.group.position.y += ease.out(a / 0.8) * 0.5;
        eyeK += 12 * Math.exp(-a / 0.35);
      } else this.floor.material.uniforms.uRing.value = 0;
      // question: the eye flares
      for (const id of [55, 57]) { const s = TL.seg(id); if (t >= s.start && t < s.end + 0.3) eyeK += 5 * smooth(TL.span(t, s.start, s.start + 0.2)); }
    } else if (mode === 'known') {
      const a = t - shot.t[0];
      this.floor.material.uniforms.uRing.value = a < 2.5 ? a * 10 : 0; this.floor.material.uniforms.uRingCol.value.copy(hdr('employee', 2.5 * clamp(1 - a / 2.5)));
    } else this.floor.material.uniforms.uRing.value = 0;
    // ambient motes rising in the hall
    for (let j = 0; j < 240; j++) {
      const x = (hash(j, 11) - 0.5) * 40, z = -22 + hash(j, 12) * 22, y = ((t * (0.3 + hash(j, 13) * 0.5) + hash(j, 14) * 18) % 18);
      P.add(V(x, y, z), 0.018, lin3(unknownMode ? '#9aa6b0' : 'ise', 0.9), 0.2 * hash(j, 15));
    }
    P.end();
    this.monoMat.uniforms.uEye.value.copy(hdr(eyeCol, eyeK));
    this.monoMat.uniforms.uCol.value.copy(hdr(eyeCol === 'employee' ? 'employee' : 'ise', unknownMode ? 0.5 : 1));
    this.eyeLight.color.set(PAL[eyeCol]); this.eyeLight.intensity = eyeK * 25;
    this.pedRing.material.color.copy(hdr(mode === 'known' ? 'employee' : unknownMode ? 'deny' : 'ise', 1.5 + 2 * kick));
    this.floor.material.uniforms.uPulse.value = kick * (unknownMode ? 0.2 : 0.8);
    this.floor.material.uniforms.uAcc.value.copy(hdr(mode === 'known' ? 'employee' : unknownMode ? 'deny' : 'ise', 1));
    // look: desaturated and glitchy while the unknown is in the room
    if (unknownMode) {
      let gl2 = 0.05;
      for (const id of [44, 46, 47, 51, 52, 54, 56, 58]) { const s = TL.seg(id); if (s && t >= s.start) gl2 = Math.max(gl2, 0.9 * Math.exp(-(t - s.start) / 0.25)); }
      this.fx.sat = mode === 'dialog' ? 0.45 : 0.3; this.fx.glitch = gl2; this.fx.vignette = 0.55;
    } else if (mode === 'known') this.fx.sat = lerp(0.35, 1, smooth(TL.span(t, shot.t[0], shot.t[0] + 1.2)));
  }

  // 802.1X timing, on the beat grid. Everything in the triangle shot reads these.
  triTimes() {
    const TL = this.tl, s1 = TL.seg(8).start, s2 = TL.seg(9).start;
    const accept = TL.nearestBeat(s1 + 13 * BEAT), back = 0.8;
    return { s1, check: s2, cert: TL.nearestBeat(s1 + 4 * BEAT), send: TL.nearestBeat(s1 + 8 * BEAT), accept, out: 1.25, back, sw: accept + back, client: accept + back + 2 * BEAT };
  }

  // request pulse path: from the switch in the foreground to the monolith base
  reqU(t, shot) { return ease.inOut(this.tl.span(t, shot.t[0] + 0.1, shot.t[1] - 0.15)); }
  reqPoint(u) { u = clamp(u); return V(Math.sin(u * 3) * 1.5, 0.8 + Math.sin(u * Math.PI) * 1.4, lerp(5.5, MONO_Z + 1.2, u)); }

  camera(shot, tl) {
    const TL = this.tl, t = shot.t[0] + tl, mode = shot.mode, d = shot.t[1] - shot.t[0];
    if (mode === 'request') {
      const u = this.reqU(t, shot), p = this.reqPoint(u);
      // ends wide in front of the tower: the pulse hits the base, the eye burns in the upper third
      const tgt = p.clone().add(V(0, 0.2, -6)).lerp(V(0, 9, MONO_Z), u * u);
      return { pos: p.clone().add(V(1.2, 0.6 + u * 2.6, 4.8 + u * 9)), target: tgt, fov: 46 };
    }
    if (mode === 'scan') {
      const q = TL.seg(5).start, push = ease.out(TL.span(t, q - 0.15, q + 0.25)), back = ease.inOut(TL.span(t, TL.seg(5).end + 0.3, shot.t[1]));
      // swings around to dead-on frontal: at the push-in we look through the policy server's own eye
      const a = Math.PI - 0.85 + tl * 0.05, dd = lerp(8.5, 3.4, push) + back * 3;
      const aa = lerp(a, Math.PI, push);
      return { pos: V(Math.sin(aa) * dd, lerp(1.4, 2.0, push), Math.cos(aa) * dd), target: V(0, lerp(3, 1.95, push), 0), fov: 36 };
    }
    if (mode === 'card') {
      const k = ease.inOut(tl / d);
      return { pos: V(lerp(-0.5, -1.6, k), lerp(2.8, 2.3, k), -lerp(9.5, 7.6, k)), target: V(-1.9, 2.0, -0.2), fov: 36 };
    }
    if (mode === 'triangle') {
      const a = -0.35 + tl * 0.04;
      return { pos: V(Math.sin(a) * 12 - 2.5, 6.5 - tl * 0.2, Math.cos(a) * 12 + 4), target: V(-2, 1.8, -1), fov: 42 };
    }
    if (mode === 'profile') {
      const k = tl / d;
      return { pos: V(lerp(-0.2, -1.4, k), 2.3, -lerp(6.4, 5.4, k)), target: V(-2.3, 2.0, -0.3), fov: 36 };
    }
    if (mode === 'unknown') {
      const a = Math.PI + 0.5 + tl * 0.07, dd = 7 - tl * 0.15;
      return { pos: V(Math.sin(a) * dd, 1.2 + tl * 0.05, Math.cos(a) * dd), target: V(-0.8, 2.2, 0), fov: 36 };
    }
    if (mode === 'dialog') {
      // question → low angle up at the eye; answer → extreme close-up of the unknown; otherwise wide two-shot
      const q = [55, 57].map((i) => TL.seg(i)).find((s) => t >= s.start - 0.05 && t < s.end + 0.35);
      const an = [56, 58].map((i) => TL.seg(i)).find((s) => t >= s.start - 0.05 && t < s.start + 1.2);
      const drift = noise1(t * 0.5, 4) * 0.3;
      if (an) return { pos: V(0.4 + drift, 2.1, -2.3), target: V(0, 1.9, 0), fov: 34 };
      if (q) return { pos: V(1.5 + drift, 0.6, 4.5), target: V(0, EYE_Y - 1, MONO_Z), fov: 34 };
      return { pos: V(-6 + drift, 3.0, 9.5), target: V(0, 6.5, -5), fov: 42 }; // two-shot: the eye stays in frame
    }
    // known
    const yaw = Math.PI + 0.6 * Math.sin(tl * 0.35), dd = 6.8 - tl * 0.12;
    return { pos: V(Math.sin(yaw) * dd, 2.1 + Math.sin(tl * 0.5) * 0.4, Math.cos(yaw) * dd), target: V(-0.9, 2.2, 0), fov: 38 };
  }
}
