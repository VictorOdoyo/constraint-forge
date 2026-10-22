import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { among } from '../src/constraints/among.js';

test('among bounds membership in a value set', () => {
  const m = new Model().variable('a', [1, 2, 3]).variable('b', [1, 2, 3]);
  among(m, ['a', 'b'], [1, 2], 1, 1);
  assert.equal(new Solver(m).solve().solutions.length, 4);
});
