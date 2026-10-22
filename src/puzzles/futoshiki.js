import { latin } from './latin.js';
export function futoshiki(size, { givens = {}, lessThan = [] } = {}) {
  const m = latin(size, givens);
  for (const [a, b] of lessThan) m.constrain([a, b], (x, y) => x < y, 'less-than');
  return m;
}
