import { BindingContract, BindingKey } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";
import { BaseBinding } from "./base-binding.js";

export class KeyBinding extends BaseBinding implements BindingContract {
  public constructor(resolver: ResolverContract, public targetKey: BindingKey) {
    super(resolver);
  }

  public resolve<Result>(cache: CacheContract, ...args: unknown[]): Result {
    const binding = this._resolver.findByKey(this.targetKey);
    if (typeof binding === "undefined") {
      const context = `Resolving binding.`;
      const problem = `Binding key not found.`;
      const solution = `Please use another binding key.`;
      throw new BindingError(`${context} ${problem} ${solution}`);
    }

    if (binding.scope === "transient") return binding.resolve(cache, ...args);

    const scope = cache.scopeTo(binding.scope);
    return scope.has(this.targetKey)
      ? (scope.get(this.targetKey) as Result)
      : (scope
          .set(this.targetKey, binding.resolve(cache, ...args))
          .get(this.targetKey) as Result);
  }
}
