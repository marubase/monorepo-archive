import { Callable, ContainerInterface, Resolvable } from "@marubase/container";
import { ContextInterface } from "./contracts/context.contract.js";
import { ManagerFactory } from "./contracts/manager.contract.js";
import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusCode,
} from "./contracts/response.contract.js";

export class Context implements ContextInterface {
  protected _container: ContainerInterface;

  protected _factory: ManagerFactory;

  protected _params: Record<string, string> = {};

  protected _request: RequestInterface;

  protected _store: Record<string, unknown> = {};

  public constructor(
    container: ContainerInterface,
    request: RequestInterface,
    factory: ManagerFactory,
  ) {
    this._container = container;
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

  public clear(key: string): this {
    delete this._store[key];
    return this;
  }

  public get<Result>(key: string): Result | undefined {
    return this._store[key] as Result;
  }

  public has(key: string): boolean {
    return key in this._store;
  }

  public resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result {
    return this._container.resolve(resolvable, ...args);
  }

  public respondWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ResponseInterface {
    return this._factory.createResponse(statusCode, statusText);
  }

  public set(key: string, value: unknown): this {
    this._store[key] = value;
    return this;
  }
}
