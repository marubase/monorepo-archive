import { RegistryContract } from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class MethodResolver extends BaseResolver implements ResolverContract {
  protected _method: string | symbol;

  protected _target: Function | Object;

  public constructor(
    registry: RegistryContract,
    target: Function | Object,
    method: string | symbol,
  ) {
    super(registry);
    this._target = target;
    this._method = method;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const target = this._target as Instance<Result>;
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return target[this._method](...targetArgs);
  }
}

export type Instance<Result> = {
  [method: string | symbol]: (...args: unknown[]) => Result;
};
