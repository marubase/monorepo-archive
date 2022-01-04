import {
  ContextContract,
  ContextScope,
  ContextType,
  EntryKey,
} from "./contracts/context.contract.js";

export class Context implements ContextContract {
  protected _entries: Record<EntryKey, unknown> = {};

  protected _parent?: this | undefined;

  protected _type: ContextType;

  public constructor(type: ContextType = "container", parent?: Context) {
    this._parent = parent as this;
    this._type = type;
  }

  public clearEntry(key: EntryKey): this {
    if (typeof this._parent !== "undefined") this._entries[key] = undefined;
    else delete this._entries[key];
    return this;
  }

  public fork(type: ContextType): this {
    const Static = this.constructor as typeof Context;
    return new Static(type, this) as this;
  }

  public getEntries(): Record<EntryKey, unknown> {
    const byDefinedValue = ([, value]: [EntryKey, unknown]): boolean =>
      typeof value !== "undefined";
    const toEntries = (
      entries: Record<EntryKey, unknown>,
      [key, value]: [EntryKey, unknown],
    ): Record<EntryKey, unknown> => {
      entries[key] = value;
      return entries;
    };
    return Object.entries(this._collapseEntries())
      .filter(byDefinedValue)
      .reduce(toEntries, {});
  }

  public getEntry(key: EntryKey): unknown {
    return this.getEntries()[key];
  }

  public getParent(): this | undefined {
    return this._parent;
  }

  public getType(): ContextType {
    return this._type;
  }

  public hasEntry(key: EntryKey): boolean {
    return key in this.getEntries();
  }

  public scopeTo(scope: ContextScope): this {
    switch (scope) {
      case "container":
        return this._type !== "container"
          ? (this._parent as this).scopeTo(scope)
          : this;
      case "request":
        if (typeof this._parent === "undefined") return this;
        return this._parent._type !== "container"
          ? this._parent.scopeTo(scope)
          : this;
      case "singleton":
        return typeof this._parent !== "undefined"
          ? this._parent.scopeTo(scope)
          : this;
      default:
        return this;
    }
  }

  public setEntry(key: EntryKey, value: unknown): this {
    this._entries[key] = value;
    return this;
  }

  protected _collapseEntries(): Record<EntryKey, unknown> {
    return typeof this._parent !== "undefined"
      ? Object.assign(this._parent._entries, this._entries)
      : Object.assign({}, this._entries);
  }
}
