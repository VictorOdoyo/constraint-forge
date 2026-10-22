import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { exactCover } from '../src/exactCover.js';
test('Algorithm X finds exact partitions and respects resource limits', () => {
  const r = exactCover(['a', 'b', 'c'], [['a'], ['b', 'c'], ['a', 'b'], ['c']]);
  assert.deepEqual(r.solutions, [
    [0, 1],
    [2, 3],
  ]);
  assert.equal(exactCover(['a'], [['a']], { maxNodes: 1 }).status, 'interrupted');
  assert.deepEqual(exactCover([], []).solutions, [[]]);
});
