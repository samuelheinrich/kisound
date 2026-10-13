// Orchestrator: picks the shot for time t, updates its zone, renders it through the HDR post pipeline
// (transition flashes and fades, kick punch, camera shake, glitch, saturation, motion blur), then draws the text layer.
import * as THREE from 'three';
import { FPS, DURATION, TRANS, QUALITY, PAL } from './config.js';
import { snapShots } from './timeline.js';
import { makePost, clamp } from './core.js';
import { noise1 } from './world.js';
import { TextOverlay } from './overlay/text.js';
import { CyberZone } from './zones/cyber.js';
import { CosmosZone, cosmosPov, ROOM_ONLY } from './zones/cosmos.js';

const lin = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };
class VoidZone { constructor() { this.scene = new THREE.Scene(); this.exposure = 0; } update() {} camera() { return { pos: new THREE.Vector3(0, 0, 5), target: new THREE.Vector3() }; } }

export class Film {
  constructor({ renderer, width, height, overlay, timeline, env, sets, animatic = false }) {
    this.renderer = renderer; this.W = width; this.H = height; this.tl = timeline;
    this.shots = snapShots(timeline);
    // the voyage runs in the cosmos; only the room at the end stays in the original stage
    for (const s of this.shots) { s.zone = ROOM_ONLY.includes(s.mode) ? 'sketch' : 'cosmos'; s.pov = cosmosPov(s); }
    const ctx = { W: width, H: height, timeline, env, sets, shots: this.shots };
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 800);
    this.zones = {
      sketch: new CyberZone(ctx), cosmos: new CosmosZone(ctx), void: new VoidZone(),
    };
    this.post = makePost(renderer, width, height);
    this.text = new TextOverlay({ canvas: overlay, timeline, shots: this.shots, animatic });
  }

  shotAt(t) {
    let i = this.shots.findIndex((s) => t >= s.t[0] && t < s.t[1]);
    if (i < 0) i = t < 0 ? 0 : this.shots.length - 1;
    return { shot: this.shots[i], index: i };
  }
  // flash around 'dive'/'snap'/'turn' cuts, black dip around 'fade' cuts, plus film fade-in
  transAt(t) {
    let flash = 0, black = 0, flashShot = null;
    for (let i = 1; i < this.shots.length; i++) {
      const s = this.shots[i], tr = TRANS[s.in || 'cut'], d = t - s.t[0];
      const k = d < 0 ? (d > -tr.pre ? (1 + d / tr.pre) ** 2 : 0) : d < tr.post ? (1 - d / tr.post) ** 2 : 0;
      if ((tr.flash || 0) * k > flash) { flash = tr.flash * k; flashShot = s; }
      black = Math.max(black, (tr.black || 0) * k);
    }
    black = Math.max(black, 1 - clamp(t / 1.5));                  // film fade-in
    black = Math.max(black, clamp((t - (DURATION - 4.7)) / 4.0));  // fade to black on the audio tail
    return { flash, black, flashShot };
  }

  render(t, mb = 1) {
    const n = Math.max(1, mb);
    for (let i = 0; i < n; i++) {
      const ts = n === 1 ? t : clamp(t + ((i + 0.5) / n - 0.5) * QUALITY.shutter, 0, DURATION - 1e-4);
      const { shot, index } = this.shotAt(ts);
      const zone = this.zones[shot.zone];
      const tl = ts - shot.t[0];
      zone.fx = {};
      zone.update(ts, shot, tl, index);
      const c = zone.camera(shot, tl, index), cam = this.camera;
      // energy-scaled kick punch (FOV + exposure) and low-frequency shake relative to the framing distance
      const e = shot.e ?? 0.5, kick = this.tl.kick(ts) * (0.4 + 0.6 * this.tl.env('low', ts)) * (zone.fx.punch ?? 1);
      const dist = c.pos.distanceTo(c.target), sh = dist * 0.006 * e * (0.3 + this.tl.env('low', ts)) * (zone.fx.shake ?? 1);
      const pos = c.pos.clone().add(new THREE.Vector3(noise1(ts * 2.3, 1) * sh, noise1(ts * 2.9, 2) * sh, noise1(ts * 2.1, 3) * sh));
      cam.position.copy(pos); cam.up.copy(c.up || new THREE.Vector3(0, 1, 0)); cam.lookAt(c.target);
      cam.fov = (c.fov || 40) * (1 - 0.045 * kick * e); cam.near = zone.near ?? 0.05; cam.far = zone.far ?? 800; cam.updateProjectionMatrix();
      const c2 = zone.camera(shot, Math.min(tl + 1 / FPS, shot.t[1] - shot.t[0]), index);
      const speed = c2.pos.distanceTo(c.pos) * FPS / (zone.speedRef ?? 1);
      const { flash, black, flashShot } = this.transAt(ts);
      this.post.render(zone.scene, cam, i, n, {
        exposure: (zone.exposure ?? 1) * (zone.fx.exposure ?? 1) * (1 + 0.14 * kick * e) * (1 - black),
        bloom: zone.bloom ?? QUALITY.bloom, bloomThr: zone.bloomThr ?? 1.0,
        flash: flash * (1 - black), flashCol: lin(PAL[(flashShot || shot).motif] || PAL.cyan),
        ca: clamp(speed * 0.25 + kick * e * 0.35 + (zone.fx.ca ?? 0), 0, 1.4), frame: Math.floor(ts * FPS),
        vignette: zone.fx.vignette ?? 0.4, clear: zone.clear ?? 0x000000, sat: zone.fx.sat ?? 1, glitch: zone.fx.glitch ?? 0,
      });
    }
    this.text.draw(t, this.shotAt(t));
  }
}
