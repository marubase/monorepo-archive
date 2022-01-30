import { ResolverContract } from "./resolver.js";
import { ScopeContract } from "./scope.js";

export interface RegistryContract {
  bind(bindable: Bindable): RegistryBinding;

  clearResolverByKey(bindingKey: BindingKey): this;

  clearResolverByTag(bindingTag: BindingTag, resolver: ResolverContract): this;

  createClassResolver(target: Function): ResolverContract;

  createConstantResolver(constant: unknown): ResolverContract;

  createFunctionResolver(target: Function): ResolverContract;

  createKeyResolver(key: Resolvable): ResolverContract;

  createMethodResolver(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(tag: BindingTag): ResolverContract;

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

export const BindingRoot = Symbol("root");

export type Bindable = Function | string | symbol;

export type BindingKey = [BindingToken, BindingToken];

export type BindingTag = Function | string | symbol;

export type BindingToken = Function | string | symbol;

export type RegistryBinding = {
  to(target: Function): ResolverContract;

  toAlias(alias: Resolvable): ResolverContract;

  toClass(target: Function): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toFunction(target: Function): ResolverContract;

  toKey(key: Resolvable): ResolverContract;

  toMethod(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverContract;

  toSelf(): ResolverContract;

  toTag(tag: BindingTag): ResolverContract;
};

export type RegistryFactory = {
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
    key: Resolvable,
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
