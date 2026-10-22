import { propagate } from './propagate.js';
import { compile } from './compile.js';
import { Trail } from './trail.js';

export class SearchInterrupted extends Error {
  constructor(reason) {
    super(reason);
    this.name = 'SearchInterrupted';
  }
}

/** Reusable solver; each solve call owns its snapshot, domains, and counters. */
export class Solver {
  constructor(model) {
    this.model = model;
  }

  solve({
    limit = Infinity,
    maxNodes = Infinity,
    timeoutMs = Infinity,
    signal,
    onSolution,
    collect = true,
    valueOrder = 'input',
    variableOrder = 'mrv',
    onTrace,
  } = {}) {
    if (
      !(limit === Infinity || (Number.isSafeInteger(limit) && limit >= 1)) ||
      !(maxNodes === Infinity || (Number.isSafeInteger(maxNodes) && maxNodes >= 1)) ||
      !(timeoutMs >= 0)
    )
      throw new RangeError('Invalid search budget');
    if (onSolution !== undefined && typeof onSolution !== 'function')
      throw new TypeError('onSolution must be a function');
    if (!['mrv', 'dom-wdeg'].includes(variableOrder))
      throw new RangeError('Unknown variable ordering');
    if (!['input', 'lcv'].includes(valueOrder)) throw new RangeError('Unknown value ordering');
    if (onTrace !== undefined && typeof onTrace !== 'function')
      throw new TypeError('onTrace must be a function');
    const started = performance.now();
    const stats = {
      nodes: 0,
      checks: 0,
      pruned: 0,
      failures: 0,
      solutions: 0,
      maxDepth: 0,
      elapsedMs: 0,
    };
    const results = [];
    const constraints = this.model.constraints.map((c) => ({ ...c, scope: [...c.scope] }));
    const domains = new Map([...this.model.domains].map(([k, v]) => [k, [...v]]));
    const trail = new Trail(domains);
    const topology = compile(domains, constraints);
    const { degree } = topology;
    const checkpoint = () => {
      if (signal?.aborted) throw new SearchInterrupted('Search aborted');
      if (performance.now() - started >= timeoutMs)
        throw new SearchInterrupted('Time budget exhausted');
    };
    const emit = (event) => onTrace?.(Object.freeze(event));
    function search(current, depth) {
      checkpoint();
      if (stats.nodes >= maxNodes) throw new SearchInterrupted('Node budget exhausted');
      stats.nodes++;
      emit({ type: 'node', depth, node: stats.nodes });
      stats.maxDepth = Math.max(stats.maxDepth, depth);
      if (
        !propagate(current, constraints, stats, checkpoint, (k, v) => trail.set(k, v), topology)
      ) {
        stats.failures++;
        emit({ type: 'failure', depth });
        return;
      }
      const candidates = [...current].filter(([, d]) => d.length > 1);
      if (!candidates.length) {
        const solution = Object.fromEntries([...current].map(([k, d]) => [k, d[0]]));
        if (collect) results.push(solution);
        stats.solutions++;
        emit({ type: 'solution', depth, index: stats.solutions });
        onSolution?.({ ...solution });
        return;
      }
      const score = ([key, values]) =>
        values.length /
        (variableOrder === 'dom-wdeg'
          ? Math.max(
              1,
              topology.incident.get(key).reduce((s, i) => s + topology.weights[i], 0),
            )
          : 1);
      candidates.sort((a, b) => score(a) - score(b) || degree.get(b[0]) - degree.get(a[0]));
      const [key, values] = candidates[0];
      const ordered =
        valueOrder === 'input' ? values : [...values].sort((a, b) => penalty(a) - penalty(b));
      function penalty(value) {
        let rejected = 0;
        for (const i of topology.incident.get(key)) {
          const c = constraints[i];
          if (c.scope.length !== 2) continue;
          const other = c.scope.find((k) => k !== key);
          for (const v of current.get(other)) {
            checkpoint();
            stats.checks++;
            if (!c.test(...c.scope.map((k) => (k === key ? value : v)))) rejected++;
          }
        }
        return rejected;
      }
      for (const value of ordered) {
        emit({ type: 'decision', depth, variable: key, value });
        const mark = trail.mark();
        try {
          trail.set(key, [value]);
          search(current, depth + 1);
        } finally {
          trail.undo(mark);
        }
        if (stats.solutions >= limit) return;
      }
    }
    let status = 'complete';
    let reason;
    try {
      search(domains, 0);
      if (stats.solutions >= limit) status = 'limit';
    } catch (e) {
      if (!(e instanceof SearchInterrupted)) throw e;
      status = 'interrupted';
      reason = e.message;
    } finally {
      stats.elapsedMs = performance.now() - started;
    }
    return { status, ...(reason ? { reason } : {}), solutions: results, stats };
  }
}
