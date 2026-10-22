import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver } from '../src/index.js';
import { magic } from '../src/puzzles/magic.js';
test('order-three normal magic square has eight orientations', () => {
  const r = new Solver(magic(3)).solve();
  assert.equal(r.stats.solutions, 8);
  assert.ok(r.solutions.every((s) => s['1,1'] === 5));
});
