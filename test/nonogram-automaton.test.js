import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Model,
  Solver,
  regular,
  nonogram,
  serialize,
  deserialize,
  solveAsync,
} from '../src/index.js';
import { linePatterns, lineAutomaton } from '../src/puzzles/nonogram.js';
test('Nonogram automata recognize exactly the explicit line-pattern oracle', () => {
  for (let n = 1; n <= 7; n++)
    for (const runs of [[], [1], [2], [1, 1], [2, 1], [1, 2, 1]]) {
      const m = new Model(),
        keys = Array.from({ length: n }, (_, i) => 'x' + i);
      keys.forEach((k) => m.variable(k, [0, 1]));
      regular(m, keys, lineAutomaton(runs));
      const actual = new Solver(m)
        .solve()
        .solutions.map((s) => keys.map((k) => s[k]).join(''))
        .sort();
      assert.deepEqual(
        actual,
        linePatterns(n, runs)
          .map((row) => row.join(''))
          .sort(),
      );
    }
});
test('wide Nonograms remain structural across JSON and worker boundaries', async () => {
  const m = nonogram(
    [[64]],
    Array.from({ length: 64 }, () => [1]),
  );
  const document = serialize(m, { maxTuples: 1 });
  assert.ok(document.constraints.every((c) => c.kind === 'regular'));
  const r = await solveAsync(deserialize(JSON.parse(JSON.stringify(document))));
  assert.equal(r.status, 'complete');
  assert.equal(r.stats.solutions, 1);
});
