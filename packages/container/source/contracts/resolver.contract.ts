import { BindingContract, BindingKey, BindingTag } from "./binding.contract.js";
import { CacheContract } from "./cache.contract.js";

export interface ResolverContract {
  bind(bindable: Bindable): Binding;

  createAliasBinding(alias: BindingKey): BindingContract;

  createClassBinding(target: Function): BindingContract;

  createConstantBinding(constant: unknown): BindingContract;

  createConstructorBinding(target: Function): BindingContract;

  createFunctionBinding(target: Function): BindingContract;

  createMethodBinding(
    target: Function | Object,
    method: string | symbol,
  ): BindingContract;

  createTagBinding(tag: BindingTag): BindingContract;

  deindexByKey(binding: BindingContract, key: BindingKey): this;

  deindexByTag(binding: BindingContract, tag: BindingTag): this;

  findByKey(key: BindingKey): BindingContract | undefined;

  findByTag(tag: BindingTag): Array<BindingContract>;

  indexByKey(binding: BindingContract, key: BindingKey): this;

  indexByTag(binding: BindingContract, tag: BindingTag): this;

  resolve<Result>(
    cache: CacheContract,
    resolvable: Resolvable,
    ...args: Array<unknown>
  ): Result;
}

export type Bindable = Function | string | symbol;

export type Binding = {
  toAlias(alias: BindingKey): BindingContract;

  toClass(target: Function): BindingContract;

  toConstant(constant: unknown): BindingContract;

  toConstructorBinding(target: Function): BindingContract;

  toFunction(target: Function): BindingContract;

  toMethod(target: Function | Object, method: string | symbol): BindingContract;

  toTag(tag: BindingTag): BindingContract;
};

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
