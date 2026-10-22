import {sudokuUniqueness,parseSudoku} from '../puzzles/sudoku.js';
export function minimizeSudoku(input,{maxChecks=81,timeoutMs=2000}={}) {
 if(!Number.isInteger(maxChecks)||maxChecks<0)throw new RangeError('Invalid removal budget');
 const initial=sudokuUniqueness(input,{timeoutMs});if(initial.uniqueness!=='unique')throw new TypeError('Minimization requires a proven unique puzzle');
 const cells=parseSudoku(input).map(v=>v||'.');let checks=0,unknown=0,exhausted=true;
 for(let i=0;i<81;i++){if(cells[i]==='.')continue;if(checks>=maxChecks){exhausted=false;break;}const old=cells[i];cells[i]='.';checks++;
  const r=sudokuUniqueness(cells.join(''),{timeoutMs});if(r.uniqueness!=='unique'){cells[i]=old;if(r.uniqueness==='unknown')unknown++;}
 }return {puzzle:cells.join(''),checks,unknown,minimal:exhausted&&unknown===0};
}