import test from 'node:test';
import assert from 'node:assert/strict';
import { Model } from '../src/index.js';
import { optimize } from '../src/optimize.js';
test('optimization proves optimum only after exhaustion', () => {
  const m = new Model().variable('x', [3, 1, 2]);
  const r = optimize(m, (s) => s.x);
  assert.equal(r.score, 1);
  assert.ok(r.optimal);
  const partial = optimize(m, (s) => s.x, { limit: 1 });
  assert.equal(partial.score, 3);
  assert.equal(partial.optimal, false);
  assert.equal(optimize(m, (s) => s.x, { direction: 'max' }).score, 3);
});
