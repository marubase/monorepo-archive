import { RegistryContract, RegistryTag } from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { BaseResolver } from "./base-resolver.js";

export class TagResolver extends BaseResolver implements ResolverContract {
  protected _tag: RegistryTag;

  public constructor(registry: RegistryContract, tag: RegistryTag) {
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
