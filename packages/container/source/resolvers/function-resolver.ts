import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class FunctionResolver
  extends BaseResolver
  implements ResolverInterface
{
  protected _target: Function;

  public constructor(registry: RegistryInterface, target: Function) {
    super(registry);
    this._target = target;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const target = this._target;
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return target(...targetArgs);
  }
}
