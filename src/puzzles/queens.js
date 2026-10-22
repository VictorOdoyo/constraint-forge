import { Model } from '../model.js';

export function queens(size) {
  if (!Number.isSafeInteger(size) || size < 1 || size > 30) throw new RangeError('Queens size must be 1..30');
  const m = new Model();
  const keys = Array.from({ length: size }, (_, i) => `q${i}`);
  const rows = Array.from({ length: size }, (_, i) => i);
  keys.forEach(k => m.variable(k, rows));
  m.allDifferent(keys);
  for (let i = 0; i < size; i++) for (let j = i + 1; j < size; j++) {
    m.constrain([keys[i], keys[j]], (a, b) => Math.abs(a - b) !== j - i, 'diagonal');
  }
  return m;
}
