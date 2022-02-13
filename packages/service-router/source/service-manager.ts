import {
  ContainerContract,
  ContainerInterface,
  inject,
  resolvable,
} from "@marubase/container";
import { ServiceManagerInterface } from "./contracts/service-manager.contract.js";
import {
  ServiceRequestContract,
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./contracts/service-request.contract.js";
import { ServiceResponseInterface } from "./contracts/service-response.contract.js";
import {
  ConfigureFn,
  ServiceRouterContract,
  ServiceRouterInterface,
} from "./contracts/service-router.contract.js";
import { ServiceRouterError } from "./errors/service-router.error.js";

@resolvable("container")
export class ServiceManager implements ServiceManagerInterface {
  protected _container: ContainerInterface;

  protected _hosts: Record<string, ServiceRouterInterface> = {};

  protected _services: Record<string, ServiceRouterInterface> = {};

  public constructor(@inject(ContainerContract) container: ContainerInterface) {
    this._container = container;
  }

  public get hosts(): Record<string, ServiceRouterInterface> {
    return this._hosts;
  }

  public get services(): Record<string, ServiceRouterInterface> {
    return this._services;
  }

  public configure(service: string, configureFn: ConfigureFn): this {
    if (!(service in this._services))
      this._services[service] = this._container.resolve(ServiceRouterContract);
    this._services[service].configure(configureFn);
    return this;
  }

  public dispatch(
    request: ServiceRequestInterface,
  ): Promise<ServiceResponseInterface> {
    if (!(request.origin in this._hosts)) {
      const context = `Dispatching service request.`;
      const problem = `No service hosting at '${request.origin}'.`;
      const solution = `Please try to request another origin.`;
      throw new ServiceRouterError(500, `${context} ${problem} ${solution}`);
    }
    return this._hosts[request.origin].dispatch(request);
  }

  public host(origin: string, service: string): this {
    if (origin in this._hosts) {
      const context = `Hosting service at '${origin}'.`;
      const problem = `Another service already hosting at '${origin}'.`;
      const solution = `Please try to host service at another origin.`;
      throw new ServiceRouterError(500, `${context} ${problem} ${solution}`);
    }

    const router = this._services[service];
    if (!router) {
      const context = `Hosting service at '${origin}'.`;
      const problem = `Service '${service}' not found.`;
      const solution = `Please try to host another service.`;
      throw new ServiceRouterError(500, `${context} ${problem} ${solution}`);
    }
    this._hosts[origin] = router;
    return this;
  }

  public request(
    origin: string,
    method: ServiceRequestMethod,
    path: string,
  ): ServiceRequestInterface {
    return this._container.resolve<ServiceRequestInterface>(
      ServiceRequestContract,
      this,
      method,
      path,
      origin,
    );
  }

  public unhost(origin: string): this {
    if (!(origin in this._hosts)) {
      const context = `Un-hosting service at '${origin}'.`;
      const problem = `No service hosting at '${origin}'.`;
      const solution = `Please try to un-host service at another origin.`;
      throw new ServiceRouterError(500, `${context} ${problem} ${solution}`);
    }
    delete this._hosts[origin];
    return this;
  }
}
