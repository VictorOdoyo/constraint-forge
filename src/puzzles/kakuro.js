import { Model } from '../model.js';
import { sum } from '../constraints/sum.js';
export function kakuro(cells, runs) {
  const m = new Model();
  cells.forEach((k) => m.variable(k, [1, 2, 3, 4, 5, 6, 7, 8, 9]));
  for (const run of runs) {
    m.allDifferent(run.cells, { global: true });
    sum(m, run.cells, run.total);
  }
  return m;
}
