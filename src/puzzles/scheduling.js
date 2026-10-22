import {Model} from '../model.js';import {noOverlap} from '../constraints/noOverlap.js';import {precedence} from '../constraints/precedence.js';
export function scheduling(jobs,{horizon,precedences=[]}={}) {
 if(!Number.isInteger(horizon)||horizon<0||jobs.some(j=>!Number.isInteger(j.duration)||j.duration<0))throw new RangeError('Invalid scheduling horizon');
 const m=new Model(),machines=new Map();
 for(const j of jobs){m.variable(j.name,Array.from({length:Math.max(0,horizon-j.duration+1)},(_,i)=>i));if(!machines.has(j.machine))machines.set(j.machine,[]);machines.get(j.machine).push(j);}
 for(const group of machines.values())noOverlap(m,group.map(j=>j.name),group.map(j=>j.duration));
 for(const [a,b] of precedences){const job=jobs.find(j=>j.name===a);if(!job)throw new TypeError('Unknown predecessor');precedence(m,a,b,{duration:job.duration});}return m;
}