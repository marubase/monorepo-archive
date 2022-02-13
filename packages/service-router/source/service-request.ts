import { resolvable } from "@marubase/container";
import {
  ServiceRequestDispatcher,
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./contracts/service-request.contract.js";
import { ServiceResponseInterface } from "./contracts/service-response.contract.js";
import { ServiceRouterError } from "./errors/service-router.error.js";
import { ServiceMessage } from "./service-message.js";

@resolvable()
export class ServiceRequest
  extends ServiceMessage
  implements ServiceRequestInterface
{
  protected _dispatcher?: ServiceRequestDispatcher;

  protected _method: ServiceRequestMethod = "GET";

  protected _url: URL = new URL("/", "http://127.0.0.1");

  public get credential(): [string, string] | string | undefined {
    return this._url.username !== ""
      ? this._url.password !== ""
        ? [this._url.username, this._url.password]
        : this._url.username
      : undefined;
  }

  public get dispatcher(): ServiceRequestDispatcher | undefined {
    return this._dispatcher;
  }

  public get hash(): string {
    return this._url.hash;
  }

  public get hostname(): string {
    return this._url.hostname;
  }

  public get method(): ServiceRequestMethod {
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
    if (typeof this._dispatcher === "undefined") {
      const context = `Dispatching service request.`;
      const problem = `Request dispatcher not set.`;
      const solution = `Please set the request dispatcher before invoking dispatch.`;
      throw new ServiceRouterError(500, `${context} ${problem} ${solution}`);
    }
    return this._dispatcher.dispatch(this);
  }

  public setCredential(token: string): this;
  public setCredential(username: string, password: string): this;
  public setCredential(tokenOrUsername: string, password?: string): this {
    this._url.username = tokenOrUsername;
    this._url.password = password || "";
    return this;
  }

  public setDispatcher(dispatcher: ServiceRequestDispatcher): this {
    this._dispatcher = dispatcher;
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

  public setMethod(method: ServiceRequestMethod): this {
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

  public setPort(port: string): this {
    this._url.port = port;
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
