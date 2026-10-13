#!/usr/bin/env python3
"""Reproducible, single-track-at-a-time analysis for Network Engineer Album 01."""
import argparse
import hashlib
import json
import math
import re
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import soundfile as sf
from scipy import signal

HERE = Path(__file__).resolve().parent
TARGET = HERE.parent
SOURCE = HERE.parents[3] / 'music' / 'kisound' / TARGET.name
TRACKS = ['00_Network_Engineers','01_Layer_2','02_OSPF_Neighbors','03_Its_Always_DNS','04_Destination_Unreachable','05_WiFi_Roaming','06_Multicast','07_Firewall_State_Table']
BANDS = [('sub_20_60',20,60),('bass_60_250',60,250),('lowmid_250_500',250,500),('mid_500_2000',500,2000),('presence_2000_6000',2000,6000),('high_6000_12000',6000,12000),('air_12000_20000',12000,20000)]
OUTFILES = ['ASTRA-AUDIO-ANALYSE.md','ASTRA-AUDIO-ANALYSE.json','ASTRA-AUDIO-ANALYSE.png','ASTRA-DREHBUCH.md']
VISUAL_ACTIONS = {
 '00_Network_Engineers':('Statuspunkt der Leitwarte einmal aufleuchten lassen','Stadtverbindungen und Kameraraum öffnen','Warnanzeigen zurücknehmen und die Nachtwache in Nahaufnahme halten'),
 '01_Layer_2':('Einen Frame an einem Porttor einrasten lassen','Mehr Portfassaden und VLAN-Wege sichtbar machen','Frame-Verkehr reduzieren und MAC-Matrix hervorheben'),
 '02_OSPF_Neighbors':('Einen Routerknoten im Atlas aufleuchten lassen','Weitere Kartenverbindungen in der Totale öffnen','Karte auf einen Link und seine Kosten verengen'),
 '03_Its_Always_DNS':('Einen DNS-Antwortumschlag auf die Fallakte schlagen','Abfragekette und Suchlicht räumlich öffnen','Fallakte auf einen einzelnen Resolver konzentrieren'),
 '04_Destination_Unreachable':('Einen neuen Hop-Stempel auf die Nebelkarte setzen','Weitere Pfadmarken in der Landschaft sichtbar machen','Kamerafahrt an einer unvollständigen Antwort anhalten'),
 '05_WiFi_Roaming':('Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen','Funkraum und seitliche Kamerafahrt erweitern','Figur in der schwachen Funkzelle kurz zögern lassen'),
 '06_Multicast':('Einen Zuhörersitz als Mitglied markieren','Verteilbaum zu weiteren interessierten Sitzen öffnen','Unbestellte Zweige verdunkeln und Bühne verkleinern'),
 '07_Firewall_State_Table':('Eine Zustandskarte am Tor einrasten lassen','Erlaubte Verbindungswege der Halle öffnen','Regelzeile und Deny-Tor in Nahaufnahme isolieren')}

def tc(t):
    m = int(round(t*1000)); return f'{m//3600000:02d}:{m//60000%60:02d}:{m//1000%60:02d}.{m%1000:03d}'
def db(x): return float(20*np.log10(max(float(x),1e-12)))
def roundf(x,n=3): return round(float(x),n) if np.isfinite(x) else None
def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for b in iter(lambda:f.read(4*1024*1024),b''): h.update(b)
    return h.hexdigest()
def backup(dest):
    if dest.exists():
        archive=TARGET/'_audio_analysis'/'backups'/dest.parent.name
        archive.mkdir(parents=True,exist_ok=True)
        p=archive/(dest.name+'.bak-'+datetime.now().strftime('%Y%m%d-%H%M%S-%f'))
        shutil.copy2(dest,p)
def write(dest,content,binary=False):
    backup(dest)
    if binary: dest.write_bytes(content)
    else: dest.write_text(content,encoding='utf-8')
def ff_loud(path):
    p=subprocess.run(['ffmpeg','-hide_banner','-nostats','-loglevel','verbose','-i',str(path),'-filter_complex','ebur128=peak=true:framelog=verbose','-f','null','-'],capture_output=True,text=True,check=True)
    s=p.stderr; tail=s[s.rfind('Summary:'):]
    def val(pattern):
        m=re.search(pattern,tail); return float(m.group(1)) if m else None
    frames=[]
    for line in s.splitlines():
        m=re.search(r't:\s*([\d.]+)\s+TARGET:.*?M:\s*([\-\d.inf]+).*?S:\s*([\-\d.inf]+)',line)
        if m: frames.append((float(m[1]),float(m[2]),float(m[3])))
    return {'integrated_lufs':val(r'Integrated loudness:\s*I:\s*([\-\d.]+)'), 'lra_lu':val(r'Loudness range:\s*LRA:\s*([\-\d.]+)'), 'true_peak_dbtp_rounded':val(r'True peak:\s*Peak:\s*([\-\d.]+)'), 'frames':frames}
