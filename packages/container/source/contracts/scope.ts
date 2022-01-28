export interface ScopeContract {
  container: Map<ScopeKey, unknown>;

  request: Map<ScopeKey, unknown>;

  singleton: Map<ScopeKey, unknown>;

  fork(type: ScopeForkType): this;
}

export type ScopeForkType = "container" | "request";

export type ScopeKey = string | symbol;
