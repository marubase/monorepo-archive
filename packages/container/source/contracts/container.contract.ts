import { ProviderInterface, ProviderName } from "./provider.contract.js";
import {
  Bindable,
  Callable,
  RegistryBinding,
  RegistryInterface,
  Resolvable,
} from "./registry.contract.js";
import { ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export interface ContainerInterface {
  readonly booted: boolean;

  readonly providers: Record<ProviderName, ProviderInterface>;

  readonly registry: RegistryInterface;

  readonly scope: ScopeInterface;

  bind(bindable: Bindable): RegistryBinding;

  boot(): Promise<void>;

  call<Result>(callable: Callable, ...args: unknown[]): Result;

  fetch(resolvable: Resolvable): ResolverInterface | undefined;

  fork(): this;

  install(name: ProviderName, provider: ProviderInterface): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  shutdown(): Promise<void>;

  unbind(bindable: Bindable): this;

  uninstall(name: ProviderName): this;
}
