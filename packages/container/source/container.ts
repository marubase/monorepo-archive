import { ContainerContract } from "./contracts/container.contract.js";
import {
  ProviderContract,
  ProviderName,
} from "./contracts/provider.contract.js";
import {
  Bindable,
  BindingRoot,
  Callable,
  RegistryBinding,
  RegistryContract,
  Resolvable,
} from "./contracts/registry.contract.js";
import { ResolverContract } from "./contracts/resolver.contract.js";
import { ScopeContract } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";

export class Container implements ContainerContract {
  protected _booted = false;

  protected _providers: Map<ProviderName, ProviderContract> = new Map();

  protected _registry: RegistryContract;

  protected _scope: ScopeContract;

  public constructor(registry?: RegistryContract, scope?: ScopeContract) {
    this._registry = registry || new Registry();
    this._scope = scope || new Scope();
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

  public call<Result>(callable: Callable, ...args: unknown[]): Result {
    const scope = this._scope.fork("request", [BindingRoot, BindingRoot]);
    return this._registry.fork().call(scope, callable, ...args);
  }

  public fetch(resolvable: Resolvable): ResolverContract | undefined {
    return this._registry.fetch(resolvable);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(
      this._registry.fork(),
      this._scope.fork("container"),
    ) as this;
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
    const scope = this._scope.fork("request", resolvable);
    return this._registry.fork().resolve(scope, resolvable, ...args);
  }

  public async shutdown(): Promise<void> {
    if (!this._booted) return;
    for (const [, provider] of this._providers)
      if (provider.shutdown) provider.shutdown(this);
    this._booted = false;
  }

  public unbind(bindable: Bindable): this {
    const resolvers = this._registry.unbind(bindable);
    for (const [method] of resolvers)
      this._scope.singleton.clear([bindable, method]);
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
