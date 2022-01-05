import { BindingContract } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import {
  Resolvable,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class FactoryBinding extends BaseBinding implements BindingContract {
  protected _resolvable: Resolvable;

  public constructor(resolver: ResolverContract, resolvable: Resolvable) {
    super(resolver);
    this._resolvable = resolvable;
  }

  public resolve<Result>(cache: CacheContract): Result {
    return ((...args: Array<unknown>): unknown => {
      return this._resolver.resolve(cache, this._resolvable, ...args);
    }) as unknown as Result;
  }
}
