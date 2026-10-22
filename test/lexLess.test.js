import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { lexLess } from '../src/constraints/lexLess.js';

test('lexicographic ordering breaks interchangeable-vector symmetry',()=>{
 const m=new Model();for(const k of ['a','b','c','d'])m.variable(k,[0,1]);lexLess(m,['a','b'],['c','d']);
 assert.equal(new Solver(m).solve().solutions.length,6);
});