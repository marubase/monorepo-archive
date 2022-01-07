import { ConstantBinding } from "./bindings/constant-binding.js";
import { ConstructorBinding } from "./bindings/constructor-binding.js";
import { FunctionBinding } from "./bindings/function-binding.js";
import { KeyBinding } from "./bindings/key-binding.js";
import { MethodBinding } from "./bindings/method-binding.js";
import { TagBinding } from "./bindings/tag-binding.js";
import {
  BindingContract,
  BindingKey,
  BindingTag,
} from "./contracts/binding.contract.js";
import { CacheContract } from "./contracts/cache.contract.js";
import {
  Bindable,
  Binding,
  BindingFactory,
  Resolvable,
  ResolverContract,
} from "./contracts/resolver.contract.js";
import { ResolverError } from "./errors/resolver.error.js";

export class Resolver implements ResolverContract {
  protected _bindingFactory: BindingFactory;

  protected _keyIndex: Map<BindingKey, BindingContract> = new Map();

  protected _tagIndex: Map<BindingKey, Set<BindingContract>> = new Map();

  public constructor(bindingFactory: BindingFactory) {
    this._bindingFactory = bindingFactory;
  }

  public bind(bindable: Bindable): Binding {
    const bindingKey =
      typeof bindable === "function" ? bindable.name : bindable;
    return {
      toAlias: (alias) => this.createAliasBinding(alias).setKey(bindingKey),
      toClass: (target) => this.createClassBinding(target).setKey(bindingKey),
      toConstant: (constant) =>
        this.createConstantBinding(constant).setKey(bindingKey),
      toConstructor: (target) =>
        this.createConstructorBinding(target).setKey(bindingKey),
      toFunction: (target) =>
        this.createFunctionBinding(target).setKey(bindingKey),
      toKey: (key) => this.createKeyBinding(key).setKey(bindingKey),
      toMethod: (target, method) =>
        this.createMethodBinding(target, method).setKey(bindingKey),
      toTag: (tag) => this.createTagBinding(tag).setKey(bindingKey),
    };
  }

  public createAliasBinding(alias: BindingKey): BindingContract {
    return this.createKeyBinding(alias);
  }

  public createClassBinding(target: Function): BindingContract {
    return this.createConstructorBinding(target);
  }

  public createConstantBinding(constant: unknown): BindingContract {
    return this._bindingFactory.createConstantBinding(this, constant);
  }

  public createConstructorBinding(target: Function): BindingContract {
    return this._bindingFactory.createConstructorBinding(this, target);
  }

  public createFunctionBinding(target: Function): BindingContract {
    return this._bindingFactory.createFunctionBinding(this, target);
  }

  public createKeyBinding(key: BindingKey): BindingContract {
    return this._bindingFactory.createKeyBinding(this, key);
  }

  public createMethodBinding(
    target: Object | Function,
    method: string | symbol,
  ): BindingContract {
    return this._bindingFactory.createMethodBinding(this, target, method);
  }

  public createTagBinding(tag: BindingTag): BindingContract {
    return this._bindingFactory.createTagBinding(this, tag);
  }

  public deindexByKey(binding: BindingContract, key: BindingKey): this {
    this._keyIndex.delete(key);
    return this;
  }

  public deindexByTag(binding: BindingContract, tag: BindingTag): this {
    if (!this._tagIndex.has(tag)) this._tagIndex.set(tag, new Set());
    const tags = this._tagIndex.get(tag) as Set<BindingContract>;
    tags.delete(binding);
    return this;
  }

  public findByKey(key: BindingKey): BindingContract {
    if (!this._keyIndex.has(key)) {
      const context = `Resolving binding.`;
      const problem = `Binding key not found.`;
      const solution = `Please use another binding key.`;
      throw new ResolverError(`${context} ${problem} ${solution}`);
    }
    return this._keyIndex.get(key) as BindingContract;
  }

  public findByTag(tag: BindingTag): BindingContract[] {
    if (!this._tagIndex.has(tag)) this._tagIndex.set(tag, new Set());
    const tags = this._tagIndex.get(tag) as Set<BindingContract>;
    return Array.from(tags);
  }

  public indexByKey(binding: BindingContract, key: BindingKey): this {
    this._keyIndex.set(key, binding);
    return this;
  }

  public indexByTag(binding: BindingContract, tag: BindingTag): this {
    if (!this._tagIndex.has(tag)) this._tagIndex.set(tag, new Set());
    const tags = this._tagIndex.get(tag) as Set<BindingContract>;
    tags.add(binding);
    return this;
  }

  public resolve<Result>(
    cache: CacheContract,
    resolvable: Resolvable,
    ...args: unknown[]
  ): Result {
    const bindingKey = Array.isArray(resolvable)
      ? typeof resolvable[0] === "function"
        ? resolvable[0].name
        : resolvable[0]
      : typeof resolvable === "function"
      ? resolvable.name
      : resolvable;

    const binding = this.findByKey(bindingKey);
    if (binding.scope === "transient")
      return this.resolveKey(cache, bindingKey, ...args);

    const scope = cache.scopeTo(binding.scope);
    return scope.has(bindingKey)
      ? (scope.get(bindingKey) as Result)
      : (scope
          .set(bindingKey, this.resolveKey(cache, bindingKey, ...args))
          .get(bindingKey) as Result);
  }

  public resolveAlias<Result>(
    cache: CacheContract,
    alias: BindingKey,
    ...args: unknown[]
  ): Result {
    return this.createAliasBinding(alias).resolve(cache, ...args);
  }

  public resolveClass<Result>(
    cache: CacheContract,
    target: Function,
    ...args: unknown[]
  ): Result {
    return this.createClassBinding(target).resolve(cache, ...args);
  }

  public resolveConstant<Result>(
    cache: CacheContract,
    constant: unknown,
    ...args: unknown[]
  ): Result {
    return this.createConstantBinding(constant).resolve(cache, ...args);
  }

  public resolveConstructor<Result>(
    cache: CacheContract,
    target: Function,
    ...args: unknown[]
  ): Result {
    return this.createConstructorBinding(target).resolve(cache, ...args);
  }

  public resolveFunction<Result>(
    cache: CacheContract,
    target: Function,
    ...args: unknown[]
  ): Result {
    return this.createFunctionBinding(target).resolve(cache, ...args);
  }

  public resolveKey<Result>(
    cache: CacheContract,
    key: BindingKey,
    ...args: unknown[]
  ): Result {
    return this.createKeyBinding(key).resolve(cache, ...args);
  }

  public resolveMethod<Result>(
    cache: CacheContract,
    target: Object | Function,
    method: string | symbol,
    ...args: unknown[]
  ): Result {
    return this.createMethodBinding(target, method).resolve(cache, ...args);
  }

  public resolveTag<Result>(
    cache: CacheContract,
    tag: BindingTag,
    ...args: unknown[]
  ): Result {
    return this.createTagBinding(tag).resolve(cache, ...args);
  }
}

export const DefaultBindingFactory: BindingFactory = {
  createConstantBinding(resolver, constant) {
    return new ConstantBinding(resolver, constant);
  },
  createConstructorBinding(resolver, target) {
    return new ConstructorBinding(resolver, target);
  },
  createFunctionBinding(resolver, target) {
    return new FunctionBinding(resolver, target);
  },
  createKeyBinding(resolver, key) {
    return new KeyBinding(resolver, key);
  },
  createMethodBinding(resolver, target, method) {
    return new MethodBinding(resolver, target, method);
  },
  createTagBinding(resolver, tag) {
    return new TagBinding(resolver, tag);
  },
};
