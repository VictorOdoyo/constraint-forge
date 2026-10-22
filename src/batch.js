import { solveAsync } from './async.js';
/** Bounded worker concurrency; output order matches input order. */
export async function solveBatch(models, { concurrency = 2, ...options } = {}) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 32)
    throw new RangeError('Concurrency must be 1..32');
  const results = new Array(models.length);
  let cursor = 0;
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  try {
    await Promise.all(
      Array.from({ length: Math.min(concurrency, models.length) }, async () => {
        while (cursor < models.length) {
          const i = cursor++;
          results[i] = await solveAsync(models[i], { ...options, signal: controller.signal });
        }
      }),
    );
  } catch (e) {
    controller.abort();
    throw e;
  } finally {
    options.signal?.removeEventListener('abort', abort);
  }
  return results;
}
