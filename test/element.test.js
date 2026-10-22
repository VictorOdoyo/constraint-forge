import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { element } from '../src/constraints/element.js';

test('element channels index and result domains', () => {
  const m = new Model().variable('i', [-1, 0, 1, 2, 3]).variable('v', [20]);
  element(m, 'i', [10, 20, 30], 'v');
  assert.deepEqual(new Solver(m).solve().solutions, [{ i: 1, v: 20 }]);
});
