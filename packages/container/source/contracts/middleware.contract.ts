import { Resolvable } from "./registry.contract.js";
import { ScopeContract } from "./scope.contract.js";

export interface MiddlewareContract {
  handle<Result>(context: Context, next: NextFn): Result;
}

export type Context = {
  args: Array<unknown>;
  resolvable: Resolvable;
  scope: ScopeContract;
};

export type NextFn = () => unknown;
