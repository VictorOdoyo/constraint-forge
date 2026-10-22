import assert from 'node:assert/strict';
import {Model,Solver,nonogram,minimizeLinear,solveAsync,serialize,deserialize,validate} from '../src/index.js';

// A small ordering problem, a weighted objective, and a portable worker workflow.
const model=new Model().variable('alice',[1,2,3]).variable('bob',[1,2,3])
  .constrain(['alice','bob'],(a,b)=>a<b,'ordering');
const complete=new Solver(model).solve();
assert.equal(complete.stats.solutions,3);
const optimum=minimizeLinear(model,{alice:2,bob:1});
assert.deepEqual(optimum.best,{alice:1,bob:2});assert.ok(optimum.optimal);
const portable=deserialize(JSON.parse(JSON.stringify(serialize(model))));
assert.equal((await solveAsync(portable)).stats.solutions,3);

// A cross-shaped picture, represented compactly by row and column automata.
const puzzle=nonogram([[1],[1],[5],[1],[1]],[[1],[1],[5],[1],[1]]);
const solved=new Solver(puzzle).solve();
assert.equal(solved.stats.solutions,1);assert.ok(validate(puzzle,solved.solutions[0]).valid);
const picture=Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>solved.solutions[0][r+','+c]?'#':'.').join('')).join('\n');
console.log(JSON.stringify({orderingSolutions:complete.stats.solutions,optimum:optimum.best,nonogram:picture},null,2));
