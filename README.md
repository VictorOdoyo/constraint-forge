# Constraint Forge

[![verify](https://github.com/VictorOdoyo/constraint-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/VictorOdoyo/constraint-forge/actions/workflows/ci.yml)

A constraint programming and puzzle research toolkit with no runtime dependencies.
Requires Node.js 22 or later. MIT licensed.

## Quick start

```sh
git clone https://github.com/VictorOdoyo/constraint-forge.git
cd constraint-forge
npm test
node src/cli.js queens 8
node src/cli.js generate 42 32
npm run bench
node bench/compare.js 3
```

Running the solver and tests needs no dependency installation. Install development
tools with npm ci when changing code or running the formatter.

## Capabilities

- Reversible domain trails, compiled topology, support residues, MRV, dom-wdeg,
  and least-constraining value ordering.
- Global allDifferent using bipartite matching, table filtering, and exact
  integer sum propagation, plus arithmetic, logical, and scheduling builders.
- Count-only enumeration, search traces, validation, unsatisfiable cores,
  topology inspection, and independent component solving.
- Incumbent, lexicographic, Pareto, and linear branch-and-bound optimization.
- Worker threads, live cancellation, hard worker wall budgets, bounded batches,
  and portable models that contain data rather than executable predicates.
- Sudoku and N-Queens plus Nonograms, KenKen, Kakuro, Futoshiki, Latin squares,
  magic squares, alphametics, crossword filling, coloring, packing, and scheduling.
- Independent Algorithm X solver, Sudoku uniqueness and generation, human-style
  deductions, clue minimization, and SVG puzzle exports.

## Example

```js
import { Model, Solver, minimizeLinear, solveAsync } from './src/index.js';

const model = new Model()
  .variable('alice', [1, 2, 3])
  .variable('bob', [1, 2, 3])
  .constrain(['alice', 'bob'], (a, b) => a < b, 'ordering');

console.log(new Solver(model).solve({ valueOrder: 'lcv' }).solutions);
console.log(minimizeLinear(model, { alice: 2, bob: 1 }).best);
console.log(await solveAsync(model, { wallTimeoutMs: 2000 }));
```

## Correctness and limitations

Complete means exhaustive search. Limit and interrupted results never prove
uniqueness, infeasibility, or optimality. The test suite checks known counts,
independent brute-force oracles, alternative Sudoku algorithms, cancellation,
precision boundaries, and public command-line workflows. CI covers Windows and
Linux on Node 22 and 24.

Generic n-ary predicates can be expensive. Global matching is a straightforward
augmenting-path implementation, not Regin filtering. Linear branch and bound
requires safe integers; general linear predicates use JS Number semantics.
Synchronous cancellation is cooperative; use workers for timer-driven aborts.
Sudoku effort metrics are diagnostic rather than calibrated human ratings.

Read the [API reference](docs/api.md) for input formats and result contracts and
the [architecture notes](docs/architecture.md) for algorithms and practical limits.
Commit history records individual features, verification, and fixes. Future work
includes stronger specialized propagators and an interactive puzzle explorer.
