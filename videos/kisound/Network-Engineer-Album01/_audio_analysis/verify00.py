#!/usr/bin/env python3
"""Cross-check track 00 using two local ASR models and refine lyric word times.

This is acoustic model verification, not a human listening test.
"""
import argparse
import difflib
import json
import re
import shutil
from pathlib import Path
from analyse import SOURCE, TARGET, tc, backup, sha

NAME='00_Network_Engineers'
SRC=SOURCE/NAME
DEST=TARGET/NAME
PROMPT=SRC/f'{NAME}_1.0.txt'
TRANSCRIPT=SRC/f'{NAME}_Transkript.json'
ORIGINAL=TARGET/'_audio_analysis'/'backups'/'source_transcript_00'/(TRANSCRIPT.name+'.before-asr-crosscheck')
TURBO=TARGET/'_audio_analysis'/f'{NAME}_turbo_raw.json'
LARGE=TARGET/'_audio_analysis'/f'{NAME}_large_v3_raw.json'
ALIASES={'logan':'login','surface':'service','uplinks':'uplinks','wifi':'wifi'}

def tokens(s):
    s=s.lower().replace('wi-fi','wifi').replace('up links','uplinks').replace('fell over','failover')
    return [ALIASES.get(w,w) for w in re.findall(r"[a-z0-9]+(?:'[a-z]+)?",s)]

def words(model):
    out=[]
    for seg in model['segments']:
        if seg['start']>170: continue
        source=seg.get('words',[]);i=0
        while i<len(source):
            w=source[i]
            if i+1<len(source):
                pair=(tokens(w['word']),tokens(source[i+1]['word']))
                joined={('wi','fi'):'wifi',('up','links'):'uplinks',('fell','over'):'failover'}.get((pair[0][0],pair[1][0])) if pair[0] and pair[1] else None
                if joined:
                    out.append({'token':joined,'start':float(w['start']),'end':float(source[i+1]['end']),'raw':w['word'].strip()+' '+source[i+1]['word'].strip(),'p':min(float(w.get('probability',0)),float(source[i+1].get('probability',0)))})
                    i+=2;continue
            t=tokens(w['word'])
            if not t: i+=1;continue
            for item in t:
                out.append({'token':item,'start':float(w['start']),'end':float(w['end']),'raw':w['word'].strip(),'p':float(w.get('probability',0))})
            i+=1
    return out

def align(expected,observed):
    # Global edit alignment keeps the order of all 46 transcript lines intact.
    a=[x['token'] for x in expected]; b=[x['token'] for x in observed]
    n,m=len(a),len(b); D=[[0.0]*(m+1) for _ in range(n+1)]; B=[[0]*(m+1) for _ in range(n+1)]
    for i in range(1,n+1):D[i][0]=i;B[i][0]=1
    for j in range(1,m+1):D[0][j]=j;B[0][j]=2
    for i in range(1,n+1):
        for j in range(1,m+1):
            ratio=difflib.SequenceMatcher(None,a[i-1],b[j-1]).ratio()
            cost=0 if a[i-1]==b[j-1] else .35 if ratio>=.7 else 1.0
            options=(D[i-1][j-1]+cost,D[i-1][j]+.9,D[i][j-1]+.9)
            k=min(range(3),key=lambda z:options[z]);D[i][j]=options[k];B[i][j]=k
    pairs=[];i=n;j=m
    while i or j:
        k=B[i][j]
        if k==0:
            pairs.append((i-1,j-1));i-=1;j-=1
        elif k==1:i-=1
        else:j-=1
    return list(reversed(pairs)),D[n][m]

def model_alignment(segments,raw):
    expected=[]
    for idx,s in enumerate(segments):
        for t in tokens(s['text']):expected.append({'cue':idx,'token':t})
    observed=words(raw);pairs,cost=align(expected,observed)
    grouped=[[] for _ in segments]
    for i,j in pairs:
        e=expected[i];w=observed[j]
        if e['token']==w['token'] or difflib.SequenceMatcher(None,e['token'],w['token']).ratio()>=.7:
            grouped[e['cue']].append(w)
    return grouped,cost,observed

