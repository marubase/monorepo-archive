import {
  Bindable,
  BindingKey,
  BindingTag,
  BindingToken,
  RegistryBinding,
  RegistryContract,
  RegistryFactory,
  Resolvable,
} from "./contracts/registry.js";
import { ResolverContract } from "./contracts/resolver.js";
import { ScopeContract } from "./contracts/scope.js";
import { ContainerError } from "./errors/container.error.js";
import {
  getResolverDependencies,
  getResolverScope,
  getResolverTags,
  isResolvable,
} from "./metadata.js";
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
  > = new Map();

  protected _resolverByTag: Map<BindingTag, Set<ResolverContract>> = new Map();

  public constructor(factory: RegistryFactory = DefaultRegistryFactory) {
    this._factory = factory;
  }

  public bind(bindable: Bindable): RegistryBinding {
    if (typeof bindable === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = bindable.match(pattern);
      if (matched) bindable = [matched[1], matched[2]];
    }
    return {
      to: (target) => this.bind(bindable).toClass(target),

      toAlias: (alias) => this.bind(bindable).toKey(alias),

      toClass: (target) => {
        if (!isResolvable(target))
          return this.createClassResolver(target).setBindingKey(bindable);

        const propertyNames = Object.getOwnPropertyNames(target.prototype);
        for (const property of propertyNames) {
          if (!isResolvable(target.prototype, property)) continue;
          const parent = Array.isArray(bindable) ? bindable[0] : bindable;
          const deps = getResolverDependencies(target.prototype, property);
          const scope = getResolverScope(target.prototype, property);
          const tags = getResolverTags(target.prototype, property);
          this.bind([parent, property])
            .toMethod(bindable, property)
            .setBindingTags(Array.from(tags))
            .setDependencies(deps)
            .setScope(scope);
        }

        const propertySymbols = Object.getOwnPropertySymbols(target.prototype);
        for (const property of propertySymbols) {
          if (!isResolvable(target.prototype, property)) continue;
          const parent = Array.isArray(bindable) ? bindable[0] : bindable;
          const deps = getResolverDependencies(target.prototype, property);
          const scope = getResolverScope(target.prototype, property);
          const tags = getResolverTags(target.prototype, property);
          this.bind([parent, property])
            .toMethod(bindable, property)
            .setBindingTags(Array.from(tags))
            .setDependencies(deps)
            .setScope(scope);
        }

        const deps = getResolverDependencies(target);
        const scope = getResolverScope(target);
        const tags = getResolverTags(target);
        return this.createClassResolver(target)
          .setBindingKey(bindable)
          .setBindingTags(Array.from(tags))
          .setDependencies(deps)
          .setScope(scope);
      },

      toConstant: (constant) =>
        this.createConstantResolver(constant).setBindingKey(bindable),

      toFunction: (target) =>
        this.createFunctionResolver(target).setBindingKey(bindable),

      toKey: (key) => this.createKeyResolver(key).setBindingKey(bindable),

      toMethod: (target, method) =>
        this.createMethodResolver(target, method).setBindingKey(bindable),

      toSelf: () => {
        if (typeof bindable !== "function") {
          const context = `Binding to self.`;
          const problem = `Self is not a class.`;
          const solution = `Please use a class as bindable or use any of the 'to(target)' or 'toClass(target)' method.`;
          throw new ContainerError(`${context} ${problem} ${solution}`);
        }
        return this.bind(bindable).toClass(bindable);
      },

      toTag: (tag) => this.createTagResolver(tag).setBindingKey(bindable),
    };
  }

  public clearResolverByKey(bindingKey: BindingKey): this {
    if (typeof bindingKey === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = bindingKey.match(pattern);
      if (matched) bindingKey = [matched[1], matched[2]];
    }
    if (!Array.isArray(bindingKey))
      bindingKey = [bindingKey, Symbol.for("undefined")];
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
    target: Object | Function,
    method: string | symbol,
  ): ResolverContract {
    return this._factory.createMethodResolver(this, target, method);
  }

  public createTagResolver(tag: BindingTag): ResolverContract {
    return this._factory.createTagResolver(this, tag);
  }

  public getResolverByKey(
    bindingKey: BindingKey,
  ): ResolverContract | undefined {
    if (typeof bindingKey === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = bindingKey.match(pattern);
      if (matched) bindingKey = [matched[1], matched[2]];
    }
    if (!Array.isArray(bindingKey))
      bindingKey = [bindingKey, Symbol.for("undefined")];
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
    if (typeof resolvable === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = resolvable.match(pattern);
      if (matched) resolvable = [matched[1], matched[2]];
    }
    return this.createKeyResolver(resolvable).resolve(scope, ...args);
  }

  public setResolverByKey(
    bindingKey: BindingKey,
    resolver: ResolverContract,
  ): this {
    if (typeof bindingKey === "string") {
      const pattern = /^([\p{Alpha}\p{N}]+)#([\p{Alpha}\p{N}]+)$/u;
      const matched = bindingKey.match(pattern);
      if (matched) bindingKey = [matched[1], matched[2]];
    }
    if (!Array.isArray(bindingKey))
      bindingKey = [bindingKey, Symbol.for("undefined")];
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
}

export const DefaultRegistryFactory: RegistryFactory = {
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
