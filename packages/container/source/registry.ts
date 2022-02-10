import {
  Bindable,
  BindingAlias,
  BindingKey,
  BindingRoot,
  BindingTag,
  BindingToken,
  Callable,
  RegistryBinding,
  RegistryContract,
  RegistryFactory,
  Resolvable,
} from "./contracts/registry.contract.js";
import { ResolverContract } from "./contracts/resolver.contract.js";
import { ScopeContract } from "./contracts/scope.contract.js";
import { ContainerError } from "./errors/container.error.js";
import {
  getResolverDependencies,
  getResolverScope,
  getResolverTags,
  isResolvable,
} from "./metadata.js";
import { AliasResolver } from "./resolvers/alias-resolver.js";
import { ClassResolver } from "./resolvers/class-resolver.js";
import { ConstantResolver } from "./resolvers/constant-resolver.js";
import { FunctionResolver } from "./resolvers/function-resolver.js";
import { KeyResolver } from "./resolvers/key-resolver.js";
import { MethodResolver } from "./resolvers/method-resolver.js";
import { TagResolver } from "./resolvers/tag-resolver.js";

export class Registry implements RegistryContract {
  protected _factory: RegistryFactory;

  protected _resolverByKey: Map<
    BindingToken,
    Map<BindingToken, ResolverContract>
  >;

  protected _resolverByTag: Map<BindingTag, Set<ResolverContract>>;

  public constructor(
    factory: RegistryFactory = DefaultRegistryFactory,
    resolverByKey?: Map<BindingToken, Map<BindingToken, ResolverContract>>,
    resolverByTag?: Map<BindingTag, Set<ResolverContract>>,
  ) {
    this._factory = factory;
    this._resolverByKey = resolverByKey || new Map();
    this._resolverByTag = resolverByTag || new Map();
  }

  public bind(bindable: Bindable): RegistryBinding {
    const bindingKey = [bindable, BindingRoot] as BindingKey;
    return {
      to: (target) => this.bind(bindable).toClass(target),

      toAlias: (alias) =>
        this.createAliasResolver(alias).setBindingKey([bindable, BindingAlias]),

      toClass: (target) => {
        if (!isResolvable(target))
          return this.createClassResolver(target).setBindingKey(bindingKey);

        const propertyNames = Object.getOwnPropertyNames(target.prototype);
        for (const property of propertyNames) {
          if (!isResolvable(target.prototype, property)) continue;
          const deps = getResolverDependencies(target.prototype, property);
          const scope = getResolverScope(target.prototype, property);
          const tags = getResolverTags(target.prototype, property);
          this.createMethodResolver(bindingKey, property)
            .setBindingKey([bindable, property])
            .setBindingTags(Array.from(tags))
            .setDependencies(deps)
            .setScope(scope);
        }

        const propertySymbols = Object.getOwnPropertySymbols(target.prototype);
        for (const property of propertySymbols) {
          if (!isResolvable(target.prototype, property)) continue;
          const deps = getResolverDependencies(target.prototype, property);
          const scope = getResolverScope(target.prototype, property);
          const tags = getResolverTags(target.prototype, property);
          this.createMethodResolver(bindingKey, property)
            .setBindingKey([bindable, property])
            .setBindingTags(Array.from(tags))
            .setDependencies(deps)
            .setScope(scope);
        }

        const deps = getResolverDependencies(target);
        const scope = getResolverScope(target);
        const tags = getResolverTags(target);
        return this.createClassResolver(target)
          .setBindingKey(bindingKey)
          .setBindingTags(Array.from(tags))
          .setDependencies(deps)
          .setScope(scope);
      },

      toConstant: (constant) =>
        this.createConstantResolver(constant).setBindingKey(bindingKey),

      toFunction: (target) => {
        if (!isResolvable(target))
          return this.createFunctionResolver(target).setBindingKey(bindingKey);

        const deps = getResolverDependencies(target);
        const scope = getResolverScope(target);
        const tags = getResolverTags(target);
        return this.createFunctionResolver(target)
          .setBindingKey(bindingKey)
          .setBindingTags(Array.from(tags))
          .setDependencies(deps)
          .setScope(scope);
      },

      toInstance: (instance) => this.bind(bindable).toConstant(instance),

      toKey: (key) => this.createKeyResolver(key).setBindingKey(bindingKey),

      toMethod: (target, method) => {
        if (!isResolvable(target, method))
          return this.createMethodResolver(target, method).setBindingKey(
            bindingKey,
          );

        const deps = getResolverDependencies(target, method);
        const scope = getResolverScope(target, method);
        const tags = getResolverTags(target, method);
        return this.createMethodResolver(target, method)
          .setBindingKey(bindingKey)
          .setBindingTags(Array.from(tags))
          .setDependencies(deps)
          .setScope(scope);
      },

      toSelf: () => {
        if (typeof bindable !== "function") {
          const context = `Binding to self.`;
          const problem = `Self is not a class.`;
          const solution = `Please use a class as bindable or use any of the 'to(target)' or 'toClass(target)' method.`;
          throw new ContainerError(`${context} ${problem} ${solution}`);
        }
        return this.bind(bindable).toClass(bindable);
      },

      toTag: (tag) => this.createTagResolver(tag).setBindingKey(bindingKey),
    };
  }

