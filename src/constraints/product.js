export function product(model, scope, target) {
  if (
    !Number.isSafeInteger(target) ||
    scope.some(
      (k) => !model.domains.has(k) || model.domains.get(k).some((v) => !Number.isSafeInteger(v)),
    )
  )
    throw new TypeError('Product requires safe integers');
  return model.constrain(
    scope,
    (...v) => v.reduce((a, b) => a * BigInt(b), 1n) === BigInt(target),
    'product',
  );
}
