export function circuit(model,successors) {
 const n=successors.length;if(!n)throw new TypeError('Circuit requires vertices');
 return model.constrain(successors,(...next)=>{
  if(next.some(v=>!Number.isInteger(v)||v<0||v>=n))return false;
  const seen=new Set();let at=0;while(!seen.has(at)){seen.add(at);at=next[at];}
  return at===0&&seen.size===n;
 },'circuit');
}