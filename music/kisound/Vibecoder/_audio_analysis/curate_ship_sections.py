#!/usr/bin/env python3
"""Add editorial song sections without changing ASR words or their timing."""
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parent.parent/'03_SHIP_IT'/'final'
BOUNDARIES={
 'de':[(0,'Intro'),(27.16,'Verse 1'),(51.32,'Chorus 1'),(78.66,'Verse 2'),(98.78,'Chorus 2'),(113.0,'Bridge'),(126.0,'Chorus 3 / instrumental'),(150.6,'Outro')],
 'en':[(0,'Intro'),(14.08,'Verse 1'),(33.96,'Chorus 1'),(48.38,'Verse 2'),(70.02,'Chorus 2'),(83.0,'Bridge'),(90.7,'Chorus 3'),(107.74,'Outro')],
}

def curate(language):
    folder=ROOT/language
    path=folder/'03_SHIP_IT_Transkript.json'
    data=json.loads(path.read_text())
    boundaries=BOUNDARIES[language]
    assert boundaries[0][0]==0 and boundaries[-1][0]<data['duration_seconds']
    structural=[];vocal=[]
    for i,(start,label) in enumerate(boundaries):
        end=boundaries[i+1][0] if i+1<len(boundaries) else data['duration_seconds']
        structural.append({'start_s':start,'end_s':end,'label':label,
                           'origin':'Redaktionelle Songform; ASR-Anker und hörbare/messtechnische Übergänge, keine Wortgrenze'})
        matches=[c for c in data['segments'] if start<=c['start']<end]
        if matches:
            vocal.append({'title':label,'first_vocal_start':matches[0]['start'],'last_vocal_end':max(c['end'] for c in matches)})
        for cue in matches:
            cue['section']=label
    data['structural_sections']=structural
    data['sections']=vocal
    data['section_curation_note']='Abschnittsgrenzen sind redaktionelle Schnittanker; ASR-Wortzeiten bleiben unverändert. DE Chorus 3 enthält längere instrumentale Fläche und wenig belastbaren Gesang.' if language=='de' else 'Abschnittsgrenzen sind redaktionelle Schnittanker; ASR-Wortzeiten bleiben unverändert.'
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    report=folder/'TRANSKRIPT-PRUEFUNG.md'
    body=report.read_text()
    body+='\n## Songform für das Drehbuch\n\n'+data['section_curation_note']+'\n\n'
    body+='| Abschnitt | Start | Ende |\n| --- | ---: | ---: |\n'
    for item in structural:
        body+=f"| {item['label']} | {item['start_s']:.3f} s | {item['end_s']:.3f} s |\n"
    report.write_text(body)
    print(language,len(structural),'sections')

if __name__=='__main__':
    for language in sys.argv[1:] or ('de','en'):
        curate(language)
