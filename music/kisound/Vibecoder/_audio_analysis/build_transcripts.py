#!/usr/bin/env python3
"""Build auditable lyric cues from actual ASR word times and final prompt text."""
from pathlib import Path
import difflib
import hashlib
import json
import os
import re
import unicodedata

TRACK_ID = os.environ.get('KISOUND_AUDIO_TRACK', '02_Token_Burn')
TRACK_TITLE = {'01_Vibecoder': 'VIBECODER', '02_Token_Burn': 'TOKEN BURN',
               '03_SHIP_IT': 'SHIP IT'}.get(TRACK_ID, TRACK_ID)
TRACK = Path(__file__).resolve().parent.parent / TRACK_ID


def norm(text):
    return ''.join(c for c in unicodedata.normalize('NFKC', text).casefold() if c.isalnum())


def tc(seconds, comma=False):
    ms = round(seconds * 1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}{"," if comma else "."}{ms%1000:03}'


def align(a, b):
    """Monotonic token alignment; insertions allow actual extra sung reprises."""
    n, m = len(a), len(b)
    costs = [[0.] * (m + 1) for _ in range(n + 1)]
    directions = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        costs[i][0], directions[i][0] = i, 'delete'
    for j in range(1, m + 1):
        costs[0][j], directions[0][j] = j, 'insert'
    similarity = {}
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            pair = a[i-1], b[j-1]
            score = similarity.setdefault(pair, difflib.SequenceMatcher(None, *pair).ratio())
            substitution = 0 if pair[0] == pair[1] else (0.45 if score >= .72 else 1.5)
            choices = [(costs[i-1][j-1] + substitution, 'match'), (costs[i-1][j] + 1, 'delete'), (costs[i][j-1] + 1, 'insert')]
            costs[i][j], directions[i][j] = min(choices, key=lambda x: x[0])
    matches = {}
    i, j = n, m
    while i or j:
        direction = directions[i][j]
        if direction == 'match':
            score = similarity[(a[i-1], b[j-1])]
            if score >= .72:
                matches[i-1] = j-1
            i -= 1
            j -= 1
        elif direction == 'delete':
            i -= 1
        else:
            j -= 1
    return matches


