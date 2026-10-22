import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSudoku } from '../src/puzzles/generate.js';
import { sudokuUniqueness, formatSudoku } from '../src/puzzles/sudoku.js';

test('seeded generation is repeatable and preserves a unique solution', () => {
  const a = generateSudoku({ seed: 42, clues: 65 });
  assert.deepEqual(a, generateSudoku({ seed: 42, clues: 65 }));
  assert.equal(a.actualClues, 65);
  const result = sudokuUniqueness(a.puzzle);
  assert.equal(result.uniqueness, 'unique');
  assert.equal(formatSudoku(result.solutions[0]), a.solution);
});
test('validates generation bounds', () => {
  assert.throws(() => generateSudoku({ clues: 16 }), RangeError);
  assert.throws(() => generateSudoku({ seed: -1 }), RangeError);
});
