import { REFERENCE, parseClues } from './jobs.js';
import { parseSudoku } from '../src/puzzles/sudoku.js';
import { renderSudokuSvg, renderQueensSvg } from '../src/render.js';

const $ = (id) => document.getElementById(id);
const storageKey = 'constraint-forge/explorer/v1';
let mode = 'sudoku',
  puzzle = REFERENCE,
  result = null,
  position = 0,
  hint = null,
  highlight = null;
let worker = null,
  deadline,
  ticker,
  started = 0;
const undo = [];
const board = $('board');
const familyNames = { sudoku: 'Sudoku', queens: 'N-Queens', nonogram: 'Nonogram' };
const familyNumbers = { sudoku: '01', queens: '02', nonogram: '03' };

function status(message, tone = '') {
  $('status').textContent = message;
  $('status').className = 'status ' + tone;
}
function save() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        puzzle,
        size: $('queen-size').value,
        limit: $('solution-limit').value,
        rowClues: $('row-clues').value,
        columnClues: $('column-clues').value,
        seed: $('seed').value,
        clues: $('clues').value,
      }),
    );
  } catch {
    /* Private browsing can disable persistence. */
  }
}
function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey));
    if (data?.version !== 1) return;
    parseSudoku(data.puzzle);
    puzzle = data.puzzle;
    for (const [key, id] of Object.entries({
      size: 'queen-size',
      limit: 'solution-limit',
      rowClues: 'row-clues',
      columnClues: 'column-clues',
      seed: 'seed',
      clues: 'clues',
    }))
      if (typeof data[key] === 'string' && data[key].length < 5000) $(id).value = data[key];
  } catch {
    /* A malformed saved workspace does not prevent launch. */
  }
}
function clearResult() {
  result = null;
  position = 0;
  hint = null;
  highlight = null;
  $('apply-hint').disabled = true;
  $('export-json').disabled = true;
  for (const id of ['stat-solutions', 'stat-nodes', 'stat-pruned', 'stat-time'])
    $(id).textContent = '—';
  $('trace-position').disabled = true;
  $('trace-position').max = '0';
  $('trace-count').textContent = 'No search yet';
  $('trace-detail').textContent =
    'Run a solver to explore its decisions, failures, and discoveries.';
  $('trace-chart').replaceChildren();
}
function setBusy(busy) {
  for (const id of [
    'solve',
    'generate',
    'hint',
    'apply-hint',
    'load-text',
    'update-clues',
    'reset',
    'clear',
    'undo',
  ])
    $(id).disabled = busy;
  for (const input of document.querySelectorAll(
    '.controls input,.controls textarea,.controls select,#board input',
  ))
    input.disabled = busy;
  $('solve').hidden = busy;
  $('stop').hidden = !busy;
  $('status').classList.toggle('loading', busy);
  if (!busy) {
    $('apply-hint').disabled = !hint;
    $('undo').disabled = !undo.length;
  }
}
function stop(message = 'Search stopped. Partial worker results were discarded.') {
  if (worker) worker.terminate();
  worker = null;
  clearTimeout(deadline);
  clearInterval(ticker);
  setBusy(false);
  status(message);
}
function currentInput() {
  return {
    puzzle,
    size: $('queen-size').value,
    limit: $('solution-limit').value,
    rowClues: $('row-clues').value,
    columnClues: $('column-clues').value,
    seed: $('seed').value,
    clues: $('clues').value,
  };
}
function run(operation = 'solve') {
  if (worker) stop();
  if (operation === 'solve') clearResult();
  const active = new Worker('/web/worker.js', { type: 'module' });
  worker = active;
  started = performance.now();
  setBusy(true);
  status('Working locally in a background thread…');
  ticker = setInterval(() => {
    if (worker)
      status(`Working locally · ${((performance.now() - started) / 1000).toFixed(1)} seconds`);
  }, 500);
  deadline = setTimeout(
    () => stop('Stopped after 15 seconds. Try a smaller board or a higher clue count.'),
    15000,
  );
  active.onerror = () => {
    if (worker === active) {
      stop();
      status(
        'The worker could not run. Start the explorer with npm run explore; opening the HTML file directly is not supported.',
        'error',
      );
    }
  };
  active.onmessage = ({ data }) => {
    if (worker !== active) return;
    if (data.type === 'progress') {
      $('stat-nodes').textContent = data.nodes.toLocaleString();
      return;
    }
    clearTimeout(deadline);
    clearInterval(ticker);
    active.terminate();
    worker = null;
    setBusy(false);
    if (data.type === 'error') {
      status(data.message, 'error');
      return;
    }
    const value = data.data;
    if (value.kind === 'generated') {
      remember();
      puzzle = value.generated.puzzle;
      clearResult();
      save();
      render();
      status(
        `Generated ${value.generated.actualClues} clues (target ${value.generated.requestedClues}) · uniqueness verified. Seed ${value.generated.seed}.`,
        'success',
      );
      return;
    }
    if (value.kind === 'hints') {
      hint = value.moves[0] || null;
      $('apply-hint').disabled = !hint;
      if (hint) {
        highlight = `r${Math.floor(hint.index / 9)}c${hint.index % 9}`;
        render();
        status(
          `${hint.strategy.replaceAll('-', ' ')}: row ${Math.floor(hint.index / 9) + 1}, column ${(hint.index % 9) + 1} must be ${hint.value}.`,
          'success',
        );
      } else status('No naked or hidden singles available. Try solving to explore the search.');
      return;
    }
    result = value;
    position = 0;
    render();
    updateMetrics();
    drawTrace();
    $('export-json').disabled = false;
    const r = value.result,
      count = r.stats.solutions;
    if (r.status === 'interrupted')
      status(`${count} solutions found; ${r.reason.toLowerCase()}. Exhaustion was not proved.`);
    else if (r.uniqueness === 'unique')
      status('Unique solution proved by exhaustive search.', 'success');
    else if (r.status === 'limit')
      status(`${count} solutions found. Solution cap reached; more may exist.`, 'success');
    else if (count === 0) status('No solution exists for this model. Search exhausted.');
    else status(`${count} solution${count === 1 ? '' : 's'} found. Search exhausted.`, 'success');
  };
  active.postMessage({
    mode,
    operation,
    input: currentInput(),
    variableOrder: $('variable-order').value,
    valueOrder: $('value-order').value,
  });
}
function remember() {
  undo.push(puzzle);
  if (undo.length > 100) undo.shift();
  $('undo').disabled = false;
}
function changePuzzle(text) {
  const cells = parseSudoku(text);
  remember();
  puzzle = cells.map((v) => v || '.').join('');
  clearResult();
  save();
  render();
  status('Puzzle updated. Ready to solve.');
}
function dimensions() {
  if (mode === 'sudoku') return [9, 9];
  if (mode === 'queens') {
    const n = Number($('queen-size').value);
    if (!Number.isInteger(n) || n < 1 || n > 12)
      throw new RangeError('Choose a board size from 1 to 12');
    return [n, n];
  }
  return [parseClues($('row-clues').value).length, parseClues($('column-clues').value).length];
}
function render() {
  let rows, columns;
  try {
    [rows, columns] = dimensions();
  } catch (e) {
    status(e.message, 'error');
    return;
  }
  const solution = result?.result.solutions[position];
  board.replaceChildren();
  board.className = 'board ' + mode;
  board.style.gridTemplateColumns = `repeat(${columns},minmax(0,1fr))`;
  board.style.aspectRatio = `${columns} / ${rows}`;
  board.setAttribute('aria-label', `${familyNames[mode]} ${rows} by ${columns} board`);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const index = r * columns + c;
      const key = mode === 'sudoku' ? `r${r}c${c}` : mode === 'queens' ? `q${c}` : `${r},${c}`;
      if (highlight === key) cell.classList.add('highlight');
      if (mode === 'sudoku') {
        const given = Number(puzzle[index]) || 0;
        if (given) cell.classList.add('given');
        else if (solution) cell.classList.add('solution');
        if (c === 2 || c === 5) cell.classList.add('box-right');
        if (r === 2 || r === 5) cell.classList.add('box-bottom');
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'numeric';
        input.autocomplete = 'off';
        input.maxLength = 1;
        input.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}`);
        input.dataset.index = String(index);
        input.value = solution?.[key] || given || '';
        input.readOnly = Boolean(solution);
        input.addEventListener('input', () => {
          if (worker) stop();
          remember();
          const value = input.value.replace(/[^1-9]/g, '').at(-1) || '.';
          puzzle = puzzle.slice(0, index) + value + puzzle.slice(index + 1);
          clearResult();
          save();
          render();
          board.querySelector(`[data-index="${index}"]`)?.focus();
          status('Puzzle edited.');
        });
        input.addEventListener('keydown', (event) => {
          const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -9, ArrowDown: 9 };
          if (Object.hasOwn(offsets, event.key)) {
            event.preventDefault();
            board
              .querySelector(
                `[data-index="${Math.max(0, Math.min(80, index + offsets[event.key]))}"]`,
              )
              ?.focus();
          }
        });
        input.addEventListener('paste', (event) => {
          const text = event.clipboardData.getData('text');
          if (text.replace(/\s/g, '').length === 81) {
            event.preventDefault();
            try {
              changePuzzle(text);
            } catch (e) {
              status(e.message, 'error');
            }
          }
        });
        cell.append(input);
      } else if (mode === 'queens') {
        if ((r + c) % 2) cell.classList.add('dark');
        if (solution?.[key] === r) {
          const queen = document.createElement('span');
          queen.className = 'queen';
          queen.textContent = '♛';
          queen.setAttribute('aria-label', `Queen at row ${r + 1}, column ${c + 1}`);
          cell.append(queen);
        }
      } else if (solution) cell.classList.add(solution[key] ? 'filled' : 'empty');
      board.append(cell);
    }
  $('puzzle-title').textContent = mode === 'queens' ? `${rows}-Queens` : familyNames[mode];
  $('family-number').textContent = familyNumbers[mode];
  $('board-caption').textContent =
    mode === 'sudoku'
      ? solution
        ? 'Solution shown. Return to the puzzle to edit.'
        : 'Enter digits 1–9. Arrow keys move between cells.'
      : mode === 'queens'
        ? 'One queen per column. No shared rows or diagonals.'
        : 'Filled cells match the row and column run clues.';
  $('clear').hidden = mode !== 'sudoku';
  $('puzzle-text').value = puzzle;
  $('solution-nav').hidden = !solution;
  $('solution-position').textContent =
    `Solution ${position + 1} of ${result?.result.solutions.length || 0}`;
  $('previous').disabled = position === 0;
  $('next').disabled = !result || position >= result.result.solutions.length - 1;
  $('export-svg').disabled = mode === 'nonogram';
  if (!result) {
    $('model-variables').textContent = String(rows * columns);
    $('model-constraints').textContent =
      mode === 'sudoku'
        ? '27'
        : mode === 'nonogram'
          ? String(rows + columns)
          : String(rows * (rows - 1));
    $('model-arity').textContent =
      mode === 'sudoku' ? '9' : mode === 'nonogram' ? String(Math.max(rows, columns)) : '2';
    if (mode === 'queens') $('model-variables').textContent = String(rows);
  }
}
function updateMetrics() {
  const { stats } = result.result;
  for (const [id, value] of Object.entries({
    'stat-solutions': stats.solutions.toLocaleString(),
    'stat-nodes': stats.nodes.toLocaleString(),
    'stat-pruned': stats.pruned.toLocaleString(),
    'stat-time':
      stats.elapsedMs < 1000
        ? `${stats.elapsedMs.toFixed(1)} ms`
        : `${(stats.elapsedMs / 1000).toFixed(2)} s`,
    'model-variables': result.model.variables,
    'model-constraints': result.model.constraints,
    'model-arity': result.model.maxArity,
  }))
    $(id).textContent = String(value);
}
function drawTrace() {
  const events = result.trace,
    svgNS = 'http://www.w3.org/2000/svg';
  $('trace-chart').replaceChildren();
  if (events.length) {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 600 70');
    svg.setAttribute('preserveAspectRatio', 'none');
    const path = document.createElementNS(svgNS, 'path'),
      depth = Math.max(1, ...events.map((e) => e.depth));
    path.setAttribute(
      'd',
      events
        .map(
          (e, i) =>
            `${i ? 'L' : 'M'} ${((i / Math.max(1, events.length - 1)) * 600).toFixed(2)} ${(62 - (e.depth / depth) * 52).toFixed(2)}`,
        )
        .join(' '),
    );
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#6d9676');
    path.setAttribute('stroke-width', '1.5');
    svg.append(path);
    $('trace-chart').append(svg);
  }
  $('trace-position').disabled = !events.length;
  $('trace-position').max = String(Math.max(0, events.length - 1));
  $('trace-position').value = '0';
  $('trace-count').textContent =
    `${events.length.toLocaleString()}${result.traceTotal > events.length ? ' retained of ' + result.traceTotal.toLocaleString() : ''} events`;
  selectTrace();
}
function selectTrace() {
  if (!result) return;
  const i = Number($('trace-position').value),
    event = result.trace[i];
  if (!event) return;
  highlight = event.variable || null;
  $('trace-detail').textContent =
    `${i + 1} / ${result.trace.length} · ${event.type} · depth ${event.depth}${event.variable ? ' · ' + event.variable + ' = ' + event.value : ''}`;
  render();
}
function download(name, body, type) {
  const url = URL.createObjectURL(new Blob([body], { type })),
    anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function switchMode(next) {
  if (worker) stop();
  mode = next;
  clearResult();
  for (const button of document.querySelectorAll('[data-mode]')) {
    const selected = button.dataset.mode === mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  for (const key of Object.keys(familyNames)) $(key + '-controls').hidden = key !== mode;
  render();
  status('Ready when you are.');
}
for (const button of document.querySelectorAll('[data-mode]'))
  button.addEventListener('click', () => switchMode(button.dataset.mode));
$('solve').onclick = () => run();
$('generate').onclick = () => run('generate');
$('hint').onclick = () => run('hint');
$('stop').onclick = () => stop();
$('apply-hint').onclick = () => {
  if (hint) {
    const next = puzzle.slice(0, hint.index) + hint.value + puzzle.slice(hint.index + 1);
    changePuzzle(next);
  }
};
$('undo').onclick = () => {
  if (undo.length) {
    puzzle = undo.pop();
    clearResult();
    save();
    render();
    $('undo').disabled = !undo.length;
    status('Previous edit restored.');
  }
};
$('clear').onclick = () => changePuzzle('.'.repeat(81));
$('load-text').onclick = () => {
  try {
    changePuzzle($('puzzle-text').value);
  } catch (e) {
    status(e.message, 'error');
  }
};
$('reset').onclick = () => {
  if (mode === 'sudoku') changePuzzle(REFERENCE);
  else if (mode === 'queens') {
    $('queen-size').value = '8';
    $('solution-limit').value = '100';
    clearResult();
    render();
  } else {
    $('row-clues').value = $('column-clues').value = '1\n1\n5\n1\n1';
    clearResult();
    render();
  }
  save();
  status('Example loaded.');
};
$('update-clues').onclick = () => {
  clearResult();
  render();
  save();
};
for (const id of ['queen-size', 'solution-limit'])
  $(id).addEventListener('change', () => {
    clearResult();
    render();
    save();
  });
for (const id of ['seed', 'clues']) $(id).addEventListener('change', save);
$('previous').onclick = () => {
  if (position > 0) {
    position--;
    render();
  }
};
$('next').onclick = () => {
  if (result && position < result.result.solutions.length - 1) {
    position++;
    render();
  }
};
$('edit').onclick = () => {
  clearResult();
  render();
  status('Original puzzle restored for editing.');
};
$('trace-position').oninput = selectTrace;
$('export-json').onclick = () => {
  if (result)
    download(
      `constraint-forge-${mode}.json`,
      JSON.stringify({ version: 1, input: currentInput(), ...result }, null, 2),
      'application/json',
    );
};
$('export-svg').onclick = () => {
  try {
    if (mode === 'sudoku') {
      const solution = result?.result.solutions[position],
        text = solution
          ? Array.from({ length: 81 }, (_, i) => solution[`r${Math.floor(i / 9)}c${i % 9}`]).join(
              '',
            )
          : puzzle;
      download('constraint-forge-sudoku.svg', renderSudokuSvg(text), 'image/svg+xml');
    } else if (mode === 'queens') {
      const solution = result?.result.solutions[position];
      if (!solution) {
        status('Solve the board before exporting a Queens diagram.');
        return;
      }
      download(
        'constraint-forge-queens.svg',
        renderQueensSvg(
          Array.from({ length: Number($('queen-size').value) }, (_, i) => solution['q' + i]),
        ),
        'image/svg+xml',
      );
    }
  } catch (e) {
    status(e.message, 'error');
  }
};
window.addEventListener('beforeunload', () => worker?.terminate());
restore();
render();
