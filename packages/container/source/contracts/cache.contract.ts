export interface CacheInterface {
  clear(key: CacheKey): this;

  get(key: CacheKey): unknown;

  has(key: CacheKey): boolean;

  set(key: CacheKey, value: unknown): this;
}

export type CacheKey = [CacheToken, CacheToken];

export type CacheToken = Function | string | symbol;
