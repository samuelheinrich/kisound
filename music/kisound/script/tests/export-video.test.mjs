import test from 'node:test';
import assert from 'node:assert/strict';
import {options,makePlan,rendererArgs,muxArgs,validateOutput} from '../export-video.mjs';
const root='/tmp/Song with spaces';
const config={schema:'kisound.render-export.v1',outputName:'05_WiFi_Roaming',audio:'assets/audio/song mix.wav',title:'WiFi Roaming',artist:'Samuel Heinrich'};
const timing={FPS:60,FRAMES:10613,DURATION:8490287/48000};
const audio={streams:[{codec_type:'audio',duration:String(timing.DURATION)}]};
const plan=(argv=[])=>makePlan(options(argv,root),config,timing,audio,new Date('2026-09-29T12:34:56.789Z'));
function info(p){return{streams:[{codec_type:'video',width:p.width,height:p.height,nb_frames:String(p.frames),avg_frame_rate:'60/1',codec_name:'h264',duration:String(p.frames/p.fps)},{codec_type:'audio',codec_name:'aac',duration:String(p.audioDuration)}]};}
test('resolution presets retain film fps and exact final partial frame',()=>{
 const a=plan(['--resolution','1080p']),b=plan(['--resolution','4k']);assert.deepEqual([a.width,a.height],[1920,1080]);assert.deepEqual([b.width,b.height],[3840,2160]);assert.equal(b.jobs,1);assert.equal(b.frames,10613);assert.equal(b.fps,60);
});
test('invalid flags and values stop before starting any export',()=>{
 for(const a of[['--resolution','8k'],['--jobs','0'],['--jobs','2.5'],['--quality','101'],['--crf','NaN'],['--preset','mystery'],['--unknown'],['--resolution']])assert.throws(()=>options(a,root));
});
test('default names distinguish resolution and time, and explicit paths are song-relative',()=>{
 assert.ok(plan().output.endsWith('05_WiFi_Roaming_1080p60_20260929T123456789Z.mp4'));
 assert.equal(plan(['--out','output/My final.mp4']).output,root+'/output/My final.mp4');
 assert.throws(()=>plan(['--out','output/master.mov']),/mp4/);
});
test('audio/film mismatch and truncation are rejected',()=>{
 const o=options([],root);assert.throws(()=>makePlan(o,config,timing,{streams:[{codec_type:'audio',duration:'190'}]}),/abweichen|weichen/);
 assert.throws(()=>makePlan(o,config,timing,{streams:[{codec_type:'audio',duration:'177'}]}),/letzten Videobild/);
 assert.throws(()=>makePlan(o,config,{...timing,FRAMES:100},audio),/passen nicht/);
});
test('renderer gets safe argument arrays, resolution and no audio mux',()=>{
 const p=plan(['--resolution','4k','--chrome','/Applications/Google Chrome.app/Chrome']);const args=rendererArgs(p,'/tmp/Work dir/video.mp4');
 assert.equal(args[args.indexOf('--width')+1],'3840');assert.equal(args.at(-1),'/tmp/Work dir/video.mp4');assert.ok(!args.includes('--audio'));assert.ok(args.includes('/Applications/Google Chrome.app/Chrome'));
});
test('mux keeps the complete video and uses explicit streams',()=>{
 const p=plan(),args=muxArgs(p,'/tmp/video.mp4','/tmp/complete.mp4');assert.ok(!args.includes('-shortest'));assert.ok(args.includes('0:v:0'));assert.ok(args.includes('1:a:0'));assert.ok(args.includes(root+'/assets/audio/song mix.wav'));assert.ok(args.includes('artist=Samuel Heinrich'));assert.equal(args[0],'-n');
});
test('verification detects dropped final frame, wrong resolution and wrong audio',()=>{
 const p=plan();assert.equal(validateOutput(p,info(p)).frames,10613);
 const dropped=info(p);dropped.streams[0].nb_frames='10612';assert.throws(()=>validateOutput(p,dropped));
 const small=info(p);small.streams[0].width=1280;assert.throws(()=>validateOutput(p,small));
 const wrongAudio=info(p);wrongAudio.streams[1].duration='175';assert.throws(()=>validateOutput(p,wrongAudio));
});
test('check mode and explicit project work independently of current directory',()=>{
 const o=options(['--project',root,'--check','--encoder','x264','--jobs','1'],'/elsewhere');assert.equal(o.project,root);assert.equal(o.check,true);assert.equal(o.encoder,'x264');assert.deepEqual(options(['--help']),{help:true});
});
