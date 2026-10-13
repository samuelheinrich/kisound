// Loads the Blender sets: a GLB plus its anchors sidecar, both produced by videos/kisound/tools/blender.
//
// The anchors are the point of the whole detour through Blender. Zone code asks for
// `sets.at('port-macro', 'jack.port.01')` instead of guessing a coordinate, so when the model moves
// the film follows automatically. Camera stands travel the same way: `sets.cam('port-macro', 'macro')`.
//
// Everything is loaded once, before the first frame. Nothing here runs per frame, so the "every frame
// is a pure function of t" rule is untouched.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

function decorate(root, meta) {
  const anchors = new Map();
  for (const [id, a] of Object.entries(meta.anchors || {})) {
    anchors.set(id, {
      pos: new THREE.Vector3(...a.position),
      quat: new THREE.Quaternion(...a.rotation),
      scale: new THREE.Vector3(...(a.scale || [1, 1, 1])),
      props: a,
    });
  }
  // paths arrive as `<name>.00`, `<name>.01`, … — collect them into ordered point lists
  const paths = new Map();
  for (const [id, a] of anchors) {
    const m = /^(.+)\.(\d+)$/.exec(id);
    if (!m || a.props.index === undefined) continue;
    if (!paths.has(m[1])) paths.set(m[1], []);
    paths.get(m[1])[a.props.index] = a.pos;
  }
  root.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.castShadow = false; o.receiveShadow = false; } });
  return { root, meta, anchors, paths };
}

export class SetLibrary {
  constructor() { this.sets = new Map(); }

  async load(ids, base = 'assets/sets') {
    await Promise.all(ids.map(async (id) => {
      const metaRes = await fetch(`${base}/${id}/${id}.anchors.json`);
      if (!metaRes.ok) throw new Error(`Set "${id}" fehlt – zuerst tools/blender/export_set.py laufen lassen`);
      const meta = await metaRes.json();
      const gltf = await loader.loadAsync(`${base}/${id}/${meta.glb}`);
      this.sets.set(id, decorate(gltf.scene, meta));
    }));
    return this;
  }

  get(id) {
    const s = this.sets.get(id);
    if (!s) throw new Error(`Set "${id}" nicht geladen`);
    return s;
  }
  // a fresh instance of the set's geometry (materials are shared, so this is cheap)
  instance(id) { return this.get(id).root.clone(true); }

  at(id, anchor) {
    const a = this.get(id).anchors.get(anchor);
    if (!a) throw new Error(`Anker "${anchor}" fehlt in Set "${id}"`);
    return a.pos.clone();
  }
  anchor(id, name) { return this.get(id).anchors.get(name); }
  path(id, name) { return (this.get(id).paths.get(name) || []).map((p) => p.clone()); }
  // camera stands authored on the model: { pos, fov, look }
  cam(id, name) {
    const a = this.anchor(id, `cam.${name}`);
    if (!a) throw new Error(`Kamerastand "cam.${name}" fehlt in Set "${id}"`);
    return { pos: a.pos.clone(), fov: a.props.fov || 40, look: a.props.look };
  }
  // every anchor whose id matches a prefix, in id order – e.g. all of a switch's ports
  group(id, prefix) {
    return [...this.get(id).anchors.entries()]
      .filter(([k]) => k.startsWith(prefix))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({ id: k, ...v }));
  }
}
