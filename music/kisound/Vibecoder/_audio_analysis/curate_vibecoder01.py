#!/usr/bin/env python3
"""Prepare readable, explicitly provisional cues from two ASR runs for track 01.

This edits text and groups existing ASR word spans. It never changes word times.
The corrections are editorial hypotheses, not an auditory verification.
"""
import hashlib
import json
from pathlib import Path
import sys

from build_transcripts import build, tc

ROOT = Path(__file__).resolve().parent.parent / '01_Vibecoder' / 'final'

# Keys are cue IDs from the deterministic build_transcripts output. Merging
# retains every component word and its original timing in asr_words.
EDIT = {
    'de': {
        (8, 9): 'Unter der Haube: Blackbox-Schicht. Ich seh den Weg.',
        (10, 11): "Die Drähte nicht. Ich bin Vibecoder! Ich sag's, er baut's, ich test's, er fixt's.",
        (12,): 'Ich bin Vibecoder!', (14,): 'Ich bin Vibecoder!',
        (17,): 'Ich bin Vibecoder!', (22,): 'Abends. App gesucht. Store voll.',
        (26,): 'Ich bin Vibecoder!', (28,): 'Ich bin Vibecoder!',
        (30,): 'Ich bin Vibecoder!', (37,): 'Ich bin Vibecoder!',
        (39,): 'Ich bin Vibecoder!',
        (40,): 'Bass rollt durch. Bass rollt durch. Bass rollt durch. Bass rollt durch.',
        (42, 43): 'Lass ihn rollen. Lass ihn rollen. Rollen, rollen, rollen, rollen.',
        (44,): 'Ich bin Vibecoder!',
        (45, 46): 'Bass rollt durch. Bass rollt durch. Bass rollt durch. Bass rollt durch.',
        (47,): 'Prompt. Run. Check. Go.',
        (49,): 'Prompt. Run. Check. Go.',
        (50,): 'Prompt. Run. Check. Go.',
    },
    'en': {
        (5, 6): "Two, two, two checks green. Next idea's mine.",
        (7, 8): 'New coders. New pulse.',
        (13, 14): 'I say it, he builds it, I test it, he makes it right.',
        (16, 17): "If it fails, send it back till it's running tight.",
        (19, 20): 'I say it, he builds it, I test it, he makes it right.',
        (21, 22): 'A diff, a test, a commit, and the next idea takes flight.',
        (27, 28): 'Night falls. Store full. Nothing fits.',
        (30, 31): 'A screen lights up. One button works.',
        (34, 35): 'I see it, he builds it. I test it, he makes it right.',
        (36, 37): "I'm a Vibecoder! I'm a Vibecoder!",
        (39, 40): "I, I, I'm a Vibecoder. I'm a Vibecoder.",
        (42, 43): 'A diff, a test, a commit, and the next idea takes flight.',
        (45, 46): 'Not all of it. I know what I need.',
        (56, 57): 'Prompt. Run. Check. Go.',
        (58,): 'Bass rolls on.',
    },
}

