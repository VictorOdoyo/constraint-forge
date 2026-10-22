import { createExplorerServer } from '../src/explorer-server.js';
const port = Number(process.argv[2] ?? 4173);
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw new RangeError('Port must be 0–65535');
const server = createExplorerServer();
server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () =>
  console.log(`Constraint Forge explorer: http://127.0.0.1:${server.address().port}`),
);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
