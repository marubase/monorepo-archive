import {
  CacheContract,
  CacheKey,
  CacheToken,
} from "./contracts/cache.contract.js";

export class Cache implements CacheContract {
  protected _store = new Map<CacheToken, Map<CacheToken, unknown>>();

  public clear(key: CacheKey): this {
    const [primary, secondary] = key;
    const table = this._store.get(primary) || new Map<CacheToken, unknown>();
    table.delete(secondary);
    if (table.size < 1) this._store.delete(primary);
    return this;
  }

  public get(key: CacheKey): unknown {
    const [primary, secondary] = key;
    const table = this._store.get(primary);
    return typeof table !== "undefined" ? table.get(secondary) : undefined;
  }

  public has(key: CacheKey): boolean {
    const [primary, secondary] = key;
    const table = this._store.get(primary);
    return typeof table !== "undefined" ? table.has(secondary) : false;
  }

  public set(key: CacheKey, value: unknown): this {
    const [primary, secondary] = key;
    const table = this._store.get(primary) || new Map<CacheToken, unknown>();
    table.set(secondary, value);
    this._store.set(primary, table);
    return this;
  }
}
