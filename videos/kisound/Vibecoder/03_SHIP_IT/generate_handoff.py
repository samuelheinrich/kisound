#!/usr/bin/env python3
"""Build the bilingual SHIP IT screenplay handoff from immutable music sources."""
from bisect import bisect_right
from copy import deepcopy
import hashlib
import json
import math
from pathlib import Path
import shutil

HERE=Path(__file__).resolve().parent
WORKSPACE=next(parent for parent in (HERE,*HERE.parents) if (parent/'music/kisound').is_dir() and (parent/'videos/kisound').is_dir())
MUSIC=WORKSPACE/'music'/'kisound'/'Vibecoder'/'03_SHIP_IT'
FPS=60
STARTS={
 'de':[0,8.36,22.14,27.16,30.26,33.76,36.94,40.38,46.5,51.32,55.12,58.34,61.44,67,72,78.66,81.94,85.2,88.7,92.26,95.38,98.78,102.92,105.62,109.14,110.72,113,116.1,120.28,126,137.5,140.28,150.6,154],
 'en':[0,0.9,10.68,14.08,17.5,20.92,25.2,27.56,30.54,33.96,35,37.4,39.92,44.04,45.38,48.38,51.56,55.02,57.6,61.68,65.18,70.02,73.46,77.78,80.88,81.5,83,86.4,87.96,90.7,94.02,96.48,107.74,113.6],
}
# The same action has its own absolute cut in each original WAV.
SPECS=[
 ('room','3D','Der Release wartet','Ein nächtlicher Arbeitsplatz. Auf dem Monitor steht die neue Albumkarte neben dem alten Live-Stand. Die fünf Stationen der Release-Schiene sind dunkel.','Langsame Fahrt von der Fensterkante zum Laptop, 35 mm.','Monitorrahmen wird zur Titelkante.'),
 ('type','2D','COMMIT IT. SHIP IT.','Die Titelmarke erscheint in zwei Zeilen. Darunter liegt Album drei als noch ungeöffnete Karte. DE zeigt zuerst den hörbaren Album-drei-Einsatz; EN folgt dem frühen Hook-Ruf.','Frontal; ein kurzer Eintritt, dann ruhige Lesephase.','Titel zieht sich in die Dateileiste zurück.'),
 ('desk','3D','Alles liegt bereit','Tracks, Cover, Audio und Lyrics liegen als vier reale Ordnerkarten am Bildschirmrand. Der Cursor steht vor dem ersten Befehl.','Über-die-Schulter-Fahrt; kurzer Halt auf den vier Namen.','Ordnerkante als Match Cut zur Dateiansicht.'),
 ('screen','2D','Neue Tracks','Neue Trackdateien und zugehörige Cover erscheinen in einer gemeinsamen Liste. Jede Zeile hat genau eine Coverreferenz.','Orthogonale Gesamtansicht, dann ein lesbarer Ausschnitt.','Listenzeile schiebt zum Terminal.'),
 ('screen','2D','Build läuft','`npm run build` erzeugt Seiten. Der Prozess endet mit `BUILD PASS`; der Check steht noch aus.','Ruhiges Terminal mit höchstens drei grossen Statuszeilen.','Grüne Build-Zeile bleibt beim folgenden Rot sichtbar.'),
 ('screen','2D','Ein roter Check','`npm run check` meldet genau einen fehlenden Coverpfad. Build bleibt grün; Check ist rot.','Feste Frontalansicht, eine einzige Fehlermeldung dominant.','Fehlerpfad wird als Linie in den Dateivergleich geführt.'),
 ('screen','2D','Der Coverpfad','Referenz und wirklicher Dateiname stehen nebeneinander. Das Cover selbst liegt da, wird aber unter dem falschen Namen gesucht.','Zwei breite Spalten; keine scrollende Logwand.','Beide Namen decken sich bis zu einer Stelle.'),
 ('screen','2D','Der Unterstrich','Ein zusätzlicher Unterstrich leuchtet auf und wird entfernt. Die Dateireferenz bleibt sichtbar, während der Name sich angleicht.','Makro auf genau eine Zeichenposition; danach wieder beide Namen.','Die geschlossene Lücke wird zum grünen Check-Rahmen.'),
 ('project','hybrid','Null Fehler','Derselbe Check läuft erneut und meldet null Fehler. Erst jetzt entsteht der Release-Commit als neue Karte auf der Schiene.','Seitliche Fahrt vom Terminal zum Commit; beide Zustände bleiben lesbar.','Commit-Karte fährt in die erste Hook-Fläche.'),
 ('type','2D','Hook eins','COMMIT IT. SHIP IT. füllt das Bild. Der Commit ist sichtbar; das LIVE-Tor steht noch als Ausblick hinter der Schiene.','Frontal, Titel mindestens etwa eine Sekunde ruhig.','Unterkante der Schrift wird zur Schiene.'),
 ('project','3D','Build. Check. Live.','BUILD und CHECK sind grün. LIVE leuchtet als Projektion in der Ferne, ohne einen erfolgten Upload zu behaupten. Eine kurze COMMIT-IT/SHIP-IT-Reprise steht vor den Toren.','Dolly entlang der Stationen; Stopps auf den ersten beiden.','Projektion klappt in die nächste Hook-Zeile.'),
 ('type','hybrid','Der Ruf kehrt zurück','Die Titelmarke kehrt mit derselben Form zurück. Die Schiene bleibt darunter im echten Zustand; Album drei steht am Ende.','Erst frontal, danach geringe Parallaxe.','Die Albumkarte löst sich aus dem Wort.'),
 ('screen','2D','Album drei','Albumkarte und Cover werden gross. Der öffentliche Link ist als kommende Aktion sichtbar, aber noch nicht freigegeben.','Statische Albumansicht mit klarer Statusmarke `READY`.','Coverfarbe fliesst in das Linkfeld.'),
 ('room','3D','Der Weg nach draussen','Die Kamera verlässt kurz den Monitor und verfolgt eine orange Linie zur dunklen LIVE-Station. Der Refrain darf seine instrumentale Fläche ausspielen.','Eine kontinuierliche, langsame Fahrt am Tisch entlang.','Linie führt zurück zur Play-Vorschau.'),
 ('screen','2D','Link und Play als Ausblick','Ein Linkfeld und ein Playknopf erscheinen als Vorschau. Die echte Browserprüfung folgt erst nach Deploy und Reload.','Frontal, zwei klar getrennte Flächen.','Upload-Zähler übernimmt den freien Platz.'),
 ('project','3D','Deploy startet','Der geprüfte Stand wird hochgeladen. Ein Paket fährt aus dem Commit-Tor durch DEPLOY; LIVE bleibt noch unbestätigt.','Seitliche 35-mm-Fahrt parallel zur Schiene.','Paketkante wird zur Upload-Liste.'),
 ('screen','2D','Drei Dateigruppen','Cover, Audio und Texte werden einzeln gezählt und als übertragen markiert. Kein Passwort und keine reale Provider-Oberfläche.','Frontaler Dreispaltenaufbau, kurze Haltezeit auf der Vollständigkeit.','Vollständigkeitsrahmen wird zum Browserrahmen.'),
 ('screen','2D','Noch der alte Stand','Normaler Reload: Der Browser zeigt weiter die alte Albumübersicht. Uploadstatus bleibt separat grün.','Unbewegter Vorher-Blick, alter Albumstand klar erkennbar.','Reload-Pfeil wird kurz angehalten.'),
 ('screen','2D','Harter Reload','Der Cache wird umgangen. Dieselbe Browserposition zeigt nun Album drei; Cover und Trackliste wechseln gemeinsam.','Identischer Bildausschnitt vor und nach dem Reload.','Neue Coverfläche öffnet die Sprachansicht.'),
 ('screen','2D','Deutsch, dann Englisch','Die DE-Seite wird geprüft, dann die EN-Seite. Navigation und Beschreibung wechseln; beide Tracklisten zeigen denselben Release.','Zwei grosse Browserflächen nacheinander, gleiche Position.','Sprachschalter zieht zur Lyrics-Zeile.'),
 ('screen','2D','Lyrics im Original','Die Sprache der UI wechselt, die Lyrics der jeweiligen Aufnahme bleiben in ihrer Originalsprache. Eine einzelne erkennbare Zeile belegt das.','Ruhige Vergleichsansicht, keine winzigen Volltexte.','Die bestätigte Seite wird zum LIVE-Tor.'),
 ('type','2D','Hook zwei','COMMIT IT. SHIP IT. erscheint erneut. Jetzt ist das LIVE-Tor keine Projektion mehr: im Hintergrund steht der geöffnete Browser.','Gleiche Titelgeometrie wie zuvor, stärkerer Kontrast.','Titelkante wird zu drei Torrahmen.'),
 ('project','3D','Alle drei Tore','BUILD, CHECK und LIVE sind grün, in dieser Reihenfolge. Der Browserstatus ist aus der echten Reload-Prüfung gespeist. Die Hook-Schrift kehrt kurz vor den Toren zurück.','Dolly mit drei klaren Stationen, kein Flug durch Text.','Letztes Tor rahmt Album drei.'),
 ('type','hybrid','Album drei ist da','Die zweite Hook und die Albumkarte stehen zusammen. Der Link kann jetzt kopiert werden.','Titel frontal, dann kurzer Rückzug auf den Browser.','Linkfeld bleibt als einziges aktives Element.'),
 ('screen','2D','Link geht raus','Der öffentliche Link wird kopiert und geteilt. Die Zielseite lädt aus demselben geprüften Stand.','Frontaler Link-zu-Browser-Match-Cut.','Geladene Seite hält den Playknopf frei.'),
 ('screen','2D','Play','Ein Klick auf Play schliesst die zweite Hook. Die gewählte Original-WAV bleibt die einzige Filmtonspur.','Nahsicht auf Player und Cover, kein zusätzlicher Soundeffekt.','Play-Dreieck wird zur ersten Bridge-Karte.'),
 ('project','hybrid','Tracks. Covers.','Die Bridge beginnt mit zwei grossen Karten. Beide übernehmen die schon gesehenen echten Dateien.','Frontale Karten, kurze seitliche Verschiebung pro Wort.','Kartenkante setzt die nächste Station frei.'),
 ('project','3D','Build. Check.','Build und Check stehen nebeneinander; unter Check ist die korrigierte Coverreferenz als kleiner Beleg sichtbar.','Kurze Achsenfahrt, jeder Status frontal lesbar.','Grüner Check-Rahmen gleitet auf Deploy.'),
 ('project','3D','Deploy. Reload.','Upload und Browserprüfung bleiben getrennte Stationen. Erst der Reload macht den neuen Stand im Browser sichtbar.','Fahrt entlang der Schiene, dann Halt am Browserrahmen.','Rahmen öffnet den Schlussbogen.'),
 ('room','3D','Die Kette im Raum','Die Kamera zieht weit zurück: alle Stationen führen zu Album drei. DE nutzt die lange instrumentale Fläche; EN zeigt am frühen Schlussruf eine kurze Titel-Reprise.','Eine kontinuierliche Rückfahrt, keine eingefrorene Endkarte.','Orange Linie faltet sich zur Titelkontur.'),
 ('type','hybrid','Schlussrefrain','Die Titelmarke öffnet die vollständige Release-Kette. Bei DE ist der Titel in der langen Schlussfläche redaktionell gesetzt; ein exakter gesungener Hook ist dort nicht belegt.','Frontaler Titel, dann langsame räumliche Öffnung.','Buchstaben geben die Live-Seite frei.'),
 ('screen','2D','Die Veröffentlichung läuft','Link, Albumkarte, DE/EN-Prüfung und Player erscheinen als ein konsistenter Stand. Die Musik trägt die längere Schlussfahrt weiter.','Langsame Fahrt über dieselbe Seite, nicht über neue erfundene Inhalte.','Aktueller Commit rückt an den Rand.'),
 ('desk','3D','Nächster Commit','Eine neue Notiz erscheint am Tisch. Die aktuelle Veröffentlichung bleibt grün; die nächste Arbeit ist noch offen. Die EN-Outro-Hook prägt die Titelmarke kurz in den Rand der Commit-Karte.','Rückfahrt vom Monitor zur Hand, dann kurzer Halt.','Notiz bleibt als kleiner Lichtpunkt stehen.'),
 ('end','3D','Bis zum Audioende','Die Kamera fährt aus dem Fenster zurück. Im Monitor bleibt der fertige Release sichtbar; der neue Auftrag ist offen. Blende nach dem letzten belegten Wort und innerhalb des gemessenen Endabfalls.','Ruhige Rückfahrt, letztes Bild bis zum Originalende.','Schwarz exakt am Ende der WAV.'),
]
assert len(SPECS)==34
assert all(len(STARTS[lang])==len(SPECS) for lang in STARTS)

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda:source.read(4*1024*1024),b''):
            h.update(block)
    return h.hexdigest()

