import { requireNumeric } from '../numeric.js';
export function noOverlap(model, starts, durations) {
  durations = [...durations];
  requireNumeric(model, starts);
  if (starts.length !== durations.length || durations.some((v) => !Number.isFinite(v) || v < 0))
    throw new TypeError('Invalid durations');
  for (let i = 0; i < starts.length; i++)
    for (let j = i + 1; j < starts.length; j++) {
      model.constrain(
        [starts[i], starts[j]],
        (a, b) =>
          durations[i] === 0 ||
          durations[j] === 0 ||
          a + durations[i] <= b ||
          b + durations[j] <= a,
        'no-overlap',
      );
    }
  return model;
}
