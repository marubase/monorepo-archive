export interface ContextContract {
  clearEntry(key: EntryKey): this;

  fork(type: ContextType): this;

  getEntry(key: EntryKey): unknown;

  getParent(): this | undefined;

  getRecord(): Record<EntryKey, unknown>;

  getType(): ContextType;

  hasEntry(key: EntryKey): boolean;

  scopeTo(scope: ContextScope): this;

  setEntry(key: EntryKey, value: unknown): this;
}

export type ContextScope = "container" | "request" | "singleton" | "transient";

export type ContextType = "container" | "request";

export type EntryKey = string | symbol;
