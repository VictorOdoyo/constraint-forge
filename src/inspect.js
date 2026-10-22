import {primalGraph,components} from './graph.js';import {minFill} from './minFill.js';
export function inspect(model) {
 const graph=primalGraph(model),sizes=[...model.domains.values()].map(d=>d.length);
 return {variables:graph.size,constraints:model.constraints.length,edges:[...graph.values()].reduce((s,n)=>s+n.size,0)/2,components:components(graph),searchSpace:sizes.reduce((n,size)=>n*BigInt(size),1n).toString(),maxArity:Math.max(0,...model.constraints.map(c=>c.scope.length)),emptyDomains:[...model.domains].filter(([,d])=>!d.length).map(([k])=>k),...minFill(model)};
}