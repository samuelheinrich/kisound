import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAPS,FADE_START,AMBIENT_DIM} from '../src/render/config.js';
import {FLIGHTS,BY_ID,QUEUE_DROPS,outputDrops,bulkRate,guiState,BEFORE_ROWS,AFTER_ROWS,BLOCKS,blockLines,LOGS,KINETIC,WORD_NOTE,IP_FILTER,STREAM_FILTER,FINDING,BULK_LIMIT,NEW_TEST,HTTP_OK,CAP_STOP,activeFlights,pointAt,ADDR} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(FRAMES,Math.ceil(DURATION*FPS));});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list is the shooting script: 61 shots with its start times',()=>{const st=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \|/gm)].map(m=>[m[1],+m[2]]);assert.equal(st.length,61);assert.equal(SHOTS.length,61);st.forEach(([id,s],i)=>{assert.equal(SHOTS[i].id,id);assert.ok(Math.abs(SHOTS[i].start-s)<1e-6,id);});});
test('every event and lyric lands in exactly one shot, as in the script',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);});
test('bass, gaps and close follow the measurements; the last word stays readable',()=>{
 const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30);assert.ok(Math.abs(AMBIENT_DIM-data.events.find(e=>e.type==='fade_candidate').time_s)<.01);
 const w=lyric('L052');assert.ok(FADE_START>=w.end_s-1e-6,'«Warum» ends before the close');assert.ok(tl.visibility((w.start_s+w.end_s)/2)>.99);
 const gap=GAPS[0];assert.ok(gap[0]>=lyric('L025').start_s&&gap[0]<lyric('L025').end_s,'the silence falls on «Der Request geht raus, dann Stille»');
});
test('O-101 is captured BEFORE, lost at the SW-A output queue, never AFTER; O-102 reaches both',()=>{
 const o=BY_ID.get('O-101');assert.equal(o.fate,'drop');assert.equal(o.nodes[o.cut],'AQ');assert.ok(BY_ID.get('M-B-O-101'));assert.ok(!BY_ID.get('M-A-O-101'),'no AFTER copy of the lost original');
 assert.ok(BY_ID.get('M-A-O-102')&&BY_ID.get('M-B-O-102'));assert.ok(BEFORE_ROWS.some(r=>r.no===101&&r.seq===12001)&&BEFORE_ROWS.some(r=>r.retrans&&r.seq===12001));
 const after12001=AFTER_ROWS.filter(r=>r.seq===12001);assert.equal(after12001.length,1,'AFTER has the byte range once – the retransmission');assert.ok(!after12001[0].retrans,'AFTER cannot label it as retransmission');
 for(const f of FLIGHTS.filter(f=>f.kind==='mirror'))assert.ok(/ANA_/.test(f.nodes.at(-1)),'mirror copies only go to the analysers');
 for(const f of FLIGHTS.filter(f=>f.replay))assert.ok(!QUEUE_DROPS.includes(f.t1),'replays are not counted');
});
test('the finding: +18 output drops in the window, zero capture drops, no new drops during the controlled test',()=>{
 assert.equal(outputDrops(0),3800);assert.equal(outputDrops(FINDING),3818);assert.equal(outputDrops(DURATION),3818);assert.ok(QUEUE_DROPS.every(t=>t<BULK_LIMIT));
 assert.equal(guiState('BEFORE',100).dropped,0);assert.equal(guiState('AFTER',100).dropped,0);assert.ok(BLOCKS.B05.lines.find(l=>/Befund/.test(l[1]))[0]>=FINDING);
 assert.ok(bulkRate(BULK_LIMIT-.01)===95&&bulkRate(BULK_LIMIT)===20);assert.ok(Math.abs(BULK_LIMIT-139.8)<1e-9&&Math.abs(NEW_TEST-142.72)<1e-9);
 for(const f of FLIGHTS.filter(f=>/^N\d/.test(f.id)))assert.equal(f.fate,'deliver',f.id);
});
test('display filters hide rows but never delete frames; the stream filter isolates stream 7',()=>{
 const a=guiState('BEFORE',IP_FILTER-.1),b=guiState('BEFORE',STREAM_FILTER+1);assert.equal(a.filt,'');assert.equal(b.filt,'tcp.stream == 7');assert.ok(b.rows.every(r=>r.stream===7));assert.ok(b.total>=a.total,'total stays');assert.ok(b.displayed<b.total);
 assert.equal(guiState('AFTER',STREAM_FILTER+1).filt,'tcp.stream == 3');assert.ok(guiState('BEFORE',CAP_STOP+1).stopped&&!guiState('BEFORE',CAP_STOP-1).stopped);
});
test('results only after their test; TLS stays encrypted; capture really stopped',()=>{
 assert.ok(BLOCKS.B06.lines.filter(l=>/HTTP 200|status/.test(l[1])&&!/curl/.test(l[1])).every(l=>l[0]>=HTTP_OK));assert.equal(BY_ID.get('N2R').t1,HTTP_OK);
 assert.ok(BLOCKS.B04.lines.some(l=>/Payload verschlüsselt/.test(l[1])));assert.ok(!JSON.stringify(BLOCKS).match(/GET \/health HTTP\/1\.1|Klartext:/));
 assert.equal(BLOCKS.B07.lines[0][0],CAP_STOP);assert.match(BLOCKS.B07.lines[0][1],/STOPPED/);
 for(const[id,b]of Object.entries(BLOCKS)){const pages=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[3]===i)):[b.lines];for(const p of pages)assert.ok(p.length<=6,id);if(b.pages)b.pages.forEach((p,i)=>assert.ok((b.pages[i+1]??b.win[1])-p>=4,`${id}/${i}`));}
});
test('kinetic words, addresses, logs, determinism',()=>{
 for(const id of Object.keys(KINETIC)){assert.equal(lyric(id).text.replace(/\W/g,''),'Wireshark');assert.ok(WORD_NOTE[id]);}
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message),...BEFORE_ROWS.flatMap(r=>[r.src,r.dst]),...AFTER_ROWS.flatMap(r=>[r.src,r.dst])].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);
 const snap=t=>JSON.stringify(activeFlights(t).map(f=>pointAt(f,t)));const a=snap(110);snap(20);snap(150);assert.equal(snap(110),a);
});
