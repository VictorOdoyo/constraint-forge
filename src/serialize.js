import { Model } from './model.js';
import { table } from './constraints/table.js';
import { sum } from './constraints/sum.js';
import { regular } from './constraints/regular.js';
import { linear } from './constraints/linear.js';
import { cumulative } from './constraints/cumulative.js';
/** Predicates are materialized as bounded tables; executable code is never serialized. */
export function serialize(model, { maxTuples = 100000 } = {}) {
  if (!Number.isSafeInteger(maxTuples) || maxTuples < 1)
    throw new RangeError('Invalid tuple budget');
  let visited = 0;
  const constraints = model.constraints.map((c) => {
    if (c.kind === 'allDifferent') return { kind: c.kind, scope: [...c.scope] };
    if (c.kind === 'sum') return { kind: c.kind, scope: [...c.scope], target: c.target };
    if (c.kind === 'regular') return {kind:c.kind,scope:[...c.scope],start:c.start,accept:[...c.accept],transitions:c.transitions.map(t=>[...t])};
    if (c.kind === 'linearInteger') return {kind:c.kind,scope:[...c.scope],coefficients:[...c.coefficients],relation:c.relation,rhs:c.rhs};
    if (c.kind === 'cumulative') return {kind:c.kind,scope:[...c.scope],durations:[...c.durations],demands:[...c.demands],capacity:c.capacity};
    if (c.kind === 'table')
      return { kind: 'table', scope: [...c.scope], tuples: c.tuples.map((t) => [...t]) };
    const tuples = [],
      row = [];
    function visit(i) {
      if (i === c.scope.length) {
        if (++visited > maxTuples) throw new RangeError('Serialization tuple budget exceeded');
        if (c.test(...row)) tuples.push([...row]);
        return;
      }
      for (const v of model.domains.get(c.scope[i])) {
        row[i] = v;
        visit(i + 1);
      }
    }
    visit(0);
    return { kind: 'table', scope: [...c.scope], tuples };
  });
  return {
    version: 1,
    variables: [...model.domains].map(([name, domain]) => ({ name, domain: [...domain] })),
    constraints,
  };
}
export function deserialize(data) {
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.variables) ||
    !Array.isArray(data.constraints)
  )
    throw new TypeError('Invalid model document');
  const model = new Model();
  for (const v of data.variables) {
    if (!Array.isArray(v.domain)) throw new TypeError('Invalid domain');
    model.variable(v.name, v.domain);
  }
  for (const c of data.constraints) {
    if (c.kind === 'allDifferent') model.allDifferent(c.scope, { global: true });
    else if (c.kind === 'sum') sum(model, c.scope, c.target);
    else if (c.kind === 'table') table(model, c.scope, c.tuples);
    else if (c.kind === 'regular') regular(model,c.scope,c);
    else if (c.kind === 'linearInteger') linear(model,c.scope,c.coefficients,c.relation,c.rhs);
    else if (c.kind === 'cumulative') cumulative(model,c.scope,c.durations,c.demands,c.capacity);
    else throw new TypeError('Unsupported constraint kind');
  }
  return model;
}
