import {
  BindingKey,
  BindingTag,
  RegistryInterface,
  Resolvable,
} from "../contracts/registry.contract.js";
import {
  ResolverInterface,
  ResolverScope,
} from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";

export abstract class BaseResolver implements ResolverInterface {
  protected _bindingKey?: BindingKey;

  protected _bindingTags: Set<BindingTag> = new Set();

  protected _dependencies: Resolvable[] = [];

  protected _registry: RegistryInterface;

  protected _scope: ResolverScope = "transient";

  public constructor(registry: RegistryInterface) {
    this._registry = registry;
  }

  public get bindingKey(): BindingKey | undefined {
    return this._bindingKey;
  }

  public get bindingTags(): BindingTag[] {
    return Array.from(this._bindingTags);
  }

  public get dependencies(): Resolvable[] {
    return this._dependencies;
  }

  public get registry(): RegistryInterface {
    return this._registry;
  }

  public get scope(): ResolverScope {
    return this._scope;
  }

  public clearBindingKey(): this {
    if (typeof this._bindingKey === "undefined") return this;
    this._registry.clearResolverByKey(this._bindingKey);
    delete this._bindingKey;
    return this;
  }

  public clearBindingTag(bindingTag: BindingTag): this {
    if (this._bindingTags.delete(bindingTag))
      this._registry.clearResolverByTag(bindingTag, this);
    return this;
  }

  public clearBindingTags(): this {
    for (const bindingTag of this._bindingTags)
      this.clearBindingTag(bindingTag);
    return this;
  }

  public clearDependencies(): this {
    this._dependencies = [];
    return this;
  }

  public resolveDependencies(scope: ScopeInterface): unknown[] {
    const toInstance = (resolvable: Resolvable): unknown =>
      this._registry.resolve(scope, resolvable);
    return this._dependencies.map(toInstance);
  }

  public setBindingKey(bindingKey: BindingKey): this {
    if (typeof this._bindingKey !== "undefined") this.clearBindingKey();
    this._registry.setResolverByKey(bindingKey, this);
    this._bindingKey = bindingKey;
    return this;
  }

  public setBindingTag(bindingTag: BindingTag): this {
    if (this._bindingTags.has(bindingTag)) return this;
    this._registry.setResolverByTag(bindingTag, this);
    this._bindingTags.add(bindingTag);
    return this;
  }

  public setBindingTags(bindingTags: BindingTag[]): this {
    if (this._bindingTags.size > 0) this.clearBindingTags();
    for (const bindingTag of bindingTags) this.setBindingTag(bindingTag);
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

  public abstract resolve<Result>(
    scope: ScopeInterface,
    ...args: unknown[]
  ): Result;
}
