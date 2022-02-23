import { Message } from "@marubase-tools/message";

export const ServiceRequestContract = Symbol("ServiceRequestContract");

export interface ServiceRequestInterface extends Message {
  readonly credentials?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly href: string;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly protocol: string;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  readonly url: URL;

  clearCredential(): this;

  clearHash(): this;

  clearQueries(): this;

  clearQuery(key: string): this;

  setCredential(token: string): this;
  setCredential(username: string, password: string): this;

  setHash(hash: string): this;

  setHostname(hostname: string): this;

  setHref(href: string): this;

  setMethod(method: RequestMethod): this;

  setOrigin(origin: string): this;

  setPath(path: string): this;

  setPort(port: number): this;

  setProtocol(protocol: string): this;

  setQueries(queries: Record<string, string>): this;

  setQuery(key: string, value: string): this;

  setScheme(scheme: string): this;

  setUrl(url: URL): this;
  setUrl(url: string): this;
  setUrl(url: string, base: string): this;
}

export type RequestMethod =
  | "ACL"
  | "BIND"
  | "CHECKOUT"
  | "CONNECT"
  | "COPY"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "LINK"
  | "LOCK"
  | "M-SEARCH"
  | "MERGE"
  | "MKACTIVITY"
  | "MKCALENDAR"
  | "MKCOL"
  | "MOVE"
  | "NOTIFY"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PROPFIND"
  | "PROPPATCH"
  | "PURGE"
  | "PUT"
  | "REBIND"
  | "REPORT"
  | "SEARCH"
  | "SOURCE"
  | "SUBSCRIBE"
  | "TRACE"
  | "UNBIND"
  | "UNLINK"
  | "UNLOCK"
  | "UNSUBSCRIBE";
