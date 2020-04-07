import { BarretenbergWorker } from './worker';
import { ModuleThread } from 'threads';
import createDebug from 'debug';
import { createWorker, destroyWorker } from './worker_factory';

const debug = createDebug('bb:worker_pool');

export class WorkerPool {
  public workers: ModuleThread<BarretenbergWorker>[] = [];

  public async init(module: WebAssembly.Module, poolSize: number) {
    debug("creating workers...");
    const start = new Date().getTime();
    this.workers = await Promise.all(
      Array(poolSize)
        .fill(0)
        .map((_,i) => createWorker(`${i}`).then(w => w.init(module) && w))
    );
    debug(`created workers: ${new Date().getTime() - start}ms`);
  }

  public async destroy() {
    await Promise.all(this.workers.map(destroyWorker));
  }
}
