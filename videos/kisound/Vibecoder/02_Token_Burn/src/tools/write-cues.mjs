// Writes variants/<lang>/UMSETZUNG-CUES.md/.json from the code for both versions, so the cue sheets never drift
// from the film. Each version runs in its own process (the version is fixed when config.js loads).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const self=fileURLToPath(import.meta.url),root=path.resolve(path.dirname(self),'../..');
if(!process.env.TOKEN_BURN_LANG){for(const lang of['de','en'])execFileSync(process.execPath,[self],{env:{...process.env,TOKEN_BURN_LANG:lang},stdio:'inherit'});process.exit(0);}
const C=await import('../render/config.js'),{Timeline}=await import('../render/timeline.js'),M=await import('../render/model.js');
const {LANG,DURATION,CHAPTERS,KEYWORDS,FADE_START,GAPS,SOURCE_WAV}=C;
const analysis=JSON.parse(fs.readFileSync(path.join(root,C.ANALYSIS_PATH))),tl=new Timeline(analysis);
const tc=t=>Number.isFinite(t)?`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`:'läuft',r3=v=>Number.isFinite(v)?+v.toFixed(3):null;
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:r3(s.end),zone:s.zone,mode:s.mode,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const jobs=M.JOBS.map(j=>({id:j.id,text:M.TXT.jobs[j.id],typed_s:r3(j.typed),sent_s:r3(j.sent),done_s:r3(j.done),version:j.version,input_tokens:j.input,output_tokens:j.output}));
const story={bass_on_s:M.BASS_ON.map(r3),reload_empty_s:r3(M.RELOAD1),fix_line_s:r3(M.FIX_LINE),reload_fixed_s:r3(M.RELOAD2),compare_s:r3(M.COMPARE2),pass_s:r3(M.PASS2),export:Object.fromEntries(Object.entries(M.EXPORT).map(([k,v])=>[k+'_s',r3(v)])),tabs:M.TABS.map(([t,op,k])=>({time_s:r3(t),op,tab:k}))};
const end=M.usage(DURATION);
const out={schema:'kisound.token-burn.cues.v1',language:LANG,source_wav:SOURCE_WAV,duration_s:DURATION,fade_start_s:FADE_START,gaps_s:GAPS,chapters:CHAPTERS,keywords:KEYWORDS,shots,jobs,story,usage_end:end};
fs.writeFileSync(path.join(root,'variants',LANG,'UMSETZUNG-CUES.json'),JSON.stringify(out,null,1)+'\n');
const md=[`# Token Burn ${LANG.toUpperCase()} — Umsetzung, Schnitt und Cues`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten ab Sample 0 der Original-WAV \`${SOURCE_WAV}\`; Fassung ${LANG.toUpperCase()}.`,``,
 `${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${KEYWORDS.length} TOKEN-BURN-Einsätze. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet. Blende ab ${FADE_START} s, Pegellücken ${GAPS.map(g=>g.join('–')).join(', ')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## TOKEN BURN`,``,`| Hook | Shot | Stimme ab | Sichtbar mindestens bis |`,`| --- | --- | --- | --- |`,...KEYWORDS.map(k=>`| ${k.id} | ${k.shot} | ${tc(k.start)} | ${tc(k.visualEnd)} |`),``,
 `## Aufträge (fiktives Demo-Szenario)`,``,`| Auftrag | Text | getippt | gesendet | fertig | Version | Input | Output |`,`| --- | --- | --- | --- | --- | --- | ---: | ---: |`,...jobs.map(j=>`| ${j.id} | ${j.text} | ${tc(j.typed_s)} | ${tc(j.sent_s)} | ${tc(j.done_s??Infinity)} | ${j.version} | ${j.input_tokens} | ${j.output_tokens} |`),``,
 `Nutzung am Ende: ${end.input} Input + ${end.output} Output = ${end.total} Tokens, ${end.credits} Demo-Credits (1 je 1 000 Input, 2 je 1 000 Output; frei erfunden).`,``,
 `## Zustände`,``,`- Bassreihe: Schritte an bei ${story.bass_on_s.map(tc).join(', ')}; Reload mit leerer Bassreihe ${tc(story.reload_empty_s)}; ergänzte Zeile ${tc(story.fix_line_s)}; Reload ${tc(story.reload_fixed_s)}, Vergleich ${tc(story.compare_s)}, PASS ${tc(story.pass_s)}.`,
 `- Export: Ansicht ${tc(M.EXPORT.show)}, ${LANG==='en'?'FAILED':'nicht bereit'} ${tc(M.EXPORT.fail)}, Ursache ${tc(M.EXPORT.cause)}, Ergänzung ${tc(M.EXPORT.fix)}, Vergleich 64 Schritte ab ${tc(M.EXPORT.compare)}, bereit ${tc(M.EXPORT.ready)}.`,
 `- Tabs: ${story.tabs.map(x=>`${tc(x.time_s)} ${x.op==='open'?'+':'−'}${x.tab}`).join(' · ')}.`,``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Modus | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- |`,...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.mode} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``];
fs.writeFileSync(path.join(root,'variants',LANG,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${LANG.toUpperCase()}: ${shots.length} Einstellungen, ${jobs.length} Aufträge geschrieben.`);
