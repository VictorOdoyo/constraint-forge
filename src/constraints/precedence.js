export function precedence(model,before,after,{duration=0,lag=0}={}) {
 if(!Number.isFinite(duration)||duration<0||!Number.isFinite(lag))throw new RangeError('Invalid precedence timing');
 return model.constrain([before,after],(a,b)=>a+duration+lag<=b,'precedence');
}