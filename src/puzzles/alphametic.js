import { Model } from '../model.js';
import { linear } from '../constraints/linear.js';
export function alphametic(addends, result) {
  if (
    !Array.isArray(addends) ||
    !addends.length ||
    [...addends, result].some((w) => typeof w !== 'string' || !/^[A-Z]+$/.test(w))
  )
    throw new TypeError('Expected uppercase words');
  const words = [...addends, result],
    letters = [...new Set(words.join(''))];
  if (letters.length > 10) throw new RangeError('Too many letters');
  const m = new Model(),
    leading = new Set(words.filter((w) => w.length > 1).map((w) => w[0]));
  letters.forEach((k) =>
    m.variable(
      k,
      Array.from({ length: 10 }, (_, i) => i).filter((v) => v || !leading.has(k)),
    ),
  );
  m.allDifferent(letters, { global: true });
  const width = Math.max(...words.map((w) => w.length));
  for (let i = 0; i <= width; i++)
    m.variable(
      'carry' + i,
      i === 0 || i === width ? [0] : Array.from({ length: addends.length + 1 }, (_, j) => j),
    );
  for (let col = 0; col < width; col++) {
    const weights = new Map([
      ['carry' + col, 1],
      ['carry' + (col + 1), -10],
    ]);
    for (const w of addends) {
      const k = w.at(-1 - col);
      if (k) weights.set(k, (weights.get(k) || 0) + 1);
    }
    const k = result.at(-1 - col);
    if (k) weights.set(k, (weights.get(k) || 0) - 1);
    linear(m, [...weights.keys()], [...weights.values()], 'eq', 0);
  }
  return m;
}
