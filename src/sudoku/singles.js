import { parseSudoku } from '../puzzles/sudoku.js';
import { sudokuCandidates, units } from './candidates.js';
export function singles(input) {
  const cells = parseSudoku(input),
    candidates = sudokuCandidates(input),
    moves = [],
    seen = new Set();
  const add = (index, value, strategy) => {
    const key = index + ':' + value;
    if (!seen.has(key)) {
      seen.add(key);
      moves.push({ index, value, strategy });
    }
  };
  for (const [i, values] of candidates)
    if (!cells[i] && values.size === 1) add(i, [...values][0], 'naked-single');
  for (const unit of units)
    for (let value = 1; value <= 9; value++) {
      if (unit.some((i) => cells[i] === value)) continue;
      const possible = unit.filter((i) => candidates.get(i).has(value));
      if (possible.length === 1) add(possible[0], value, 'hidden-single');
    }
  return moves;
}
