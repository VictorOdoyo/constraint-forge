import test from 'node:test';import assert from 'node:assert/strict';
import {sudokuCandidates} from '../src/sudoku/candidates.js';
test('candidates eliminate row, column and box givens',()=>{const c=sudokuCandidates('123456780'+'.'.repeat(72));assert.deepEqual([...c.get(8)],[9]);assert.deepEqual([...c.get(0)],[1]);assert.throws(()=>sudokuCandidates('11'+'.'.repeat(79)),/Conflicting/);});