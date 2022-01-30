import { CacheContract, CacheKey, CacheToken } from "./contracts/cache.js";

export class Cache implements CacheContract {
  protected _store: Map<CacheToken, Map<CacheToken, unknown>>;

  public constructor(store?: Map<CacheToken, Map<CacheToken, unknown>>) {
    this._store = store || new Map<CacheToken, Map<CacheToken, unknown>>();
  }

  public clear([primary, secondary]: CacheKey): this {
    const table = this._store.get(primary) || new Map<CacheToken, unknown>();
    table.delete(secondary);
    if (table.size < 1) this._store.delete(primary);
    return this;
  }

  public get([primary, secondary]: CacheKey): unknown {
    const table = this._store.get(primary);
    return typeof table !== "undefined" ? table.get(secondary) : undefined;
  }

  public has([primary, secondary]: CacheKey): boolean {
    const table = this._store.get(primary);
    return typeof table !== "undefined" ? table.has(secondary) : false;
  }

  public set([primary, secondary]: CacheKey, value: unknown): this {
    const table = this._store.get(primary) || new Map<CacheToken, unknown>();
    table.set(secondary, value);
    this._store.set(primary, table);
    return this;
  }
}
