"""Preflight before export: render budgets and the things that silently break a three.js scene.

Slimmed down from the level pipeline's validate_level.py. The SAT face-overlap solver is gone — it
solves a level-design problem (walkable surfaces punching through each other) that a film set does
not have. What is left is cheap, plus budgets, which the level pipeline had no reason to check.
"""
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import objects, read_recipe, write_json, set_paths   # noqa: E402

LIMITS = {'materials': 8, 'objects': 600}


def triangles(obj):
    """Evaluated, not raw: bevels and arrays are modifiers, and the budget has to count what ships."""
    evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    n = len(mesh.loop_triangles)
    evaluated.to_mesh_clear()
    return n


def validate(save=True):
    scene = bpy.context.scene
    recipe = read_recipe()
    geo = [o for o in objects('GEO_') if o.type == 'MESH']
    anchors = objects('ANCH_')
    errors, warnings = [], []

    tris = sum(triangles(o) for o in geo)
    budget = recipe.get('budgetTris', scene.get('budget_tris', 400000))
    if tris > budget:
        errors.append(f'triangle budget blown: {tris} > {budget}')
    elif tris > budget * 0.85:
        warnings.append(f'triangles at {tris}/{budget}, close to the budget')

    mats = {m.name for o in geo for m in o.data.materials if m}
    if len(mats) > LIMITS['materials']:
        errors.append(f'{len(mats)} materials, limit {LIMITS["materials"]} (each one is a draw call per object)')
    if len(geo) > LIMITS['objects']:
        warnings.append(f'{len(geo)} meshes — merge by material on export or the draw calls will hurt')

    for o in geo:
        if not o.data.materials or o.data.materials[0] is None:
            errors.append(f'{o.name} has no material')
        if any(abs(s) < 1e-6 for s in o.scale):
            errors.append(f'{o.name} has a zero scale axis')
        if not o.data.polygons:
            errors.append(f'{o.name} is an empty mesh')

    if not anchors:
        warnings.append('no anchors — the film will have to hardcode coordinates')
    names = [a.name for a in anchors]
    dupes = {n for n in names if names.count(n) > 1}
    if dupes:
        errors.append(f'duplicate anchor names: {sorted(dupes)}')

    # anchors must sit on or near the geometry, otherwise they are a typo, not a landmark
    if geo:
        lo = [min(min((o.matrix_world @ v.co)[i] for v in o.data.vertices) for o in geo) for i in range(3)]
        hi = [max(max((o.matrix_world @ v.co)[i] for v in o.data.vertices) for o in geo) for i in range(3)]
        pad = max(hi[i] - lo[i] for i in range(3)) * 0.5
        for a in anchors:
            # camera stands and flight paths belong outside the geometry by design
            if a.get('path') is not None or a.name.startswith('ANCH_cam.'):
                continue
            p = a.matrix_world.translation
            if any(p[i] < lo[i] - pad or p[i] > hi[i] + pad for i in range(3)):
                warnings.append(f'{a.name} sits far outside the set bounds')

    report = {'setId': scene.get('set_id'), 'status': 'ERROR' if errors else 'WARN' if warnings else 'OK',
              'triangles': tris, 'budget': budget, 'meshes': len(geo), 'anchors': len(anchors),
              'materials': sorted(mats), 'errors': errors, 'warnings': warnings}
    if save:
        _, target = set_paths()
        write_json(target / 'validation.json', report)
    return report


if __name__ == '__main__':
    import json
    r = validate()
    print(json.dumps(r, indent=2))
    if r['status'] == 'ERROR':
        raise SystemExit(1)
