export function cumulative(model, starts, durations, demands, capacity) {
  if (
    starts.length !== durations.length ||
    starts.length !== demands.length ||
    !Number.isFinite(capacity) ||
    capacity < 0 ||
    [...durations, ...demands].some((v) => !Number.isFinite(v) || v < 0)
  )
    throw new TypeError('Invalid cumulative resource specification');
  if (
    starts.some(
      (k) => !model.domains.has(k) || model.domains.get(k).some((v) => typeof v !== 'number'),
    )
  )
    throw new TypeError('Start domains must be numeric');
  return model.constrain(
    starts,
    (...s) =>
      s.every(
        (t) =>
          s.reduce(
            (load, start, i) => load + (start <= t && t < start + durations[i] ? demands[i] : 0),
            0,
          ) <= capacity,
      ),
    'cumulative',
  );
}
