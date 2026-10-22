import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver, queens } from '../src/index.js';
test('weighted degree preserves exhaustive queens solution counts', () => {
  const r = new Solver(queens(6)).solve({ variableOrder: 'dom-wdeg', valueOrder: 'lcv' });
  assert.equal(r.stats.solutions, 4);
  assert.equal(r.status, 'complete');
});
