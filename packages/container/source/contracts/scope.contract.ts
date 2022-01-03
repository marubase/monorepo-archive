export interface ScopeContract {
  new (): this;
  new (type: ScopeType, parent: ScopeContract): this;

  clearEntry(key: ScopeKey): this;

  fork(type: ScopeType): this;

  getEntry(key: ScopeKey): unknown;

  getParent(): this | undefined;

  getRecord(): Record<ScopeKey, unknown>;

  getType(): ScopeType;

  hasEntry(key: ScopeKey): boolean;

  search(query: ScopeQuery): this;

  setEntry(set: ScopeKey, value: unknown): this;
}

export type ScopeQuery = "container" | "request" | "singleton" | "transient";

export type ScopeKey = string | symbol;

export type ScopeType = "container" | "request";
