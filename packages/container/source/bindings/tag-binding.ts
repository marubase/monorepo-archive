import { BindingContract, BindingTag } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class TagBinding extends BaseBinding implements BindingContract {
  protected _tag: BindingTag;

  public constructor(resolver: ResolverContract, tag: BindingTag) {
    super(resolver);
    this._tag = tag;
  }

  public resolve<Result>(cache: CacheContract, ...args: unknown[]): Result {
    return this._resolver
      .getBindingByTags(this._tag)
      .map((binding) => binding.resolve(cache)) as unknown as Result;
  }
}
