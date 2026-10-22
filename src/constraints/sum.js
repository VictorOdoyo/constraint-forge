export function sum(model,scope,target) {
 if (!Number.isSafeInteger(target)||scope.some(k=>!model.domains.has(k)||model.domains.get(k).some(v=>!Number.isSafeInteger(v)))) throw new TypeError('Sum requires safe integer domains and target');
 model.constrain(scope,(...v)=>v.reduce((a,b)=>a+BigInt(b),0n)===BigInt(target),'sum');
 Object.assign(model.constraints.at(-1),{kind:'sum',target}); return model;
}