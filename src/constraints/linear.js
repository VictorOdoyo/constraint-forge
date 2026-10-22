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
  return model.constrain(
    scope,
    (...v) => {
      const total = v.reduce((s, x, i) => s + x * weights[i], 0);
      return relation === 'eq' ? total === rhs : relation === 'le' ? total <= rhs : total >= rhs;
    },
    'linear-' + relation,
  );
}
