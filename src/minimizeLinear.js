import {Model} from './model.js';import {Solver} from './solver.js';
/** Branch-and-bound minimization with a dynamically tightening strict cutoff. */
export function minimizeLinear(model,weights,options={}) {
 const scope=Object.keys(weights),coefficients=scope.map(k=>weights[k]);
 if(!scope.length||coefficients.some(v=>!Number.isFinite(v))||scope.some(k=>!model.domains.has(k)||model.domains.get(k).some(v=>typeof v!=='number')))throw new TypeError('Invalid linear objective');
 const copy=new Model();for(const [k,v] of model.domains)copy.variable(k,v);copy.constraints=[...model.constraints];
 let bound=Infinity,best;
 const cutoff={scope,kind:'linearBound',coefficients,bound:()=>bound,label:'objective-cutoff',test:(...v)=>v.reduce((s,x,i)=>s+x*coefficients[i],0)<bound};copy.constraints.push(cutoff);
 const result=new Solver(copy).solve({...options,collect:false,onSolution:s=>{bound=scope.reduce((total,k)=>total+s[k]*weights[k],0);best={...s};options.onSolution?.({...s});}});
 return {...result,best,score:best?bound:undefined,optimal:result.status==='complete'};
}
