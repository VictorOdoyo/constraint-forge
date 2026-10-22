import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
test('CLI exposes independent solving and human-style Sudoku hints', () => {
  const puzzle =
    '.34678912672195348198342567859761423426853791713924856961537284287419635345286179';
  for (const command of ['sudoku-exact', 'hints', 'difficulty']) {
    const r = spawnSync(
      process.execPath,
      [fileURLToPath(new URL('../src/cli.js', import.meta.url)), command, puzzle],
      { encoding: 'utf8' },
    );
    assert.equal(r.status, 0, r.stderr);
    assert.ok(JSON.parse(r.stdout));
  }
});
