import { Container } from "@marubase/container";
import { Context } from "./context.js";
import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusText,
} from "./contracts/response.contract.js";
import { ServiceDefinitionInterface } from "./contracts/service-definition.contract.js";
import { ServiceInstanceInterface } from "./contracts/service-instance.contract.js";
import {
  ServiceManagerFactory,
  ServiceManagerInterface,
} from "./contracts/service-manager.contract.js";
import { ServiceManagerError } from "./errors/service-manager.error.js";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { ServiceDefinition } from "./service-definition.js";
import { ServiceInstance } from "./service-instance.js";

export class ServiceManager
  extends Container
  implements ServiceManagerInterface
{
  protected _factory: ServiceManagerFactory;

  protected _instances: Record<string, ServiceInstanceInterface> = {};

  protected _services: Record<string, ServiceDefinitionInterface> = {};

  public constructor(
    factory: ServiceManagerFactory = DefaultServiceManagerFactory,
  ) {
    super();
    this._factory = factory;
  }

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
    const response = this._factory
      .createResponse(404)
      .setHeader("Content-Type", "application/json")
      .setBody({
        error: normalize(StatusText[404]),
        reason: "service instance not found",
      });
    return Promise.resolve(response);
  }

  public request(method: RequestMethod, path: string): RequestInterface {
    return this._factory.createRequest(this, method, path);
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
      this._services[name] = this._factory.createServiceDefinition(
        this._factory,
        this,
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

    const instance = this._factory.createServiceInstance(
      this._factory,
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

export const DefaultServiceManagerFactory: ServiceManagerFactory = {
  createContext: (factory, manager, request) =>
    new Context(factory, manager, request),

  createRequest: (dispatchable, method, path) =>
    new Request(dispatchable, method, path),

  createResponse: (statusCode, StatusText) =>
    new Response(statusCode, StatusText),

  createServiceDefinition: (factory, manager, name) =>
    new ServiceDefinition(factory, manager, name),

  createServiceInstance: (factory, service, origin, store) =>
    new ServiceInstance(factory, service, origin, store),
};
