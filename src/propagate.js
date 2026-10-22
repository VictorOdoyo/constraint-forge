/** Generalized arc consistency; mutates a branch-local domain map. */
export function propagate(domains, constraints, stats, checkpoint = () => {}) {
  const incident = new Map([...domains.keys()].map(k => [k, []]));
  constraints.forEach((c, i) => c.scope.forEach(k => incident.get(k).push(i)));
  const queue = constraints.map((_, i) => i);
  const queued = new Set(queue);
  function supported(c, fixed, value) {
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
        domains.set(key, after);
        for (const other of incident.get(key)) {
          if (!queued.has(other)) { queue.push(other); queued.add(other); }
        }
      }
    }
  }
  return true;
}
