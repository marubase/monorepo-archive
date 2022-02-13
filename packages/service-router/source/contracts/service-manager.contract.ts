import {
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./service-request.contract.js";
import { ServiceResponseInterface } from "./service-response.contract.js";
import {
  ConfigureFn,
  ServiceRouterInterface,
} from "./service-router.contract.js";

export const ServiceManagerContract = Symbol("ServiceManagerContract");

export interface ServiceManagerInterface {
  readonly hosts: Record<string, ServiceRouterInterface>;

  readonly services: Record<string, ServiceRouterInterface>;

  configure(service: string, configureFn: ConfigureFn): this;

  dispatch(request: ServiceRequestInterface): Promise<ServiceResponseInterface>;

  host(origin: string, service: string): this;

  request(
    origin: string,
    method: ServiceRequestMethod,
    path: string,
  ): ServiceRequestInterface;

  unhost(origin: string): this;
}
