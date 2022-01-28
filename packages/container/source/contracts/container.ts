import { ProviderContract, ProviderName } from "./provider.js";
import {
  Bindable,
  RegistryBinding,
  RegistryContract,
  Resolvable,
} from "./registry.js";
import { ScopeContract } from "./scope.js";

export interface ContainerContract {
  readonly booted: boolean;

  readonly providers: Record<ProviderName, ProviderContract>;

  readonly registry: RegistryContract;

  readonly scope: ScopeContract;

  bind(bindable: Bindable): RegistryBinding;

  boot(): Promise<void>;

  bound(bindable: Bindable): boolean;

  fork(): this;

  install(name: ProviderName, provider: ProviderContract): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  shutdown(): Promise<void>;

  unbind(bindable: Bindable): this;

  uninstall(name: ProviderName): this;
}