def run(apply):
    assert TRANSCRIPT.exists() and TURBO.exists() and LARGE.exists()
    old=json.loads((ORIGINAL if ORIGINAL.exists() else TRANSCRIPT).read_text());seg=sorted(old['segments'],key=lambda x:x['id'])
    a=json.loads(TURBO.read_text());b=json.loads(LARGE.read_text())
    ga,ca,wa=model_alignment(seg,a);gb,cb,wb=model_alignment(seg,b)
    wav=SRC/f'{NAME}_0.4-1.wav';assert old['source_audio_sha256']==sha(wav)
    changes=[];new=[]
    for s,x,y in zip(seg,ga,gb):
        if not x and not y: raise RuntimeError(f'Kein Alignment für Cue {s["id"]}')
        t1=(min(w['start'] for w in x),max(w['end'] for w in x)) if x else None
        t2=(min(w['start'] for w in y),max(w['end'] for w in y)) if y else None
        if t1 and t2 and max(abs(t1[0]-t2[0]),abs(t1[1]-t2[1]))>.65:
            # Keep original time until the discrepancy is resolved.
            start,end=s['start'],s['end']; status='Modellzeiten widersprechen sich'
        else:
            use=t2 or t1
            start,end=use;status='zwei lokale ASR-Modelle' if t1 and t2 else 'ein lokales ASR-Modell'
        start=round(float(start),2);end=round(float(end),2)
        if end<=start: raise RuntimeError(f'Ungültige neue Zeit Cue {s["id"]}')
        item=dict(s,start=start,end=end,start_timecode=tc(start),end_timecode=tc(end));new.append(item)
        def span_text(model_words,matched):
            if not matched:return ''
            a=min(w['start'] for w in matched);b=max(w['end'] for w in matched)
            return ' '.join(w['raw'] for w in model_words if w['start']>=a-.01 and w['end']<=b+.01)
        model1=span_text(wa,x);model2=span_text(wb,y)
        changes.append({'id':s['id'],'old_start':s['start'],'old_end':s['end'],'new_start':start,'new_end':end,'text':s['text'],'turbo':model1,'large_v3':model2,'status':status})
    for i,s in enumerate(new):
        if i and s['start']<new[i-1]['end'] and new[i-1]['end']-s['start']<=.3:
            new[i-1]['end']=s['start'];new[i-1]['end_timecode']=tc(s['start'])
            changes[i-1]['new_end']=s['start']
        if i and s['start']<new[i-1]['start']: raise RuntimeError('Cue-Reihenfolge verletzt')
        if s['end']>old['duration_seconds']+.01: raise RuntimeError('Cue hinter Audioende')
    # Rebuild the section ranges from the same source line labels.
    sections=[]
    for sec in old['sections']:
        cues=[x for x in new if x['section']==sec['title']]
        if cues: sections.append({'title':sec['title'],'first_vocal_start':min(x['start'] for x in cues),'last_vocal_end':max(x['end'] for x in cues)})
    fixed=dict(old);fixed['segments']=new;fixed['sections']=sections
    fixed['timing_source']='Lokaler ASR-Wortabgleich mit whisper-large-v3-turbo und whisper-large-v3; keine manuelle Hörprüfung'
    fixed['text_source']='Bestehender Lyric-Prompt und Transkript; abweichende ASR-Wörter im Gegenprüfbericht'
    changed=sum(c['old_start']!=c['new_start'] or c['old_end']!=c['new_end'] for c in changes)
    max_start=max(abs(c['new_start']-c['old_start']) for c in changes)
    max_end=max(abs(c['new_end']-c['old_end']) for c in changes)
    report=['# Network Engineers – akustische Transkript-Gegenprüfung','',f'Audio `{wav.name}`, SHA-256 `{sha(wav)}`. Zwei lokal ausgeführte Whisper-Modelle wurden unabhängig auf die Original-WAV angewendet. **Dies ist keine menschliche Hörprüfung.**','',f'{len(new)} Zeilen abgeglichen; bei {changed} Zeilen wurden Zeitmarken geändert. Grösste Startverschiebung {max_start:.2f} s, grösste Endverschiebung {max_end:.2f} s. Modell-Editkosten: Turbo {ca:.1f}, Large-v3 {cb:.1f}. Die Originaltexte wurden nicht anhand eines uneindeutigen ASR-Worts umgeschrieben.','', '| ID | Zeile | Bisher | Neu | Turbo | Large-v3 | Status |','| --- | --- | --- | --- | --- | --- | --- |']
    for c in changes:
        oldtime=f'{tc(c["old_start"])}–{tc(c["old_end"])}';newtime=f'{tc(c["new_start"])}–{tc(c["new_end"])}'
        report.append(f'| {c["id"]:03d} | {c["text"]} | {oldtime} | {newtime} | {c["turbo"]} | {c["large_v3"]} | {c["status"]} |')
    report+=['','## Nicht als gesicherte Lyrics übernommen','', 'Nach dem letzten Refrain ergeben die Modelle kurze, widersprüchliche Sprachkandidaten. Ein zusätzlicher Versuch mit sprachbandgefiltertem Audio lieferte sogar Ausgaben über das tatsächliche Audioende hinaus; das zeigt, dass diese Kandidaten nicht zuverlässig sind. Ohne direkte Hörprüfung sind daraus keine zusätzlichen Gesangszeilen abzuleiten.','', '| Modell | Zeit | Kandidat |','| --- | --- | --- |']
    for label,raw in [('Turbo',a),('Large-v3',b)]:
        for segment in raw['segments']:
            if segment['start']>=170: report.append(f'| {label} | {tc(segment["start"])}–{tc(segment["end"])} | {segment["text"].strip()} |')
    report+=['','## Offene Wortkonflikte','', 'Die Modelle können ähnlich klingende Wörter mit derselben Unsicherheit treffen. Vor allem `login`/`logan`, `failover`/`fell over`, `read`/`hit` und `service`/`surface` benötigen eine menschliche Hörentscheidung, falls die exakte Wortwahl im Video sichtbar sein soll. Der Lyric-Prompt bleibt bis dahin Textquelle.','']
    reportpath=DEST/'ASTRA-TRANSKRIPT-GEGENPRUEFUNG.md';backup(reportpath);reportpath.write_text('\n'.join(report))
    if apply:
        # Source transcript files are backed up centrally, not mixed into the track folder.
        archive=TARGET/'_audio_analysis'/'backups'/'source_transcript_00';archive.mkdir(parents=True,exist_ok=True)
        for ext in ('json','srt','txt'):
            src=SRC/f'{NAME}_Transkript.{ext}';dest=archive/(src.name+'.before-asr-crosscheck')
            if not dest.exists():shutil.copy2(src,dest)
        TRANSCRIPT.write_text(json.dumps(fixed,ensure_ascii=False,indent=2)+'\n')
        srt=[]
        for i,s in enumerate(new,1):srt += [str(i),f'{tc(s["start"]).replace(".",",")} --> {tc(s["end"]).replace(".",",")}',s['text'],'']
        (SRC/f'{NAME}_Transkript.srt').write_text('\n'.join(srt))
        txt=['NETWORK ENGINEERS – TRANSKRIPT','',f'Audio: {wav.name}',f'Gesamtdauer: {tc(old["duration_seconds"])}','Sprache: Englisch','Zeitformat: HH:MM:SS.mmm','Zeitbezug: Beginn der Original-WAV','Zeitquelle: lokaler automatischer ASR-Wortabgleich; keine manuelle Hörprüfung','']
        current=None
        for i,s in enumerate(new,1):
            if s['section']!=current:
                if txt and txt[-1]!='':txt.append('')
                current=s['section'];txt.extend([f'[{current}]',''])
            txt.append(f'{i:03d}  [{tc(s["start"])} --> {tc(s["end"])}]  {s["text"]}')
        (SRC/f'{NAME}_Transkript.txt').write_text('\n'.join(txt)+'\n')
    print('Zeilen',len(new),'Zeitänderungen',sum(c['old_start']!=c['new_start'] or c['old_end']!=c['new_end'] for c in changes),'Report',reportpath,'angewendet',apply)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--apply',action='store_true');args=ap.parse_args();run(args.apply)
