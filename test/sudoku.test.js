import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSudoku, formatSudoku, sudokuUniqueness } from '../src/puzzles/sudoku.js';

export const puzzle =
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const answer = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

test('solves a Sudoku and proves uniqueness', () => {
  const result = sudokuUniqueness(puzzle);
  assert.equal(result.uniqueness, 'unique');
  assert.equal(formatSudoku(result.solutions[0]), answer);
});
test('distinguishes inconsistent givens and interrupted uniqueness', () => {
  assert.equal(sudokuUniqueness('11' + '.'.repeat(79)).uniqueness, 'unsatisfiable');
  assert.equal(sudokuUniqueness('.'.repeat(81), { timeoutMs: 0 }).uniqueness, 'unknown');
});
test('accepts whitespace and rejects malformed puzzles', () => {
  assert.equal(parseSudoku(puzzle + '\n').length, 81);
  assert.throws(() => parseSudoku('0'.repeat(80)), TypeError);
  assert.throws(() => parseSudoku('x'.repeat(81)), TypeError);
});
