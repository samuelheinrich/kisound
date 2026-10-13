// Animatic zone: a neutral stage every shot can use until its real zone exists. Floor grid scrolling with the
// energy of the track, the packet in the shot's motif colour pulsing on the kick, flows on the floor lanes.
// It shows timing and beat coupling, not the final picture.
import * as THREE from 'three';
import { PAL } from '../config.js';
import { V, hash, clamp, GlowPoints } from '../core.js';
import { Packet } from '../packet.js';

const LANES = 14;

function gridMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(PAL.grid) }, uAcc: { value: new THREE.Color(PAL.employee) }, uScroll: { value: 0 }, uPulse: { value: 0 }, uGain: { value: 1 } },
    transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform vec3 uCol, uAcc; uniform float uScroll, uPulse, uGain; varying vec3 vW;
      float line(float x, float w){ float d = abs(fract(x - 0.5) - 0.5) / fwidth(x); return 1.0 - clamp(d - w, 0.0, 1.0); }
      void main(){
        vec2 p = vec2(vW.x, vW.z + uScroll);
        float minor = max(line(p.x, 0.2), line(p.y, 0.2));
        float major = max(line(p.x / 8.0, 0.6), line(p.y / 8.0, 0.6));
        float dist = length(vW.xz);
        float fade = exp(-dist * 0.035);
        vec3 c = uCol * (0.9 * minor + 2.2 * major) + uAcc * major * uPulse * 2.5;
        gl_FragColor = vec4(c * fade * uGain, 1.0);
      }`,
    blending: THREE.AdditiveBlending,
  });
}

export class SketchZone {
  constructor(ctx) {
    this.tl = ctx.timeline;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(new THREE.Color(PAL.bg), 0.03);
    this.clear = new THREE.Color(PAL.bg).getHex();
    this.speedRef = 12; this.bloom = 0.09;
    this.grid = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), gridMaterial());
    this.grid.rotation.x = -Math.PI / 2; this.scene.add(this.grid);
    this.packets = {};
    this.flows = new GlowPoints(LANES * 3); this.scene.add(this.flows.mesh);
  }
  packet(motif) {
    if (!this.packets[motif]) { const p = new Packet({ color: PAL[motif] || PAL.employee, scale: 0.55 }); this.scene.add(p.group); this.packets[motif] = p; }
    return this.packets[motif];
  }

  update(t, shot, tl) {
    const kick = this.tl.kick(t) * (0.35 + 0.65 * this.tl.env('low', t)), energy = this.tl.env('rms', t);
    const unknown = shot.motif === 'unknown';
    const u = this.grid.material.uniforms;
    // scroll = integral of speed; a closed form keeps it a pure function of t (base speed + beat-locked push)
    const b = this.tl.beat(t).b;
    u.uScroll.value = t * 2.0 + b * 0.8; u.uPulse.value = unknown ? 0 : kick; u.uGain.value = 0.55 + 0.6 * energy;
    u.uAcc.value.set(PAL[shot.motif] || PAL.employee);
    for (const [m, p] of Object.entries(this.packets)) p.group.visible = m === shot.motif;
    const p = this.packet(shot.motif);
    p.group.visible = true;
    // unknown endpoint: jerky, quantised glitch offsets (changes 12× per second, deterministic)
    const gq = Math.floor(t * 12), gl = unknown ? (hash(gq, 7) > 0.7 ? 1 : 0) : 0;
    p.group.position.set(gl * (hash(gq, 1) - 0.5) * 0.5, 1.3 + gl * (hash(gq, 2) - 0.5) * 0.3, 0);
    p.group.scale.setScalar(0.55 * (1 + 0.14 * kick));
    p.set({ t, rings: unknown ? 0 : 1, shell: 1, band: unknown ? 0 : 1, core: unknown ? 0.35 : 0.8 + 0.4 * kick, camPos: null });
    // flows: streaks on the floor lanes running towards the packet, speed follows the energy
    const f = this.flows; f.begin();
    const col = new THREE.Color(PAL[shot.motif] || PAL.employee), c = [col.r * 3, col.g * 3, col.b * 3];
    for (let j = 0; j < LANES; j++) {
      const x = (j - (LANES - 1) / 2) * 2;
      for (let k = 0; k < 2; k++) {
        const z = -60 + ((t * (10 + 14 * energy) + hash(j, k) * 80) % 80);
        f.add(V(x, 0.05, z), 0.07, c, (unknown ? 0.15 : 0.55) * clamp(1 - Math.abs(z) / 60), V(0, 0, 3.5));
      }
    }
    f.end();
  }

  // slow orbit around the packet; start angle, radius and height vary per shot so the cuts read as cuts
  camera(shot, tl, index) {
    const a = hash(index, 3) * Math.PI * 2 + tl * 0.12, r = 7 + 2 * hash(index, 4), h = 1.6 + 2.2 * hash(index, 5);
    return { pos: V(Math.sin(a) * r, h, Math.cos(a) * r), target: V(0, 1.2, 0), fov: 38 };
  }
}
