import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver } from '../src/index.js';
import { alphametic } from '../src/puzzles/alphametic.js';
test('column carries solve I plus BB equals ILL', () => {
  const r = new Solver(alphametic(['I', 'BB'], 'ILL')).solve();
  assert.equal(r.stats.solutions, 1);
  assert.equal(r.solutions[0].I, 1);
  assert.equal(r.solutions[0].B, 9);
  assert.equal(r.solutions[0].L, 0);
});
