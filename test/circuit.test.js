import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { circuit } from '../src/constraints/circuit.js';

test('circuit eliminates disjoint subtours',()=>{
 const m=new Model();const keys=['a','b','c','d'];keys.forEach(k=>m.variable(k,[0,1,2,3]));circuit(m,keys);
 assert.equal(new Solver(m).solve().solutions.length,6);
});