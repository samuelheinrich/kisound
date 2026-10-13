#!/usr/bin/env python3
"""Independent short ASR windows for uncertain 01_Vibecoder passages."""
import cached_runtime  # noqa: F401 - exposes the existing offline MLX installation
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time

import mlx_whisper
import numpy as np

TRACK = Path(__file__).resolve().parent.parent / '01_Vibecoder'
MODEL = Path.home() / '.cache/huggingface/hub/models--mlx-community--whisper-large-v3-mlx/snapshots/49e6aa286ad60c14352c404340ded53710378a11'
WINDOWS = {
    'de': [(18, 29), (29, 36), (47, 54), (64, 72), (106, 115),
           (156, 168), (168, 181), (181, 195), (199, 216.24)],
    'en': [(59, 71), (71, 83), (110, 121), (139, 151), (151, 164),
           (183, 198), (198, 212), (212, 225), (226, 244.76)],
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(language):
    wav = TRACK / 'final' / f'01_Vibecoder_suno-0.1_50_50_exakt_off_{language.upper()}.wav'
    dest = TRACK / 'final' / language / 'asr' / 'short-windows.json'
    digest = sha(wav)
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-f', 'f32le',
                          '-ar', '16000', '-ac', '1', '-'], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    previous = json.loads(dest.read_text()) if dest.exists() else {}
    results = previous.get('windows', []) if previous.get('source_audio_sha256') == digest else []
    for start, end in WINDOWS[language]:
        if any(x['start_s'] == start and x['end_s'] == end for x in results):
            continue
        print(language, start, end, flush=True)
        clip = audio[round(start * 16000):round(end * 16000)]
        began = time.monotonic()
        raw = mlx_whisper.transcribe(clip, path_or_hf_repo=str(MODEL),
                                    language=language, task='transcribe',
                                    temperature=0.0, condition_on_previous_text=False,
                                    word_timestamps=True, verbose=False)
        segments = []
        for item in raw['segments']:
            words = [{'word': word['word'].strip(),
                      'start': round(start + float(word['start']), 3),
                      'end': round(start + float(word['end']), 3)}
                     for word in item.get('words', []) if word['word'].strip()]
            segments.append({'start': round(start + float(item['start']), 3),
                             'end': round(start + float(item['end']), 3),
                             'text': item['text'].strip(), 'words': words,
                             'avg_logprob': float(item.get('avg_logprob', 0)),
                             'no_speech_prob': float(item.get('no_speech_prob', 0))})
        results.append({'start_s': start, 'end_s': end,
                        'elapsed_s': round(time.monotonic() - began, 2),
                        'segments': segments})
        dest.write_text(json.dumps({
            'model': 'mlx-community/whisper-large-v3-mlx',
            'runtime': 'MLX GPU, unabhängige kurze Fenster ohne Lyrics-Prompt',
            'source_audio': str(wav), 'source_audio_sha256': digest,
            'language': language, 'windows': results,
        }, ensure_ascii=False, indent=2, allow_nan=False) + '\n')


if __name__ == '__main__':
    for lang in sys.argv[1:] or ('de', 'en'):
        run(lang)
