import {
  BindingContract,
  BindingDependencies,
  BindingKey,
  BindingScope,
  BindingTag,
} from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import {
  Resolvable,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";

export class BaseBinding implements BindingContract {
  protected _dependencies: BindingDependencies = [];

  protected _key?: BindingKey;

  protected _resolver: ResolverContract;

  protected _scope: BindingScope = "transient";

  protected _tags: Set<BindingTag> = new Set();

  public constructor(resolver: ResolverContract) {
    this._resolver = resolver;
  }

  public get dependencies(): BindingDependencies {
    return this._dependencies;
  }

  public get key(): BindingKey | undefined {
    return this._key;
  }

  public get resolver(): ResolverContract {
    return this._resolver;
  }

  public get scope(): BindingScope {
    return this._scope;
  }

  public get tags(): BindingTag[] {
    return Array.from(this._tags);
  }

  public clearDependencies(): this {
    this._dependencies = [];
    return this;
  }

  public clearKey(): this {
    if (typeof this._key === "undefined") return this;
    this._resolver.deindexByKey(this, this._key);
    delete this._key;
    return this;
  }

  public clearTag(tag: BindingTag): this {
    this._resolver.deindexByTag(this, tag);
    this._tags.delete(tag);
    return this;
  }

  public clearTags(): this {
    for (const tag of this._tags) this.clearTag(tag);
    return this;
  }

  public hasTag(tag: BindingTag): boolean {
    return this._tags.has(tag);
  }

  public resolve<Result>(
    cache: CacheContract /* eslint-disable-line */,
    ...args: unknown[] /* eslint-disable-line */
  ): Result {
    const context = `Resolving binding.`;
    const problem = `Method not implemented.`;
    const solution = `Please use concrete binding implementation.`;
    throw new BindingError(`${context} ${problem} ${solution}`);
  }

  public resolveDependencies(
    cache: CacheContract,
    ...args: unknown[]
  ): unknown[] {
    const toInstance = (resolvable: Resolvable): unknown =>
      this._resolver.resolve(cache, resolvable, ...args);
    return this._dependencies.map(toInstance);
  }

  public setDependencies(dependencies: BindingDependencies): this {
    this._dependencies = dependencies;
    return this;
  }

  public setKey(key: BindingKey): this {
    if (typeof this._key !== "undefined") this.clearKey();
    this._resolver.indexByKey(this, key);
    this._key = key;
    return this;
  }

  public setScope(scope: BindingScope): this {
    this._scope = scope;
    return this;
  }

  public setTag(tag: BindingTag): this {
    this._resolver.indexByTag(this, tag);
    this._tags.add(tag);
    return this;
  }

  public setTags(tags: BindingTag[]): this {
    if (this._tags.size > 0) this.clearTags();
    for (const tag of tags) this.setTag(tag);
    return this;
  }
}
