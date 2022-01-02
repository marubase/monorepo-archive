import { ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface RegistryContract {
  new (factory: ResolverFactory): this;

  bind(bindable: Bindable): Binding;

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
    resolvable: Resolvable,
    scope: ScopeContract,
    ...args: Array<unknown>
  ): Result;

  setByKey(key: ResolvableKey, resolver: ResolverContract): this;

  setByTag(tag: ResolvableTag, resolver: ResolverContract): this;
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
  | [Function, string | symbol] // Static method
  | [Object, string | symbol] // Instance method
  | [string, string | symbol] // Resolvable method
  | [symbol, string | symbol] // Resolvable method
  | Function // Resolvable, Constructor, Function
  | string // Resolvable
  | symbol; // Resolvable

export type ResolvableKey = string | symbol;

export type ResolvableTag = string | symbol;

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
