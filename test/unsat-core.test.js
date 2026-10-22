import test from 'node:test';
import assert from 'node:assert/strict';
import { Model } from '../src/index.js';
import { unsatCore } from '../src/unsatCore.js';
test('deletion core removes irrelevant constraints while retaining contradiction', () => {
  const m = new Model().variable('x', [1, 2]).variable('y', [0, 1]);
  m.constrain(['x'], (x) => x === 1)
    .constrain(['x'], (x) => x === 2)
    .constrain(['y'], (y) => y === 0);
  assert.deepEqual(unsatCore(m), { status: 'unsatisfiable', indices: [0, 1], minimal: true });
  assert.equal(unsatCore(m, { timeoutMs: 0 }).status, 'unknown');
});
