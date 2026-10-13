// Close-up of the hero packet. Modes:
//   tag     the SGT band hovers, then snaps onto the packet exactly on the first drop
//   ip      the IP label rattles through addresses while the band stays calm ("Adresse wechselt, Kontext bleibt")
//   stamps  pre-hook: one seal + shockwave per system line (identity, role, SGT, access)
//   hook    the recurring hook image: frontal packet in a tunnel of speed lines, camera swings on every bar
//   inline  the packet opens into an Ethernet frame: DMAC | SMAC | CMD (SGT) | TYPE | PAYLOAD
//   title   the packet alone in the dark while the title decodes
import * as THREE from 'three';
import { PAL, GROUPS, BEAT } from '../config.js';
import { V, clamp, lerp, smooth, hash, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';
import { hdr, textPlane, glowRing, edgeBox, canvasTexture, MONO, ease } from '../world.js';

const lin3 = (c, k = 1) => { const x = hdr(c, k); return [x.r, x.g, x.b]; };

export class CloseupZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    this.scene = new THREE.Scene();
    this.clear = new THREE.Color('#020407').getHex();
    this.speedRef = 8;
    this.bloom = 0.1;
    this.hero = new Packet({ color: PAL.employee, sgt: 10 }); this.scene.add(this.hero.group);
    // backdrop: faint hex lattice far behind the packet
    this.backdrop = new THREE.Mesh(new THREE.PlaneGeometry(260, 150), new THREE.ShaderMaterial({
      uniforms: { uCol: { value: hdr('employee', 0.08) }, uT: { value: 0 }, uPulse: { value: 0 } }, depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uCol; uniform float uT, uPulse; varying vec2 vUv;
        float hexd(vec2 p){ p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.732))), p.x); }
        void main(){
          vec2 p = (vUv - 0.5) * vec2(260.0, 150.0) / 7.0;
          vec2 r = vec2(1.0, 1.732), h = r * 0.5;
          vec2 a = mod(p, r) - h, b = mod(p - h, r) - h;
          vec2 g = dot(a, a) < dot(b, b) ? a : b;
          float edge = smoothstep(0.46, 0.5, hexd(g));
          float d = length(vUv - 0.5);
          float wave = 0.5 + 0.5 * sin(d * 40.0 - uT * 3.0);
          gl_FragColor = vec4(uCol * edge * (0.25 + 0.75 * wave * wave) * (1.0 + uPulse * 2.0) * smoothstep(0.6, 0.05, d), 1.0);
        }`,
    }));
    this.backdrop.position.z = -60; this.scene.add(this.backdrop);
    // dust + speed lines
    this.pts = new GlowPoints(900); this.scene.add(this.pts.mesh);
    // shockwave rings (stamps / impacts)
    this.waves = [0, 1, 2, 3].map(() => { const r = glowRing(1, 0.02, 'ise', 4); r.visible = false; this.scene.add(r); return r; });
    // stamps: four seals around the packet
    const sealCols = ['ise', 'permit', 'employee', 'permit'];
    this.seals = sealCols.map((c, i) => {
      const g = new THREE.Group();
      const hex = new THREE.Mesh(new THREE.RingGeometry(0.52, 0.6, 6), new THREE.MeshBasicMaterial({ color: hdr(c, 3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const fill = new THREE.Mesh(new THREE.CircleGeometry(0.5, 6), new THREE.MeshBasicMaterial({ color: hdr(c, 0.35), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const ico = this.sealIcon(i, c); g.add(hex, fill, ico);
      g.userData = { hex, fill, ico, col: c };
      const a = [0.75, 0.25, -0.25, -0.75][i] * Math.PI; // top-left, top-right, bottom-right, bottom-left
      g.position.set(Math.cos(a) * 3.1 * 1.25, Math.sin(a) * 3.1 * 0.72, 0.4);
      g.visible = false; this.scene.add(g); return g;
    });
    // Ethernet frame (inline tagging)
    this.frame = this.buildFrame(); this.scene.add(this.frame);
  }

  sealIcon(i, c) {
    // simple glyphs drawn to a texture: 0 identity (person), 1 role (key), 2 tag, 3 check
    const tex = canvasTexture(`seal|${i}`, 256, 256, (g) => {
      g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round';
      if (i === 0) { g.beginPath(); g.arc(128, 96, 36, 0, 7); g.stroke(); g.beginPath(); g.arc(128, 214, 70, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
      if (i === 1) { g.beginPath(); g.arc(92, 128, 34, 0, 7); g.stroke(); g.beginPath(); g.moveTo(126, 128); g.lineTo(206, 128); g.moveTo(180, 128); g.lineTo(180, 156); g.moveTo(204, 128); g.lineTo(204, 150); g.stroke(); }
      if (i === 2) { g.beginPath(); g.moveTo(60, 90); g.lineTo(150, 90); g.lineTo(200, 128); g.lineTo(150, 166); g.lineTo(60, 166); g.closePath(); g.stroke(); g.beginPath(); g.arc(90, 128, 10, 0, 7); g.fill(); }
      if (i === 3) { g.beginPath(); g.moveTo(70, 132); g.lineTo(112, 176); g.lineTo(190, 84); g.stroke(); }
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: tex, color: hdr(c, 2.5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  }

  buildFrame() {
    const g = new THREE.Group(); g.visible = false;
    const fields = [
      { name: 'DMAC', w: 2.5, val: '00:1b:54:c2:7a:10', col: 'dim' },
      { name: 'SMAC', w: 2.5, val: '3c:22:fb:91:0e:4d', col: 'dim' },
      { name: 'CMD · 0x8909', w: 2.3, val: 'SGT 10', col: 'employee', hot: true },
      { name: 'TYPE', w: 1.2, val: '0x0800', col: 'dim' },
      { name: 'PAYLOAD', w: 3.6, val: '', col: 'employee', payload: true },
    ];
    const gap = 0.12, total = fields.reduce((s, f) => s + f.w + gap, -gap);
    let x = -total / 2;
    this.fields = fields.map((f, i) => {
      const fg = new THREE.Group(); fg.position.x = x + f.w / 2; x += f.w + gap; g.add(fg);
      const box = edgeBox(f.w, 1.1, 0.5, f.col === 'dim' ? '#6f8fa6' : f.col, f.hot ? 3 : 1.4); fg.add(box);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(f.w, 1.1), new THREE.MeshBasicMaterial({ color: hdr(f.col === 'dim' ? '#1c2c38' : f.col, f.hot ? 0.5 : 0.18), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      face.position.z = 0.25; fg.add(face);
      const name = textPlane(f.name, { h: 0.2, color: f.hot ? PAL.employee : PAL.dim, k: f.hot ? 2.5 : 1.4, font: `600 64px ${MONO}` }); name.position.set(0, 0.8, 0.25); fg.add(name);
      let val = null, ip = null;
      if (f.payload) {
        const tex = canvasTexture('payload', 512, 160, (c) => {
          c.font = '600 34px Menlo, monospace'; c.fillStyle = '#fff'; c.textBaseline = 'top';
          let r = 7; for (let y = 8; y < 150; y += 44) for (let xx = 8; xx < 500; xx += 52) { r = (r * 9301 + 49297) % 233280; c.globalAlpha = 0.3 + (r / 233280) * 0.7; c.fillText(((r >> 4) & 255).toString(16).padStart(2, '0'), xx, y); }
        });
        tex.wrapS = THREE.RepeatWrapping;
        val = new THREE.Mesh(new THREE.PlaneGeometry(f.w - 0.2, 0.62), new THREE.MeshBasicMaterial({ map: tex, color: hdr('employee', 1.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        val.position.set(0, -0.12, 0.26); fg.add(val);
        ip = textPlane('IP 10.20.31.44', { h: 0.2, color: PAL.text, k: 1.6, font: `600 64px ${MONO}` }); ip.position.set(0, 0.34, 0.27); fg.add(ip);
      } else {
        val = textPlane(f.val, { h: f.hot ? 0.36 : 0.19, color: f.hot ? PAL.employee : PAL.text, k: f.hot ? 3 : 1.2, font: `${f.hot ? 700 : 500} 72px ${MONO}` }); val.position.set(0, -0.05, 0.26); fg.add(val);
      }
      return { ...f, g: fg, box, face, name, val, ip, x0: fg.position.x };
    });
    return g;
  }

  // camera that swings to a new side on every bar (the move happens in the first ~0.6 beat of the bar)
  barSwing(t, amp, seed = 0) {
    const b = this.tl.beat(t), barF = b.b / 4, k = Math.floor(barF), ph = (barF - k) * 4;
    const side = (n) => (hash(n, seed) - 0.5) * 2 * amp;
    return lerp(side(k - 1), side(k), ease.out(ph / 0.6));
  }

  impactOf(shot) { return shot.t[0] + 4 * BEAT; } // hook 2: the drop on bar 75, one bar after the cut on bar 74

  update(t, shot, tl) {
    this.camPos = this.camera(shot, tl).pos; // billboards face the camera of this very frame
    const TL = this.tl, kick = TL.kick(t), low = TL.env('low', t), mode = shot.mode;
    this.mode = mode;
    const h = this.hero;
    h.group.position.set(0, 0, 0); h.group.rotation.set(0, 0, 0); h.group.scale.setScalar(1);
    let band = 1, bandSnap = null, ip = 0, ipText = null, ipDim = 1, core = 0.9 + 0.5 * kick, bandSpin = 0.6;
    this.seals.forEach((s) => (s.visible = false));
    this.waves.forEach((w) => (w.visible = false));
    this.frame.visible = false; h.group.visible = true;
    let streak = 0, streakSpeed = 0, dust = 1, pulse = kick * 0.6;
    const bd = this.backdrop.material.uniforms; bd.uT.value = t;

    if (mode === 'tag') {
      const snap = shot.t[1];
      band = smooth(TL.span(t, TL.seg(7).start, TL.seg(7).start + 0.7));
      bandSnap = ease.out(TL.span(t, snap - 0.3, snap));
      core = 0.8 + 0.3 * band + 0.6 * bandSnap;
      bandSpin = 0.6 + (1 - bandSnap) * 2.5;
      this.fx.shake = 0.5 + band; streak = band * 0.4; streakSpeed = 6;
    } else if (mode === 'ip') {
      ip = 1; bandSpin = 0.25;
      const s0 = TL.seg(12).start, st = Math.floor((t - s0) / (BEAT / 2)); // new address every eighth note
      if (t >= s0) {
        const o3 = 2 + Math.floor(hash(st, 3) * 250), o4 = 2 + Math.floor(hash(st, 4) * 250);
        ipText = `10.20.${o3}.${o4}`; ipDim = 0.75 + 0.25 * hash(st, 5);
      } else ipText = '10.20.31.44';
      streak = 0.25; streakSpeed = 4;
    } else if (mode === 'stamps') {
      const ids = [14, 15, 16, 17];
      ids.forEach((id, i) => {
        const s = TL.seg(id), a = t - s.start;
        const sg = this.seals[i]; sg.visible = a > -0.05;
        if (!sg.visible) return;
        const pop = ease.back(clamp(a / 0.22)), glow = Math.exp(-Math.max(0, a) / 0.35);
        sg.scale.setScalar(0.2 + 0.8 * pop);
        sg.userData.hex.material.color.copy(hdr(sg.userData.col, 2.5 + 6 * glow));
        sg.userData.fill.material.color.copy(hdr(sg.userData.col, 0.25 + 1.2 * glow));
        sg.userData.ico.material.color.copy(hdr(sg.userData.col, 2 + 4 * glow));
        const w = this.waves[i]; w.visible = a >= 0 && a < 0.9;
        if (w.visible) { const r = 1.6 + a * 9; w.scale.setScalar(r); w.material.color.copy(hdr(sg.userData.col, 4 * (1 - a / 0.9) ** 2)); w.position.set(0, 0, 0); w.rotation.set(0, 0, 0); }
      });
      streak = 0.2; streakSpeed = 3;
    } else if (mode === 'hook') {
      const lvl = shot.lvl || 1;
      bandSpin = 1.4 + lvl * 0.4;
      streak = 0.6 + lvl * 0.25; streakSpeed = 22 + lvl * 10; dust = 0.5;
      pulse = kick * (0.8 + lvl * 0.3);
      if (lvl === 2) {
        const impact = this.impactOf(shot);
        const pre = t < impact;
        if (pre) { const k = TL.span(t, shot.t[0], impact); streakSpeed = lerp(4, 40, k * k); streak = 0.3 + 0.9 * k; this.fx.shake = 0.3 + k; }
        const a = t - impact, w = this.waves[0];
        w.visible = a >= 0 && a < 0.8;
        if (w.visible) { w.scale.setScalar(1.8 + a * 14); w.material.color.copy(hdr('employee', 6 * (1 - a / 0.8) ** 2)); }
      }
      // a shockwave ring on every bar line (one per bar – never strobing)
      const b = TL.beat(t), barPh = (b.b / 4) - Math.floor(b.b / 4), w2 = this.waves[1];
      const a2 = barPh * 4 * BEAT;
      w2.visible = a2 < 0.6 && !(lvl === 2 && t < this.impactOf(shot));
      if (w2.visible) { w2.scale.setScalar(1.7 + a2 * 7); w2.material.color.copy(hdr('employee', 3 * (1 - a2 / 0.6) ** 2)); }
      bd.uCol.value.copy(hdr('employee', 0.1 + 0.04 * lvl));
    } else if (mode === 'inline') {
      this.updateFrame(t, shot);
      streak = 0.35; streakSpeed = 10; dust = 0.6;
    } else if (mode === 'title') {
      core = 0.45 + 0.25 * kick; streak = 0; dust = 1.2; bandSpin = 0.3;
      h.group.rotation.y = t * 0.15;
    }
    if (mode !== 'hook') bd.uCol.value.copy(hdr('employee', 0.07));
    bd.uPulse.value = pulse;
    h.group.scale.setScalar(1 + 0.06 * kick);
    h.set({ t, rings: 1, shell: 1, core, band, bandSnap, bandSpin, ip, ipText, ipDim, camPos: this.camPos });
    this.updatePoints(t, streak, streakSpeed, dust, shot);
  }

  updateFrame(t, shot) {
    const TL = this.tl, f0 = shot.t[0];
    const open = ease.inOut(TL.span(t, f0 + 0.1, f0 + 1.3)); // packet opens into the frame
    const ipOff = TL.span(t, TL.seg(29).start, TL.seg(29).start + 0.6); // "Die IP allein entscheidet nicht mehr"
    this.frame.visible = open > 0.01;
    this.hero.group.visible = open < 0.95;
    this.hero.group.scale.setScalar(1 - 0.8 * open);
    this.frame.scale.setScalar(0.3 + 0.7 * open);
    // the whole frame travels slowly to the right – the tag goes with the traffic
    this.frame.position.set(lerp(-1.2, 1.2, TL.span(t, f0, shot.t[1])), 0, 0);
    this.fields.forEach((f, i) => {
      const a = ease.back(clamp(open * 1.6 - i * 0.15));
      f.g.position.x = f.x0 * a; f.g.scale.setScalar(clamp(a, 0.01, 1.2));
      f.g.visible = a > 0.02;
      if (f.hot) {
        const pulse = TL.kick(t);
        f.box.material.color.copy(hdr('employee', 3 + 3 * pulse + 3 * ipOff));
        f.face.material.color.copy(hdr('employee', 0.4 + 0.5 * pulse + 0.4 * ipOff));
      } else if (f.payload) {
        f.val.material.map.offset.x = t * 0.08;
        f.ip.material.color.copy(hdr(PAL.text, 1.6 * (1 - 0.85 * ipOff)));
        f.ip.material.opacity = 1 - 0.8 * ipOff;
      } else {
        f.box.material.color.copy(hdr('#6f8fa6', 1.4 * (1 - 0.5 * ipOff)));
      }
    });
  }

  // dust (slow parallax) and speed lines (tunnel around the view axis, flying towards the camera)
  updatePoints(t, streak, speed, dust, shot) {
    const P = this.pts; P.begin();
    const dc = lin3('employee', 1.2);
    for (let i = 0; i < 260; i++) {
      const x = (hash(i, 1) - 0.5) * 40, y = (hash(i, 2) - 0.5) * 24, z = -30 + hash(i, 3) * 34;
      const tw = 0.5 + 0.5 * Math.sin(t * (0.6 + hash(i, 4)) + i);
      P.add(V(x + Math.sin(t * 0.1 + i) * 0.3, y + Math.cos(t * 0.13 + i) * 0.3, z), 0.015 + 0.025 * hash(i, 5), dc, 0.22 * dust * tw);
    }
    if (streak > 0.01) {
      const cols = shot.lvl >= 2 ? GROUPS.slice(0, 4).map((g) => lin3(g.key, 3)) : [lin3('employee', 3)];
      const L = 80;
      for (let i = 0; i < 520; i++) {
        const ang = hash(i, 7) * Math.PI * 2, rad = 3.2 + hash(i, 8) * 14;
        const z = -70 + ((t * speed * (0.6 + 0.8 * hash(i, 9)) + hash(i, 10) * L) % L);
        const len = 0.4 + speed * 0.08;
        const a = streak * clamp((z + 70) / 20) * clamp((12 - z) / 6) * (0.4 + 0.6 * hash(i, 11));
        P.add(V(Math.cos(ang) * rad, Math.sin(ang) * rad * 0.62, z), 0.025 + 0.02 * hash(i, 12), cols[i % cols.length], a, V(0, 0, len));
      }
    }
    P.end();
  }

  camera(shot, tl) {
    const TL = this.tl, t = shot.t[0] + tl, mode = shot.mode;
    let pos, target = V(0, 0, 0), fov = 38;
    if (mode === 'tag') {
      const k = ease.inOut(tl / (shot.t[1] - shot.t[0]));
      pos = V(lerp(2.2, 0.6, k), lerp(1.4, 0.5, k), lerp(8.5, 5.4, k));
    } else if (mode === 'ip') {
      const a = -0.5 + tl * 0.09;
      const close = smooth(TL.span(t, TL.seg(13).start, TL.seg(13).start + 1.2)); // "Der SGT zeigt …" → closer to the band
      pos = V(Math.sin(a) * lerp(6.4, 4.2, close), lerp(-0.9, 0.9, close), Math.cos(a) * lerp(6.4, 4.2, close));
      target = V(0, lerp(-0.7, 0.1, close), 0);
    } else if (mode === 'stamps') {
      // step zoom: every stamp pushes the camera a bit closer, a fast pull back into the drop
      const steps = [14, 15, 16, 17].reduce((s, id) => s + ease.out((t - TL.seg(id).start) / 0.3), 0);
      const pull = ease.in(TL.span(t, shot.t[1] - 1.7, shot.t[1]));
      const d = 9.6 - steps * 0.7 + pull * 5;
      pos = V(0.4, 0.25, d); fov = 38 + pull * 6;
    } else if (mode === 'hook') {
      const lvl = shot.lvl || 1, yaw = this.barSwing(t, 0.45 + 0.1 * lvl, 11), pitch = this.barSwing(t, 0.18, 12);
      let d = 5.6 - 0.3 * lvl;
      if (lvl === 2 && t < this.impactOf(shot)) d = lerp(11, 5.4, ease.in(TL.span(t, shot.t[0], this.impactOf(shot))));
      pos = V(Math.sin(yaw) * d, Math.sin(pitch) * d, Math.cos(yaw) * d);
      fov = 40 + (lvl === 3 ? 4 : 0);
    } else if (mode === 'inline') {
      const x = lerp(-1.2, 1.2, tl / (shot.t[1] - shot.t[0]));
      const push = ease.inOut(TL.span(t, TL.seg(29).start - 0.3, TL.seg(29).start + 1.4));
      const cmdX = x - 0.1; // CMD field sits just left of the frame centre
      pos = V(lerp(x + 1.5 - tl * 0.2, cmdX + 1.0, push), lerp(1.6, 0.9, push), lerp(11.5 - tl * 0.25, 5.2, push));
      target = V(lerp(x, cmdX + 0.6, push), 0, 0); fov = 40;
    } else {
      pos = V(Math.sin(tl * 0.05) * 8, 1.2, Math.cos(tl * 0.05) * 8 + tl * 0.3); target = V(0, 2.3, 0); fov = 36;
    }
    return { pos, target, fov };
  }
}
