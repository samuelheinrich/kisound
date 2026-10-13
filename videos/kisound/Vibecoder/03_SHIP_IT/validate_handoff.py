#!/usr/bin/env python3
"""Validate the SHIP IT screenplay handoff against final DE/EN music sources."""
from collections import Counter
from pathlib import Path
import hashlib
import json
import math
import re

HERE=Path(__file__).resolve().parent

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda:source.read(4*1024*1024),b''):
            h.update(block)
    return h.hexdigest()

def read(path):
    return json.loads(path.read_text())

def check():
    manifest=read(HERE/'SOURCE-MANIFEST.json')
    design=read(HERE/'REGIE-CUES.json')['shots']
    assert len(design)==34
    report={'status':'pass','languages':{}}
    for lang,variant in manifest['variants'].items():
        source={key:(Path(manifest['intended_project_root'])/value['path']).resolve() for key,value in variant['inputs'].items()}
        for key,path in source.items():
            assert path.is_file() and sha(path)==variant['inputs'][key]['sha256'],(lang,key,path)
        tr=read(source['transcript']);an=read(source['analysis'])
        timeline=read(HERE/'variants'/lang/'TIMELINE.json')
        keys=read(HERE/'variants'/lang/'KEYWORDS.json')
        duration=variant['duration_s'];shots=timeline['shots']
        assert len(shots)==len(design)==34
        assert duration==tr['duration_seconds']==an['summary']['duration_s']==timeline['duration_s']
        assert variant['samples_per_channel']==an['summary']['samples_per_channel']
        assert math.ceil(duration*60)==variant['frames_60fps']==timeline['frames']
        assert timeline['source_audio_sha256']==tr['source_audio_sha256']==an['source']['sha256']==variant['inputs']['audio']['sha256']
        assert timeline['transcript_sha256']==an['source']['transcript_sha256']==sha(source['transcript'])
        assert timeline['analysis_sha256']==sha(source['analysis'])
        for filename in ('ASTRA-AUDIO-ANALYSE.md','ASTRA-AUDIO-ANALYSE.json','ASTRA-AUDIO-ANALYSE.png','TRANSKRIPT-PRUEFUNG.md'):
            assert sha(HERE/'variants'/lang/filename)==sha(source['analysis'].parent/filename)
        assert shots[0]['start_s']==0 and shots[-1]['end_s']==duration
        assert shots[0]['first_frame']==0 and shots[-1]['end_frame_exclusive']==timeline['frames']
        for i,shot in enumerate(shots):
            assert shot['id']==design[i]['id']==f'S{i+1:03}'
            assert shot['start_s']==design[i]['starts_s'][lang] and shot['end_s']==design[i]['ends_s'][lang]
            assert 0<=shot['start_s']<shot['end_s']<=duration
            assert 0<=shot['first_frame']<shot['end_frame_exclusive']<=timeline['frames']
            assert shot['action'] and shot['camera'] and shot['transition']
            if i:
                assert shots[i-1]['end_s']==shot['start_s']
                assert shots[i-1]['end_frame_exclusive']==shot['first_frame']
        cue_counts=Counter(c['id'] for shot in shots for c in shot['lyrics_starting_here'])
        event_counts=Counter(e for shot in shots for e in shot['analysis_event_ids'])
        assert cue_counts==Counter({c['id']:1 for c in tr['segments']})
        assert event_counts==Counter({e['id']:1 for e in an['events']})
        originals={c['id']:c for c in tr['segments']}
        for shot in shots:
            for cue in shot['lyrics_starting_here']:
                original=originals[cue['id']]
                assert (cue['start_s'],cue['end_s'],cue['text'],cue['review_required'])==(original['start'],original['end'],original['text'],original['review_required'])
        assert keys['audio_sha256']==tr['source_audio_sha256']
        for i,key in enumerate(keys['keywords'],1):
            assert key['id']==f'H{i:02}' and key['text']=='COMMIT IT. SHIP IT.'
            shot=next(s for s in shots if s['id']==key['shot_id'])
            source_cue=originals[key['source_segment_id']]
            assert key['review_required'] and key['syllable_times_inferred'] is False
            assert key['source_text']==source_cue['asr_text']
            assert 0<=key['start_s']<key['vocal_end_s']<=duration
            assert shot['start_s']<=key['visual_start_s']<key['visual_end_s']<=shot['end_s']
            assert key['visual_end_s']-key['visual_start_s']>=0.8
        report['languages'][lang]={'duration_s':duration,'frames':timeline['frames'],'shots':len(shots),
                                   'lyrics':len(tr['segments']),'events':len(an['events']),
                                   'hook_windows':len(keys['keywords']),'audio_sha256':tr['source_audio_sha256']}
        print(f'{lang.upper()}: {len(shots)} Shots lückenlos; {len(tr["segments"])} Lyrics und {len(an["events"])} Ereignisse genau einmal; Hashes stimmen.')
    for path in HERE.rglob('*.md'):
        if any(part in {'_revisions','node_modules','output'} for part in path.parts):
            continue
        for href in re.findall(r'\]\(([^)]+)\)',path.read_text()):
            href=href.strip('<>').split('#')[0]
            if href and not href.startswith(('http:','https:')):
                assert (path.parent/href).exists(),(path,href)
    (HERE/'VALIDIERUNG.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print('Lokale Links und beide Sprachfassungen: PASS')

if __name__=='__main__':
    check()
