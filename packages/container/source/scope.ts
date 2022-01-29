import { Cache } from "./cache.js";
import { CacheContract } from "./contracts/cache.js";
import { ScopeContract, ScopeForkType } from "./contracts/scope.js";

export class Scope implements ScopeContract {
  protected _container: CacheContract;

  protected _request: CacheContract;

  protected _singleton: CacheContract;

  public constructor(
    singleton?: CacheContract,
    container?: CacheContract,
    request?: CacheContract,
  ) {
    this._singleton = singleton || new Cache();
    this._container = container || this._singleton;
    this._request = request || this._container;
  }

  public get container(): CacheContract {
    return this._container;
  }

  public get request(): CacheContract {
    return this._request;
  }

  public get singleton(): CacheContract {
    return this._singleton;
  }

  public fork(type: ScopeForkType): this {
    const { _container, _singleton } = this;
    const Static = this.constructor as typeof Scope;
    return type === "container"
      ? (new Static(_singleton, _container.fork()) as this)
      : (new Static(_singleton, _container, _container.fork()) as this);
  }
}
