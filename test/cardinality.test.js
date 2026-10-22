import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { cardinality } from '../src/constraints/cardinality.js';

test('exact occurrence counts constrain repeated symbols', () => {
  const m = new Model();
  for (const k of ['a', 'b', 'c']) m.variable(k, ['R', 'B']);
  cardinality(
    m,
    ['a', 'b', 'c'],
    new Map([
      ['R', 2],
      ['B', 1],
    ]),
  );
  assert.equal(new Solver(m).solve().solutions.length, 3);
});
