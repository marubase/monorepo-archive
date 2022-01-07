import { BindingKey, BindingTag } from "./binding.contract.js";
import { CacheContract } from "./cache.contract.js";
import {
  Bindable,
  Binding,
  Resolvable,
  ResolverContract,
} from "./resolver.contract.js";

export interface ContainerContract {
  readonly cache: CacheContract;

  readonly resolver: ResolverContract;

  bind(bindable: Bindable): Binding;

  fork(): this;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  resolveAlias<Result>(alias: BindingKey, ...args: unknown[]): Result;

  resolveClass<Result>(target: Function, ...args: unknown[]): Result;

  resolveConstant<Result>(constant: unknown, ...args: unknown[]): Result;

  resolveConstructor<Result>(target: Function, ...args: unknown[]): Result;

  resolveFunction<Result>(target: Function, ...args: unknown[]): Result;

  resolveKey<Result>(key: BindingKey, ...args: unknown[]): Result;

  resolveMethod<Result>(
    target: Function | Object,
    method: string | symbol,
    ...args: unknown[]
  ): Result;

  resolveTag<Result>(tag: BindingTag, ...args: unknown[]): Result;
}
