import { parseSudoku } from '../puzzles/sudoku.js';
export const units = [
  ...Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => r * 9 + c)),
  ...Array.from({ length: 9 }, (_, c) => Array.from({ length: 9 }, (_, r) => r * 9 + c)),
  ...Array.from({ length: 9 }, (_, b) =>
    Array.from(
      { length: 9 },
      (_, i) => (Math.floor(b / 3) * 3 + Math.floor(i / 3)) * 9 + (b % 3) * 3 + (i % 3),
    ),
  ),
];
export function sudokuCandidates(input) {
  const cells = parseSudoku(input);
  for (const unit of units) {
    const given = unit.map((i) => cells[i]).filter(Boolean);
    if (new Set(given).size !== given.length) throw new TypeError('Conflicting Sudoku givens');
  }
  const result = new Map();
  for (let i = 0; i < 81; i++) {
    const used = new Set(units.filter((u) => u.includes(i)).flatMap((u) => u.map((j) => cells[j])));
    result.set(
      i,
      new Set(cells[i] ? [cells[i]] : [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => !used.has(v))),
    );
  }
  return result;
}
