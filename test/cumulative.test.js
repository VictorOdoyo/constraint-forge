import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { cumulative } from '../src/constraints/cumulative.js';

test('cumulative rejects overload while permitting touching intervals',()=>{
 const m=new Model().variable('a',[0,1,2]).variable('b',[0,1,2]);cumulative(m,['a','b'],[2,2],[1,1],1);
 assert.deepEqual(new Solver(m).solve().solutions,[{a:0,b:2},{a:2,b:0}]);
});