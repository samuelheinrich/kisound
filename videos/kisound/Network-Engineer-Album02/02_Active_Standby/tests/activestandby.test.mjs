import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAPS,FADE_START} from '../src/render/config.js';
import {HA_DOWN,B_PRIMARY,FENCE_START,LAN_SHUT,WAN_SHUT,HA_UP,ELECTED,IN_SYNC,RELEASE,PEER_TIMER,role,priority,links,forwards,splitBrain,haUp,syncDir,inSync,FLIGHTS,BY_ID,HEARTBEATS,SYNCS,s17,diverged,BLOCKS,blockLines,previewB06,LOGS,KINETIC,WORD_NOTE,ADDR,activeFlights,pointAt,ST} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.ok((FRAMES-1)/FPS<DURATION);});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list is the shooting script: 56 shots with its start times',()=>{const st=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \|/gm)].map(m=>[m[1],+m[2]]);assert.equal(st.length,56);assert.equal(SHOTS.length,56);st.forEach(([id,s],i)=>{assert.equal(SHOTS[i].id,id);assert.ok(Math.abs(SHOTS[i].start-s)<1e-6,id);});});
test('every event and lyric lands in exactly one shot, as in the script',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);});
test('bass re-entries, level gaps and the close follow the measurements',()=>{
 const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30);assert.ok(Math.abs(FADE_START-data.events.find(e=>e.type==='fade_candidate').time_s)<.31);assert.ok(tl.visibility(DURATION)<.01&&tl.visibility(100)>.99);
});
test('roles: A Primary, ha1 lost on «Dein Heartbeat fehlt», B Primary after the peer timer, split brain until A is fenced',()=>{
 assert.equal(role('A',10),'primary');assert.equal(role('B',10),'secondary');assert.ok(forwards('A',50)&&!forwards('B',50));
 assert.ok(Math.abs(HA_DOWN-lyric('L017').start_s)<1e-6&&Math.abs(B_PRIMARY-lyric('L019').start_s)<1e-6);assert.ok(Math.abs(PEER_TIMER-3.52)<1e-9);
 assert.ok(forwards('A',HA_DOWN+1)&&!forwards('B',HA_DOWN+1),'A keeps working, B waits');
 for(let t=B_PRIMARY;t<WAN_SHUT;t+=.05)assert.equal(splitBrain(t),t<LAN_SHUT,`split brain at ${t.toFixed(2)}`);
 for(let t=WAN_SHUT;t<DURATION;t+=.25)assert.ok(!forwards('A',t)&&forwards('B',t),`only B forwards at ${t}`);
 assert.equal(role('A',DURATION),'secondary');assert.equal(role('B',DURATION),'primary');
});
test('fencing touches only A, once; links come back only after in-sync',()=>{
 for(let t=0;t<DURATION;t+=.5){const b=links('B',t);assert.ok(b.lan&&b.wan);}
 assert.ok(LAN_SHUT>=FENCE_START&&WAN_SHUT<=113.26+1e-9);assert.ok(!links('A',WAN_SHUT).wan&&!links('A',LAN_SHUT).lan&&links('A',LAN_SHUT-1e-3).lan);
 assert.ok(RELEASE>IN_SYNC&&links('A',RELEASE).lan&&links('A',RELEASE).wan&&!links('A',RELEASE-1e-3).lan);
 for(const f of FLIGHTS.filter(f=>f.unit==='A'))assert.ok(f.t0<WAN_SHUT,`${f.id}: nothing through A after fencing`);
});
test('preferences are set before the repair; the election follows the repair and B wins',()=>{assert.equal(priority('A',HA_UP),100);assert.equal(priority('B',HA_UP),200);assert.ok(HA_UP<ELECTED&&ELECTED<IN_SYNC);assert.equal(priority('A',10),200);assert.equal(priority('B',10),100);});
test('heartbeat and sync only over a working ha1; sync follows the Primary',()=>{
 for(const h of HEARTBEATS){assert.ok(haUp(h.t0)&&haUp(h.t1),'heartbeat in flight across the break');assert.ok(!(h.t0<HA_DOWN&&h.t1>HA_DOWN));}
 assert.ok(HEARTBEATS.some(h=>h.t0>=HA_UP&&h.t0<HA_UP+1));assert.ok(!HEARTBEATS.some(h=>h.t1>HA_DOWN&&h.t0<HA_UP));
 for(const y of SYNCS){assert.ok(haUp(y.t0)&&haUp(y.t1),y.id);assert.equal(`${y.from}→${y.to}`,y.t0<HA_DOWN?'A→B':'B→A',y.id);}
 assert.equal(syncDir(100),null);assert.ok(!inSync(100)&&inSync(IN_SYNC)&&!inSync(IN_SYNC-1e-3));
});
test('S-17: synchronised, diverging in split brain, B authoritative afterwards',()=>{
 assert.equal(s17('A',30).seq,s17('B',30).seq);assert.ok(diverged(110));assert.equal(s17('A',IN_SYNC).seq,s17('B',IN_SYNC).seq);assert.match(s17('A',IN_SYNC).src,/Resync von B/);
 assert.equal(s17('A',DURATION).seq,s17('B',DURATION).seq);assert.ok(!diverged(80)&&!diverged(150));
});
test('split brain breaks sessions: replies die only at the other unit and only while both forward',()=>{
 const drops=FLIGHTS.filter(f=>f.fate==='drop');assert.ok(drops.length>=5);
 for(const f of drops){assert.ok(f.t0>=B_PRIMARY&&f.t0<WAN_SHUT+3,f.id);const req=BY_ID.get(f.id.slice(0,-1));assert.ok(req&&req.unit!==f.unit,`${f.id} died at the unit without the session`);}
 for(const f of FLIGHTS.filter(f=>f.kind==='test'))assert.equal(f.unit,'B');
});
test('screen texts: local views only, results after their event, previews until executed',()=>{
 for(const t of[90,95,105])for(const l of blockLines('B02',t)){if(l.pane==='A')assert.ok(!/Primary: B/.test(l.text));if(l.pane==='B')assert.ok(!/Primary: A/.test(l.text));}
 assert.ok(!blockLines('B02',B_PRIMARY-.01).some(l=>/Primary: B/.test(l.text))&&blockLines('B02',B_PRIMARY).some(l=>/Primary: B/.test(l.text)));
 assert.ok(BLOCKS.B05.lines.every(l=>l[0]>=IN_SYNC));assert.ok(BLOCKS.B04.lines.find(l=>/Wahl/.test(l[1]))[0]>=ELECTED);assert.ok(previewB06(RELEASE-1e-3)&&!previewB06(RELEASE));
 for(const[id,b]of Object.entries(BLOCKS)){const pages=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[4]===i)):[b.lines];for(const pg of pages)for(const pane of new Set(pg.map(l=>l[3])))assert.ok(pg.filter(l=>l[3]===pane).length<=6,`${id}/${pane}`);assert.ok(b.win[1]-b.win[0]>=4,id);}
});
test('kinetic words: Active/Standby on the right device, a note for each',()=>{for(const[id,dev]of Object.entries(KINETIC)){const l=lyric(id);assert.ok(l,id);assert.ok(WORD_NOTE[id],id);const w=l.text.replace(/\W/g,'').toLowerCase();if(w==='active')assert.equal(dev,role('A',l.start_s)==='primary'&&l.start_s<HA_DOWN?'A':'B',id);if(w==='standby')assert.equal(dev,l.start_s<HA_DOWN?'B':'A',id);}});
test('camera targets, addresses, log spacing, pure time',()=>{
 for(const s of SHOTS.filter(s=>s.target?.startsWith('f:'))){const f=BY_ID.get(s.target.slice(2));assert.ok(f,s.id);assert.ok(f.t0<s.end&&f.tGone>s.start-.3,s.id);}
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message),ADDR.s17,ADDR.lanIp].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);
 const a=JSON.stringify(activeFlights(100).map(f=>[f.id,pointAt(f,100)]));activeFlights(30);activeFlights(180);assert.equal(JSON.stringify(activeFlights(100).map(f=>[f.id,pointAt(f,100)])),a);
});
