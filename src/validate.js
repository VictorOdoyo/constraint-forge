/** Validate a complete assignment independently of search and propagation. */
export function validate(model,assignment) {
 const errors=[];for(const [key,domain] of model.domains){if(!Object.hasOwn(assignment,key))errors.push({kind:'missing',variable:key});else if(!domain.includes(assignment[key]))errors.push({kind:'domain',variable:key});}
 for(const key of Object.keys(assignment))if(!model.domains.has(key))errors.push({kind:'unknown',variable:key});
 model.constraints.forEach((c,index)=>{if(c.scope.every(k=>Object.hasOwn(assignment,k))&&!c.test(...c.scope.map(k=>assignment[k])))errors.push({kind:'constraint',index,label:c.label});});return {valid:errors.length===0,errors};
}
