import { Model } from '../model.js';
import { sum } from '../constraints/sum.js';
export function magic(size) {
  if (!Number.isInteger(size) || size < 1 || size > 5)
    throw new RangeError('Magic size must be 1..5');
  const m = new Model(),
    digits = Array.from({ length: size * size }, (_, i) => i + 1),
    key = (r, c) => r + ',' + c;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) m.variable(key(r, c), digits);
  m.allDifferent([...m.domains.keys()], { global: true });
  const target = (size * (size * size + 1)) / 2;
  for (let i = 0; i < size; i++) {
    sum(
      m,
      Array.from({ length: size }, (_, j) => key(i, j)),
      target,
    );
    sum(
      m,
      Array.from({ length: size }, (_, j) => key(j, i)),
      target,
    );
  }
  sum(
    m,
    Array.from({ length: size }, (_, i) => key(i, i)),
    target,
  );
  if (size > 1)
    sum(
      m,
      Array.from({ length: size }, (_, i) => key(i, size - i - 1)),
      target,
    );
  return m;
}
