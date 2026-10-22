# API reference

Import public functions from `./src/index.js` in a checkout, or
`@victorodoyo/constraint-forge` when the package is installed locally.

## Models and search

`new Model().variable(name, iterable).constrain(scope, predicate, label)`
creates a finite-domain model. Names are unique nonempty strings; values are
finite numbers, strings, or booleans. Predicates must be pure and terminating.
The Model exposes domains and constraints for inspection; do not mutate them
during a solve. Empty domains represent contradictions.

`model.allDifferent(scope, { global: true })` enables matching-based global
propagation. Omitting global uses binary inequalities. Both have identical
solution semantics, but the global version can prune Hall-set values.

`new Solver(model).solve(options)` accepts:

| Option        | Default   | Meaning                                                   |
| ------------- | --------- | --------------------------------------------------------- |
| limit         | Infinity  | Maximum number of solutions encountered                   |
| maxNodes      | Infinity  | Search-node budget                                        |
| timeoutMs     | Infinity  | Cooperative elapsed-time budget                           |
| signal        | undefined | AbortSignal checked during search                         |
| collect       | true      | Retain assignments; false supports count-only enumeration |
| onSolution    | undefined | Callback receiving an isolated assignment                 |
| onTrace       | undefined | Callback receiving immutable search events                |
| variableOrder | mrv       | mrv or dom-wdeg                                           |
| valueOrder    | input     | input or lcv; LCV scores binary predicates                |

Results contain status, solutions, stats, and an interruption reason when needed.
Status complete proves exhaustion; limit is conservative even if the last
encountered solution happens to be the final one. Interrupted search never proves
infeasibility or uniqueness. stats.solutions counts discoveries even with
collect:false. Checks count support work, whose cost differs by propagator;
they are not directly comparable CPU-operation counts. cacheHits counts reused
predicate supports when present. Trace events are diagnostics, not proof certificates.

## Constraint builders

Every builder takes a model as its first argument and returns that model.
Scopes contain distinct, previously declared variable names.

| Builder     | Remaining arguments                          | Semantics                                                 |
| ----------- | -------------------------------------------- | --------------------------------------------------------- |
| table       | scope, tuples                                | Assignment belongs to an explicit relation                |
| sum         | scope, target                                | Exact safe-integer inputs, BigInt intermediate arithmetic |
| product     | scope, target                                | Exact integer product using BigInt                        |
| linear      | scope, coefficients, eq/le/ge, rhs           | Numeric weighted relation using JS Number                 |
| cardinality | scope, Map(value,count)                      | Exact occurrences; object form supports string values     |
| countValue  | scope, value, countVariable                  | Variable occurrence count                                 |
| among       | scope, values, min, max=min                  | Bounds membership count                                   |
| element     | indexVariable, constantArray, resultVariable | Zero-based lookup                                         |
| regular     | scope, {start,accept,transitions}            | Deterministic automaton; edges are [from,symbol,to]       |
| reify       | scope, flag, predicate                       | flag in {0,1} iff predicate holds                         |
| implies     | flag, scope, predicate                       | Enabled Boolean guard implies predicate                   |
| nogood      | partialAssignment                            | Exclude one partial assignment                            |
| lexLess     | left, right, {strict=true}                   | Lexicographic vector comparison                           |
| increasing  | scope, {strict=true}                         | Monotone sequence                                         |
| modulo      | variable, divisor, remainder                 | Euclidean residue                                         |
| absolute    | left, right, distance                        | Absolute numeric difference                               |
| inverse     | left, right                                  | Inverse zero-based permutations                           |
| circuit     | successors                                   | One Hamiltonian cycle through all indices                 |
| hamming     | left, right, min, max                        | Distance bounds                                           |
| precedence  | before, after, {duration=0,lag=0}            | Timed ordering                                            |
| noOverlap   | starts, durations                            | Half-open disjoint intervals; zero duration is empty      |
| cumulative  | starts, durations, demands, capacity         | Renewable resource capacity                               |

Table, sum, global allDifferent, regular automata, exactly representable integer
linear relations, and cumulative resource constraints have dedicated propagators.
DFA support uses layered state reachability. Integer equality uses BigInt partial
totals; inequalities use separable extrema. Cumulative uses compulsory-part
timetables: filtering is sound, but can be weaker than generic arc consistency.
All other builders use generic tuple support and are intended for moderate scopes.
Noninteger linear relations retain exact JS comparison without a floating tolerance.
Do not use them as an arbitrary-precision real arithmetic solver.

## Optimization and diagnostics

- optimize(model, objective, {direction:'min'|'max', ...searchOptions}) tracks an
  incumbent by exhaustive enumeration.
- lexOptimize(model, objectiveFunctions, options) minimizes an ordered tuple.
- pareto(model, objectiveFunctions, options) retains one representative per
  nondominated score vector; all objectives are minimized.