BOUNDARIES = {
    'de': [(0, 'Intro'), (8, 'Instrumentaler Vorlauf'), (21, 'Verse 1'),
           (36, 'Build'), (49, 'Drop 1'), (80, 'Instrumental Break'),
           (93, 'Verse 2'), (121.9, 'Drop 2'), (145, 'Bridge'),
           (157.8, 'Final Drop'), (190, 'Outro')],
    'en': [(0, 'Intro'), (11, 'Instrumentaler Vorlauf'), (32, 'Verse 1'),
           (46, 'Build'), (59.5, 'Drop 1'), (83, 'Instrumental Break'),
           (111, 'Verse 2'), (139.5, 'Drop 2'), (165, 'Bridge'),
           (183, 'Final Drop'), (227, 'Outro')],
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def curate(language):
    # Always rebuild the automatic basis first, so a second run is identical.
    data = build(language)
    folder = ROOT / language
    original = {cue['id']: cue for cue in data['segments']}
    edits = EDIT[language]
    groups = {i: key for key in edits for i in key}
    assert len(groups) == sum(len(key) for key in edits)
    result = []
    handled = set()
    for cue_id in original:
        if cue_id in handled:
            continue
        key = groups.get(cue_id, (cue_id,))
        if key[0] != cue_id:
            continue
        parts = [original[i] for i in key]
        handled.update(key)
        cue = dict(parts[0])
        if key in edits:
            cue['text'] = edits[key]
            cue['asr_words'] = [word for part in parts for word in part['asr_words']]
            cue['asr_text'] = ' '.join(part['asr_text'] for part in parts)
            cue['start'] = cue['asr_words'][0]['start']
            cue['end'] = cue['asr_words'][-1]['end']
            cue['original_cue_ids'] = list(key)
            cue['text_source'] = 'Redaktionelle ASR-Normalisierung aus beiden Modellläufen und Referenzlyrics; keine Hörprüfung'
            cue['review_required'] = True
            cue['review_reasons'] = list(dict.fromkeys(
                [reason for part in parts for reason in part.get('review_reasons', [])]
                + ['Wortlaut redaktionell normalisiert; vor Untertiteln an der WAV nachhören.']))
            for field in ('prompt_line_index', 'matched_word_fraction', 'text_similarity', 'model_comparison'):
                cue.pop(field, None)
        result.append(cue)
    assert handled == set(original)

    if language == 'de':
        # The ASR segment crosses the Build/Drop boundary. Split only at an
        # actual word start; no proportional or invented timestamp is used.
        revised = []
        for cue in result:
            if cue.get('original_cue_ids') != [10, 11]:
                revised.append(cue)
                continue
            pivot = next(i for i, word in enumerate(cue['asr_words'])
                         if word['start'] >= 49.58)
            for words, text in (
                (cue['asr_words'][:pivot], 'Die Drähte nicht.'),
                (cue['asr_words'][pivot:], "Ich bin Vibecoder! Ich sag's, er baut's, ich test's, er fixt's."),
            ):
                piece = dict(cue)
                piece['asr_words'] = words
                piece['asr_text'] = ' '.join(word['word'] for word in words)
                piece['text'] = text
                piece['start'], piece['end'] = words[0]['start'], words[-1]['end']
                piece['review_reasons'] = cue['review_reasons'] + [
                    'Build/Drop an einer ASR-Wortgrenze geteilt; Grenzlage am Audio prüfen.']
                revised.append(piece)
        result = revised

    if language == 'en':
        # Both long and short independent passes found vocals here; the
        # automatic prompt matcher only kept a fragment at 209.14–210.72.
        result = [cue for cue in result if cue.get('original_cue_ids') != [53] and cue['id'] != 53]
        turbo_path = folder / 'asr/whisper-large-v3-turbo.json'
        turbo = json.loads(turbo_path.read_text())
        for segment in turbo['segments']:
            if not (203.7 <= segment['start'] < 212):
                continue
            words = [word for word in segment['words'] if word['end'] > word['start']]
            if not words:
                continue
            text = ('Break it down. Let it go.' if segment['start'] < 207.7 else
                    'Let it roll. Let it roll. Let it roll. Let it roll.')
            result.append({
                'start': words[0]['start'], 'end': words[-1]['end'], 'text': text,
                'section': 'Final Drop', 'asr_text': segment['text'],
                'asr_words': words, 'original_cue_ids': [],
                'text_source': 'Turbo-ASR und unabhängiges Kurzfenster; redaktionelle Normalisierung ohne Hörprüfung',
                'timing_model': 'mlx-community/whisper-large-v3-turbo / Cross-Attention DTW',
                'review_required': True,
                'review_reasons': ['Text weicht vom Referenzprompt ab und ist zwischen ASR-Fenstern strittig; an der WAV nachhören.'],
            })

    result.sort(key=lambda c: (c['start'], c['end']))
    assert all(c['asr_words'] and c['start'] == c['asr_words'][0]['start']
               and c['end'] == c['asr_words'][-1]['end'] for c in result)
    structural = []
    for index, (start, label) in enumerate(BOUNDARIES[language]):
        end = (BOUNDARIES[language][index + 1][0]
               if index + 1 < len(BOUNDARIES[language]) else data['duration_seconds'])
        structural.append({'start_s': start, 'end_s': end, 'label': label,
                           'origin': 'Redaktioneller Schnittanker aus ASR und Songform; keine exakte musikalische Downbeat-Messung'})
    vocal = []
    for section in structural:
        matches = [cue for cue in result if section['start_s'] <= cue['start'] < section['end_s']]
        if matches:
            vocal.append({'title': section['label'], 'first_vocal_start': matches[0]['start'],
                          'last_vocal_end': max(cue['end'] for cue in matches)})
            for cue in matches:
                cue['section'] = section['label']
    for index, cue in enumerate(result):
        cue['id'] = index + 1
        cue['start_timecode'] = tc(cue['start'])
        cue['end_timecode'] = tc(cue['end'])
        if index and cue['start'] < result[index - 1]['end']:
            for item in (cue, result[index - 1]):
                item['review_required'] = True
                item.setdefault('review_reasons', []).append('Überlappende automatische Wortgrenzen; nicht verschoben.')

    short = folder / 'asr/short-windows.json'
    data.update({
        'segments': result, 'sections': vocal, 'structural_sections': structural,
        'section_curation_note': 'Abschnittsgrenzen sind redaktionelle Filmanker. Gesangszeiten stammen aus ASR-Wortgrenzen, nicht aus dem Raster.',
        'short_window_asr_path': 'asr/short-windows.json',
        'short_window_asr_sha256': sha(short),
        'review_status': 'Zwei lokale Whisper-Läufe plus unabhängige kurze Fenster; redaktioneller Lyrics-Abgleich ohne manuelle Hörprüfung. Markierte Stellen vor finalen Untertiteln prüfen.',
        'curation_note': 'Die aktuellen Referenzlyrics wurden mit den beiden ASR-Läufen abgeglichen. Einzelne undeutliche oder anders gesungene Passagen bleiben offen, besonders im EN-Finale. Kein fehlender Promptsatz wird ohne ASR-Beleg als gesungen behauptet. Normalisierte Zeilen sind explizit markiert.',
    })
    base = folder / '01_Vibecoder_Transkript'
    base.with_suffix('.json').write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    base.with_suffix('.srt').write_text('\n\n'.join(
        f'{c["id"]}\n{tc(c["start"], True)} --> {tc(c["end"], True)}\n{c["text"]}'
        for c in result) + '\n')
    base.with_suffix('.txt').write_text(
        f'VIBECODER · {language.upper()}\nZeitnull: Sample 0 der finalen WAV. Vorläufige ASR; Prüfbericht beachten.\n\n'
        + '\n'.join(f'[{tc(c["start"])}–{tc(c["end"])}] {c["text"]}' for c in result) + '\n')
    report = [f'# VIBECODER · {language.upper()} – Transkriptprüfung', '',
              f'Quelle: `{data["source_audio"]}` · SHA-256 `{data["source_audio_sha256"]}` · {data["duration_seconds"]:.6f} s.', '',
              f'{len(result)} Cues, {sum(c["review_required"] for c in result)} Prüfmarkierungen. Keine manuelle Hörprüfung.', '',
              'Die WAV wurde nicht verändert. Whisper large-v3 und Turbo liefen ohne vollständigen Lyrics-Prompt; die zusätzlichen kurzen Fenster sind ebenfalls automatisch. Beide Modelle gehören zur Whisper-Familie. Wortzeiten stammen aus Cross-Attention/DTW und können bei verzerrtem Gesang abweichen.', '',
              data['curation_note'], '',
              'Bei unsicheren Zeilen ist der angezeigte Text eine Arbeitsfassung. `asr_text`, `asr_words`, ursprüngliche Cue-IDs und Prüfgründe stehen im JSON. Die SRT ist für Timing und Redaktion gedacht, noch nicht als final freigegebener Untertitel.', '',
              '## Prüffälle', '', '| Cue | Zeit | Arbeitsfassung | Roh-ASR |', '| --- | --- | --- | --- |']
    for cue in result:
        if cue['review_required']:
            report.append(f'| {cue["id"]} | {tc(cue["start"])}–{tc(cue["end"])} | {cue["text"]} | {cue["asr_text"]} |')
    report += ['', '## Referenzlyrics ohne sicheren Cue', '',
               'Ein Eintrag bedeutet auch: Die Aufnahme kann andere Worte enthalten. Keine Zeitmarke aus dem Prompt erfunden.', '']
    report += [f'- {item["section"]}: {item["text"]}' for item in data['unmatched_prompt_lines']] or ['Keine.']
    report += ['', '## Redaktionelle Songform', '', '| Abschnitt | Start | Ende |', '| --- | ---: | ---: |']
    report += [f'| {item["label"]} | {tc(item["start_s"])} | {tc(item["end_s"])} |' for item in structural]
    report += ['', 'Die Abschnittsgrenzen sind Schnittanker mit ungefährer Lage; musikalische Übergänge und alle markierten Worte vor der Endabnahme am Originalaudio prüfen.', '']
    (folder / 'TRANSKRIPT-PRUEFUNG.md').write_text('\n'.join(report))
    print(language, len(result), 'cues;', sum(c['review_required'] for c in result), 'review flags')


if __name__ == '__main__':
    for lang in sys.argv[1:] or ('de', 'en'):
        curate(lang)
