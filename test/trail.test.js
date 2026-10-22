import test from 'node:test';
import assert from 'node:assert/strict';
import { Trail } from '../src/trail.js';
test('nested restoration preserves original domain references', () => {
 const original=[1,2,3], domains=new Map([['x',original]]), t=new Trail(domains);
 const root=t.mark(); t.set('x',[1,2]); const inner=t.mark(); t.set('x',[1]);
 t.undo(inner); assert.deepEqual(domains.get('x'),[1,2]); t.undo(root);
 assert.equal(domains.get('x'),original); assert.equal(t.changes.length,0);
 assert.throws(()=>t.undo(-1),RangeError);
});