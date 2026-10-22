import {Model} from '../model.js';
export function latin(size,givens={}) {
 if(!Number.isInteger(size)||size<1||size>16)throw new RangeError('Latin size must be 1..16');
 const m=new Model(),digits=Array.from({length:size},(_,i)=>i+1),key=(r,c)=>r+','+c;
 for(let r=0;r<size;r++)for(let c=0;c<size;c++)m.variable(key(r,c),Object.hasOwn(givens,key(r,c))?[givens[key(r,c)]]:digits);
 for(const [k,v] of Object.entries(givens))if(!m.domains.has(k)||!digits.includes(v))throw new TypeError('Invalid Latin given');
 for(let i=0;i<size;i++){m.allDifferent(digits.map((_,j)=>key(i,j)),{global:true});m.allDifferent(digits.map((_,j)=>key(j,i)),{global:true});}return m;
}