import { ResolverInterface } from "./resolver.contract.js";
import { ScopeInterface } from "./scope.contract.js";

export interface RegistryInterface {
  bind(bindable: Bindable): RegistryBinding;

  call<Result>(
    scope: ScopeInterface,
    callable: Callable,
    ...args: unknown[]
  ): Result;

  clearResolverByKey(bindingKey: BindingKey): this;

  clearResolverByTag(bindingTag: BindingTag, resolver: ResolverInterface): this;

  createAliasResolver(alias: Bindable): ResolverInterface;

  createClassResolver(target: Function): ResolverInterface;

  createConstantResolver(constant: unknown): ResolverInterface;

  createFunctionResolver(target: Function): ResolverInterface;

  createKeyResolver(key: BindingKey): ResolverInterface;

  createMethodResolver(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverInterface;

  createTagResolver(tag: BindingTag): ResolverInterface;

  fetch(resolvable: Resolvable): ResolverInterface | undefined;

  fork(): this;

  getResolverByKey(bindingKey: BindingKey): ResolverInterface | undefined;

  getResolverByTag(bindingTag: BindingTag): ResolverInterface[];

  resolve<Result>(
    scope: ScopeInterface,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result;

  setResolverByKey(bindingKey: BindingKey, resolver: ResolverInterface): this;

  setResolverByTag(bindingTag: BindingTag, resolver: ResolverInterface): this;

  unbind(bindable: Bindable): Map<BindingToken, ResolverInterface>;
}

export const BindingAlias = Symbol("alias");

export const BindingRoot = Symbol("root");

export type Bindable = Function | string | symbol;

export type BindingKey = [BindingToken, BindingToken];

export type BindingTag = Function | string | symbol;

export type BindingToken = Function | string | symbol;

export type Callable = [Object, string | symbol];

export type RegistryBinding = {
  to(target: Function): ResolverInterface;

  toAlias(alias: Bindable): ResolverInterface;

  toClass(target: Function): ResolverInterface;

  toConstant(constant: unknown): ResolverInterface;

  toFunction(target: Function): ResolverInterface;

  toInstance(instance: unknown): ResolverInterface;

  toKey(key: BindingKey): ResolverInterface;

  toMethod(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverInterface;

  toSelf(): ResolverInterface;

  toTag(tag: BindingTag): ResolverInterface;
};

export type RegistryFactory = {
  createAliasResolver(
    registry: RegistryInterface,
    alias: Bindable,
  ): ResolverInterface;

  createClassResolver(
    registry: RegistryInterface,
    target: Function,
  ): ResolverInterface;

  createConstantResolver(
    registry: RegistryInterface,
    constant: unknown,
  ): ResolverInterface;

  createFunctionResolver(
    registry: RegistryInterface,
    target: Function,
  ): ResolverInterface;

  createKeyResolver(
    registry: RegistryInterface,
    key: BindingKey,
  ): ResolverInterface;

  createMethodResolver(
    registry: RegistryInterface,
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverInterface;

  createTagResolver(
    registry: RegistryInterface,
    tag: BindingTag,
  ): ResolverInterface;
};

export type Resolvable = [BindingToken, BindingToken] | BindingToken;
