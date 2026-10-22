export function inverse(model,left,right) {
 if(left.length!==right.length||!left.length)throw new TypeError('Inverse arrays must have equal positive length');
 const scope=[...left,...right],n=left.length;
 return model.constrain(scope,(...v)=>v.slice(0,n).every((x,i)=>Number.isInteger(x)&&x>=0&&x<n&&v[n+x]===i)&&v.slice(n).every(x=>Number.isInteger(x)&&x>=0&&x<n),'inverse');
}