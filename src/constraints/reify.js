export function reify(model,scope,flag,predicate) {
 if(typeof predicate!=='function'||!model.domains.has(flag)||model.domains.get(flag).some(v=>v!==0&&v!==1))throw new TypeError('Reification flag must have a Boolean integer domain');
 return model.constrain([...scope,flag],(...v)=>Boolean(predicate(...v.slice(0,-1)))===Boolean(v.at(-1)),'reify');
}