import { Callable, Resolvable } from "@marubase/container";
import {
  RequestMethod,
  ServiceRequestInterface,
} from "./service-request.contract.js";
import {
  ServiceResponseInterface,
  StatusCode,
} from "./service-response.contract.js";
import { ServiceRouterInterface } from "./service-router.contract.js";

export const ServiceContextContract = Symbol("ContextContract");

export interface ServiceContextInterface extends Map<unknown, unknown> {
  readonly body: unknown;

  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly headers: Record<string, string>;

  readonly hostname: string;

  readonly method: RequestMethod;

  readonly origin: string;

  readonly params: Record<string, string>;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly routers: string[];

  readonly scheme: string;

  readonly services: Record<string, string>;

  call<Result>(callable: Callable, ...args: unknown[]): Result;

  host(origin: string, name: string): this;

  replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface;

  request(
    method: RequestMethod,
    path: string,
    origin: string,
  ): ServiceRequestInterface;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  router(name: string): ServiceRouterInterface;

  service(origin: string): ServiceRouterInterface;

  unhost(origin: string): this;
}
