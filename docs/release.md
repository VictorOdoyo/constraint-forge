# Version 1.0 release scope

This release completes the agreed first repository: an advanced constraint and
puzzle toolkit, an interactive explorer, and reproducible validation. Commit count
is a minimum contribution requirement, not a release criterion or stopping rule.

## Completed product scope

- Finite-domain solver with reversible trails, compiled topology, cached supports,
  global matching, table filtering, exact sum and weighted-linear propagation,
  automaton reachability, resource timetables, and alternative search heuristics.
- Incumbent, lexicographic, Pareto, and safe-integer branch-and-bound optimization;
  portable data models; assignment validation; graph diagnostics and unsat cores.
- Sudoku, N-Queens, and thirteen additional puzzle/model constructors; independent
  exact-cover solving; generation, local deduction explanations, and SVG diagrams.
- Interactive Sudoku, N-Queens, and Nonogram workbench with background solving,
  live cancellation, editable inputs, hints, undo, bounded traces, solution browsing,
  exports, local persistence, and responsive keyboard-accessible layouts.
- Reproducible twelve-workload benchmark corpus and measured performance report.
- Standalone CLI, runnable examples, installed-tarball checks for the API, workers,
  and explorer, and Windows/Linux CI with Node 22 and 24.

## Verification

Run the following from a checkout:

```sh
npm ci
npm run format:check
npm test
npm run bench:validate
npm run examples
npm run pack:check
```

Browser QA exercised all three modes, uniqueness and contradiction results, seeded
generation, hints and application, undo, cancellation, JSON export, and viewport
layouts at mobile and desktop sizes. No console errors were observed. Mobile
testing found and fixed a cell-padding conflict that clipped digits. The saved
explorer preview is in docs/images/explorer.png. Browser interaction was manually
verified through the connected browser; CI exercises the shared job adapter and
server, not a headless end-to-end browser runner.

## Explicit boundaries

The toolkit is a local research/education application, not a distributed service
or industrial CP-SAT replacement. Predicates must be pure. Some generic high-arity
constraints and exact reachability sets remain exponential. Matching is implemented
with augmenting paths rather than Regin filtering. Human difficulty has no empirical
calibration; trace events are diagnostics rather than formal proof certificates.
There are no accounts, remote storage, telemetry, or hosted-service requirements.
Version 1.0 completes the scope above; future capabilities are optional enhancements.
