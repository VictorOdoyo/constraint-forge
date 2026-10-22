import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { regular } from '../src/constraints/regular.js';

test('DFA accepts only binary strings with even parity',()=>{
 const m=new Model();for(const k of ['a','b','c'])m.variable(k,[0,1]);
 regular(m,['a','b','c'],{start:0,accept:[0],transitions:[[0,0,0],[0,1,1],[1,0,1],[1,1,0]]});
 const r=new Solver(m).solve();assert.equal(r.solutions.length,4);assert.ok(r.solutions.every(s=>(s.a+s.b+s.c)%2===0));
});