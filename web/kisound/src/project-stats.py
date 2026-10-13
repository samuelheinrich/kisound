#!/usr/bin/env python3
"""Rebuild the standalone kisound inventory. No third-party Python packages needed."""
import concurrent.futures
import datetime
import json
import os
from pathlib import Path
import re
import subprocess
from collections import defaultdict

WEB = Path(__file__).resolve().parent.parent
CONFIG = json.loads((WEB / "site.config.json").read_text())
ROOTS = {"music": (WEB / CONFIG["sources"]["music"]).resolve(),
         "videos": (WEB / CONFIG["sources"]["videos"]).resolve(), "web": WEB}
CODE = {".js": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript", ".ts": "TypeScript",
        ".tsx": "TypeScript", ".jsx": "JavaScript", ".py": "Python", ".rb": "Ruby",
        ".css": "CSS", ".html": "HTML", ".sh": "Shell", ".bash": "Shell",
        ".glsl": "GLSL", ".vert": "GLSL", ".frag": "GLSL", ".wgsl": "WGSL"}
TYPES = {"Audio": {".wav", ".mp3", ".flac", ".m4a", ".ogg", ".aac"},
         "Video": {".mp4", ".mov", ".webm", ".mkv"},
         "Bilder": {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".exr"},
         "3D-Assets": {".glb", ".gltf", ".blend", ".obj", ".mtl", ".fbx", ".bin"},
         "Schriften": {".ttf", ".otf", ".woff", ".woff2"},
         "Dokumente & Texte": {".md", ".txt", ".rst", ".pdf", ".srt", ".vtt"},
         "Daten & Konfiguration": {".json", ".yml", ".yaml", ".csv", ".xml", ".toml", ".ini", ".lock", ".conf"}}
SCOPES = {"project": "Projektbestand", "generated": "Builds & Exporte", "archive": "Archive & Revisionen",
          "dependencies": "Abhängigkeiten", "cache": "Caches", "git": "Git-Verwaltung", "system": "Systemdateien"}
OUTPUTS = {"projekt-stats.html", "projekt-stats.json"}


def scope_of(parts):
    if ".git" in parts: return "git"
    if any(p in {"node_modules", ".venv", "venv"} for p in parts): return "dependencies"
    if any(p in {"archive", "archives", "backups", "_revisions", "xx_archive"} for p in parts): return "archive"
    if any(p in {".cache", "__pycache__", ".pytest_cache", ".mypy_cache"} for p in parts): return "cache"
    if any(p in {"dist", "output", "outputs", "renders", "tmp", "temp"} or p.startswith("xx_") for p in parts): return "generated"
    if parts[-1] in {".DS_Store", "Thumbs.db"} or parts[-1].startswith("._"): return "system"
    return "project"


def category_of(ext):
    if ext in CODE: return "Code"
    for name, extensions in TYPES.items():
        if ext in extensions: return name
    return "Sonstiges"


def empty():
    return {k: 0 for k in ("files", "bytes", "code_files", "lines", "nonblank", "comment_lines", "sloc", "tests", "definitions", "imports")}


def add(target, record):
    for k in target: target[k] += record.get(k, 0)


def line_stats(text, ext):
    """Physical lines, plus a deliberately conservative comment-line heuristic."""
    lines = text.splitlines()
    nonblank = sum(bool(line.strip()) for line in lines)
    comments = 0
    block = False
    for line in lines:
        s = line.strip()
        if not s: continue
        if ext in {".py", ".rb", ".sh", ".bash"}:
            comments += s.startswith("#")
        elif ext == ".html":
            if block:
                if "-->" in s:
                    block = False
                    comments += not s.split("-->", 1)[1].strip()
                else: comments += 1
            elif s.startswith("<!--"):
                block = "-->" not in s
                comments += block or not s.split("-->", 1)[1].strip()
        else:
            if block:
                if "*/" in s:
                    block = False
                    comments += not s.split("*/", 1)[1].strip()
                else: comments += 1
            elif s.startswith("/*"):
                block = "*/" not in s
                comments += block or not s.split("*/", 1)[1].strip()
            elif s.startswith("//"): comments += 1
    # Counts syntax patterns, not AST nodes or runtime complexity.
    definitions = len(re.findall(r"\b(?:async\s+)?function\s+[\w$]+\s*\(|\b(?:const|let|var)\s+[\w$]+\s*=\s*(?:async\s+)?(?:\([^\n;]*?\)|[\w$]+)\s*=>|^\s*(?:async\s+)?def\s+[\w!?]+", text, re.M))
    imports = len(re.findall(r"^\s*(?:import\s|from\s+\S+\s+import\s|require(?:_relative)?\s)|\brequire\s*\(", text, re.M))
    return dict(lines=len(lines), nonblank=nonblank, comment_lines=comments,
                sloc=nonblank - comments, definitions=definitions, imports=imports)


