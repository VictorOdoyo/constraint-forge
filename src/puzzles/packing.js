import {Model} from '../model.js';
export function packing(weights,capacities) {
 if(!capacities.length||[...weights,...capacities].some(v=>!Number.isFinite(v)||v<0))throw new TypeError('Invalid packing dimensions');
 const m=new Model(),keys=weights.map((_,i)=>'item'+i);keys.forEach(k=>m.variable(k,capacities.map((_,i)=>i)));
 if(keys.length)m.constrain(keys,(...bins)=>capacities.every((cap,b)=>weights.reduce((s,w,i)=>s+(bins[i]===b?w:0),0)<=cap),'bin-capacity');return m;
}