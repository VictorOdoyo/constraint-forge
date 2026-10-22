import test from 'node:test';
import assert from 'node:assert/strict';
import { Model } from '../src/model.js';

test('deduplicates domains and copies input arrays', () => {
  const values = [1, 1, 2];
  const m = new Model().variable('x', values);
  values.push(3);
  assert.deepEqual(m.domains.get('x'), [1, 2]);
});
test('rejects invalid names, values, and constraint scopes', () => {
  const m = new Model().variable('x', [1]);
  assert.throws(() => m.variable('x', [2]), TypeError);
  assert.throws(() => m.variable('y', [NaN]), TypeError);
  assert.throws(() => m.constrain(['y'], () => true), TypeError);
  assert.throws(() => m.constrain(['x', 'x'], () => true), TypeError);
  assert.throws(() => m.allDifferent(['x', 'x']), TypeError);
});
