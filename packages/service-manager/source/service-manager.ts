import { Container } from "@marubase/container";
import {
  RequestContract,
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseContract,
  ResponseInterface,
  StatusText,
} from "./contracts/response.contract.js";
import {
  ServiceDefinitionContract,
  ServiceDefinitionInterface,
} from "./contracts/service-definition.contract.js";
import {
  ServiceInstanceContract,
  ServiceInstanceInterface,
} from "./contracts/service-instance.contract.js";
import { ServiceManagerInterface } from "./contracts/service-manager.contract.js";
import { ServiceManagerError } from "./errors/service-manager.error.js";

export class ServiceManager
  extends Container
  implements ServiceManagerInterface
{
  protected _instances: Record<string, ServiceInstanceInterface> = {};

  protected _services: Record<string, ServiceDefinitionInterface> = {};

  public get instances(): Record<string, ServiceInstanceInterface> {
    return this._instances;
  }

  public get services(): Record<string, ServiceDefinitionInterface> {
    return this._services;
  }

  public dispatch(request: RequestInterface): Promise<ResponseInterface> {
    const instance = this._instances[request.origin];
    if (typeof instance !== "undefined")
      return instance.service.dispatch(request);
    const normalize = (statusText: string): string =>
      statusText.replaceAll(/\s+/g, "_").toLowerCase();
    const response = this.resolve<ResponseInterface>(ResponseContract, 404)
      .setHeader("Content-Type", "application/json")
      .setBody({
        error: normalize(StatusText[404]),
        reason: "service instance not found",
      });
    return Promise.resolve(response);
  }

  public request(method: RequestMethod, path: string): RequestInterface {
    return this.resolve<RequestInterface>(RequestContract, this, method, path);
  }

  public restart(
    origin: string,
    name: string,
    store?: Record<string, unknown>,
  ): ServiceInstanceInterface {
    this.stop(origin);
    return this.start(origin, name, store);
  }

  public service(name: string): ServiceDefinitionInterface {
    if (!(name in this._services))
      this._services[name] = this.resolve<ServiceDefinitionInterface>(
        ServiceDefinitionContract,
        name,
      );
    return this._services[name];
  }

  public start(
    origin: string,
    name: string,
    store: Record<string, unknown> = {},
  ): ServiceInstanceInterface {
    if (origin in this._instances) {
      const context = `Starting service instance on '${origin}'.`;
      const problem = `Another service already running on '${origin}'.`;
      const solution = `Please stop the service and try again.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    if (!(name in this._services)) {
      const context = `Starting service instance on '${origin}'.`;
      const problem = `Service '${name}' not found.`;
      const solution = `Please start service on another process.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    const service = this._services[name];
    this.install(origin, service.provider);

    const instance = this.resolve<ServiceInstanceInterface>(
      ServiceInstanceContract,
      service,
      origin,
      store,
    );
    service.instances[origin] = instance;
    this._instances[origin] = instance;
    return instance;
  }

  public stop(origin: string): ServiceInstanceInterface {
    if (!(origin in this._instances)) {
      const context = `Stoping service instance on '${origin}'.`;
      const problem = `Service not found.`;
      const solution = `Please stop another service.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    const instance = this._instances[origin];
    delete instance.service.instances[origin];
    delete this._instances[origin];
    return instance;
  }
}
