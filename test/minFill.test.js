import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { minFill } from '../src/minFill.js';
test('min-fill recognizes tree width upper bound one', () => {
  const m = new Model();
  for (const k of ['a', 'b', 'c', 'd']) m.variable(k, [0, 1]);
  for (const [a, b] of [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'd'],
  ])
    m.constrain([a, b], () => true);
  const r = minFill(m);
  assert.equal(r.widthUpperBound, 1);
  assert.equal(r.fillEdges, 0);
  assert.equal(r.order.length, 4);
});
