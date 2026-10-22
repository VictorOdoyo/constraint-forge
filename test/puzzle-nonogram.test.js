import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver } from '../src/index.js';
import { nonogram } from '../src/puzzles/nonogram.js';
test('nonogram line tables produce a unique cross image', () => {
  const r = new Solver(nonogram([[1], [3], [1]], [[1], [3], [1]])).solve();
  assert.equal(r.stats.solutions, 1);
  assert.equal(r.solutions[0]['1,1'], 1);
  assert.equal(r.solutions[0]['0,0'], 0);
});
