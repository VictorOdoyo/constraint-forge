import test from 'node:test';
import assert from 'node:assert/strict';
import { Model, Solver } from '../src/index.js';
import { serialize, deserialize } from '../src/serialize.js';
test('JSON model roundtrip preserves arbitrary predicates as data tables', () => {
  const m = new Model()
    .variable('a', [1, 2])
    .variable('b', [1, 2])
    .constrain(['a', 'b'], (a, b) => a < b);
  const copy = deserialize(JSON.parse(JSON.stringify(serialize(m))));
  assert.deepEqual(new Solver(copy).solve().solutions, [{ a: 1, b: 2 }]);
  assert.throws(() => serialize(m, { maxTuples: 1 }), RangeError);
  assert.throws(() => deserialize({ version: 2 }), TypeError);
});
