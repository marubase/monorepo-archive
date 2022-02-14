import { ContainerInterface } from "@marubase/container";
import {
  ConfigureFn,
  ServiceRouterInterface,
} from "./service-router.contract.js";

export const ServiceManagerContract = Symbol("ServiceManagerContract");

export interface ServiceManagerInterface extends ContainerInterface {
  readonly routers: Record<string, ServiceRouterInterface>;

  readonly services: Record<string, ServiceRouterInterface>;

  configure(name: string, configureFn: ConfigureFn): this;

  host(origin: string, name: string): this;

  router(name: string): ServiceRouterInterface | undefined;

  service(origin: string): ServiceRouterInterface | undefined;

  unhost(origin: string): this;
}
