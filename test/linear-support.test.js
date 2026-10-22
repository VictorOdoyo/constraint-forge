import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver, linear, alphametic } from '../src/index.js';
import { propagate } from '../src/propagate.js';
test('weighted propagators agree with generic support on signed coefficients', () => {
  for (const relation of ['eq', 'le', 'ge'])
    for (let rhs = -5; rhs <= 5; rhs++) {
      const m = new Model().variable('a', [-2, 0, 2]).variable('b', [-1, 1, 3]);
      linear(m, ['a', 'b'], [-2, 3], relation, rhs);
      const ref = new Model();
      for (const [k, d] of m.domains) ref.variable(k, d);
      ref.constraints = m.constraints.map(({ kind, ...c }) => c);
      assert.deepEqual(new Solver(m).solve().solutions, new Solver(ref).solve().solutions);
    }
});
test('integer equalities propagate a long weighted binary sequence', () => {
  const m = new Model(),
    keys = Array.from({ length: 32 }, (_, i) => 'x' + i);
  keys.forEach((k) => m.variable(k, [0, 1]));
  linear(
    m,
    keys,
    keys.map(() => 2),
    'eq',
    0,
  );
  const d = new Map(m.domains),
    s = { checks: 0, pruned: 0 };
  assert.ok(propagate(d, m.constraints, s));
  assert.ok([...d.values()].every((v) => v.length === 1 && v[0] === 0));
  assert.ok(s.checks < 200000);
});
test('decimal coefficients preserve the generic Number semantics', () => {
  const m = new Model().variable('x', [0.1, 0.2]);
  linear(m, ['x'], [0.5], 'eq', 0.05);
  assert.equal(m.constraints[0].kind, undefined);
  assert.deepEqual(new Solver(m).solve().solutions, [{ x: 0.1 }]);
});
test('column propagation solves SEND plus MORE equals MONEY', () => {
  const r = new Solver(alphametic(['SEND', 'MORE'], 'MONEY')).solve({ timeoutMs: 15000 });
  assert.equal(r.status, 'complete');
  assert.equal(r.stats.solutions, 1);
  const s = r.solutions[0],
    number = (w) => [...w].reduce((n, k) => n * 10 + s[k], 0);
  assert.equal(number('SEND') + number('MORE'), number('MONEY'));
});
