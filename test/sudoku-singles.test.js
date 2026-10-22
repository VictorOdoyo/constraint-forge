import test from 'node:test';
import assert from 'node:assert/strict';
import { singles } from '../src/sudoku/singles.js';
test('singles identify a forced final row entry', () => {
  const moves = singles('123456780' + '.'.repeat(72));
  assert.ok(moves.some((m) => m.index === 8 && m.value === 9));
  assert.ok(moves.every((m) => m.index !== 0));
});
