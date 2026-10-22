import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { precedence } from '../src/constraints/precedence.js';

test('precedence combines duration and lag',()=>{
 const m=new Model().variable('a',[0,1]).variable('b',[1,2,3]);precedence(m,'a','b',{duration:2});
 assert.deepEqual(new Solver(m).solve().solutions,[{a:0,b:2},{a:0,b:3},{a:1,b:3}]);
});