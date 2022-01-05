import {
  BindingContract,
  BindingDependencies,
  BindingKey,
  BindingTag,
} from "./binding.contract.js";
import { CacheContract } from "./cache.contract.js";

export interface ResolverContract {
  clearBindingByKey(key: BindingKey): this;

  clearBindingByTag(tag: BindingTag, binding: BindingContract): this;

  createAliasBinding(alias: BindingKey): BindingContract;

  createConstantBinding(constant: unknown): BindingContract;

  createConstructorBinding(target: Function): BindingContract;

  createFactoryBinding(resolvable: Resolvable): BindingContract;

  createFunctionBinding(target: Function): BindingContract;

  createMethodBinding(
    target: Function | Object,
    method: string | symbol,
  ): BindingContract;

  createTagBinding(tag: BindingTag): BindingContract;

  getBindingByKey(key: BindingKey): BindingContract;

  getBindingByTags(tag: BindingTag): Array<BindingContract>;

  hasBindingByKey(key: BindingKey): boolean;

  hasBindingByTag(tag: BindingTag, binding: BindingContract): boolean;

  resolve<Result>(
    cache: CacheContract,
    resolvable: Resolvable,
    ...args: Array<unknown>
  ): Result;

  resolveAlias<Result>(
    cache: CacheContract,
    alias: BindingKey,
    ...args: Array<unknown>
  ): Result;

  resolveClass<Result>(
    cache: CacheContract,
    target: Function,
    dependencies: BindingDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveConstant<Result>(cache: CacheContract, constant: unknown): Result;

  resolveConstructor<Result>(
    cache: CacheContract,
    target: Function,
    dependencies: BindingDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveFactory<Result>(
    cache: CacheContract,
    resolvable: Resolvable,
  ): ResolveFactory<Result>;

  resolveFunction<Result>(
    cache: CacheContract,
    target: Function,
    ...args: Array<unknown>
  ): Result;

  resolveMethod<Result>(
    cache: CacheContract,
    target: Function | Object,
    method: string | symbol,
    ...args: Array<unknown>
  ): Result;

  resolveTag<Result>(
    cache: CacheContract,
    tag: BindingTag,
    ...args: Array<unknown>
  ): Result;

  setBindingByKey(key: BindingKey, binding: BindingContract): this;

  setBindingByTag(tag: BindingTag, binding: BindingContract): this;
}

export type BindingFactory = {
  createAliasBinding(
    resolver: ResolverContract,
    alias: BindingKey,
  ): BindingContract;

  createConstantBinding(
    resolver: ResolverContract,
    constant: unknown,
  ): BindingContract;

  createConstructorBinding(
    resolver: ResolverContract,
    target: Function,
  ): BindingContract;

  createFactoryBinding(
    resolver: ResolverContract,
    resolvable: Resolvable,
  ): BindingContract;

  createFunctionBinding(
    resolver: ResolverContract,
    target: Function,
  ): BindingContract;

  createMethodBinding(
    resolver: ResolverContract,
    target: Function | Object,
    method: string | symbol,
  ): BindingContract;

  createTagBinding(
    resolver: ResolverContract,
    tag: BindingTag,
  ): BindingContract;
};

export type Resolvable =
  | [Function | string | symbol, string | symbol]
  | Function
  | string
  | symbol;

export type ResolveFactory<Result> = (...args: Array<unknown>) => Result;
