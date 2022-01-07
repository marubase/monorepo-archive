import { BindingContract, BindingKey } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class AliasBinding extends BaseBinding implements BindingContract {
  public constructor(resolver: ResolverContract, public alias: BindingKey) {
    super(resolver);
  }

  public resolve<Result>(
    cache: CacheContract,
    ...args: Array<unknown>
  ): Result | undefined {
    const binding = this._resolver.findByKey(this.alias);
    return typeof binding !== "undefined"
      ? (binding.resolve(cache, ...args) as Result)
      : undefined;
  }
}
