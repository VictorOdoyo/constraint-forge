import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { random } from '../src/random.js';
test('global matching agrees with binary decomposition on 80 mixed-value models', () => {
  const rng = random(7),
    values = [0, 1, '0', false];
  for (let trial = 0; trial < 80; trial++) {
    const binary = new Model(),
      global = new Model(),
      keys = ['a', 'b', 'c'];
    for (const k of keys) {
      const d = values.filter(() => rng() > 0.3);
      binary.variable(k, d);
      global.variable(k, d);
    }
    binary.allDifferent(keys);
    global.allDifferent(keys, { global: true });
    const encode = (r) => r.solutions.map((s) => JSON.stringify(keys.map((k) => s[k]))).sort();
    assert.deepEqual(encode(new Solver(global).solve()), encode(new Solver(binary).solve()));
  }
});
