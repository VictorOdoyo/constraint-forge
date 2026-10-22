import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { nogood } from '../src/constraints/nogood.js';

test('nogoods exclude exactly their partial assignments',()=>{
 const m=new Model().variable('a',[0,1]).variable('b',[0,1]);nogood(m,{a:1,b:1});
 assert.equal(new Solver(m).solve().solutions.length,3);
});