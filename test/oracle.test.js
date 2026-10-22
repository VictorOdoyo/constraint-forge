import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { random } from '../src/random.js';

test('matches independent brute force on 100 seeded constraint networks', () => {
  const rng = random(2026);
  for (let trial = 0; trial < 100; trial++) {
    const m = new Model();
    const names = ['a', 'b', 'c', 'd'];
    for (const name of names) m.variable(name, [0, 1, 2].filter(() => rng() > 0.15));
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      if (rng() < 0.7) {
        const allowed = new Set(Array.from({ length: 9 }, (_, k) => k).filter(() => rng() > 0.45));
        m.constrain([names[i], names[j]], (a, b) => allowed.has(a * 3 + b));
      }
    }
    const expected = [];
    for (const a of m.domains.get('a')) for (const b of m.domains.get('b')) {
      for (const c of m.domains.get('c')) for (const d of m.domains.get('d')) {
        const assignment = { a, b, c, d };
        if (m.constraints.every(rule => rule.test(...rule.scope.map(k => assignment[k])))) expected.push(assignment);
      }
    }
    const canonical = solutions => solutions.map(s => JSON.stringify(names.map(k => s[k]))).sort();
    assert.deepEqual(canonical(new Solver(m).solve().solutions), canonical(expected), `network ${trial}`);
  }
});
