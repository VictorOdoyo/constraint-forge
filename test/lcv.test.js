import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
test('least-constraining values are visited first without changing solutions', () => {
  const m = new Model().variable('a', [1, 2]).variable('b', [1, 2, 3]);
  m.constrain(['a', 'b'], (a, b) => a === 2 || b === 1);
  const s = new Solver(m),
    r = s.solve({ valueOrder: 'lcv' });
  assert.equal(r.solutions[0].a, 2);
  assert.equal(r.solutions.length, s.solve().solutions.length);
});
