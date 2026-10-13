"""Workbench contact sheet of a built set — the QA loop while authoring geometry. Never saves the master.

    blender --background recipes/<set>.blend --python preview_set.py -- out.png [size]

Four orthographic views (front, side, top, three-quarter) tiled into one PNG, with the anchors drawn
as labelled dots so a misplaced anchor is visible instead of only showing up later in the film.
"""
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import arguments, objects   # noqa: E402

args = arguments()
if not args:
    raise SystemExit('Expected: out.png [pixels]')
out = Path(args[0]).resolve()
px = int(args[1]) if len(args) > 1 else 900

geo = [o for o in objects('GEO_') if o.type == 'MESH']
if not geo:
    raise SystemExit('no GEO_ meshes in this master')
lo = Vector([min(min((o.matrix_world @ v.co)[i] for v in o.data.vertices) for o in geo) for i in range(3)])
hi = Vector([max(max((o.matrix_world @ v.co)[i] for v in o.data.vertices) for o in geo) for i in range(3)])
centre = (lo + hi) / 2
extent = max((hi - lo)[i] for i in range(3)) * 1.35

for a in objects('ANCH_'):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=extent * 0.006, location=a.matrix_world.translation)
    bpy.context.object.name = 'TEMP_dot_' + a.name

scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.color_type = 'MATERIAL'
scene.display.shading.light = 'STUDIO'
scene.display.shading.show_cavity = True
scene.render.resolution_x = scene.render.resolution_y = px
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False

cam_data = bpy.data.cameras.new('TEMP_cam')
cam_data.type = 'ORTHO'
cam_data.ortho_scale = extent
cam = bpy.data.objects.new('TEMP_cam', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

VIEWS = {
    'front': ((0, -1, 0), (math.pi / 2, 0, 0)),
    'side': ((1, 0, 0), (math.pi / 2, 0, math.pi / 2)),
    'top': ((0, 0, 1), (0, 0, 0)),
    'quarter': ((0.8, -0.8, 0.6), (math.radians(56), 0, math.radians(45))),
}
written = []
out.parent.mkdir(parents=True, exist_ok=True)
for name, (direction, rot) in VIEWS.items():
    d = Vector(direction).normalized()
    cam.location = centre + d * extent * 3
    cam.rotation_euler = rot
    path = out.parent / f'{out.stem}_{name}.png'
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    written.append(str(path))

print(json.dumps({'views': written, 'bounds': {'min': list(lo), 'max': list(hi)},
                  'anchors': len(objects('ANCH_')), 'masterUnchanged': bpy.data.filepath}, indent=2))
