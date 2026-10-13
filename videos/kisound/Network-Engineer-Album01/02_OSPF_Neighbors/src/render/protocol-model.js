// Authored OSPFv2 lab, not captured network telemetry. Timers compressed for the film.
export const ROUTERS=[
 {id:'R1',rid:'10.255.0.1',pos:[-12,0,0],area:0},
 {id:'R2',rid:'10.255.0.2',pos:[-6,0,-5],area:0},
 {id:'R3',rid:'10.255.0.3',pos:[-6,0,5],area:0},
 {id:'R4',rid:'10.255.0.4',pos:[1,0,0],area:0,priority:100,role:'DR'},
 {id:'R5',rid:'10.255.0.5',pos:[5,0,-5],area:0,priority:50,role:'BDR'},
 {id:'R6',rid:'10.255.0.6',pos:[5,0,5],area:0,priority:1,role:'DROTHER'},
 {id:'R7',rid:'10.255.0.7',pos:[9,0,0],area:0,priority:1,role:'DROTHER',abr:true},
 {id:'R8',rid:'10.255.0.8',pos:[18,2,0],area:1},
];
export const P2P=[['R1','R2'],['R1','R3'],['R2','R4'],['R3','R4'],['R7','R8']].map(([a,b],i)=>({id:`P${i+1}`,a,b,area:i===4?1:0,cost:10}));
export const LAN=['R4','R5','R6','R7'];
export const POS=Object.fromEntries(ROUTERS.map(r=>[r.id,r.pos]));POS.N0=[5,0,0];POS.D0=[1,0,-7.5];POS.D1=[22,2,0];
export function selectFlow(flow,nextHops){return nextHops.length?nextHops[Math.abs(flow)%nextHops.length]:null;}
export function physicalCost(t){return t>=94.3&&t<118.5?25:10;}
export function linkDown(t){return t>=132.7&&t<160.8;}
function phase(t,starts){const names=['Down','Init','2-Way','ExStart','Exchange','Loading','Full'];let p=0;for(let i=0;i<starts.length;i++)if(t>=starts[i])p=i+1;return names[p];}
export function neighbour(a,b,t){
 if(!ROUTERS.some(r=>r.id===a)||!ROUTERS.some(r=>r.id===b)||a===b)return null;
 const onLan=LAN.includes(a)&&LAN.includes(b),p=P2P.find(p=>p.a===a&&p.b===b||p.a===b&&p.b===a);if(!onLan&&!p)return null;
 let state;
 if(p?.area===1)state=phase(t,[64.3,65.3,67,69,71.5,73.2]);
 else if(p&&[a,b].includes('R2')&&[a,b].includes('R4')&&t>=132.7)state=t<160.8?'Down':phase(t,[160.8,161.2,161.6,162.1,163,164]);
 else state=phase(t,[a==='R1'||b==='R1'?23.16:7.6,33.86,47.88,49.72,51.62,53.36]);
 if(onLan&&['R6','R7'].includes(a)&&['R6','R7'].includes(b)&&!['Down','Init'].includes(state))state='2-Way';
 return{a,b,state,area:p?.area??0,network_type:onLan?'Broadcast':'Point-to-point',role:onLan&&t>=36.98?ROUTERS.find(r=>r.id===b).role:'—'};
}
// Directed LSDB graph: router→broadcast network has interface cost, network→router cost zero.
export function graph(t,{converged=true,area=0,root='R1'}={}){
 const edges=[];const add=(a,b,cost)=>edges.push({a,b,cost});
 const metric=converged?(t>=95.98&&t<121.68?25:10):physicalCost(t);
 for(const p of P2P.filter(p=>p.area===area)){
  if(p.area===1&&t<73.2)continue;
  if(p.a==='R2'&&p.b==='R4'&&(converged?(t>=138&&t<164):linkDown(t)))continue;
  const c=p.a==='R1'&&p.b==='R2'?metric:10;add(p.a,p.b,c);add(p.b,p.a,c);
 }
 if(area===0){for(const r of LAN){add(r,'N0',10);add('N0',r,0);}add('R4','D0',1);if(t>=73.2)add('R7','D1',11);}
 else add('R8','D1',1);
 return{root,area,edges};
}
export function shortest(g,root=g.root){
 const nodes=[...new Set([root,...g.edges.flatMap(e=>[e.a,e.b])])],dist=Object.fromEntries(nodes.map(n=>[n,Infinity])),hops=Object.fromEntries(nodes.map(n=>[n,new Set()])),pred=Object.fromEntries(nodes.map(n=>[n,[]])),done=new Set(),steps=[];dist[root]=0;
 while(done.size<nodes.length){const u=nodes.filter(n=>!done.has(n)).sort((a,b)=>dist[a]-dist[b]||a.localeCompare(b))[0];if(dist[u]===Infinity)break;done.add(u);steps.push({node:u,cost:dist[u]});
  for(const e of g.edges.filter(e=>e.a===u)){const d=dist[u]+e.cost,hs=u===root?new Set([e.b]):hops[u];if(d<dist[e.b]){dist[e.b]=d;hops[e.b]=new Set(hs);pred[e.b]=[u];}else if(d===dist[e.b]){for(const h of hs)hops[e.b].add(h);if(!pred[e.b].includes(u))pred[e.b].push(u);}}
 }
 return{root,dist,nextHops:Object.fromEntries(nodes.map(n=>[n,[...hops[n]].sort()])),pred,steps};
}
export function route(t,destination='D0'){
 if(t<55.18||destination==='D1'&&t<73.2)return{metric:null,nextHops:[],paths:[]};const g=graph(t),s=shortest(g);if(!Number.isFinite(s.dist[destination]))return{metric:null,nextHops:[],paths:[]};
 const paths=[];const back=(n,p)=>{if(n==='R1'){paths.push([...p,'R1'].reverse());return;}for(const v of s.pred[n])if(!p.includes(v))back(v,[...p,n]);};back(destination,[]);
 return{metric:s.dist[destination],nextHops:s.nextHops[destination],paths};
}
export function networkState(t){
 const r=route(t),inter=route(t,'D1'),converging=t>=94.3&&t<95.98||t>=118.5&&t<121.68||t>=132.7&&t<138||t>=160.8&&t<164;
 return{time_s:t,cost12:physicalCost(t),linkDown:linkDown(t),converging,multi:t>=62.38,area1Full:t>=73.2,route:r,interArea:inter,dr:t>=36.98?'R4':null,bdr:t>=36.98?'R5':null,status:t<7.6?'AREA 0 / DISCOVERY':t<33.86?'HELLO / INIT':t<47.88?'TWO-WAY / ROLE ELECTION':t<53.36?'DATABASE EXCHANGE':converging?'LSDB UPDATE / CONVERGING':t<73.2?'AREA 0 / FULL':r.nextHops.length===2?'AREA 0 + AREA 1 / ECMP':'AREA 0 + AREA 1 / SINGLE PATH'};
}
export function lsdb(t,area){
 const routers=ROUTERS.filter(r=>area===0?r.area===0:r.id==='R7'||r.area===1);
 return[...routers.map(r=>({type:1,id:r.rid,advertiser:r.id,sequence:1+(area===0&&r.id==='R1'&&t>=94.3?1:0)+(area===0&&r.id==='R1'&&t>=118.5?1:0)+(area===0&&['R2','R4'].includes(r.id)&&t>=132.7?1:0)+(area===0&&['R2','R4'].includes(r.id)&&t>=160.8?1:0),scope:area})),...(area===0&&t>=36.98?[{type:2,id:'10.0.0.4',advertiser:'R4',sequence:1,scope:0}]:[]),...(t>=73.2?[{type:3,id:area===0?'198.51.100.0/24':'192.0.2.0/24',advertiser:'R7',metric:area===0?11:11,sequence:1,scope:area}]:[])];
}
export const LOGS=[
 [7.6,'OSPF-6-HELLO','Area 0 / Hello received.'],[23.16,'OSPF-5-ADJCHG','R1 / R2: DOWN → INIT.'],[33.86,'OSPF-5-ADJCHG','Own Router-ID found: INIT → 2-WAY.'],[36.98,'OSPF-5-DR','LAN: R4 DR / R5 BDR.'],[39.16,'OSPF-6-ROLE','R6 is DROTHER; R6 / R7 stay 2-WAY.'],[47.88,'OSPF-5-ADJCHG','R1 / R2: 2-WAY → EXSTART.'],[49.72,'OSPF-6-DBD','EXCHANGE / LSA headers compared.'],[51.62,'OSPF-6-LSR','LOADING / request missing LSAs.'],[53.36,'OSPF-5-ADJCHG','LSDB aligned: LOADING → FULL.'],[55.18,'OSPF-6-SPF','R1 / metric 21 / next hops R2,R3.'],[62.38,'OSPF-6-AREA','R7 ABR / Area 1 interface enabled.'],[73.2,'OSPF-6-SUMMARY','Type-3 originated / metric 11.'],[79.7,'FIB-6-ECMP','Example / stable per-flow forwarding.'],[94.3,'OSPF-5-COST','R1–R2 cost changed: 10 → 25.'],[95.98,'OSPF-6-SPF','R1 / next hop R3 selected.'],[104.84,'OSPF-6-LSU','LSA flooded / acknowledgement received.'],[118.5,'OSPF-5-COST','R1–R2 cost restored: 25 → 10.'],[121.68,'FIB-6-ECMP','Equal-cost next hops R2,R3 restored.'],[132.7,'LINK-4-DOWN','R2–R4 carrier lost / neighbour DOWN.'],[135,'OSPF-6-LSA','Topology change advertised.'],[138,'OSPF-6-SPF','Failed link removed / next hop R3.'],[145.4,'OSPF-6-NEIGHBOUR','R6 / R7: 2-WAY is normal here.'],[160.8,'LINK-5-UP','R2–R4 carrier restored / INIT.'],[162.1,'OSPF-6-DBD','R2 / R4: EXCHANGE.'],[164,'OSPF-5-ADJCHG','R2 / R4: FULL / routes recalculated.'],[166.36,'FIB-6-ECMP','Both equal-cost paths available.'],[167.76,'OSPF-6-BDR','R5 remains backup designated router.'],
].map(([time_s,tag,message],i)=>({id:`LOG${String(i+1).padStart(3,'0')}`,time_s,tag,message,origin:'redaktionelles Netzwerkszenario'}));
