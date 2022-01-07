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

  resolve<Result>(resolvable: Resolvable, ...args: Array<unknown>): Result;

  resolveAlias<Result>(alias: BindingKey, ...args: Array<unknown>): Result;

  resolveClass<Result>(target: Function, ...args: Array<unknown>): Result;

  resolveConstant<Result>(constant: unknown, ...args: Array<unknown>): Result;

  resolveConstructor<Result>(target: Function, ...args: Array<unknown>): Result;

  resolveFunction<Result>(target: Function, ...args: Array<unknown>): Result;

  resolveKey<Result>(key: BindingKey, ...args: Array<unknown>): Result;

  resolveMethod<Result>(
    target: Function | Object,
    method: string | symbol,
    ...args: Array<unknown>
  ): Result;

  resolveTag<Result>(tag: BindingTag, ...args: Array<unknown>): Result;
}
