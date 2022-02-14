import { Callable, Resolvable } from "@marubase/container";
import { ServiceRequestMethod } from "./service-request.contract.js";
import {
  ServiceResponseInterface,
  StatusCode,
} from "./service-response.contract.js";
import { ServiceRouterInterface } from "./service-router.contract.js";

export const ServiceContextContract = Symbol("ContextContract");

export interface ServiceContextInterface extends Map<unknown, unknown> {
  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly method: ServiceRequestMethod;

  readonly origin: string;

  readonly params: Record<string, string>;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly routers: Record<string, ServiceRouterInterface>;

  readonly scheme: string;

  readonly services: Record<string, ServiceRouterInterface>;

  call<Result>(callable: Callable, ...args: unknown[]): Result;

  host(origin: string, name: string): this;

  replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;

  router(name: string): ServiceRouterInterface | undefined;

  service(origin: string): ServiceRouterInterface | undefined;

  unhost(origin: string): this;
}
