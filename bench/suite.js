import {cpus} from 'node:os';
import {corpus,runCase} from './corpus.js';
export function runSuite({samples=3,warmup=1}={}){
 if(!Number.isInteger(samples)||samples<1||samples>30||!Number.isInteger(warmup)||warmup<0||warmup>5)throw new RangeError('Invalid benchmark repetition count');
 const results=[];
 for(const entry of corpus()){
  for(let i=0;i<warmup;i++)runCase(entry);
  const runs=[];for(let i=0;i<samples;i++){const before=process.memoryUsage().heapUsed,stats=runCase(entry);runs.push({...stats,heapDeltaBytes:process.memoryUsage().heapUsed-before});}
  const times=runs.map(r=>r.elapsedMs).sort((a,b)=>a-b),pick=q=>times[Math.min(times.length-1,Math.ceil(q*times.length)-1)];
  results.push({name:entry.name,expectedSolutions:entry.count,samples,medianMs:pick(.5),p95Ms:pick(.95),minMs:times[0],maxMs:times.at(-1),runs});
 }
 return {schemaVersion:1,environment:{node:process.version,platform:process.platform,arch:process.arch,cpu:cpus()[0]?.model},samples,warmup,results};
}
