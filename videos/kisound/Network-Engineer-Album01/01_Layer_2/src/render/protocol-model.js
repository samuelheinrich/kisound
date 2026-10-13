// Authored educational state, not a live packet capture or a timer-accurate emulator.
import {clamp,smooth} from './timeline.js';
export const DEVICES=[
 {id:'SW-01',pos:[-4,0,0],priority:4096,mac:'02:AA:00:00:00:01'},
 {id:'SW-02',pos:[3,0,-4],priority:8192,mac:'02:AA:00:00:00:02'},
 {id:'SW-03',pos:[3,0,4],priority:12288,mac:'02:AA:00:00:00:03'},
];
export const HOSTS=[
 {id:'HOST-A',vlan:10,ip:'10.0.10.11',mac:'02:00:00:00:10:01',sw:'SW-01',port:1,pos:[-9,0,-3]},
 {id:'HOST-B',vlan:10,ip:'10.0.10.22',mac:'02:00:00:00:10:02',sw:'SW-02',port:1,pos:[8,0,-6]},
 {id:'HOST-C',vlan:10,ip:'10.0.10.33',mac:'02:00:00:00:10:03',sw:'SW-03',port:1,pos:[8,0,6]},
 {id:'HOST-D',vlan:3,ip:'10.0.3.11',mac:'02:00:00:00:03:01',sw:'SW-01',port:2,pos:[-9,0,3]},
 {id:'HOST-E',vlan:3,ip:'10.0.3.22',mac:'02:00:00:00:03:02',sw:'SW-02',port:2,pos:[10,0,0]},
];
export const LINKS=[
 {id:'L12',a:'SW-01',ap:25,b:'SW-02',bp:25,cost:19},
 {id:'L13',a:'SW-01',ap:26,b:'SW-03',bp:25,cost:19},
 {id:'L23',a:'SW-02',ap:26,b:'SW-03',bp:26,cost:19},
];
export const LOOP_START=84,RECOVERY_START=106.9,TREE_READY=113;
const HISTORY=[
 [21.7,'SW-01',10,HOSTS[0].mac,1], [22.7,'SW-02',10,HOSTS[0].mac,25], [22.7,'SW-03',10,HOSTS[0].mac,25],
 [26.8,'SW-02',10,HOSTS[1].mac,1], [27.8,'SW-01',10,HOSTS[1].mac,25],
 [31.7,'SW-01',10,HOSTS[1].mac,null], [35.4,'SW-01',10,HOSTS[1].mac,25],
 [38.94,'SW-01',3,HOSTS[3].mac,2],[40,'SW-02',3,HOSTS[3].mac,25],
 [66.92,'SW-01',10,HOSTS[0].mac,3], [113,'SW-01',10,HOSTS[0].mac,3],
 [113,'SW-02',10,HOSTS[0].mac,25], [113,'SW-03',10,HOSTS[0].mac,25],
 [142.5,'SW-02',3,HOSTS[4].mac,2], [143.5,'SW-01',3,HOSTS[4].mac,25],
 [167.86,'SW-01',10,HOSTS[0].mac,7],
];
export function macTable(t,sw='SW-01'){
 const entries=new Map();for(const [at,s,vlan,mac,port]of HISTORY){if(at>t)break;if(s!==sw)continue;const key=`${vlan}/${mac}`;if(port===null)entries.delete(key);else entries.set(key,{vlan,mac,port,learned_s:at});}
 if(t>=84&&t<106.9&&sw==='SW-01')entries.set(`10/${HOSTS[0].mac}`,{vlan:10,mac:HOSTS[0].mac,port:Math.floor((t-84)*5)%2?25:26,learned_s:t,flapping:true});
 return [...entries.values()];
}
export function portState(t,sw,port){
 if(port<25)return 'FORWARDING';
 if(t>=RECOVERY_START&&t<TREE_READY)return t<108.591?'LISTENING':'LEARNING';
 if(sw==='SW-03'&&port===26&&!(t>=LOOP_START&&t<RECOVERY_START))return 'BLOCKING';
 return 'FORWARDING';
}
export function forwardingPorts(t,sw,vlan,ingress,destination){
 if(![3,10].includes(vlan))return [];
 const ports=HOSTS.filter(h=>h.sw===sw&&h.vlan===vlan).map(h=>h.id==='HOST-A'?(t>=167.86?7:t>=66.92?3:1):h.port);
 for(const l of LINKS){if(l.a===sw)ports.push(l.ap);if(l.b===sw)ports.push(l.bp);}
 const allowed=ports.filter(p=>p!==ingress&&(p<25||portState(t,sw,p)==='FORWARDING'));
 if(destination!=='FF:FF:FF:FF:FF:FF'){const e=macTable(t,sw).find(e=>e.vlan===vlan&&e.mac===destination);if(e)return allowed.includes(e.port)?[e.port]:[];}
 return allowed;
}
export function arpState(t){
 const stage=t<21.7?'CACHE MISS':t<26.8?'REQUEST / BROADCAST':t<30.211?'REPLY / UNICAST':'RESOLVED';
 return{stage,request:t>=21.7&&t<26.8,reply:t>=26.8&&t<30.211,cache:t>=30.211?[{ip:HOSTS[1].ip,mac:HOSTS[1].mac}]:[],requestDA:'FF:FF:FF:FF:FF:FF',replyDA:HOSTS[0].mac};
}
export function networkState(t){
 const converging=t>=106.9&&t<113,loop=t>=84&&t<106.9;
 return{root:'SW-01',stp:loop?'OFF':converging?'CONVERGING':'ON',loop,converging,blocked:portState(t,'SW-03',26)==='BLOCKING',port:portState(t,'SW-03',26),macEntries:macTable(t),arp:arpState(t),hostAPort:t>=167.86?7:t>=66.92?3:1,
  lacp:t<178.5?'NOT SHOWN':t<181.2?'NEGOTIATING':t<183.7?'SYNCHRONISED':'COLLECTING / DISTRIBUTING',bundle:t>=183.7,
  status:loop?'LOOP DEMO / STP OFF':converging?'BPDU / TREE CONVERGENCE':t>=183.7?'PORT-CHANNEL / FORWARDING':t>=178.5?'LACP / NEGOTIATING':t>=171.76?'LLDP / DIRECT NEIGHBOURS':'LEARNING / FORWARDING'};
}
export function taggedFrame(vlan=10,tagged=true,kind='data'){
 const arp=kind==='arp';return{da:arp?'FF:FF:FF:FF:FF:FF':HOSTS[1].mac,sa:HOSTS[0].mac,vlan,tagged,tpid:tagged?'0x8100':null,pcp:0,dei:0,etherType:arp?'0x0806':'0x0800',fcs:'LOCAL / REGENERATED'};
}
export function frameState(t,shot){
 const u=((t-shot.start)/3.2)%1,tagged=['tag','trunk','flows'].includes(shot.mode)?u>.19&&u<.83:false;
 const vlan=(t>=57.58&&t<59.42)||(t>=161.08&&t<162.88)?3:10;
 const f=taggedFrame(vlan,tagged,shot.mode==='arp'?'arp':'data');
 if(shot.mode==='arp'&&arpState(t).reply){f.da=HOSTS[0].mac;f.sa=HOSTS[1].mac;}
 return{...f,phase:u,tagAmount:smooth(.1,.25,u)*(1-smooth(.76,.9,u)),access:shot.mode==='access',arp:shot.mode==='arp',direction:shot.mode==='arp'&&arpState(t).reply?'HOST-B → HOST-A':'HOST-A → HOST-B'};
}
export function tunnelState(t){
 const setup=t<74.3;
 const labels=['SCCRQ','SCCRP','SCCCN','ICRQ','ICRP','ICCN'];
 const stage=setup?labels[clamp(Math.floor((t-70.5)/.63),0,5)]:t<78.3?'ENCAPSULATING':t<81?'IP TRANSPORT':t<84?'DECAPSULATING':'SESSION UP';
 return{stage,setup,sessionUp:t>=74.3,inner:taggedFrame(10,true),outerSource:'192.0.2.1',outerDestination:'198.51.100.2',ipProtocol:115,encrypted:false,fcsTransported:false};
}
export function flowMember(flowId){return flowId%2;}
export function lldpNeighbours(sw){return LINKS.filter(l=>l.a===sw||l.b===sw).map(l=>({localPort:l.a===sw?l.ap:l.bp,device:l.a===sw?l.b:l.a,remotePort:l.a===sw?l.bp:l.ap}));}
