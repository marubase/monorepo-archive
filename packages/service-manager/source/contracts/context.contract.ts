import { RequestMethod } from "./request.contract.js";
import { ResponseInterface, StatusCode } from "./response.contract.js";

export const ContextContract = Symbol("ContextContract");

export interface ContextInterface {
  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly params: Record<string, string>;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  readonly store: Record<string, unknown>;

  clear(key: string): this;

  get<Result>(key: string): Result | undefined;

  has(key: string): boolean;

  respondWith(statusCode: StatusCode, statusText?: string): ResponseInterface;

  set(key: string, value: string): this;

  setParams(params: Record<string, string>): this;
}
