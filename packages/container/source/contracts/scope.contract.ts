import { CacheInterface } from "./cache.contract.js";
import { Resolvable } from "./registry.contract.js";

export interface ScopeInterface {
  readonly container: CacheInterface;

  readonly request: CacheInterface;

  readonly resolvable: Resolvable;

  readonly singleton: CacheInterface;

  fork(type: ScopeForkType, resolvable?: Resolvable): this;
}

export type ScopeForkType = "container" | "request";
