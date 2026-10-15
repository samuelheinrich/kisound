import {LANG,SHOT,SHOTS,DURATION} from './config.js';
import {clamp,smooth,upperBound} from './timeline.js';

const L=(de,en)=>LANG==='de'?de:en;
export const TXT={
 title:'VIBECODER',artist:'SAMUEL HEINRICH',
 catalog:L('TRACK-KATALOG','TRACK CATALOG'),sound:L('EIGENER KLANG','MY OWN SOUND'),tool:L('MEIN TOOL','MY TOOL'),
 file:L('Katalogdatei','Catalog file'),status:L('Status','Status'),expected:L('SOLL','EXPECTED'),actual:L('IST','ACTUAL'),
 pass:'PASS',fail:'FAIL',pending:L('OFFEN','OPEN'),complete:'COMPLETE',running:L('LÄUFT','RUNNING'),
 ask:L('Was fehlt?','What is missing?'),input:L('AUFTRAG','REQUEST'),agent:L('AGENT','AGENT'),diff:'DIFF',test:'TEST',
 save:L('SPEICHERN','SAVE'),reload:'RELOAD',selected:L('AUSWAHL','SELECTION'),
 prompt:L('Prompt rein','Prompt in'),script:L('Skript an','Script runs'),rows:L('Daten klar','Rows align'),
 catalogRequest:L('Setze COMPLETE erst nach fertiger Katalogdatei. Prüfe Zeilen und Status.','Set COMPLETE only after the catalog file closes. Check rows and status.'),
 edgeRequest:L('Prüfe auch den zweiten Exportfall.','Check the second export case too.'),
 appRequest:L('Track wählen. Paket exportieren. Ergebnis sehen.','Choose a track. Export package. See result.'),
 persistRequest:L('Behalte die Trackwahl nach Reload.','Keep the chosen track after reload.'),
 nextRequest:L('Zuletzt genutzten Track vorwählen.','Preselect the last used track.'),
 missing:L('FEHLT','MISSING'),checked:L('GEPRÜFT','VERIFIED'),new:L('NEU','NEW'),
 hardcoder1:L('Du weißt nicht, was da läuft.','You don’t know what’s beneath.'),
 reply1:L('Nicht alles. Aber ich seh, was fehlt.','Not all of it. I know what I need.'),
 hardcoder2:L('Das nennst du Code?','You call that code?'),
 reply2:L('Nenn’s, wie du willst. Ich bau’s trotzdem.','Call it what you want. I’m building anyway.'),
 morning:L('08:00 · EXPORT HÄNGT','8 AM · EXPORT FROZE'),
 noon:L('12:00 · KEIN TRACK PASST','NOON · NOTHING FITS'),
 evening:L('ABEND · DIE APP FEHLT','NIGHT · THE APP IS MISSING'),
 return:L('ZURÜCK ZUM AUFTRAG','BACK TO REQUEST'),
 cycle:['SPEC','BUILD','TEST','FIX'],
 catalogRows:[['01','NIGHT GRID','128'],['02','SLOW CIRCUIT','116'],['03','OPEN LOOP','124']],
 ownTrack:'VIBECODER / OWN BEAT'
};

