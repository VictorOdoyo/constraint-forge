import { Solver } from './solver.js';
/** Exhaustive incumbent optimization. Never reports optimality after interruption. */
export function optimize(model, objective, { direction = 'min', ...options } = {}) {
  if (typeof objective !== 'function' || !['min', 'max'].includes(direction))
    throw new TypeError('Invalid objective');
  let best,
    score,
    improvements = 0;
  const result = new Solver(model).solve({
    ...options,
    collect: false,
    onSolution: (solution) => {
      const value = objective(solution);
      if (!Number.isFinite(value)) throw new TypeError('Objective must be finite');
      if (best === undefined || (direction === 'min' ? value < score : value > score)) {
        best = { ...solution };
        score = value;
        improvements++;
      }
      options.onSolution?.(solution);
    },
  });
  return { ...result, best, score, improvements, optimal: result.status === 'complete' };
}
