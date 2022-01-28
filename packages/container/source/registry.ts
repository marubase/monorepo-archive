import {
  Bindable,
  RegistryBinding,
  RegistryContract,
  RegistryFactory,
  RegistryKey,
  RegistryTag,
  Resolvable,
} from "./contracts/registry.js";
import { ResolverContract } from "./contracts/resolver.js";
import { ScopeContract } from "./contracts/scope.js";
import { ContainerError } from "./index.js";
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

  protected _resolverByKey: Map<RegistryKey, ResolverContract> = new Map();

  protected _resolverByTag: Map<RegistryKey, Set<ResolverContract>> = new Map();

  public constructor(factory: RegistryFactory = DefaultRegistryFactory) {
    this._factory = factory;
  }

  public bind(bindable: Bindable): RegistryBinding {
    const bindingKey =
      typeof bindable === "function" ? bindable.name : bindable;
    return {
      to: (target) => this.bind(bindingKey).toClass(target),

      toAlias: (alias) => this.bind(bindingKey).toKey(alias),

      toClass: (target) => {
        if (!isResolvable(target))
          return this.createClassResolver(target).setBindingKey(bindingKey);

        const propertyNames = Object.getOwnPropertyNames(target.prototype);
        for (const property of propertyNames) {
          if (!isResolvable(target.prototype, property)) continue;
          const parentKey =
            typeof bindingKey === "symbol" ? bindingKey.toString() : bindingKey;
          const deps = getResolverDependencies(target.prototype, property);
          const scope = getResolverScope(target.prototype, property);
          const tags = getResolverTags(target.prototype, property);
          this.bind(`${parentKey}#${property}`)
            .toMethod(target.prototype, property)
            .setDependencies(deps)
            .setScope(scope)
            .setTags(Array.from(tags));
        }

        const propertySymbols = Object.getOwnPropertySymbols(target.prototype);
        for (const property of propertySymbols) {
          if (!isResolvable(target.prototype, property)) continue;
          const parentKey =
            typeof bindingKey === "symbol" ? bindingKey.toString() : bindingKey;
          const deps = getResolverDependencies(target.prototype, property);
          const scope = getResolverScope(target.prototype, property);
          const tags = getResolverTags(target.prototype, property);
          this.bind(`${parentKey}#${property.toString()}`)
            .toMethod(target.prototype, property)
            .setDependencies(deps)
            .setScope(scope)
            .setTags(Array.from(tags));
        }

        const deps = getResolverDependencies(target);
        const scope = getResolverScope(target);
        const tags = getResolverTags(target);
        return this.createClassResolver(target)
          .setBindingKey(bindingKey)
          .setDependencies(deps)
          .setScope(scope)
          .setTags(Array.from(tags));
      },

      toConstant: (constant) =>
        this.createConstantResolver(constant).setBindingKey(bindingKey),

      toFunction: (target) =>
        this.createFunctionResolver(target).setBindingKey(bindingKey),

      toKey: (key) => this.createKeyResolver(key).setBindingKey(bindingKey),

      toMethod: (target, method) =>
        this.createMethodResolver(target, method).setBindingKey(bindingKey),

      toSelf: () => {
        if (typeof bindable !== "function") {
          const context = `Binding to self.`;
          const problem = `Self is not a class.`;
          const solution = `Please use a class as bindable or use any of the 'to(target)' or 'toClass(target)' method.`;
          throw new ContainerError(`${context} ${problem} ${solution}`);
        }
        return this.bind(bindingKey).toClass(bindable);
      },

      toTag: (tag) => this.createTagResolver(tag).setBindingKey(bindingKey),
    };
  }

  public clearResolverByKey(key: RegistryKey): this {
    this._resolverByKey.delete(key);
    return this;
  }

  public clearResolverByTag(
    tag: RegistryTag,
    resolver: ResolverContract,
  ): this {
    const resolvers = this._resolverByTag.get(tag);
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

  public createKeyResolver(key: RegistryKey): ResolverContract {
    return this._factory.createKeyResolver(this, key);
  }

  public createMethodResolver(
    target: Object | Function,
    method: string | symbol,
  ): ResolverContract {
    return this._factory.createMethodResolver(this, target, method);
  }

  public createTagResolver(tag: RegistryTag): ResolverContract {
    return this._factory.createTagResolver(this, tag);
  }

  public getResolverByKey(key: RegistryKey): ResolverContract | undefined {
    return this._resolverByKey.get(key);
  }

  public getResolverByTag(tag: RegistryTag): ResolverContract[] {
    const resolvers = this._resolverByTag.get(tag);
    return typeof resolvers !== "undefined" ? Array.from(resolvers) : [];
  }

  public resolve<Result>(
    scope: ScopeContract,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result {
    const registryKey =
      typeof resolvable === "function" ? resolvable.name : resolvable;
    return this.createKeyResolver(registryKey).resolve(scope, ...args);
  }

  public setResolverByKey(key: RegistryKey, resolver: ResolverContract): this {
    this._resolverByKey.set(key, resolver);
    return this;
  }

  public setResolverByTag(tag: RegistryTag, resolver: ResolverContract): this {
    let resolvers = this._resolverByTag.get(tag);
    if (typeof resolvers === "undefined") {
      this._resolverByTag.set(tag, new Set());
      resolvers = this._resolverByTag.get(tag) as Set<ResolverContract>;
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
