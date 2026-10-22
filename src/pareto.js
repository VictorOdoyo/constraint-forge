import { Solver } from './solver.js';
export function pareto(model, objectives, options = {}) {
  if (
    !Array.isArray(objectives) ||
    !objectives.length ||
    objectives.some((f) => typeof f !== 'function')
  )
    throw new TypeError('Expected objective functions');
  let frontier = [];
  const dominates = (a, b) => a.every((v, i) => v <= b[i]) && a.some((v, i) => v < b[i]);
  const result = new Solver(model).solve({
    ...options,
    collect: false,
    onSolution: (s) => {
      const scores = objectives.map((f) => f(s));
      if (!scores.every(Number.isFinite)) throw new TypeError('Objective must be finite');
      if (
        frontier.some(
          (p) => dominates(p.scores, scores) || p.scores.every((v, i) => v === scores[i]),
        )
      )
        return;
      frontier = frontier.filter((p) => !dominates(scores, p.scores));
      frontier.push({ solution: { ...s }, scores });
    },
  });
  return { ...result, frontier, complete: result.status === 'complete' };
}
