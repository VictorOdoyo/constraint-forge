import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { linear } from '../src/constraints/linear.js';

test('weighted linear inequality constrains a resource budget',()=>{
 const m=new Model().variable('x',[0,1,2]).variable('y',[0,1,2]);linear(m,['x','y'],[2,3],'le',4);
 assert.equal(new Solver(m).solve().solutions.length,4);
 assert.throws(()=>linear(m,['x'],[1],'bad',4),TypeError);
});