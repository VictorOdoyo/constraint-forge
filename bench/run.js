import os from 'node:os';
import { Solver, queens, sudoku } from '../src/index.js';

const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const cases = [
  ['queens-8-enumerate', () => queens(8)],
  ['sudoku-reference', () => sudoku(puzzle)],
];
const report = {
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  cpu: os.cpus()[0]?.model,
  cases: [],
};
for (const [name, model] of cases) {
  const result = new Solver(model()).solve({ timeoutMs: 30000 });
  report.cases.push({ name, status: result.status, ...result.stats });
  if (result.status !== 'complete') process.exitCode = 1;
}
console.log(JSON.stringify(report, null, 2));
