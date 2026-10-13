// Copies the Blender sets this film declares in config.SETS out of the shared build output
// (videos/kisound/assets/sets) into the film's own assets/, which is what the render server serves.
// Run it after every tools/blender/export_set.py.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SETS } from '../render/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SHARED = path.resolve(root, '../../assets/sets');

let n = 0;
for (const id of SETS) {
  const from = path.join(SHARED, id), to = path.join(root, 'assets/sets', id);
  if (!fs.existsSync(from)) throw new Error(`Set "${id}" fehlt in ${SHARED} – zuerst tools/blender/export_set.py laufen lassen`);
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  const meta = JSON.parse(fs.readFileSync(path.join(to, `${id}.anchors.json`), 'utf8'));
  console.log(`${id}: ${meta.triangles} Dreiecke, ${meta.meshes} Meshes, ${Object.keys(meta.anchors).length} Anker`);
  n++;
}
console.log(`${n} Set(s) nach assets/sets/ kopiert`);