def pick_lyrics(src, dur):
    cues=[]; excluded=[]
    prompt_text=(SOURCE/'03_Its_Always_DNS'/'03_Its_Always_DNS_1.0.txt').read_text().lower() if src.get('title')=='Its Always DNS' else ''
    for c in sorted(src['segments'],key=lambda x:(x['start'],x['end'])):
        s,e=float(c['start']),float(c['end']); line=c['text'].strip()
        if s<0 or e>dur+0.05 or e<=s:
            excluded.append({'id':c['id'],'reason':'Zeit ausserhalb der Audiodauer'}); continue
        if line.lower().rstrip('.') in {'final chorus','verse two','bridge'}:
            excluded.append({'id':c['id'],'reason':'Abschnittsname statt Gesang'}); continue
        if src.get('title')=='Its Always DNS' and s>=200:
            norm=re.sub(r'[^a-z0-9 ]','',line.lower()).strip()
            all_prompt=re.sub(r'[^a-z0-9 ]','',prompt_text)
            if norm in {'the answer was in the name','welcome back','welcome back to the dns mess','resolver says no','cache says yes','not the network','its dns','dns'} or (len(norm)>5 and norm not in all_prompt):
                excluded.append({'id':c['id'],'reason':'späte automatische Zeile nicht durch Lyric-Prompt gestützt'}); continue
        if any(abs(s-x['start_s'])<0.12 and abs(e-x['end_s'])<0.15 and line==x['text'] for x in cues):
            excluded.append({'id':c['id'],'reason':'identische doppelte Zeile'}); continue
        # Strongly overlapping auto-aligned reprises are not a defensible second vocal stream.
        if any(max(0,min(e,x['end_s'])-max(s,x['start_s']))/min(e-s,x['end_s']-x['start_s'])>.5 for x in cues[-3:]):
            excluded.append({'id':c['id'],'reason':'stark überlappendes Transkriptsegment'}); continue
        cues.append({'id':f'L{len(cues)+1:03d}','start_s':s,'end_s':e,'text':line,'section':c.get('section'), 'origin':'vorhandenes Transkript','source_segment_id':c['id'],'timing_status':'automatisch erstellt; nicht manuell verifiziert'})
    return cues,excluded
def tempo_estimate(onset,times,dur):
    # Method 1: autocorrelation of the 10-ms positive spectral-flux envelope.
    x=onset-np.mean(onset); ac=signal.fftconvolve(x,x[::-1],mode='full')[len(x)-1:]
    lags=np.arange(max(1,int(60/190/.01)),min(len(ac),int(60/65/.01)))
    cand=sorted([(float(ac[k]/max(ac[0],1e-9)),60/(k*.01)) for k in lags],reverse=True)
    autocorr=cand[0][1] if cand else None
    # Method 2: periodic phase/raster score on the measured envelope.
    bpm_grid=np.arange(70.,181.,.2); scores=[]; phases=[]
    env=signal.savgol_filter(onset,7,2) if len(onset)>7 else onset
    for bpm in bpm_grid:
        period=60/bpm; best=(-1,None)
        for phase in np.linspace(0,period,12,endpoint=False):
            ii=np.round((phase+np.arange(int(dur/period)+1)*period-times[0])/.01).astype(int)
            ii=ii[(ii>=0)&(ii<len(env))]
            score=float(np.mean(env[ii])) if len(ii) else 0
            if score>best[0]: best=(score,phase)
        scores.append(best[0]); phases.append(best[1])
    top=np.argsort(scores)[::-1]
    ranked=[]
    for i in top:
        if all(abs(bpm_grid[i]-q['bpm'])>2 for q in ranked): ranked.append({'bpm':roundf(bpm_grid[i],1),'score':roundf(scores[i],4)})
        if len(ranked)==5: break
    near=[q for q in ranked if q['score']>=.98*ranked[0]['score']]
    best=min(near,key=lambda q:abs(q['bpm']-autocorr))['bpm'] if autocorr else ranked[0]['bpm']; local=[]
    for a in np.arange(0,dur,30):
        mask=(times>=a)&(times<min(a+30,dur)); z=onset[mask]
        if len(z)<100: continue
        z=z-z.mean(); acz=signal.fftconvolve(z,z[::-1],mode='full')[len(z)-1:]
        ks=np.arange(32,min(93,len(acz)))
        k=int(ks[np.argmax(acz[ks])]); local.append({'start_s':roundf(a),'end_s':roundf(min(a+30,dur)),'autocorrelation_bpm':roundf(60/(k*.01),1)})
    strength=max(scores)/(np.mean(scores)+1e-9)
    local_agreement=sum(min(abs(best-v['autocorrelation_bpm']),abs(best/2-v['autocorrelation_bpm']),abs(best*2-v['autocorrelation_bpm']))<4 for v in local)/max(1,len(local))
    two_method_agreement=autocorr is not None and min(abs(best-autocorr),abs(best/2-autocorr),abs(best*2-autocorr))<4
    confidence='mittel' if two_method_agreement and local_agreement>=.65 and strength>1.03 else 'gering'
    return {'recommended_bpm':best,'autocorrelation_bpm':roundf(autocorr,1) if autocorr else None,'periodic_raster_bpm':best,'alternatives_bpm':[roundf(best/2,1),roundf(best*2,1)]+[q['bpm'] for q in ranked[1:3]],'confidence':confidence,'local_estimates':local,'candidate_scores':ranked,'beat_grid':{'status':'synthetisch, Phasenlage nur geschätzt','origin_s':roundf(phases[int(np.argmin(abs(bpm_grid-best)))],3),'times_s':[roundf(t,3) for t in np.arange(phases[int(np.argmin(abs(bpm_grid-best)))],dur,60/best)]},'meter':'nicht sicher bestimmt','interpretation':'Lokale Differenzen können aus Textur und Gesang entstehen; keine belegte Tempoänderung.'}
