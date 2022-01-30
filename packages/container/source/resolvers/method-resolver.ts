import { RegistryContract, Resolvable } from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class MethodResolver extends BaseResolver implements ResolverContract {
  protected _method: string | symbol;

  protected _target: Object | Resolvable;

  public constructor(
    registry: RegistryContract,
    target: Object | Resolvable,
    method: string | symbol,
  ) {
    super(registry);
    this._target = target;
    this._method = method;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const target =
      Array.isArray(this._target) || typeof this._target !== "object"
        ? this._registry.resolve<Instance<Result>>(scope, this._target)
        : (this._target as Instance<Result>);
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return target[this._method](...targetArgs);
  }
}

export type Instance<Result> = {
  [method: string | symbol]: (...args: unknown[]) => Result;
};
