import { Solver } from '../src/solver.js';
import { queens } from '../src/puzzles/queens.js';
import { sudoku, sudokuUniqueness } from '../src/puzzles/sudoku.js';
import { generateSudoku } from '../src/puzzles/generate.js';
import { nonogram } from '../src/puzzles/nonogram.js';
import { singles } from '../src/sudoku/singles.js';

export const REFERENCE =
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

export function parseClues(text) {
  if (typeof text !== 'string' || text.length > 5000)
    throw new TypeError('Enter one clue line per row or column');
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 1 || lines.length > 30) throw new RangeError('Use 1–30 rows and columns');
  return lines.map((line) => {
    if (line.trim() === '0' || line.trim() === '') return [];
    if (!/^\d+(?:[ ,]+\d+)*$/.test(line.trim()))
      throw new TypeError(
        'Clues must be positive integers separated by spaces; use 0 for an empty line',
      );
    const runs = line.trim().split(/[ ,]+/).map(Number);
    if (runs.some((n) => !Number.isSafeInteger(n) || n < 1 || n > 30))
      throw new RangeError('Each run must be 1–30 cells');
    return runs;
  });
}

export function runJob(request, progress = () => {}) {
  const { mode, operation = 'solve', input = {} } = request;
  const trace = [];
  let traceTotal = 0;
  const onTrace = (event) => {
    traceTotal++;
    if (trace.length < 2000) trace.push(event);
    if (event.type === 'node' && event.node % 100 === 0) progress({ nodes: event.node });
  };
  const options = {
    timeoutMs: 10000,
    maxNodes: 250000,
    onTrace,
    variableOrder: request.variableOrder === 'dom-wdeg' ? 'dom-wdeg' : 'mrv',
    valueOrder: request.valueOrder === 'lcv' ? 'lcv' : 'input',
  };
  if (mode === 'sudoku' && operation === 'generate') {
    const generated = generateSudoku({
      seed: Number(input.seed),
      clues: Number(input.clues),
      checkTimeoutMs: 500,
    });
    return { kind: 'generated', generated };
  }
  if (mode === 'sudoku' && operation === 'hint')
    return { kind: 'hints', moves: singles(input.puzzle) };
  if (operation !== 'solve') throw new TypeError('Unsupported operation');
  let model, result, meta;
  if (mode === 'sudoku') {
    model = sudoku(input.puzzle);
    result = sudokuUniqueness(input.puzzle, options);
    meta = { mode, rows: 9, columns: 9, label: 'Sudoku' };
  } else if (mode === 'queens') {
    const size = Number(input.size),
      limit = Number(input.limit);
    if (!Number.isInteger(size) || size < 1 || size > 12)
      throw new RangeError('Explorer boards support 1–12 queens');
    if (!Number.isInteger(limit) || limit < 1 || limit > 2000)
      throw new RangeError('Solution cap must be 1–2,000');
    model = queens(size);
    result = new Solver(model).solve({ ...options, limit });
    meta = { mode, rows: size, columns: size, label: `${size}-Queens` };
  } else if (mode === 'nonogram') {
    const rows = parseClues(input.rowClues),
      columns = parseClues(input.columnClues);
    model = nonogram(rows, columns);
    result = new Solver(model).solve({ ...options, limit: 2 });
    meta = {
      mode,
      rows: rows.length,
      columns: columns.length,
      label: 'Nonogram',
      rowClues: rows,
      columnClues: columns,
    };
  } else throw new TypeError('Unknown puzzle family');
  return {
    kind: 'solved',
    result,
    meta,
    trace,
    traceTotal,
    model: {
      variables: model.domains.size,
      constraints: model.constraints.length,
      maxArity: Math.max(0, ...model.constraints.map((c) => c.scope.length)),
    },
  };
}
