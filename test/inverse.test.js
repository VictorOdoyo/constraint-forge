import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { inverse } from '../src/constraints/inverse.js';

test('inverse channels forward and backward permutations', () => {
  const m = new Model();
  for (const k of ['a', 'b', 'c', 'd', 'e', 'f']) m.variable(k, [0, 1, 2]);
  inverse(m, ['a', 'b', 'c'], ['d', 'e', 'f']);
  const r = new Solver(m).solve();
  assert.equal(r.solutions.length, 6);
  for (const s of r.solutions) {
    const f = [s.a, s.b, s.c],
      b = [s.d, s.e, s.f];
    f.forEach((x, i) => assert.equal(b[x], i));
  }
});
