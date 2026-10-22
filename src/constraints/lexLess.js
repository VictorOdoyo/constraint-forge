export function lexLess(model, left, right, { strict = true } = {}) {
  if (left.length !== right.length || !left.length)
    throw new TypeError('Lexicographic vectors must have equal positive length');
  const scope = [...new Set([...left, ...right])],
    positions = new Map(scope.map((k, i) => [k, i]));
  return model.constrain(
    scope,
    (...v) => {
      for (let i = 0; i < left.length; i++) {
        const a = v[positions.get(left[i])],
          b = v[positions.get(right[i])];
        if (a !== b) return a < b;
      }
      return !strict;
    },
    'lex-less',
  );
}
