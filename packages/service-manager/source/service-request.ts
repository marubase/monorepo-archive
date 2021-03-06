import {
  RequestMethod,
  ServiceRequestDispatcher,
  ServiceRequestInterface,
} from "./contracts/service-request.contract.js";
import { ServiceResponseInterface } from "./contracts/service-response.contract.js";
import { ServiceMessage } from "./service-message.js";

export class ServiceRequest
  extends ServiceMessage
  implements ServiceRequestInterface
{
  protected _dispatcher: ServiceRequestDispatcher;

  protected _method: RequestMethod;

  protected _url: URL;

  public constructor(
    dispatcher: ServiceRequestDispatcher,
    method: RequestMethod,
    path: string,
    origin = "http://127.0.0.1",
  ) {
    super();
    this._dispatcher = dispatcher;
    this._method = method;
    this._url = new URL(path, origin);
  }

  public get credential(): [string, string] | string | undefined {
    return this._url.username !== ""
      ? this._url.password !== ""
        ? [this._url.username, this._url.password]
        : this._url.username
      : undefined;
  }

  public get hash(): string {
    return this._url.hash;
  }

  public get hostname(): string {
    return this._url.hostname;
  }

  public get method(): RequestMethod {
    return this._method;
  }

  public get origin(): string {
    return this._url.origin;
  }

  public get path(): string {
    return this._url.pathname;
  }

  public get port(): number {
    if (this._url.port !== "") return parseInt(this._url.port, 10);
    return this._url.protocol.startsWith("https") ? 443 : 80;
  }

  public get queries(): Record<string, string> {
    const queries: Record<string, string> = {};
    for (const [key, value] of this._url.searchParams.entries())
      queries[key] = value;
    return queries;
  }

  public get scheme(): string {
    return this._url.protocol;
  }

  public clearCredential(): this {
    this._url.username = "";
    this._url.password = "";
    return this;
  }

  public clearHash(): this {
    this._url.hash = "";
    return this;
  }

  public clearQueries(): this {
    for (const key of this._url.searchParams.keys())
      this._url.searchParams.delete(key);
    return this;
  }

  public clearQuery(key: string): this {
    this._url.searchParams.delete(key);
    return this;
  }

  public dispatch(): Promise<ServiceResponseInterface> {
    return this._dispatcher.dispatch(this);
  }

  public setCredential(token: string): this;
  public setCredential(username: string, password: string): this;
  public setCredential(tokenOrUsername: string, password?: string): this {
    this._url.username = tokenOrUsername;
    this._url.password = password || "";
    return this;
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

  public setOrigin(origin: string): this {
    const { hostname, port, protocol } = new URL(origin);
    this._url.hostname = hostname;
    this._url.protocol = protocol;
    this._url.port = port;
    return this;
  }

  public setPath(path: string): this {
    this._url.pathname = path;
    return this;
  }

  public setPort(port: number): this {
    this._url.port = port.toString();
    return this;
  }

  public setQueries(queries: Record<string, string>): this {
    this._url.search = new URLSearchParams(queries).toString();
    return this;
  }

  public setQuery(key: string, value: string): this {
    this._url.searchParams.set(key, value);
    return this;
  }

  public setScheme(scheme: string): this {
    this._url.protocol = scheme;
    return this;
  }
}
