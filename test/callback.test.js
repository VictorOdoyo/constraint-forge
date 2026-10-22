import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
test('solution callbacks cannot mutate stored results', () => {
  const observed = [];
  const r = new Solver(new Model().variable('x', [1, 2])).solve({
    onSolution: (s) => {
      observed.push(s.x);
      s.x = 99;
    },
  });
  assert.deepEqual(observed, [1, 2]);
  assert.deepEqual(r.solutions, [{ x: 1 }, { x: 2 }]);
});