def analyze(name):
    srcdir=SOURCE/name; out=TARGET/name; out.mkdir(parents=True,exist_ok=True)
    wavs=list(srcdir.glob('*.wav')); prompts=list(srcdir.glob('*_1.0.txt')); transcripts=list(srcdir.glob('*_Transkript.json'))
    if len(wavs)!=1 or len(transcripts)!=1: raise RuntimeError(f'{name}: unklare Audio-/Transkriptzuordnung')
    wav=wavs[0]; trpath=transcripts[0]; tr=json.loads(trpath.read_text()); prompt=prompts[0].read_text() if prompts else ''
    if f'RELEASE AUDIO: {wav.name}' not in prompt: raise RuntimeError(f'{name}: Release-Audio passt nicht zum Projektprompt')
    digest=sha(wav)
    if digest!=tr.get('source_audio_sha256'): raise RuntimeError(f'{name}: Audio-SHA passt nicht zum Transkript')
    info=sf.info(wav); sr=info.samplerate; dur=info.frames/sr
    if abs(dur-tr['duration_seconds'])>.05: raise RuntimeError(f'{name}: Dauerabweichung')
    audio,sr=sf.read(wav,dtype='float32',always_2d=True); channels=audio.shape[1]; mono=audio.mean(axis=1)
    peaks=np.max(np.abs(audio),axis=0); peak_indices=np.argmax(np.abs(audio),axis=0); peak=max(peaks); peak_idx=int(peak_indices[np.argmax(peaks)])
    overall_rms=float(np.sqrt(np.mean(audio.astype(np.float64)**2)))
    dc=np.mean(audio,axis=0); corr=float(np.corrcoef(audio[:,0],audio[:,1])[0,1]) if channels==2 else None
    full=int(np.count_nonzero(np.abs(audio)>=1-1/32768))
    n100=int(math.ceil(dur*10)); rms=np.zeros(n100); pk=np.zeros(n100)
    for i in range(n100):
        block=audio[i*sr//10:min((i+1)*sr//10,len(audio))]
        if len(block): rms[i]=np.sqrt(np.mean(block.astype(np.float64)**2)); pk[i]=np.max(np.abs(block))
    loud=ff_loud(wav); lyrics,excluded=pick_lyrics(tr,dur)
    # 50-ms spectral hops retain the full 20-kHz measurement range.
    f,ts,Z=signal.stft(mono,fs=sr,nperseg=4096,noverlap=4096-sr//20,boundary=None,padded=False)
    power=(np.abs(Z)**2).astype('float32'); del Z
    total=power[(f>=20)&(f<=min(20000,sr/2))].sum(axis=0)+1e-20
    bandseries=[]; bandenergy=[]
    for label,lo,hi in BANDS:
        sel=(f>=lo)&(f<min(hi,sr/2))
        vals=power[sel].sum(axis=0) if np.any(sel) and lo<sr/2 else np.zeros(len(ts),dtype='float32')
        bandseries.append(vals); bandenergy.append(float(np.mean(vals)))
    bandseries=np.asarray(bandseries); fractions=bandseries/(total[None,:]); centroid=(power*f[:,None]).sum(axis=0)/(power.sum(axis=0)+1e-20)
    cumulative=np.cumsum(power,axis=0); rollidx=np.argmax(cumulative>=cumulative[-1][None,:]*.85,axis=0); roll=f[rollidx]
    specavg=power.mean(axis=1); peakspec,_=signal.find_peaks(specavg,prominence=np.max(specavg)*.01,distance=4)
    peakspec=sorted(peakspec,key=lambda k:specavg[k],reverse=True)[:12]
    # 10-ms onset resolution; low-pass downsampling is required before reducing sample rate.
    reduced=signal.resample_poly(mono,1,4); fsr=sr/4
    fo,to,Zo=signal.stft(reduced,fs=fsr,nperseg=512,noverlap=512-int(fsr*.01),boundary=None,padded=False)
    mag=np.abs(Zo); flux=np.maximum(0,np.diff(mag,axis=1,prepend=mag[:,:1])).sum(axis=0)
    flux=flux/(np.percentile(flux,95)+1e-9)
    omask=(to>=.05)&(to<=dur-.02)
    ip,_=signal.find_peaks(flux,prominence=.32,distance=8)
    ip=[int(i) for i in ip if omask[i]]
    onset_list=[{'time_s':roundf(to[i],3),'strength':roundf(flux[i],3),'resolution_s':.01,'timing_uncertainty_s':.04} for i in ip]
    tempo=tempo_estimate(flux,to,dur)
    # Each feature row is centred at the corresponding original 100-ms block midpoint.
    values=[]; drives=np.zeros((7,n100)); fracs=np.zeros((7,n100)); cents=np.zeros(n100); rolls=np.zeros(n100); ons=np.zeros(n100)
    for i in range(n100):
        a=i*.1; b=min(dur,(i+1)*.1); mask=(ts>=a)&(ts<b)
        if not np.any(mask): mask[np.argmin(abs(ts-(a+b)/2))]=True
        for j in range(7): fracs[j,i]=float(np.mean(fractions[j,mask])); drives[j,i]=float(np.mean(bandseries[j,mask]))
        cents[i]=float(np.mean(centroid[mask])); rolls[i]=float(np.mean(roll[mask])); m=(to>=a)&(to<b); ons[i]=float(np.max(flux[m])) if np.any(m) else 0
    for j in range(7): drives[j]=np.clip(drives[j]/(np.percentile(drives[j],95)+1e-20),0,1)
    gate=np.clip((np.array([db(v) for v in rms])+55)/22,0,1); drives*=gate[None,:]
    columns=['time_s','rms_dbfs','sample_peak_dbfs','spectral_centroid_hz','rolloff_85_hz','onset_strength']+[b[0]+'_fraction' for b in BANDS]+[b[0]+'_drive' for b in BANDS]
    for i in range(n100):
        vals=[min(dur,(i+.5)*.1),db(rms[i]),db(pk[i]),cents[i],rolls[i],ons[i]]+[fracs[j,i] for j in range(7)]+[drives[j,i] for j in range(7)]
        values.append([roundf(v,4) for v in vals])
    # Musical sections follow transcript starts; gaps and instrumental tail are explicit.
    starts=sorted(set([0.0]+[float(x['first_vocal_start']) for x in tr['sections'] if x['first_vocal_start']<dur-.1]+[float(x['last_vocal_end']) for x in tr['sections'] if x['last_vocal_end']<dur-.1 and not any(0<y['first_vocal_start']-x['last_vocal_end']<5 for y in tr['sections'])])); sections=[]
    for i,a in enumerate(starts):
        b=starts[i+1] if i+1<len(starts) else dur
        if b-a<.3: continue
        li=[x for x in lyrics if a<=x['start_s']<b]
        typ=li[0]['section'] if li else ('Instrumental' if a>0 else 'Vorlauf')
        ia=max(0,int(a*10)); ib=min(n100,max(ia+1,int(math.ceil(b*10))))
        sections.append({'start_s':roundf(a),'end_s':roundf(b,6),'label':typ,'origin':'Transkript-Gesangseinsatz; Grenze redaktionell, Kennwerte gemessen','rms_dbfs':roundf(np.sqrt(np.mean(rms[ia:ib]**2)) and db(np.sqrt(np.mean(rms[ia:ib]**2))),2),'max_sample_peak_dbfs':roundf(db(np.max(pk[ia:ib])),2),'mean_centroid_hz':roundf(np.mean(cents[ia:ib]),1),'first_lyric_id':li[0]['id'] if li else None})
    events=[]
    def ev(t,typ,observation,action,origin='gemessen',unc=.15,lyric=None):
        motif=VISUAL_ACTIONS[name]
        if typ=='transient': action=motif[0]
        elif typ=='energy_rise': action=motif[1]
        elif typ=='energy_fall': action=motif[2]
        events.append({'id':f'E{len(events)+1:03d}','time_s':roundf(t,3),'timecode':tc(t),'type':typ,'observation':observation,'timing_uncertainty_s':unc,'lyric_id':lyric,'image_action':action,'origin':origin})
    ev(0,'start','Beginn der Original-WAV','Bildwelt öffnen',unc=0)
    # Sustained transitions from smoothed RMS and spectral centroid, never just a single sample.
    smooth=signal.savgol_filter(np.array([db(x) for x in rms]),min(31,n100//2*2-1),2)
    diff=np.r_[0,smooth[10:]-smooth[:-10],np.zeros(9)] if n100>20 else np.zeros(n100)
    candidates=np.argsort(abs(diff))[::-1]; selected=[]
    for k in candidates:
        if k<15 or k>n100-15 or abs(diff[k])<2 or any(abs(k-z)<80 for z in selected): continue
        selected.append(int(k))
        if len(selected)>=12: break
    for k in sorted(selected):
        typ='energy_rise' if diff[k]>0 else 'energy_fall'
        ev(k/10,typ,f'Geglätteter RMS-Verlauf ändert sich über 1 s um {diff[k]:+.1f} dB','Bei Anstieg Bildraum öffnen; bei Abfall Kamera beruhigen',unc=.5)
    # Most salient separated transient candidates and very short dips.
    top=sorted(ip,key=lambda i:flux[i],reverse=True); chosen=[]
    for i in top:
        if any(abs(to[i]-to[j])<6 for j in chosen): continue
        chosen.append(i)
        if len(chosen)==14: break
    for i in sorted(chosen): ev(to[i],'transient',f'Spektraler Anstieg, relative Stärke {flux[i]:.2f}','Einzelnen Licht- oder Formimpuls auslösen',unc=.04)
    for k in range(1,n100-1):
        if db(rms[k])<db(rms[max(0,k-2)])-10 and db(rms[k])<db(rms[min(n100-1,k+2)])-10 and db(rms[k])<-35:
            if not any(abs(k/10-e['time_s'])<2 and e['type']=='level_gap' for e in events): ev(k/10,'level_gap',f'100-ms-RMS {db(rms[k]):.1f} dBFS','Kurz Licht zurücknehmen; danach wieder öffnen',unc=.1)
    for s in sections[1:]: ev(s['start_s'],'section_boundary',f'Beginn {s["label"]}; Abschnittsgrenze aus Transkript','Neues Kapitel oder Kameraposition einführen','aus Transkript übernommen',.35,s['first_lyric_id'])
    for x in lyrics:
        if x['id'] in {'L001'} or x['section'] and x['start_s'] in [s['start_s'] for s in sections]: continue
    last=max((x['end_s'] for x in lyrics),default=0)
    ev(last,'last_vocal_end','Ende der letzten übernommenen Gesangszeile','Instrumentales Ende aktiv weiterführen','aus Transkript übernommen',.5)
    # End fade is only asserted if a sustained drop is visible.
    tail=np.array([db(v) for v in rms]); enddb=tail[-1]; fade=None
    for i in range(max(0,n100-60),n100-5):
        if tail[i]-enddb>12 and np.median(tail[i:min(i+5,n100)])>np.median(tail[-5:])+10:
            fade=i/10; break
    if fade is not None: ev(fade,'fade_candidate',f'Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB','Schlussblende frühestens hier einsetzen',unc=.3)
    ev(dur,'end','Ende der Original-WAV','Bild bei Audioende schliessen',unc=1/sr)
    events.sort(key=lambda x:x['time_s']);
    for i,e in enumerate(events): e['id']=f'E{i+1:03d}'
    bandtot=sum(bandenergy); spectrum={'bands':[{'name':b[0],'low_hz':b[1],'high_hz':min(b[2],sr/2),'measurable':b[1]<sr/2,'energy_fraction':roundf(v/bandtot,5) if bandtot and b[1]<sr/2 else None} for b,v in zip(BANDS,bandenergy)],'range_hz':[20,min(20000,sr/2)],'mean_centroid_hz':roundf(np.mean(centroid),1),'mean_rolloff_85_hz':roundf(np.mean(roll),1),'prominent_spectral_peaks_hz':[roundf(f[k],1) for k in peakspec],'harmonic_structure_note':'Peaks können Oberwellenfamilien enthalten; der polyphone Mix erlaubt keine eindeutige Grundton-, Instrument- oder THD-Bestimmung.','spectrogram':{'window':'Hann','fft_samples':4096,'hop_samples':sr//20,'frequency_resolution_hz':roundf(sr/4096,3)}}
    source={'path':str(wav),'filename':wav.name,'sha256':digest,'transcript_path':str(trpath),'transcript_sha256':sha(trpath),'project_prompt_path':str(prompts[0]) if prompts else None,'selection_reason':'Einzige WAV im Trackordner; im Projektprompt als RELEASE AUDIO bezeichnet; SHA-256 und Dauer stimmen mit Transkript überein.'}
    summary={'format':info.format,'subtype':info.subtype,'sample_rate_hz':sr,'channels':channels,'bit_depth':int(re.search(r'(\d+)',info.subtype).group(1)) if re.search(r'(\d+)',info.subtype) else None,'samples_per_channel':info.frames,'duration_s':roundf(dur,9),'sample_peak_channels_dbfs':[roundf(db(v),3) for v in peaks],'sample_peak_channels_time_s':[roundf(i/sr,6) for i in peak_indices],'sample_peak_dbfs':roundf(db(peak),3),'sample_peak_time_s':roundf(peak_idx/sr,6),'true_peak_dbtp_rounded':loud['true_peak_dbtp_rounded'],'global_rms_dbfs':roundf(db(overall_rms),3),'crest_factor_db':roundf(db(peak)-db(overall_rms),3),'integrated_lufs':loud['integrated_lufs'],'loudness_range_lu':loud['lra_lu'],'full_scale_sample_candidates':full,'dc_offset_channels':[roundf(v,7) for v in dc],'stereo_correlation':roundf(corr,4) if corr is not None else None}
    loudrows=[]
    for i in range(n100):
        t=min(dur,(i+1)*.1); frame=min(loud['frames'],key=lambda x:abs(x[0]-t)) if loud['frames'] else None
        loudrows.append([roundf(t,3),roundf(frame[1],2) if frame and math.isfinite(frame[1]) else None,roundf(frame[2],2) if frame and math.isfinite(frame[2]) else None])
    data={'schema':'astra.audio.analysis.v1','source':source,'summary':summary,'tempo':tempo,'spectrum':spectrum,'sections':sections,'events':events,'onsets':onset_list,'lyrics':{'segments':lyrics,'excluded_source_segments':excluded,'source_timing_note':'Zeiten unverändert aus vorhandener automatischer Transkription; keine manuelle Hörprüfung.'},'features_100ms':{'columns':columns,'rows':values,'timestamp':'Mitte des 100-ms-Originalaudiofensters; letztes Fenster kann kürzer sein','normalisation':'Jedes Band separat: Mittel der Bandenergie je Fenster geteilt durch 95. Perzentil aller Fenster, auf 0–1 begrenzt; zusätzlich RMS-Gate von -55 bis -33 dBFS.','spectral_method':'48-kHz-Mono-Summe, Hann-STFT, 4096 Samples, 50-ms-Hop; Bandanteile aus quadratischen FFT-Beträgen','onset_method':'12-kHz-Antialias-Downsampling, 512-Sample-FFT, 10-ms-Hop, positive spektrale Differenz'},'loudness_100ms':{'columns':['window_end_s','momentary_lufs_400ms','short_term_lufs_3s'],'rows':loudrows,'method':'FFmpeg ebur128; am nächsten 100-ms-Frame; null wenn unbestimmt'},'methods':{'peak':'Maximalwert aller PCM-Samples; True Peak aus FFmpeg ebur128, auf 0.1 dB gerundet','crest':'20 log10(globaler Sample-Peak / Gesamt-RMS beider Kanäle)','tempo':'Autokorrelation des 10-ms-Onsets und phasenoptimierte periodische Rasterbewertung','sections':'Grenzen aus Transkriptstarts; Abschnittsenergien aus Originalaudio','transient_resolution_s':.01,'transient_timing_uncertainty_s':.04},'limitations':['Mono-Summierung kann gegenphasige Stereoanteile reduzieren.','50-ms-Spektral-Hop und 4096-Sample-Fenster begrenzen Zeit- und Frequenzauflösung.','Onset-Kandidaten identifizieren keine Instrumente oder Fehler.','Beat-Raster und BPM sind Schätzungen; Taktart und erste Zählzeit nicht sicher.','Transkript stammt aus automatischer Erzeugung und wurde nicht manuell mit dem Audio nachgehört.','Spektrale Energieanteile sind keine wahrgenommene Lautheit.']}
    # Strict JSON: no NaN/Infinity.
    dest=out/OUTFILES[1]; write(dest,json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    make_plot(out/OUTFILES[2],name,dur,values,columns,f,ts,power,events,tempo)
    make_report(out/OUTFILES[0],name,data)
    print(f'{name}: {dur:.3f}s, {tempo["recommended_bpm"]} BPM ({tempo["confidence"]}), {loud["integrated_lufs"]} LUFS, {len(events)} Ereignisse',flush=True)
    return data

def make_plot(dest,name,dur,rows,cols,f,ts,power,events,tempo):
    a=np.asarray(rows); get=lambda k:a[:,cols.index(k)]; fig,ax=plt.subplots(4,1,figsize=(16,12),sharex=True,gridspec_kw={'height_ratios':[1,2,1,1]}); fig.patch.set_facecolor('#101724')
    for q in ax: q.set_facecolor('#101724');q.tick_params(colors='white');q.grid(alpha=.16);q.yaxis.label.set_color('white')
    ax[0].plot(get('time_s'),get('rms_dbfs'),label='RMS 100 ms',color='#4dd6cf',lw=1);ax[0].plot(get('time_s'),get('sample_peak_dbfs'),label='Sample-Peak 100 ms',color='#ffb45d',lw=.7);ax[0].set_ylabel('Pegel [dBFS]');ax[0].legend(facecolor='#101724',labelcolor='white',loc='lower left')
    stride=max(1,len(ts)//2500); fm=(f>=20)&(f<=min(20000,f[-1])); img=10*np.log10(power[fm,::stride]+1e-12); im=ax[1].pcolormesh(ts[::stride],f[fm],img,shading='auto',cmap='magma',vmin=np.percentile(img,15),vmax=np.percentile(img,99));ax[1].set_yscale('log');ax[1].set_ylim(20,min(20000,f[-1]));ax[1].set_ylabel('Frequenz [Hz]'); fig.colorbar(im,ax=ax[1],label='rel. Leistung [dB]')
    ax[2].plot(get('time_s'),get('onset_strength'),color='#ff6f91',lw=.8);ax[2].set_ylabel('Onset [rel.]')
    ax[3].plot(get('time_s'),get('spectral_centroid_hz'),color='#9b9bff',lw=.8,label='Schwerpunkt');ax[3].plot(get('time_s'),get('bass_60_250_drive')*3000,color='#65db9a',lw=.8,label='Bass-Steuerwert × 3000');ax[3].set_ylabel('Hz / skaliert');ax[3].set_xlabel('Zeit ab Originalbeginn [s]');ax[3].legend(facecolor='#101724',labelcolor='white')
    for e in events:
        if e['type'] in {'section_boundary','energy_rise','energy_fall','fade_candidate'}:
            for q in ax:q.axvline(e['time_s'],color='#ffffff',alpha=.17,lw=.6)
    ax[0].set_xlim(0,dur);fig.suptitle(f'{name} · {dur:.3f} s · BPM {tempo["recommended_bpm"]} ({tempo["confidence"]})',color='white');fig.tight_layout();backup(dest);fig.savefig(dest,dpi=150,facecolor=fig.get_facecolor());plt.close(fig)

def make_report(dest,name,d):
    s=d['summary'];t=d['tempo'];sp=d['spectrum'];ev=d['events'];sections=d['sections'];lyrics=d['lyrics']['segments']
    lines=[f'# {name.replace("_"," ")} – Audioanalyse','',f'**Wichtigste Erkenntnisse:** {s["duration_s"]:.3f} s, geschätzte {t["recommended_bpm"]} BPM ({t["confidence"]}), {s["integrated_lufs"]} LUFS und {s["true_peak_dbtp_rounded"]} dBTP. Letzte transkribierte Stimme bei {tc(max((x["end_s"] for x in lyrics),default=0))}; Audioende bei {tc(s["duration_s"])}.','', '## Datei und Pegel','',f'- Quelle: `{d["source"]["filename"]}`; SHA-256 `{d["source"]["sha256"]}`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.',f'- {s["format"]}/{s["subtype"]}, {s["sample_rate_hz"]} Hz, {s["channels"]} Kanäle, {s["bit_depth"]} Bit; {s["samples_per_channel"]} Samples je Kanal; Dauer {s["duration_s"]:.9f} s.',f'- Sample-Peak {s["sample_peak_dbfs"]} dBFS bei {tc(s["sample_peak_time_s"])}; pro Kanal {s["sample_peak_channels_dbfs"]} dBFS. True Peak {s["true_peak_dbtp_rounded"]} dBTP (FFmpeg, 0.1 dB gerundet).',f'- Globales RMS {s["global_rms_dbfs"]} dBFS; Crest {s["crest_factor_db"]} dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit {s["integrated_lufs"]} LUFS; LRA {s["loudness_range_lu"]} LU.',f'- Vollaussteuerungs-Kandidaten: {s["full_scale_sample_candidates"]}; DC-Offset je Kanal {s["dc_offset_channels"]}; globale Stereo-Korrelation {s["stereo_correlation"]}. Diese Werte belegen keine Verzerrungsfreiheit.','', '## BPM und Rhythmus','',f'- Onset-Autokorrelation: {t["autocorrelation_bpm"]} BPM; phasenoptimierte Rasterbewertung: {t["periodic_raster_bpm"]} BPM. Empfohlen: {t["recommended_bpm"]} BPM; Alternativen {t["alternatives_bpm"]}. Sicherheit: {t["confidence"]}.',f'- Das Beat-Raster ist **synthetisch**; der Phasenursprung {t["beat_grid"]["origin_s"]} s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.',f'- Lokale Fenster: '+', '.join(f'{tc(x["start_s"])}–{tc(x["end_s"])}: {x["autocorrelation_bpm"]} BPM' for x in t['local_estimates'])+'. Schwankungen sind kein Nachweis eines Tempowechsels.','', '## Frequenzen und Oberwellen','',f'Nyquist {s["sample_rate_hz"]/2:g} Hz; Messbereich 20–{sp["range_hz"][1]:g} Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.','', '| Band | Bereich | Energieanteil |','| --- | --- | ---: |']
    for b in sp['bands']: lines.append(f'| {b["name"]} | {b["low_hz"]}–{b["high_hz"]} Hz | {100*b["energy_fraction"]:.2f} % |' if b['measurable'] else f'| {b["name"]} | nicht messbar | – |')
    lines+=['',f'Mittlerer spektraler Schwerpunkt {sp["mean_centroid_hz"]} Hz, 85-%-Rolloff {sp["mean_rolloff_85_hz"]} Hz. Auffällige Langzeit-Peaks: {sp["prominent_spectral_peaks_hz"]} Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.','', '## Abschnittsweise Energieentwicklung','','| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |','| --- | --- | ---: | ---: | ---: |']
    for x in sections: lines.append(f'| {tc(x["start_s"])}–{tc(x["end_s"])} | {x["label"]} | {x["rms_dbfs"]} | {x["max_sample_peak_dbfs"]} | {x["mean_centroid_hz"]} |')
    lines+=['','## Kuratierte Cues','','| ID | Zeit | Typ | Beobachtung | Bildaktion |','| --- | --- | --- | --- | --- |']
    for e in ev: lines.append(f'| {e["id"]} | {e["timecode"]} | {e["type"]} | {e["observation"]} | {e["image_action"]} |')
    lines+=['','## Transienten, Lücken und Ausklang','',f'{len(d["onsets"])} gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. {sum(e["type"]=="level_gap" for e in ev)} kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei {tc(max((x["end_s"] for x in lyrics),default=0))}; danach läuft das Originalaudio bis {tc(s["duration_s"])}. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.','', '## Audioabhängige Animation','', 'RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.','', '## Methoden, Grenzen und JSON-Schema','', '`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.','', 'Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.','',f'Übernommene Transkriptzeiten wurden nicht verschoben. {len(d["lyrics"]["excluded_source_segments"])} offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.','']
    write(dest,'\n'.join(lines))

def main():
    ap=argparse.ArgumentParser();ap.add_argument('tracks',nargs='*',default=TRACKS);args=ap.parse_args()
    for name in args.tracks:
        if name not in TRACKS: raise SystemExit(f'Nicht freigegebener Track: {name}')
        analyze(name)
if __name__=='__main__': main()
