import { singles } from './singles.js';
import { Solver } from '../solver.js';
import { sudoku, parseSudoku } from '../puzzles/sudoku.js';
/** Transparent diagnostic profile, not a calibrated human difficulty rating. */
export function difficulty(input, { maxNodes = 100000 } = {}) {
  const cells = parseSudoku(input);
  let steps = 0;
  while (cells.includes(0)) {
    const moves = singles(cells.join(''));
    if (!moves.length) break;
    const move = moves[0];
    cells[move.index] = move.value;
    steps++;
  }
  const result = new Solver(sudoku(cells.join(''))).solve({ limit: 1, maxNodes });
  return {
    givens: parseSudoku(input).filter(Boolean).length,
    singleSteps: steps,
    remaining: cells.filter((v) => !v).length,
    searchNodes: result.stats.nodes,
    searchDepth: result.stats.maxDepth,
    status: result.status,
    solvable: result.solutions.length > 0,
  };
}
