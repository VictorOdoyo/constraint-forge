export function cardinality(model, scope, counts) {
  const entries = counts instanceof Map ? [...counts] : Object.entries(counts);
  if (entries.some(([, n]) => !Number.isInteger(n) || n < 0))
    throw new TypeError('Counts must be nonnegative integers');
  return model.constrain(
    scope,
    (...v) => entries.every(([value, n]) => v.filter((x) => x === value).length === n),
    'cardinality',
  );
}
