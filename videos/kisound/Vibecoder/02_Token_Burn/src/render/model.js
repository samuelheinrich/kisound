// The editorial scenario of TOKEN BURN as pure functions of time: a small sequencer demo (four rows, sixteen
// steps), six requests P01–P06, a bass row that is lost on reload, an export that drops the bass, browser tabs
// and a usage journal with fictional demo numbers. Story events are tied to shots, so both versions tell the
// same story on their own timeline. Nothing here reads the audio.
import {LANG,SHOT,DURATION} from './config.js';
import {clamp} from './timeline.js';
const S=id=>SHOT[id];
// absolute time: seconds after a shot start (kept inside the shot) or a fraction of the shot
export const at=(id,sec)=>{const s=S(id);return Math.min(s.start+sec,s.end-.05);};
export const af=(id,f)=>{const s=S(id);return s.start+f*(s.end-s.start);};
export const local=(id,t)=>t-S(id).start;

// ---- texts on the screen, per version (the website never translates the picture)
const STR={
 de:{app:'Sequencer-Demo',note:'Nur ein Regler',noteSub:'Level für die Kick-Spur',tested:'getestet',call:'Feierabend',close:'Schliessen',ask:'Auftrag an den Agenten …',send:'Senden',
  newIdea:'Neue Funktion',bassSlider:'Bassregler',secondLane:'Zweite Stimme: Bass',reload:'Reload',bassEmpty:'Bassspur leer',kept:'gespeichert',empty:'leer',saved:'Gespeichert',loaded:'Geladen',
  compare:'Vergleich 4 × 16',equal:'gleich',pass:'PASS',reply:'Antwort',change:'Änderung',test:'Test',inLbl:'IN',outLbl:'OUT',
  exportBtn:'Export',exportNot:'Export noch nicht bereit',exportFail:'EXPORT FAILED',cause:'Ursache: bass fehlt im Exportmodell',inputLanes:'Eingabe · 4 Spuren',exportLanes:n=>`Export · ${n} Spuren`,
  steps:'64 Schritte geprüft',ready:'export.json bereit',ledger:'Nutzungsjournal',demo:'DEMO · fiktives Szenario',cols:['Auftrag','Input','Output','Summe','Zeit','Demo-Credits'],running:'läuft',
  oneMore:'NOCH EIN PROMPT',oneMoreSub:'Ein Auftrag mehr',savedOk:'Gespeichert ✓',nextLine:'Als Nächstes …',settings:'Einstellungen',preview:'Vorschau',versions:'Versionen',freeSlot:'frei',
  usage:'Nutzung',tokens:'Tokens',time:'Zeit',result:'Neuer Stand',before:'vorher',after:'nachher',sameVersion:'gleiche Version',
  jobs:{P01:'Füge einen Level-Regler für die Kick-Spur hinzu.',P02:'Bassregler und zweite Stimme ergänzen. Pattern speichern und nach Reload wiederherstellen.',P03:'Projektstände vergleichen, nächste Ansicht anlegen.',P04:'Export mit allen vier Pattern-Reihen.',P05:'Zusätzliche UI-Einstellungen dauerhaft übernehmen.',P06:'Preset speichern'},
  replies:{P01:['Level-Regler für kick ergänzt.','Build v0.4 läuft.'],P02:['Bassregler und Bassreihe ergänzt.','Speichern + Reload eingebaut.'],P03:['Vergleichsansicht ergänzt.','Build v0.6 neben v0.5.'],P04:['bass in exportTracks() aufgenommen.','Vergleich 4 × 16 bestanden.'],P05:['settings.load() übernimmt swing und theme.','Reload behält 6 von 6 Einstellungen.'],P06:['Preset-Dialog wird angelegt …']},
  tabs:{seq:'Sequencer',build:'Build v0.3',docs:'Docs',preview:'Vorschau',export:'Export',versions:'Versionen',settings:'Einstellungen',presets:'Presets',note:'Notiz'},
  cards:{export:'Export',preset:'Preset speichern'}},
 en:{app:'Sequencer demo',note:'Just one slider',noteSub:'Level for the kick lane',tested:'tested',call:'Call it a night',close:'Close',ask:'Ask the agent …',send:'Send',
  newIdea:'New feature',bassSlider:'Bass slider',secondLane:'Second lane: bass',reload:'Reload',bassEmpty:'Bass lane empty',kept:'saved',empty:'empty',saved:'Saved',loaded:'Loaded',
  compare:'Compare 4 × 16',equal:'equal',pass:'PASS',reply:'Reply',change:'Change',test:'Test',inLbl:'IN',outLbl:'OUT',
  exportBtn:'Export',exportNot:'Export not ready',exportFail:'EXPORT FAILED',cause:'Cause: bass missing from the export model',inputLanes:'Input · 4 lanes',exportLanes:n=>`Export · ${n} lanes`,
  steps:'64 steps checked',ready:'export.json ready',ledger:'Usage journal',demo:'DEMO · fictional scenario',cols:['Request','Input','Output','Total','Time','Demo credits'],running:'running',
  oneMore:'ONE MORE PROMPT',oneMoreSub:'One more request',savedOk:'Saved ✓',nextLine:'Next …',settings:'Settings',preview:'Preview',versions:'Versions',freeSlot:'free',
  usage:'Usage',tokens:'tokens',time:'Time',result:'New state',before:'before',after:'after',sameVersion:'same version',
  jobs:{P01:'Add a level slider to the kick lane.',P02:'Add a bass slider and a second lane. Save the pattern and restore it after reload.',P03:'Compare the project states, add the next view.',P04:'Export with all four pattern rows.',P05:'Persist the extra UI settings.',P06:'Save a preset'},
  replies:{P01:['Added a level slider for kick.','Build v0.4 runs.'],P02:['Added bass slider and bass row.','Save + reload in place.'],P03:['Added a compare view.','Build v0.6 next to v0.5.'],P04:['bass added to exportTracks().','Compare 4 × 16 passed.'],P05:['settings.load() now restores swing and theme.','Reload keeps 6 of 6 settings.'],P06:['Creating the preset dialog …']},
  tabs:{seq:'Sequencer',build:'Build v0.3',docs:'Docs',preview:'Preview',export:'Export',versions:'Versions',settings:'Settings',presets:'Presets',note:'Note'},
  cards:{export:'Export',preset:'Save a preset'}},
};
export const TXT=STR[LANG];
export const STRINGS=STR;

