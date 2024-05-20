export default class ExecutionCache<TArgs extends any[], TResult> {
  private cache: Map<string, Promise<TResult>>;
  private readonly handler: (...args: TArgs) => Promise<TResult>;

  constructor(handler: (...args: TArgs) => Promise<TResult>) {
    this.cache = new Map();
    this.handler = handler;
  }

  async fire(key: string, ...args: TArgs): Promise<TResult> {
    if (!this.cache.has(key)) {
      const promise = this.handler(...args);
      this.cache.set(key, promise);
      return promise;
    }
    return this.cache.get(key)!;
  }
}