- minimizeLinear(model, weightObject, options) uses branch and bound and a
  separable objective lower-bound propagator. Domains and coefficients must be
  safe integers; the worst-case absolute objective must remain exactly representable.
- validate(model, assignment) independently reports missing variables, values
  outside domains, unknown variables, and violated predicates.
- inspect(model) reports primal-graph structure, exact Cartesian search space,
  components, and a greedy min-fill width upper bound.
- unsatCore(model, options) returns a subset-minimal core only when all deletion
  checks finish. A subset-minimal core need not have minimum cardinality.
- solveDecomposed(model, options) exhaustively solves components and eagerly
  combines their Cartesian product; budgets apply per component.

Optimization's optimal/complete flags require exhaustion, including when a
solution cap or budget was supplied. No feasible assignment is represented by
an undefined best incumbent or an empty Pareto frontier. Pareto mode owns the
internal onSolution callback and does not forward an external callback.

## Portability and workers

serialize(model, {maxTuples:100000}) produces a version-1 data-only document.
Global allDifferent, sum, table, regular, linearInteger, and cumulative constraints
stay structural. Other predicates are materialized as tables under a total
tuple-evaluation budget. deserialize(data)
rejects unknown kinds and invalid model structure. This format contains no code.

solveAsync(model, {signal,wallTimeoutMs,...searchOptions}) serializes synchronously,
then solves on a worker. A wall timeout or live abort rejects the promise and
terminates the worker; partial worker results are discarded. Wall timeout starts
after serialization. Callbacks cannot cross the worker boundary. solveBatch(models,
{concurrency:2,...options}) limits simultaneous workers and preserves input order.

## Puzzle constructors

All return Models: queens(size); sudoku(text); coloring(vertices,edges,colors);
latin(size,givens); magic(size); futoshiki(size,{givens,lessThan}); kenken(size,cages);
kakuro(cells,runs); skyscrapers(size,{top,bottom,left,right,givens});
minesweeper(cells,clues); crossword(slots,crossings,{distinct});
nonogram(rowClues,columnClues); alphametic(addends,result);
packing(weights,capacities); scheduling(jobs,{horizon,precedences}).

Latin-family cells use 'row,column' names with zero-based coordinates. Sudoku
uses r0c0 through r8c8. Alphametics accept uppercase words and use decimal digits
with column carry variables. Nonogram cells are binary. See puzzle tests for
complete small input fixtures and independently checked solution counts.

Sudoku utilities: parseSudoku, formatSudoku, sudokuUniqueness, generateSudoku,
sudokuCandidates, singles, nakedPairs, lockedCandidates, difficulty,
transformSudoku, minimizeSudoku. Candidate maps use zero-based row-major indices.
Pair and locked-candidate functions take a candidate Map and return a new Map
plus witnessed removals. difficulty reports transparent effort metrics, not a
calibrated human rating. Minimization distinguishes a budgeted result from a
proven irreducible clue set. Generation reports actualClues and unknownChecks.

exactCover(columns,rows,options) implements Algorithm X and returns row-index
solutions. sudokuExactCover(text,options) uses an independent 324-column Sudoku
encoding. Both distinguish complete, limit, and interrupted search; their budgets
are node based. renderSudokuSvg(text) and renderQueensSvg(rows) produce standalone
SVG strings without browser or image dependencies.

## CLI

Run node src/cli.js --help. Commands: queens, sudoku, generate, sudoku-exact,
hints, difficulty, solve-model, solve-async, inspect, core. JSON model commands
read a version-1 model document from the named file. All results are JSON.
Exit 1 indicates invalid input, worker rejection, or a processing error. Exit 2
indicates an interrupted solve result. An unsatisfiable result is valid output
and exits successfully. Worker wall timeouts reject and therefore exit 1.

## Browser explorer

Run `npm run explore` for a localhost-only server on port 4173. `npm run explore -- 0`
selects an available port. The packaged server exposes browser assets and solver
modules only, rejects write methods, and sets a self-only content security policy.
The browser imports browser-safe source modules directly rather than the Node
package barrel, which also exposes Node worker APIs.

The workbench supports Sudoku, Queens boards of size 1–12, and Nonograms up to
30 by 30. Each solve has a 250,000-node and ten-second cooperative budget, plus
a fifteen-second main-thread worker deadline. Queens solution caps are 1–2,000;
Sudoku and Nonogram use two solutions for multiplicity detection. Traces retain
the first 2,000 events and report the full event count. Trace depth charts and
decisions are diagnostics; complete status is the proof of exhaustion.

Sudoku generation accepts a uint32 seed and 17–81 target clues; a lower clue
count is best effort. Each uniqueness check has a 500 ms deadline, and the
whole browser job can be terminated at fifteen seconds. A result is displayed
only after the job succeeds. Stop discards partial worker results. Workspace
inputs persist in browser localStorage when available. Exports are local file
downloads. There are no accounts, analytics requests, or cloud puzzle storage.
