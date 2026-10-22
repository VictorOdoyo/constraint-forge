# Constraint Forge

A dependency-free constraint programming toolkit for solving, generating, and
studying puzzles. Requires Node.js 22 or later.

## Run

```sh
git clone https://github.com/VictorOdoyo/constraint-forge.git
cd constraint-forge
npm test
node src/cli.js queens 8
node src/cli.js sudoku 530070000600195000098000060800060003400803001700020006060000280000419005000080079
node src/cli.js generate 42 32
npm run bench
```

No dependency installation is required. CLI output is JSON. Exit code 1 means
invalid input; 2 means an interrupted solve. Queens enumeration has a 1,000
solution cap and a ten-second time budget. Sudoku solving has a ten-second budget.

## Model your own problem

```js
import { Model, Solver } from './src/index.js';

const model = new Model()
  .variable('alice', [1, 2, 3])
  .variable('bob', [1, 2, 3])
  .constrain(['alice', 'bob'], (a, b) => a < b, 'ordering');

const result = new Solver(model).solve({ limit: 10, maxNodes: 10000 });
console.log(result.solutions);
```

## Implemented

- Finite domains with validated primitive values and arbitrary predicate constraints.
- Generalized arc consistency with incident-constraint work queues.
- Minimum remaining values search with degree tie-breaking and isolated branches.
- Node/time budgets, AbortSignal checks, and search statistics.
- N-Queens enumeration, Sudoku solving and uniqueness classification.
- Seeded Sudoku generation that retains removals only after proving uniqueness.
- Independent brute-force oracle checks on 100 reproducible networks.
- Windows/Linux CI on Node 22 and 24, plus instrumented benchmark runs.

## Interpretation and limits

`complete` means the entire search was exhausted; `limit` means the requested
solution cap was reached; `interrupted` means a budget or abort stopped search.
Only exhausted search with exactly one solution proves uniqueness. Sudoku's
`unknown` result preserves this distinction.

General predicates require tuple enumeration during propagation, which can grow
exponentially with constraint arity. `allDifferent` currently expands to binary
inequalities; it does not implement matching-based global propagation. Search
copies domain maps rather than using a reversible trail. Solutions are collected
in memory, so callers should use limits for large enumeration tasks.

Timeouts are cooperative. The solver runs synchronously: a same-thread timer
cannot deliver an AbortSignal while search occupies the event loop. Predicates
must be pure and terminating; a slow predicate can exceed the budget before the
next checkpoint. Generation's timeout applies per uniqueness check. A difficult
target clue count is best effort, and timeout decisions can affect reproducibility
across machines. Generated grids are transformations of a canonical grid, not
uniform samples of all Sudoku solutions.

## Development roadmap

The first milestone is a working research foundation. The repository's target is
at least 100 substantive commits, developed through actual features, fixes, tests,
and documented engineering decisions. That target is not yet complete.

Next: reversible trails, specialized propagators, proof traces, richer puzzle
families, strategy comparisons, difficulty calibration, and an interactive explorer.

See [architecture](docs/architecture.md) for algorithm details and extension points.

MIT licensed.
