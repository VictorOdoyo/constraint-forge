import { hasMatching } from './matching.js';
import { compile } from './compile.js';
import { regularSupport } from './automaton.js';
import { linearSupport } from './linear-support.js';
/** Generalized arc consistency; mutates a branch-local domain map. */
export function propagate(
  domains,
  constraints,
  stats,
  checkpoint = () => {},
  setDomain = (k, v) => domains.set(k, v),
  topology = compile(domains, constraints),
) {
  const { incident } = topology;
  const queue = constraints.map((_, i) => i);
  const queued = new Set(queue);
  function supported(c, fixed, value) {
    if (c.kind === 'linearInteger') return linearSupport(c, domains, fixed, value, checkpoint, stats);
    if (c.kind === 'regular') return regularSupport(c, domains, fixed, value, checkpoint, stats);
    if (c.kind === 'allDifferent') {
      stats.checks++;
      return hasMatching(c.scope, domains, fixed, value, checkpoint);
    }
    if (c.kind === 'table') {
      return c.tuples.some((row) => {
        checkpoint();
        stats.checks++;
        return c.scope.every((k, i) =>
          k === fixed ? row[i] === value : domains.get(k).includes(row[i]),
        );
      });
    }
    if (c.kind === 'sum') {
      let reachable = new Set([0n]);
      for (const k of c.scope) {
        const next = new Set();
        for (const total of reachable)
          for (const v of k === fixed ? [value] : domains.get(k)) {
            checkpoint();
            stats.checks++;
            next.add(total + BigInt(v));
          }
        reachable = next;
      }
      return reachable.has(BigInt(c.target));
    }
    let cache = topology.residues.get(c);
    if (!cache) {
      cache = new Map();
      topology.residues.set(c, cache);
    }
    let byValue = cache.get(fixed);
    if (!byValue) {
      byValue = new Map();
      cache.set(fixed, byValue);
    }
    const previous = byValue.get(value);
    if (previous && c.scope.every((k, i) => domains.get(k).includes(previous[i]))) {
      checkpoint();
      stats.cacheHits = (stats.cacheHits || 0) + 1;
      return true;
    }
    if (c.kind === 'linearBound') {
      let lower = 0;
      for (let i = 0; i < c.scope.length; i++) {
        checkpoint();
        const k = c.scope[i],
          weight = c.coefficients[i];
        lower += k === fixed ? value * weight : Math.min(...domains.get(k).map((v) => v * weight));
      }
      stats.checks++;
      return lower < c.bound();
    }
    const tuple = [];
    function visit(i) {
      checkpoint();
      if (i === c.scope.length) {
        stats.checks++;
        return Boolean(c.test(...tuple));
      }
      const key = c.scope[i];
      for (const v of key === fixed ? [value] : domains.get(key)) {
        tuple[i] = v;
        if (visit(i + 1)) return true;
      }
      return false;
    }
    const found = visit(0);
    if (found) byValue.set(value, [...tuple]);
    return found;
  }
  if ([...domains.values()].some((d) => !d.length)) return false;
  for (let head = 0; head < queue.length; head++) {
    const index = queue[head];
    queued.delete(index);
    const c = constraints[index];
    for (const key of c.scope) {
      const before = domains.get(key);
      const after = before.filter((v) => supported(c, key, v));
      stats.pruned += before.length - after.length;
      if (!after.length) {
        topology.weights[index]++;
        return false;
      }
      if (after.length !== before.length) {
        setDomain(key, after);
        for (const other of incident.get(key)) {
          if (!queued.has(other)) {
            queue.push(other);
            queued.add(other);
          }
        }
      }
    }
  }
  return true;
}
