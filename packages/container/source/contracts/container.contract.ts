import { ProviderContract, ProviderName } from "./provider.contract.js";
import {
  Bindable,
  Callable,
  RegistryBinding,
  RegistryContract,
  Resolvable,
} from "./registry.contract.js";
import { ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ContainerContract {
  readonly booted: boolean;

  readonly providers: Record<ProviderName, ProviderContract>;

  readonly registry: RegistryContract;

  readonly scope: ScopeContract;

  bind(bindable: Bindable): RegistryBinding;

  boot(): Promise<void>;

  call<Result>(callable: Callable, ...args: unknown[]): Result;

  fetch(resolvable: Resolvable): ResolverContract | undefined;

  fork(): this;

  install(name: ProviderName, provider: ProviderContract): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  shutdown(): Promise<void>;

  unbind(bindable: Bindable): this;

  uninstall(name: ProviderName): this;
}
