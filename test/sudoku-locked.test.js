import test from 'node:test';
import assert from 'node:assert/strict';
import { lockedCandidates } from '../src/sudoku/locked.js';
test('box candidates locked to a row eliminate outside the box', () => {
  const d = new Map(
    Array.from({ length: 81 }, (_, i) => [i, new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])]),
  );
  for (const i of [2, 9, 10, 11, 18, 19, 20]) d.get(i).delete(1);
  const r = lockedCandidates(d);
  assert.equal(r.candidates.get(3).has(1), false);
  assert.ok(d.get(3).has(1));
});
