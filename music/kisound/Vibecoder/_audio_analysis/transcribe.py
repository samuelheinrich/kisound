#!/usr/bin/env python3
"""Offline CPU transcription from locally cached MLX Whisper weights.

Convert tensor layout in memory; never change the source weights or WAV.
Python 3.12 with cached_runtime.py, torch, transformers and safetensors.
"""
import cached_runtime
import importlib.util
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import copy
import functools
import gc

import numpy as np
import torch
from safetensors.torch import load_file
from transformers import WhisperConfig, WhisperForConditionalGeneration

HERE = Path(__file__).resolve().parent
TRACK_ID = os.environ.get('KISOUND_AUDIO_TRACK', '02_Token_Burn')
TRACK = HERE.parent / TRACK_ID
PACKAGE = cached_runtime.choices['mlx_whisper'][0] / 'mlx_whisper'
LARGE = os.environ.get('KISOUND_ASR_MODEL') == 'large-v3'
MODEL_NAME = 'whisper-large-v3' if LARGE else 'whisper-large-v3-turbo'
MODEL_ID = 'mlx-community/whisper-large-v3-mlx' if LARGE else 'mlx-community/whisper-large-v3-turbo'
MODEL = Path.home() / '.cache/huggingface/hub' / (('models--mlx-community--whisper-large-v3-mlx/snapshots/49e6aa286ad60c14352c404340ded53710378a11') if LARGE else 'models--mlx-community--whisper-large-v3-turbo/snapshots/a4aaeec0636e6fef84abdcbe3544cb2bf7e9f6fb')
DTYPE = torch.float32
WEIGHTS = MODEL / ('weights.npz' if LARGE else 'weights.safetensors')

spec = importlib.util.spec_from_file_location('offline_whisper_tokenizer', PACKAGE / 'tokenizer.py')
tokenizer_module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = tokenizer_module
spec.loader.exec_module(tokenizer_module)


