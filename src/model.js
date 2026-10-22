/** A finite-domain model. Values are finite numbers, strings, or booleans. */
export class Model {
  domains = new Map();
  constraints = [];

  variable(name, values) {
    if (typeof name !== 'string' || !name || this.domains.has(name)) {
      throw new TypeError('Variable names must be unique nonempty strings');
    }
    const domain = [...new Set(values)];
    if (domain.some(v => !['number', 'string', 'boolean'].includes(typeof v) ||
      (typeof v === 'number' && !Number.isFinite(v)))) {
      throw new TypeError('Domain values must be finite numbers, strings, or booleans');
    }
    this.domains.set(name, domain);
    return this;
  }

  constrain(scope, test, label = 'constraint') {
    if (!Array.isArray(scope) || !scope.length || new Set(scope).size !== scope.length ||
      scope.some(k => !this.domains.has(k)) || typeof test !== 'function') {
      throw new TypeError('A constraint requires distinct known variables and a predicate');
    }
    this.constraints.push({ scope: [...scope], test, label });
    return this;
  }

  allDifferent(scope, { global = false } = {}) {
    if (!Array.isArray(scope) || new Set(scope).size !== scope.length || scope.some(k => !this.domains.has(k))) {
      throw new TypeError('allDifferent requires distinct known variables');
    }
    if (global && scope.length) {
      this.constraints.push({ scope: [...scope], kind: 'allDifferent', label: 'all-different', test: (...v) => new Set(v).size === v.length });
      return this;
    }
    for (let i = 0; i < scope.length; i++) {
      for (let j = i + 1; j < scope.length; j++) {
        this.constrain([scope[i], scope[j]], (a, b) => a !== b, 'not-equal');
      }
    }
    return this;
  }
}
