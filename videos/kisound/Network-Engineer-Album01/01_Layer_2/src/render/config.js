export const FPS=60;
export const DURATION=10078088/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='01_Layer_2_0.3-1.wav';
export const SOURCE_SHA256='15b1566f6863945032ca9ca508b26d71b86d594a8d81d9f5ffd2753a28800e8c';
export const SEED=128013;
export const PALETTE={ink:0x060e18,navy:0x142b3c,blue:0x547994,cyan:0x59d8ed,violet:0xb39bff,amber:0xffb96a,green:0x80e3bd,red:0xff747a,white:0xdaeaf0};
export const CHAPTERS=[
 ['Layer Two',0],['Switching domain',9.02],['ARP / Address resolution',19.5],['Unknown / Known unicast',31.7],
 ['MAC learning / 802.1Q',38.94],['Root bridge',46.62],['VLAN 10 / VLAN 3',53.8],['Port states',61.3],
 ['L2TPv3 / Ethernet pseudowire',70.5],['Loop demo / STP off',84],['Spanning tree recovery',106.9],
 ['OSI / Reprise',119.42],['Switching domain / Reprise',133.62],['Frames / Reprise',142.5],
 ['Root bridge / Reprise',150.16],['VLANs / Reprise',157.02],['MAC move / Reprise',165.92],
 ['LLDP / Direct neighbours',171.76],['LACP / Link aggregation',178.5],['Flows / Members',185.92],
 ['Clean forwarding',194],['Layer 2 / Samuel Heinrich',202.341],
].map(([title,start],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION}));
// Absolute authored cuts. Transcript times are never snapped to a beat grid.
const cuts=[
 [0,'topology','stack','osi'],[9.02,'topology','reveal','domain'],[12.6,'topology','orbit','domain'],[18.711,'frame','push','wire'],
 [19.5,'topology','host','arp'],[21.7,'topology','overhead','arp'],[26.8,'frame','track','arp'],[30.211,'control','matrix','arp'],
 [31.7,'topology','overhead','unknown'],[35.4,'topology','chase','known'],
 [38.94,'control','matrix','learning'],[41.02,'frame','track','wire'],[42.9,'frame','side','tag'],[44.8,'topology','overhead','broadcast'],
 [46.62,'control','root','stp'],[48.76,'topology','port','stp'],[51.1,'topology','orbit','stp'],
 [53.8,'topology','reveal','vlans'],[56.461,'topology','port','stp'],[57.58,'topology','overhead','vlans'],[59.42,'frame','side','tag'],
 [61.3,'control','root','bpdu'],[63.5,'frame','track','trunk'],[64.4,'frame','side','access'],[66.92,'control','matrix','move'],[68.78,'topology','reveal','stp'],
 [70.5,'tunnel','wide','setup'],[71.461,'tunnel','launch','setup'],[74.3,'tunnel','track','encapsulate'],[78.3,'tunnel','inside','transport'],[81,'tunnel','arrival','decapsulate'],
 [84,'topology','overhead','loop'],[89.831,'topology','chase','loop'],[95.5,'control','matrix','loop'],[100.5,'topology','orbit','loop'],[104.1,'topology','overhead','loop'],
 [106.9,'control','root','recover'],[108.591,'topology','port','recover'],[113,'topology','overhead','stp'],[116.4,'control','root','stp'],
 [119.42,'topology','stack','osi'],[123.5,'topology','orbit','stp'],[129,'topology','stack','osi'],
 [133.62,'topology','reveal','domain'],[135.781,'control','matrix','learning'],[139.5,'topology','chase','known'],
 [142.5,'control','matrix','learning'],[144.44,'frame','track','wire'],[146.48,'frame','side','tag'],[148.18,'topology','overhead','broadcast'],
 [150.16,'control','root','stp'],[152.16,'topology','port','stp'],[154.531,'topology','orbit','stp'],
 [157.02,'topology','reveal','vlans'],[161.08,'topology','overhead','vlans'],[162.88,'frame','side','tag'],
 [165.92,'frame','track','trunk'],[166.72,'frame','side','access'],[167.86,'control','matrix','move'],[168.52,'topology','reveal','stp'],
 [171.76,'control','neighbours','lldp'],[174.691,'topology','port','lldp'],[176.6,'control','neighbours','lldp'],
 [178.5,'control','bundle','lacp'],[181.2,'topology','bundle','lacp'],[183.7,'control','bundle','lacp'],
 [185.92,'topology','bundle','flows'],[189.7,'frame','track','flows'],[192,'topology','overhead','flows'],
 [194,'frame','side','tag'],[196.8,'tunnel','wide','transport'],[199.6,'topology','reveal','final'],
 [202.341,'topology','final','final'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode],i,a)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:a[i+1]?.[0]??DURATION,zone,camera,mode}));
export const EDITORIAL=SHOTS.map((s,i)=>({id:`V${String(i+1).padStart(3,'0')}`,time_s:s.start,origin:'redaktionell',action:`${s.zone}/${s.camera}: ${s.mode}`,shot_id:s.id}));
export const TITLES={intro:[.65,1.8,7,8.4],outro:[202.341,203.15]};
