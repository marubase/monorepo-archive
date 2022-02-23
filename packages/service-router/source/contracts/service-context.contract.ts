import {
  RequestMethod,
  ServiceRequestInterface,
} from "./service-request.contract.js";
import {
  ServiceResponseInterface,
  StatusCode,
} from "./service-response.contract.js";

export const ServiceContextContract = Symbol("ServiceContextContract");

export interface ServiceContextInterface {
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

  readonly request: ServiceRequestInterface;

  readonly scheme: string;

  readonly url: URL;

  replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface;

  resolve<Result>(target: string | symbol, ...args: unknown[]): Result;
}

export type ServiceResolver = {
  resolve<Result>(target: string | symbol, ...args: unknown[]): Result;
};
