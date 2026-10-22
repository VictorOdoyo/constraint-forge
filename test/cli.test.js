import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
test('CLI emits parseable solution output', () => {
  const result = run('queens', '4');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).solutions.length, 2);
});
test('CLI reports invalid commands and board sizes', () => {
  for (const args of [['bad'], ['queens', 'NaN'], ['queens', '4', 'extra']]) {
    const result = run(...args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.length);
  }
});
