import {
  CacheContract,
  CacheKey,
  CacheScope,
  CacheType,
} from "./contracts/cache.contract.js";
import { CacheError } from "./errors/cache.error.js";

export class Cache implements CacheContract {
  protected _parent?: this;

  protected _record: Record<CacheKey, unknown> = {};

  protected _type: CacheType;

  public constructor(type: CacheType = "container", parent?: CacheContract) {
    if (typeof parent !== "undefined") {
      this._parent = parent as this;
      this._record = Object.assign({}, parent.getRecord());
    }
    this._type = type;
  }

  public clearEntry(key: CacheKey): this {
    if (!this.hasEntry(key)) {
      const context = `Clearing cache entry.`;
      const problem = `Cache entry not found.`;
      const solution = `Please use another key.`;
      throw new CacheError(`${context} ${problem} ${solution}`);
    }
    delete this._record[key];
    return this;
  }

  public fork(type: CacheType): this {
    const Static = this.constructor as typeof Cache;
    return new Static(type, this) as this;
  }

  public getEntry(key: CacheKey): unknown {
    if (!this.hasEntry(key)) {
      const context = `Getting cache entry.`;
      const problem = `Cache entry not found.`;
      const solution = `Please use another key.`;
      throw new CacheError(`${context} ${problem} ${solution}`);
    }
    return this._record[key];
  }

  public getParent(): this | undefined {
    return this._parent;
  }

  public getRecord(): Record<CacheKey, unknown> {
    return this._record;
  }

  public getType(): CacheType {
    return this._type;
  }

  public hasEntry(key: CacheKey): boolean {
    return key in this._record;
  }

  public scopeTo(scope: CacheScope): this {
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

  public setEntry(key: CacheKey, value: unknown): this {
    if (this.hasEntry(key)) {
      const context = `Setting cache entry.`;
      const problem = `Cache entry already exist.`;
      const solution = `Please use another key.`;
      throw new CacheError(`${context} ${problem} ${solution}`);
    }
    this._record[key] = value;
    return this;
  }
}
