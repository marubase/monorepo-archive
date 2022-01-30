import { Cache } from "./cache.js";
import { CacheContract } from "./contracts/cache.js";
import { BindingRoot, Resolvable } from "./contracts/registry.js";
import { ScopeContract, ScopeForkType } from "./contracts/scope.js";

export class Scope implements ScopeContract {
  protected _container: CacheContract;

  protected _request: CacheContract;

  protected _resolvable: Resolvable;

  protected _singleton: CacheContract;

  public constructor(
    resolvable?: Resolvable,
    singleton?: CacheContract,
    container?: CacheContract,
    request?: CacheContract,
  ) {
    this._resolvable = resolvable || [BindingRoot, BindingRoot];
    this._singleton = singleton || new Cache();
    this._container = container || new Cache();
    this._request = request || new Cache();
  }

  public get container(): CacheContract {
    return this._container;
  }

  public get request(): CacheContract {
    return this._request;
  }

  public get resolvable(): Resolvable {
    return this._resolvable;
  }

  public get singleton(): CacheContract {
    return this._singleton;
  }

  public fork(type: ScopeForkType, resolvable?: Resolvable): this {
    const { _container, _singleton } = this;
    const Static = this.constructor as typeof Scope;
    return type === "container"
      ? (new Static(resolvable, _singleton) as this)
      : (new Static(resolvable, _singleton, _container) as this);
  }
}
