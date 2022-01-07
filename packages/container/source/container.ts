import { Cache } from "./cache.js";
import { BindingKey, BindingTag } from "./contracts/binding.contract.js";
import { CacheContract } from "./contracts/cache.contract.js";
import { ContainerContract } from "./contracts/container.contract.js";
import {
  Bindable,
  Binding,
  Resolvable,
  ResolverContract,
} from "./contracts/resolver.contract.js";
import { DefaultBindingFactory, Resolver } from "./resolver.js";

export class Container implements ContainerContract {
  protected _cache: CacheContract;

  protected _resolver: ResolverContract;

  public constructor(cache?: CacheContract, resolver?: ResolverContract) {
    this._cache = cache || new Cache();
    this._resolver = resolver || new Resolver(DefaultBindingFactory);
    this.bind(Container).toConstant(this);
  }

  public get cache(): CacheContract {
    return this._cache;
  }

  public get resolver(): ResolverContract {
    return this._resolver;
  }

  public bind(bindable: Bindable): Binding {
    return this._resolver.bind(bindable);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(this._cache.fork("container"), this._resolver) as this;
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._resolver.resolve(
      this._cache.fork("request"),
      resolvable,
      ...args,
    );
  }

  public resolveAlias<Result>(alias: BindingKey, ...args: unknown[]): Result {
    return this._resolver.resolveAlias(
      this._cache.fork("request"),
      alias,
      ...args,
    );
  }

  public resolveClass<Result>(target: Function, ...args: unknown[]): Result {
    return this._resolver.resolveClass(
      this._cache.fork("request"),
      target,
      ...args,
    );
  }

  public resolveConstant<Result>(
    constant: unknown,
    ...args: unknown[]
  ): Result {
    return this._resolver.resolveConstant(
      this._cache.fork("request"),
      constant,
      ...args,
    );
  }

  public resolveConstructor<Result>(
    target: Function,
    ...args: unknown[]
  ): Result {
    return this._resolver.resolveConstructor(
      this._cache.fork("request"),
      target,
      ...args,
    );
  }

  public resolveFunction<Result>(target: Function, ...args: unknown[]): Result {
    return this._resolver.resolveFunction(
      this._cache.fork("request"),
      target,
      ...args,
    );
  }

  public resolveKey<Result>(key: BindingKey, ...args: unknown[]): Result {
    return this._resolver.resolveKey(this._cache.fork("request"), key, ...args);
  }

  public resolveMethod<Result>(
    target: Object | Function,
    method: string | symbol,
    ...args: unknown[]
  ): Result {
    return this._resolver.resolveMethod(
      this._cache.fork("request"),
      target,
      method,
      ...args,
    );
  }

  public resolveTag<Result>(tag: BindingTag, ...args: unknown[]): Result {
    return this._resolver.resolveTag(this._cache.fork("request"), tag, ...args);
  }
}
