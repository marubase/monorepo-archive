import {
  BindingContract,
  BindingDependencies,
  BindingKey,
  BindingScope,
  BindingTags,
} from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import {
  Resolvable,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";

export class BaseBinding implements BindingContract {
  protected _args: Array<unknown> = [];

  protected _dependencies: BindingDependencies = [];

  protected _key?: BindingKey;

  protected _resolver: ResolverContract;

  protected _scope: BindingScope = "transient";

  protected _tags: BindingTags = [];

  public constructor(resolver: ResolverContract) {
    this._resolver = resolver;
  }

  public getArgs(): Array<unknown> {
    return this._args;
  }

  public getDependencies(): BindingDependencies {
    return this._dependencies;
  }

  public getKey(): BindingKey | undefined {
    return this._key;
  }

  public getResolver(): ResolverContract {
    return this._resolver;
  }

  public getScope(): BindingScope {
    return this._scope;
  }

  public getTags(): BindingTags {
    return this._tags;
  }

  public resolve<Result>(
    cache: CacheContract,
    ...args: Array<unknown>
  ): Result {
    throw new BindingError("Not implemented");
  }

  public resolveDependencies(cache: CacheContract): Array<unknown> {
    const toResolve = (resolvable: Resolvable): unknown =>
      this._resolver.resolve(cache, resolvable);
    return this._dependencies.map(toResolve);
  }

  public setArgs(args: Array<unknown>): this {
    this._args = args;
    return this;
  }

  public setDependencies(dependencies: BindingDependencies): this {
    this._dependencies = dependencies;
    return this;
  }

  public setKey(key?: BindingKey): this {
    if (typeof key !== "undefined" && this._resolver.hasBindingByKey(key)) {
      const context = `Setting binding key.`;
      const problem = `Binding key already exist.`;
      const solution = `Please use another key.`;
      throw new BindingError(`${context} ${problem} ${solution}`);
    }
    if (typeof this._key !== "undefined")
      this._resolver.clearBindingByKey(this._key);
    if (typeof key !== "undefined") this._resolver.setBindingByKey(key, this);
    this._key = key;
    return this;
  }

  public setScope(scope: BindingScope): this {
    this._scope = scope;
    return this;
  }

  public setTags(tags: BindingTags): this {
    for (const tag of this._tags) this._resolver.clearBindingByTag(tag, this);
    for (const tag of tags) this._resolver.setBindingByTag(tag, this);
    this._tags = tags;
    return this;
  }
}
