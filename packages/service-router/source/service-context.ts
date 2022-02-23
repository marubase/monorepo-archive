import {
  ServiceContextInterface,
  ServiceResolver,
} from "./contracts/service-context.contract.js";
import {
  RequestMethod,
  ServiceRequestInterface,
} from "./contracts/service-request.contract.js";
import {
  ServiceResponseContract,
  ServiceResponseInterface,
  StatusCode,
  StatusText,
} from "./contracts/service-response.contract.js";

export class ServiceContext implements ServiceContextInterface {
  protected _request: ServiceRequestInterface;

  protected _resolver: ServiceResolver;

  public constructor(
    resolver: ServiceResolver,
    request: ServiceRequestInterface,
  ) {
    this._resolver = resolver;
    this._request = request;
  }

  public get credentials(): string | [string, string] | undefined {
    return this._request.credentials;
  }

  public get hash(): string {
    return this._request.hash;
  }

  public get hostname(): string {
    return this._request.hostname;
  }

  public get href(): string {
    return this._request.href;
  }

  public get method(): RequestMethod {
    return this._request.method;
  }

  public get origin(): string {
    return this._request.origin;
  }

  public get path(): string {
    return this._request.path;
  }

  public get port(): number {
    return this._request.port;
  }

  public get protocol(): string {
    return this._request.protocol;
  }

  public get queries(): Record<string, string> {
    return this._request.queries;
  }

  public get request(): ServiceRequestInterface {
    return this._request;
  }

  public get scheme(): string {
    return this._request.scheme;
  }

  public get url(): URL {
    return this._request.url;
  }

  public replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface {
    return this._resolver
      .resolve<ServiceResponseInterface>(ServiceResponseContract)
      .setStatusCode(statusCode)
      .setStatusText(statusText || StatusText[statusCode]);
  }

  public resolve<Result>(target: string | symbol, ...args: unknown[]): Result {
    return this._resolver.resolve(target, ...args);
  }
}
