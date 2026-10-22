import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { modulo } from '../src/constraints/modulo.js';

test('modular arithmetic uses Euclidean residues for negatives',()=>{
 const m=new Model().variable('x',[-4,-3,-2,0,1,2]);modulo(m,'x',3,2);
 assert.deepEqual(new Solver(m).solve().solutions,[{x:-4},{x:2}]);
});