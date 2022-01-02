import { Bindable, Resolvable } from "./registry.contract.js";
import { ResolverContract } from "./resolver.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface PluginContract {
  onBind?(context: BindContext, next: BindNext): ResolverContract;

  onResolve?<Result>(
    context: ResolveContext,
    next: ResolveNext<Result>,
  ): Result;
}

export type BindContext = {
  bindable: Bindable;
};

export type BindNext = () => ResolverContract;

export type ResolveContext = {
  args: Array<unknown>;
  resolvable: Resolvable;
  scope: ScopeContract;
};

export type ResolveNext<Result> = () => Result;
