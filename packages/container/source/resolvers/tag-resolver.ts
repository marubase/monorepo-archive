import {
  BindingTag,
  RegistryContract,
} from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class TagResolver extends BaseResolver implements ResolverContract {
  protected _tag: BindingTag;

  public constructor(registry: RegistryContract, tag: BindingTag) {
    super(registry);
    this._tag = tag;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const toInstance = (resolver: ResolverContract): unknown =>
      resolver.resolve(scope, ...args);
    const resolvers = this._registry.getResolverByTag(this._tag);
    return resolvers.map(toInstance) as unknown as Result;
  }
}
