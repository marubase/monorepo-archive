import { CacheContract, CacheKey, CacheToken } from "./contracts/cache.js";

export class Cache implements CacheContract {
  protected _store: Map<CacheToken, Map<CacheToken, unknown>>;

  public constructor(store?: Map<CacheToken, Map<CacheToken, unknown>>) {
    this._store = store || new Map<CacheToken, Map<CacheToken, unknown>>();
  }

  public clear(): this {
    this._store = new Map<CacheToken, Map<CacheToken, unknown>>();
    return this;
  }

  public delete(key: CacheKey): this {
    if (!Array.isArray(key)) key = [key, Symbol.for("undefined")];
    const [primary, secondary] = key;
    const table = this._store.get(primary) || new Map<CacheToken, unknown>();
    table.delete(secondary);
    if (table.size < 1) this._store.delete(primary);
    return this;
  }

  public fork(): this {
    const newStore = new Map<CacheToken, Map<CacheToken, unknown>>();
    for (const [token, table] of this._store)
      newStore.set(token, new Map(table));
    const Static = this.constructor as typeof Cache;
    return new Static(newStore) as this;
  }

  public get(key: CacheKey): unknown {
    if (!Array.isArray(key)) key = [key, Symbol.for("undefined")];
    const [primary, secondary] = key;
    const table = this._store.get(primary);
    return typeof table !== "undefined" ? table.get(secondary) : undefined;
  }

  public has(key: CacheKey): boolean {
    if (!Array.isArray(key)) key = [key, Symbol.for("undefined")];
    const [primary, secondary] = key;
    const table = this._store.get(primary);
    return typeof table !== "undefined" ? table.has(secondary) : false;
  }

  public set(key: CacheKey, value: unknown): this {
    if (!Array.isArray(key)) key = [key, Symbol.for("undefined")];
    const [primary, secondary] = key;
    const table = this._store.get(primary) || new Map<CacheToken, unknown>();
    table.set(secondary, value);
    this._store.set(primary, table);
    return this;
  }
}
