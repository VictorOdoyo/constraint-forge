import test from 'node:test';
import assert from 'node:assert/strict';
import { queens } from '../src/index.js';
import { solveBatch } from '../src/batch.js';
test('bounded batch execution retains input ordering', async () => {
  const r = await solveBatch([queens(6), queens(4), queens(5)], { concurrency: 2 });
  assert.deepEqual(
    r.map((v) => v.stats.solutions),
    [4, 2, 10],
  );
  assert.deepEqual(await solveBatch([]), []);
});
