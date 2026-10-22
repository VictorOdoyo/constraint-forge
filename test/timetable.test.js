import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver, cumulative } from '../src/index.js';
import { propagate } from '../src/propagate.js';
test('timetable filtering matches exhaustive scheduling on small resources', () => {
  for (const capacity of [1, 2, 3]) {
    const m = new Model();
    for (const k of ['a', 'b', 'c']) m.variable(k, [0, 1, 2, 3]);
    cumulative(m, ['a', 'b', 'c'], [2, 1, 2], [1, 2, 1], capacity);
    const ref = new Model();
    for (const [k, d] of m.domains) ref.variable(k, d);
    ref.constraints = m.constraints.map(({ kind, ...c }) => c);
    const encode = (r) => r.solutions.map((s) => JSON.stringify(s)).sort();
    assert.deepEqual(encode(new Solver(m).solve()), encode(new Solver(ref).solve()));
  }
});
test('compulsory resource profile removes conflicting start times', () => {
  const m = new Model().variable('a', [0]).variable('b', [0, 1, 2, 3]);
  cumulative(m, ['a', 'b'], [2, 1], [1, 1], 1);
  const d = new Map(m.domains);
  assert.ok(propagate(d, m.constraints, { checks: 0, pruned: 0 }));
  assert.deepEqual(d.get('b'), [2, 3]);
});
