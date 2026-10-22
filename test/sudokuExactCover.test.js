import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { sudokuExactCover } from '../src/sudokuExactCover.js';
import { sudokuUniqueness, formatSudoku } from '../src/puzzles/sudoku.js';
test('independent Sudoku algorithms agree on a reference solution', () => {
  const puzzle =
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const a = sudokuExactCover(puzzle);
  const b = sudokuUniqueness(puzzle);
  assert.equal(a.status, 'complete');
  assert.deepEqual(a.solutions, b.solutions.map(formatSudoku));
});
