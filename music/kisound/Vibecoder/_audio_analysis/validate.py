#!/usr/bin/env python3
"""Audit delivered transcripts, analysis time bases and immutable WAV hashes."""
from pathlib import Path
import hashlib
import json
import math
import os
import re
import soundfile as sf
from PIL import Image

TRACK_ID = os.environ.get('KISOUND_AUDIO_TRACK', '02_Token_Burn')
TRACK = Path(__file__).resolve().parent.parent / TRACK_ID
EXPECTED = {
    'de': '966d9277add83aae86221f708dc00efd286b8b83c8e2afa1739847613781c9de',
    'en': 'c1cec711e9be337b18ea64cbf9e16a027207e095e1843ef6a516b404680ba73d',
}
if TRACK_ID == '03_SHIP_IT':
    EXPECTED = {}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def tc(value, comma=False):
    value = round(value * 1000)
    return f'{value//3600000:02}:{value//60000%60:02}:{value//1000%60:02}{"," if comma else "."}{value%1000:03}'


def validate(language):
    folder = TRACK / 'final' / language
    transcript_path = folder / f'{TRACK_ID}_Transkript.json'
    transcript = json.loads(transcript_path.read_text())
    analysis = json.loads((folder / 'ASTRA-AUDIO-ANALYSE.json').read_text())
    raw = json.loads((folder / transcript['raw_asr_path']).read_text())
    wav = (folder / transcript['source_audio']).resolve()
    info = sf.info(wav)
    duration = info.frames / info.samplerate
    digest = sha(wav)
    assert digest == transcript['source_audio_sha256'] == raw['source_audio_sha256'] == analysis['source']['sha256']
    if language in EXPECTED:
        assert digest == EXPECTED[language]
    assert Path(analysis['source']['path']).name == wav.name
    assert sha(transcript_path) == analysis['source']['transcript_sha256']
    assert sha(folder / transcript['raw_asr_path']) == transcript['raw_asr_sha256']
    if transcript.get('comparison_asr_path'):
        assert sha(folder / transcript['comparison_asr_path']) == transcript['comparison_asr_sha256']
    assert sha(folder / transcript['prompt_path']) == transcript['prompt_sha256'] == analysis['source']['project_prompt_sha256']
    assert analysis['source']['selection_status'] == 'final_release'
    assert abs(duration - transcript['duration_seconds']) < 1 / info.samplerate
    assert abs(duration - analysis['summary']['duration_s']) < 1 / info.samplerate
    assert analysis['summary']['samples_per_channel'] == info.frames
    assert info.samplerate == 48000 and info.channels == 2 and info.subtype == 'PCM_16'
    cues = transcript['segments']
    assert cues and [c['id'] for c in cues] == list(range(1, len(cues)+1))
    for index, cue in enumerate(cues):
        assert 0 <= cue['start'] < cue['end'] <= duration + .001
        assert cue['start'] == cue['asr_words'][0]['start']
        assert cue['end'] == cue['asr_words'][-1]['end']
        assert cue['start_timecode'] == tc(cue['start']) and cue['end_timecode'] == tc(cue['end'])
        if index and cues[index-1]['end'] > cue['start']:
            assert cue['review_required'] and cues[index-1]['review_required']
    expected_srt = '\n\n'.join(f'{c["id"]}\n{tc(c["start"],True)} --> {tc(c["end"],True)}\n{c["text"]}' for c in cues)+'\n'
    assert (folder / f'{TRACK_ID}_Transkript.srt').read_text() == expected_srt
    txt = (folder / f'{TRACK_ID}_Transkript.txt').read_text()
    assert re.findall(r'^\[.*?\] (.+)$', txt, re.M) == [c['text'] for c in cues]
    consumed = {x['source_segment_id'] for x in analysis['lyrics']['segments']}
    excluded = {x['id'] for x in analysis['lyrics']['excluded_source_segments']}
    assert consumed.isdisjoint(excluded)
    assert consumed | excluded == {c['id'] for c in cues}
    assert (folder / Path(analysis['lyrics']['review_report_path']).name).is_file()
    rows = analysis['features_100ms']['rows']
    columns = analysis['features_100ms']['columns']
    assert len(rows) == len(analysis['loudness_100ms']['rows']) == math.ceil(duration * 10)
    for index, row in enumerate(rows):
        assert len(row) == len(columns) and all(math.isfinite(x) for x in row)
        expected_time = (index*.1 + min(duration, (index+1)*.1)) / 2
        assert abs(row[0] - expected_time) < .0001
        assert all(0 <= row[i] <= 1 for i, name in enumerate(columns) if name.endswith('_drive'))
    assert analysis['sections'][0]['start_s'] == 0
    assert abs(analysis['sections'][-1]['end_s'] - duration) < .000001
    for left, right in zip(analysis['sections'], analysis['sections'][1:]):
        assert abs(left['end_s'] - right['start_s']) < .001
    assert all(0 <= x['time_s'] <= duration for x in analysis['events'])
    assert all(0 <= x['time_s'] < duration for x in analysis['onsets'])
    assert abs(sum(x['energy_fraction'] for x in analysis['spectrum']['bands']) - 1) < .0001
    with Image.open(folder / 'ASTRA-AUDIO-ANALYSE.png') as image:
        assert image.size == (2400, 1800)
        image.verify()
    for name in ['ASTRA-AUDIO-ANALYSE.md', 'TRANSKRIPT-PRUEFUNG.md']:
        assert (folder / name).stat().st_size > 100
    print(f'{language.upper()}: PASS · {len(cues)} Cues · {len(rows)} Analysefenster · WAV-SHA unverändert · JSON/SRT/TXT identisch')


if __name__ == '__main__':
    for language in ('de', 'en'):
        validate(language)
