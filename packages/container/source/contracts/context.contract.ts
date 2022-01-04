export interface ContextContract {
  clearEntry(key: EntryKey): this;

  fork(type: ContextType): this;

  getEntries(): Record<EntryKey, unknown>;

  getEntry(key: EntryKey): unknown;

  getParent(): this | undefined;

  getType(): ContextType;

  hasEntry(key: EntryKey): boolean;

  scopeTo(scope: ContextScope): this;

  setEntry(key: EntryKey, value: unknown): this;
}

export type ContextScope = "container" | "request" | "singleton" | "transient";

export type ContextType = "container" | "request";

export type EntryKey = string | symbol;
