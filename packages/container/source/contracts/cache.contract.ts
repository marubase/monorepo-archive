export interface CacheContract extends Map<CacheKey, unknown> {
  readonly parent?: this;

  readonly type: CacheType;

  fork(type: CacheType): this;

  scopeTo(scope: CacheScope): this;

  setParent(parent?: this): this;

  setType(type: CacheType): this;
}

export type CacheKey = string | symbol;

export type CacheScope = "container" | "request" | "singleton";

export type CacheType = "container" | "request";
