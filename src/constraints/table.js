export function table(model, scope, tuples) {
 if (!Array.isArray(tuples) || tuples.some(t=>!Array.isArray(t)||t.length!==scope.length)) throw new TypeError('Tuple arity mismatch');
 const rows=tuples.map(t=>[...t]);
 model.constrain(scope,(...values)=>rows.some(t=>t.every((v,i)=>v===values[i])),'table');
 Object.assign(model.constraints.at(-1),{kind:'table',tuples:rows}); return model;
}