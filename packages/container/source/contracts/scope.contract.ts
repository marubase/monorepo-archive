export interface ScopeContract {
  new (): this;
  new (type: ScopeType, parent: ScopeContract): this;

  clear(): this;

  fork(type: ScopeType): this;

  get(key: ScopeKey): unknown;

  getParent(): this | undefined;

  getType(): ScopeType;

  has(key: ScopeKey): boolean;

  set(set: ScopeKey, value: unknown): this;

  to(query: ScopeQuery): this;
}

export type ScopeKey = string | symbol;

export type ScopeQuery = "container" | "request" | "singleton" | "transient";

export type ScopeType = "container" | "request";
