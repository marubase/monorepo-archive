import { CacheContract } from "./cache.contract.js";
import {
  Bindable,
  Resolvable,
  ResolverBinding,
  ResolverContract,
} from "./resolver.contract.js";

export interface ContainerContract {
  readonly booted: boolean;

  readonly cache: CacheContract;

  readonly resolver: ResolverContract;

  readonly services: [ServiceName, ServiceProvider][];

  bind(bindable: Bindable): ResolverBinding;

  boot(): Promise<void>;

  fork(): this;

  install(name: ServiceName, service: ServiceProvider): this;

  installed(name: ServiceName): boolean;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  shutdown(): Promise<void>;

  uninstall(name: ServiceName): this;
}

export type ServiceName = string | symbol;

export type ServiceProvider = {
  onBoot?(container: ContainerContract): Promise<void>;
  onInstall?(container: ContainerContract): void;
  onShutdown?(container: ContainerContract): Promise<void>;
  onUninstall?(container: ContainerContract): void;
};
