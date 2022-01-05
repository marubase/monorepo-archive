import { BindingContract } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class ConstantBinding extends BaseBinding implements BindingContract {
  protected _constant: unknown;

  public constructor(resolver: ResolverContract, constant: unknown) {
    super(resolver);
    this._constant = constant;
  }

  public resolve<Result>(
    cache: CacheContract /* eslint-disable-line @typescript-eslint/no-unused-vars */,
    ...args: Array<unknown> /* eslint-disable-line @typescript-eslint/no-unused-vars */
  ): Result {
    return this._constant as Result;
  }
}
