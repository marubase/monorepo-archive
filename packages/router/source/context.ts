import { ContextInterface } from "./contracts/context.contract.js";
import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusCode,
} from "./contracts/response.contract.js";

export class Context implements ContextInterface {
  protected _request: RequestInterface;

  protected _response: ResponseInterface;

  public constructor(request: RequestInterface, response: ResponseInterface) {
    this._request = request;
    this._response = response;
  }

  public get body(): unknown {
    return this._request.body;
  }

  public get headers(): Record<string, string[]> {
    return this._request.headers;
  }

  public get method(): RequestMethod {
    return this._request.method;
  }

  public get request(): RequestInterface {
    return this._request;
  }

  public get response(): ResponseInterface {
    return this._response;
  }

  public get url(): URL {
    return this._request.url;
  }

  public clearHeader(key: string): this {
    this._response.clearHeader(key);
    return this;
  }

  public getHeader(key: string): string | string[] | undefined {
    return this._request.getHeader(key);
  }

  public hasHeader(key: string): boolean {
    return this._request.hasHeader(key);
  }

  public setBody(body: unknown): this {
    this._response.setBody(body);
    return this;
  }

  public setHeader(key: string, value: string | string[]): this {
    this._response.setHeader(key, value);
    return this;
  }

  public setStatus(status: StatusCode): this {
    this._response.setStatus(status);
    return this;
  }

  public setStatusText(statusText: string): this {
    this._response.setStatusText(statusText);
    return this;
  }
}
