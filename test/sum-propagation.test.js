import test from 'node:test';import assert from 'node:assert/strict';
import {Model,sum} from '../src/index.js';import {propagate} from '../src/propagate.js';
test('sum reachability handles long binary scopes without enumerating tuples',()=>{
 const m=new Model(),keys=Array.from({length:24},(_,i)=>'x'+i);keys.forEach(k=>m.variable(k,[0,1]));sum(m,keys,0);
 const d=new Map(m.domains),s={checks:0,pruned:0};assert.ok(propagate(d,m.constraints,s));
 assert.ok([...d.values()].every(v=>v.length===1&&v[0]===0));assert.ok(s.checks<100000);
});