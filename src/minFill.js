import { primalGraph } from './graph.js';
/** Greedy min-fill induced width is an upper bound, not exact treewidth. */
export function minFill(model) {
  const g = primalGraph(model),
    order = [];
  let width = 0,
    fillEdges = 0;
  while (g.size) {
    const score = (k) => {
      const n = [...g.get(k)];
      let fill = 0;
      for (let i = 0; i < n.length; i++)
        for (let j = i + 1; j < n.length; j++) if (!g.get(n[i]).has(n[j])) fill++;
      return fill;
    };
    const key = [...g.keys()].sort(
        (a, b) => score(a) - score(b) || g.get(a).size - g.get(b).size,
      )[0],
      neighbors = [...g.get(key)];
    width = Math.max(width, neighbors.length);
    order.push(key);
    for (let i = 0; i < neighbors.length; i++)
      for (let j = i + 1; j < neighbors.length; j++) {
        const a = neighbors[i],
          b = neighbors[j];
        if (!g.get(a).has(b)) {
          g.get(a).add(b);
          g.get(b).add(a);
          fillEdges++;
        }
      }
    for (const n of neighbors) g.get(n).delete(key);
    g.delete(key);
  }
  return { order, widthUpperBound: width, fillEdges };
}
