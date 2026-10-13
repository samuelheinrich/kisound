"""Build an editable .blend master from a recipe. --update keeps hand edits, --prune drops removed parts.

Carried over from the level pipeline's build_level.py: the recipe loop, the material table, the
_generated_signature idempotency and the backup-on-update. The road/roof/stair/vehicle logic is gone;
what replaces it is the part list below, which is what network hardware actually needs — chamfered
boxes, arrayed port cages, cylinders and named anchors.

    blender --background --python build_set.py -- recipes/port-macro.recipe.json [--update] [--prune]
"""
import argparse
import json
import math
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import arguments, collections, signature   # noqa: E402

parser = argparse.ArgumentParser()
parser.add_argument('recipe')
parser.add_argument('--update', action='store_true')
parser.add_argument('--prune', action='store_true', help='On --update, remove parts deleted from the recipe if unedited.')
args = parser.parse_args(arguments())
if args.prune and not args.update:
    raise RuntimeError('--prune requires --update and its automatic backup.')

recipe_path = Path(args.recipe).resolve()
recipe = json.loads(recipe_path.read_text())
master = recipe_path.parent / (recipe['id'] + '.blend')
if master.exists():
    if not args.update:
        raise RuntimeError('Master already exists. Open it in Blender, or use --update (backup + preserve edits).')
    backup = master.parent / 'backups' / (master.stem + '-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S') + '.blend')
    backup.parent.mkdir(exist_ok=True)
    shutil.copy2(master, backup)
    bpy.ops.wm.open_mainfile(filepath=str(master))
else:
    bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene['set_id'] = recipe['id']
scene['budget_tris'] = recipe.get('budgetTris', 400000)
scene['pipeline_version'] = 1
scene['blender_version'] = bpy.app.version_string
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1
cols = collections()

materials = {}
for name, spec in recipe['materials'].items():
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = mat.node_tree.nodes.get('Principled BSDF')
    col = spec['color'] if isinstance(spec, dict) else spec
    node.inputs['Base Color'].default_value = (*col, 1)
    node.inputs['Roughness'].default_value = (spec.get('roughness', 0.6) if isinstance(spec, dict) else 0.6)
    node.inputs['Metallic'].default_value = (spec.get('metallic', 0.0) if isinstance(spec, dict) else 0.0)
    if isinstance(spec, dict) and spec.get('emission'):
        node.inputs['Emission Color'].default_value = (*spec['emission'], 1)
        node.inputs['Emission Strength'].default_value = spec.get('emissionStrength', 1.0)
    mat.diffuse_color = (*col, 1)
    materials[name] = mat


