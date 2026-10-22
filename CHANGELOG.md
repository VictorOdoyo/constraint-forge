# Changelog

## 1.0.0 — 2026-10-22

First complete release of the Constraint Forge research toolkit and puzzle explorer.

- Interactive local Sudoku, N-Queens, and Nonogram workbench with editable inputs,
  seeded generation, hints, undo, solution navigation, trace inspection, and exports.
- Browser workers with live cancellation, fixed operation budgets, bounded traces,
  local persistence, and responsive keyboard-accessible layouts.
- DFA reachability, exact weighted-integer propagation, and compulsory-part resource
  timetables. Nonograms use compact automata instead of enumerated line patterns.
- Structural JSON and Node worker support for the new specialized constraints.
- Twelve-workload release corpus with independent checks, known counts, resource
  budgets, repeated measurements, and a reproducible performance report.
- Packaged API, Node worker, browser assets, local server, examples, and documentation
  are verified from an installed tarball on Windows and Linux CI.

### Compatibility

Existing constructors and search-result contracts remain available. Version-1 JSON
model documents now recognize regular, linearInteger, and cumulative constraints.
Older readers will reject those kinds; regenerate portable files for an older reader
by expressing constraints as allowed tuples where feasible.

Regular automata now reject nonprimitive states or symbols. Resource propagation
uses sound timetable filtering, which can be weaker than generic tuple consistency
but preserves complete solution sets. Integer linear specialization is used only
where Number evaluation is exactly representable; floating relations retain their
prior semantics. No npm registry publication or external hosting is required.
