import { CacheContract } from "./cache.js";

export interface ScopeContract {
  container: CacheContract;

  request: CacheContract;

  singleton: CacheContract;

  fork(type: ScopeForkType): this;
}

export type ScopeForkType = "container" | "request";
