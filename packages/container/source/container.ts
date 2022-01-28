import { ContainerContract } from "./contracts/container.js";
import { ProviderContract, ProviderName } from "./contracts/provider.js";
import {
  Bindable,
  RegistryBinding,
  RegistryContract,
  Resolvable,
} from "./contracts/registry.js";
import { ScopeContract } from "./contracts/scope.js";
import { ContainerError } from "./index.js";

export class Container implements ContainerContract {
  protected _booted = false;

  protected _providers: Map<ProviderName, ProviderContract> = new Map();

  protected _registry: RegistryContract;

  protected _scope: ScopeContract;

  public constructor(registry: RegistryContract, scope: ScopeContract) {
    this._registry = registry;
    this._scope = scope;
  }

  public get booted(): boolean {
    return this._booted;
  }

  public get providers(): Record<ProviderName, ProviderContract> {
    return Object.fromEntries(this._providers);
  }

  public get registry(): RegistryContract {
    return this._registry;
  }

  public get scope(): ScopeContract {
    return this._scope;
  }

  public bind(bindable: Bindable): RegistryBinding {
    return this._registry.bind(bindable);
  }

  public async boot(): Promise<void> {
    if (this._booted) return;
    for (const [, provider] of this._providers)
      if (provider.boot) await provider.boot(this);
    this._booted = true;
  }

  public bound(bindable: Bindable): boolean {
    const registryKey =
      typeof bindable === "function" ? bindable.name : bindable;
    const resolver = this._registry.getResolverByKey(registryKey);
    return typeof resolver !== "undefined";
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(this._registry, this._scope.fork("container")) as this;
  }

  public install(name: ProviderName, provider: ProviderContract): this {
    if (this._providers.has(name)) {
      const contextName = typeof name === "symbol" ? name.toString() : name;
      const context = `Installing provider named '${contextName}'.`;
      const problem = `Provider already installed at that name.`;
      const solution = `Please install on another name or uninstall existing provider before installing again.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }
    if (provider.install) provider.install(this);
    if (this._booted && provider.boot) provider.boot(this);
    this._providers.set(name, provider);
    return this;
  }

  public installed(name: ProviderName): boolean {
    return this._providers.has(name);
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    const scope = this._scope.fork("request");
    return this._registry.resolve(scope, resolvable, ...args);
  }

  public async shutdown(): Promise<void> {
    if (!this._booted) return;
    for (const [, provider] of this._providers)
      if (provider.shutdown) provider.shutdown(this);
    this._booted = false;
  }

  public unbind(bindable: Bindable): this {
    const registryKey =
      typeof bindable === "function" ? bindable.name : bindable;
    const resolver = this._registry.getResolverByKey(registryKey);
    if (typeof resolver !== "undefined") resolver.clearBindingKey();
    return this;
  }

  public uninstall(name: ProviderName): this {
    const provider = this._providers.get(name);
    if (typeof provider === "undefined") {
      const contextName = typeof name === "symbol" ? name.toString() : name;
      const context = `Uninstalling provider named '${contextName}'.`;
      const problem = `No provider installed at that name.`;
      const solution = `Please uninstall another provider.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }
    if (this._booted && provider.shutdown)
      provider.shutdown(this).then(() => {
        if (provider.uninstall) provider.uninstall(this);
      });
    else if (provider.uninstall) provider.uninstall(this);
    this._providers.delete(name);
    return this;
  }
}
