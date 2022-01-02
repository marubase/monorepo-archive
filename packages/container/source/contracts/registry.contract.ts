import { ResolverContract, ResolverDependencies } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface RegistryContract {
  new (factory: ResolverFactory): this;

  bind(bindable: Bindable): Binding;

  bound(bindable: Bindable): boolean;

  clearByKey(key: ResolvableKey, resolver: ResolverContract): this;

  clearByTag(tag: ResolvableTag, resolver: ResolverContract): this;

  createAliasResolver(alias: ResolvableKey): ResolverContract;

  createConstantResolver(constant: unknown): ResolverContract;

  createConstructorResolver(target: Function): ResolverContract;

  createFunctionResolver(target: Function): ResolverContract;

  createMethodResolver(
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(tag: ResolvableTag): ResolverContract;

  getByKey(key: ResolvableKey): ResolverContract | undefined;

  getByTag(tag: ResolvableTag): Array<ResolverContract>;

  resolve<Result>(
    scope: ScopeContract,
    resolvable: Resolvable,
    ...args: Array<unknown>
  ): Result;

  resolveAlias<Result>(
    scope: ScopeContract,
    alias: ResolvableKey,
    ...args: Array<unknown>
  ): Result;

  resolveClass<Result>(
    scope: ScopeContract,
    target: Function,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveConstant<Result>(scope: ScopeContract, constant: unknown): Result;

  resolveConstructor<Result>(
    scope: ScopeContract,
    target: Function,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveFactory<Result>(
    scope: ScopeContract,
    resolvable: Resolvable,
  ): ResolveFactory<Result>;

  resolveFunction<Result>(
    scope: ScopeContract,
    target: Function,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveMethod<Result>(
    scope: ScopeContract,
    target: Function | Object,
    method: string | symbol,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveTag<Result>(
    scope: ScopeContract,
    tag: ResolvableTag,
    ...args: Array<unknown>
  ): Result;

  setByKey(key: ResolvableKey, resolver: ResolverContract): this;

  setByTag(tag: ResolvableTag, resolver: ResolverContract): this;

  unbind(bindable: Bindable): this;
}

export type Bindable = Function | ResolvableKey;

export type Binding = {
  toAlias(alias: ResolvableKey): ResolverContract;

  toClass(target: Function): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toConstructor(target: Function): ResolverContract;

  toFunction(target: Function): ResolverContract;

  toMethod(
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  toTag(tag: ResolvableTag): ResolverContract;
};

export type Resolvable =
  | [Function | string | symbol, string | symbol] // ResolvableKey method
  | Function // ResolvableKey
  | string // ResolvableKey
  | symbol; // ResolvableKey

export type ResolvableKey = string | symbol;

export type ResolvableTag = string | symbol;

export type ResolveFactory<Result> = (...args: Array<unknown>) => Result;

export type ResolverFactory = {
  createAliasResolver(
    registry: RegistryContract,
    alias: ResolvableKey,
  ): ResolverContract;

  createConstantResolver(
    registry: RegistryContract,
    constant: unknown,
  ): ResolverContract;

  createConstructorResolver(
    registry: RegistryContract,
    target: Function,
  ): ResolverContract;

  createFactoryResolver(
    registry: RegistryContract,
    resolvable: Resolvable,
  ): ResolverContract;

  createFunctionResolver(
    registry: RegistryContract,
    target: Function,
  ): ResolverContract;

  createMethodResolver(
    registry: RegistryContract,
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(
    registry: RegistryContract,
    tag: ResolvableTag,
  ): ResolverContract;
};
