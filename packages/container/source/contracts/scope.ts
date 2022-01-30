import { CacheContract } from "./cache.js";
import { Resolvable } from "./registry.js";

export interface ScopeContract {
  readonly container: CacheContract;

  readonly request: CacheContract;

  readonly resolvable: Resolvable;

  readonly singleton: CacheContract;

  fork(type: ScopeForkType, resolvable?: Resolvable): this;
}

export type ScopeForkType = "container" | "request";
