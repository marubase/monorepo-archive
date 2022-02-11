import {
  BindingKey,
  BindingTag,
  RegistryInterface,
  Resolvable,
} from "./registry.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export const ResolverContract = Symbol("ResolverContract");

export interface ResolverInterface {
  readonly bindingKey?: BindingKey;

  readonly bindingTags: BindingTag[];

  readonly dependencies: Resolvable[];

  readonly registry: RegistryInterface;

  readonly scope: ResolverScope;

  clearBindingKey(): this;

  clearBindingTag(bindingTag: BindingTag): this;

  clearBindingTags(): this;

  clearDependencies(): this;

  resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result;

  resolveDependencies(scope: ScopeInterface): unknown[];

  setBindingKey(bindingKey: BindingKey): this;

  setBindingTag(tag: BindingTag): this;

  setBindingTags(tags: BindingTag[]): this;

  setDependencies(dependencies: Resolvable[]): this;

  setScope(scope: ResolverScope): this;
}

export type ResolverScope = "container" | "request" | "singleton" | "transient";
