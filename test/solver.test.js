import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';

test('enumerates every permutation and leaves model unchanged', () => {
  const m = new Model();
  for (const key of ['a', 'b', 'c']) m.variable(key, [1, 2, 3]);
  m.allDifferent(['a', 'b', 'c']);
  const solver = new Solver(m);
  const first = solver.solve();
  assert.equal(first.status, 'complete');
  assert.equal(first.solutions.length, 6);
  assert.equal(new Set(first.solutions.map((v) => JSON.stringify(v))).size, 6);
  assert.deepEqual(solver.solve().solutions, first.solutions);
  assert.deepEqual(m.domains.get('a'), [1, 2, 3]);
});
test('distinguishes exhausted search, solution limits, and interruption', () => {
  const solver = new Solver(new Model().variable('x', [1, 2]));
  assert.equal(solver.solve({ limit: 1 }).status, 'limit');
  assert.equal(solver.solve({ maxNodes: 1 }).status, 'interrupted');
  assert.equal(solver.solve({ timeoutMs: 0 }).status, 'interrupted');
  assert.equal(solver.solve({ signal: AbortSignal.abort() }).status, 'interrupted');
  assert.throws(() => solver.solve({ limit: 0 }), RangeError);
});
test('handles empty models and unsatisfiable models', () => {
  assert.deepEqual(new Solver(new Model()).solve().solutions, [{}]);
  assert.deepEqual(new Solver(new Model().variable('x', [])).solve().solutions, []);
});
