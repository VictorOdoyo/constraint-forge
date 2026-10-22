import { Model } from '../model.js';
import { Solver } from '../solver.js';

export function parseSudoku(input) {
  if (typeof input !== 'string') throw new TypeError('Puzzle must be a string');
  const text = input.replace(/\s/g, '');
  if (!/^[0-9.]{81}$/.test(text)) throw new TypeError('Expected 81 digits or dots');
  return [...text].map(c => c === '.' ? 0 : Number(c));
}

export function sudoku(input) {
  const cells = parseSudoku(input);
  const m = new Model();
  const key = (r, c) => `r${r}c${c}`;
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    m.variable(key(r, c), cells[r * 9 + c] ? [cells[r * 9 + c]] : digits);
  }
  for (let i = 0; i < 9; i++) {
    m.allDifferent(Array.from({ length: 9 }, (_, j) => key(i, j)));
    m.allDifferent(Array.from({ length: 9 }, (_, j) => key(j, i)));
  }
  for (let br = 0; br < 3; br++) for (let bc = 0; bc < 3; bc++) {
    m.allDifferent(Array.from({ length: 9 }, (_, j) => key(br * 3 + Math.floor(j / 3), bc * 3 + j % 3)));
  }
  return m;
}

export function formatSudoku(solution) {
  return Array.from({ length: 81 }, (_, i) => solution[`r${Math.floor(i / 9)}c${i % 9}`]).join('');
}

/** Unknown is distinct from non-unique when search runs out of resources. */
export function sudokuUniqueness(input, options = {}) {
  const result = new Solver(sudoku(input)).solve({ ...options, limit: 2 });
  const uniqueness = result.solutions.length >= 2 ? 'multiple' :
    result.status === 'interrupted' ? 'unknown' : result.solutions.length === 1 ? 'unique' : 'unsatisfiable';
  return { uniqueness, ...result };
}
