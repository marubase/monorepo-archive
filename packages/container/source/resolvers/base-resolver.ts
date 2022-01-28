/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RegistryContract,
  RegistryKey,
  RegistryTag,
  RegistryTags,
  Resolvable,
} from "../contracts/registry.js";
import { ResolverContract, ResolverScope } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { ContainerError } from "../index.js";

export class BaseResolver implements ResolverContract {
  protected _dependencies: Resolvable[] = [];

  protected _key?: RegistryKey;

  protected _registry: RegistryContract;

  protected _scope: ResolverScope = "transient";

  protected _tags: Set<RegistryTag> = new Set();

  public constructor(registry: RegistryContract) {
    this._registry = registry;
  }

  public get dependencies(): Resolvable[] {
    return this._dependencies;
  }

  public get key(): RegistryKey | undefined {
    return this._key;
  }

  public get registry(): RegistryContract {
    return this._registry;
  }

  public get scope(): ResolverScope {
    return this._scope;
  }

  public get tags(): RegistryTags {
    return Array.from(this._tags);
  }

  public clearDependencies(): this {
    this._dependencies = [];
    return this;
  }

  public clearKey(): this {
    if (typeof this._key === "undefined") return this;
    this._registry.clearResolverByKey(this._key);
    delete this._key;
    return this;
  }

  public clearTag(tag: RegistryTag): this {
    if (this._tags.delete(tag)) this._registry.clearResolverByTag(tag, this);
    return this;
  }

  public clearTags(): this {
    for (const tag of this._tags) this.clearTag(tag);
    return this;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    const context = `Resolving instance.`;
    const problem = `Method not implemented.`;
    const solution = `Please try concrete resolver instance.`;
    throw new ContainerError(`${context} ${problem} ${solution}`);
  }

  public resolveDependencies(scope: ScopeContract): unknown[] {
    const toInstance = (resolvable: Resolvable): unknown =>
      this._registry.resolve(scope, resolvable);
    return this._dependencies.map(toInstance);
  }

  public setDependencies(dependencies: Resolvable[]): this {
    this._dependencies = dependencies;
    return this;
  }

  public setKey(key: RegistryKey): this {
    if (typeof this._key !== "undefined") this.clearKey();
    this._registry.setResolverByKey(key, this);
    this._key = key;
    return this;
  }

  public setScope(scope: ResolverScope): this {
    this._scope = scope;
    return this;
  }

  public setTag(tag: RegistryTag): this {
    if (this._tags.has(tag)) return this;
    this._registry.setResolverByTag(tag, this);
    this._tags.add(tag);
    return this;
  }

  public setTags(tags: RegistryTags): this {
    if (this._tags.size > 0) this.clearTags();
    for (const tag of tags) this.setTag(tag);
    return this;
  }
}
