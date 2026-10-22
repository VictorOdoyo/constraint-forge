export function hamming(model,left,right,min,max=left.length) {
 if(left.length!==right.length||!Number.isInteger(min)||!Number.isInteger(max)||min<0||max<min)throw new RangeError('Invalid Hamming distance specification');
 const scope=[...new Set([...left,...right])],indices=new Map(scope.map((k,i)=>[k,i]));
 return model.constrain(scope,(...v)=>{const n=left.filter((k,i)=>v[indices.get(k)]!==v[indices.get(right[i])]).length;return n>=min&&n<=max;},'hamming');
}