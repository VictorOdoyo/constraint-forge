import { Model } from '../model.js';
import { regular } from '../constraints/regular.js';
export function lineAutomaton(runs) {
  if (!Array.isArray(runs) || runs.some(n=>!Number.isSafeInteger(n)||n<1)) throw new TypeError('Invalid nonogram runs');
  const transitions=[[0,0,0]];
  let state=0;
  runs.forEach((run,index)=>{
    for(let i=0;i<run;i++) { transitions.push([state,1,state+1]);state++; }
    if(index<runs.length-1) { transitions.push([state,0,state+1]);state++; }
    transitions.push([state,0,state]);
  });
  return {start:0,accept:[state],transitions};
}
export function linePatterns(length, runs) {
  if (!Number.isInteger(length) || length < 0 || runs.some((n) => !Number.isInteger(n) || n < 1))
    throw new TypeError('Invalid nonogram line');
  const result = [];
  function visit(i, start, row) {
    if (i === runs.length) {
      result.push([...row, ...Array(length - row.length).fill(0)]);
      return;
    }
    const remaining = runs.slice(i + 1).reduce((s, n) => s + n, 0) + runs.length - i - 1;
    for (let at = start; at + runs[i] + remaining <= length; at++) {
      const next = [...row, ...Array(at - row.length).fill(0), ...Array(runs[i]).fill(1)];
      if (i < runs.length - 1) next.push(0);
      visit(i + 1, next.length, next);
    }
  }
  visit(0, 0, []);
  return result;
}
export function nonogram(rowClues, columnClues) {
  const m = new Model(),
    h = rowClues.length,
    w = columnClues.length;
  if (!h || !w) throw new TypeError('Grid must be nonempty');
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) m.variable(r + ',' + c, [0, 1]);
  rowClues.forEach((runs, r) =>
    regular(
      m,
      Array.from({ length: w }, (_, c) => r + ',' + c),
      lineAutomaton(runs),
    ),
  );
  columnClues.forEach((runs, c) =>
    regular(
      m,
      Array.from({ length: h }, (_, r) => r + ',' + c),
      lineAutomaton(runs),
    ),
  );
  return m;
}
