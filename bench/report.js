import { writeFileSync } from 'node:fs';
import { runSuite } from './suite.js';
const report = runSuite();
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
else console.log(JSON.stringify(report, null, 2));
