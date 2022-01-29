import {
  BindingKey,
  BindingToken,
  RegistryContract,
} from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

export class KeyResolver extends BaseResolver implements ResolverContract {
  protected _key: BindingKey;

  public constructor(registry: RegistryContract, key: BindingKey) {
    super(registry);
    this._key = key;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const resolver = this._registry.getResolverByKey(this._key);
    if (typeof resolver === "undefined") {
      const toString = (bindingToken: BindingToken): string =>
        typeof bindingToken !== "string"
          ? typeof bindingToken !== "function"
            ? bindingToken.toString()
            : bindingToken.name
          : bindingToken;
      const contextKey = Array.isArray(this._key)
        ? this._key.map(toString).join("#")
        : toString(this._key);
      const context = `Resolving instance bound at '${contextKey}'.`;
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
