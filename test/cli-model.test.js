import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Model, serialize } from '../src/index.js';
test('CLI solves a data-only JSON model', () => {
  const dir = mkdtempSync(join(tmpdir(), 'forge-'));
  try {
    const path = join(dir, 'model.json');
    writeFileSync(path, JSON.stringify(serialize(new Model().variable('x', [1, 2]))));
    const r = spawnSync(
      process.execPath,
      [fileURLToPath(new URL('../src/cli.js', import.meta.url)), 'solve-model', path],
      { encoding: 'utf8' },
    );
    assert.equal(r.status, 0, r.stderr);
    assert.equal(JSON.parse(r.stdout).stats.solutions, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
