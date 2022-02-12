import { RequestMethod } from "./request.contract.js";
import { ResponseInterface, StatusCode } from "./response.contract.js";

export const ContextContract = Symbol("ContextContract");

export interface ContextInterface {
  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  respondWith(statusCode: StatusCode, statusText?: string): ResponseInterface;
}
