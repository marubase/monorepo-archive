import { Container } from "@marubase/container";
import { ServiceManagerInterface } from "./contracts/service-manager.contract.js";
import {
  ConfigureFn,
  ServiceRouterContract,
  ServiceRouterInterface,
} from "./contracts/service-router.contract.js";
import { ServiceManagerError } from "./errors/service-manager.error.js";

export class ServiceManager
  extends Container
  implements ServiceManagerInterface
{
  protected _routers: Record<string, ServiceRouterInterface> = {};

  protected _services: Record<string, ServiceRouterInterface> = {};
  public get routers(): Record<string, ServiceRouterInterface> {
    return this._routers;
  }

  public get services(): Record<string, ServiceRouterInterface> {
    return this._services;
  }

  public configure(name: string, configureFn: ConfigureFn): this {
    if (!(name in this._routers))
      this._routers[name] = this.resolve(ServiceRouterContract);
    this._routers[name].configure(configureFn);
    return this;
  }

  public host(origin: string, service: string): this {
    if (origin in this._services) {
      const context = `Hosting service at '${origin}'.`;
      const problem = `Another service already hosting at '${origin}'.`;
      const solution = `Please try to host service at another origin.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }

    const router = this._routers[service];
    if (!router) {
      const context = `Hosting service at '${origin}'.`;
      const problem = `Service '${service}' not found.`;
      const solution = `Please try to host another service.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    this._services[origin] = router;
    return this;
  }

  public router(name: string): ServiceRouterInterface {
    if (!(name in this._routers)) {
      const context = `Getting service router by name '${name}'.`;
      const problem = `Service router not found.`;
      const solution = `Please get another service router.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    return this._routers[name];
  }

  public service(origin: string): ServiceRouterInterface {
    if (!(origin in this._services)) {
      const context = `Getting service router by origin '${origin}'.`;
      const problem = `Service router not found.`;
      const solution = `Please get another service router.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    return this._services[origin];
  }

  public unhost(origin: string): this {
    if (!(origin in this._services)) {
      const context = `Un-hosting service at '${origin}'.`;
      const problem = `No service hosting at '${origin}'.`;
      const solution = `Please try to un-host service at another origin.`;
      throw new ServiceManagerError(500, `${context} ${problem} ${solution}`);
    }
    delete this._services[origin];
    return this;
  }
}
