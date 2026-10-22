import test from 'node:test';
import assert from 'node:assert/strict';
import { difficulty } from '../src/sudoku/difficulty.js';
test('difficulty profiles report deductions and search effort separately', () => {
  const solved =
    '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
  const r = difficulty('.' + solved.slice(1));
  assert.equal(r.singleSteps, 1);
  assert.equal(r.remaining, 0);
  assert.equal(r.searchNodes, 1);
  assert.ok(r.solvable);
});
