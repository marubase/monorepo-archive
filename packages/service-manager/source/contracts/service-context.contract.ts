import { Callable, ContainerInterface, Resolvable } from "@marubase/container";
import { ServiceRequestMethod } from "./service-request.contract.js";
import {
  ServiceResponseInterface,
  StatusCode,
} from "./service-response.contract.js";

export const ServiceContextContract = Symbol("ContextContract");

export interface ServiceContextInterface extends Map<unknown, unknown> {
  readonly container: ContainerInterface;

  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly method: ServiceRequestMethod;

  readonly origin: string;

  readonly params: Record<string, string>;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  call<Result>(callable: Callable, ...args: unknown[]): Result;

  replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface;

  resolve<Result>(resolvable: Resolvable, ...args: unknown[]): Result;
}
