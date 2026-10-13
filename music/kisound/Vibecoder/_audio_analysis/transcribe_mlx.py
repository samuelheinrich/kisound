#!/usr/bin/env python3
"""Transcribe final SHIP IT WAVs locally with cached MLX Whisper and word timing."""
import cached_runtime
import hashlib
import json
import os
from pathlib import Path
import sys
import time
import wave

import mlx_whisper

ROOT = Path(__file__).resolve().parent.parent / '03_SHIP_IT'
MODEL = Path.home() / '.cache/huggingface/hub/models--mlx-community--whisper-large-v3-mlx/snapshots/49e6aa286ad60c14352c404340ded53710378a11'
MODEL_ID = 'mlx-community/whisper-large-v3-mlx'

def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(4*1024*1024), b''):
            h.update(block)
    return h.hexdigest()

def run(language):
    wav = ROOT / 'final' / f'03_SHIP_IT_suno-v3_50_50_exakt_off_{language.upper()}.wav'
    dest = ROOT / 'final' / language / 'asr'
    dest.mkdir(parents=True, exist_ok=True)
    output = dest / 'whisper-large-v3.json'
    digest = sha(wav)
    if output.exists() and json.loads(output.read_text()).get('source_audio_sha256') == digest:
        print(language, 'cached raw ASR exists', flush=True)
        return
    hint = f'Commit it, ship it, build, check, live, album {"drei" if language == "de" else "three"}.'
    started = time.monotonic()
    result = mlx_whisper.transcribe(str(wav), path_or_hf_repo=str(MODEL), language=language,
        task='transcribe', temperature=0.0, condition_on_previous_text=False,
        initial_prompt=hint, word_timestamps=True, verbose=False)
    segments = []
    for item in result['segments']:
        words = [{'word': w['word'].strip(), 'start': round(float(w['start']), 3),
                  'end': round(float(w['end']), 3)} for w in item.get('words', []) if w['word'].strip()]
        segments.append({'start': round(float(item['start']), 3), 'end': round(float(item['end']), 3),
                         'text': item['text'].strip(), 'words': words, 'tokens': item.get('tokens', []),
                         'avg_logprob': float(item.get('avg_logprob', 0)),
                         'no_speech_prob': float(item.get('no_speech_prob', 0))})
    data = {'model': MODEL_ID, 'model_snapshot': str(MODEL), 'weights_sha256': sha(MODEL/'weights.npz'),
            'runtime': 'MLX GPU / mlx-whisper', 'package_versions': {'mlx_whisper': cached_runtime.choices['mlx_whisper'][1], 'mlx': cached_runtime.choices['mlx'][1]},
            'source_audio': str(wav), 'source_audio_sha256': digest, 'language': language,
            'duration_seconds': 0,
            'parameters': {'temperature': 0, 'condition_on_prev_tokens': False,
                           'return_token_timestamps': True, 'lyrics_prompt': None,
                           'vocabulary_hint': hint, 'chunk_seconds': 30,
                           'word_timing': 'decoder cross-attention DTW via mlx-whisper'},
            'elapsed_seconds': round(time.monotonic()-started, 2), 'segments': segments}
    with wave.open(str(wav), 'rb') as source:
        data['duration_seconds'] = source.getnframes() / source.getframerate()
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n')
    print(language, 'saved', len(segments), 'segments', flush=True)

if __name__ == '__main__':
    for language in sys.argv[1:] or ('de', 'en'):
        run(language)
