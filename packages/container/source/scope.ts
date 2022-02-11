import { Cache } from "./cache.js";
import { CacheInterface } from "./contracts/cache.contract.js";
import { BindingRoot, Resolvable } from "./contracts/registry.contract.js";
import { ScopeForkType, ScopeInterface } from "./contracts/scope.contract.js";

export class Scope implements ScopeInterface {
  protected _container: CacheInterface;

  protected _request: CacheInterface;

  protected _resolvable: Resolvable;

  protected _singleton: CacheInterface;

  public constructor(
    resolvable?: Resolvable,
    singleton?: CacheInterface,
    container?: CacheInterface,
    request?: CacheInterface,
  ) {
    this._resolvable = resolvable || [BindingRoot, BindingRoot];
    this._singleton = singleton || new Cache();
    this._container = container || new Cache();
    this._request = request || new Cache();
  }

  public get container(): CacheInterface {
    return this._container;
  }

  public get request(): CacheInterface {
    return this._request;
  }

  public get resolvable(): Resolvable {
    return this._resolvable;
  }

  public get singleton(): CacheInterface {
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
