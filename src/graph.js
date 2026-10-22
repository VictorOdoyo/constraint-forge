/** Primal graph: an edge joins variables sharing a constraint. */
export function primalGraph(model) {
 const graph=new Map([...model.domains.keys()].map(k=>[k,new Set()]));
 for(const {scope} of model.constraints)for(const a of scope)for(const b of scope)if(a!==b)graph.get(a).add(b);
 return graph;
}
export function components(graph) {
 const seen=new Set(),result=[];
 for(const key of graph.keys())if(!seen.has(key)){const part=[],queue=[key];seen.add(key);for(let i=0;i<queue.length;i++){const at=queue[i];part.push(at);for(const n of graph.get(at))if(!seen.has(n)){seen.add(n);queue.push(n);}}result.push(part);}
 return result;
}