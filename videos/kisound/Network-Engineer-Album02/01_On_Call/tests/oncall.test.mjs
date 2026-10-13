import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAPS,FADE_START} from '../src/render/config.js';
import {FLIGHTS,BY_ID,FIX,RETEST,OK_A,VERIFY,ADDR,SERVICES,ST,counter,aclBound,activeFlights,pointAt,serviceOk,BLOCKS,blockLines,changeExecuted,LOGS,KINETIC_SECTIONS,KINETIC_TEXT,WORD_NOTE,TICKET,PREFIXES,prefixFor} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id);
const rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
const shotAt=t=>tl.shot(t);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.ok(Math.abs(data.summary.duration_s-DURATION)<1e-6);assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.ok((FRAMES-1)/FPS<DURATION);});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list is the shooting script: 60 shots with its start times',()=>{
 const starts=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \|/gm)].map(m=>[m[1],+m[2]]);assert.equal(starts.length,60);assert.equal(SHOTS.length,60);
 starts.forEach(([id,s],i)=>{assert.equal(SHOTS[i].id,id);assert.ok(Math.abs(SHOTS[i].start-s)<1e-6,`${id} ${SHOTS[i].start} ≠ ${s}`);});
});
test('every analysis event and lyric segment lands in exactly one shot, as in the script',()=>{
 const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);assert.equal(data.lyrics.excluded_source_segments.length,0);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);
});
test('bass re-entries, level gaps and the close follow the measurements',()=>{
 const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30,`${a}`);
 assert.ok(FADE_START>=data.events.find(e=>e.type==='fade_candidate').time_s-.3);assert.ok(tl.visibility(198.6)<.15&&tl.visibility(100)>.99&&tl.visibility(DURATION)<.01);
});
test('the wrong binding discards exactly the server traffic until FIX, and nothing after it',()=>{
 for(const f of FLIGHTS){const svc=SERVICES[f.dst];const i=f.nodes.indexOf('ACL10');if(i<0||f.dir==='back'||f.kind==='replay')continue;const passT=f.arrive[i];
  assert.equal(svc?.net,'server',f.id);if(passT<FIX){assert.equal(f.fate,'drop',`${f.id} must die at rule 10`);assert.equal(f.nodes.at(-1),'ACL10');}else assert.equal(f.fate,'deliver',f.id);}
 for(const f of FLIGHTS.filter(f=>f.fate==='drop'))assert.ok(f.t1<FIX&&(f.kind==='syn'||f.kind==='replay'),f.id);
 for(const f of FLIGHTS.filter(f=>f.dst==='D'||f.from==='D'))assert.ok(!f.nodes.includes('ACL10'),'CTRL-D never passes Gi0/0/1');
 assert.equal(BY_ID.get('GW').fate,'local');assert.ok(!BY_ID.get('GW').nodes.includes('ACL10'),'traffic to the router itself is not filtered by an outbound ACL');
 assert.ok(aclBound(FIX-1e-6)&&!aclBound(FIX));
});
test('F-A1 is one controlled SYN that dies once; F-A2 is a new connection of the same test after FIX',()=>{
 const a=BY_ID.get('FA1'),b=BY_ID.get('FA2');assert.equal(a.flags,'SYN');assert.equal(a.payload,0);assert.match(a.src,/:51000$/);assert.match(b.src,/:51001$/);assert.equal(a.dstAddr,b.dstAddr);
 assert.ok(b.t0>=RETEST&&RETEST>FIX);assert.ok(!activeFlights(a.tGone+.01).includes(a));for(const t of[115,140,170,200])assert.ok(!activeFlights(t).some(f=>f.id==='FA1'));
 for(const f of FLIGHTS.filter(f=>f.kind==='replay')){assert.equal(f.of,'FA1');assert.ok(f.t0>a.t1&&f.t1<FIX,'replays only show the recorded trace');}
 assert.ok(a.t1>=shotAt(106.32).start&&a.t1<shotAt(106.32).end&&shotAt(a.t1).lyricIds.includes('L022'),'dropped during «Noch keine Antwort»');
 const pass=b.arrive[b.nodes.indexOf('ACL10')];assert.equal(shotAt(pass).id,'S045');
 assert.ok(Math.abs(FIX-lyric('L039').start_s)<1e-6&&Math.abs(RETEST-lyric('L040').start_s)<1e-6,'fix on «Erst verstehen», retest on «Dann derselbe Test»');
});
test('counter: 40 in the snapshot, +1 by F-A1, unchanged after the fix',()=>{
 assert.equal(counter(BLOCKS.P0.lines[1][0]),40);assert.ok(blockLines('P0',85).some(l=>/\(40 matches\)/.test(l.text)));
 assert.equal(counter(BY_ID.get('FA1').t1-1e-3),40);assert.equal(counter(BY_ID.get('FA1').t1),41);assert.equal(counter(DURATION),41);
 assert.ok(blockLines('B03',132).some(l=>/\(41 matches\)/.test(l.text)));assert.ok(blockLines('B06',184).some(l=>/41 matches \(unverändert\)/.test(l.text)));
 assert.ok(blockLines('B03',132).some(l=>/192\.0\.2\.10\(51000\) -> 198\.51\.100\.20\(443\)/.test(l.text)),'log names the probe');
});
test('results are only revealed after their test or intervention',()=>{
 const rsp=BY_ID.get('RSP');assert.equal(rsp.t1,OK_A);assert.ok(BLOCKS.B06.lines.filter(l=>/200|ok/.test(l[1])).every(l=>l[0]>=OK_A));
 for(const s of['B','C','D'])assert.equal(BY_ID.get(`T${s}R`).t1,VERIFY[s]);assert.ok(BLOCKS.B07.win[0]>VERIFY.D&&TICKET.closed>VERIFY.D);
 for(const s of['A','B','C'])assert.ok(!serviceOk(s,VERIFY[s]-1e-3)&&serviceOk(s,VERIFY[s]),s);
 assert.ok(BLOCKS.B02.lines[1][0]>=BY_ID.get('T0R').t1,'timeout after the second SYN died');assert.ok(BLOCKS.P1.lines[3][0]>BY_ID.get('FA1').t0);
 assert.ok(BLOCKS.B04.lines[3][0]>=BLOCKS.B03.lines.find(l=>/41 matches/.test(l[1]))[0],'finding only after the counter evidence');
 assert.ok(!changeExecuted(FIX-1e-3)&&changeExecuted(FIX));assert.ok(BLOCKS.B05.lines.at(-1)[0]>FIX);
 const p=BLOCKS.B03.pages;assert.deepEqual(p,[120.12,124.14,129.94]);p.forEach((s,i)=>assert.ok((p[i+1]??BLOCKS.B03.win[1])-s>=4));
 for(const[id,b]of Object.entries(BLOCKS)){const pages=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[3]===i)):[b.lines];for(const pg of pages)assert.ok(pg.filter(l=>l[1].trim()).length<=6,id);assert.ok(b.win[1]-b.lines[0][0]>=4,id);}
});
test('route lookup: the server prefix is connected via Gi0/0/1; the path is correct',()=>{assert.deepEqual(PREFIXES[prefixFor(ADDR.A)],['198.51.100.0/24','Gi0/0/1','connected']);assert.deepEqual(PREFIXES[prefixFor(ADDR.D)].slice(0,2),['203.0.113.0/24','Gi0/0/2']);});
test('kinetic words: only the hook «On Call.», each with a note',()=>{const ws=data.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)&&KINETIC_TEXT.has(l.text));assert.deepEqual(ws.map(l=>l.id),['L017','L021','L041','L045']);for(const l of ws)assert.ok(WORD_NOTE[l.id],l.id);});
test('camera targets, documentation addresses, log spacing, pure time',()=>{
 for(const s of SHOTS.filter(s=>s.target?.startsWith('f:'))){const f=BY_ID.get(s.target.slice(2));assert.ok(f,s.id);assert.ok(f.t0<s.end&&f.tGone>s.start-.3,`${s.id} ${s.target}`);}
 for(const s of SHOTS.filter(s=>s.target?.startsWith('s:')))assert.ok(ST[s.target.slice(2)],s.id);
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;for(const v of Object.values(ADDR))assert.match(v,ok);
 for(const f of FLIGHTS)for(const x of[f.src,f.dstAddr].filter(Boolean))assert.match(x,ok,`${f.id} ${x}`);
 const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message)].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g))if(!/^(0\.0\.0\.\d|255\.)/.test(ip))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);
 const a=JSON.stringify(activeFlights(165).map(f=>[f.id,pointAt(f,165)]));activeFlights(30);activeFlights(200);assert.equal(JSON.stringify(activeFlights(165).map(f=>[f.id,pointAt(f,165)])),a);
});
