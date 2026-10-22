import test from 'node:test';
import assert from 'node:assert/strict';
import { Model } from '../src/index.js';
import { minimizeLinear } from '../src/minimizeLinear.js';
test('branch and bound improves incumbents without changing the model', () => {
  const m = new Model().variable('x', [3, 2, 1]).variable('y', [0, 1]);
  const r = minimizeLinear(m, { x: 2, y: -1 });
  assert.deepEqual(r.best, { x: 1, y: 1 });
  assert.equal(r.score, 1);
  assert.ok(r.optimal);
  assert.equal(m.constraints.length, 0);
});
