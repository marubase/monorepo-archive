import { CacheContract } from "./cache.js";
import { ProviderContract, ProviderName } from "./provider.js";
import {
  Bindable,
  RegistryBinding,
  RegistryContract,
  Resolvable,
} from "./registry.js";

export interface ContainerContract {
  readonly context: ContainerContract;

  readonly parent: ContainerContract;

  readonly registry: RegistryContract;

  bind(bindable: Bindable): RegistryBinding;

  boot(): Promise<void>;

  fork(type: ContainerForkType): ContainerContract;

  install(name: ProviderName, provider: ProviderContract): this;

  installed(name: ProviderName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  shutdown(): Promise<void>;

  uninstall(name: ProviderName): this;
}

export type ContainerContext = {
  container: CacheContract;
  request: CacheContract;
  singleton: CacheContract;
};

export type ContainerForkType = "container" | "request";
