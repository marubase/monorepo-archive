import { ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface RegistryContract {
  bind(bindable: Bindable): RegistryBinding;

  call<Result>(
    scope: ScopeContract,
    callable: Callable,
    ...args: unknown[]
  ): Result;

  clearResolverByKey(bindingKey: BindingKey): this;

  clearResolverByTag(bindingTag: BindingTag, resolver: ResolverContract): this;

  createAliasResolver(alias: Bindable): ResolverContract;

  createClassResolver(target: Function): ResolverContract;

  createConstantResolver(constant: unknown): ResolverContract;

  createFunctionResolver(target: Function): ResolverContract;

  createKeyResolver(key: BindingKey): ResolverContract;

  createMethodResolver(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(tag: BindingTag): ResolverContract;

  fetch(resolvable: Resolvable): ResolverContract | undefined;

  getResolverByKey(bindingKey: BindingKey): ResolverContract | undefined;

  getResolverByTag(bindingTag: BindingTag): ResolverContract[];

  resolve<Result>(
    scope: ScopeContract,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result;

  setResolverByKey(bindingKey: BindingKey, resolver: ResolverContract): this;

  setResolverByTag(bindingTag: BindingTag, resolver: ResolverContract): this;

  unbind(bindable: Bindable): Map<BindingToken, ResolverContract>;
}

export const BindingAlias = Symbol("alias");

export const BindingRoot = Symbol("root");

export type Bindable = Function | string | symbol;

export type BindingKey = [BindingToken, BindingToken];

export type BindingTag = Function | string | symbol;

export type BindingToken = Function | string | symbol;

export type Callable = [Object, string | symbol];

export type RegistryBinding = {
  to(target: Function): ResolverContract;

  toAlias(alias: Bindable): ResolverContract;

  toClass(target: Function): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toFunction(target: Function): ResolverContract;

  toInstance(instance: unknown): ResolverContract;

  toKey(key: BindingKey): ResolverContract;

  toMethod(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverContract;

  toSelf(): ResolverContract;

  toTag(tag: BindingTag): ResolverContract;
};

export type RegistryFactory = {
  createAliasResolver(
    registry: RegistryContract,
    alias: Bindable,
  ): ResolverContract;

  createClassResolver(
    registry: RegistryContract,
    target: Function,
  ): ResolverContract;

  createConstantResolver(
    registry: RegistryContract,
    constant: unknown,
  ): ResolverContract;

  createFunctionResolver(
    registry: RegistryContract,
    target: Function,
  ): ResolverContract;

  createKeyResolver(
    registry: RegistryContract,
    key: BindingKey,
  ): ResolverContract;

  createMethodResolver(
    registry: RegistryContract,
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(
    registry: RegistryContract,
    tag: BindingTag,
  ): ResolverContract;
};

export type Resolvable = [BindingToken, BindingToken] | BindingToken;
