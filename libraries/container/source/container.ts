import {
  BindOptions,
  ContainerCache,
  ContainerContract,
  ContainerInterface,
  ContainerResolver,
  ContainerScope,
  Provider,
  ProviderKey,
  ProviderMap,
  ResolveFactory,
  ResolveKey,
} from "./contracts/container.contract.js";
import { ContainerError } from "./errors/container.error.js";

export class Container implements ContainerInterface {
  protected _booted = false;

  protected _cache: ContainerCache;

  protected _providers = new Map<ProviderKey, Provider>();

  protected _resolver: ContainerResolver;

  protected _scope: ContainerScope;

  public constructor(
    cache?: ContainerCache,
    resolver?: ContainerResolver,
    scope?: ContainerScope,
  ) {
    if (typeof cache !== "undefined") this._cache = cache;
    else {
      const cache = new Map();
      this._cache = { container: cache, request: cache, singleton: cache };
    }

    if (typeof resolver !== "undefined") this._resolver = resolver;
    else this._resolver = new Map([[ContainerContract, () => this]]);

    if (typeof scope !== "undefined") this._scope = scope;
    else this._scope = "container";
  }

  public get booted(): boolean {
    return this._booted;
  }

  public get cache(): ContainerCache {
    return this._cache;
  }

  public get providers(): ProviderMap {
    return this._providers;
  }

  public get resolver(): ContainerResolver {
    return this._resolver;
  }

  public get scope(): ContainerScope {
    return this._scope;
  }

  public bind(
    key: ResolveKey,
    factoryFn: ResolveFactory,
    options: BindOptions = {},
  ): this {
    if (typeof options.scope === "undefined") {
      this._resolver.set(key, factoryFn);
      return this;
    }

    this._resolver.set(key, (container, ...args) => {
      const cache = container.cache[options.scope!];
      return !cache.has(key)
        ? cache.set(key, factoryFn(container, ...args)).get(key)
        : cache.get(key);
    });
    return this;
  }

  public async boot(): Promise<void> {
    if (this._booted) return;

    const boots: Promise<void>[] = [];
    for (const provider of this._providers.values())
      if (provider.boot) boots.push(provider.boot(this));
    await Promise.all(boots);
    this._booted = true;
  }

  public bound(key: ResolveKey): boolean {
    return this._resolver.has(key);
  }

  public fork(): this;
  public fork(scope: ContainerScope): this;
  public fork(scope: ContainerScope = "container"): this {
    const Static = this.constructor as typeof Container;
    if (scope !== "container") {
      const { container, singleton } = this._cache;
      const request = new Map(this._cache.container);
      const cache = { container, request, singleton };
      return new Static(cache, this._resolver, "request") as this;
    } else {
      const { singleton } = this._cache;
      const container = new Map(singleton);
      const request = container;
      const cache = { container, request, singleton };
      return new Static(cache, this._resolver, "container") as this;
    }
  }

  public install(key: ProviderKey, provider: Provider): this {
    if (this._providers.has(key)) {
      const contextKey = typeof key === "symbol" ? key.toString() : key;
      const context = `Installing provider '${contextKey}'.`;
      const problem = `Provider key has already been used.`;
      const solution = `Please uninstall provider before installing.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (provider.install) provider.install(this);
    if (this._booted && provider.boot) provider.boot(this);
    this._providers.set(key, provider);
    return this;
  }

  public installed(key: ProviderKey): boolean {
    return this._providers.has(key);
  }

  public resolve<Result>(key: ResolveKey, ...args: unknown[]): Result {
    const resolveFn = this._resolver.get(key);
    if (typeof resolveFn === "undefined") {
      const contextKey =
        typeof key !== "string"
          ? typeof key !== "function"
            ? key.toString()
            : key.name
          : key;

      const context = `Resolving factory '${contextKey}'.`;
      const problem = `Resolve key not found.`;
      const solution = `Please bind a factory before resolving.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }
    const container = this.scope !== "request" ? this.fork("request") : this;
    return resolveFn(container, ...args) as Result;
  }

  public async shutdown(): Promise<void> {
    if (!this._booted) return;

    const shutdowns: Promise<void>[] = [];
    for (const provider of this._providers.values())
      if (provider.shutdown) shutdowns.push(provider.shutdown(this));
    await Promise.all(shutdowns);
    this._booted = false;
  }

  public unbind(key: ResolveKey): this {
    this._resolver.delete(key);
    return this;
  }

  public uninstall(key: ProviderKey): this {
    const provider = this._providers.get(key);
    if (typeof provider === "undefined") {
      const contextKey = typeof key === "symbol" ? key.toString() : key;
      const context = `Uninstalling provider '${contextKey}'.`;
      const problem = `Provider key not found.`;
      const solution = `Please install provider before uninstalling.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (this._booted && provider.shutdown)
      provider.shutdown(this).then(() => {
        if (provider.uninstall) provider.uninstall(this);
      });
    else if (provider.uninstall) provider.uninstall(this);
    this._providers.delete(key);
    return this;
  }
}
