import { BindingContract, BindingTag } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class TagBinding extends BaseBinding implements BindingContract {
  public constructor(resolver: ResolverContract, public tag: BindingTag) {
    super(resolver);
  }

  public resolve<Result>(cache: CacheContract, ...args: unknown[]): Result {
    const toInstance = (binding: BindingContract): unknown =>
      binding.resolve(cache, ...args);
    const bindings = this._resolver.findByTag(this.tag);
    return bindings.map(toInstance) as unknown as Result;
  }
}
