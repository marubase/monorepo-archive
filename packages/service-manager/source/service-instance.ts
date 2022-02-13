import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import { ServiceDefinitionInterface } from "./contracts/service-definition.contract.js";
import { ServiceInstanceInterface } from "./contracts/service-instance.contract.js";
import { ServiceManagerFactory } from "./contracts/service-manager.contract.js";

export class ServiceInstance implements ServiceInstanceInterface {
  protected _factory: ServiceManagerFactory;

  protected _origin: string;

  protected _service: ServiceDefinitionInterface;

  protected _store: Record<string, unknown>;

  public constructor(
    factory: ServiceManagerFactory,
    service: ServiceDefinitionInterface,
    origin: string,
    store: Record<string, unknown>,
  ) {
    this._factory = factory;
    this._service = service;
    this._origin = origin;
    this._store = store;
  }

  public get origin(): string {
    return this._origin;
  }

  public get service(): ServiceDefinitionInterface {
    return this._service;
  }

  public get store(): Record<string, unknown> {
    return this._store;
  }

  public request(method: RequestMethod, path: string): RequestInterface {
    return this._factory
      .createRequest(this._service, method, path)
      .setOrigin(this._origin);
  }
}
