import {
  Callable,
  ContainerContract,
  ContainerInterface,
  inject,
  resolvable,
  Resolvable,
} from "@marubase/container";
import { ServiceContextInterface } from "./contracts/service-context.contract.js";
import {
  ServiceRequestContract,
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./contracts/service-request.contract.js";
import {
  ServiceResponseContract,
  ServiceResponseInterface,
  StatusCode,
} from "./contracts/service-response.contract.js";

@resolvable()
export class ServiceContext
  extends Map<unknown, unknown>
  implements ServiceContextInterface
{
  protected _container: ContainerInterface;

  protected _params: Record<string, string> = {};

  protected _request: ServiceRequestInterface;

  protected _store: Record<string, unknown> = {};

  public constructor(
    @inject(ContainerContract) container: ContainerInterface,
    @inject(ServiceRequestContract) request: ServiceRequestInterface,
  ) {
    super();
    this._container = container;
    this._request = request;
  }

  public get container(): ContainerInterface {
    return this._container;
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

  public get scheme(): string {
    return this._request.scheme;
  }

  public get store(): Record<string, unknown> {
    return this._store;
  }

  public call<Result>(callable: Callable, ...args: unknown[]): Result {
    return this._container.call(callable, ...args);
  }

  public replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface {
    const response = this._container.resolve<ServiceResponseInterface>(
      ServiceResponseContract,
    );
    return typeof statusText !== "undefined"
      ? response.setStatusCode(statusCode).setStatusText(statusText)
      : response.setStatusCode(statusCode);
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._container.resolve(resolvable, ...args);
  }
}
