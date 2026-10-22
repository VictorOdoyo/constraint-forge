export function linear(model, scope, coefficients, relation, rhs) {
  if (
    coefficients.length !== scope.length ||
    ![...coefficients, rhs].every(Number.isFinite) ||
    !['eq', 'le', 'ge'].includes(relation)
  )
    throw new TypeError('Invalid linear relation');
  if (
    scope.some(
      (k) => !model.domains.has(k) || model.domains.get(k).some((v) => typeof v !== 'number'),
    )
  )
    throw new TypeError('Linear domains must be numeric');
  const weights = [...coefficients];
  model.constrain(
    scope,
    (...v) => {
      const total = v.reduce((s, x, i) => s + x * weights[i], 0);
      return relation === 'eq' ? total === rhs : relation === 'le' ? total <= rhs : total >= rhs;
    },
    'linear-' + relation,
  );
  if (
    [...weights, rhs, ...scope.flatMap((k) => model.domains.get(k))].every(Number.isSafeInteger)
  ) {
    const magnitude = scope.reduce(
      (s, k, i) =>
        s +
        BigInt(Math.abs(weights[i])) *
          model.domains.get(k).reduce((max, v) => {
            const n = BigInt(Math.abs(v));
            return n > max ? n : max;
          }, 0n),
      0n,
    );
    if (magnitude <= BigInt(Number.MAX_SAFE_INTEGER))
      Object.assign(model.constraints.at(-1), {
        kind: 'linearInteger',
        coefficients: weights,
        relation,
        rhs,
      });
  }
  return model;
}
