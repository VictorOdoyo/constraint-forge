import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
test('strategy benchmark validates its own solutions before reporting timing', () => {
  const r = spawnSync(
    process.execPath,
    [fileURLToPath(new URL('../bench/compare.js', import.meta.url)), '1'],
    { encoding: 'utf8' },
  );
  assert.equal(r.status, 0, r.stderr);
  const report = JSON.parse(r.stdout);
  assert.equal(report.results.length, 4);
  assert.ok(report.results.every((r) => r.samples === 1 && r.nodes[0] > 0));
});
