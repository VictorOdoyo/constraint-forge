import {runJob} from './jobs.js';
self.onmessage=({data})=>{
  try { self.postMessage({type:'result',data:runJob(data,progress=>self.postMessage({type:'progress',...progress}))}); }
  catch(error){self.postMessage({type:'error',message:error.message});}
};
