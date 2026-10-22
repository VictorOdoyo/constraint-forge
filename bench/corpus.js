import {Model,Solver,queens,sudoku,latin,magic,alphametic,nonogram,linear,regular,cumulative,validate,sudokuExactCover} from '../src/index.js';

export const reference='530070000600195000098000060800060003400803001700020006060000280000419005000080079';
export const sparse='100007090030020008009600500005300900010080002600004000300000010040000007007000300';
const binaryModel=(length)=>{const m=new Model(),keys=Array.from({length},(_,i)=>'x'+i);keys.forEach(k=>m.variable(k,[0,1]));return {m,keys};};
export function corpus(){return [
 {name:'queens-8',build:()=>queens(8),count:92,maxNodes:10000},
 {name:'queens-9',build:()=>queens(9),count:352,maxNodes:50000},
 {name:'sudoku-reference',build:()=>sudoku(reference),count:1,maxNodes:10000,independent:r=>sudokuExactCover(reference).solutions.length===r.stats.solutions},
 {name:'sudoku-sparse',build:()=>sudoku(sparse),count:1,maxNodes:50000,independent:r=>sudokuExactCover(sparse).solutions.length===r.stats.solutions},
 {name:'latin-4',build:()=>latin(4),count:576,maxNodes:10000},
 {name:'magic-3',build:()=>magic(3),count:8,maxNodes:5000},
 {name:'alphametic-send-more',build:()=>alphametic(['SEND','MORE'],'MONEY'),count:1,maxNodes:10000},
 {name:'nonogram-10-full',build:()=>nonogram(Array.from({length:10},()=>[10]),Array.from({length:10},()=>[10])),count:1,maxNodes:1},
 {name:'linear-32',build:()=>{const {m,keys}=binaryModel(32);linear(m,keys,keys.map(()=>3),'eq',0);return m;},count:1,maxNodes:1},
 {name:'automaton-64',build:()=>{const {m,keys}=binaryModel(64);regular(m,keys,{start:0,accept:[0],transitions:[[0,0,0]]});return m;},count:1,maxNodes:1},
 {name:'resource-permutations',build:()=>{const m=new Model(),keys=Array.from({length:5},(_,i)=>'j'+i);keys.forEach(k=>m.variable(k,[0,1,2,3,4]));cumulative(m,keys,keys.map(()=>1),keys.map(()=>2),3);return m;},count:120,maxNodes:5000},
 {name:'pigeonhole-unsat',build:()=>{const m=new Model(),keys=['a','b','c','d','e'];keys.forEach(k=>m.variable(k,[0,1,2,3]));return m.allDifferent(keys,{global:true});},count:0,maxNodes:1},
];}
export function runCase(entry){
 const model=entry.build(),result=new Solver(model).solve({maxNodes:entry.maxNodes,timeoutMs:30000});
 if(result.status!=='complete'||result.stats.solutions!==entry.count)throw new Error(`${entry.name}: expected ${entry.count} complete solutions; got ${result.stats.solutions} (${result.status})`);
 if(!result.solutions.every(s=>validate(model,s).valid))throw new Error(entry.name+': invalid assignment');
 if(entry.independent&&!entry.independent(result))throw new Error(entry.name+': independent solver disagreed');
 return result.stats;
}
