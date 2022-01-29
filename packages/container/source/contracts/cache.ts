export interface CacheContract {
  clear(): this;

  delete(key: CacheKey): this;

  fork(): this;

  get(key: CacheKey): unknown;

  has(key: CacheKey): boolean;

  set(key: CacheKey, value: unknown): this;
}

export type CacheKey = [CacheToken, CacheToken] | CacheToken;

export type CacheToken = Function | string | symbol;
