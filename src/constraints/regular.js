export function regular(model,scope,{start,accept,transitions}) {
 if(!Array.isArray(accept)||!Array.isArray(transitions))throw new TypeError('Invalid automaton');
 const edges=transitions.map(t=>[...t]),final=new Set(accept);
 const move=(state,symbol)=>edges.find(t=>t[0]===state&&t[1]===symbol)?.[2];
 if(edges.some(t=>t.length!==3)||new Set(edges.map(t=>JSON.stringify(t.slice(0,2)))).size!==edges.length)throw new TypeError('Automaton must be deterministic');
 return model.constrain(scope,(...symbols)=>{let state=start;for(const s of symbols){state=move(state,s);if(state===undefined)return false;}return final.has(state);},'regular');
}