import { inject, resolvable } from "@marubase/container";
import {
  RequestContract,
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import { ServiceDefinitionInterface } from "./contracts/service-definition.contract.js";
import { ServiceInstanceInterface } from "./contracts/service-instance.contract.js";
import {
  ServiceManagerContract,
  ServiceManagerInterface,
} from "./contracts/service-manager.contract.js";

@resolvable()
export class ServiceInstance implements ServiceInstanceInterface {
  protected _manager: ServiceManagerInterface;

  protected _origin: string;

  protected _service: ServiceDefinitionInterface;

  protected _store: Record<string, unknown>;

  public constructor(
    @inject(ServiceManagerContract) manager: ServiceManagerInterface,
    service: ServiceDefinitionInterface,
    origin: string,
    store: Record<string, unknown>,
  ) {
    this._manager = manager;
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
    return this._manager
      .resolve<RequestInterface>(RequestContract, this._service, method, path)
      .setOrigin(this._origin);
  }
}
