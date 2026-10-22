import { Model } from '../model.js';
import { sum } from '../constraints/sum.js';
export function minesweeper(cells, clues) {
  const m = new Model();
  cells.forEach((k) => m.variable(k, [0, 1]));
  for (const { neighbors, mines } of clues) {
    if (!neighbors.length) {
      if (mines !== 0) throw new TypeError('Empty neighborhood cannot contain mines');
    } else sum(m, neighbors, mines);
  }
  return m;
}
