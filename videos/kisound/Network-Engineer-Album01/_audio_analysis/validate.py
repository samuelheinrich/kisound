#!/usr/bin/env python3
"""Validate outputs and write album manifest/index after all eight runs."""
import json
import re
from pathlib import Path
from PIL import Image
from analyse import SOURCE, TARGET, TRACKS, OUTFILES, tc, sha

def main():
    workspace=SOURCE.parents[2]
    relative=lambda path: path.relative_to(workspace).as_posix()
    manifest={'schema':'astra.album.manifest.v1','source_root':relative(SOURCE),'target_root':relative(TARGET),'tracks':[]}
    lines=['# ASTRA – Network Engineer Album 01: Audioanalysen und Drehbücher','','Alle Messwerte stammen aus den jeweils zugeordneten Original-WAV-Dateien. BPM und Beatpositionen sind Schätzungen. Gesangszeiten stammen aus vorhandenen automatisch erzeugten Transkripten; eine manuelle Hörprüfung wird nicht behauptet.','', '| Track | Status | Quelldatei | Dauer | BPM (Sicherheit) | LUFS | True Peak | Wichtige Übergänge | Ausgabe | Offene Punkte |','| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |']
    for name in TRACKS:
        folder=TARGET/name; paths=[folder/x for x in OUTFILES]; missing=[p.name for p in paths if not p.exists()]
        if missing: raise AssertionError(f'{name}: fehlend {missing}')
        j=json.loads(paths[1].read_text()); assert j['schema']=='astra.audio.analysis.v1'
        required={'source','summary','tempo','spectrum','sections','events','onsets','lyrics','features_100ms','loudness_100ms','methods','limitations'}
        assert required.issubset(j),name
        duration=j['summary']['duration_s']; rows=j['features_100ms']['rows']; loud=j['loudness_100ms']['rows']
        assert len(rows)==len(loud) and len(rows)>=int(duration*10),name
        assert all(0<=r[0]<=duration+.001 for r in rows),name
        assert all(0<=e['time_s']<=duration+.001 and re.fullmatch(r'\d\d:\d\d:\d\d\.\d\d\d',e['timecode']) for e in j['events']),name
        assert len({e['id'] for e in j['events']})==len(j['events']),name
        assert all(0<=x['start_s']<x['end_s']<=duration+.05 for x in j['lyrics']['segments']),name
        assert j['summary']['sample_peak_dbfs']<=.01 and j['summary']['integrated_lufs'] is not None,name
        assert abs(sum(b['energy_fraction'] or 0 for b in j['spectrum']['bands'])-1)<.02,name
        assert all(all(v is None or isinstance(v,(str,int,float,bool)) for v in row) for row in rows),name
        assert j['tempo']['beat_grid']['status'].startswith('synthetisch'),name
        assert abs(j['sections'][0]['start_s'])<.001 and abs(j['sections'][-1]['end_s']-duration)<.002,name
        for a,b in zip(j['sections'],j['sections'][1:]): assert abs(a['end_s']-b['start_s'])<.002,name
        with Image.open(paths[2]) as im:
            assert im.width>=1500 and im.height>=1000,name
        script=paths[3].read_text(); ids=set(re.findall(r'E\d{3}',script)); assert ids.issubset({e['id'] for e in j['events']}),name
        cues=folder/'UMSETZUNG-CUES.md'
        timing=cues.read_text() if cues.is_file() else script
        assert any(code in timing for code in (tc(duration),tc(duration)[3:])),name
        source=j['source']; sourcepath=SOURCE/name/source['filename']
        assert sourcepath.is_file() and Path(source['path']).name==sourcepath.name,name
        assert source['selection_reason'] and sha(sourcepath)==source['sha256'],name
        transitions=[e for e in j['events'] if e['type'] in {'energy_rise','energy_fall'}]
        def strength(e):
            match=re.search(r'([+-]\d+(?:\.\d+)?) dB',e['observation'])
            return abs(float(match[1])) if match else 0
        transitions=sorted(transitions,key=strength,reverse=True)[:3]
        fades=[e for e in j['events'] if e['type']=='fade_candidate']
        if fades: transitions.append(fades[-1])
        transitions=sorted(transitions,key=lambda e:e['time_s'])
        key=', '.join(f'{e["timecode"]} {e["type"]}' for e in transitions) or 'keine starke Änderung'
        excluded=len(j['lyrics']['excluded_source_segments']); issue=(f'{excluded} fragliches Transkriptsegment ausgespart; ' if excluded==1 else (f'{excluded} fragliche Transkriptsegmente ausgespart; ' if excluded else ''))+'Gesangszeiten nicht manuell geprüft'
        if name=='00_Network_Engineers' and (folder/'ASTRA-TRANSKRIPT-GEGENPRUEFUNG.md').exists():
            issue='46 Zeilen mit zwei lokalen ASR-Modellen abgeglichen; Wortkonflikte und menschliche Hörprüfung offen'
        rel=f'{name}/'; lines.append(f'| {name} | fertig | `{source["filename"]}` | {tc(duration)} | {j["tempo"]["recommended_bpm"]} ({j["tempo"]["confidence"]}) | {j["summary"]["integrated_lufs"]} | {j["summary"]["true_peak_dbtp_rounded"]} dBTP | {key} | `{rel}` | {issue} |')
        entry={'track':name,'status':'complete','source_audio':relative(sourcepath),'source_sha256':source['sha256'],'transcript':relative(SOURCE/name/Path(source['transcript_path']).name),'transcript_sha256':source['transcript_sha256'],'selection_reason':source['selection_reason'],'outputs':{p.name:relative(p) for p in paths},'duration_s':duration,'excluded_transcript_segments':excluded}
        if name=='00_Network_Engineers' and (folder/'ASTRA-TRANSKRIPT-GEGENPRUEFUNG.md').exists():
            entry['asr_crosscheck_report']=relative(folder/'ASTRA-TRANSKRIPT-GEGENPRUEFUNG.md')
            entry['timing_review_status']='zwei lokale ASR-Modelle; keine menschliche Hörprüfung'
        manifest['tracks'].append(entry)
    (TARGET/'ASTRA-ALBUM-UEBERSICHT.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    (TARGET/'_audio_analysis'/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    print('Validiert:',len(manifest['tracks']),'Tracks,',4*len(manifest['tracks']),'Primärdateien; Manifest und Albumübersicht geschrieben')
if __name__=='__main__': main()
