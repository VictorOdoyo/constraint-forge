import {latin} from './latin.js';import {sum} from '../constraints/sum.js';import {product} from '../constraints/product.js';
export function kenken(size,cages) {
 const m=latin(size),covered=new Set();
 for(const {cells,op,target} of cages){for(const c of cells){if(covered.has(c)||!m.domains.has(c))throw new TypeError('Cages must partition the grid');covered.add(c);}
  if(op==='+')sum(m,cells,target);else if(op==='*')product(m,cells,target);
  else if(op==='='&&cells.length===1)m.constrain(cells,v=>v===target,'cage');
  else if((op==='-'||op==='/')&&cells.length===2)m.constrain(cells,(a,b)=>op==='-'?Math.abs(a-b)===target:Math.max(a,b)/Math.min(a,b)===target,'cage');
  else throw new TypeError('Unsupported cage operation');
 }if(covered.size!==size*size)throw new TypeError('Cages must cover the grid');return m;
}