def mesh_object(name, verts, faces, material, collection):
    mesh = bpy.data.meshes.new(name + '_mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    mesh.materials.append(materials[material])
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    return obj


def box(name, size, location, material, collection, bevel=0.0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = Vector(size)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(materials[material])
    for c in obj.users_collection:
        c.objects.unlink(obj)
    collection.objects.link(obj)
    if bevel > 0:
        mod = obj.modifiers.new('bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
        mod.limit_method = 'ANGLE'
    return obj


def cylinder(name, radius, depth, location, material, collection, rotation=(0, 0, 0), verts=24):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=location, rotation=rotation, vertices=verts)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(materials[material])
    for c in obj.users_collection:
        c.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def anchor(name, location, collection, rotation=(0, 0, 0), extra=None):
    empty = bpy.data.objects.new('ANCH_' + name, None)
    empty.empty_display_type = 'ARROWS'
    empty.empty_display_size = 0.01
    empty.location = location
    empty.rotation_euler = rotation
    for k, v in (extra or {}).items():
        empty[k] = v
    collection.objects.link(empty)
    return empty


def sphere(name, radius, location, material, collection, segments=20, rings=12, cut=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=location, segments=segments, ring_count=rings)
    obj = bpy.context.object
    obj.name = name
    if cut is not None:   # a dome: drop every vertex below the cut plane onto it
        for v in obj.data.vertices:
            if v.co.z < cut:
                v.co.z = cut
    obj.data.materials.append(materials[material])
    for c in obj.users_collection:
        c.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def torus(name, major, minor, location, material, collection, rotation=(0, 0, 0), seg=32, rseg=10):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, location=location,
                                     rotation=rotation, major_segments=seg, minor_segments=rseg)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(materials[material])
    for c in obj.users_collection:
        c.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


BUILDERS = {}


def builder(kind):
    def wrap(fn):
        BUILDERS[kind] = fn
        return fn
    return wrap


@builder('box')
def _box(spec, cols):
    return [box('GEO_' + spec['id'], spec['size'], spec.get('at', (0, 0, 0)), spec['material'], cols['GEO'],
                bevel=spec.get('bevel', 0), rotation=spec.get('rotation', (0, 0, 0)))]


@builder('cylinder')
def _cyl(spec, cols):
    return [cylinder('GEO_' + spec['id'], spec['radius'], spec['depth'], spec.get('at', (0, 0, 0)),
                     spec['material'], cols['GEO'], rotation=spec.get('rotation', (0, 0, 0)),
                     verts=spec.get('verts', 24))]


@builder('portRow')
def _port_row(spec, cols):
    """A row of RJ45 cages, each a HOLLOW shell — four walls and a back plate, open to the front.

    This is why the video uses Blender at all. A solid box with a darker lid reads as a box; a real
    cage with chamfered walls has an interior you can look into and see the contacts, which is the
    whole point of the hop-1 macro shot. Each port gets an anchor and an LED anchor, so the zone code
    never hardcodes a port coordinate.
    """
    made = []
    n, pitch = spec['count'], spec['pitch']
    w, d, h = spec['cage']
    at = spec.get('at', (0, 0, 0))
    x0 = at[0] - (n - 1) * pitch / 2
    y0, z0 = at[1], at[2]
    wall = spec.get('wall', min(w, h) * 0.12)
    bevel = spec.get('bevel', wall * 0.35)
    rows = spec.get('rows', 1)
    for r in range(rows):
        for i in range(n):
            x = x0 + i * pitch
            z = z0 + r * spec.get('rowPitch', h * 1.6)
            idx = r * n + i + 1
            tag = f'{spec["id"]}_{idx:02}'
            # four walls, open towards -Y (the camera side), plus a back plate
            made += [
                box(f'GEO_{tag}_l', (wall, d, h), (x - w / 2 + wall / 2, y0, z), spec['material'], cols['GEO'], bevel=bevel),
                box(f'GEO_{tag}_r', (wall, d, h), (x + w / 2 - wall / 2, y0, z), spec['material'], cols['GEO'], bevel=bevel),
                box(f'GEO_{tag}_t', (w, d, wall), (x, y0, z + h / 2 - wall / 2), spec['material'], cols['GEO'], bevel=bevel),
                box(f'GEO_{tag}_b', (w, d, wall), (x, y0, z - h / 2 + wall / 2), spec['material'], cols['GEO'], bevel=bevel),
                box(f'GEO_{tag}_back', (w - 2 * wall, wall, h - 2 * wall), (x, y0 + d / 2 - wall / 2, z),
                    spec.get('innerMaterial', spec['material']), cols['GEO']),
            ]
            anchor(f'{spec["id"]}.port.{idx:02}', (x, y0 - d / 2, z), cols['ANCHORS'], extra={'port': idx})
            anchor(f'{spec["id"]}.led.{idx:02}', (x - w * 0.3, y0 - d / 2, z + h * 0.62), cols['ANCHORS'], extra={'port': idx, 'led': True})
            anchor(f'{spec["id"]}.throat.{idx:02}', (x, y0 + d / 2 - wall, z), cols['ANCHORS'], extra={'port': idx, 'throat': True})
    return made


@builder('sphere')
def _sphere(spec, cols):
    return [sphere('GEO_' + spec['id'], spec['radius'], spec.get('at', (0, 0, 0)), spec['material'], cols['GEO'],
                   segments=spec.get('segments', 20), rings=spec.get('rings', 12), cut=spec.get('cut'))]


@builder('torus')
def _torus(spec, cols):
    return [torus('GEO_' + spec['id'], spec['major'], spec['minor'], spec.get('at', (0, 0, 0)),
                  spec['material'], cols['GEO'], rotation=spec.get('rotation', (0, 0, 0)),
                  seg=spec.get('segments', 32))]


@builder('grid')
def _grid(spec, cols):
    """A 2D field of boxes — keycaps, windows, floor tiles, rack units."""
    made = []
    nx, ny = spec['count']
    px, py = spec['pitch']
    plane = spec.get('plane', 'xz')
    ax = {'xz': (0, 2), 'xy': (0, 1), 'yz': (1, 2)}[plane]
    base = list(spec.get('at', (0, 0, 0)))
    base[ax[0]] -= (nx - 1) * px / 2
    base[ax[1]] -= (ny - 1) * py / 2
    skip = set(tuple(v) for v in spec.get('skip', []))
    for j in range(ny):
        for i in range(nx):
            if (i, j) in skip:
                continue
            at = list(base)
            at[ax[0]] += i * px
            at[ax[1]] += j * py
            made.append(box(f'GEO_{spec["id"]}_{j:02}_{i:02}', spec['size'], at, spec['material'],
                            cols['GEO'], bevel=spec.get('bevel', 0)))
    return made


@builder('array')
def _array(spec, cols):
    """N copies of a box along one axis — contacts, keycaps, rack units, windows."""
    made = []
    n, pitch = spec['count'], spec['pitch']
    ax = {'x': 0, 'y': 1, 'z': 2}[spec.get('axis', 'x')]
    base = list(spec.get('at', (0, 0, 0)))
    base[ax] -= (n - 1) * pitch / 2
    for i in range(n):
        at = list(base)
        at[ax] += i * pitch
        made.append(box(f'GEO_{spec["id"]}_{i:02}', spec['size'], at, spec['material'], cols['GEO'],
                        bevel=spec.get('bevel', 0), rotation=spec.get('rotation', (0, 0, 0))))
        if spec.get('anchor'):
            anchor(f'{spec["id"]}.{i + 1:02}', at, cols['ANCHORS'], extra={'index': i + 1})
    return made


@builder('anchor')
def _anchor(spec, cols):
    anchor(spec['id'], spec.get('at', (0, 0, 0)), cols['ANCHORS'],
           rotation=spec.get('rotation', (0, 0, 0)), extra=spec.get('props'))
    return []


@builder('path')
def _path(spec, cols):
    for i, p in enumerate(spec['points']):
        anchor(f'{spec["id"]}.{i:02}', p, cols['ANCHORS'], extra={'path': spec['id'], 'index': i})
    return []


preserved = []
if args.prune:
    wanted = {s['id'] for s in recipe['parts']}
    for obj in list(scene.objects):
        rid = obj.get('_recipe_id')
        if rid and rid not in wanted:
            if obj.get('_generated_signature') != signature(obj):
                preserved.append(obj.name)
                continue
            bpy.data.objects.remove(obj, do_unlink=True)

skipped = []
for spec in recipe['parts']:
    existing = [o for o in scene.objects if o.get('_recipe_id') == spec['id']]
    if existing and args.update:
        edited = [o for o in existing if o.get('_generated_signature') != signature(o)]
        if edited:
            skipped.extend(o.name for o in edited)
            continue
        for o in existing:
            bpy.data.objects.remove(o, do_unlink=True)
    elif existing:
        continue
    fn = BUILDERS.get(spec['kind'])
    if fn is None:
        raise RuntimeError(f'unknown part kind: {spec["kind"]}')
    for obj in fn(spec, cols):
        obj['_recipe_id'] = spec['id']
        obj['_generated_signature'] = signature(obj)
    for obj in scene.objects:
        if obj.name.startswith('ANCH_') and '_recipe_id' not in obj:
            obj['_recipe_id'] = spec['id']

tris = sum(len(o.data.loop_triangles) if o.type == 'MESH' and o.data.loop_triangles else
           sum(len(p.vertices) - 2 for p in o.data.polygons) for o in scene.objects if o.type == 'MESH')
bpy.ops.wm.save_as_mainfile(filepath=str(master))
print(json.dumps({'master': str(master), 'objects': len(scene.objects), 'triangles': tris,
                  'budget': scene['budget_tris'], 'skippedEdited': skipped, 'preserved': preserved}, indent=2))
