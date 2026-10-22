import { Solver, queens } from '../src/index.js';
const samples = Number(process.argv[2] || 3);
if (!Number.isInteger(samples) || samples < 1 || samples > 30)
  throw new RangeError('Samples must be 1..30');
const report = [];
for (const variableOrder of ['mrv', 'dom-wdeg'])
  for (const valueOrder of ['input', 'lcv']) {
    const runs = [];
    for (let i = 0; i < samples; i++) {
      const r = new Solver(queens(8)).solve({ variableOrder, valueOrder });
      if (r.status !== 'complete' || r.stats.solutions !== 92)
        throw new Error('Benchmark correctness failure');
      runs.push(r.stats);
    }
    const sorted = runs.map((r) => r.elapsedMs).sort((a, b) => a - b);
    report.push({
      variableOrder,
      valueOrder,
      samples,
      medianMs: sorted[Math.floor(samples / 2)],
      minMs: sorted[0],
      maxMs: sorted.at(-1),
      nodes: runs.map((r) => r.nodes),
      checks: runs.map((r) => r.checks),
    });
  }
console.log(
  JSON.stringify({ node: process.version, platform: process.platform, results: report }, null, 2),
);
