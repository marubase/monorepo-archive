import { ContainerInterface } from "@marubase/container";
import { ContextInterface } from "./context.contract.js";
import {
  RequestDispatchable,
  RequestInterface,
  RequestMethod,
} from "./request.contract.js";
import { ResponseInterface, StatusCode } from "./response.contract.js";
import { ServiceDefinitionInterface } from "./service-definition.contract.js";
import { ServiceInstanceInterface } from "./service-instance.contract.js";

export const ServiceManagerContract = Symbol("ServiceManagerContract");

export interface ServiceManagerInterface extends ContainerInterface {
  readonly instances: Record<string, ServiceInstanceInterface>;

  readonly services: Record<string, ServiceDefinitionInterface>;

  dispatch(request: RequestInterface): Promise<ResponseInterface>;

  request(method: RequestMethod, path: string): RequestInterface;

  restart(
    origin: string,
    name: string,
    store?: Record<string, unknown>,
  ): ServiceInstanceInterface;

  service(name: string): ServiceDefinitionInterface;

  start(
    origin: string,
    name: string,
    store?: Record<string, unknown>,
  ): ServiceInstanceInterface;

  stop(origin: string): ServiceInstanceInterface;
}

export type ServiceManagerFactory = {
  createContext: (
    factory: ServiceManagerFactory,
    manager: ServiceManagerInterface,
    request: RequestInterface,
  ) => ContextInterface;

  createRequest: (
    dispatchable: RequestDispatchable,
    method: RequestMethod,
    path: string,
  ) => RequestInterface;

  createResponse: (
    statusCode: StatusCode,
    statusText?: string,
  ) => ResponseInterface;

  createServiceDefinition: (
    factory: ServiceManagerFactory,
    manager: ServiceManagerInterface,
    name: string,
  ) => ServiceDefinitionInterface;

  createServiceInstance: (
    service: ServiceDefinitionInterface,
    origin: string,
    store: Record<string, unknown>,
  ) => ServiceInstanceInterface;
};
