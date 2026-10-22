import { Model } from './model.js';
import { Solver } from './solver.js';
import { primalGraph, components } from './graph.js';
/** Eager component enumeration; interrupted components never imply UNSAT. */
export function solveDecomposed(model, options = {}) {
  if (options.limit !== undefined || options.collect === false)
    throw new TypeError('Decomposition requires complete collected component results');
  const parts = components(primalGraph(model));
  let solutions = [{}],
    nodes = 0;
  for (const keys of parts) {
    const set = new Set(keys),
      m = new Model();
    for (const k of keys) m.variable(k, model.domains.get(k));
    m.constraints = model.constraints.filter((c) => set.has(c.scope[0]));
    const r = new Solver(m).solve(options);
    nodes += r.stats.nodes;
    if (r.status !== 'complete')
      return { status: r.status, solutions: [], nodes, reason: r.reason };
    solutions = solutions.flatMap((a) => r.solutions.map((b) => ({ ...a, ...b })));
    if (!solutions.length) break;
  }
  return { status: 'complete', solutions, nodes, components: parts.length };
}
