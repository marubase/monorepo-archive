import {
  Bindable,
  Binding,
  RegistryContract,
  Resolvable,
  ResolvableKey,
  ResolvableTag,
  ResolveFactory,
} from "./registry.contract.js";
import { ResolverDependencies } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface ContainerContract {
  new (registry: RegistryContract, scope: ScopeContract): this;

  bind(bindable: Bindable): Binding;

  bound(bindable: Bindable): boolean;

  fork(): this;

  getRegistry(): RegistryContract;

  getScope(): ScopeContract;

  resolve<Result>(resolvable: Resolvable, ...args: Array<unknown>): Result;

  resolveAlias<Result>(alias: ResolvableKey, ...args: Array<unknown>): Result;

  resolveClass<Result>(
    target: Function,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveConstant<Result>(constant: unknown): Result;

  resolveConstructor<Result>(
    target: Function,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveFactory<Result>(resolvable: Resolvable): ResolveFactory<Result>;

  resolveFunction<Result>(
    target: Function,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveMethod<Result>(
    target: Function | Object,
    method: string | symbol,
    dependencies: ResolverDependencies,
    ...args: Array<unknown>
  ): Result;

  resolveTag<Result>(tag: ResolvableTag, ...args: Array<unknown>): Result;

  unbind(bindable: Bindable): this;
}
