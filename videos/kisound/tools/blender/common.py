"""Scene contract for the kisound video sets: authoring Z-up in Blender, export Y-up for three.js.

Carried over from the globivonnairobi level pipeline, with one deliberate difference: that project
targets Babylon, whose GLTF AUTO mode mirrors X into a left-handed system, so it carried a BASIS
matrix to compensate. three.js is right-handed Y-up exactly like glTF itself, so there is NO basis
here — `export_scene.gltf(export_yup=True)` is the whole conversion. Copying that matrix across
would mirror every asset.
"""
import hashlib
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix

ROOT = Path(__file__).resolve().parents[2]          # videos/kisound
# Blender Z-up -> glTF / three.js Y-up: (x, y, z) -> (x, z, -y). This is a rotation, NOT a mirror —
# that is the whole difference to the Babylon pipeline this was carried over from.
BASIS = Matrix(((1, 0, 0), (0, 0, 1), (0, -1, 0)))
# An anchor's facing axis is its local +Z in Blender. Under BASIS that axis becomes local +Y, while
# every three.js object that has a facing direction (a plane's normal, a camera's lens) uses local
# +Z. FORWARD folds that quarter turn into the exported quaternion, so an anchor can be applied
# straight to a three.js object with no correction at the use site.
FORWARD = Matrix.Rotation(math.radians(-90), 3, 'X')
COLLECTIONS = ('GEO', 'ANCHORS', 'EXPORT', 'DEBUG')


def arguments():
    return sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')


def native(value):
    if hasattr(value, 'to_dict'):
        return {k: native(v) for k, v in value.to_dict().items()}
    if hasattr(value, 'to_list'):
        return [native(v) for v in value.to_list()]
    if isinstance(value, (list, tuple)):
        return [native(v) for v in value]
    return value


def props(obj):
    return {k: native(v) for k, v in obj.items() if not k.startswith('_')}


def point(vec):
    """Blender Z-up -> glTF/three.js Y-up. Matches export_yup=True; no handedness flip."""
    return [round(vec[0], 6), round(vec[2], 6), round(-vec[1], 6)]


def orientation(rot):
    """A rotation under a change of basis is C * R * C^-1, not a swap of quaternion components.

    Swapping them the way `point` swaps position components looks right and is wrong. Conjugate
    through BASIS, then apply FORWARD so the result can be handed to a three.js object directly —
    without it a screen anchor produces a plane lying flat instead of standing upright.
    """
    m = (BASIS @ rot.to_matrix() @ BASIS.inverted()) @ FORWARD
    q = m.to_quaternion()
    return [round(q.x, 6), round(q.y, 6), round(q.z, 6), round(q.w, 6)]


def bounds(obj):
    verts = [obj.matrix_world @ __import__('mathutils').Vector(v) for v in obj.bound_box]
    return ([min(v[i] for v in verts) for i in range(3)],
            [max(v[i] for v in verts) for i in range(3)])


def signature(obj):
    """Content hash: lets a rebuild keep hand edits and lets the build skip unchanged objects."""
    state = {'matrix': [round(v, 6) for row in obj.matrix_world for v in row],
             'props': props(obj),
             'collections': sorted(c.name for c in obj.users_collection),
             'modifiers': [(m.name, m.type) for m in obj.modifiers]}
    if obj.type == 'MESH':
        state['vertices'] = [[round(v, 6) for v in p.co] for p in obj.data.vertices]
        state['faces'] = [list(p.vertices) for p in obj.data.polygons]
        state['materials'] = [m.name if m else '' for m in obj.data.materials]
    return hashlib.sha256(json.dumps(state, sort_keys=True).encode()).hexdigest()


def collections():
    scene = bpy.context.scene
    root_name = scene.get('set_id', 'SET')
    root = bpy.data.collections.get(root_name)
    if root is None:
        root = bpy.data.collections.new(root_name)
        scene.collection.children.link(root)
    out = {}
    for name in COLLECTIONS:
        col = bpy.data.collections.get(name) or bpy.data.collections.new(name)
        if col.name not in root.children:
            root.children.link(col)
        out[name] = col
    return out


def objects(prefix):
    return sorted((o for o in bpy.context.scene.objects if o.name.startswith(prefix)), key=lambda o: o.name)


def anchor_record(obj):
    """An anchor is a named point on the geometry the film can attach to.

    This replaces the level pipeline's collider_record: the video never needs collision, it needs
    'where is port 24', 'where does the camera sit for the macro shot', 'what path does the frame fly'.
    Zone code then says anchor('acc-sw-01.port.24') instead of guessing coordinates.
    """
    loc, rot, scale = obj.matrix_world.decompose()
    return {
        'id': obj.name[5:] if obj.name.startswith('ANCH_') else obj.name,
        'position': point(loc),
        'rotation': orientation(rot),
        'scale': [round(abs(scale.x), 6), round(abs(scale.z), 6), round(abs(scale.y), 6)],
        **props(obj),
    }


def set_paths():
    if not bpy.data.filepath:
        raise ValueError('Open the saved set .blend master first.')
    master = Path(bpy.data.filepath)
    set_id = bpy.context.scene.get('set_id')
    if not set_id or master.stem != set_id:
        raise ValueError('Missing set_id, or the master filename does not match set_id.')
    return master.parent, ROOT / 'assets/sets' / set_id


def read_recipe():
    source, _ = set_paths()
    return json.loads((source / f'{bpy.context.scene["set_id"]}.recipe.json').read_text())
