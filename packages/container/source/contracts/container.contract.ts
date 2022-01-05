import {
  BindingDependencies,
  BindingKey,
  BindingTag,
} from "./binding.contract.js";
import { CacheContract } from "./cache.contract.js";
import {
  Bindable,
  BindToSyntax,
  Resolvable,
  ResolveFactory,
  ResolverContract,
} from "./resolver.contract.js";

export interface ContainerContract {
  bind(bindable: Bindable): BindToSyntax;

  fork(): this;

  getCache(): CacheContract;

  getResolver(): ResolverContract;

  resolve<Result>(resolvable: Resolvable, ...args: Array<unknown>): Result;

  resolveAlias<Result>(alias: BindingKey, ...args: Array<unknown>): Result;

  resolveClass<Result>(
    target: Function,
    dependencies: BindingDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveConstant<Result>(constant: unknown): Result;

  resolveConstructor<Result>(
    target: Function,
    dependencies: BindingDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveFactory<Result>(resolvable: Resolvable): ResolveFactory<Result>;

  resolveFunction<Result>(
    target: Function,
    dependencies: BindingDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveMethod<Result>(
    target: Function | Object,
    method: string | symbol,
    dependencies: BindingDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveTag<Result>(tag: BindingTag, ...args: Array<unknown>): Result;
}
