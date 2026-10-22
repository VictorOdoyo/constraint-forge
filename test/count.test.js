import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver, queens } from '../src/index.js';
test('count-only search respects limits without retaining assignments', () => {
  const r = new Solver(queens(8)).solve({ collect: false, limit: 20 });
  assert.equal(r.status, 'limit');
  assert.equal(r.stats.solutions, 20);
  assert.deepEqual(r.solutions, []);
});
