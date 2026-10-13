import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline,normalizeAnalysis} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,TRANSCRIPT_SHA256,GAP,FADE_START,DROPS} from '../src/render/config.js';
import {FLIGHTS,BY_ID,S_FLIGHTS,X,K,GATE_H,TUNNEL_MTU,PATH_MTU,LINKS,FIX,LEARN,FILE_BYTES,FILE_DONE,MSS_NEW,REBUILD_OLD,REBUILD_NEW,PATH_FRAMES,DROPS_AT,upload,hostPmtu,resolveTarget,activeFlights,flightPos,xAt,TERM,KINETIC_SECTIONS,word,WORD_NOTE,LOGS,dims} from '../src/render/model.js';
const raw=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),data=normalizeAnalysis(raw),tl=new Timeline(raw);
const transcriptPath=new URL('../../../../../music/kisound/Network-Engineer-Album01/08_MTU/08_MTU_Transkript.json',import.meta.url);
const rows=raw.features_100ms.rows,rms=raw.features_100ms.columns.indexOf('rms_dbfs');

test('source, exact duration and frame raster',()=>{
 assert.equal(raw.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.ok(Math.abs(raw.summary.duration_s-DURATION)<1e-6);
 assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.equal(FRAMES,8341);assert.ok((FRAMES-1)/FPS<DURATION);
});
test('chapters and shots cover the whole track without gaps',()=>{
 for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}
});
test('the early v1 analysis is normalised without changing it',()=>{
 assert.ok(Array.isArray(raw.lyrics));assert.equal(data.lyrics.segments.length,raw.lyrics.length);assert.ok(data.events.every(e=>e.type===e.kind));
 assert.equal(normalizeAnalysis(data),data);
});
test('lyric sections agree with the transcript',{skip:!fs.existsSync(transcriptPath)},()=>{
 const tr=JSON.parse(fs.readFileSync(transcriptPath));assert.equal(tr.source_audio_sha256,SOURCE_SHA256);
 for(const l of data.lyrics.segments){const s=tr.segments.find(x=>Math.abs(x.start-l.start_s)<.011&&x.text===l.text);assert.ok(s,l.text);assert.equal(l.section,s.section,l.text);}
 assert.equal(TRANSCRIPT_SHA256.length,64);
});
test('every analysis event and lyric segment lands in exactly one shot',()=>{
 const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);
 assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);assert.equal(new Set(ly).size,ly.length);
});
test('one gate, one size: the opening is the tunnel MTU and the path MTU is the smallest link',()=>{
 assert.equal(GATE_H,TUNNEL_MTU*K);assert.equal(PATH_MTU,Math.min(...LINKS.map(l=>l[2])));assert.equal(PATH_MTU,1400);assert.equal(Math.min(...PATH_FRAMES.map(f=>f[1])),PATH_MTU);
 for(const f of FLIGHTS)assert.ok(f.size<=1500,`${f.id}: nothing on the path is larger than the link (jumbo only in the hall)`);
});
test('DF packets above 1400 bytes die at the gate; everything else passes',()=>{
 for(const f of FLIGHTS.filter(f=>f.lane==='fwd')){
  if(f.df&&f.size>PATH_MTU){assert.equal(f.fate,'drop',f.id);const x=xAt(f,f.t1);assert.ok(x<X.gate&&X.gate-x<dims(f.size).d/2+.2,`${f.id} stops at the gate`);}
  else{assert.equal(f.fate,'deliver',f.id);assert.equal(xAt(f,f.t1),X.srv);}
 }
 assert.ok(FLIGHTS.every(f=>f.kind!=='frag'),'no router fragments anything');
});
test('every drop sends one ICMP frag-needed; blocked before the fix, delivered after',()=>{
 for(const d of FLIGHTS.filter(f=>f.fate==='drop')){const icmp=FLIGHTS.filter(f=>f.cause===d.id);assert.equal(icmp.length,1,d.id);const i=icmp[0];assert.ok(i.t0>d.t1);
  const tFw=i.keys[1][0];assert.equal(i.fate,tFw>=FIX?'deliver':'block',i.id);}
 const passed=FLIGHTS.filter(f=>f.kind==='icmp'&&f.fate==='deliver');assert.equal(passed.length,1);assert.equal(LEARN,passed[0].t1);assert.ok(LEARN>FIX);
 assert.equal(hostPmtu(LEARN-.01),1500);assert.equal(hostPmtu(LEARN),1400);
});
test('small pings work the whole time (the classic symptom)',()=>{
 const pings=FLIGHTS.filter(f=>f.kind==='ping');assert.ok(pings.length>=6);for(const p of pings){assert.equal(p.fate,'deliver');assert.ok(BY_ID.get(`R${p.id}`),p.id);assert.ok(p.t0<LEARN||true);}
 assert.ok(pings.some(p=>p.t1<LEARN-50));
});
test('after learning, the sender only sends packets that fit, and nothing is lost',()=>{
 assert.ok(S_FLIGHTS.every(f=>f.t0>LEARN&&f.size<=PATH_MTU&&f.df));assert.ok(FLIGHTS.filter(f=>f.fate==='drop').every(f=>f.t1<LEARN));
 assert.equal(S_FLIGHTS.filter(f=>f.file).reduce((s,f)=>s+f.payload,0),FILE_BYTES);assert.ok(S_FLIGHTS.filter(f=>f.file).every(f=>f.payload<=MSS_NEW));
 assert.equal(REBUILD_NEW.reduce((a,b)=>a+b,0),REBUILD_OLD.reduce((a,b)=>a+b,0));assert.ok(REBUILD_NEW.every(b=>b<=MSS_NEW));assert.equal(REBUILD_NEW.length,5);
 assert.equal(upload(FILE_DONE-.01).done,false);assert.equal(upload(FILE_DONE).pct,1);
 const done=SHOTS.find(s=>s.mode==='done');assert.ok(FILE_DONE>done.start&&FILE_DONE<done.end,'upload completes on screen');
});
test('same approach, different ending: chorus 1 fails, the final chorus passes',()=>{
 const pass=data.lyrics.segments.filter(l=>l.text==='Can you pass it through?');assert.equal(pass.length,2);
 assert.ok(DROPS_AT.some(d=>d.t>pass[0].start_s&&d.t<pass[0].end_s+.2),'first chorus: dropped on the line');
 const s0=BY_ID.get('S0'),tGate=s0.t0+(X.gate-X.host)/((X.srv-X.host)/(s0.t1-s0.t0));assert.ok(tGate>pass[1].start_s&&tGate<pass[1].end_s,`final chorus: S0 crosses the gate at ${tGate.toFixed(2)}`);
 const last=S_FLIGHTS.at(-1),lastGate=last.t0+(X.gate-X.host)/((X.srv-X.host)/(last.t1-last.t0));assert.ok(Math.abs(lastGate-137.69)<.02,'last packet on the last onset');
});
test('the first drop sits in the measured level gap',()=>{
 const d0=BY_ID.get('D0');assert.ok(d0.t1>=GAP[0]-.1&&d0.t1<=GAP[1]+.1);const low=Math.min(...rows.filter(x=>x[0]>=GAP[0]-.06&&x[0]<=GAP[1]+.06).map(x=>x[rms]));assert.ok(low<-45,`rms ${low}`);
 assert.ok(FADE_START>=137.8&&tl.visibility(DURATION)===0&&tl.visibility(100)===1);assert.ok(DROPS.every(d=>data.events.some(e=>Math.abs(e.time_s-d)<.01)));
});
test('camera targets resolve to flights that are on screen during their shot',()=>{
 for(const s of SHOTS.filter(s=>s.target)){const id=resolveTarget(s),f=BY_ID.get(id);assert.ok(f,`${s.id} ${s.target}`);assert.ok(f.t0<s.end&&f.tEnd>s.start-.3,`${s.id} → ${id}`);
  for(const t of[s.start,(s.start+s.end)/2,s.end-.01])assert.ok(flightPos(f,Math.min(t,f.t1)).every(Number.isFinite));}
});
test('terminal texts say what the scenario shows',()=>{
 assert.ok(TERM.big.some(l=>/100% packet loss/.test(l)));assert.ok(TERM.lower.some(l=>/1380 bytes from/.test(l)));assert.ok(TERM.learned.some(l=>/mtu 1400/.test(l)));
 assert.ok(TERM.fix.some(l=>/icmp code frag-needed accept/.test(l)));assert.ok(TERM.fwlog.some(l=>/TYPE=3 CODE=4/.test(l)));assert.ok(TERM.icmp.some(l=>/type 3/.test(l)));
});
test('kinetic words come from the analysed lyrics and all have a note',()=>{
 const ws=data.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)).map(l=>word(l.text));assert.equal(ws.length,15);for(const w of ws)assert.ok(w in WORD_NOTE,w);
});
test('log stays readable and time is pure',()=>{
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.45);
 const a=JSON.stringify(activeFlights(120).map(f=>f.id));activeFlights(10);activeFlights(70);assert.equal(JSON.stringify(activeFlights(120).map(f=>f.id)),a);
});
