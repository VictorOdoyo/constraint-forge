import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { countValue } from '../src/constraints/countValue.js';

test('occurrence count is itself a decision variable', () => {
  const m = new Model().variable('a', ['R', 'B']).variable('b', ['R', 'B']).variable('n', [1]);
  countValue(m, ['a', 'b'], 'R', 'n');
  assert.equal(new Solver(m).solve().solutions.length, 2);
});
