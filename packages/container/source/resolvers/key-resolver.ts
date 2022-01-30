import {
  BindingKey,
  BindingRoot,
  BindingToken,
  RegistryContract,
  Resolvable,
} from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

export class KeyResolver extends BaseResolver implements ResolverContract {
  protected _key: Resolvable;

  public constructor(registry: RegistryContract, key: Resolvable) {
    super(registry);
    this._key = key;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    let resolveKey: BindingKey;
    if (typeof this._key === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = this._key.match(pattern);
      if (matched) resolveKey = [matched[1], matched[2]];
    }
    resolveKey = !Array.isArray(this._key)
      ? ([this._key, BindingRoot] as BindingKey)
      : (this._key as BindingKey);

    const resolver = this._registry.getResolverByKey(resolveKey);
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
    return !cache.has(resolveKey)
      ? (cache
          .set(resolveKey, resolver.resolve(scope, ...args))
          .get(resolveKey) as Result)
      : (cache.get(resolveKey) as Result);
  }
}
