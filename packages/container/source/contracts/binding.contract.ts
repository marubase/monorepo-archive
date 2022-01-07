import { CacheContract } from "./cache.contract.js";
import { Resolvable, ResolverContract } from "./resolver.contract.js";

export interface BindingContract {
  readonly dependencies: BindingDependencies;

  readonly key?: BindingKey;

  readonly resolver: ResolverContract;

  readonly scope: BindingScope;

  readonly tags: BindingTags;

  clearDependencies(): this;

  clearKey(): this;

  clearTag(tag: BindingTag): this;

  hasTag(tag: BindingTag): boolean;

  resolve<Result>(cache: CacheContract, ...args: Array<unknown>): Result;

  resolveDependencies<Result = Array<unknown>>(
    cache: CacheContract,
    ...args: Array<unknown>
  ): Result;

  setDependencies(dependencies: BindingDependencies): this;

  setKey(key: BindingKey): this;

  setScope(scope: BindingScope): this;

  setTag(tag: BindingTag): this;
}

export type BindingArgs = Array<unknown>;

export type BindingDependencies = Array<Resolvable>;

export type BindingKey = string | symbol;

export type BindingScope = "container" | "request" | "singleton" | "transient";

export type BindingTag = string | symbol;

export type BindingTags = Array<BindingTag>;
