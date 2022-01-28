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
  protected _bindingKey?: RegistryKey;

  protected _dependencies: Resolvable[] = [];

  protected _registry: RegistryContract;

  protected _scope: ResolverScope = "transient";

  protected _tags: Set<RegistryTag> = new Set();

  public constructor(registry: RegistryContract) {
    this._registry = registry;
  }

  public get bindingKey(): RegistryKey | undefined {
    return this._bindingKey;
  }

  public get dependencies(): Resolvable[] {
    return this._dependencies;
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

  public clearBindingKey(): this {
    if (typeof this._bindingKey === "undefined") return this;
    this._registry.clearResolverByKey(this._bindingKey);
    delete this._bindingKey;
    return this;
  }

  public clearDependencies(): this {
    this._dependencies = [];
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

  public setBindingKey(key: RegistryKey): this {
    if (typeof this._bindingKey !== "undefined") this.clearBindingKey();
    this._registry.setResolverByKey(key, this);
    this._bindingKey = key;
    return this;
  }

  public setDependencies(dependencies: Resolvable[]): this {
    this._dependencies = dependencies;
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
