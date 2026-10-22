# Performance validation

`npm run bench:validate` runs a correctness-gated twelve-workload corpus. CI runs
it on Windows and Linux with Node 22 and 24. A result must exhaust its search,
match its expected count, satisfy an independent assignment validator, and remain
within a generous node budget. Two Sudoku fixtures are additionally checked by
the independent Algorithm X encoding. Wall budgets prevent runaway cases, but
timing is not used as a brittle CI pass/fail threshold.

`npm run bench:report -- docs/performance.json` performs one warmup and three
measured repetitions of each case. The checked-in [raw report](performance.json)
records Node version, platform, CPU, individual timings, node/check/pruning counts,
and observed heap deltas. It was produced on Node 24.19.0 on Windows x64 using
an Intel Core i7-8650U. These are local observations, not universal guarantees.

| Workload | Exhaustive solutions | Observed median solver time |
| --- | ---: | ---: |
| Queens 8 | 92 | 84 ms |
| Queens 9 | 352 | 322 ms |
| Reference Sudoku | 1 | 5 ms |
| Sparse Sudoku | 1 | 231 ms |
| Order-4 Latin squares | 576 | 76 ms |
| Order-3 magic squares | 8 | 41 ms |
| SEND + MORE = MONEY | 1 | 24 ms |
| Full 10×10 Nonogram | 1 | 3 ms |
| 32-variable weighted equality | 1 | 6 ms |
| 64-variable automaton | 1 | 5 ms |
| Resource permutations | 120 | 10 ms |
| Pigeonhole contradiction | 0 | <1 ms |

With only three repetitions, the reported p95 is the largest observation, not a
statistically reliable tail estimate. Heap deltas include garbage collection and
are diagnostic; negative deltas are valid. Solver elapsed time excludes model
construction and independent verification. Checks count different support work
across propagators and should not be treated as CPU instructions.

`node bench/compare.js 5` compares MRV and dom-wdeg with input and LCV ordering.
`npm run bench` retains the smaller original smoke benchmark. Specialized support
has differential tests against generic enumeration; the large weighted and
automaton cases demonstrate bounded support work where Cartesian enumeration
would be impractical. The corpus is deliberately varied but finite; it is not a
claim of industrial-solver performance on every constraint problem.
