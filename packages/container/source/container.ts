import { Cache } from "./cache.js";
import { CacheContract } from "./contracts/cache.contract.js";
import { ContainerContract } from "./contracts/container.contract.js";
import {
  Bindable,
  Resolvable,
  ResolverBinding,
  ResolverContract,
} from "./contracts/resolver.contract.js";
import { DefaultBindingFactory, Resolver } from "./resolver.js";

export class Container implements ContainerContract {
  protected _cache: CacheContract = new Cache();

  protected _resolver: ResolverContract = new Resolver(DefaultBindingFactory);

  public constructor(parent?: Container) {
    if (typeof parent !== "undefined") {
      this._cache = parent.cache.fork("container");
      this._resolver = parent.resolver.fork();
    }
    this.bind(this.constructor.name).toConstant(this);
  }

  public get cache(): CacheContract {
    return this._cache;
  }

  public get resolver(): ResolverContract {
    return this._resolver;
  }

  public bind(bindable: Bindable): ResolverBinding {
    return this._resolver.bind(bindable);
  }

  public fork(): this {
    const Static = this.constructor as typeof Container;
    return new Static(this) as this;
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._resolver.resolve(
      this._cache.fork("request"),
      resolvable,
      ...args,
    );
  }
}
