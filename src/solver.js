import { propagate } from './propagate.js';
import { compile } from './compile.js';
import { Trail } from './trail.js';

export class SearchInterrupted extends Error {
  constructor(reason) { super(reason); this.name = 'SearchInterrupted'; }
}

/** Reusable solver; each solve call owns its snapshot, domains, and counters. */
export class Solver {
  constructor(model) { this.model = model; }

  solve({ limit = Infinity, maxNodes = Infinity, timeoutMs = Infinity, signal, onSolution, collect = true } = {}) {
    if (!(limit === Infinity || Number.isSafeInteger(limit) && limit >= 1) ||
        !(maxNodes === Infinity || Number.isSafeInteger(maxNodes) && maxNodes >= 1) ||
        !(timeoutMs >= 0)) throw new RangeError('Invalid search budget');
    if (onSolution !== undefined && typeof onSolution !== 'function') throw new TypeError('onSolution must be a function');
    const started = performance.now();
    const stats = { nodes: 0, checks: 0, pruned: 0, failures: 0, solutions: 0, maxDepth: 0, elapsedMs: 0 };
    const results = [];
    const constraints = this.model.constraints.map(c => ({ ...c, scope: [...c.scope] }));
    const domains = new Map([...this.model.domains].map(([k, v]) => [k, [...v]]));
    const trail = new Trail(domains);
    const topology = compile(domains, constraints);
    const { degree } = topology;
    const checkpoint = () => {
      if (signal?.aborted) throw new SearchInterrupted('Search aborted');
      if (performance.now() - started >= timeoutMs) throw new SearchInterrupted('Time budget exhausted');
    };
    function search(current, depth) {
      checkpoint();
      if (stats.nodes >= maxNodes) throw new SearchInterrupted('Node budget exhausted');
      stats.nodes++;
      stats.maxDepth = Math.max(stats.maxDepth, depth);
      if (!propagate(current, constraints, stats, checkpoint, (k, v) => trail.set(k, v), topology)) { stats.failures++; return; }
      const candidates = [...current].filter(([, d]) => d.length > 1);
      if (!candidates.length) {
        const solution = Object.fromEntries([...current].map(([k, d]) => [k, d[0]]));
        if (collect) results.push(solution);
        stats.solutions++;
        onSolution?.({ ...solution });
        return;
      }
      candidates.sort((a, b) => a[1].length - b[1].length || degree.get(b[0]) - degree.get(a[0]));
      const [key, values] = candidates[0];
      for (const value of values) {
        const mark = trail.mark();
        try { trail.set(key, [value]); search(current, depth + 1); }
        finally { trail.undo(mark); }
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
      status = 'interrupted'; reason = e.message;
    } finally { stats.elapsedMs = performance.now() - started; }
    return { status, ...(reason ? { reason } : {}), solutions: results, stats };
  }
}
