import { RequestInterface, RequestMethod } from "./request.contract.js";
import { ServiceDefinitionInterface } from "./service-definition.contract.js";

export const ServiceInstanceContract = Symbol("ServiceInstanceContract");

export interface ServiceInstanceInterface {
  readonly origin: string;

  readonly service: ServiceDefinitionInterface;

  readonly store: Record<string, unknown>;

  request(method: RequestMethod, path: string): RequestInterface;
}
