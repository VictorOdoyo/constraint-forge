import { hasMatching } from './matching.js';
import { compile } from './compile.js';
/** Generalized arc consistency; mutates a branch-local domain map. */
export function propagate(domains, constraints, stats, checkpoint = () => {}, setDomain = (k, v) => domains.set(k, v), topology = compile(domains, constraints)) {
  const { incident } = topology;
  const queue = constraints.map((_, i) => i);
  const queued = new Set(queue);
  function supported(c, fixed, value) {
    if (c.kind === 'allDifferent') { stats.checks++; return hasMatching(c.scope, domains, fixed, value, checkpoint); }
    if (c.kind === 'table') {
      return c.tuples.some(row => { checkpoint(); stats.checks++; return c.scope.every((k,i)=>k===fixed ? row[i]===value : domains.get(k).includes(row[i])); });
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
    return visit(0);
  }
  if ([...domains.values()].some(d => !d.length)) return false;
  for (let head = 0; head < queue.length; head++) {
    const index = queue[head];
    queued.delete(index);
    const c = constraints[index];
    for (const key of c.scope) {
      const before = domains.get(key);
      const after = before.filter(v => supported(c, key, v));
      stats.pruned += before.length - after.length;
      if (!after.length) return false;
      if (after.length !== before.length) {
        setDomain(key, after);
        for (const other of incident.get(key)) {
          if (!queued.has(other)) { queue.push(other); queued.add(other); }
        }
      }
    }
  }
  return true;
}
