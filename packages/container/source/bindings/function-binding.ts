import { BindingContract } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class FunctionBinding extends BaseBinding implements BindingContract {
  public constructor(resolver: ResolverContract, public target: Function) {
    super(resolver);
  }

  public resolve<Result>(
    cache: CacheContract,
    ...args: Array<unknown>
  ): Result | undefined {
    const target = this.target;
    const targetArgs = this.resolveDependencies(cache).concat(args);
    return target(...targetArgs);
  }
}
