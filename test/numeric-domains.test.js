import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, absolute, precedence, noOverlap } from '../src/index.js';
test('numeric constraints reject string domains instead of coercing values', () => {
  const m = new Model().variable('a', ['1']).variable('b', [2]);
  assert.throws(() => absolute(m, 'a', 'b', 1), TypeError);
  assert.throws(() => precedence(m, 'a', 'b'), TypeError);
  assert.throws(() => noOverlap(m, ['a', 'b'], [1, 1]), TypeError);
});