def probe(audio):
    try:
        out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
             "format=duration:stream=codec_name,sample_rate,channels", "-of", "json", str(audio)], text=True, timeout=20)
        p = json.loads(out)
        return {"seconds": float(p["format"]["duration"]), "streams": p.get("streams", [])}
    except (OSError, subprocess.SubprocessError, ValueError, KeyError) as e:
        return {"seconds": None, "error": type(e).__name__}


def main():
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    tracks, albums, prefixes = {}, [], defaultdict(list)
    published = {a["dir"]: a for a in CONFIG.get("albums", [])}
    for album in sorted(ROOTS["music"].iterdir()):
        if not album.is_dir() or not (album / "album.yml").exists(): continue
        title_match = re.search(r"^album:\s*(.+)$", (album / "album.yml").read_text(), re.M)
        title = title_match.group(1).strip('"\'') if title_match else album.name
        albums.append({"id": album.name, "title": title, "published": bool(published.get(album.name, {}).get("publish"))})
        for folder in sorted(album.iterdir()):
            if not folder.is_dir() or not re.match(r"^\d\d_", folder.name): continue
            number = folder.name[:2]
            key = album.name + "/" + number
            tracks[key] = {"id": key, "album": album.name, "album_title": title, "number": number,
                  "title": folder.name[3:].replace("_", " "), "music_folder": folder.name,
                  "music": empty(), "videos": empty(), "web": empty(), "all": empty(),
                  "generated": empty(), "archive": empty(), "dependencies": empty(), "cache": empty(),
                  "media": defaultdict(int), "finals": [], "video_projects": [], "interactive": False}
            prefixes["music"].append(((album.name, folder.name), key))
            v_album = ROOTS["videos"] / album.name
            if v_album.exists():
                for vf in v_album.iterdir():
                    if vf.is_dir() and re.match(r"^" + number + r"[-_]", vf.name):
                        prefixes["videos"].append(((album.name, vf.name), key))
                        if (vf / "package.json").exists(): tracks[key]["video_projects"].append(vf.name)
            published_album = published.get(album.name, {})
            tracks[key]["interactive"] = number in published_album.get("interactive", {})
    manifest_path = WEB / "dist/build-manifest.json"
    if manifest_path.exists():
        for album in json.loads(manifest_path.read_text()).get("albums", []):
            for track in album.get("tracks", []):
                key = album["dir"] + "/" + track["number"]
                if key in tracks: prefixes["web"].append((("dist", album["slug"], track["slug"]), key))

    components = {name: empty() for name in ROOTS}
    scopes = {name: empty() for name in SCOPES}
    groups, languages = defaultdict(empty), defaultdict(empty)
    project_components = {name: empty() for name in ROOTS}
    files, packages, finals, errors = [], [], [], []
    symlinks = 0
    by_prefix = {c: {prefix: key for prefix, key in entries} for c, entries in prefixes.items()}
    for component, root in ROOTS.items():
        for directory, dirs, names in os.walk(root, followlinks=False, onerror=lambda e: errors.append(type(e).__name__)):
            for d in list(dirs):
                if (Path(directory) / d).is_symlink():
                    dirs.remove(d)
                    symlinks += 1
            for name in names:
                path = Path(directory) / name
                if path.is_symlink():
                    symlinks += 1
                    continue
                rel = path.relative_to(root)
                if component == "web" and rel.as_posix() in OUTPUTS: continue
                try: size = path.stat().st_size
                except OSError as e:
                    errors.append(f"{component}/{rel}: {type(e).__name__}")
                    continue
                scope, ext = scope_of(rel.parts), path.suffix.lower() or "(ohne Endung)"
                category = category_of(ext)
                key = next((by_prefix[component][rel.parts[:n]] for n in (3, 2) if rel.parts[:n] in by_prefix[component]), None)
                # Album delivery folders contain exports named NN_Title.ext.
                if key is None and component == "music" and scope == "generated":
                    numbered = re.match(r"^(\d\d)[-_]", name)
                    candidate = rel.parts[0] + "/" + numbered.group(1) if numbered else None
                    if candidate in tracks: key = candidate
                record = {"path": f"{component}/{rel.as_posix()}", "component": component, "scope": scope,
                          "extension": ext, "category": category, "files": 1, "bytes": size,
                          "track": key, "code_files": int(category == "Code"), "tests": 0}
                if scope == "project" and category == "Code":
                    try: text = path.read_text(encoding="utf-8")
                    except (OSError, UnicodeError) as e:
                        errors.append(f"{component}/{rel}: {type(e).__name__}")
                    else: record.update(line_stats(text, ext))
                    record["tests"] = int(any(p in {"tests", "test", "__tests__"} for p in rel.parts) or bool(re.search(r"(?:^test_|[._-](?:test|spec)[._-])", name)))
                    add(languages[CODE[ext]], record)
                add(components[component], record)
                add(scopes[scope], record)
                add(groups[(component, scope, ext, category)], record)
                if scope == "project":
                    add(project_components[component], record)
                if key:
                    t = tracks[key]
                    if scope == "project":
                        add(t[component], record)
                        add(t["all"], record)
                        t["media"][category] += 1
                    elif scope in t: add(t[scope], record)
                if scope == "project":
                    files.append(record)
                    if name == "package.json":
                        try:
                            package = json.loads(path.read_text())
                            packages.append({"path": record["path"], "name": package.get("name", ""),
                                "dependencies": package.get("dependencies", {}), "devDependencies": package.get("devDependencies", {}),
                                "scripts": package.get("scripts", {})})
                        except (OSError, ValueError): pass
                    if key and component == "music" and name.endswith("_1.0.txt"):
                        text = path.read_text()
                        headers = dict(re.findall(r"^([A-ZÄÖÜ ][A-ZÄÖÜ 0-9]*):\s*([^\n]+)$", text, re.M))
                        # Only genuine final prompts with an existing audio reference count.
                        audio_name = headers.get("RELEASE AUDIO")
                        if audio_name:
                            audio = (path.parent / audio_name).resolve()
                            final = {"track": key, "prompt": record["path"], "language": headers.get("SPRACHE", "nicht angegeben"),
                                     "audio": "music/" + os.path.relpath(audio, ROOTS["music"]), "exists": audio.is_file()}
                            if audio.is_file(): final["_path"] = audio
                            finals.append(final)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        unique = {f["audio"]: f["_path"] for f in finals if "_path" in f}
        measured = dict(zip(unique, pool.map(probe, unique.values())))
    for audio, result in measured.items():
        if "error" in result: errors.append(f"{audio}: ffprobe {result['error']}")
    for final in finals:
        final.pop("_path", None)
        final.update(measured.get(final["audio"], {}))
        tracks[final["track"]]["finals"].append(final)
    own = scopes["project"]
    total = empty()
    for c in components.values(): add(total, c)
    dependency_names = sorted({name for p in packages for name in {**p["dependencies"], **p["devDependencies"]}})
    summary = {"total": total, "project": own, "albums": len(albums), "tracks": len(tracks),
               "final_tracks": sum(any(f["exists"] for f in t["finals"]) for t in tracks.values()),
               "final_recordings": len(unique), "final_seconds": sum(p["seconds"] or 0 for p in measured.values()),
               "video_projects": sum(len(t["video_projects"]) for t in tracks.values()),
               "interactive_tracks": sum(t["interactive"] for t in tracks.values()), "package_manifests": len(packages),
               "direct_dependency_names": len(dependency_names), "symlinks_skipped": symlinks,
               "shared": empty()}
    for record in files:
        if not record["track"]: add(summary["shared"], record)
    data = {"generated_at": now, "summary": summary, "components": components, "project_components": project_components,
            "scopes": scopes, "scope_labels": SCOPES, "albums": albums, "tracks": list(tracks.values()),
            "groups": [{"component": c, "scope": s, "extension": ext, "category": cat, **v}
                       for (c, s, ext, cat), v in sorted(groups.items())],
            "languages": [{"name": name, **v} for name, v in languages.items()],
            "code_files": sorted([f for f in files if f["category"] == "Code"], key=lambda f: f.get("nonblank", 0), reverse=True),
            "largest_files": sorted(files, key=lambda f: f["bytes"], reverse=True)[:30],
            "packages": packages, "dependency_names": dependency_names, "errors": errors,
            "roots": {"music": "music/kisound", "videos": "videos/kisound", "web": "web/kisound"}}
    raw = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    (WEB / "projekt-stats.json").write_text(raw + "\n")
    # Inline data keeps the report usable when opened directly with file://.
    safe = raw.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    template = (WEB / "src/project-stats.template.html").read_text()
    (WEB / "projekt-stats.html").write_text(template.replace("__PROJECT_STATS_DATA__", safe))
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    print(f"Report: {WEB / 'projekt-stats.html'}")
    if errors: print(f"Unreadable files or scan errors: {len(errors)}")


if __name__ == "__main__":
    main()
