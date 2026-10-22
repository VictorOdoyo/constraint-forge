import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { reify } from '../src/constraints/reify.js';

test('reification propagates truth in both directions', () => {
  const m = new Model().variable('x', [1, 2, 3]).variable('b', [1]);
  reify(m, ['x'], 'b', (x) => x > 1);
  assert.deepEqual(new Solver(m).solve().solutions, [
    { x: 2, b: 1 },
    { x: 3, b: 1 },
  ]);
});
