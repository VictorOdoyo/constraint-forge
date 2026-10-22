import test from 'node:test';
import assert from 'node:assert/strict';
import { Model } from '../src/model.js';
import { propagate } from '../src/propagate.js';

test('propagates a restriction through a constraint chain', () => {
  const m = new Model().variable('a', [1]).variable('b', [1, 2]).variable('c', [1, 2]);
  m.constrain(['a', 'b'], (a, b) => a !== b).constrain(['b', 'c'], (b, c) => b !== c);
  const domains = new Map(m.domains);
  const stats = { checks: 0, pruned: 0 };
  assert.equal(propagate(domains, m.constraints, stats), true);
  assert.deepEqual([...domains.values()], [[1], [2], [1]]);
  assert.equal(stats.pruned, 2);
});
test('enforces support for ternary constraints', () => {
  const m = new Model().variable('a', [1, 2]).variable('b', [1, 2]).variable('c', [4]);
  m.constrain(['a', 'b', 'c'], (a, b, c) => a + b === c);
  const domains = new Map(m.domains);
  assert.equal(propagate(domains, m.constraints, { checks: 0, pruned: 0 }), true);
  assert.deepEqual([...domains.values()], [[2], [2], [4]]);
});
test('detects a domain wipeout', () => {
  const m = new Model().variable('a', [1]).variable('b', [1]).allDifferent(['a', 'b']);
  assert.equal(propagate(new Map(m.domains), m.constraints, { checks: 0, pruned: 0 }), false);
});
