import {
  CacheContract,
  CacheKey,
  CacheScope,
  CacheType,
} from "./contracts/cache.contract.js";

export class Cache extends Map<CacheKey, unknown> implements CacheContract {
  protected _parent?: this;

  protected _type: CacheType = "container";

  public get parent(): this | undefined {
    return this._parent;
  }

  public get type(): CacheType {
    return this._type;
  }

  public fork(type: CacheType): this {
    const Static = this.constructor as typeof Cache;
    return (new Static(this) as this).setParent(this).setType(type);
  }

  public scopeTo(scope: CacheScope): this {
    switch (scope) {
      case "container":
        return this._type !== "container"
          ? (this._parent as this).scopeTo(scope)
          : this;
      case "singleton":
        return typeof this._parent !== "undefined"
          ? this._parent.scopeTo(scope)
          : this;
      default:
        return this;
    }
  }

  public setParent(parent?: this): this {
    this._parent = parent;
    return this;
  }

  public setType(type: CacheType): this {
    this._type = type;
    return this;
  }
}
