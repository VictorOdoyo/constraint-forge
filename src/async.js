import { Worker } from 'node:worker_threads';
import { serialize } from './serialize.js';
export function solveAsync(model,{signal,wallTimeoutMs=Infinity,...options}={}) {
 if(!(wallTimeoutMs===Infinity||Number.isFinite(wallTimeoutMs)&&wallTimeoutMs>=0))return Promise.reject(new RangeError('Invalid wall timeout'));
 if(options.onTrace||options.onSolution)return Promise.reject(new TypeError('Worker callbacks are not transferable'));
 if(signal?.aborted)return Promise.reject(new Error('Search aborted'));
 const data=serialize(model);
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./worker-entry.js',import.meta.url),{workerData:{model:data,options}});
  let done=false,timer;
  const finish=(error,result)=>{if(done)return;done=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);void worker.terminate();error?reject(error):resolve(result);};
  const abort=()=>finish(new Error('Search aborted'));
  signal?.addEventListener('abort',abort,{once:true});
  if(Number.isFinite(wallTimeoutMs))timer=setTimeout(()=>finish(new Error('Wall time budget exhausted')),wallTimeoutMs);
  worker.on('message',m=>finish(m.error?Object.assign(new Error(m.error.message),{name:m.error.name}):null,m.result));
  worker.on('error',e=>finish(e));
  worker.on('exit',code=>{if(!done)finish(new Error('Worker exited before returning: '+code));});
 });
}
