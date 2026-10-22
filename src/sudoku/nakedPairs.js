import { units } from './candidates.js';
/** Return a new candidate map and auditable removals; never mutate caller state. */
export function nakedPairs(candidates) {
  const result = new Map([...candidates].map(([i, s]) => [i, new Set(s)])),
    removals = [];
  for (const unit of units) {
    const pairs = new Map();
    for (const i of unit) {
      const values = [...result.get(i)].sort();
      if (values.length === 2) {
        const key = values.join(',');
        if (!pairs.has(key)) pairs.set(key, []);
        pairs.get(key).push(i);
      }
    }
    for (const indices of pairs.values())
      if (indices.length === 2) {
        const values = [...result.get(indices[0])];
        for (const i of unit)
          if (!indices.includes(i))
            for (const value of values)
              if (result.get(i).delete(value))
                removals.push({ index: i, value, strategy: 'naked-pair', witness: [...indices] });
      }
  }
  return { candidates: result, removals };
}
