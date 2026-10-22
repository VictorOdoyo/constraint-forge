import { random, shuffle } from '../random.js';
import { sudokuUniqueness } from './sudoku.js';

/** Remove clues only after uniqueness is proved. Target clues are best effort. */
export function generateSudoku({ seed = 1, clues = 32, checkTimeoutMs = 2000 } = {}) {
  if (!Number.isInteger(clues) || clues < 17 || clues > 81)
    throw new RangeError('Clues must be 17..81');
  if (!(checkTimeoutMs > 0 && Number.isFinite(checkTimeoutMs)))
    throw new RangeError('Invalid check timeout');
  const rng = random(seed);
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
  const groups = () =>
    shuffle([0, 1, 2], rng).flatMap((b) => shuffle([0, 1, 2], rng).map((i) => b * 3 + i));
  const rows = groups(),
    cols = groups();
  const solution = rows
    .flatMap((r) => cols.map((c) => digits[(r * 3 + Math.floor(r / 3) + c) % 9]))
    .join('');
  const cells = [...solution];
  let actualClues = 81,
    attempts = 0,
    unknownChecks = 0;
  for (const index of shuffle(
    Array.from({ length: 81 }, (_, i) => i),
    rng,
  )) {
    if (actualClues <= clues) break;
    const old = cells[index];
    cells[index] = '.';
    attempts++;
    const result = sudokuUniqueness(cells.join(''), { timeoutMs: checkTimeoutMs });
    if (result.uniqueness === 'unique') actualClues--;
    else {
      cells[index] = old;
      if (result.uniqueness === 'unknown') unknownChecks++;
    }
  }
  return {
    puzzle: cells.join(''),
    solution,
    seed,
    requestedClues: clues,
    actualClues,
    attempts,
    unknownChecks,
  };
}
