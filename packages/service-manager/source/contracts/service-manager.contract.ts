import { ContainerInterface } from "@marubase/container";
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

export interface ServiceManagerInterface extends ContainerInterface {
  readonly routers: string[];

  readonly services: Record<string, string>;

  configure(name: string, configureFn: ConfigureFn): this;

  dispatch(request: ServiceRequestInterface): Promise<ServiceResponseInterface>;

  host(origin: string, name: string): this;

  request(
    method: ServiceRequestMethod,
    path: string,
    origin: string,
  ): ServiceRequestInterface;

  router(name: string): ServiceRouterInterface;

  service(origin: string): ServiceRouterInterface;

  unhost(origin: string): this;
}
