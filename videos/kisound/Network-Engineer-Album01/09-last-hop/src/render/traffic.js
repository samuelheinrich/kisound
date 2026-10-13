// The other traffic. Our frame is one packet among many, and a hop only reads as a routing decision
// if you can see packets taking the OTHER exits. Each one runs the route for a while, peels off at a
// node towards its own destination, and fades out — or, at the firewall, hits a closed port and bursts.
//
// One InstancedMesh for the slabs, one GlowPoints for the bursts, both pure functions of t.
import * as THREE from 'three';
import { PAL } from './config.js';
import { hash, clamp, V, GlowPoints } from './core.js';
import { FLIGHT, NODE_U } from './route.js';

export class Traffic {
  constructor({ count = 64 } = {}) {
    this.n = count;
    this.group = new THREE.Group();
    this.slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.12, 1.5),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
      count);
    this.slabs.frustumCulled = false;
    this.group.add(this.slabs);
    this.burst = new GlowPoints(count * 6, { sizeAttenuation: true });
    this.burst.mesh.frustumCulled = false;
    this.group.add(this.burst.mesh);
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion();
    this._s = new THREE.Vector3(); this._b = new THREE.Matrix4();
    this.col = new THREE.Color();
  }

  // Where packet i is at time t. It travels a stretch of the route, then branches off at a node.
  // `gate` is the arc fraction of a closed firewall (or null); packets that reach it burst.
  sample(i, t, gate) {
    const period = 7 + 11 * hash(i, 71);
    const ph = ((t / period + hash(i, 72)) % 1 + 1) % 1;
    const uA = 0.04 + 0.78 * hash(i, 73);                 // where it joins
    const branch = NODE_U[1 + Math.floor(hash(i, 74) * (NODE_U.length - 2))];
    const uB = Math.max(uA + 0.02, branch);
    const legFrac = 0.62;                                  // fraction of the cycle spent on the route
    if (ph < legFrac) {
      const u = uA + (uB - uA) * (ph / legFrac);
      if (gate !== null && u >= gate && uA < gate) {
        // blocked: it stops dead at the gate and bursts
        return { u: gate, off: 0, dir: FLIGHT.tangent(gate), burst: clamp((u - gate) / 0.006), alive: 1 };
      }
      return { u, off: 0, dir: FLIGHT.tangent(u), burst: 0, alive: 1 };
    }
    // past its branch node: it leaves on its own heading towards another destination
    const k = (ph - legFrac) / (1 - legFrac);
    const dir = FLIGHT.tangent(uB);
    const side = new THREE.Vector3().crossVectors(V(0, 1, 0), dir).normalize();
    const up = new THREE.Vector3().crossVectors(dir, side).normalize();
    const a = hash(i, 75) * Math.PI * 2;
    const away = side.multiplyScalar(Math.cos(a)).add(up.multiplyScalar(Math.sin(a)))
      .multiplyScalar(0.85).add(dir.clone().multiplyScalar(0.5)).normalize();
    return { u: uB, off: k * (30 + 60 * hash(i, 76)), dir: away, burst: 0, alive: 1 - k * k };
  }

  update(t, { warmth = 0, gain = 1, dim = 1, gate = null, lanes = 1 } = {}) {
    const col = this.col.copy(new THREE.Color(PAL.cyan)).lerp(new THREE.Color(PAL.amber), warmth);
    const m = this._m, q = this._q, s = this._s, b = this._b;
    const f = this.burst; f.begin();
    const live = Math.round(this.n * clamp(lanes));
    for (let i = 0; i < this.n; i++) {
      if (i >= live) { m.compose(V(0, -99999, 0), q, s.set(0, 0, 0)); this.slabs.setMatrixAt(i, m); continue; }
      const r = this.sample(i, t, gate);
      const p = FLIGHT.at(r.u).add(r.dir.clone().multiplyScalar(r.off));
      // lateral spread so they are not all on the centre line
      const side = new THREE.Vector3().crossVectors(V(0, 1, 0), r.dir).normalize();
      const up = new THREE.Vector3().crossVectors(r.dir, side).normalize();
      const a = hash(i, 77) * Math.PI * 2, rad = 2.6 + 7 * hash(i, 78);
      p.add(side.clone().multiplyScalar(Math.cos(a) * rad)).add(up.clone().multiplyScalar(Math.sin(a) * rad));
      if (r.burst > 0.001) {
        // it hit a closed port: the slab is gone and its pieces fly outwards
        m.compose(V(0, -99999, 0), q, s.set(0, 0, 0)); this.slabs.setMatrixAt(i, m);
        const c3 = [1.8, 0.35, 0.3];
        for (let k = 0; k < 6; k++) {
          const d = V(hash(i, 80 + k) - 0.5, hash(i, 86 + k) - 0.5, hash(i, 92 + k) - 0.5).normalize();
          f.add(p.clone().add(d.clone().multiplyScalar(r.burst * 3.4)), 0.10, c3, (1 - r.burst) * 0.9 * gain * dim, d.multiplyScalar(1.6));
        }
        continue;
      }
      b.makeBasis(side.negate(), up, r.dir.clone().negate());
      q.setFromRotationMatrix(b);
      s.set(1, 1, 1 + 1.1 * hash(i, 79));
      m.compose(p, q, s);
      this.slabs.setMatrixAt(i, m);
    }
    f.end();
    this.slabs.instanceMatrix.needsUpdate = true;
    this.slabs.material.color.copy(col);
    this.slabs.material.opacity = 0.26 * gain * dim;
  }
}
