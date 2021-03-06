import { BarretenbergWorker } from './worker';
import { spawn, Thread, Worker } from 'threads';
import createDebug from 'debug';

export async function createWorker(id?: string) {
  const debug = createDebug(`bb:wasm${id ? ':' + id : ''}`);
  const thread = await spawn<BarretenbergWorker>(new Worker('./worker'));
  thread.logs().subscribe(debug);
  return thread;
}

export async function destroyWorker(worker: BarretenbergWorker) {
  await Thread.terminate(worker as any);
}
