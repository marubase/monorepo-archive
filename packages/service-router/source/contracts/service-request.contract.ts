import { ServiceMessageInterface } from "./service-message.contract.js";
import { ServiceResponseInterface } from "./service-response.contract.js";

export const ServiceRequestContract = Symbol("RequestContract");

export interface ServiceRequestInterface extends ServiceMessageInterface {
  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly method: ServiceRequestMethod;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  clearCredential(): this;

  clearHash(): this;

  clearQueries(): this;

  clearQuery(key: string): this;

  dispatch(): Promise<ServiceResponseInterface>;

  setCredential(token: string): this;
  setCredential(username: string, password?: string): this;

  setDispatcher(dispatcher: ServiceRequestDispatcher): this;

  setHash(hash: string): this;

  setHostname(hostname: string): this;

  setMethod(method: ServiceRequestMethod): this;

  setOrigin(origin: string): this;

  setPath(path: string): this;

  setPort(port: string): this;

  setQueries(queries: Record<string, string>): this;

  setQuery(key: string, value: string): this;

  setScheme(scheme: string): this;
}

export type ServiceRequestDispatcher = {
  dispatch(request: ServiceRequestInterface): Promise<ServiceResponseInterface>;
};

export type ServiceRequestMethod =
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
