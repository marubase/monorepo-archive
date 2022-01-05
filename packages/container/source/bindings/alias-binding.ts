import { BindingContract, BindingKey } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class AliasBinding extends BaseBinding implements BindingContract {
  protected _alias: BindingKey;

  public constructor(resolver: ResolverContract, alias: BindingKey) {
    super(resolver);
    this._alias = alias;
  }

  public resolve<Result>(cache: CacheContract, ...args: unknown[]): Result {
    const resolveArgs = args.length < 1 ? this._args : args;
    return this._resolver.resolve(cache, this._alias, ...resolveArgs);
  }
}
