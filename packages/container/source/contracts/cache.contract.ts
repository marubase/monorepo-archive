export interface CacheContract {
  new (): this;
  new (type: CacheType, parent: CacheContract): this;

  clearEntry(key: CacheKey): this;

  fork(type: CacheType): this;

  getEntry(key: CacheKey): unknown;

  getParent(): this | undefined;

  getRecord(): Record<CacheKey, unknown>;

  getType(): CacheType;

  hasEntry(key: CacheKey): boolean;

  scopeTo(scope: CacheScope): this;

  setEntry(key: CacheKey, value: undefined): this;
}

export type CacheKey = string | symbol;

export type CacheScope = "container" | "request" | "singleton" | "transient";

export type CacheType = "container" | "request";
