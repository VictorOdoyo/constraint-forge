import {parseSudoku} from './puzzles/sudoku.js';
export function renderSudokuSvg(input,{cellSize=48}={}) {
 if(!Number.isFinite(cellSize)||cellSize<16||cellSize>256)throw new RangeError('Cell size must be 16..256');
 const cells=parseSudoku(input),size=cellSize*9,parts=[];
 for(let i=0;i<=9;i++){const at=i*cellSize;parts.push('<path d="M '+at+' 0 V '+size+' M 0 '+at+' H '+size+'" stroke="#334155" stroke-width="'+(i%3===0?3:1)+'"/>');}
 cells.forEach((v,i)=>{if(v)parts.push('<text x="'+((i%9+.5)*cellSize)+'" y="'+((Math.floor(i/9)+.5)*cellSize)+'" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-size="'+cellSize*.6+'" fill="#0f172a">'+v+'</text>');});
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sudoku puzzle" viewBox="-2 -2 '+(size+4)+' '+(size+4)+'"><rect x="-2" y="-2" width="'+(size+4)+'" height="'+(size+4)+'" fill="white"/>'+parts.join('')+'</svg>';
}
export function renderQueensSvg(rows,{cellSize=48}={}) {
 if(!Array.isArray(rows)||rows.length<1||rows.length>30||rows.some(v=>!Number.isInteger(v)||v<0||v>=rows.length)||!Number.isFinite(cellSize)||cellSize<16||cellSize>256)throw new TypeError('Invalid board dimensions');
 const n=rows.length,parts=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)parts.push('<rect x="'+c*cellSize+'" y="'+r*cellSize+'" width="'+cellSize+'" height="'+cellSize+'" fill="'+((r+c)%2?'#94a3b8':'#f1f5f9')+'"/>');
 rows.forEach((r,c)=>parts.push('<circle cx="'+(c+.5)*cellSize+'" cy="'+(r+.5)*cellSize+'" r="'+cellSize*.3+'" fill="#7c3aed"/>'));
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Queens placement" viewBox="0 0 '+n*cellSize+' '+n*cellSize+'">'+parts.join('')+'</svg>';
}
