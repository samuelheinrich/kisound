#!/usr/bin/env python3
"""Replace long MLX repetition failures with independent short-window MLX runs."""
import copy
import hashlib
import json
import re
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent / '03_SHIP_IT' / 'final'

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(4*1024*1024),b''):
            h.update(block)
    return h.hexdigest()

def curate(language):
    folder=ROOT/language/'asr'
    fullpath=folder/'whisper-large-v3.json'
    repairpath=folder/'repair-windows.json'
    full=json.loads(fullpath.read_text())
    repair=json.loads(repairpath.read_text())
    assert repair['source_audio_sha256']==full['source_audio_sha256']
    windows=repair['windows']
    selected=[];excluded=[]
    for item in full['segments']:
        overlap=max((max(0,min(item['end'],w['end_s'])-max(item['start'],w['start_s'])) for w in windows),default=0)
        if overlap >= 0.2:
            excluded.append({'start':item['start'],'end':item['end'],'text':item['text'],
                             'reason':'Lange ASR-Wiederholung oder unklarer Text; durch unabhängige kurze Fenster ersetzt.'})
            continue
        if language=='de' and item['start']>150 and item['text'].casefold().strip('. ')=='vielen dank':
            excluded.append({'start':item['start'],'end':item['end'],'text':item['text'],
                             'reason':'Kurze ASR-Schlussfloskel ohne Lyrics- oder Turbo-Beleg.'})
            continue
        if item['end'] <= item['start'] or item['start'] >= full['duration_seconds']:
            excluded.append({'start':item['start'],'end':item['end'],'text':item['text'],
                             'reason':'Zusammengefallene oder ausserhalb der WAV liegende Zeit.'})
            continue
        clone=copy.deepcopy(item)
        clone['evidence_origin']='full-window large-v3'
        for word in clone['words']:
            word['source_model']='mlx-community/whisper-large-v3-mlx'
            word['evidence_origin']='full-window'
        selected.append(clone)
    for window in windows:
        for item in window['segments']:
            clone=copy.deepcopy(item)
            if clone['end'] <= clone['start'] or clone['start'] >= full['duration_seconds'] or not re.search(r'\w',clone['text']):
                excluded.append({'start':clone['start'],'end':clone['end'],'text':clone['text'],
                                 'reason':'Kein verwendbares Wort oder keine verwendbare Zeit im Reparaturfenster.'})
                continue
            clone['evidence_origin']='short-window large-v3'
            for word in clone['words']:
                word['source_model']='mlx-community/whisper-large-v3-mlx'
                word['evidence_origin']='short-window'
            selected.append(clone)
    selected.sort(key=lambda item:(item['start'],item['end']))
    curated={**full,'model':'mlx-community/whisper-large-v3-mlx (curated full and short windows)',
             'source_full_asr_sha256':sha(fullpath),'source_repair_sha256':sha(repairpath),
             'curation_note':'Lange Wiederholungsfehler der 30-s-ASR wurden anhand unabhängiger kurzer Läufe auf derselben unveränderten WAV ersetzt. Keine manuelle Hörprüfung. Alle ersetzten Segmente sind dokumentiert.',
             'excluded_segments':excluded,'segments':selected,
             'parameters':{**full['parameters'],'curation':'full-window and independent short-window MLX large-v3; same WAV, no lyrics prompt'}}
    dest=folder/'whisper-large-v3-curated.json'
    dest.write_text(json.dumps(curated,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    print(language,len(selected),'segments;',len(excluded),'replaced/excluded')

if __name__=='__main__':
    for language in sys.argv[1:] or ('de','en'):
        curate(language)
