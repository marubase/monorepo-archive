import { ServiceContextInterface } from "./service-context.contract.js";
import {
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./service-request.contract.js";
import { ServiceResponseInterface } from "./service-response.contract.js";

export const ServiceRouterContract = Symbol("ServiceRouterContract");

export interface ServiceRouterInterface {
  configure(configureFn: ConfigureFn): this;

  dispatch(request: ServiceRequestInterface): Promise<ServiceResponseInterface>;
  dispatch(
    context: ServiceContextInterface,
    next: NextFn,
  ): Promise<ServiceResponseInterface>;

  handle(handler: HandleFn | ServiceRouterInterface): void;

  method(method: ServiceRequestMethod[] | ServiceRequestMethod): MatchMethod;

  path(path: string): MatchPath;

  request(method: ServiceRequestMethod, path: string): ServiceRequestInterface;
}

export type ConfigureFn = (router: ServiceRouterInterface) => void;

export type HandleFn = (
  context: ServiceContextInterface,
  next: NextFn,
) => Promise<ServiceResponseInterface>;

export type MatchMethod = {
  handle(handler: HandleFn | ServiceRouterInterface): void;

  path(path: string): MatchPath;
};

export type MatchPath = {
  handle(handler: HandleFn | ServiceRouterInterface): void;
};

export type NextFn = () => Promise<ServiceResponseInterface>;
