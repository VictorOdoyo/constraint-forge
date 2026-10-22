import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { implies } from '../src/constraints/implies.js';

test('guarded predicates permit disabled branches', () => {
  const m = new Model().variable('b', [0, 1]).variable('x', [1, 2]);
  implies(m, 'b', ['x'], (x) => x === 2);
  assert.equal(new Solver(m).solve().solutions.length, 3);
});
