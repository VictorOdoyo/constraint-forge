import {units} from './candidates.js';
export function lockedCandidates(candidates) {
 const result=new Map([...candidates].map(([i,s])=>[i,new Set(s)])),removals=[];
 for(const box of units.slice(18))for(let v=1;v<=9;v++){
  const possible=box.filter(i=>result.get(i).has(v));if(possible.length<2)continue;
  for(const line of units.slice(0,18))if(possible.every(i=>line.includes(i)))for(const i of line)if(!box.includes(i)&&result.get(i).delete(v))removals.push({index:i,value:v,strategy:'pointing',witness:[...possible]});
 }return {candidates:result,removals};
}