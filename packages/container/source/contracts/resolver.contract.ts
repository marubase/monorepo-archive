import { BindingContract, BindingKey, BindingTag } from "./binding.contract.js";
import { CacheContract } from "./cache.contract.js";

export interface ResolverContract {
  bind(bindable: Bindable): ResolverBinding;

  createConstantBinding(constant: unknown): BindingContract;

  createConstructorBinding(target: Function): BindingContract;

  createFunctionBinding(target: Function): BindingContract;

  createKeyBinding(key: BindingKey): BindingContract;

  createMethodBinding(
    target: Function | Object,
    method: string | symbol,
  ): BindingContract;

  createTagBinding(tag: BindingTag): BindingContract;

  deindexByKey(binding: BindingContract, key: BindingKey): this;

  deindexByTag(binding: BindingContract, tag: BindingTag): this;

  findByKey(key: BindingKey): BindingContract | undefined;

  findByTag(tag: BindingTag): BindingContract[];

  fork(): this;

  indexByKey(binding: BindingContract, key: BindingKey): this;

  indexByTag(binding: BindingContract, tag: BindingTag): this;

  resolve<Result>(
    cache: CacheContract,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result;
}

export type Bindable = Function | string | symbol;

export type BindingFactory = {
  createConstantBinding(
    resolver: ResolverContract,
    constant: unknown,
  ): BindingContract;

  createConstructorBinding(
    resolver: ResolverContract,
    target: Function,
  ): BindingContract;

  createFunctionBinding(
    resolver: ResolverContract,
    target: Function,
  ): BindingContract;

  createKeyBinding(
    resolver: ResolverContract,
    alias: BindingKey,
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

export type Resolvable = Function | string | symbol;

export type ResolverBinding = {
  toAlias(alias: BindingKey): BindingContract;

  toClass(target: Function): BindingContract;

  toConstant(constant: unknown): BindingContract;

  toFunction(target: Function): BindingContract;

  toMethod(target: Function | Object, method: string | symbol): BindingContract;

  toTag(tag: BindingTag): BindingContract;
};
