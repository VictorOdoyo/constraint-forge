import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver } from '../src/solver.js';
import { queens } from '../src/puzzles/queens.js';

test('matches exhaustive N-Queens counts for boards 1 through 8', () => {
  const expected = [1, 0, 0, 2, 10, 4, 40, 92];
  for (let n = 1; n <= 8; n++) {
    const result = new Solver(queens(n)).solve();
    assert.equal(result.status, 'complete');
    assert.equal(result.solutions.length, expected[n - 1]);
    for (const solution of result.solutions) {
      const rows = Object.values(solution);
      assert.equal(new Set(rows).size, n);
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) {
          assert.notEqual(Math.abs(rows[i] - rows[j]), j - i);
        }
    }
  }
});
