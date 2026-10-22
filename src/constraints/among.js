export function among(model, scope, values, min, max = min) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < min)
    throw new RangeError('Invalid occurrence bounds');
  const allowed = new Set(values);
  return model.constrain(
    scope,
    (...v) => {
      const n = v.filter((x) => allowed.has(x)).length;
      return n >= min && n <= max;
    },
    'among',
  );
}
