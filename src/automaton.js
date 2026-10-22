/** Reachability in a layered DFA, avoiding Cartesian sequence enumeration. */
export function regularSupport(constraint, domains, fixed, value, checkpoint, stats) {
  const transitions = new Map();
  for (const [from, symbol, to] of constraint.transitions) {
    if (!transitions.has(from)) transitions.set(from, new Map());
    transitions.get(from).set(symbol, to);
  }
  let reachable = new Set([constraint.start]);
  for (const key of constraint.scope) {
    const next = new Set();
    for (const state of reachable) for (const symbol of key === fixed ? [value] : domains.get(key)) {
      checkpoint(); stats.checks++;
      const edges = transitions.get(state);
      if (edges?.has(symbol)) next.add(edges.get(symbol));
    }
    if (!next.size) return false;
    reachable = next;
  }
  return constraint.accept.some(state => reachable.has(state));
}
