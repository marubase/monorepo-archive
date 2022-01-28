import { RegistryContract } from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class ClassResolver extends BaseResolver implements ResolverContract {
  protected _target: Function;

  public constructor(registry: RegistryContract, target: Function) {
    super(registry);
    this._target = target;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const target = this._target as Constructor<Result>;
    const targetArgs = this.resolveDependencies(scope).concat(...args);
    return new target(...targetArgs);
  }
}

export type Constructor<Instance> = new (...args: unknown[]) => Instance;
