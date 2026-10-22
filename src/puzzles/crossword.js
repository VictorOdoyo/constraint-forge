import { Model } from '../model.js';
export function crossword(slots, crossings, { distinct = true } = {}) {
  const m = new Model();
  for (const { name, length, words } of slots) {
    if (
      !Number.isInteger(length) ||
      length < 1 ||
      words.some((w) => typeof w !== 'string' || w.length !== length)
    )
      throw new TypeError('Invalid slot vocabulary');
    m.variable(name, words);
  }
  if (distinct)
    m.allDifferent(
      slots.map((s) => s.name),
      { global: true },
    );
  for (const { a, ai, b, bi } of crossings) {
    if (
      !Number.isInteger(ai) ||
      !Number.isInteger(bi) ||
      ai < 0 ||
      bi < 0 ||
      !slots.some((s) => s.name === a && ai < s.length) ||
      !slots.some((s) => s.name === b && bi < s.length)
    )
      throw new TypeError('Invalid crossing');
    m.constrain([a, b], (x, y) => x[ai] === y[bi], 'crossing');
  }
  return m;
}
