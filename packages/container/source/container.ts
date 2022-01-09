import { Cache } from "./cache.js";
import { CacheContract } from "./contracts/cache.contract.js";
import {
  ContainerContract,
  ServiceName,
  ServiceProvider,
} from "./contracts/container.contract.js";
import {
  Bindable,
  Resolvable,
  ResolverBinding,
  ResolverContract,
} from "./contracts/resolver.contract.js";
import { DefaultBindingFactory, Resolver } from "./resolver.js";

export class Container implements ContainerContract {
  protected _booted = false;

  protected _cache: CacheContract = new Cache();

  protected _resolver: ResolverContract = new Resolver(DefaultBindingFactory);

  protected _services: Map<ServiceName, ServiceProvider> = new Map();

  public constructor(parent?: Container) {
    if (typeof parent !== "undefined") {
      this._cache = parent.cache.fork("container");
      this._resolver = parent.resolver.fork();
      this._services = new Map(parent._services);
    }
    this.bind(this.constructor.name).toConstant(this);
  }

  public get booted(): boolean {
    return this._booted;
  }

  public get cache(): CacheContract {
    return this._cache;
  }

  public get resolver(): ResolverContract {
    return this._resolver;
  }

  public get services(): [ServiceName, ServiceProvider][] {
    return Array.from(this._services);
  }

  public bind(bindable: Bindable): ResolverBinding {
    return this._resolver.bind(bindable);
  }

  public async boot(): Promise<void> {
    if (this._booted) return Promise.resolve();
    for (const [, service] of this._services)
      if (service.onBoot) await service.onBoot(this);
    this._booted = true;
  }

  public bound(bindable: Bindable): boolean {
    return this._resolver.bound(bindable);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(this) as this;
  }

  public install(name: ServiceName, service: ServiceProvider): this {
    if (this._booted) {
      this._services.set(name, service);
      if (service.onInstall) service.onInstall(this);
      if (service.onBoot) service.onBoot(this);
      return this;
    } else {
      this._services.set(name, service);
      if (service.onInstall) service.onInstall(this);
      return this;
    }
  }

  public installed(name: ServiceName): boolean {
    return this._services.has(name);
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._resolver.resolve(
      this._cache.fork("request"),
      resolvable,
      ...args,
    );
  }

  public async shutdown(): Promise<void> {
    if (!this._booted) return Promise.resolve();
    for (const [, service] of this._services)
      if (service.onShutdown) await service.onShutdown(this);
    for (const [, service] of this._services)
      if (service.onUninstall) service.onUninstall(this);
    this._booted = false;
  }

  public unbind(bindable: Bindable): this {
    this._resolver.unbind(bindable);
    return this;
  }

  public uninstall(name: ServiceName): this {
    const service = this._services.get(name);
    if (typeof service === "undefined") return this;
    if (this._booted) {
      const promise = service.onShutdown
        ? service.onShutdown(this)
        : Promise.resolve();
      promise.then(() => {
        if (service.onUninstall) service.onUninstall(this);
        this._services.delete(name);
      });
      return this;
    } else {
      if (service.onUninstall) service.onUninstall(this);
      this._services.delete(name);
      return this;
    }
  }
}
