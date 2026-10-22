import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const npm=process.env.npm_execpath;
if(!npm)throw new Error('Run this check with npm run pack:check');
const root=fileURLToPath(new URL('../',import.meta.url));
const temp=mkdtempSync(join(tmpdir(),'constraint-forge-pack-'));
const run=args=>execFileSync(process.execPath,[npm,...args],{cwd:root,encoding:'utf8',stdio:['pipe','pipe','pipe']});
try{
 const [archive]=JSON.parse(run(['pack','--json','--ignore-scripts','--pack-destination',temp]));
 assert.ok(archive.files.some(f=>f.path==='src/worker-entry.js'));
 assert.ok(!archive.files.some(f=>f.path.startsWith('test/')||f.path.startsWith('work/')));
 run(['--prefix',temp,'install',join(temp,archive.filename),'--ignore-scripts','--no-audit','--no-fund','--package-lock=false']);
 const require=createRequire(join(temp,'consumer.cjs'));
 const api=await import(pathToFileURL(require.resolve('@victorodoyo/constraint-forge')).href);
 assert.equal(new api.Solver(api.queens(4)).solve().stats.solutions,2);
 assert.equal((await api.solveAsync(api.queens(4))).stats.solutions,2);
 console.log('Packaged API and worker verified from installed tarball');
}finally{rmSync(temp,{recursive:true,force:true});}
