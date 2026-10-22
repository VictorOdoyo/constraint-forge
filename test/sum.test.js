import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { sum } from '../src/constraints/sum.js';

test('integer sum supports negative values and exact totals',()=>{
 const m=new Model().variable('a',[-1,0,1]).variable('b',[1,2,3]);sum(m,['a','b'],2);
 assert.equal(new Solver(m).solve().solutions.length,3);
});