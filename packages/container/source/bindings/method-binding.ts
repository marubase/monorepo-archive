import { BindingContract } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BaseBinding } from "./base-binding.js";

export class MethodBinding extends BaseBinding implements BindingContract {
  public constructor(
    resolver: ResolverContract,
    public target: Function | Object,
    public method: string | symbol,
  ) {
    super(resolver);
  }

  public resolve<Result>(cache: CacheContract, ...args: unknown[]): Result {
    const target = this.target as Instance<Result>;
    const targetArgs = this.resolveDependencies(cache).concat(args);
    return target[this.method](...targetArgs);
  }
}

export type Instance<Result> = {
  [method: string | symbol]: (...args: unknown[]) => Result;
};
