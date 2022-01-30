/* eslint-disable @typescript-eslint/no-unused-vars */
import { RegistryContract } from "../contracts/registry.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { BaseResolver } from "./base-resolver.js";

export class ConstantResolver extends BaseResolver implements ResolverContract {
  protected _constant: unknown;

  public constructor(registry: RegistryContract, constant: unknown) {
    super(registry);
    this._constant = constant;
  }

  public resolve<Result>(scope: ScopeContract, ...args: unknown[]): Result {
    return this._constant as Result;
  }
}
