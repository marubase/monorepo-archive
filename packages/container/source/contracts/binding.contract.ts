import { CacheContract } from "./cache.contract.js";
import { Resolvable, ResolverContract } from "./resolver.contract.js";

export interface BindingContract {
  readonly dependencies: BindingDependencies;

  readonly key?: BindingKey;

  readonly resolver: ResolverContract;

  readonly scope: BindingScope;

  readonly tags: BindingTag[];

  clearDependencies(): this;

  clearKey(): this;

  clearTag(tag: BindingTag): this;

  clearTags(): this;

  hasTag(tag: BindingTag): boolean;

  resolve<Result>(cache: CacheContract, ...args: unknown[]): Result;

  resolveDependencies(cache: CacheContract, ...args: unknown[]): unknown[];

  setDependencies(dependencies: BindingDependencies): this;

  setKey(key: BindingKey): this;

  setScope(scope: BindingScope): this;

  setTag(tag: BindingTag): this;

  setTags(tags: BindingTag[]): this;
}

export type BindingDependencies = Resolvable[];

export type BindingKey = string | symbol;

export type BindingScope = "container" | "request" | "singleton" | "transient";

export type BindingTag = string | symbol;
