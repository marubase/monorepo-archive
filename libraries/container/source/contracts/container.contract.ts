export const ContainerContract = Symbol("ContainerContract");

export interface ContainerInterface {
  readonly booted: boolean;

  readonly cache: ContainerCache;

  readonly providers: ProviderMap;

  readonly resolver: ContainerResolver;

  readonly scope: ContainerScope;

  bind(key: ResolveKey, factoryFn: ResolveFactory, options?: BindOptions): this;

  boot(): Promise<void>;

  bound(key: ResolveKey): boolean;

  fork(): this;
  fork(scope: ContainerScope): this;

  install(key: ProviderKey, provider: Provider): this;

  installed(key: ProviderKey): boolean;

  resolve<Result>(key: ResolveKey, ...args: unknown[]): Result;

  shutdown(): Promise<void>;

  unbind(key: ResolveKey): this;

  uninstall(key: ProviderKey): this;
}

export type BindOptions = {
  scope?: ResolveScope;
};

export type ContainerCache = {
  container: Map<ResolveKey, unknown>;
  request: Map<ResolveKey, unknown>;
  singleton: Map<ResolveKey, unknown>;
};

export type ContainerResolver = Map<ResolveKey, ResolveFactory>;

export type ContainerScope = "container" | "request";

export type ResolveFactory = (
  container: ContainerInterface,
  ...args: unknown[]
) => unknown;

export type ResolveKey = Function | string | symbol;

export type ResolveScope = "container" | "request" | "singleton";

export type Provider = {
  boot?(container: ContainerInterface): Promise<void>;
  install?(container: ContainerInterface): void;
  shutdown?(container: ContainerInterface): Promise<void>;
  uninstall?(container: ContainerInterface): void;
};

export type ProviderKey = string | symbol;

export type ProviderMap = Map<ProviderKey, Provider>;
