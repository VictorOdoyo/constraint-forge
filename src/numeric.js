export function requireNumeric(model,scope) {
 if(scope.some(k=>!model.domains.has(k)||model.domains.get(k).some(v=>typeof v!=='number'||!Number.isFinite(v))))throw new TypeError('Numeric constraints require finite numeric domains');
}