def build(language, raw_override=None, save=True):
    dest = TRACK / 'final' / language
    preferred = 'asr/whisper-large-v3-curated.json' if (dest / 'asr/whisper-large-v3-curated.json').exists() else ('asr/whisper-large-v3.json' if (dest / 'asr/whisper-large-v3.json').exists() else 'asr/whisper-large-v3-turbo.json')
    rawpath = raw_override or dest / preferred
    raw = json.loads(rawpath.read_text())
    promptpath = dest / f'{TRACK_ID}_1.0.txt'
    prompt = promptpath.read_text()
    release = re.search(r'^RELEASE AUDIO:\s*(.+)$', prompt, re.M).group(1)
    wav = (dest / release).resolve()
    digest = hashlib.sha256(wav.read_bytes()).hexdigest()
    assert digest == raw['source_audio_sha256']
    duration = raw['duration_seconds']
    lyrics = prompt.split('LYRIC PROMPT:', 1)[1].split('STYLE PROMPT:', 1)[0]
    lines, tokens = [], []
    section, counts = '', {}
    for line in lyrics.strip().splitlines():
        if line.startswith('['):
            label = line.strip('[]')
            counts[label] = counts.get(label, 0) + 1
            section = label + (f' {counts[label]}' if label == 'Chorus' else '')
        elif line.strip():
            words = ['tokenburn'] if norm(line) == 'tokenburn' else [norm(w) for w in line.split() if norm(w)]
            first = len(tokens)
            tokens.extend(words)
            lines.append({'text': line.strip(), 'section': section, 'first': first, 'last': len(tokens)-1})
    words, rejected = [], []
    for sid, segment in enumerate(raw['segments']):
        hint = raw['parameters'].get('vocabulary_hint')
        hint_words = {norm(w) for w in hint.split()} if hint else set()
        heard_words = {norm(w['word']) for w in segment['words'] if norm(w['word'])}
        collapsed = sum(w['end'] <= w['start'] for w in segment['words'])
        if hint and len(heard_words) >= 3 and heard_words.issubset(hint_words) and collapsed >= len(segment['words']) / 3:
            rejected.extend({**w, 'asr_segment_index': sid, 'exclusion_reason': 'ASR kopiert den Vokabularhinweis mit zusammengefallenen Wortgrenzen; kein belegter Gesang.'} for w in segment['words'] if norm(w['word']))
            continue
        for word in segment['words']:
            word = {**word, 'asr_segment_index': sid}
            if norm(word['word']) and 0 <= word['start'] < duration and word['end'] >= word['start']:
                words.append(word)
            elif norm(word['word']):
                rejected.append(word)
    words.sort(key=lambda x: (x['start'], x['asr_segment_index']))
    merged = []
    for word in words:
        if merged and norm(merged[-1]['word']) in {'token', 'talking', 'toten', 'tot'} and norm(word['word']) == 'burn' and word['start'] - merged[-1]['end'] < 1.5:
            previous = merged.pop()
            merged.append({**previous, 'word': previous['word'] + ' ' + word['word'], 'end': word['end'], 'asr_component_words': [previous, word]})
        else:
            merged.append(word)
    words = merged
    matching = align(tokens, [norm(w['word']) for w in words])
    cues, omitted, used = [], [], set()
    for line_index, line in enumerate(lines):
        indices = [matching[i] for i in range(line['first'], line['last']+1) if i in matching]
        coverage = len(indices) / (line['last'] - line['first'] + 1)
        anchored = line['first'] in matching and line['last'] in matching
        if coverage < .65 or not anchored or not indices:
            omitted.append({**line, 'matched_word_fraction': round(coverage, 3), 'reason': 'Zu wenig ASR-Beleg oder fehlender erster/letzter Wortanker; keine Zeit erfunden.'})
            continue
        lo, hi = min(indices), max(indices)
        evidence = words[lo:hi+1]
        asrtext = ' '.join(w['word'] for w in evidence)
        similarity = difflib.SequenceMatcher(None, norm(line['text']), norm(asrtext)).ratio()
        # A single acoustically similar wrong word can still leave a very close
        # full-line match. Require stricter text similarity below 85% anchors.
        if similarity < (.9 if coverage < .85 else .82) or evidence[-1]['end'] <= evidence[0]['start']:
            omitted.append({**line, 'matched_word_fraction': round(coverage, 3), 'reason': 'ASR-Text oder Wortgrenzen passen nicht ausreichend; Rohtext separat übernommen.'})
            continue
        reasons = []
        if coverage < 1 or norm(asrtext) != norm(line['text']):
            reasons.append('ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen.')
        if any(w['end'] <= w['start'] for w in evidence):
            reasons.append('Mindestens ein Wort hat eine zusammengefallene DTW-Zeitgrenze.')
        if evidence[-1]['end'] - evidence[0]['start'] > 12:
            reasons.append('Lange Zeilengrenze; Gesangsausklang und Instrumentallücke prüfen.')
        timing_models = sorted({w.get('source_model', raw['model']) for w in evidence})
        cues.append({'start': evidence[0]['start'], 'end': evidence[-1]['end'], 'text': line['text'], 'section': line['section'],
                     'prompt_line_index': line_index, 'timing_model': ' + '.join(timing_models) + ' / Cross-Attention DTW',
                     'text_source': 'Finale Lyrics, monotonic mit unabhängig erkanntem ASR-Text abgeglichen',
                     'asr_text': asrtext, 'asr_words': evidence, 'matched_word_fraction': round(coverage, 3),
                     'text_similarity': round(similarity, 3), 'review_required': bool(reasons), 'review_reasons': reasons})
        used.update(range(lo, hi+1))
    # Preserve unsupported/extra sung words as actual ASR rather than forcing the prompt.
    leftovers = [i for i in range(len(words)) if i not in used]
    group = []
    def flush():
        if not group:
            return
        evidence = [words[i] for i in group]
        if norm(' '.join(w['word'] for w in evidence)) == 'thankyou' and rawpath.name != 'whisper-large-v3-turbo.json':
            otherraw = json.loads((dest / 'asr/whisper-large-v3-turbo.json').read_text())
            otherwords = [w['word'] for s in otherraw['segments'] for w in s['words'] if evidence[0]['start']-.5 <= w['start'] <= evidence[-1]['end']+.5]
            if 'thankyou' not in norm(' '.join(otherwords)):
                rejected.extend({**w, 'exclusion_reason': 'Kurze ASR-Floskel ohne Lyrics- oder Turbo-Beleg; möglicher Halluzinationsrest, nicht als Untertitel übernommen.'} for w in evidence)
                group.clear()
                return
        if evidence[-1]['end'] > evidence[0]['start']:
            closest = min(cues, key=lambda c: abs(c['start'] - evidence[0]['start'])) if cues else None
            cues.append({'start': evidence[0]['start'], 'end': evidence[-1]['end'], 'text': ' '.join(w['word'] for w in evidence),
                         'section': closest['section'] if closest else 'ASR', 'text_source': 'Unveränderter ASR-Text; zusätzliche oder unzureichend zuordenbare Wörter',
                         'asr_text': ' '.join(w['word'] for w in evidence), 'asr_words': evidence,
                         'review_required': True, 'review_reasons': ['ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen.']})
        else:
            rejected.extend(evidence)
        group.clear()
    for i in leftovers:
        if group and (i != group[-1]+1 or words[i]['start'] - words[group[-1]]['end'] > 1.5 or len(group) >= 8 or words[i]['asr_segment_index'] != words[group[-1]]['asr_segment_index']):
            flush()
        group.append(i)
    flush()
    comparison_path = dest / 'asr/whisper-large-v3-turbo.json'
    if save and rawpath != comparison_path and comparison_path.exists():
        alternate = build(language, comparison_path, save=False)
        filled = {c['prompt_line_index'] for c in cues if 'prompt_line_index' in c}
        for candidate in alternate['segments']:
            line_index = candidate.get('prompt_line_index')
            if line_index is None or line_index in filled:
                continue
            if any('prompt_line_index' in c and min(c['end'], candidate['end']) - max(c['start'], candidate['start']) > .15 for c in cues):
                continue
            revised = []
            for cue in cues:
                if 'prompt_line_index' in cue:
                    revised.append(cue)
                    continue
                remaining_groups, group_words = [], []
                for word in cue['asr_words']:
                    overlap = max(0, min(word['end'], candidate['end']+.05) - max(word['start'], candidate['start']-.05))
                    covered = overlap >= max(.001, (word['end'] - word['start']) * .5) or candidate['start']-.05 <= word['start'] < candidate['end']+.05
                    if covered:
                        if group_words:
                            remaining_groups.append(group_words)
                            group_words = []
                    else:
                        group_words.append(word)
                if group_words:
                    remaining_groups.append(group_words)
                for remaining in remaining_groups:
                    if remaining[-1]['end'] <= remaining[0]['start']:
                        continue
                    text = ' '.join(w['word'] for w in remaining)
                    revised.append({**cue, 'start': remaining[0]['start'], 'end': remaining[-1]['end'], 'text': text, 'asr_text': text, 'asr_words': remaining})
            candidate = {**candidate, 'review_required': True, 'review_reasons': candidate['review_reasons'] + ['Lyrics-Zeile aus Turbo-Wortzeiten ergänzt; large-v3 konnte sie nicht ausreichend zuordnen.']}
            cues = revised + [candidate]
            filled.add(line_index)
        omitted = [line for index, line in enumerate(lines) if index not in filled]
        for line in omitted:
            line['reason'] = 'Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.'
    cues.sort(key=lambda x: (x['start'], x['end']))
    comparison_words = []
    if rawpath != comparison_path and comparison_path.exists():
        comparison = json.loads(comparison_path.read_text())
        assert comparison['source_audio_sha256'] == digest
        comparison_words = [w for s in comparison['segments'] for w in s['words'] if norm(w['word']) and w['end'] > w['start'] and w['start'] < duration]
    sections = []
    for i, cue in enumerate(cues):
        cue['id'] = i+1
        cue['start_timecode'], cue['end_timecode'] = tc(cue['start']), tc(cue['end'])
        cue.setdefault('timing_model', ' + '.join(sorted({w.get('source_model', raw['model']) for w in cue['asr_words']})) + ' / Cross-Attention DTW')
        if comparison_words:
            other = [w for w in comparison_words if cue['start']-.15 <= w['start'] < cue['end']-.05]
            othertext = ' '.join(w['word'] for w in other)
            similarity = difflib.SequenceMatcher(None, norm(cue['text']), norm(othertext)).ratio()
            cue['model_comparison'] = {'model': 'whisper-large-v3-turbo', 'text_in_same_time_window': othertext, 'text_similarity': round(similarity, 3), 'status': 'Text im gleichen Zeitfenster, keine unabhängige Hörbestätigung'}
            if similarity < .75:
                cue['review_required'] = True
                cue['review_reasons'].append('Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab.')
        if i and cue['start'] < cues[i-1]['end']:
            for c in [cues[i-1], cue]:
                c['review_required'] = True
                c['review_reasons'].append('Überlappende ASR-Zeitgrenze; keine automatische Verschiebung.')
        if sections and sections[-1]['title'] == cue['section']:
            sections[-1]['last_vocal_end'] = max(sections[-1]['last_vocal_end'], cue['end'])
        else:
            sections.append({'title': cue['section'], 'first_vocal_start': cue['start'], 'last_vocal_end': cue['end']})
    data = {
        'title': TRACK_TITLE + ' · ' + language.upper(), 'source_audio': release,
        'source_audio_sha256': digest, 'duration_seconds': duration, 'languages': [language],
        'time_origin': 'Sample 0 der unveränderten finalen WAV; keine Kürzung, kein Offset',
        'timing_source': f'Lokale ASR ({raw.get("runtime", "Laufzeit unbekannt")}) mit Cross-Attention/DTW-Wortzeiten; keine aus Lyrics geschätzten Zeiten',
        'text_source': 'Finale Lyrics nur bei ausreichender monotoner ASR-Übereinstimmung; sonst Rohtext, explizit markiert',
        'review_status': 'Automatische ASR mit Lyrics-Abgleich; keine manuelle Hörprüfung; markierte Stellen vor Video-Endabnahme prüfen',
        'raw_asr_path': str(rawpath.relative_to(dest)), 'raw_asr_sha256': hashlib.sha256(rawpath.read_bytes()).hexdigest(),
        'asr_parameters': raw['parameters'],
        'asr_curation_note': raw.get('curation_note'),
        'asr_excluded_segments': raw.get('excluded_segments', []),
        'comparison_asr_path': 'asr/whisper-large-v3-turbo.json' if 'whisper-large-v3.json' == rawpath.name else None,
        'comparison_asr_sha256': hashlib.sha256(comparison_path.read_bytes()).hexdigest() if comparison_words else None,
        'prompt_path': promptpath.name, 'prompt_sha256': hashlib.sha256(promptpath.read_bytes()).hexdigest(),
        'timing_uncertainty_note': '20-ms-DTW-Raster ist keine Genauigkeitsgarantie; Gesang und Effekte können Wortgrenzen verschieben.',
        'sections': sections, 'segments': cues, 'unmatched_prompt_lines': omitted, 'excluded_asr_words': rejected,
    }
    if not save:
        return data
    base = dest / f'{TRACK_ID}_Transkript'
    base.with_suffix('.json').write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n')
    base.with_suffix('.srt').write_text('\n\n'.join(f'{c["id"]}\n{tc(c["start"],True)} --> {tc(c["end"],True)}\n{c["text"]}' for c in cues)+'\n')
    base.with_suffix('.txt').write_text(f'{TRACK_TITLE} · {language.upper()}\nZeitnull: Beginn der finalen WAV. Automatisches Transkript; Prüffragen im JSON und TRANSKRIPT-PRUEFUNG.md.\n\n' + '\n'.join(f'[{tc(c["start"])}–{tc(c["end"])}] {c["text"]}' for c in cues)+'\n')
    report = [f'# {TRACK_TITLE} · {language.upper()} – Transkriptprüfung', '',
              f'{len(cues)} Cues, {sum(c["review_required"] for c in cues)} Prüfmarkierungen, {len(omitted)} nicht ausreichend zugeordnete Promptzeilen.', '',
              f'Quelle: `{release}` · SHA-256 `{digest}` · {duration:.6f} s.', '',
              f'Modell: `{raw["model"]}`, Laufzeit `{raw.get("runtime", "unbekannt")}`. Keine vollständigen Lyrics als ASR-Prompt; keine manuelle Hörprüfung. Rohdaten stehen unter `{rawpath.relative_to(dest)}`. Vokabularhinweis: `{raw["parameters"].get("vocabulary_hint")}`.', '',
              ('Der Turbo-Durchlauf ohne Vokabularhinweis wurde im jeweils gleichen Zeitfenster zum Textvergleich herangezogen. Unter 75 % Textähnlichkeit entsteht eine zusätzliche Prüfmarkierung. Beide Modelle gehören zur Whisper-Familie; ihre Übereinstimmung ist keine unabhängige Hörbestätigung.' if comparison_words else 'Bisher ein Modelllauf; keine zweite Modellprüfung.'), '',
              'Zeilenzeiten stammen aus den ersten/letzten tatsächlichen ASR-Wortgrenzen. Monotone Wortausrichtung berücksichtigt die Refrainfolge. Der Lyrics-Wortlaut wird bei mindestens 85 % Wortankern, beiden Randankern und mindestens 82 % Textähnlichkeit übernommen; bei 65–85 % Wortankern gilt die strengere Textähnlichkeit von 90 %. Wiederholte Hook-Zeilen werden in ihrer gesungenen Reihenfolge abgeglichen. Diese Grenzwerte sind Heuristiken, keine akustischen Konfidenzen. Unzugeordnete Wörter bleiben als markierter Rohtext erhalten; fehlende Zeilen erhalten keine erfundenen Zeiten.', '',
              'Alle automatischen Zeiten bleiben vorläufig. JSON, SRT und TXT enthalten dieselbe Cueliste. Das JSON erhält auch Rohtext, Wortzeiten, Änderungen und Prüffelder.', '',
              '| Cue | Zeit | Anzeige | ASR | Prüfgrund |', '| --- | --- | --- | --- | --- |']
    for c in cues:
        if c['review_required']:
            report.append(f'| {c["id"]} | {tc(c["start"])}–{tc(c["end"])} | {c["text"]} | {c["asr_text"]} | {" ".join(c["review_reasons"])} |')
    if raw.get('curation_note'):
        report += ['', '## Auswahl der ASR-Fenster', '', raw['curation_note'], '', f'{len(raw.get("excluded_segments", []))} volle Segmente wurden durch kürzere Gegenfenster ersetzt oder ausgeschlossen; Belege im Roh-JSON.']
    report += ['', '## Nicht ausreichend zugeordnete Promptzeilen', '']
    report += [f'- {x["section"]}: {x["text"]} — {x["reason"]}' for x in omitted] or ['Keine.']
    report += ['', '## Ausgeschlossene ASR-Einträge', '']
    report += [f'- `{tc(w["start"])}–{tc(w["end"])}` {w["word"]}: {w.get("exclusion_reason", "Zusammengefallene oder nicht verwendbare Wortzeit.")}' for w in rejected] or ['Keine.']
    report += ['', f'{len(rejected)} Wörter mit nicht verwendbarer Einzelzeit ausgeschlossen; Belege im JSON. Separate Satzzeichen werden nicht als eigene Wörter angezeigt. Bei einer anderen WAV beide Ergebnisse neu erzeugen.', '']
    (dest / 'TRANSKRIPT-PRUEFUNG.md').write_text('\n'.join(report))
    print(language, len(cues), 'cues;', sum(c['review_required'] for c in cues), 'review flags;', len(omitted), 'unmatched prompt lines')
    return data


if __name__ == '__main__':
    for language in ['de', 'en']:
        build(language)
