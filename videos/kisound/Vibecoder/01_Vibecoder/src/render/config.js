import {SHOT_DATA} from './shot-data.js';

const g=globalThis;
function pickLang(){
 const page=g.KISOUND_PAGE?.lang;if(page)return page;
 try{const query=new URLSearchParams(g.location?.search||'').get('lang');if(query)return query;}catch{}
 return g.VIBECODER_LANG||g.process?.env?.VIBECODER_LANG||'de';
}
export const LANG=pickLang()==='en'?'en':'de';
export const LANGS=['de','en'];
export const FPS=60;
export const VARIANTS={
 de:{samples:10379520,sha256:'2a32ee2e01c429f1a051cfe913448576d7e6615930567220aca48feada845d97',
  wav:'01_Vibecoder_suno-0.1_50_50_exakt_off_DE.wav',audio:'vibecoder-de.wav',lastVocal:215.2,fadeCandidate:210.3,
  energyRises:[49.8,122.0,158.1],drops:[158.9,173.3,187.7,205.7],gaps:[[203.35,203.55]]},
 en:{samples:11748480,sha256:'0ec442b9fa84de0a6b0e781f625597192015839555d1c27d60e649df6463d514',
  wav:'01_Vibecoder_suno-0.1_50_50_exakt_off_EN.wav',audio:'vibecoder-en.wav',lastVocal:243.98,fadeCandidate:238.8,
  energyRises:[61.2,141.9,185.6,214.5],drops:[97.5,143.1,157.1,186.0,200.4,214.9,229.2,240.0],gaps:[[.05,.2],[243.55,243.75]]}
};
const V=VARIANTS[LANG];
export const SAMPLES=V.samples,DURATION=SAMPLES/48000,FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV=V.wav,SOURCE_SHA256=V.sha256,AUDIO_FILE=V.audio;
export const LAST_VOCAL=V.lastVocal,FADE_CANDIDATE=V.fadeCandidate,ENERGY_RISES=V.energyRises,DROPS=V.drops,GAPS=V.gaps;
export const ANALYSIS_PATH=`variants/${LANG}/ASTRA-AUDIO-ANALYSE.json`;
export const SHOTS=SHOT_DATA.map(s=>({id:s.id,chapter:s.chapter,start:s.starts_s[LANG],end:s.ends_s[LANG],zone:s.zone,mode:s.mode,title:s.title}));
export const SHOT=Object.fromEntries(SHOTS.map(s=>[s.id,s]));
const chapterNames={
 intro:['Auftakt','Opening'],prelude:['Die erste Blockade','The first block'],verse_1:['Acht Uhr','Eight a.m.'],
 build:['Der sichtbare Weg','The visible path'],drop_1:['Sagen · Bauen · Prüfen','Specify · Build · Test'],
 break:['Der freie Platz','The open slot'],verse_2:['Eigener Takt','A beat of my own'],
 drop_2:['Ein Tool muss bestehen','A tool must hold up'],bridge:['Der Einwand','The objection'],
 final_drop:['Drei Ergebnisse','Three working things'],outro:['Prompt · Run · Check · Go','Prompt · Run · Check · Go']
};
export const CHAPTERS=SHOTS.filter((s,i)=>i===0||s.chapter!==SHOTS[i-1].chapter).map((s,i,a)=>({
 id:`C${String(i+1).padStart(2,'0')}`,key:s.chapter,title:chapterNames[s.chapter][LANG==='de'?0:1],shot:s.id,start:s.start,
 end:a[i+1]?.start??DURATION
}));
export const PALETTE={night:0x10141c,ink:0xf4f3ea,orange:0xff6534,cyan:0x44dde5,green:0xd1f85d,red:0xf04d4d};
export const HEX={night:'#10141C',ink:'#F4F3EA',orange:'#FF6534',cyan:'#44DDE5',green:'#D1F85D',red:'#F04D4D',
 panel:'#1B222D',panel2:'#252F3B',line:'#465363',dim:'#ADB8C6',deep:'#0B1018'};
