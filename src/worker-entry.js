import { parentPort, workerData } from 'node:worker_threads';
import { deserialize } from './serialize.js';
import { Solver } from './solver.js';
try {
  parentPort.postMessage({
    result: new Solver(deserialize(workerData.model)).solve(workerData.options),
  });
} catch (e) {
  parentPort.postMessage({ error: { name: e.name, message: e.message } });
}
