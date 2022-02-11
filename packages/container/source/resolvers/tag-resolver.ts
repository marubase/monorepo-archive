import {
  BindingTag,
  RegistryInterface,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class TagResolver extends BaseResolver implements ResolverInterface {
  protected _tag: BindingTag;

  public constructor(registry: RegistryInterface, tag: BindingTag) {
    super(registry);
    this._tag = tag;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const toInstance = (resolver: ResolverInterface): unknown =>
      resolver.resolve(scope, ...args);
    const resolvers = this._registry.getResolverByTag(this._tag);
    return resolvers.map(toInstance) as unknown as Result;
  }
}
