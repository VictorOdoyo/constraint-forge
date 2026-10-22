import {parseSudoku} from './puzzles/sudoku.js';import {exactCover} from './exactCover.js';
export function sudokuExactCover(input,options={}) {
 const givens=parseSudoku(input),rows=[],placements=[];
 for(let r=0;r<9;r++)for(let c=0;c<9;c++)for(let n=0;n<9;n++){
  if(givens[r*9+c]&&givens[r*9+c]!==n+1)continue;
  rows.push([r*9+c,81+r*9+n,162+c*9+n,243+(Math.floor(r/3)*3+Math.floor(c/3))*9+n]);placements.push([r,c,n+1]);
 }
 const result=exactCover(Array.from({length:324},(_,i)=>i),rows,options);
 return {...result,solutions:result.solutions.map(indices=>{const cells=Array(81);for(const i of indices){const [r,c,n]=placements[i];cells[r*9+c]=n;}return cells.join('');})};
}