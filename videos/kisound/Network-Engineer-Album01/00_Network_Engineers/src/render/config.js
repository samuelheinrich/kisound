export const FPS = 60;
export const DURATION = 9960968 / 48000;
export const FRAMES = Math.ceil(DURATION * FPS);
export const SEED = 271828;
export const SETS = ['office', 'laptop', 'city-block', 'rack-aisle', 'switch-48p', 'router-core', 'ap-ceiling'];
export const PALETTE = { ink: 0x040b17, navy: 0x101f32, blue: 0x7199cc, cyan: 0x65d5e2, amber: 0xffb55d, green: 0x79e6bc, red: 0xff6868, white: 0xd4e8ef };
// Exact chapter boundaries from the existing screenplay. Shot times are editorial,
// not claims of new audio measurements. No snapping to an assumed bar/downbeat.
export const CHAPTERS = [
  ['Nachtwache', 0], ['Die Stadt', 22.82], ['Redundanz', 44.28], ['Diagnose', 59.36],
  ['Verbindung', 75.52], ['Systemcheck', 95], ['Belastungsprobe', 108.16], ['Zwei Perspektiven', 132.16],
  ['Gemeinsam', 147.94], ['Weiter wach', 163.18], ['Die ganze Stadt', 178.6], ['Letztes Licht', 198.6],
].map(([title, start], i, a) => ({ id: `C${String(i+1).padStart(2,'0')}`, title, start, end: a[i+1]?.[1] ?? DURATION }));

// [start, zone, camera, cue IDs, lyric IDs]; ends are derived, always contiguous.
const cuts = [
  [0, 'noc', 'desk', ['E001'], []],
  [8.72, 'noc', 'reveal', ['E002','E003','E004','E005'], ['L001','L002','L003','L004']],
  [22.82, 'city', 'street', ['E006'], []],
  [30.4, 'city', 'district', ['E007','E008','E009'], []],
  [44.021, 'infrastructure', 'rack', ['E010','E011','E012'], ['L005','L006','L007','L008']],
  [51.58, 'infrastructure', 'ap', [], ['L009']],
  [54.04, 'infrastructure', 'switch', [], ['L010']],
  [55.52, 'topology', 'reserve', ['E013'], ['L011','L012']],
  [59.36, 'noc', 'wall', ['E014'], ['L013','L014']],
  [67.18, 'noc', 'team', [], ['L015','L016']],
  [75.52, 'noc', 'wide', ['E015','E016'], ['L017','L018','L019','L020']],
  [83.28, 'topology', 'flow', [], ['L021','L022','L023','L024']],
  [91.161, 'city', 'district', ['E017'], []],
  [95, 'infrastructure', 'switch', ['E018'], ['L025']],
  [96.62, 'topology', 'route', [], ['L026']],
  [99.66, 'infrastructure', 'switch', ['E019'], ['L027']],
  [103.02, 'topology', 'flow', [], ['L028']],
  [104.34, 'noc', 'team', [], ['L029','L030']],
  [108.16, 'topology', 'inspect', ['E020','E021','E022','E023'], []],
  [124, 'infrastructure', 'rack', ['E024'], []],
  [132.16, 'noc', 'user', ['E025','E026','E027'], ['L031']],
  [133.94, 'noc', 'team', [], ['L032']],
  [135.58, 'noc', 'user', [], ['L033']],
  [137.76, 'topology', 'inspect', [], ['L034','L035','L036','L037','L038']],
  [147.94, 'noc', 'wide', ['E028'], ['L039','L040','L041']],
  [153.42, 'city', 'district', ['E029'], ['L042']],
  [155.42, 'topology', 'flow', [], ['L043','L044']],
  [159.3, 'noc', 'team', [], ['L045','L046']],
  [163.18, 'noc', 'watch', ['E030','E031'], []],
  [170.6, 'infrastructure', 'rack', ['E032','E033'], []],
  [178.301, 'city', 'crane', ['E034','E035','E036','E037'], []],
  [198.6, 'city', 'final', ['E039','E040','E041'], []],
];
export const SHOTS = cuts.map(([start,zone,camera,eventIds,lyricIds],i) => ({
  id:`S${String(i+1).padStart(2,'0')}`, start, end:cuts[i+1]?.[0] ?? DURATION,
  zone, camera, eventIds, lyricIds, origin:'redaktionell vorgeschlagen',
}));
// E038 is retained in the source but NOT used for a fade. RMS remains high afterwards.
export const FADE_START = 206.1;
export const SOURCE_WAV = '00_Network_Engineers_0.4-1.wav';
export const SOURCE_SHA256 = 'f898d546962be52a08ffac6af68f08f550975de15956fe06c4a9e8c6b33dd5b5';

export const ACTIONS = {
  E003:'Leitwand und Raumlicht öffnen', E004:'Ein Statuspunkt bestätigt die Verbindung',
  E005:'Licht auf die Nachtwache konzentrieren', E007:'Weitere Stadtfenster verbinden',
  E008:'Ein Dachknoten sendet einen Lichtimpuls', E009:'Zweiter Stadtbereich antwortet',
  E010:'Schnitt ins Rack vor Beginn der Strophe', E012:'Racklicht und Datenfluss verstärken',
  E013:'Reservepfad und Störungsanzeige fokussieren', E016:'Gesamte Leitwarte zeigen',
  E017:'Stadtverbindung einmal hervorheben', E019:'Portstatus einmal bestätigen',
  E021:'Reserveknoten markieren', E022:'Topologieansicht räumlich öffnen', E023:'Zielknoten bestätigt den Verkehr',
  E024:'Rackprüfung erhält Lichtakzent', E026:'App-Ansicht beruhigen', E027:'Kurze Bedienpause',
  E029:'Stadtverbindungen verdichten', E032:'Rackprüfung intensivieren', E033:'Rackstatus bestätigt',
  E034:'Zur Stadt wechseln und Kranfahrt vorbereiten', E035:'Grosse Kranfahrt beginnen',
  E036:'Östlicher Stadtbereich antwortet', E037:'Westlicher Stadtbereich antwortet',
  E039:'Letzter prägnanter Stadtimpuls', E040:'Schlussblende beginnen', E041:'Bild am Audioende schliessen',
};
