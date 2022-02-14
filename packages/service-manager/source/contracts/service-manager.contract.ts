import { ContainerInterface } from "@marubase/container";
import {
  ConfigureFn,
  ServiceRouterInterface,
} from "./service-router.contract.js";

export const ServiceManagerContract = Symbol("ServiceManagerContract");

export interface ServiceManagerInterface extends ContainerInterface {
  readonly routers: string[];

  readonly services: Record<string, string>;

  configure(name: string, configureFn: ConfigureFn): this;

  host(origin: string, name: string): this;

  router(name: string): ServiceRouterInterface;

  service(origin: string): ServiceRouterInterface;

  unhost(origin: string): this;
}
