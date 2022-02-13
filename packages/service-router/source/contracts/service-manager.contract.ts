import { Bindable } from "@marubase/container";
import { ServiceRouterInterface } from "./service-router.contract.js";

export const ServiceManagerContract = Symbol("ServiceManagerContract");

export interface ServiceManagerInterface {
  readonly hosts: Record<string, ServiceRouterInterface>;

  readonly services: Map<Bindable, ServiceRouterInterface>;

  define(service: Bindable, defineFn: DefineFn): this;

  host(origin: string, service: Bindable): this;

  unhost(origin: string): this;
}

export type DefineFn = (router: ServiceRouterInterface) => void;
