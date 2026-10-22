export function implies(model, flag, scope, predicate) {
  if (
    typeof predicate !== 'function' ||
    !model.domains.has(flag) ||
    model.domains.get(flag).some((v) => v !== 0 && v !== 1)
  )
    throw new TypeError('Guard requires a Boolean integer variable');
  return model.constrain(
    [flag, ...scope],
    (enabled, ...v) => !enabled || Boolean(predicate(...v)),
    'implies',
  );
}
