type Fn<T> = (...args: any[]) => Promise<T>;
type Reslove<T> = (value: T | PromiseLike<T>) => void;

class PLimit {
  private concurrency: number;
  private activeCount: number;
  private queue: Array<() => void>;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.activeCount = 0;
    this.queue = [];
  }

  createTask<T>(fn: (...args: any[]) => Promise<T>, ...args: any): Promise<T> {
    return new Promise<T>(resolve => {
      this.enqueue(fn, resolve, args);
    });
  }

  enqueue<T>(fn: Fn<T>, resolve: Reslove<T>, args: any) {
    this.queue.push(this.run.bind(this, fn, resolve, args));
    (async () => {
      await Promise.resolve();
      if (this.activeCount < this.concurrency && this.queue.length > 0) {
        const task = this.queue.shift();
        task && task();
      }
    })();
  }

  next() {
    this.activeCount--;
    if (this.queue.length > 0) {
      const task = this.queue.shift();
      task && task();
    }
  }

  async run<T>(fn: Fn<T>, resolve: Reslove<T>, args: any) {
    this.activeCount++;
    const result = (async () => fn(...args))();
    resolve(result);
    try {
      await result;
    } catch {}
    this.next();
  }
}
