import {
  BindingKey,
  BindingTag,
  RegistryContract,
  Resolvable,
} from "./registry.js";
import { ScopeContract } from "./scope.js";

export interface ResolverContract {
  readonly bindingKey?: BindingKey;

  readonly bindingTags: BindingTag[];

  readonly dependencies: Resolvable[];

  readonly registry: RegistryContract;

  readonly scope: ResolverScope;

  clearBindingKey(): this;

  clearBindingTag(bindingTag: BindingTag): this;

  clearBindingTags(): this;

  clearDependencies(): this;

  resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result;

  resolveDependencies(scope: ScopeContract): unknown[];

  setBindingKey(bindingKey: BindingKey): this;

  setBindingTag(tag: BindingTag): this;

  setBindingTags(tags: BindingTag[]): this;

  setDependencies(dependencies: Resolvable[]): this;

  setScope(scope: ResolverScope): this;
}

export type ResolverScope = "container" | "request" | "singleton" | "transient";
