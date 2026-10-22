/** Algorithm X using immutable active sets and smallest-column branching. */
export function exactCover(columns, rows, { limit = Infinity, maxNodes = Infinity } = {}) {
  if (
    !(limit === Infinity || (Number.isSafeInteger(limit) && limit > 0)) ||
    !(maxNodes === Infinity || (Number.isSafeInteger(maxNodes) && maxNodes > 0))
  )
    throw new RangeError('Invalid exact-cover budget');
  const all = new Set(columns);
  if (all.size !== columns.length) throw new TypeError('Duplicate exact-cover column');
  if (rows.some((r) => !r.length || new Set(r).size !== r.length || r.some((c) => !all.has(c))))
    throw new TypeError('Invalid exact-cover row');
  const sets = rows.map((r) => new Set(r)),
    solutions = [];
  let nodes = 0,
    status = 'complete';
  function search(remaining, active, chosen) {
    if (nodes >= maxNodes) {
      status = 'interrupted';
      return;
    }
    nodes++;
    if (!remaining.size) {
      solutions.push(chosen);
      return;
    }
    let candidates;
    for (const col of remaining) {
      const matches = active.filter((i) => sets[i].has(col));
      if (!candidates || matches.length < candidates.length) candidates = matches;
    }
    for (const i of candidates) {
      const next = new Set([...remaining].filter((c) => !sets[i].has(c))),
        compatible = active.filter((j) => ![...sets[i]].some((c) => sets[j].has(c)));
      search(next, compatible, [...chosen, i]);
      if (status === 'interrupted' || solutions.length >= limit) {
        if (status !== 'interrupted') status = 'limit';
        return;
      }
    }
  }
  search(
    all,
    rows.map((_, i) => i),
    [],
  );
  return { status, solutions, nodes };
}
