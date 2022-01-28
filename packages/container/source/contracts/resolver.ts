import {
  RegistryContract,
  RegistryKey,
  RegistryTag,
  RegistryTags,
  Resolvable,
} from "./registry.js";
import { ScopeContract } from "./scope.js";

export interface ResolverContract {
  readonly dependencies: Resolvable[];

  readonly key?: RegistryKey;

  readonly registry: RegistryContract;

  readonly scope: ResolverScope;

  readonly tags: RegistryTags;

  clearDependencies(): this;

  clearKey(): this;

  clearTag(tag: RegistryTag): this;

  clearTags(): this;

  resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result;

  resolveDependencies(scope: ScopeContract): unknown[];

  setDependencies(dependencies: Resolvable[]): this;

  setKey(key: RegistryKey): this;

  setScope(scope: ResolverScope): this;

  setTag(tag: RegistryTag): this;

  setTags(tags: RegistryTags): this;
}

export type ResolverScope = "container" | "request" | "singleton" | "transient";