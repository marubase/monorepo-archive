import { BindingContract } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class ConstantBinding extends BaseBinding implements BindingContract {
  public constructor(resolver: ResolverContract, public constant: unknown) {
    super(resolver);
  }

  public resolve<Result>(
    cache: CacheContract /* eslint-disable-line */,
    ...args: Array<unknown> /* eslint-disable-line */
  ): Result | undefined {
    return this.constant as Result;
  }
}