  public call<Result>(
    scope: ScopeContract,
    callable: Callable,
    ...args: unknown[]
  ): Result {
    const [target, method] = callable;
    if (!isResolvable(target, method))
      return this.createMethodResolver(target, method).resolve(scope, ...args);

    const deps = getResolverDependencies(target, method);
    const tags = getResolverTags(target, method);
    return this.createMethodResolver(target, method)
      .setBindingTags(Array.from(tags))
      .setDependencies(deps)
      .resolve(scope, ...args);
  }

  public clearResolverByKey(bindingKey: BindingKey): this {
    const [primary, secondary] = bindingKey;
    const table =
      this._resolverByKey.get(primary) ||
      new Map<BindingToken, ResolverContract>();
    table.delete(secondary);
    if (table.size < 1) this._resolverByKey.delete(primary);
    return this;
  }

  public clearResolverByTag(
    bindingTag: BindingTag,
    resolver: ResolverContract,
  ): this {
    const resolvers = this._resolverByTag.get(bindingTag);
    if (typeof resolvers !== "undefined") resolvers.delete(resolver);
    return this;
  }

  public createAliasResolver(alias: Bindable): ResolverContract {
    return this._factory.createAliasResolver(this, alias);
  }

  public createClassResolver(target: Function): ResolverContract {
    return this._factory.createClassResolver(this, target);
  }

  public createConstantResolver(constant: unknown): ResolverContract {
    return this._factory.createConstantResolver(this, constant);
  }

  public createFunctionResolver(target: Function): ResolverContract {
    return this._factory.createFunctionResolver(this, target);
  }

  public createKeyResolver(key: BindingKey): ResolverContract {
    return this._factory.createKeyResolver(this, key);
  }

  public createMethodResolver(
    target: Object | Resolvable,
    method: string | symbol,
  ): ResolverContract {
    return this._factory.createMethodResolver(this, target, method);
  }

  public createTagResolver(tag: BindingTag): ResolverContract {
    return this._factory.createTagResolver(this, tag);
  }

  public fetch(resolvable: Resolvable): ResolverContract | undefined {
    let resolveKey = !Array.isArray(resolvable)
      ? ([resolvable, BindingRoot] as BindingKey)
      : (resolvable as BindingKey);
    if (typeof resolvable === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = resolvable.match(pattern);
      if (matched) resolveKey = [matched[1], matched[2]];
    }
    return (
      this.getResolverByKey(resolveKey) ||
      this.getResolverByKey([resolveKey[0], BindingAlias])
    );
  }

  public fork(): this {
    const resolverByKey: Map<
      BindingToken,
      Map<BindingToken, ResolverContract>
    > = new Map();
    for (const [target, method] of this._resolverByKey)
      resolverByKey.set(target, new Map(method));

    const resolverByTag: Map<BindingTag, Set<ResolverContract>> = new Map();
    for (const [bindingTag, resolvers] of this._resolverByTag)
      resolverByTag.set(bindingTag, new Set(resolvers));

    const Static = this.constructor as typeof Registry;
    return new Static(this._factory, resolverByKey, resolverByTag) as this;
  }

  public getResolverByKey(
    bindingKey: BindingKey,
  ): ResolverContract | undefined {
    const [primary, secondary] = bindingKey;
    const table = this._resolverByKey.get(primary);
    return typeof table !== "undefined" ? table.get(secondary) : undefined;
  }

  public getResolverByTag(bindingTag: BindingTag): ResolverContract[] {
    const resolvers = this._resolverByTag.get(bindingTag);
    return typeof resolvers !== "undefined" ? Array.from(resolvers) : [];
  }

  public resolve<Result>(
    scope: ScopeContract,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result {
    let resolveKey = !Array.isArray(resolvable)
      ? ([resolvable, BindingRoot] as BindingKey)
      : (resolvable as BindingKey);
    if (typeof resolvable === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = resolvable.match(pattern);
      if (matched) resolveKey = [matched[1], matched[2]];
    }
    return this.createKeyResolver(resolveKey).resolve(scope, ...args);
  }

  public setResolverByKey(
    bindingKey: BindingKey,
    resolver: ResolverContract,
  ): this {
    const [primary, secondary] = bindingKey;
    const table =
      this._resolverByKey.get(primary) ||
      new Map<BindingToken, ResolverContract>();
    table.set(secondary, resolver);
    this._resolverByKey.set(primary, table);
    return this;
  }

  public setResolverByTag(
    bindingTag: BindingTag,
    resolver: ResolverContract,
  ): this {
    let resolvers = this._resolverByTag.get(bindingTag);
    if (typeof resolvers === "undefined") {
      this._resolverByTag.set(bindingTag, new Set());
      resolvers = this._resolverByTag.get(bindingTag) as Set<ResolverContract>;
    }
    resolvers.add(resolver);
    return this;
  }

  public unbind(bindable: Bindable): Map<BindingToken, ResolverContract> {
    const resolvers = this._resolverByKey.get(bindable);
    this._resolverByKey.delete(bindable);
    return resolvers || new Map();
  }
}

export const DefaultRegistryFactory: RegistryFactory = {
  createAliasResolver: (registry, alias) => new AliasResolver(registry, alias),

  createClassResolver: (registry, target) =>
    new ClassResolver(registry, target),

  createConstantResolver: (registry, constant) =>
    new ConstantResolver(registry, constant),

  createFunctionResolver: (registry, target) =>
    new FunctionResolver(registry, target),

  createKeyResolver: (registry, key) => new KeyResolver(registry, key),

  createMethodResolver: (registry, target, method) =>
    new MethodResolver(registry, target, method),

  createTagResolver: (registry, tag) => new TagResolver(registry, tag),
};
