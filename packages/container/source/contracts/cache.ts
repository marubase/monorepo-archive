export interface CacheContract extends Map<CacheKey, unknown> {
  fork(): CacheContract;
}

export type CacheKey = string | symbol;
