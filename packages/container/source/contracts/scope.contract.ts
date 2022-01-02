export interface ScopeContract {
  clear(): this;

  fork(): this;

  get(key: ScopeKey): unknown;

  has(key: ScopeKey): boolean;

  set(set: ScopeKey, value: unknown): this;
}

export type ScopeKey = string | symbol;
