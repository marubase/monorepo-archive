import { RegistryContract } from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class FunctionResolver extends BaseResolver implements ResolverContract {
  protected _target: Function;

  public constructor(registry: RegistryContract, target: Function) {
    super(registry);
    this._target = target;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const target = this._target;
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return target(...targetArgs);
  }
}
