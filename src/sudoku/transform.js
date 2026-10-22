import { parseSudoku } from '../puzzles/sudoku.js';
export function transformSudoku(
  input,
  {
    transpose = false,
    digits = [1, 2, 3, 4, 5, 6, 7, 8, 9],
    rows = [0, 1, 2, 3, 4, 5, 6, 7, 8],
    columns = [0, 1, 2, 3, 4, 5, 6, 7, 8],
  } = {},
) {
  const cells = parseSudoku(input),
    valid = (p, start) =>
      Array.isArray(p) &&
      p.length === 9 &&
      new Set(p).size === 9 &&
      p.every((v) => Number.isInteger(v) && v >= start && v < start + 9);
  if (!valid(digits, 1) || !valid(rows, 0) || !valid(columns, 0))
    throw new TypeError('Expected permutations');
  for (const p of [rows, columns])
    for (let b = 0; b < 3; b++)
      if (new Set(p.slice(b * 3, b * 3 + 3).map((v) => Math.floor(v / 3))).size !== 1)
        throw new TypeError('Row and column permutations must preserve bands');
  return Array.from({ length: 81 }, (_, i) => {
    const r = rows[Math.floor(i / 9)],
      c = columns[i % 9],
      v = cells[transpose ? c * 9 + r : r * 9 + c];
    return v ? digits[v - 1] : '.';
  }).join('');
}
