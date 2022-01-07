export interface CacheContract extends Map<CacheKey, unknown> {
  readonly parent?: this;

  readonly type: ContextType;

  fork(type: ContextType): this;

  scopeTo(scope: ContextScope): this;

  setParent(parent?: this): this;

  setType(type: ContextType): this;
}

export type CacheKey = string | symbol;

export type ContextScope = "container" | "request" | "singleton" | "transient";

export type ContextType = "container" | "request";
