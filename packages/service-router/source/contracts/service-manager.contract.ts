import { ContainerInterface } from "@marubase/container";
import {
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./service-request.contract.js";
import { ServiceResponseInterface } from "./service-response.contract.js";
import { ServiceRouterInterface } from "./service-router.contract.js";

export const ServiceManagerContract = Symbol("ServiceManagerContract");

export interface ServiceManagerInterface {
  readonly container: ContainerInterface;

  readonly hosts: Record<string, ServiceRouterInterface>;

  readonly services: Record<string, ServiceRouterInterface>;

  define(service: string, defineFn: DefineFn): this;

  dispatch(request: ServiceRequestInterface): Promise<ServiceResponseInterface>;

  host(origin: string, service: string): this;

  request(
    origin: string,
    method: ServiceRequestMethod,
    path: string,
  ): ServiceRequestInterface;

  unhost(origin: string): this;
}

export type DefineFn = (router: ServiceRouterInterface) => void;
