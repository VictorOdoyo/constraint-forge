export function regular(model, scope, { start, accept, transitions }) {
  if (!Array.isArray(accept) || !Array.isArray(transitions))
    throw new TypeError('Invalid automaton');
  const edges = transitions.map((t) => [...t]),
    final = new Set(accept);
  const scalar = (v) => ['string', 'boolean'].includes(typeof v) || (typeof v === 'number' && Number.isFinite(v));
  if (!scalar(start) || accept.some(v => !scalar(v)) || edges.some(t => t.length !== 3 || t.some(v => !scalar(v))))
    throw new TypeError('Automaton states and symbols must be finite primitive values');
  const move = (state, symbol) => edges.find((t) => t[0] === state && t[1] === symbol)?.[2];
  if (
    edges.some((t) => t.length !== 3) ||
    new Set(edges.map((t) => JSON.stringify(t.slice(0, 2)))).size !== edges.length
  )
    throw new TypeError('Automaton must be deterministic');
  model.constrain(
    scope,
    (...symbols) => {
      let state = start;
      for (const s of symbols) {
        state = move(state, s);
        if (state === undefined) return false;
      }
      return final.has(state);
    },
    'regular',
  );
  Object.assign(model.constraints.at(-1), { kind: 'regular', start, accept: [...accept], transitions: edges });
  return model;
}
