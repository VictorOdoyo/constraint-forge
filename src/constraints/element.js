export function element(model,index,values,result) {
 if(!Array.isArray(values))throw new TypeError('Element values must be an array');
 const array=[...values];
 return model.constrain([index,result],(i,v)=>Number.isInteger(i)&&i>=0&&i<array.length&&array[i]===v,'element');
}