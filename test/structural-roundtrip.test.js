import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Model,
  Solver,
  linear,
  regular,
  cumulative,
  serialize,
  deserialize,
  noOverlap,
  validate,
} from '../src/index.js';
test('specialized integer and resource constraints roundtrip without table expansion', () => {
  for (const builder of [
    (m) => linear(m, ['a', 'b'], [2, -1], 'le', 1),
    (m) => cumulative(m, ['a', 'b'], [1, 1], [1, 1], 1),
    (m) =>
      regular(m, ['a', 'b'], {
        start: 0,
        accept: [0],
        transitions: [
          [0, 0, 0],
          [0, 1, 1],
          [1, 0, 0],
          [1, 1, 1],
        ],
      }),
  ]) {
    const m = new Model().variable('a', [0, 1]).variable('b', [0, 1]);
    builder(m);
    const clone = deserialize(JSON.parse(JSON.stringify(serialize(m, { maxTuples: 1 }))));
    assert.deepEqual(new Solver(clone).solve().solutions, new Solver(m).solve().solutions);
  }
});
test('numeric structure is validated before accepting an integer-kind document', () => {
  assert.throws(
    () =>
      deserialize({
        version: 1,
        variables: [{ name: 'x', domain: [0.5] }],
        constraints: [
          { kind: 'linearInteger', scope: ['x'], coefficients: [1], relation: 'eq', rhs: 0.5 },
        ],
      }),
    TypeError,
  );
});
test('caller mutation cannot desynchronize scheduling predicates and propagators', () => {
  const m = new Model().variable('a', [0]).variable('b', [1]);
  const durations = [1, 1],
    demands = [1, 1];
  cumulative(m, ['a', 'b'], durations, demands, 1);
  durations[0] = 100;
  demands[0] = 100;
  const r = new Solver(m).solve();
  assert.equal(r.stats.solutions, 1);
  assert.ok(validate(m, r.solutions[0]).valid);
  const n = new Model().variable('a', [0]).variable('b', [1]),
    d = [1, 1];
  noOverlap(n, ['a', 'b'], d);
  d[0] = 100;
  assert.equal(new Solver(n).solve().stats.solutions, 1);
});
