import test from 'node:test';
import assert from 'node:assert/strict';
import { sudoku } from '../src/puzzles/sudoku.js';
test('Sudoku compiles to 27 global unit constraints', () => {
  const m = sudoku('.'.repeat(81));
  assert.equal(m.constraints.length, 27);
  assert.ok(m.constraints.every((c) => c.kind === 'allDifferent'));
});
