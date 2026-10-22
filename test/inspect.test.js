import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { inspect } from '../src/inspect.js';
test('inspection reports exact Cartesian size without floating overflow', () => {
  const m = new Model();
  for (let i = 0; i < 64; i++) m.variable('x' + i, [0, 1]);
  const r = inspect(m);
  assert.equal(r.searchSpace, '18446744073709551616');
  assert.equal(r.components.length, 64);
  assert.equal(r.constraints, 0);
});
