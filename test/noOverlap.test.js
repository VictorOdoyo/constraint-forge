import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { noOverlap } from '../src/constraints/noOverlap.js';

test('disjunctive scheduling includes zero-length jobs', () => {
  const m = new Model().variable('a', [0, 1, 2]).variable('b', [0, 1, 2]);
  noOverlap(m, ['a', 'b'], [2, 2]);
  assert.equal(new Solver(m).solve().solutions.length, 2);
  const z = new Model().variable('a', [0]).variable('b', [0]);
  noOverlap(z, ['a', 'b'], [0, 2]);
  assert.equal(new Solver(z).solve().solutions.length, 1);
});
