import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver } from '../src/index.js';
import { minesweeper } from '../src/puzzles/minesweeper.js';
test('overlapping mine counts force shared cells', () => {
  const r = new Solver(
    minesweeper(
      ['a', 'b', 'c'],
      [
        { neighbors: ['a', 'b'], mines: 1 },
        { neighbors: ['b', 'c'], mines: 0 },
      ],
    ),
  ).solve();
  assert.deepEqual(r.solutions, [{ a: 1, b: 0, c: 0 }]);
});
