import {EXCHANGES} from './roaming.js';
export const RTS=[
 ['RTS','client-ap','CONTROL · reserve airtime'],['CTS','ap-client','CONTROL · neighbours update NAV'],
 ['DATA','client-ap','DATA · protected transmission'],['ACK','ap-client','CONTROL · received'],
];
export const ACTION=[
 ['NEIGHBOR REPORT REQUEST','client-ap','802.11k · Radio Measurement Action'],
 ['NEIGHBOR REPORT RESPONSE','ap-client','802.11k · candidate BSSIDs / channels'],
 ['BSS TRANSITION REQUEST','ap-client','802.11v · recommendation'],
 ['BSS TRANSITION RESPONSE','client-ap','802.11v · client accepts or rejects'],
];
export function sequence(shot,t){
 if(shot.camera==='keys')return EXCHANGES.filter(e=>e.label.startsWith('EAPOL')).map((e,i)=>({...e,index:i,progress:Math.max(0,Math.min(1,(t-e.at)/(e.to-e.at))),detail:['AP nonce / ANonce','Client nonce / SNonce + MIC','Install keys / protected key data','MIC / acknowledgement'][i]}));
 if(shot.camera==='exchange')return EXCHANGES.filter(e=>!e.label.startsWith('EAPOL')).map((e,i)=>({...e,index:i,progress:Math.max(0,Math.min(1,(t-e.at)/(e.to-e.at))),detail:e.label.startsWith('PROBE')?'Management · discovery':'Management · link setup'}));
 const list=shot.camera==='action'?ACTION:shot.camera==='retry'?[
 ['DATA','client-ap','DATA · first attempt'],['NO ACK','ap-client','Timeout · no received frame'],['DATA / RETRY=1','client-ap','Same sequence number'],['ACK','ap-client','Received after retry']]:RTS;
 const cycle=shot.camera==='action'?shot.end-shot.start:2.4;
 const elapsed=(t-shot.start)%cycle;
 return list.map(([label,direction,detail],i)=>({label,direction,detail,index:i,at:shot.start+i*cycle/4,to:shot.start+(i+1)*cycle/4,progress:Math.max(0,Math.min(1,(elapsed-i*cycle/4)/(cycle/4*.8)))}));
}
