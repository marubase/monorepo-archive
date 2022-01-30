import {
  Bindable,
  BindingKey,
  BindingRoot,
  RegistryContract,
} from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class AliasResolver extends BaseResolver implements ResolverContract {
  protected _alias: Bindable;

  public constructor(registry: RegistryContract, alias: Bindable) {
    super(registry);
    this._alias = alias;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    let resolveKey = !Array.isArray(scope.resolvable)
      ? ([scope.resolvable, BindingRoot] as BindingKey)
      : (scope.resolvable as BindingKey);
    if (typeof scope.resolvable === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = scope.resolvable.match(pattern);
      if (matched) resolveKey = [matched[1], matched[2]];
    }
    const aliasKey = [this._alias, resolveKey[1]] as BindingKey;
    return this._registry.resolve(scope, aliasKey, ...args);
  }
}
