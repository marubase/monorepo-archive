import { BindingContract, BindingKey } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";
import { BaseBinding } from "./base-binding.js";

export class KeyBinding extends BaseBinding implements BindingContract {
  public constructor(resolver: ResolverContract, public alias: BindingKey) {
    super(resolver);
  }

  public resolve<Result>(cache: CacheContract, ...args: unknown[]): Result {
    const binding = this._resolver.findByKey(this.alias);
    if (typeof binding === "undefined") {
      const context = `Resolving binding.`;
      const problem = `Binding key not found.`;
      const solution = `Please use another binding key.`;
      throw new BindingError(`${context} ${problem} ${solution}`);
    }
    return binding.resolve(cache, ...args) as Result;
  }
}
