import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class ClassResolver extends BaseResolver implements ResolverInterface {
  protected _target: Function;

  public constructor(registry: RegistryInterface, target: Function) {
    super(registry);
    this._target = target;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const target = this._target as Constructor<Result>;
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return new target(...targetArgs);
  }
}

export type Constructor<Instance> = new (...args: unknown[]) => Instance;
