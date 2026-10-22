import test from 'node:test';
import assert from 'node:assert/strict';
import { Model } from '../src/index.js';
import { lexOptimize } from '../src/lexOptimize.js';
test('secondary objectives only break primary ties', () => {
  const m = new Model().variable('x', [2, 1]).variable('y', [0, 3]);
  const r = lexOptimize(m, [(s) => s.x, (s) => -s.y]);
  assert.deepEqual(r.best, { x: 1, y: 3 });
  assert.ok(r.optimal);
});
