#!/usr/bin/env python3
"""Validate all three analysis artifacts, source identity, timing and handoff data."""
import argparse
import json
import math
import re
import subprocess
import sys
from datetime import datetime, timezone
from importlib.metadata import version
from pathlib import Path
from PIL import Image
from analyse import TARGET, SOURCE, TRACKS, OUTFILES, tc, sha, write


def read_json(path):
    def invalid(value):
        raise ValueError(f'{path}: invalid JSON number {value}')
    return json.loads(path.read_text(), parse_constant=invalid)


def require(condition, detail):
    if not condition:
        raise AssertionError(detail)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--refresh-readme',action='append',choices=TRACKS,default=[],help='Nur angegebene Track-READMEs erneuern; bestehende Projektdokumentation sonst erhalten.')
    args=parser.parse_args()
    snapshot=read_json(TARGET/'_audio_analysis/source-snapshot.json')
    workspace=SOURCE.parents[2]
    for path,digest in snapshot.items():
        local=workspace/path
        require(local.is_file() and sha(local)==digest, f'Source changed: {path}')
    relative=lambda path: path.relative_to(workspace).as_posix()
    manifest={'schema':'astra.album.manifest.v1','source_root':relative(SOURCE),
        'target_root':relative(TARGET),'analysis_scope':'transcript-linked audio sources; final_release status where verified; no videos or screenplays',
        'validated_at_utc':datetime.now(timezone.utc).isoformat(),
        'source_snapshot_verified_files':len(snapshot),
        'pipeline_sha256':{n:sha(TARGET/'_audio_analysis'/n) for n in ['analyse.py','validate.py','requirements.txt']},
        'environment':{'python':sys.version,'packages':{n:version(n) for n in ['numpy','scipy','soundfile','matplotlib','pillow']},
            'ffmpeg':subprocess.check_output(['ffmpeg','-version'],text=True).splitlines()[0]},
        'tracks':[]}
    lines=['# ASTRA – Network Engineer Album 02: Audioanalysen','',
        'Acht Audioanalysen mit geprüfter Quellenzuordnung; die tatsächlich analysierten Dateien stehen in der Tabelle. '
        'TrustSec (03) wurde aus der finalen Release-WAV neu berechnet. '
        'BPM/Beat-Raster sind Schätzungen, Gesangszeiten automatisch; keine manuelle Hörprüfung. '
        'Keine Videos oder Drehbücher wurden erzeugt.','',
        '| Track | Quelle | Dauer | BPM (Sicherheit) | LUFS | True Peak | Lyrics / Prüfmarkierungen | Analyse |',
        '| --- | --- | ---: | --- | ---: | ---: | --- | --- |']
    for name in TRACKS:
        folder=TARGET/name
        for n in OUTFILES:
            require((folder/n).is_file(),f'{name}: missing {n}')
        d=read_json(folder/OUTFILES[1]); s=d['summary']; duration=s['duration_s']
        require(d['schema']=='astra.audio.analysis.v1',name)
        require({'source','summary','tempo','spectrum','sections','events','onsets','lyrics',
            'features_100ms','loudness_100ms','methods','limitations'}.issubset(d),name)
        source=d['source']
        wav=SOURCE/name/source['filename']
        transcript_path=SOURCE/name/Path(source['transcript_path']).name
        prompt_path=SOURCE/name/Path(source['project_prompt_path']).name
        transcript=read_json(transcript_path)
        require(Path(source['path']).name==transcript['source_audio']==wav.name,name)
        require(sha(wav)==source['sha256']==transcript['source_audio_sha256'],name)
        require(sha(transcript_path)==source['transcript_sha256'],name)
        require(sha(prompt_path)==source['project_prompt_sha256'],name)
        require(source['selection_status'] in {'current_audio_candidate','final_release'},name)
        if source['selection_status']=='final_release':
            prompt=prompt_path.read_text()
            require(prompt_path.name==f'{name}_1.0.txt',name)
            require(bool(re.search(r'^STATUS:[ \t]*Final[ \t]*$',prompt,re.M|re.I)),name)
            require(bool(re.search(r'^RELEASE AUDIO:[ \t]*'+re.escape(source['filename'])+r'[ \t]*$',prompt,re.M)),name)
        require(abs(duration-transcript['duration_seconds'])<=.05,name)
        require(abs(s['samples_per_channel']/s['sample_rate_hz']-duration)<1e-8,name)
        features=d['features_100ms']; columns=features['columns']; rows=features['rows']
        require(len(rows)==math.ceil(duration*10)==len(d['loudness_100ms']['rows']),name)
        require(len(columns)==len(set(columns)),name)
        for i,row in enumerate(rows):
            require(len(row)==len(columns) and all(isinstance(v,(int,float)) and math.isfinite(v) for v in row),name)
            midpoint=(i*.1+min(duration,(i+1)*.1))/2
            require(abs(row[0]-midpoint)<=.000051,f'{name}: feature midpoint {i}')
            for label,value in zip(columns,row):
                if label.endswith(('_fraction','_drive')):
                    require(0<=value<=1,f'{name}: {label}')
        for i,row in enumerate(d['loudness_100ms']['rows']):
            require(len(row)==3 and all(v is None or math.isfinite(v) for v in row),name)
            require(abs(row[0]-min(duration,(i+1)*.1))<=.00051,name)
            require(row[0]>=.4 or row[1] is None,name)
            require(row[0]>=3 or row[2] is None,name)
        events=d['events']; eventids={e['id'] for e in events}
        require(len(eventids)==len(events),name)
        require([e['time_s'] for e in events]==sorted(e['time_s'] for e in events),name)
        require(all(0<=e['time_s']<=duration+.001 and re.fullmatch(r'\d\d:\d\d:\d\d\.\d\d\d',e['timecode']) for e in events),name)
        require(events[0]['type']=='start' and events[-1]['type']=='end',name)
        require(abs(events[-1]['time_s']-duration)<=.00051,name)
        onsets=d['onsets']
        require(all(0<=x['time_s']<=duration and x['strength']>=0 for x in onsets),name)
        sections=d['sections']
        require(sections and sections[0]['start_s']==0 and abs(sections[-1]['end_s']-duration)<.000002,name)
        for a,b in zip(sections,sections[1:]):
            require(a['end_s']==b['start_s'],f'{name}: section gap')
        require(all(x['start_s']<x['end_s'] for x in sections),name)
        lyrics=d['lyrics']['segments']; original={x['id']:x for x in transcript['segments']}
        used=set()
        for x in lyrics:
            c=original[x['source_segment_id']]; used.add(c['id'])
            require(x['start_s']==c['start'] and x['end_s']==c['end'] and x['text']==c['text'].strip(),f'{name}: altered lyric')
            require(0<=x['start_s']<x['end_s']<=duration+.05,name)
            for k,v in c.items():
                if k not in {'id','start','end','text','section','start_timecode','end_timecode'}:
                    require(x.get(k)==v,f'{name}: lost ASR metadata {k}')
        excluded=d['lyrics']['excluded_source_segments']; excludedids={x['id'] for x in excluded}
        require(not used.intersection(excludedids) and used|excludedids==set(original),name)
        require(len({x['id'] for x in lyrics})==len(lyrics),name)
        require(all(e['lyric_id'] is None or e['lyric_id'] in {x['id'] for x in lyrics} for e in events),name)
        require(abs(sum(b['energy_fraction'] or 0 for b in d['spectrum']['bands'])-1)<.001,name)
        require(s['integrated_lufs'] is not None and s['true_peak_dbtp_rounded'] is not None,name)
        require(d['tempo']['beat_grid']['status'].startswith('synthetisch'),name)
        require(all(0<=t<=duration for t in d['tempo']['beat_grid']['times_s']),name)
        if source['filename'].endswith('.mp3'):
            require(s['bit_depth'] is None and s['format']=='MP3',name)
        else:
            require(s['sample_peak_dbfs']<=.01,name)
        with Image.open(folder/OUTFILES[2]) as im:
            require(im.format=='PNG' and im.width>=1500 and im.height>=1000,name)
            dimensions=list(im.size); im.verify()
        report=(folder/OUTFILES[0]).read_text()
        require(source['sha256'] in report and tc(duration) in report,name)
        require(re.findall(r'\bE\d{3}\b',report)==[e['id'] for e in events],name)
        reviewed=sum(bool(x.get('review_required')) for x in lyrics)
        entry={'track':name,'status':'complete','source_audio':relative(wav),
            'source_sha256':source['sha256'],'transcript':relative(transcript_path),
            'transcript_sha256':source['transcript_sha256'],'selection_reason':source['selection_reason'],
            'selection_status':source['selection_status'],'outputs':{n:relative(folder/n) for n in OUTFILES},
            'output_sha256':{n:sha(folder/n) for n in OUTFILES},'duration_s':duration,
            'lyrics':len(lyrics),'review_required_lyrics':reviewed,'excluded_transcript_segments':len(excluded),
            'png_dimensions':dimensions}
        manifest['tracks'].append(entry)
        lines.append(f'| {name} | `{source["filename"]}` | {tc(duration)} | {d["tempo"]["recommended_bpm"]} ({d["tempo"]["confidence"]}) | {s["integrated_lufs"]} | {s["true_peak_dbtp_rounded"]} dBTP | {len(lyrics)} / {reviewed} | [MD]({name}/{OUTFILES[0]}) · [JSON]({name}/{OUTFILES[1]}) · [PNG]({name}/{OUTFILES[2]}) |')
        readme=f'''# {name.replace('_',' ')} – Grundlage für das Video

Status: Audioanalyse {'der finalen Release-Datei' if source['selection_status']=='final_release' else 'des aktuellen Kandidaten'} vollständig. Videoumsetzung folgt separat.

- [Audioanalyse](ASTRA-AUDIO-ANALYSE.md)
- [Messdaten und unveränderte Gesangszeiten](ASTRA-AUDIO-ANALYSE.json)
- [Pegel, Spektrogramm, Onsets und Bassverlauf](ASTRA-AUDIO-ANALYSE.png)

Quelle: `{source['filename']}`; SHA-256 `{source['sha256']}`.
Dauer: {tc(duration)} ({duration:.9f} s). Alle Zeiten beginnen bei 0 der decodierten Originalquelle.
Musikquellen: `../../../../music/kisound/Network-Engineer-Album02/{name}/`.

Für die Umsetzung zuerst Prompt, Transkript, Album-Metadaten und Analyse lesen.
Die {reviewed} übernommenen `review_required`-Markierungen und der Quellbericht
`music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md` dokumentieren offene ASR-Fragen.
Keine manuelle Hörprüfung; BPM und Beat-Raster sind Schätzungen.
`events[].image_action` enthält Vorschläge, keine erkannte Instrument- oder SFX-Klassifikation.

{'Finale Release-Datei mit dem 1.0-Prompt abgeglichen.' if source['selection_status']=='final_release' else 'Noch keine finale Release-Auswahl.'} Bei einer anderen Aufnahme Transkript und Analyse neu erstellen.
Dieses Verzeichnis enthält die Analysegrundlage; Szenencode, Drehbuch und Videoexport folgen separat.
Gemeinsames Vorgehen: [PRODUKTION.md](../../PRODUKTION.md).
'''
        if name in args.refresh_readme or not (folder/'README.md').exists():
            write(folder/'README.md',readme)
        print(f'OK {name}: {len(rows)} feature rows, {len(lyrics)} lyrics, {len(events)} events; {dimensions[0]}×{dimensions[1]} PNG',flush=True)
    lines+=['','Analysewerkzeuge und reproduzierbarer Aufruf: [_audio_analysis/README.md](_audio_analysis/README.md).',
        'TrustSec verwendet die finale WAV in `03_TrustSec/`; das bestehende Videoprojekt liegt ebenfalls unter `03_TrustSec/`.','']
    write(TARGET/'ASTRA-ALBUM-UEBERSICHT.md','\n'.join(lines))
    write(TARGET/'_audio_analysis/manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    print(f'Validated {len(TRACKS)} tracks / {3*len(TRACKS)} analysis artifacts; {len(snapshot)} source files unchanged.',flush=True)

if __name__=='__main__':
    main()
