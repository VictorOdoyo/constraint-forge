# Architecture and correctness boundaries

## Reversible search

Each solve snapshots model domains and constraint scopes. Branches restrict a
single variable, then restore every changed domain through a reversible trail
in a finally block. Domain arrays are replaced rather than mutated. Compiled
incidence lists and topology persist through a search; domain state does not
leak back into the original model or across repeated solves.

MRV selects the smallest nonsingleton domain, breaking ties by degree.
dom-wdeg divides domain size by accumulated incident failure weights. LCV scores
binary constraints by rejected neighbor values. These influence search order,
not the set of complete solutions. Diagnostics expose decisions, failures, and
solution discovery; these events are not a formal proof format.

## Propagation

Incident constraints are requeued when domains shrink. Generic predicates use
support-tuple enumeration with residues: cached tuples are reused only when all
values still occur in current domains. Predicates must be pure. Caches do not
depend on branch history and remain safe when the trail restores a domain.

Dedicated table propagation scans allowed rows. Exact integer sums compute
reachable partial totals using BigInt to avoid precision loss. Global allDifferent
tests injective variable/value matchings while fixing each candidate value. This
achieves domain consistency using repeated augmenting paths; it is not Regin's
more efficient SCC-based filtering algorithm. Sum reachability may still grow
exponentially when partial sums do not merge. Exactly representable integer
weighted equalities reuse reachability with BigInt terms; inequalities use
separable bounds. Floating relations retain the generic predicate semantics.

Regular automata propagate supports by following reachable states in a layered
graph, rather than enumerating whole words. Nonogram rows and columns compile to
compact automata with mandatory separators and optional zero runs. Their JSON
representation and worker transfer preserve this structure. Cumulative resource
constraints use compulsory intervals [latest start, earliest finish), adding the
fixed candidate's full interval. Overload pruning is sound but weaker than full
GAC; at singleton leaves the profile exactly checks the assignment.

Linear branch and bound maintains a strictly decreasing incumbent cutoff. Its
dedicated propagator computes separable lower bounds under a fixed candidate.
This is bound-based pruning, not generalized arc consistency with other model
constraints. The safe-integer magnitude guard keeps cutoff arithmetic exact.

## Alternative algorithms and verification

Algorithm X branches on the smallest active exact-cover column and removes
conflicting rows. Sudoku's exact-cover and constraint encodings are independent.
The suite compares their solutions, checks known N-Queens/Latin/magic-square
counts, compares 100 seeded networks to Cartesian brute force, and compares
global matching to binary decomposition over mixed-type values. Additional
tests cover trail restoration, numeric overflow, cancellation, and CLI contracts.

Heuristic min-fill reports an upper bound on treewidth. Component decomposition
can reduce search but materializes the Cartesian product of component solutions.
Unsatisfiable-core extraction removes one constraint at a time, preserving a
contradiction only after proving exhaustion. Unknown deletion checks prevent a
claim of subset minimality. An empty core can correctly indicate an empty domain.

## Concurrency

The synchronous engine checks cooperative deadlines and signals during support
search. A same-thread timer cannot interrupt a blocked event loop. Worker search
uses code-free serialization, independent engine state, and main-thread worker
termination for wall deadlines and live aborts. Serialization itself remains
synchronous and has a tuple budget. Batch failure aborts sibling workers.

## Scope and practical limits

General predicates and broad integer-equality reachability sets can be exponential.
Timetable resource filtering is incomplete and relies on search to resolve remaining
choices. Specialized models are demonstrations of constraint
modeling, not substitutes for industrial CP-SAT or mixed-integer solvers. Domain
inspection structures are publicly mutable; callers must treat them as immutable
during search. Optimization callbacks and predicates must not mutate objectives.

Generated Sudoku grids are symmetry transforms of a canonical grid, not uniform
samples of all completed grids. Per-check deadlines can change generated output
across machines. Human deduction helpers explain local rules; the reported
difficulty profile has no empirical calibration. SVG rendering is deterministic;
the separate browser explorer adds interactive editing and search inspection.
These are intentional boundaries for this release.
