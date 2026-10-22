import test from 'node:test';import assert from 'node:assert/strict';
import {Model,table} from '../src/index.js';import {propagate} from '../src/propagate.js';
test('table propagator scans rows rather than a Cartesian product',()=>{
 const m=new Model(); for(const k of ['a','b','c'])m.variable(k,Array.from({length:100},(_,i)=>i));
 table(m,['a','b','c'],[[1,2,3],[4,5,6]]); const d=new Map(m.domains),s={checks:0,pruned:0};
 assert.ok(propagate(d,m.constraints,s)); assert.deepEqual(d.get('a'),[1,4]);assert.ok(s.checks<1500);
});