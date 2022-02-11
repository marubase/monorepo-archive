import { RequestMethod } from "../../service-framework/source/contracts/request.contract.js";
import { RequestInterface } from "./contracts/request.contract.js";
import { Message } from "./message.js";

export class Request extends Message implements RequestInterface {
  protected _method: RequestMethod = "GET";

  protected _url = new URL("/", "http://127.0.0.1");

  public get method(): RequestMethod {
    return this._method;
  }

  public get url(): URL {
    return this._url;
  }

  public setHash(hash: string): this {
    this._url.hash = hash;
    return this;
  }

  public setHostname(hostname: string): this {
    this._url.hostname = hostname;
    return this;
  }

  public setMethod(method: RequestMethod): this {
    this._method = method;
    return this;
  }

  public setParam(key: string, value: string | string[]): this {
    const values = !Array.isArray(value) ? [value] : value;
    for (const value of values) this._url.searchParams.append(key, value);
    return this;
  }

  public setPassword(password: string): this {
    this._url.password = password;
    return this;
  }

  public setPathname(pathname: string): this {
    this._url.pathname = pathname;
    return this;
  }

  public setPort(port: number): this {
    this._url.port = port.toString();
    return this;
  }

  public setProtocol(protocol: string): this {
    this._url.protocol = protocol;
    return this;
  }

  public setURL(url: string | URL, base?: string): this {
    this._url = new URL(url, base);
    return this;
  }

  public setUsername(username: string): this {
    this._url.username = username;
    return this;
  }
}
