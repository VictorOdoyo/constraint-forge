import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { increasing } from '../src/constraints/increasing.js';

test('increasing sequences reduce permutations to combinations', () => {
  const m = new Model();
  for (const k of ['a', 'b', 'c']) m.variable(k, [1, 2, 3, 4]);
  increasing(m, ['a', 'b', 'c']);
  assert.equal(new Solver(m).solve().solutions.length, 4);
});
