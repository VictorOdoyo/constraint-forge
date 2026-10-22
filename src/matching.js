/** Test whether a bipartite variable/value graph admits an injective assignment. */
export function hasMatching(scope, domains, fixed, value, checkpoint = () => {}) {
  const owner = new Map();
  if (fixed !== undefined) owner.set(value, fixed);
  function augment(key, seen) {
    checkpoint();
    for (const v of domains.get(key)) {
      if (seen.has(v)) continue;
      seen.add(v);
      if (!owner.has(v) || (owner.get(v) !== fixed && augment(owner.get(v), seen))) {
        owner.set(v, key);
        return true;
      }
    }
    return false;
  }
  return scope.filter((k) => k !== fixed).every((k) => augment(k, new Set()));
}
