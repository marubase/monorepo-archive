import { MessageHeaders } from "./message.contract.js";
import { RequestInterface, RequestMethod } from "./request.contract.js";
import { ResponseInterface, StatusCode } from "./response.contract.js";

export const ContextContract = Symbol("ContextContract");

export interface ContextInterface {
  readonly body: unknown;

  readonly headers: MessageHeaders;

  readonly method: RequestMethod;

  readonly request: RequestInterface;

  readonly response: ResponseInterface;

  readonly url: URL;

  clearHeader(key: string): this;

  getHeader(key: string): string[] | string | undefined;

  hasHeader(key: string): boolean;

  setBody(body: unknown): this;

  setHeader(key: string, value: string[] | string): this;

  setStatus(status: StatusCode): this;

  setStatusText(statusText: string): this;
}
