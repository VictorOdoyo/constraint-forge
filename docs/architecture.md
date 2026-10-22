# Solver architecture

The Model stores named domains and ordered constraint scopes. Predicates receive
values in scope order. Inputs support finite numbers, strings, and booleans;
objects and nonfinite numbers are rejected to keep equality predictable.

Each solve snapshots domains and constraints. Propagation revises every value
against supporting tuples in each incident constraint. Removing a value queues
all incident constraints again. This reaches a fixed point or detects a domain
wipeout. Generalized arc consistency is sound but incomplete: surviving values
may still participate in no full solution.

Search selects the smallest nonsingleton domain and breaks ties by constraint
degree. Each branch restricts one variable and propagates again. Domain arrays
are replaced, never mutated in place, allowing shallow Map copies between
branches. A fully singleton state has support for each constraint and is a
solution. Disjoint value branches ensure enumeration does not duplicate states.

The solver records visited nodes, predicate checks, pruned values, failed nodes,
maximum depth, solution count, and elapsed wall time. A failure counts a node
whose propagation contradicts a constraint, not every unsuccessful value check.

## Verification strategy

Known N-Queens counts check exhaustive search through size eight. A Sudoku fixture
checks both its expected solution and an exhaustive uniqueness proof. Random
binary networks are checked against independent Cartesian-product enumeration;
these catch propagation mistakes that individual examples can miss. Budget tests
check that incomplete results are never reported as exhausted search.

## Extension points

Specialized propagators can replace tuple enumeration while preserving its support
contract. A reversible domain trail can reduce branch allocation. Future global
all-different propagation should include Hall-set counterexamples and differential
checks against the current binary decomposition. Worker execution is needed for
responsive browser interfaces and timer-driven cancellation.
