export interface ScopeContract {
  new (): this;
  new (parent: ScopeContract): this;

  clear(): this;

  fork(): this;

  get(key: ScopeKey): unknown;

  getParent(): this | undefined;

  has(key: ScopeKey): boolean;

  set(set: ScopeKey, value: unknown): this;
}

export type ScopeKey = string | symbol;
