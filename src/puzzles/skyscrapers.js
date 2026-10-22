import { latin } from './latin.js';
export function skyscrapers(
  size,
  { top = [], bottom = [], left = [], right = [], givens = {} } = {},
) {
  const m = latin(size, givens),
    line = Array.from({ length: size }, (_, i) => i);
  const add = (keys, clue) => {
    if (clue === undefined || clue === 0) return;
    if (!Number.isInteger(clue) || clue < 1 || clue > size)
      throw new RangeError('Invalid visibility clue');
    m.constrain(
      keys,
      (...v) => {
        let max = 0,
          count = 0;
        for (const x of v)
          if (x > max) {
            max = x;
            count++;
          }
        return count === clue;
      },
      'visibility',
    );
  };
  for (let i = 0; i < size; i++) {
    const row = line.map((j) => i + ',' + j),
      col = line.map((j) => j + ',' + i);
    add(row, left[i]);
    add([...row].reverse(), right[i]);
    add(col, top[i]);
    add([...col].reverse(), bottom[i]);
  }
  return m;
}
