import test from 'node:test';
import assert from 'node:assert/strict';
import { Solver } from '../src/index.js';
import { kenken } from '../src/puzzles/kenken.js';
test('arithmetic cages and Latin rules identify a small grid', () => {
  const m = kenken(2, [
    { cells: ['0,0'], op: '=', target: 1 },
    { cells: ['0,1', '1,1'], op: '+', target: 3 },
    { cells: ['1,0'], op: '=', target: 2 },
  ]);
  assert.equal(new Solver(m).solve().stats.solutions, 1);
});
