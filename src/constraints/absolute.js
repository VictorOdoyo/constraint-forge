import {requireNumeric} from '../numeric.js';
export function absolute(model,left,right,distance) {
 requireNumeric(model,[left,right]);
 if(!Number.isFinite(distance)||distance<0)throw new RangeError('Distance must be nonnegative');
 return model.constrain([left,right],(a,b)=>Math.abs(a-b)===distance,'absolute-distance');
}