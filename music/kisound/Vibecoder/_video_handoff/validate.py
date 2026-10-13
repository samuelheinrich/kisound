#!/usr/bin/env python3
"""Validate the prepared screenplay against both immutable audio/transcript sets."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import math
import re
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
PACKAGE = HERE / 'Vibecoder'
TRACK = PACKAGE / '02_Token_Burn'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def read(path):
    return json.loads(path.read_text())

def word_boundaries(word):
    yield word['start'], word['end']
    for part in word.get('asr_component_words', []):
        yield from word_boundaries(part)

def validate():
    expected=['01_Vibecoder','02_Token_Burn','03_SHIP_IT','04_AI_Slop','05_Hallucination','06_Context_Window']
    assert sorted(p.name for p in PACKAGE.iterdir() if p.is_dir()) == expected
    for name in expected:
        root=PACKAGE/name
        assert (root/'README.md').is_file()
        for folder in ['assets/audio','assets/fonts','src/render','src/tools','output/qa','variants/de','variants/en']:
            assert (root/folder).is_dir()
        assert not list((root/'assets/audio').iterdir())
        assert not (root/'package.json').exists(), 'This handoff must not pretend to be a runnable renderer.'
    manifest=read(TRACK/'SOURCE-MANIFEST.json')
    intended=Path(manifest['intended_project_root'])
    design=read(TRACK/'REGIE-CUES.json')['shots']
    assert len(design)==58
    report={'status':'pass','languages':{},'directories':expected}
    for lang,variant in manifest['variants'].items():
        source={key:(intended/value['path']).resolve() for key,value in variant['inputs'].items()}
        for key,path in source.items():
            assert path.is_file(), (lang,key,path)
            assert sha(path)==variant['inputs'][key]['sha256'], (lang,key)
        transcript=read(source['transcript']);analysis=read(source['analysis'])
        timeline=read(TRACK/'variants'/lang/'TIMELINE.json')
        keywords=read(TRACK/'variants'/lang/'KEYWORDS.json')['keywords']
        duration=variant['duration_s'];shots=timeline['shots']
        assert duration==transcript['duration_seconds']==analysis['summary']['duration_s']
        assert math.ceil(duration*60)==variant['frames_60fps']==timeline['frames']
        assert transcript['source_audio_sha256']==analysis['source']['sha256']==timeline['source_audio_sha256']==variant['inputs']['audio']['sha256']
        assert timeline['transcript_sha256']==variant['inputs']['transcript']['sha256']
        assert timeline['analysis_sha256']==variant['inputs']['analysis']['sha256']
        assert sha(TRACK/'variants'/lang/'ASTRA-AUDIO-ANALYSE.json')==sha(source['analysis'])
        assert sha(TRACK/'variants'/lang/'TRANSKRIPT-PRUEFUNG.md')==sha(source['review'])
        assert len(shots)==58 and shots[0]['start_s']==0 and shots[-1]['end_s']==duration
        assert shots[0]['first_frame']==0 and shots[-1]['end_frame_exclusive']==timeline['frames']
        for i,s in enumerate(shots):
            assert s['id']==f'S{i+1:03}'
            assert s['start_s']==design[i]['starts_s'][lang]
            assert 0<=s['start_s']<s['end_s']<=duration
            assert s['first_frame']<s['end_frame_exclusive']
            if i:
                assert shots[i-1]['end_s']==s['start_s']
                assert shots[i-1]['end_frame_exclusive']==s['first_frame']
            assert s['action'] and s['camera'] and s['transition']
        lyric_counts=Counter(c['id'] for s in shots for c in s['lyrics_starting_here'])
        event_counts=Counter(e for s in shots for e in s['analysis_event_ids'])
        assert lyric_counts==Counter({c['id']:1 for c in transcript['segments']})
        assert event_counts==Counter({e['id']:1 for e in analysis['events']})
        originals={c['id']:c for c in transcript['segments']}
        for s in shots:
            for c in s['lyrics_starting_here']:
                original=originals[c['id']]
                assert c['start_s']==original['start'] and c['end_s']==original['end']
                assert c['text']==original['text'] and c['review_required']==original['review_required']
        assert len(keywords)==6
        for i,k in enumerate(keywords):
            assert k['id']==f'H{i+1:02}' and k['text']=='TOKEN BURN'
            s=next(s for s in shots if s['id']==k['shot_id'])
            original=originals[k['source_segment_id']]
            assert k['review_required']==original['review_required']
            assert k['source_text']==original['text']
            assert original['start']<=k['start_s']<k['vocal_end_s']<=original['end']
            assert s['start_s']==k['start_s']<k['visual_end_s']<s['end_s']
            assert k['visual_end_s']-k['start_s']>=k['entry_s']+.9+k['exit_s']-.001
            assert any(abs(a-k['start_s'])<.001 and abs(b-k['vocal_end_s'])<.001 for word in original['asr_words'] for a,b in word_boundaries(word))
        modes={mode:sum(s['end_s']-s['start_s'] for s in shots if s['mode']==mode) for mode in ['2D','3D','hybrid']}
        assert abs(sum(modes.values())-duration)<1e-6
        assert all(modes[mode]/duration>.3 for mode in ['2D','3D'])
        report['languages'][lang]={'duration_s':duration,'frames_60fps':timeline['frames'],'shots':len(shots),'hooks':len(keywords),'lyric_cues':sum(lyric_counts.values()),'analysis_events':sum(event_counts.values()),'screen_time_percent':{k:round(v/duration*100,2) for k,v in modes.items()}}
        print(f'{lang.upper()}: 58 Shots lückenlos, 6 Hook-Anker belegt, alle Lyrics/Events genau einmal zugeordnet, Quell-Hashes stimmen.')
    for path in PACKAGE.rglob('*.md'):
        for href in re.findall(r'\]\(([^)]+)\)',path.read_text()):
            href=href.strip('<>').split('#')[0]
            if not href or href.startswith(('http:','https:')):
                continue
            assert (path.parent/href).exists(), (path,href)
    with tempfile.TemporaryDirectory(prefix='kisound-video-handoff-check-') as temporary:
        destination=Path(temporary)/'Vibecoder'
        command=[sys.executable,str(HERE/'install.py'),'--destination',str(destination)]
        subprocess.run(command,check=True,capture_output=True,text=True)
        subprocess.run(command,check=True,capture_output=True,text=True)
        for path in PACKAGE.rglob('*'):
            target=destination/path.relative_to(PACKAGE)
            assert target.is_dir() if path.is_dir() else sha(target)==sha(path)
        (destination/'README.md').write_text('Existing user content\n')
        rejected=subprocess.run(command,capture_output=True,text=True)
        assert rejected.returncode!=0 and (destination/'README.md').read_text()=='Existing user content\n'
    report['checks']=['source_hashes','audio_duration','frame_continuity','unique_lyric_event_assignment','actual_asr_hook_boundaries','preserved_review_flags','local_markdown_links','empty_placeholder_directories','installer_copy_idempotence_and_conflict_preservation']
    (HERE/'VALIDIERUNG.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print('Ordnerstruktur, Dokumentlinks und Kopiervorgang einschliesslich Konfliktschutz geprüft.')

if __name__=='__main__':validate()
