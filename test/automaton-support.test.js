import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver, regular } from '../src/index.js';
import { propagate } from '../src/propagate.js';
test('DFA propagation handles 64 decisions without tuple enumeration', () => {
  const m = new Model(),
    keys = Array.from({ length: 64 }, (_, i) => 'x' + i);
  keys.forEach((k) => m.variable(k, [0, 1]));
  regular(m, keys, { start: 0, accept: [0], transitions: [[0, 0, 0]] });
  const d = new Map(m.domains),
    stats = { checks: 0, pruned: 0 };
  assert.ok(propagate(d, m.constraints, stats));
  assert.ok([...d.values()].every((v) => v.length === 1 && v[0] === 0));
  assert.ok(stats.checks < 20000);
});
test('layered DFA and predicate enumeration agree on seeded short languages', () => {
  for (let n = 1; n <= 7; n++) {
    const m = new Model(),
      keys = Array.from({ length: n }, (_, i) => 'x' + i);
    keys.forEach((k) => m.variable(k, [0, 1]));
    regular(m, keys, {
      start: 0,
      accept: [0],
      transitions: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
    });
    const reference = new Model();
    for (const [k, d] of m.domains) reference.variable(k, d);
    reference.constraints = m.constraints.map(({ kind, ...c }) => c);
    assert.deepEqual(new Solver(m).solve().solutions, new Solver(reference).solve().solutions);
  }
});
test('ambiguous or nonserializable automata are rejected', () => {
  const m = new Model().variable('x', [0]);
  assert.throws(
    () => regular(m, ['x'], { start: undefined, accept: [0], transitions: [] }),
    TypeError,
  );
});
