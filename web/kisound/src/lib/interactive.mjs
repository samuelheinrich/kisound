// Builds the hosted film page of a code-video project. The project only provides the small web
// interface in main.js (window.KISOUND_PAGE); esbuild bundles its src/render/main.js with three.js, swaps the project's player.js for the public player, and the
// page passes analysis and audio locations through window.KISOUND_PAGE (see videos/kisound/README.md).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as esbuild from 'esbuild';
import {slimAnalysis} from './videos.mjs';
import {LANG_BOOT} from './html.mjs';
import crypto from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url)),playerDir=path.resolve(here,'../../player');
const hashed=(dir,name,ext,content)=>{const file=`${name}.${crypto.createHash('sha256').update(content).digest('hex').slice(0,10)}.${ext}`;fs.writeFileSync(path.join(dir,file),content);return file;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const copyTree=(src,dest)=>{fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(src,dest,{recursive:true});};
const siteFonts=path.resolve(here,'../../site/fonts');

// spec (site.config.json): project, label, poster, copy (extra paths), page (extra KISOUND_PAGE values)
// extra: further KISOUND_PAGE values from the site build (lyrics, catalog, base, trackKey)
export async function buildInteractive({project,outDir,spec,audioFile,audioOffset,analysis,wave,meta,versions=null,extra={}}){
 const render=path.join(project,'src/render'),main=path.join(render,'main.js');
 if(!fs.existsSync(main))throw Error(`${project}: src/render/main.js fehlt`);
 fs.mkdirSync(path.join(outDir,'assets/fonts'),{recursive:true});
 const swapPlayer={name:'kisound-player',setup(b){
  b.onResolve({filter:/^\.\/player\.js$/},a=>a.importer===main?{path:path.join(playerDir,'player.js')}:undefined);
  b.onResolve({filter:/^kisound:config$/},()=>({path:path.join(render,'config.js')}));
 }};
 const result=await esbuild.build({entryPoints:[main],bundle:true,format:'esm',minify:true,target:['es2020','safari15'],write:false,legalComments:'none',
  plugins:[swapPlayer],nodePaths:[path.join(project,'node_modules')],logLevel:'silent'});
 const js=hashed(outDir,'film','js',result.outputFiles[0].contents);
 const css=hashed(outDir,'player','css',fs.readFileSync(path.join(playerDir,'player.css')));
 const data=analysis?hashed(outDir,'analysis','json',JSON.stringify(slimAnalysis(analysis))):null;
 // fonts: the site's three families, plus whatever the project brings
 for(const dir of[siteFonts,path.join(project,'assets/fonts')])if(fs.existsSync(dir))for(const f of fs.readdirSync(dir))fs.copyFileSync(path.join(dir,f),path.join(outDir,'assets/fonts',f));
 // 3D sets and project-specific files are fetched by relative path at runtime
 const copies=[...(fs.existsSync(path.join(project,'assets/sets'))?['assets/sets']:[]),...(spec.copy||[])];
 for(const rel of copies)copyTree(path.join(project,rel),path.join(outDir,rel));
 // language versions: each brings its own audio, analysis, waveform and lyric timing; live.html picks one
 const vers=versions?Object.fromEntries(Object.entries(versions).map(([lang,v])=>[lang,{...v,analysis:v.analysis?hashed(outDir,`analysis-${lang}`,'json',JSON.stringify(slimAnalysis(v.analysis))):null}])):null;
 const page={posterTime:spec.poster,analysis:data,...(vers?{versions:vers}:{}),sets:'assets/sets',wave,audio:audioFile,audioOffset,title:meta.title,subtitle:meta.subtitle,kicker:meta.kicker,chapterNames:meta.chapterNames,codeBytes:result.outputFiles[0].contents.length,artist:meta.artist,album:meta.album,artwork:meta.artwork,trackUrl:'../',...extra,...(spec.page||{})};
 const html=fs.readFileSync(path.join(playerDir,'live.html'),'utf8')
  .replace('{{page}}',JSON.stringify(page).replace(/</g,'\\u003c')).replace(/{{title}}/g,esc(meta.title)).replace('{{titleUpper}}',esc(meta.title.toUpperCase()))
  .replace('{{boot}}',LANG_BOOT).replace(/{{site}}/g,esc(meta.site)).replace('{{description}}',esc(meta.description)).replace('{{icon}}',meta.icon||'').replace('{{css}}',css).replace('{{js}}',js);
 fs.writeFileSync(path.join(outDir,'index.html'),html);
 return{js,bytes:result.outputFiles[0].contents.length,copies};
}
