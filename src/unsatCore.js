import {Model} from './model.js';import {Solver} from './solver.js';
/** Deletion-based subset-minimal core; budget interruptions preserve uncertainty. */
export function unsatCore(model,options={}) {
 const check=indices=>{const m=new Model();for(const [k,v] of model.domains)m.variable(k,v);m.constraints=indices.map(i=>model.constraints[i]);return new Solver(m).solve({...options,limit:1});};
 let indices=model.constraints.map((_,i)=>i);const initial=check(indices);
 if(initial.status==='interrupted')return {status:'unknown',indices:[]};
 if(initial.stats.solutions)return {status:'satisfiable',indices:[]};
 let minimal=true;for(const i of [...indices]){const candidate=indices.filter(j=>j!==i),r=check(candidate);if(r.status==='complete'&&!r.stats.solutions)indices=candidate;else if(r.status==='interrupted')minimal=false;}
 return {status:'unsatisfiable',indices,minimal};
}
