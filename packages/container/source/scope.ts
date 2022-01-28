import { ScopeContract, ScopeForkType, ScopeKey } from "./contracts/scope.js";

export class Scope implements ScopeContract {
  protected _container: Map<ScopeKey, unknown>;

  protected _request: Map<ScopeKey, unknown>;

  protected _singleton: Map<ScopeKey, unknown>;

  public constructor(
    singleton?: Map<ScopeKey, unknown>,
    container?: Map<ScopeKey, unknown>,
    request?: Map<ScopeKey, unknown>,
  ) {
    this._singleton = singleton || new Map();
    this._container = container || this.singleton;
    this._request = request || this.container;
  }

  public get container(): Map<ScopeKey, unknown> {
    return this._container;
  }

  public get request(): Map<ScopeKey, unknown> {
    return this._request;
  }

  public get singleton(): Map<ScopeKey, unknown> {
    return this._singleton;
  }

  public fork(type: ScopeForkType): this {
    const { _container, _singleton } = this;
    const Static = this.constructor as typeof Scope;
    return type === "container"
      ? (new Static(_singleton, new Map(_container)) as this)
      : (new Static(_singleton, _container, new Map(_container)) as this);
  }
}
