export function increasing(model, scope, { strict = true } = {}) {
  if (
    !Array.isArray(scope) ||
    new Set(scope).size !== scope.length ||
    scope.some((k) => !model.domains.has(k))
  )
    throw new TypeError('Invalid increasing scope');
  for (let i = 1; i < scope.length; i++)
    model.constrain([scope[i - 1], scope[i]], (a, b) => (strict ? a < b : a <= b), 'increasing');
  return model;
}