def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(4 * 1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def load_model():
    dims = json.loads((MODEL / 'config.json').read_text())
    config = WhisperConfig(
        num_mel_bins=dims['n_mels'], d_model=dims['n_audio_state'],
        encoder_layers=dims['n_audio_layer'], decoder_layers=dims['n_text_layer'],
        encoder_attention_heads=dims['n_audio_head'], decoder_attention_heads=dims['n_text_head'],
        encoder_ffn_dim=dims['n_audio_state'] * 4, decoder_ffn_dim=dims['n_text_state'] * 4,
        vocab_size=dims['n_vocab'], max_source_positions=dims['n_audio_ctx'],
        max_target_positions=dims['n_text_ctx'],
        decoder_start_token_id=50258, eos_token_id=50257, pad_token_id=50257,
    )
    config._attn_implementation = 'eager'
    with torch.device('meta'):
        model = WhisperForConditionalGeneration(config)
    original = np.load(WEIGHTS) if LARGE else load_file(str(WEIGHTS))
    heads = original['alignment_heads'].tolist()
    state = {}
    for key in original:
        if key == 'alignment_heads':
            continue
        value = torch.from_numpy(original[key].copy()) if LARGE else original[key]
        key = key.replace('.blocks.', '.layers.')
        key = key.replace('.attn_ln.', '.self_attn_layer_norm.').replace('.cross_attn_ln.', '.encoder_attn_layer_norm.')
        key = key.replace('.cross_attn.', '.encoder_attn.').replace('.attn.', '.self_attn.')
        for source, target in [('query', 'q_proj'), ('key', 'k_proj'), ('value', 'v_proj'), ('out', 'out_proj')]:
            key = key.replace('.' + source + '.', '.' + target + '.')
        key = key.replace('.mlp1.', '.fc1.').replace('.mlp2.', '.fc2.').replace('.mlp_ln.', '.final_layer_norm.')
        key = key.replace('.ln_post.', '.layer_norm.').replace('decoder.ln.', 'decoder.layer_norm.')
        key = key.replace('.token_embedding.', '.embed_tokens.')
        key = key.replace('.positional_embedding', '.embed_positions.weight')
        if '.conv' in key and key.endswith('.weight'):
            value = value.transpose(1, 2).contiguous()
        state['model.' + key] = value.to(DTYPE)
    # MLX computes encoder sinusoidal positions rather than storing them.
    positions = torch.arange(dims['n_audio_ctx'], dtype=torch.float32)[:, None]
    scales = torch.exp(-np.log(10000) * torch.arange(dims['n_audio_state'] // 2) / (dims['n_audio_state'] // 2 - 1))
    angles = positions * scales[None, :]
    state['model.encoder.embed_positions.weight'] = torch.cat([angles.sin(), angles.cos()], dim=1).to(DTYPE)
    state['proj_out.weight'] = state['model.decoder.embed_tokens.weight']
    model.load_state_dict(state, strict=True, assign=True)
    model.eval()
    # Word DTW needs decoder cross-attention only. Avoid retaining 32 layers of
    # 1500x1500 encoder attention matrices in every chunk.
    for layer in model.model.encoder.layers:
        layer.self_attn.config = copy.deepcopy(layer.self_attn.config)
        layer.self_attn.config._attn_implementation = 'sdpa'
    encoder_forward = model.model.encoder.forward
    @functools.wraps(encoder_forward)
    def lean_encoder(*args, **kwargs):
        kwargs['output_attentions'] = False
        return encoder_forward(*args, **kwargs)
    model.model.encoder.forward = lean_encoder
    generation = model.generation_config
    tok = tokenizer_module.get_tokenizer(True, num_languages=100, language='en', task='transcribe')
    generation.no_timestamps_token_id = tok.no_timestamps
    generation.alignment_heads = heads
    generation.lang_to_id = {f'<|{lang}|>': tok.sot + 1 + i for i, lang in enumerate(tokenizer_module.LANGUAGES)}
    generation.task_to_id = {'transcribe': tok.transcribe, 'translate': tok.translate}
    generation.is_multilingual = True
    generation.suppress_tokens = list(tok.non_speech_tokens) + [tok.sot, tok.sot_prev, tok.sot_lm, tok.no_speech]
    generation.begin_suppress_tokens = [tok.encode(' ')[0], tok.eot]
    generation.max_initial_timestamp_index = 50
    return model


def features(wav):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(wav), '-f', 'f32le', '-ar', '16000', '-ac', '1', '-'], capture_output=True, check=True).stdout
    audio = torch.from_numpy(np.frombuffer(pcm, dtype=np.float32).copy())
    duration = len(audio) / 16000
    audio = torch.nn.functional.pad(audio, (0, 480000))
    stft = torch.stft(audio, 400, 160, window=torch.hann_window(400), return_complex=True)
    power = stft[..., :-1].abs() ** 2
    filters = torch.from_numpy(np.load(PACKAGE / 'assets/mel_filters.npz')['mel_128'])
    mel = (filters @ power).clamp(min=1e-10).log10()
    mel = torch.maximum(mel, mel.max() - 8)
    return ((mel + 4) / 4).unsqueeze(0), duration


def run(language, model):
    dest = TRACK / 'final' / language / 'asr'
    dest.mkdir(exist_ok=True)
    output = dest / (MODEL_NAME + '.json')
    wav = (TRACK / 'final' / f'{TRACK_ID}_suno-v3_50_50_exakt_off_{language.upper()}.wav') if TRACK_ID == '03_SHIP_IT' else (TRACK / 'suno-0.1' / language / f'Token Burn - {language.upper()}.wav')
    if output.exists() and json.loads(output.read_text()).get('source_audio_sha256') == sha(wav):
        print(language, 'cached raw ASR exists', flush=True)
        return
    mel, duration = features(wav)
    print(language, 'transcription started', flush=True)
    started = time.monotonic()
    tok = tokenizer_module.get_tokenizer(True, num_languages=100, language=language, task='transcribe')
    segments = []
    chunks = dest / ('chunks-large-v3' if LARGE else 'chunks')
    chunks.mkdir(exist_ok=True)
    frame = 0
    while frame < round(duration * 100):
        chunkpath = chunks / f'{frame:06}.json'
        if chunkpath.exists():
            chunk = json.loads(chunkpath.read_text())
        else:
            mask = torch.zeros((1, 3000), dtype=torch.long)
            mask[:, :min(3000, round(duration * 100) - frame)] = 1
            with torch.inference_mode():
                result = model.generate(
                    mel[:, :, frame:frame+3000].to(DTYPE), attention_mask=mask, language=language, task='transcribe',
                    prompt_ids=torch.tensor([tok.sot_prev] + tok.encode(f'Commit it, ship it, build, check, live, album {"drei" if language == "de" else "three"}.')) if LARGE and TRACK_ID == '03_SHIP_IT' else (torch.tensor([tok.sot_prev] + tok.encode('Token Burn, Prompt, Build, Export, Screen.')) if LARGE else None),
                    return_timestamps=True, return_token_timestamps=True, return_segments=True,
                    condition_on_prev_tokens=False, temperature=0.0,
                    compression_ratio_threshold=2.4, logprob_threshold=-1.0,
                    no_speech_threshold=0.6, max_new_tokens=400,
                )
            collected = []
            for s in result['segments'][0]:
                ids = s['tokens'].tolist()
                stamps = s['token_timestamps'].tolist()
                text = tok.decode([i for i in ids if i < tok.eot]).strip()
                words, groups = tok.split_to_word_tokens(ids)
                offset = 0
                timed = []
                for word, group in zip(words, groups):
                    start_idx = offset
                    offset += len(group)
                    if group[0] >= tok.eot or not word.strip():
                        continue
                    a = frame / 100 + stamps[start_idx]
                    b = frame / 100 + (stamps[offset] if offset < len(stamps) else float(s['end']))
                    timed.append({'word': word.strip(), 'start': round(a, 3), 'end': round(min(duration, max(a, b)), 3)})
                collected.append({'start': frame / 100 + float(s['start']), 'end': min(duration, frame / 100 + float(s['end'])), 'text': text, 'words': timed, 'tokens': ids})
            # HF shortform covers the entire 30-second window, including its
            # own internal segment seek. No artificial word-time interpolation.
            chunk = {'source_audio_sha256': sha(wav), 'frame': frame, 'next_frame': frame + 3000, 'segments': collected}
            chunkpath.write_text(json.dumps(chunk, ensure_ascii=False, indent=2, allow_nan=False)+'\n')
            del result
            gc.collect()
        assert chunk['source_audio_sha256'] == sha(wav)
        segments.extend(chunk['segments'])
        frame = chunk['next_frame']
        print(f'{language}: saved ASR through {min(frame/100,duration):.1f}/{duration:.1f} s', flush=True)
    data = {
        'model': MODEL_ID, 'model_snapshot': str(MODEL),
        'weights_sha256': sha(WEIGHTS),
        'runtime': 'PyTorch CPU / Transformers; MLX weights converted in memory',
        'package_versions': {n: v for n, (p, v) in cached_runtime.choices.items() if n in {'torch', 'transformers', 'numpy', 'mlx_whisper', 'safetensors'}},
        'source_audio': str(wav), 'source_audio_sha256': sha(wav),
        'language': language, 'duration_seconds': duration,
        'parameters': {'temperature': 0, 'condition_on_prev_tokens': False, 'return_token_timestamps': True, 'lyrics_prompt': None, 'vocabulary_hint': (f'Commit it, ship it, build, check, live, album {"drei" if language == "de" else "three"}.' if TRACK_ID == '03_SHIP_IT' else 'Token Burn, Prompt, Build, Export, Screen.') if LARGE else None, 'chunk_seconds': 30, 'dtype': str(DTYPE), 'encoder_attention': 'SDPA, not retained', 'decoder_attention': 'eager, retained for word DTW'},
        'elapsed_seconds': round(time.monotonic() - started, 2), 'segments': segments,
    }
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    print(language, 'saved', len(segments), 'segments', flush=True)


if __name__ == '__main__':
    torch.set_num_threads(6)
    print('Loading local CPU model', flush=True)
    model = load_model()
    print('Model loaded', flush=True)
    for language in sys.argv[1:] or ['de', 'en']:
        run(language, model)
