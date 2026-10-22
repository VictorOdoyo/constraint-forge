import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { table } from '../src/constraints/table.js';

test('allowed tuples prune and enumerate exactly the relation',()=>{
 const m=new Model().variable('a',[0,1,2]).variable('b',[0,1,2]); table(m,['a','b'],[[0,2],[2,0]]);
 assert.deepEqual(new Solver(m).solve().solutions,[{a:0,b:2},{a:2,b:0}]);
 assert.throws(()=>table(m,['a'],[[1,2]]),TypeError);
});