import { ContainerContext } from "./container.js";
import { ResolverContract } from "./resolver.js";

export interface RegistryContract {
  bind(bindable: Bindable): RegistryBinding;

  clearResolverByKey(key: RegistryKey): this;

  clearResolverByTag(tag: RegistryTag): this;

  createClassResolver(target: Function, ...args: unknown[]): ResolverContract;

  createConstantResolver(constant: unknown): ResolverContract;

  createFunctionResolver(
    target: Function,
    ...args: unknown[]
  ): ResolverContract;

  createKeyResolver(key: RegistryKey, ...args: unknown[]): ResolverContract;

  createMethodResolver(
    target: Function | Object,
    method: string | symbol,
    ...args: unknown[]
  ): ResolverContract;

  createTagResolver(tag: RegistryTag, ...args: unknown[]): ResolverContract[];

  getResolverByKey(key: RegistryKey): ResolverContract;

  getResolverByTag(tag: RegistryTag): ResolverContract[];

  resolve<Result>(
    context: ContainerContext,
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

export type RegistryKey = string | symbol;

export type RegistryTag = string | symbol;

export type RegistryTags = RegistryTag[];

export type Resolvable = Function | string | symbol;
