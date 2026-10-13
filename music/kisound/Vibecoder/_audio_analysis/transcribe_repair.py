#!/usr/bin/env python3
"""Recheck selected SHIP IT intervals; preserve short-window MLX evidence."""
import cached_runtime
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
import time
import numpy as np
import mlx_whisper

ROOT = Path(__file__).resolve().parent.parent / '03_SHIP_IT'
MODEL = Path.home() / '.cache/huggingface/hub/models--mlx-community--whisper-large-v3-mlx/snapshots/49e6aa286ad60c14352c404340ded53710378a11'
WINDOWS = {'de': [(67,77),(77,87),(87,97),(113,126),(126,136),(136,146),(146,155.96)],
           'en': [(83,92),(92,101)]}

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda:source.read(4*1024*1024),b''):
            h.update(block)
    return h.hexdigest()

def run(language):
    wav = ROOT / 'final' / f'03_SHIP_IT_suno-v3_50_50_exakt_off_{language.upper()}.wav'
    dest = ROOT / 'final' / language / 'asr'
    output = dest / 'repair-windows.json'
    digest=sha(wav)
    pcm = subprocess.run(['ffmpeg','-v','error','-i',str(wav),'-f','f32le','-ar','16000','-ac','1','-'],capture_output=True,check=True).stdout
    audio = np.frombuffer(pcm,dtype=np.float32)
    previous=json.loads(output.read_text()) if output.exists() else {}
    results=previous.get('windows',[]) if previous.get('source_audio_sha256')==digest else []
    for a,b in WINDOWS[language]:
        if any(w['start_s']==a and w['end_s']==b for w in results):
            print(language, a, b, 'cached', flush=True)
            continue
        print(language, a, b, flush=True)
        start=time.monotonic()
        clip=audio[round(a*16000):round(b*16000)]
        result=mlx_whisper.transcribe(clip,path_or_hf_repo=str(MODEL),language=language,
            task='transcribe',temperature=0.0,condition_on_previous_text=False,
            word_timestamps=True,verbose=False)
        segments=[]
        for item in result['segments']:
            words=[{'word':w['word'].strip(),'start':round(a+float(w['start']),3),'end':round(a+float(w['end']),3)} for w in item.get('words',[]) if w['word'].strip()]
            segments.append({'start':round(a+float(item['start']),3),'end':round(a+float(item['end']),3),
                             'text':item['text'].strip(),'words':words,'tokens':item.get('tokens',[]),
                             'avg_logprob':float(item.get('avg_logprob',0)) if math.isfinite(float(item.get('avg_logprob',0))) else None,
                             'no_speech_prob':float(item.get('no_speech_prob',0)) if math.isfinite(float(item.get('no_speech_prob',0))) else None,
                             'repair_window':[a,b]})
        results.append({'start_s':a,'end_s':b,'elapsed_s':round(time.monotonic()-start,2),'segments':segments})
        output.write_text(json.dumps({'model':'mlx-community/whisper-large-v3-mlx','runtime':'MLX GPU, short independent windows',
                                     'language':language,'source_audio':str(wav),'source_audio_sha256':digest,'windows':results},ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    print(language, 'repair saved', flush=True)

if __name__=='__main__':
    for language in sys.argv[1:] or ('de',):
        run(language)
