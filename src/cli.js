#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { deserialize, inspect, unsatCore, solveAsync, sudokuExactCover, singles, difficulty } from './index.js';
import { Solver, queens, sudokuUniqueness, formatSudoku, generateSudoku } from './index.js';

const usage = 'Usage: constraint-forge queens <1..30> | sudoku <81 cells> | generate <seed> <17..81 clues>';
try {
  const [command, ...args] = process.argv.slice(2);
  let result;
  if (command === '--help' && !args.length) {
    console.log(usage);
  } else {
    if (command === 'solve-model' && args.length === 1) {
      result = new Solver(deserialize(JSON.parse(readFileSync(args[0],'utf8')))).solve({limit:1000,timeoutMs:10000});
    } else if (command === 'queens' && args.length === 1) {
      result = new Solver(queens(Number(args[0]))).solve({ limit: 1000, timeoutMs: 10000 });
    } else if (command === 'sudoku' && args.length === 1) {
      result = sudokuUniqueness(args[0], { timeoutMs: 10000 });
      result.solutions = result.solutions.map(formatSudoku);
    } else if (command === 'generate' && args.length === 2) {
      result = generateSudoku({ seed: Number(args[0]), clues: Number(args[1]) });
    } else throw new Error(usage);
    console.log(JSON.stringify(result, null, 2));
    if (result.status === 'interrupted') process.exitCode = 2;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
