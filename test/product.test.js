import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { product } from '../src/constraints/product.js';

test('product handles zero, negative factors and overflow-safe arithmetic',()=>{
 const m=new Model().variable('a',[-2,0,2]).variable('b',[-3,0,3]);product(m,['a','b'],-6);
 assert.equal(new Solver(m).solve().solutions.length,2);
});