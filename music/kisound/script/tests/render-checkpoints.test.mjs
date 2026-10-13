import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {frameRanges,validateSegment,renderWithCheckpoints,loadResume,acquireLock,createRunner} from '../render-checkpoints.mjs';
import {options,rendererArgs,muxArgs,validateOutput} from '../export-video.mjs';

const sha256=async file=>crypto.createHash('sha256').update(await fsp.readFile(file)).digest('hex');
const probe=file=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
const ffmpeg=args=>execFileSync('ffmpeg',['-hide_banner','-loglevel','error',...args],{stdio:['ignore','pipe','pipe']});
async function fixture(t){
 const dir=await fsp.mkdtemp(path.join(os.tmpdir(),"kisound test '$-"));
 t.after(()=>fsp.rm(dir,{recursive:true,force:true}));
 await fsp.mkdir(path.join(dir,'src'),{recursive:true});await fsp.mkdir(path.join(dir,'assets'));
 await fsp.writeFile(path.join(dir,'ASTRA-AUDIO-ANALYSE.json'),'{"test":1}');
 const renderer=path.join(dir,'src/render.mjs'),audio=path.join(dir,'assets/audio.wav');
 await fsp.writeFile(renderer,'// deterministic fixture');
 ffmpeg(['-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-t','10.4',audio]);
 const output=path.join(dir,'output','test.mp4');
 const plan={project:dir,audio,renderer,chrome:process.execPath,width:128,height:72,fps:2,frames:21,duration:10.5,audioDuration:10.4,
  encoder:'x264',jobs:1,quality:85,crf:20,preset:'ultrafast',chunkSeconds:5,retries:1,tempDir:dir,keepTemp:true,title:'Fixture',artist:'Test',output,log:output+'.log',manifest:output+'.json'};
 return{dir,plan};
}
function dependencies(calls,failFrom){
 return{sha256,probe,rendererArgs,muxArgs,validateOutput,
  runnerFactory:()=>({aborted:false,dispose(){},async run(cmd,args){
   if(cmd===process.execPath){
    const val=k=>args[args.indexOf(k)+1];const from=+val('--from'),to=+val('--to');calls.push([from,to]);
    if(from===failFrom)throw new Error('Target closed (injected test failure)');
    // Tiny synthetic frames, not any song or browser render. Distinct colours
    // expose dropped/repeated frames at concat boundaries in decoded output.
    const colour=from===0?'red':from===10?'green':'blue';
    ffmpeg(['-f','lavfi','-i',`color=c=${colour}:s=128x72:r=2`,'-frames:v',String(to-from),'-an','-c:v','libx264','-pix_fmt','yuv420p','-preset','ultrafast',val('--out')]);
   }else execFileSync(cmd,args,{stdio:['ignore','pipe','pipe']});
  }}),
 };
}
test('absolute frame ranges cover fractional final second without gaps',()=>{
 const ranges=frameRanges(12452,60,20);
 assert.equal(ranges.length,11);assert.equal(ranges[0].from,0);assert.equal(ranges.at(-1).to,12452);
 assert.equal(ranges.reduce((n,r)=>n+r.to-r.from,0),12452);
 for(let i=1;i<ranges.length;i++)assert.equal(ranges[i].from,ranges[i-1].to);
 assert.equal(frameRanges(7,29.97,20).length,1);
 assert.throws(()=>frameRanges(10,NaN,20));
});
test('retry/chunk flags and resume cannot silently replace stored settings',()=>{
 assert.equal(options([]).jobs,1);assert.equal(options([]).chunkSeconds,20);
 assert.equal(options(['--chunk-seconds','10','--retries','0']).retries,0);
 for(const argv of [['--chunk-seconds','0'],['--chunk-seconds','61'],['--retries','6'],['--resume','/tmp/a','--resolution','4k']])assert.throws(()=>options(argv));
 assert.deepEqual(options(['--resume','/tmp/a','--check']),{resume:'/tmp/a',check:true,keepTemp:false});
});
test('segment validation rejects missing final frame',()=>{
 const p={width:128,height:72,fps:60},r={index:0,from:1200,to:2400};
 const info={streams:[{codec_type:'video',codec_name:'h264',width:128,height:72,nb_frames:'1199',avg_frame_rate:'60/1',duration:'20'}]};
 assert.throws(()=>validateSegment(p,r,info));info.streams[0].nb_frames='1200';assert.equal(validateSegment(p,r,info).frames,1200);
});
test('failure preserves checkpoints; resume skips finished frames and joins exact frames/audio',async t=>{
 const {dir,plan}=await fixture(t),first=[];
 await assert.rejects(renderWithCheckpoints(plan,dependencies(first,10)),/Target closed/);
 assert.deepEqual(first,[[0,10],[10,20],[10,20]]);
 const scratch=path.join(dir,fs.readdirSync(dir).find(f=>f.startsWith('kisound-export-')));
 assert.equal(JSON.parse(fs.readFileSync(path.join(scratch,'checkpoint.json'))).completed.length,1);
 assert.ok(!fs.existsSync(path.join(scratch,'export.lock')));assert.ok(!fs.existsSync(plan.output));
 const resumed=await loadResume({resume:scratch}),second=[];
 await renderWithCheckpoints(resumed,dependencies(second));
 assert.deepEqual(second,[[10,20],[20,21]]);
 const info=probe(plan.output);assert.equal(validateOutput(plan,info).frames,21);
 const bytes=execFileSync('ffmpeg',['-v','error','-i',plan.output,'-vf','scale=1:1','-pix_fmt','rgb24','-f','rawvideo','-'],{maxBuffer:100000});
 assert.equal(bytes.length,21*3);
 for(let i=0;i<21;i++){
  const rgb=[...bytes.subarray(i*3,i*3+3)],dominant=i<10?0:i<20?1:2;
  assert.equal(rgb.indexOf(Math.max(...rgb)),dominant,`frame ${i}`);
 }
 assert.equal(JSON.parse(fs.readFileSync(plan.manifest)).verification.fullVideoDecode,true);
 await assert.rejects(loadResume({resume:scratch}),/abgeschlossen/);
});
test('changed source refuses resume; corrupt cached segment gets rendered again',async t=>{
 const {dir,plan}=await fixture(t);
 await assert.rejects(renderWithCheckpoints(plan,dependencies([],10)));
 const scratch=path.join(dir,fs.readdirSync(dir).find(f=>f.startsWith('kisound-export-')));
 const old=await fsp.readFile(plan.renderer);await fsp.appendFile(plan.renderer,'changed');
 await assert.rejects(loadResume({resume:scratch}),/verändert/);await fsp.writeFile(plan.renderer,old);
 const analysis=path.join(dir,'ASTRA-AUDIO-ANALYSE.json');
 await fsp.writeFile(analysis,'{"test":2}');await assert.rejects(loadResume({resume:scratch}),/verändert/);
 await fsp.writeFile(analysis,'{"test":1}');
 await fsp.writeFile(path.join(scratch,'chunk-00000.mp4'),'corrupt');
 const calls=[];await renderWithCheckpoints(await loadResume({resume:scratch}),dependencies(calls));
 assert.deepEqual(calls,[[0,10],[10,20],[20,21]]);
});
test('working folder lock prevents concurrent export and is releasable',async t=>{
 const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'kisound-lock-'));t.after(()=>fsp.rm(dir,{recursive:true,force:true}));
 const release=await acquireLock(dir);await assert.rejects(acquireLock(dir),/bereits/);await release();
 await (await acquireLock(dir))();
});
test('missing executable and nonzero child exit fail without hanging the runner',async t=>{
 const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'kisound-runner-'));t.after(()=>fsp.rm(dir,{recursive:true,force:true}));
 const runner=createRunner({project:dir},dir,()=>{});t.after(()=>runner.dispose());
 await assert.rejects(runner.run('/missing/kisound-executable',[]),/ENOENT/);
 await assert.rejects(runner.run(process.execPath,['-e','process.exit(1)']),/beendet/);
 await runner.run(process.execPath,['-e','process.exit(0)']);
});
