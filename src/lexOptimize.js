import { Solver } from './solver.js';
export function lexOptimize(model, objectives, options = {}) {
  if (
    !Array.isArray(objectives) ||
    !objectives.length ||
    objectives.some((f) => typeof f !== 'function')
  )
    throw new TypeError('Expected objective functions');
  let best, scores;
  const r = new Solver(model).solve({
    ...options,
    collect: false,
    onSolution: (s) => {
      const values = objectives.map((f) => f(s));
      if (!values.every(Number.isFinite)) throw new TypeError('Objective must be finite');
      const first = scores ? values.findIndex((v, i) => v !== scores[i]) : -1;
      if (!scores || (first >= 0 && values[first] < scores[first])) {
        best = { ...s };
        scores = values;
      }
      options.onSolution?.(s);
    },
  });
  return { ...r, best, scores, optimal: r.status === 'complete' };
}
