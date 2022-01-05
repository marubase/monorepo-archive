import { CacheContract } from "./cache.contract.js";
import { Resolvable, ResolverContract } from "./resolver.contract.js";

export interface BindingContract {
  getArgs(): Array<unknown>;

  getDependencies(): BindingDependencies;

  getKey(): BindingKey | undefined;

  getResolver(): ResolverContract;

  getScope(): BindingScope;

  getTags(): BindingTags;

  resolve<Result>(cache: CacheContract, ...args: Array<unknown>): Result;

  resolveDependencies(cache: CacheContract): Array<unknown>;

  setArgs(args: Array<unknown>): this;

  setDependencies(dependencies: BindingDependencies): this;

  setKey(key: BindingKey | undefined): this;

  setScope(scope: BindingScope): this;

  setTags(tags: BindingTags): this;
}

export type BindingDependencies = Array<Resolvable>;

export type BindingKey = string | symbol;

export type BindingScope = "container" | "request" | "singleton" | "transient";

export type BindingTag = string | symbol;

export type BindingTags = Array<BindingTag>;
