import { Message } from "@marubase-tools/message";
import {
  RequestMethod,
  ServiceRequestInterface,
} from "./contracts/service-request.contract.js";

export class ServiceRequest extends Message implements ServiceRequestInterface {
  protected _method: RequestMethod = "GET";

  protected _protocol = "HTTP/1.1";

  protected _url = new URL("/", "http://127.0.0.1");

  public get credentials(): string | [string, string] | undefined {
    const { password, username } = this._url;
    return username !== ""
      ? password !== ""
        ? [username, password]
        : username
      : undefined;
  }

  public get hash(): string {
    return this._url.hash;
  }

  public get hostname(): string {
    return this._url.hostname;
  }

  public get href(): string {
    return this._url.href;
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
    const { port, protocol } = this._url;
    return port === ""
      ? protocol.startsWith("https")
        ? 443
        : 80
      : parseInt(port, 10);
  }

  public get protocol(): string {
    return this._protocol;
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

  public get url(): URL {
    return this._url;
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

  public setHref(href: string): this {
    this._url.href = href;
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

  public setProtocol(protocol: string): this {
    this._protocol = protocol;
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

  public setUrl(url: URL): this;
  public setUrl(url: string): this;
  public setUrl(url: string, base: string): this;
  public setUrl(url: URL | string, base?: string): this {
    this._url = new URL(url, base);
    return this;
  }
}
