import { Callable, inject, Resolvable, resolvable } from "@marubase/container";
import { ServiceContextInterface } from "./contracts/service-context.contract.js";
import {
  ServiceManagerContract,
  ServiceManagerInterface,
} from "./contracts/service-manager.contract.js";
import {
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./contracts/service-request.contract.js";
import {
  ServiceResponseContract,
  ServiceResponseInterface,
  StatusCode,
} from "./contracts/service-response.contract.js";
import { ServiceRouterInterface } from "./contracts/service-router.contract.js";

@resolvable()
export class ServiceContext
  extends Map<unknown, unknown>
  implements ServiceContextInterface
{
  protected _manager: ServiceManagerInterface;

  protected _params: Record<string, string> = {};

  protected _request: ServiceRequestInterface;

  public constructor(
    @inject(ServiceManagerContract) manager: ServiceManagerInterface,
    request: ServiceRequestInterface,
  ) {
    super();
    this._manager = manager;
    this._request = request;
  }

  public get credential(): [string, string] | string | undefined {
    return this._request.credential;
  }

  public get hash(): string {
    return this._request.hash;
  }

  public get hostname(): string {
    return this._request.hostname;
  }

  public get method(): ServiceRequestMethod {
    return this._request.method;
  }

  public get origin(): string {
    return this._request.origin;
  }

  public get params(): Record<string, string> {
    return this._params;
  }

  public get path(): string {
    return this._request.path;
  }

  public get port(): number {
    return this._request.port;
  }

  public get queries(): Record<string, string> {
    return this._request.queries;
  }

  public get routers(): string[] {
    return this._manager.routers;
  }

  public get scheme(): string {
    return this._request.scheme;
  }

  public get services(): Record<string, string> {
    return this._manager.services;
  }

  public call<Result>(callable: Callable, ...args: unknown[]): Result {
    return this._manager.call(callable, ...args);
  }

  public host(origin: string, name: string): this {
    this._manager.host(origin, name);
    return this;
  }

  public replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface {
    const response = this._manager.resolve<ServiceResponseInterface>(
      ServiceResponseContract,
    );
    return typeof statusText !== "undefined"
      ? response.setStatusCode(statusCode).setStatusText(statusText)
      : response.setStatusCode(statusCode);
  }

  public request(
    method: ServiceRequestMethod,
    path: string,
    origin: string,
  ): ServiceRequestInterface {
    return this._manager.request(method, path, origin);
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._manager.resolve(resolvable, ...args);
  }

  public router(name: string): ServiceRouterInterface {
    return this._manager.router(name);
  }

  public service(origin: string): ServiceRouterInterface {
    return this._manager.service(origin);
  }

  public unhost(origin: string): this {
    this._manager.unhost(origin);
    return this;
  }
}
