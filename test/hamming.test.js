import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { hamming } from '../src/constraints/hamming.js';

test('Hamming constraint selects distinct codewords at a fixed distance',()=>{
 const m=new Model();for(const k of ['a','b','c','d'])m.variable(k,[0,1]);hamming(m,['a','b'],['c','d'],1,1);
 assert.equal(new Solver(m).solve().solutions.length,8);
});