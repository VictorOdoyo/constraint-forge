import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { absolute } from '../src/constraints/absolute.js';

test('absolute distance permits both orientations',()=>{
 const m=new Model().variable('a',[0,1,2]).variable('b',[0,1,2]);absolute(m,'a','b',2);
 assert.equal(new Solver(m).solve().solutions.length,2);
});