import { RegistryContract, Resolvable } from "./registry.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ResolverContract {
  new (registry: RegistryContract): this;

  getDependencies(): ResolverDependencies;

  getKey(): ResolverKey | undefined;

  getRegistry(): RegistryContract | undefined;

  getScope(): ResolverScope;

  getTags(): ResolverTags;

  resolve<Result>(scope: ScopeContract, ...args: Array<unknown>): Result;

  resolveDependencies(scope: ScopeContract): Array<unknown>;

  setDependencies(dependencies: ResolverDependencies): this;

  setKey(key: ResolverKey): this;

  setScope(scope: ResolverScope): this;

  setTags(tags: ResolverTags): this;
}

export type ResolverDependencies = Array<Resolvable>;

export type ResolverKey = string | symbol;

export type ResolverScope = "container" | "request" | "singleton" | "transient";

export type ResolverTag = string | symbol;

export type ResolverTags = Array<ResolverTag>;
