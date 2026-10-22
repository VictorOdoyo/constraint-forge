export function nogood(model, assignment) {
  const scope = Object.keys(assignment),
    values = scope.map((k) => assignment[k]);
  return model.constrain(scope, (...v) => v.some((x, i) => x !== values[i]), 'nogood');
}
