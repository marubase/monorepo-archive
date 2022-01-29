import { ResolverContract } from "./resolver.js";
import { ScopeContract } from "./scope.js";

export interface RegistryContract {
  bind(bindable: Bindable): RegistryBinding;

  clearResolverByKey(bindingKey: BindingKey): this;

  clearResolverByTag(bindingTag: BindingTag, resolver: ResolverContract): this;

  createClassResolver(target: Function): ResolverContract;

  createConstantResolver(constant: unknown): ResolverContract;

  createFunctionResolver(target: Function): ResolverContract;

  createKeyResolver(key: BindingKey): ResolverContract;

  createMethodResolver(
    target: Function | Object,
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
}

export type Bindable = [BindingToken, BindingToken] | BindingToken;

export type BindingKey = [BindingToken, BindingToken] | BindingToken;

export type BindingTag = Function | string | symbol;

export type BindingToken = Function | string | symbol;

export type RegistryBinding = {
  to(target: Function): ResolverContract;

  toAlias(alias: BindingKey): ResolverContract;

  toClass(target: Function): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toFunction(target: Function): ResolverContract;

  toKey(key: BindingKey): ResolverContract;

  toMethod(
    target: Function | Object,
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
    key: BindingKey,
  ): ResolverContract;

  createMethodResolver(
    registry: RegistryContract,
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(
    registry: RegistryContract,
    tag: BindingTag,
  ): ResolverContract;
};

export type Resolvable = [BindingToken, BindingToken] | BindingToken;