// ---- requests: sent and finished times (editorial scenario times, not measured system events)
export const JOBS=[
 {id:'P01',typed:af('S002',.62),sent:at('S004',2.4),done:at('S007',.25),version:'v0.4',input:1240,output:360},
 {id:'P02',typed:at('S010',.2),sent:af('S010',.62),done:af('S013',.8),version:'v0.5',input:2360,output:640},
 {id:'P03',typed:at('S016',.1),sent:at('S016',.6),done:af('S023',.55),version:'v0.6',input:3180,output:820},
 {id:'P04',typed:af('S025',.55),sent:af('S025',.85),done:af('S031',.8),version:'v0.7',input:4600,output:1400},
 {id:'P05',typed:at('S035',.15),sent:af('S035',.45),done:af('S039',.42),version:'v0.8',input:6240,output:1760},
 {id:'P06',typed:at('S054',.4),sent:at('S055',.55),done:Infinity,version:'v0.9',input:7800,output:1900},
];
export const JOB=Object.fromEntries(JOBS.map(j=>[j.id,j]));
export function jobState(id,t){const j=JOB[id];return t<j.typed?'idle':t<j.sent?'typing':t<j.done?'running':'done';}
export function version(t){let v='v0.3';for(const j of JOBS)if(t>=j.done)v=j.version;return v;}
export const doneJobs=t=>JOBS.filter(j=>t>=j.done);
// P06 is still answering at the end: its visible output grows to 1 900 tokens over the outro.
export function jobOutput(j,t){if(t<j.sent)return 0;if(t>=j.done)return j.output;if(j.done===Infinity)return Math.round(j.output*clamp((t-j.sent)/(DURATION-j.sent)));return 0;}
export function usage(t){
 let input=0,output=0;const rows=[];
 for(const j of JOBS){if(t<j.sent)continue;const out=jobOutput(j,t);input+=j.input;output+=out;rows.push({id:j.id,input:j.input,output:out,running:t<j.done,total:input+output,doneAt:j.done});}
 const credits=input/1000+2*output/1000;   // fictional: 1 credit per 1 000 input, 2 per 1 000 output tokens
 return{input,output,total:input+output,credits:Math.round(credits*100)/100,rows};
}
// ---- the narrative desk clock: 01:00, 02:00, 03:00 hold in their shots, the night is condensed in between
const CLOCK=[[0,47],[S('S007').start,60],[S('S007').end,60],[S('S014').start,120],[S('S014').end,120],[S('S028').start,180],[S('S028').end,180],[S('S042').start,322],[S('S046').start,366],[DURATION,391]];
export function clockMinutes(t){for(let i=1;i<CLOCK.length;i++){const[a,ma]=CLOCK[i-1],[b,mb]=CLOCK[i];if(t<=b)return Math.floor(ma+(mb-ma)*clamp((t-a)/Math.max(1e-6,b-a)));}return CLOCK.at(-1)[1];}
export const clockText=t=>{const m=clockMinutes(t);return`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;};
export const clockAtText=t=>clockText(t);
// ---- the pattern: kick is the first active lane, bass becomes the second one in S009
export const ROWS=['kick','snare','hats','bass'];
export const KICK=[0,4,8,12],BASS=[2,6,10,14];
export const BASS_ON=BASS.map((_,i)=>at('S009',.8+i*.38));
export const RELOAD1=at('S011',.9);          // save → reload with the faulty load path: bass stays empty
export const FIX_LINE=af('S012',.42);        // tracks.bass = saved.tracks.bass;
export const RELOAD2=af('S013',.3),COMPARE2=af('S013',.55),PASS2=JOB.P02.done;
export function bassCount(t){if(t>=RELOAD1&&t<RELOAD2+.25)return 0;let n=0;for(const b of BASS_ON)if(t>=b)n++;if(t>=RELOAD2)n=t>=RELOAD2+.25?4:0;return n;}
export function pattern(t){const n=bassCount(t);return{kick:KICK.slice(),snare:[],hats:[],bass:BASS.slice(0,n)};}
export const saved=t=>t>=at('S010',.1)?{kick:KICK.slice(),snare:[],hats:[],bass:BASS.slice()}:null;
export const hasLevelSlider=t=>t>=JOB.P01.done;
export const hasBassSlider=t=>t>=af('S008',.5);
export const bassSlider=t=>clamp((t-at('S009',.2))/1.4)*.72;
export const playhead=t=>Math.floor(t*136/60*4)%16;   // 16th steps of the demo at the song's estimated tempo
// ---- export: missing bass first, then the targeted fix and the comparison of all 64 steps
export const EXPORT={show:S('S029').start,fail:S('S030').start,cause:af('S030',.45),fix:af('S031',.12),compare:af('S031',.3),ready:JOB.P04.done};
export function exportLanes(t){return t<EXPORT.fix?3:4;}
export function exportState(t){if(t<EXPORT.show)return'none';if(t<EXPORT.fail)return'menu';if(t<EXPORT.fix)return LANG==='en'?'failed':'notReady';if(t<EXPORT.ready)return'fixing';return'ready';}
export const settingsSaved=t=>t>=JOB.P05.done;
// ---- browser tabs: one closes, two open – three times; the usage counter never resets
const T=TXT.tabs;
const TAB_EVENTS=[
 [af('S024',.22),'close','build'],[af('S024',.48),'open','preview'],[af('S024',.7),'open','export'],
 [af('S040',.28),'close','docs'],[af('S040',.5),'open','versions'],[af('S040',.68),'open','settings'],
 [af('S051',.18),'close','versions'],[af('S051',.36),'open','presets'],[af('S051',.52),'open','note'],
];
export function tabs(t){let list=['seq','build','docs'];for(const[time,op,k]of TAB_EVENTS){if(t<time)break;list=op==='close'?list.filter(x=>x!==k):[...list,k];}return list.map(k=>({key:k,name:T[k]}));}
export const TABS=TAB_EVENTS;
// the tab that is just animating (for the 2D tab bar): {key, op, u}
export function tabMotion(t){for(const[time,op,k]of TAB_EVENTS){const u=(t-time)/.45;if(u>=0&&u<1)return{key:k,op,u};}return null;}
// ---- paper on the desk: done request cards stack up; notes tell what comes next
export function noteAt(t){
 if(t<JOB.P01.typed)return{text:TXT.note,sub:TXT.noteSub};
 if(t>=S('S052').start)return{text:TXT.cards.preset,sub:''};
 if(t>=S('S045').start&&t<S('S047').start)return{text:TXT.note,sub:TXT.noteSub};
 if(t>=S('S025').start&&t<JOB.P04.sent)return{text:TXT.cards.export,sub:''};
 return null;
}
export const cardCount=t=>doneJobs(t).length;
export const fmt=n=>n.toLocaleString(LANG==='de'?'de-CH':'en-US').replace(/[’',]/g,' ');
