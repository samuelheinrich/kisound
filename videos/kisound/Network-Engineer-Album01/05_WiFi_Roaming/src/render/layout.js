// Metres in an authored floor plan. This is not an RF propagation simulation.
export const FLOOR_PATH=[[-12,0],[20,0],[20,22],[46,22],[46,46],[74,46],[74,70]];
export const HALL_WIDTH=9;
export const PATH_LENGTH=156;
export const AP_DISTANCES=[8,49,92,135];
export function routePoint(distance){
 let d=Math.max(0,Math.min(PATH_LENGTH,distance));
 for(let i=0;i<FLOOR_PATH.length-1;i++){
  const a=FLOOR_PATH[i],b=FLOOR_PATH[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(d<=len||i===FLOOR_PATH.length-2){const u=Math.min(1,d/len);return{x:a[0]+(b[0]-a[0])*u,z:a[1]+(b[1]-a[1])*u,dx:(b[0]-a[0])/len,dz:(b[1]-a[1])/len,segment:i};}d-=len;
 }
}
export const CAMPUS_APS=AP_DISTANCES.map(d=>{const p=routePoint(d);return[p.x,4.8,p.z];});
export const OFFICES=[{x:4,z:-14,w:29,d:19,name:'OPEN OFFICE A'},{x:40,z:22,w:32,d:24,name:'OPEN OFFICE B'},{x:64,z:46,w:30,d:26,name:'COLLABORATION'}];
