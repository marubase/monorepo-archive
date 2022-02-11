import { MessageInterface } from "./message.contract.js";

export const RequestContract = Symbol("RequestContract");

export interface RequestInterface extends MessageInterface {
  readonly method: RequestMethod;

  readonly url: URL;

  setHash(hash: string): this;

  setHostname(hostname: string): this;

  setMethod(method: RequestMethod): this;

  setParam(key: string, value: Array<string> | string): this;

  setPassword(password: string): this;

  setPathname(pathname: string): this;

  setPort(port: number): this;

  setProtocol(protocol: string): this;

  setURL(url: URL | string, base?: string): this;

  setUsername(username: string): this;
}

export type RequestParams = Record<string, Array<string>>;

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
