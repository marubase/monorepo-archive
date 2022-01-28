import {
  RegistryContract,
  RegistryKey,
  RegistryTag,
  RegistryTags,
  Resolvable,
} from "./registry.js";
import { ScopeContract } from "./scope.js";

export interface ResolverContract {
  readonly bindingKey?: RegistryKey;

  readonly dependencies: Resolvable[];

  readonly registry: RegistryContract;

  readonly scope: ResolverScope;

  readonly tags: RegistryTags;

  clearBindingKey(): this;

  clearDependencies(): this;

  clearTag(tag: RegistryTag): this;

  clearTags(): this;

  resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result;

  resolveDependencies(scope: ScopeContract): unknown[];

  setBindingKey(bindingKey: RegistryKey): this;

  setDependencies(dependencies: Resolvable[]): this;

  setScope(scope: ResolverScope): this;

  setTag(tag: RegistryTag): this;

  setTags(tags: RegistryTags): this;
}

export type ResolverScope = "container" | "request" | "singleton" | "transient";
