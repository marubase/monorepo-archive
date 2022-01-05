import { CacheContract } from "./cache.contract.js";
import { Resolvable, ResolverContract } from "./resolver.contract.js";

export interface BindingContract {
  getDependencies(): BindingDependencies;

  getKey(): BindingKey;

  getResolver(): ResolverContract;

  getScope(): BindingScope;

  getTags(): BindingTags;

  resolve<Result>(cache: CacheContract, ...args: Array<unknown>): Result;

  resolveDependencies(): Array<unknown>;

  setDependencies(dependencies: BindingDependencies): this;

  setKey(key: BindingKey): this;

  setScope(scope: BindingScope): this;

  setTags(tags: BindingTags): this;
}

export type BindingDependencies = Array<Resolvable>;

export type BindingKey = string | symbol;

export type BindingScope = "container" | "request" | "singleton" | "transient";

export type BindingTag = string | symbol;

export type BindingTags = Array<BindingTag>;
