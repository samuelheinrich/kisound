// Writes variants/<lang>/UMSETZUNG-CUES.md/.json from the code for both versions, so the cue sheets never drift
// from the film. Each version runs in its own process (the version is fixed when config.js loads).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const self=fileURLToPath(import.meta.url),root=path.resolve(path.dirname(self),'../..');
if(!process.env.SHIP_IT_LANG){for(const lang of['de','en'])execFileSync(process.execPath,[self],{env:{...process.env,SHIP_IT_LANG:lang},stdio:'inherit'});process.exit(0);}
const C=await import('../render/config.js'),{Timeline}=await import('../render/timeline.js'),M=await import('../render/model.js');
const {LANG,DURATION,CHAPTERS,TITLE_HOOKS,FADE_START,GAPS,DROPS,SOURCE_WAV}=C;
const analysis=JSON.parse(fs.readFileSync(path.join(root,C.ANALYSIS_PATH))),tl=new Timeline(analysis);
const tc=t=>Number.isFinite(t)?`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`:'–',r3=v=>Number.isFinite(v)?+v.toFixed(3):null;
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:r3(s.end),zone:s.zone,mode:s.mode,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const EVENTS=[['TRACKS_READY','TRACKS bereit'],['ENTER_BUILD','Enter: npm run build'],['BUILD_PASS','BUILD PASS'],['ENTER_CHECK1','Enter: npm run check'],['CHECK_FAIL','CHECK FAIL · 1 Fehler (Cover fehlt)'],
 ['UNDERSCORE_FLASH','Unterstrich leuchtet'],['ENTER_MV','Enter: mv … (zurückbenannt)'],['PATH_FIXED','Referenz = Datei'],['ENTER_CHECK2','Enter: derselbe Check'],['CHECK_PASS','CHECK PASS · 0 Fehler'],
 ['ENTER_COMMIT','Enter: git commit'],['COMMIT','Release-Commit'],['ENTER_DEPLOY','Enter: npm run deploy -- --live'],['UPLOAD_DONE','Upload fertig (Cover, Audio, Texte)'],['RELOAD1','normaler Reload: alter Stand (Cache)'],
 ['HARD_RELOAD','harter Reload'],['NEW_PAGE','Album drei im Browser'],['DE_OK','DE geprüft'],['SWITCH_EN','Sprachschalter EN'],['EN_OK','EN geprüft'],['LYRIC_SAME','Lyrics unverändert'],['LIVE_VERIFIED','LIVE PASS'],
 ['LINK_COPIED','Link kopiert'],['PLAY','Play'],['NEXT_NOTE','Notiz: nächstes Album, nächster Commit']];
const story=EVENTS.map(([k,label])=>({id:k,time_s:r3(M[k]),label}));
const out={schema:'kisound.ship-it.cues.v1',language:LANG,source_wav:SOURCE_WAV,duration_s:DURATION,fade_start_s:FADE_START,gaps_s:GAPS,drops_s:DROPS,chapters:CHAPTERS,titles:TITLE_HOOKS,story,
 bridge:M.bridgeCards(DURATION).map(c=>({text:c.text,start_s:r3(c.start)})),upload:M.UPLOAD,shots};
fs.writeFileSync(path.join(root,'variants',LANG,'UMSETZUNG-CUES.json'),JSON.stringify(out,null,1)+'\n');
const md=[`# SHIP IT ${LANG.toUpperCase()} — Umsetzung, Schnitt und Cues`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten ab Sample 0 der Original-WAV \`${SOURCE_WAV}\`; Fassung ${LANG.toUpperCase()}.`,``,
 `${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${TITLE_HOOKS.length} Titelmomente (${TITLE_HOOKS.filter(h=>h.anchor).length} mit ASR-Anker). Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet. Blende ab ${FADE_START} s (Ende der letzten Stimme), Pegellücken ${GAPS.map(g=>g.join('–')).join(', ')} s, Sub-Bass-Einsätze ${DROPS.join(', ')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## COMMIT IT. SHIP IT.`,``,`| Titel | Shot | ab | lesbar bis | dritte Zeile | Anker |`,`| --- | --- | --- | --- | --- | --- |`,...TITLE_HOOKS.map(h=>`| ${h.id} | ${h.shot} | ${tc(h.start)} | ${tc(h.until)} | ${h.sub?M.TXT.hookSub[h.sub]:'–'} | ${h.anchor?'ASR (Hörprüfung offen)':'redaktionell'} |`),``,
 `## Release-Ablauf (redaktionelles Szenario)`,``,`| Zeit | Ereignis |`,`| --- | --- |`,...story.map(e=>`| ${tc(e.time_s)} | ${e.label} |`),``,
 `Upload: Cover ${M.UPLOAD[0]}, Audio ${M.UPLOAD[1]}, Texte ${M.UPLOAD[2]} Dateien. Datei im Ordner \`${M.ON_DISK}\`, Referenz \`${M.EXPECTED}\`.`,``,
 `## Bridge`,``,M.bridgeCards(DURATION).map(c=>`${tc(c.start)} ${c.text}`).join(' · ')+(LANG==='en'?' (ASR-Wortanfänge)':' (Tracks/Covers ASR, übrige Karten redaktionell an den Schnitten)'),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Modus | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- |`,...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.mode} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``];
fs.writeFileSync(path.join(root,'variants',LANG,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${LANG.toUpperCase()}: ${shots.length} Einstellungen, ${story.length} Ereignisse geschrieben.`);
