import {Model} from '../model.js';
export function coloring(vertices,edges,colors) {
 const m=new Model();for(const v of vertices)m.variable(v,colors);
 for(const [a,b] of edges){if(a===b){m.constrain([a],()=>false,'self-loop');}else m.constrain([a,b],(x,y)=>x!==y,'edge');}return m;
}