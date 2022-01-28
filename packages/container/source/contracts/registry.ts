import { ResolverContract } from "./resolver.js";
import { ScopeContract } from "./scope.js";

export interface RegistryContract {
  bind(bindable: Bindable): RegistryBinding;

  clearResolverByKey(key: RegistryKey): this;

  clearResolverByTag(tag: RegistryTag, resolver: ResolverContract): this;

  createClassResolver(target: Function): ResolverContract;

  createConstantResolver(constant: unknown): ResolverContract;

  createFunctionResolver(target: Function): ResolverContract;

  createKeyResolver(key: RegistryKey): ResolverContract;

  createMethodResolver(
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(tag: RegistryTag): ResolverContract;

  getResolverByKey(key: RegistryKey): ResolverContract | undefined;

  getResolverByTag(tag: RegistryTag): ResolverContract[];

  resolve<Result>(
    scope: ScopeContract,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result;

  setResolverByKey(key: RegistryKey, resolver: ResolverContract): this;

  setResolverByTag(tag: RegistryTag, resolver: ResolverContract): this;
}

export type Bindable = Function | string | symbol;

export type RegistryBinding = {
  to(target: Function): ResolverContract;

  toAlias(alias: RegistryKey): ResolverContract;

  toClass(target: Function): ResolverContract;

  toConstant(constant: unknown): ResolverContract;

  toFunction(target: Function): ResolverContract;

  toKey(key: RegistryKey): ResolverContract;

  toMethod(
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  toSelf(): ResolverContract;

  toTag(tag: RegistryTag): ResolverContract;
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
    key: RegistryKey,
  ): ResolverContract;

  createMethodResolver(
    registry: RegistryContract,
    target: Function | Object,
    method: string | symbol,
  ): ResolverContract;

  createTagResolver(
    registry: RegistryContract,
    tag: RegistryTag,
  ): ResolverContract;
};

export type RegistryKey = string | symbol;

export type RegistryTag = string | symbol;

export type RegistryTags = RegistryTag[];

export type Resolvable = Function | string | symbol;