const S=id=>SHOT[id].start;
export function shotAt(t){return SHOTS[clamp(upperBound(SHOTS,t,s=>s.start)-1,0,SHOTS.length-1)];}
export function shotProgress(t,shot=shotAt(t)){return clamp((t-shot.start)/Math.max(.001,shot.end-shot.start));}
export function clock(t){return t<S('S029')?'08:00':t<S('S038')?'12:00':t<S('S066')?'20:00':'22:00';}
export function placeAt(t){
 const id=Number(shotAt(t).id.slice(1));
 return id<=15?'cafe':id<=28?'park':id<=37?'forest':id<=52?'fairground':id<=65?'coaster':'exit';
}
export function catalog(t){
 if(t<S('S012'))return 'stuck';
 if(t<S('S013'))return 'diff';
 if(t<S('S014'))return 'file_pass';
 if(t<S('S023'))return 'first_pass';
 if(t<S('S024'))return 'edge_fail';
 if(t<S('S026'))return 'edge_fix';
 return 'verified';
}
export function pattern(t){
 if(t<S('S030'))return 'empty';
 if(t<S('S031'))return 'candidates';
 if(t<S('S035'))return 'sketch';
 if(t<S('S037'))return 'steps_set';
 return 'ready';
}
export function app(t){
 if(t<S('S039'))return 'absent';
 if(t<S('S040'))return 'specified';
 if(t<S('S041'))return 'screen';
 if(t<S('S043'))return 'working';
 if(t<S('S044'))return 'lost';
 if(t<S('S045'))return 'wrong_key';
 if(t<S('S046'))return 'wrong_selection';
 if(t<S('S047'))return 'fixing';
 return 'verified';
}
export function catalogPass(t){return ['file_pass','first_pass','edge_fail','edge_fix','verified'].includes(catalog(t));}
export function catalogFullyVerified(t){return catalog(t)==='verified';}
export function appVerified(t){return app(t)==='verified';}
export function artifactStatus(t){return[
 {id:'catalog_export',title:TXT.catalog,state:catalogFullyVerified(t)?'pass':catalogPass(t)?'partial':'open'},
 {id:'track_pattern',title:TXT.sound,state:pattern(t)==='ready'?'pass':pattern(t)==='empty'?'open':'working'},
 {id:'tool_selection',title:TXT.tool,state:appVerified(t)?'pass':app(t)==='absent'?'open':['lost','wrong_key','wrong_selection'].includes(app(t))?'fail':'working'}
];}
export function beatSteps(t){
 const count=t<S('S032')?0:t<S('S035')?4:t<S('S036')?8:t<S('S037')?12:16;
 return Array.from({length:4},(_,r)=>Array.from({length:16},(_,c)=>
  c<count&&([0,4,8,12].includes(c)&&r===0||[4,12].includes(c)&&r===1||c%2===0&&r===2||[0,3,6,10,13].includes(c)&&r===3)));
}
export function inputText(t){
 if(t<S('S016'))return TXT.catalogRequest;
 if(t<S('S029'))return TXT.edgeRequest;
 if(t<S('S038'))return L('Ein eigener Takt. Vier Reihen.','My own beat. Four rows.');
 if(t<S('S043'))return TXT.appRequest;
 if(t<S('S062'))return TXT.persistRequest;
 return TXT.nextRequest;
}
export function bridgeText(t){
 if(t<S('S051'))return null;
 if(t<S('S052'))return {who:'HARD CODER',text:TXT.hardcoder1};
 if(t<S('S054'))return {who:'VIBECODER',text:TXT.reply1};
 if(t<S('S055'))return {who:'HARD CODER',text:TXT.hardcoder2};
 if(t<S('S057'))return {who:'VIBECODER',text:TXT.reply2};
 return null;
}
export function testState(t,which){
 if(which==='file')return t<S('S013')?'wait':'pass';
 if(which==='status')return t<S('S014')?'wait':'pass';
 if(which==='edge')return t<S('S023')?'wait':t<S('S026')?'fail':'pass';
 if(which==='reload')return t<S('S043')?'wait':t<S('S047')?'fail':'pass';
 return 'wait';
}
export function loopPhase(t){
 const shot=shotAt(t);if(!['drop_1','drop_2','outro'].includes(shot.chapter))return -1;
 const u=shotProgress(t,shot),shift=shot.chapter==='outro'?0:(Number(shot.id.slice(1))%4);
 return Math.min(3,Math.floor((u*4+shift)%4));
}
export function filmState(t){return{t,shot:shotAt(t).id,place:placeAt(t),clock:clock(t),catalog:catalog(t),pattern:pattern(t),app:app(t),artifacts:artifactStatus(t),bridge:bridgeText(t),nextOpen:t>=S('S062')&&t<DURATION};}
