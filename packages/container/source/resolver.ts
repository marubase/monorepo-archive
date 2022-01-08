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
  BindingFactory,
  Resolvable,
  ResolverBinding,
  ResolverContract,
} from "./contracts/resolver.contract.js";

export class Resolver implements ResolverContract {
  protected _bindingFactory: BindingFactory;

  protected _keyIndex: Map<BindingKey, BindingContract> = new Map();

  protected _tagIndex: Map<BindingKey, Set<BindingContract>> = new Map();

  public constructor(bindingFactory: BindingFactory, parent?: Resolver) {
    if (typeof parent !== "undefined") {
      this._keyIndex = new Map(parent._keyIndex);
      this._tagIndex = new Map(parent._tagIndex);
    }
    this._bindingFactory = bindingFactory;
  }

  public bind(bindable: Bindable): ResolverBinding {
    const bindingKey =
      typeof bindable === "function" ? bindable.name : bindable;
    return {
      toAlias: (alias) => this.createKeyBinding(alias).setKey(bindingKey),
      toClass: (target) =>
        this.createConstructorBinding(target).setKey(bindingKey),
      toConstant: (constant) =>
        this.createConstantBinding(constant).setKey(bindingKey),
      toFunction: (target) =>
        this.createFunctionBinding(target).setKey(bindingKey),
      toMethod: (target, method) =>
        this.createMethodBinding(target, method).setKey(bindingKey),
      toTag: (tag) => this.createTagBinding(tag).setKey(bindingKey),
    };
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

  public findByKey(key: BindingKey): BindingContract | undefined {
    return this._keyIndex.get(key);
  }

  public findByTag(tag: BindingTag): BindingContract[] {
    if (!this._tagIndex.has(tag)) this._tagIndex.set(tag, new Set());
    const tags = this._tagIndex.get(tag) as Set<BindingContract>;
    return Array.from(tags);
  }

  public fork(): this {
    const Static = this.constructor as typeof Resolver;
    return new Static(this._bindingFactory, this) as this;
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
    const bindingKey =
      typeof resolvable === "function" ? resolvable.name : resolvable;
    return this.createKeyBinding(bindingKey).resolve(cache, ...args);
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
