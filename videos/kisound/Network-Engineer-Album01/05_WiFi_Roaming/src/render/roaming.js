import {smooth,clamp,lerp} from './timeline.js';
import {AP_POSITIONS,BSSIDS,SSID,DURATION} from './config.js';
// Narrative model, NOT a measured RF simulation or an implementation of 802.11.
import {routePoint,AP_DISTANCES} from './layout.js';
const route=[[0,5],[12.18,8],[33.24,22],[43.72,29],[46,32],[55.42,40],[63.54,48],
 [68.5,54],[77.54,62],[88.2,74],[91.56,80],[110.96,89],[118.7,96],[129.84,104],
 [135.86,116],[143.7,125],[149,132],[153.66,137],[DURATION,153]];
export const ROAMS=[{time:63.54,from:0,to:1,rssi:-72,kind:'late'},
 {time:118.7,from:1,to:2,rssi:-67,kind:'clean'},
 {time:153.66,from:2,to:3,rssi:-67,kind:'clean'}];
export const ROAM_TARGET_DBM=-67;
export const LATE_ROAM_DBM=-72;
export function position(t){
 const i=clamp(route.findIndex((p,j)=>j<route.length-1&&t>=p[0]&&t<route[j+1][0]),0,route.length-2);
 if(t>=DURATION)return route.at(-1)[1];const[a,x]=route[i],[b,y]=route[i+1];return lerp(x,y,smooth(a,b,t));
}
export function clientPose(t){
 const d=position(t),p=routePoint(d),a=routePoint(Math.max(0,d-.7)),b=routePoint(Math.min(156,d+.7));
 const length=Math.hypot(b.x-a.x,b.z-a.z)||1;
 return {...p,d,dx:(b.x-a.x)/length,dz:(b.z-a.z)/length};
}
const RSSI_CURVES=[[[0,-48],[12.18,-50],[33.24,-63],[43.72,-64],[55.42,-67],[60.68,-70],[61.8,-72],[63.54,-72]],
 [[63.54,-51],[88.2,-56],[110.96,-63],[118.7,-67]],
 [[118.7,-50],[135.86,-58],[143.7,-64],[153.66,-67]],[[153.66,-49],[DURATION,-57]]];
function rssiAt(t,ap){
 const rows=RSSI_CURVES[ap];let i=rows.findIndex((r,j)=>j<rows.length-1&&t<rows[j+1][0]);if(i<0)return rows.at(-1)[1];
 return lerp(rows[i][1],rows[i+1][1],smooth(rows[i][0],rows[i+1][0],t));
}
export function radioState(t){
 const pose=clientPose(t),ap=t<63.54?0:t<118.7?1:t<153.66?2:3;
 const dfs=t>=77.941&&t<83.1,channel=ap===1?(t<78.8?52:36):ap===0?36:ap===2?44:149;
 const rssi=rssiAt(t,ap),retry=ap===0&&t>=55.42?clamp((-rssi-68)/4):0;
 const recentRoam=ROAMS.find(e=>t>=e.time&&t<e.time+2);
 return{ap,x:pose.x,z:pose.z,pose,bssid:BSSIDS[ap],ssid:SSID,channel,dfs,rssi,retry,recentRoam,
  connected:t>=10.66&&!dfs,signal:clamp((rssi+85)/40,.1,1),
  noise:t>=38.28&&t<43.72?.78:t>=105.16&&t<107.5?.66:.18,
  scanning:t<4.48||(t>=49.14&&t<63.54)||(t>=110.96&&t<114.46)||(t>=143.7&&t<153.66),
  phase:t<4.48?'SCANNING':t<9.26?'ASSOCIATING':t<10.66?'AUTHENTICATING':dfs?'CHANNEL SWITCH':retry>.25?'RETRANSMITTING':recentRoam?'ROAM COMPLETE':t>=143.7&&t<153.66?'SCANNING':t>=110.96&&t<118.7?'ESTABLISHING LINK':'CONNECTED',
 };
}
// Pairwise key establishment: four EAPOL messages, never a key sent over the air.
// This illustrates a conventional secured association, not an 802.11r FT exchange.
export const EXCHANGES=[
 {at:110.96,to:111.7,label:'PROBE REQUEST',direction:'client-ap'},
 {at:112.42,to:113.42,label:'PROBE RESPONSE',direction:'ap-client'},
 {at:113.76,to:114.1,label:'802.11 AUTH REQUEST',direction:'client-ap'},
 {at:114.1,to:114.46,label:'802.11 AUTH RESPONSE',direction:'ap-client'},
 {at:114.46,to:115.1,label:'REASSOCIATION REQUEST',direction:'client-ap'},
 {at:115.1,to:115.76,label:'REASSOCIATION RESPONSE',direction:'ap-client'},
 {at:116.74,to:117.0,label:'EAPOL 1 / ANonce',direction:'ap-client'},
 {at:117.0,to:117.27,label:'EAPOL 2 / SNonce + MIC',direction:'client-ap'},
 {at:117.27,to:117.55,label:'EAPOL 3 / KEY INSTALL',direction:'ap-client'},
 {at:117.55,to:117.88,label:'EAPOL 4 / CONFIRM',direction:'client-ap'},
];

// Derived illustrative app telemetry. Values are not measured radio data.
export function telemetry(t){
 const r=radioState(t),candidates=AP_DISTANCES.map(d=>-47-Math.min(45,Math.abs(r.pose.d-d)*.95));
 candidates[r.ap]=r.rssi;
 const noise=-94+14*r.noise+7*Math.exp(-Math.pow((t-62)/1.3,2));
 return {...r,noiseDbm:noise,snr:Math.max(0,r.rssi-noise),candidates};
}
export function frameFlight(t){
 const r=radioState(t),u=(t*1.45)%1,from=[r.x,1.8,r.z],to=AP_POSITIONS[r.ap];
 const v=u<.5?u*2:2-u*2;
 return {pos:from.map((x,i)=>x+(to[i]-x)*v+(i===2?Math.sin(v*Math.PI)*.8:0)),returning:u>=.5,retry:r.retry};
}
export function dfsState(t,preview=false){
 const detected=!preview&&t>=77.941,announced=detected&&t>=78.5,moved=detected&&t>=78.8;
 return{detected,announced,moved,channel:moved?36:52,stage:!detected?'RADAR MONITORING':!announced?'RADAR DETECTED':!moved?'CSA / COUNTDOWN':t<83.1?'CHANNEL SWITCH':'RESUMED'};
}
