import {
  BindingAlias,
  BindingKey,
  BindingToken,
  RegistryInterface,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

export class KeyResolver extends BaseResolver implements ResolverInterface {
  protected _key: BindingKey;

  public constructor(registry: RegistryInterface, key: BindingKey) {
    super(registry);
    this._key = key;
  }

  public resolve<Result>(scope: ScopeInterface, ...args: unknown[]): Result {
    const resolver =
      this._registry.getResolverByKey(this._key) ||
      this._registry.getResolverByKey([this._key[0], BindingAlias]);
    if (typeof resolver === "undefined") {
      const toString = (bindingToken: BindingToken): string =>
        typeof bindingToken !== "string"
          ? typeof bindingToken !== "function"
            ? bindingToken.toString()
            : bindingToken.name
          : bindingToken;
      const contextKey = this._key.map(toString).join("#");
      const context = `Resolving instance bound to '${contextKey}'.`;
      const problem = `Resolver not found.`;
      const solution = `Please try another key.`;
      throw new ContainerError(`${context} ${problem} ${solution}`);
    }

    if (resolver.scope === "transient") return resolver.resolve(scope, ...args);

    const cache = scope[resolver.scope];
    return !cache.has(this._key)
      ? (cache
          .set(this._key, resolver.resolve(scope, ...args))
          .get(this._key) as Result)
      : (cache.get(this._key) as Result);
  }
}
