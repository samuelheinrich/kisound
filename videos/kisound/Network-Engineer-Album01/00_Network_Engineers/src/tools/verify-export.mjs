import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {DURATION,FPS,FRAMES,SOURCE_SHA256} from '../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const file=path.join(root,'output/00_Network_Engineers_1080p60.mp4');
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:16*1024*1024});if(r.error)throw r.error;if(r.status!==0)throw new Error(`${cmd}: ${r.stderr}`);return r.stdout;};
const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file]));
const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.codec_name,'h264');
assert.equal(v.avg_frame_rate,`${FPS}/1`);assert.equal(Number(v.nb_frames),FRAMES);
assert.equal(v.pix_fmt,'yuv420p');assert.equal(v.color_space,'bt709');
assert.ok(Math.abs(Number(v.duration)-DURATION)<=1/FPS+.001);
assert.equal(a.codec_name,'aac');assert.equal(a.channels,2);assert.equal(a.sample_rate,'48000');
assert.ok(Math.abs(Number(a.duration)-DURATION)<.03);
run('ffmpeg',['-v','error','-xerror','-i',file,'-map','0:v:0','-map','0:a:0','-f','null','-']);
const dir=path.join(root,'output/export-check');fs.mkdirSync(dir,{recursive:true});
for(const t of [3,132.8,202,207.5])run('ffmpeg',['-y','-v','error','-ss',String(t),'-i',file,'-frames:v','1',path.join(dir,`frame-${t}.png`)]);
const hash=async p=>{const h=crypto.createHash('sha256');for await(const chunk of fs.createReadStream(p))h.update(chunk);return h.digest('hex');};
const sources={};for(const p of ['src/render/world.js','src/render/film.js','assets/fonts/Michroma-Regular.ttf'])sources[p]=await hash(path.join(root,p));
const report={status:'passed',file:path.basename(file),sha256:await hash(file),bytes:fs.statSync(file).size,
 original_audio_sha256:SOURCE_SHA256,original_audio_duration_s:DURATION,frames:FRAMES,decode:'full video and audio decoded without errors',
 title_windows_s:[[.65,8.4],[198.6,DURATION]],font:'Michroma (SIL OFL)',sources,probe};
fs.writeFileSync(path.join(root,'output/export-manifest.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,bytes:report.bytes,video_duration_s:v.duration,audio_duration_s:a.duration,frames:FRAMES,sha256:report.sha256},null,2));
