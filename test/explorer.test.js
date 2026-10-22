import test from 'node:test';import assert from 'node:assert/strict';
import {createExplorerServer} from '../src/explorer-server.js';
import {runJob,parseClues,REFERENCE} from '../web/jobs.js';
test('browser job adapter handles all three families and preserves proof status',()=>{
 const sudoku=runJob({mode:'sudoku',input:{puzzle:REFERENCE}});assert.equal(sudoku.result.uniqueness,'unique');assert.ok(sudoku.trace.length);
 const queens=runJob({mode:'queens',input:{size:4,limit:1}});assert.equal(queens.result.status,'limit');assert.equal(queens.result.stats.solutions,1);
 const nonogram=runJob({mode:'nonogram',input:{rowClues:'1\n3\n1',columnClues:'1\n3\n1'}});assert.equal(nonogram.result.stats.solutions,1);
 assert.ok(runJob({mode:'sudoku',operation:'hint',input:{puzzle:REFERENCE}}).moves.length);
 assert.deepEqual(parseClues('0\n1 2'),[[],[1,2]]);assert.throws(()=>parseClues('1 x'),TypeError);
});
test('browser trace retention stays bounded during deeper enumeration',()=>{
 const r=runJob({mode:'queens',input:{size:9,limit:1000}});assert.equal(r.result.stats.solutions,352);assert.ok(r.trace.length<=2000);assert.ok(r.traceTotal>r.trace.length);
});
test('explorer server serves module assets without exposing repository metadata',async(t)=>{
 const server=createExplorerServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}`;
 for(const route of ['/','/web/app.js','/web/worker.js','/src/solver.js']){const r=await fetch(base+route);assert.equal(r.status,200,route);assert.ok(r.headers.get('content-security-policy').includes("worker-src 'self'"));}
 for(const route of ['/.git/config','/package.json','/web/missing.js','/web/%2e%2e/%2e%2e/package.json'])assert.notEqual((await fetch(base+route)).status,200);
 assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 assert.equal(await (await fetch(base+'/',{method:'HEAD'})).text(),'');
});
