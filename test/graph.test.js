import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { primalGraph, components } from '../src/graph.js';
test('primal graph captures n-ary cliques and isolated components', () => {
  const m = new Model();
  for (const k of ['a', 'b', 'c', 'd']) m.variable(k, [0, 1]);
  m.constrain(['a', 'b', 'c'], () => true);
  const g = primalGraph(m);
  assert.equal(g.get('a').size, 2);
  assert.deepEqual(components(g), [['a', 'b', 'c'], ['d']]);
});
