"""Export the saved master to GLB + an anchors sidecar for three.js. Never writes the master.

    blender --background <set>.blend --python export_set.py

Two things are carried over from the level pipeline's export_level.py because they matter just as
much here: the validation gate before writing anything, and merging render meshes per material —
that is what keeps the draw-call count survivable when the film loads several sets at once.

The sidecar is the part that changed: instead of doors and spawn points it carries anchors, which is
what a camera and a flying frame need.
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import set_paths, read_recipe, objects, anchor_record, point, write_json   # noqa: E402
from validate_set import validate   # noqa: E402

report = validate()
if report['status'] == 'ERROR':
    raise RuntimeError('Export stopped, fix the validation errors first:\n  ' + '\n  '.join(report['errors']))

source, target = set_paths()
recipe = read_recipe()
set_id = recipe['id']
target.mkdir(parents=True, exist_ok=True)

geo = [o for o in objects('GEO_') if o.type == 'MESH']
export_geo = geo
if recipe.get('mergeByMaterial', True):
    groups = defaultdict(list)
    for obj in geo:
        groups[obj.data.materials[0].name].append(obj)
    export_geo = []
    depsgraph = bpy.context.evaluated_depsgraph_get()
    for index, (material_name, members) in enumerate(sorted(groups.items())):
        verts, faces = [], []
        for member in members:
            # evaluated, not member.data: the raw mesh has no bevels, and the chamfers are most of
            # the reason this geometry comes from Blender at all.
            evaluated = member.evaluated_get(depsgraph)
            mesh = evaluated.to_mesh()
            start = len(verts)
            verts.extend(tuple(member.matrix_world @ v.co) for v in mesh.vertices)
            faces.extend(tuple(start + i for i in face.vertices) for face in mesh.polygons)
            evaluated.to_mesh_clear()
        name = f'GEO_EXPORT_{index:02}_{material_name}'
        mesh = bpy.data.meshes.new(name + '_mesh')
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        mesh.materials.append(bpy.data.materials[material_name])
        merged = bpy.data.objects.new(name, mesh)
        bpy.context.scene.collection.objects.link(merged)
        export_geo.append(merged)

bpy.ops.object.select_all(action='DESELECT')
for obj in export_geo:
    obj.hide_set(False)
    obj.select_set(True)
glb = target / f'{set_id}.glb'
# export_yup=True is the whole coordinate conversion for three.js — see the note in common.py
bpy.ops.export_scene.gltf(filepath=str(glb), export_format='GLB', use_selection=True,
                          export_animations=False, export_cameras=False, export_lights=False,
                          export_extras=False, export_yup=True)

anchors = {}
for a in objects('ANCH_'):
    rec = anchor_record(a)
    anchors[rec.pop('id')] = rec

lo = [min(min((o.matrix_world @ v.co)[i] for v in o.data.vertices) for o in geo) for i in range(3)]
hi = [max(max((o.matrix_world @ v.co)[i] for v in o.data.vertices) for o in geo) for i in range(3)]
# point() negates Y on its way to Y-up, which flips that axis's ordering — re-sort after converting
plo, phi = point(lo), point(hi)
plo, phi = [min(a, b) for a, b in zip(plo, phi)], [max(a, b) for a, b in zip(plo, phi)]
meta = {
    'schemaVersion': 1, 'setId': set_id, 'units': 'metres', 'coordinateSystem': 'gltf-right-handed-y-up',
    'glb': glb.name, 'triangles': report['triangles'], 'meshes': len(export_geo),
    'materials': report['materials'],
    'bounds': {'min': plo, 'max': phi},
    'anchors': anchors,
}
write_json(target / f'{set_id}.anchors.json', meta)
print(json.dumps({'glb': str(glb), 'anchors': len(anchors), 'triangles': report['triangles'],
                  'meshes': len(export_geo), 'status': report['status'], 'warnings': report['warnings']}, indent=2))
