import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { propagate } from '../src/propagate.js';
test('global allDifferent removes Hall-set values before branching',()=>{
 const m=new Model().variable('a',[1,2]).variable('b',[1,2]).variable('c',[1,2,3]).allDifferent(['a','b','c'],{global:true});
 const d=new Map(m.domains); assert.ok(propagate(d,m.constraints,{checks:0,pruned:0}));
 assert.deepEqual(d.get('c'),[3]); assert.equal(new Solver(m).solve().solutions.length,2);
});
test('matching detects pigeonhole contradiction at root',()=>{
 const m=new Model(); for(const k of ['a','b','c'])m.variable(k,[1,2]);
 m.allDifferent(['a','b','c'],{global:true}); const r=new Solver(m).solve();
 assert.equal(r.solutions.length,0); assert.equal(r.stats.nodes,1);
});