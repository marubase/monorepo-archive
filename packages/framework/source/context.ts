import { ContextInterface } from "./contracts/context.contract.js";
import { FrameworkFactory } from "./contracts/framework.contract.js";
import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusCode,
} from "./contracts/response.contract.js";

export class Context implements ContextInterface {
  protected _factory: FrameworkFactory;

  protected _request: RequestInterface;

  public constructor(request: RequestInterface, factory: FrameworkFactory) {
    this._request = request;
    this._factory = factory;
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

  public get queries(): Record<string, string> {
    return this._request.queries;
  }

  public get scheme(): string {
    return this._request.scheme;
  }

  public respondWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ResponseInterface {
    return this._factory.createResponse(statusCode, statusText);
  }
}
