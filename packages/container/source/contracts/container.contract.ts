import { CacheContract } from "./cache.contract.js";
import {
  Bindable,
  Resolvable,
  ResolverBinding,
  ResolverContract,
} from "./resolver.contract.js";

export interface ContainerContract {
  readonly cache: CacheContract;

  readonly resolver: ResolverContract;

  bind(bindable: Bindable): ResolverBinding;

  fork(): this;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;
}