def tc(value):
    ms=round(value*1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'

def dump(path,data):
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n')

def shot_at(starts,time):
    return min(len(starts)-1,max(0,bisect_right(starts,time)-1))

def generate():
    all_sources={}; timelines={}
    for lang in ('de','en'):
        folder=MUSIC/'final'/lang
        variant=HERE/'variants'/lang
        variant.mkdir(parents=True,exist_ok=True)
        transcript_path=folder/'03_SHIP_IT_Transkript.json'
        analysis_path=folder/'ASTRA-AUDIO-ANALYSE.json'
        review_path=folder/'TRANSKRIPT-PRUEFUNG.md'
        prompt_path=folder/'03_SHIP_IT_1.0.txt'
        wav=MUSIC/'final'/f'03_SHIP_IT_suno-v3_50_50_exakt_off_{lang.upper()}.wav'
        tr=json.loads(transcript_path.read_text())
        analysis=json.loads(analysis_path.read_text())
        duration=tr['duration_seconds'];starts=STARTS[lang]
        assert analysis['source']['sha256']==tr['source_audio_sha256']==sha(wav)
        assert analysis['source']['transcript_sha256']==sha(transcript_path)
        assert all(a<b for a,b in zip(starts,starts[1:])) and starts[-1]<duration
        frames=math.ceil(duration*FPS)
        shots=[]
        for i,(zone,mode,title,action,camera,transition) in enumerate(SPECS):
            a=starts[i];b=starts[i+1] if i+1<len(starts) else duration
            shots.append({'id':f'S{i+1:03}','zone':zone,'mode':mode,'title':title,'action':action,'camera':camera,'transition':transition,
                          'start_s':a,'end_s':b,'first_frame':math.ceil(a*FPS-1e-8),
                          'end_frame_exclusive':math.ceil(b*FPS-1e-8),'start_origin':'audio start' if i==0 else 'redaktioneller Schnitt; ASR-/Analyseanker wo vorhanden',
                          'lyrics_starting_here':[],'analysis_event_ids':[]})
        for cue in tr['segments']:
            idx=shot_at(starts,cue['start'])
            shots[idx]['lyrics_starting_here'].append({'id':cue['id'],'start_s':cue['start'],'end_s':cue['end'],
                                                        'text':cue['text'],'review_required':cue['review_required']})
        for event in analysis['events']:
            idx=shot_at(starts,min(event['time_s'],duration))
            shots[idx]['analysis_event_ids'].append(event['id'])
        assert sum(len(s['lyrics_starting_here']) for s in shots)==len(tr['segments'])
        assert sum(len(s['analysis_event_ids']) for s in shots)==len(analysis['events'])
        timeline={'schema':'kisound.video.timeline.v1','language':lang,'duration_s':duration,'fps':FPS,'frames':frames,
                  'source_audio_sha256':sha(wav),'transcript_sha256':sha(transcript_path),
                  'analysis_sha256':sha(analysis_path),'shots':shots,
                  'timing_note':'Schnittzeiten sind redaktionell. ASR-Wortzeiten bleiben unverändert und markierte Texte benötigen Hörprüfung.'}
        dump(variant/'TIMELINE.json',timeline);timelines[lang]=timeline
        lines=[f'# SHIP IT · {lang.upper()} · Zeitliste','',f'{duration:.6f} s · {frames} Bilder bei 60 fps · {len(shots)} Einstellungen.','',
               'Schnitte sind redaktionell. Unklare ASR-Zeilen werden durch Bildhandlung getragen; vollständige Untertitel bleiben bis zur Hörprüfung ausgeschaltet.','',
               '| Shot | Zeit | Regie | Zugeordnete Lyrics / Ereignisse |','| --- | --- | --- | --- |']
        for shot in shots:
            cues=[f'L{x["id"]:03} {x["text"]}'+(' **PRÜFEN**' if x['review_required'] else '') for x in shot['lyrics_starting_here']]
            cues+=shot['analysis_event_ids']
            lines.append(f'| {shot["id"]} | {tc(shot["start_s"])}–{tc(shot["end_s"])} | **{shot["title"]}** · {shot["mode"]}. {shot["action"]}<br>Kamera: {shot["camera"]}<br>Übergang: {shot["transition"]} | {"; ".join(cues) if cues else "Instrumental / Fortsetzung"} |')
        (variant/'SHOTLIST.md').write_text('\n'.join(lines)+'\n')
        for name in ('ASTRA-AUDIO-ANALYSE.md','ASTRA-AUDIO-ANALYSE.json','ASTRA-AUDIO-ANALYSE.png','TRANSKRIPT-PRUEFUNG.md'):
            shutil.copy2(folder/name,variant/name)
        all_sources[lang]={'duration_s':duration,'samples_per_channel':analysis['summary']['samples_per_channel'],
                           'frames_60fps':frames,'inputs':{key:{'path':f'../../../../music/kisound/Vibecoder/03_SHIP_IT/{rel}','sha256':sha(path)} for key,rel,path in [
                               ('transcript',f'final/{lang}/03_SHIP_IT_Transkript.json',transcript_path),
                               ('prompt',f'final/{lang}/03_SHIP_IT_1.0.txt',prompt_path),
                               ('analysis',f'final/{lang}/ASTRA-AUDIO-ANALYSE.json',analysis_path),
                               ('review',f'final/{lang}/TRANSKRIPT-PRUEFUNG.md',review_path),
                               ('audio',f'final/{wav.name}',wav),
                               ('cover','03_SHIP_IT_cover.png',MUSIC/'03_SHIP_IT_cover.png')]}}
    regie=[]
    for i,(zone,mode,title,action,camera,transition) in enumerate(SPECS):
        regie.append({'id':f'S{i+1:03}','starts_s':{lang:STARTS[lang][i] for lang in ('de','en')},
                      'ends_s':{lang:timelines[lang]['shots'][i]['end_s'] for lang in ('de','en')},
                      'zone':zone,'mode':mode,'title':title,'action':action,'camera':camera,'transition':transition})
    dump(HERE/'REGIE-CUES.json',{'schema':'kisound.video.screenplay.v1','status':'authored screenplay, not implemented','shots':regie})
    dump(HERE/'SOURCE-MANIFEST.json',{'schema':'kisound.video.screenplay.sources.v1','album':'Vibecoder','track':'03_SHIP_IT',
                                     'intended_project_root':str(WORKSPACE/'videos/kisound/Vibecoder/03_SHIP_IT'),
                                     'path_base':'intended_project_root','fps':FPS,'variants':all_sources})
    lines=['# Schnittliste · SHIP IT','',f'{len(SPECS)} Einstellungen pro Sprachfassung. Absolute Zeiten ab Sample 0 der jeweiligen finalen WAV. Schnitte sind redaktionell; Wortzeiten bleiben als ASR-Anker markiert.','',
           '| Shot | DE Start–Ende | EN Start–Ende | Raum / Modus | Handlung, Kamera und Übergang |','| --- | --- | --- | --- | --- |']
    for i,(zone,mode,title,action,camera,transition) in enumerate(SPECS):
        de=timelines['de']['shots'][i];en=timelines['en']['shots'][i]
        lines.append(f'| S{i+1:03} | {tc(de["start_s"])}–{tc(de["end_s"])} | {tc(en["start_s"])}–{tc(en["end_s"])} | {zone} · {mode} | **{title}**. {action}<br>**Kamera:** {camera}<br>**Übergang:** {transition} |')
    (HERE/'SCHNITTLISTE.md').write_text('\n'.join(lines)+'\n')
    for lang in ('de','en'):
        # Title locations are designed graphic entries. Distorted words are not silently corrected in the transcript.
        hook_windows={'de':[(51.32,54.44),(55.12,58.22),(98.78,102.24),(102.92,105.62)],
                      'en':[(0,4.3),(6.96,10.4),(33.96,35),(37.4,38.4),(70.02,72.6),(73.46,74.8),(90.7,91.42),(94.02,94.98),(107.74,108.7)]}[lang]
        tr=json.loads((MUSIC/'final'/lang/'03_SHIP_IT_Transkript.json').read_text())
        keywords=[]
        for n,(a,b) in enumerate(hook_windows,1):
            nearby=min(tr['segments'],key=lambda c:abs(c['start']-a))
            idx=1 if lang=='en' and n==1 else shot_at(STARTS[lang],a)
            keywords.append({'id':f'H{n:02}','text':'COMMIT IT. SHIP IT.','shot_id':f'S{idx+1:03}',
                             'start_s':a,'vocal_end_s':b,'visual_end_s':min(timelines[lang]['shots'][idx]['end_s'],max(b,a+1.1)),
                             'visual_start_s':max(a,STARTS[lang][idx]),
                             'source_segment_id':nearby['id'],'source_text':nearby['asr_text'],
                             'review_required':True,'timing_note':'ASR-Phrasenfenster; stark bearbeitete Hook, Wortlaut und Grenzen am Originalaudio prüfen',
                             'treatment':'flat' if n==1 else ('live_gate' if n>=3 else 'rail'),
                             'entry_s':0.12,'exit_s':0.18,'syllable_times_inferred':False})
        dump(HERE/'variants'/lang/'KEYWORDS.json',{'schema':'kisound.video.keywords.v1','language':lang,
              'audio_sha256':timelines[lang]['source_audio_sha256'],'keywords':keywords,
              'note':'Gestalteter Hooktext stammt aus finalen Lyrics. Rohes ASR bleibt im Transkript erhalten. DE-Schlussfläche S031 hat keinen bestätigten Hook-Wortanker.'})
    print('Generated',len(SPECS),'shots for DE and EN')

if __name__=='__main__':
    generate()
