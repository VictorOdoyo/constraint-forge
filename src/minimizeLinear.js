import {Model} from './model.js';import {Solver} from './solver.js';
/** Branch-and-bound minimization with a dynamically tightening strict cutoff. */
export function minimizeLinear(model,weights,options={}) {
 const scope=Object.keys(weights),coefficients=scope.map(k=>weights[k]);
 if(!scope.length||coefficients.some(v=>!Number.isSafeInteger(v))||scope.some(k=>!model.domains.has(k)||model.domains.get(k).some(v=>!Number.isSafeInteger(v))))throw new TypeError('Linear minimization requires safe integer domains and coefficients');
 const magnitude=scope.reduce((total,k,i)=>total+BigInt(Math.abs(coefficients[i]))*model.domains.get(k).reduce((max,v)=>{const n=BigInt(Math.abs(v));return n>max?n:max;},0n),0n);
 if(magnitude>BigInt(Number.MAX_SAFE_INTEGER))throw new RangeError('Objective may exceed exact integer range');
 const copy=new Model();for(const [k,v] of model.domains)copy.variable(k,v);copy.constraints=[...model.constraints];
 let bound=Infinity,best;
 const cutoff={scope,kind:'linearBound',coefficients,bound:()=>bound,label:'objective-cutoff',test:(...v)=>v.reduce((s,x,i)=>s+x*coefficients[i],0)<bound};copy.constraints.push(cutoff);
 const result=new Solver(copy).solve({...options,collect:false,onSolution:s=>{bound=scope.reduce((total,k,i)=>total+s[k]*coefficients[i],0);best={...s};options.onSolution?.({...s});}});
 return {...result,best,score:best?bound:undefined,optimal:result.status==='complete'};
}
