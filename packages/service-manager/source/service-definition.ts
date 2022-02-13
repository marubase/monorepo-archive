import { inject, ProviderInterface, resolvable } from "@marubase/container";
import {
  ServiceBootFn,
  ServiceConfigureFn,
  ServiceDefinitionInterface,
  ServiceInstallFn,
  ServiceShutdownFn,
  ServiceUninstallFn,
} from "./contracts/service-definition.contract.js";
import { ServiceInstanceInterface } from "./contracts/service-instance.contract.js";
import {
  ServiceManagerContract,
  ServiceManagerInterface,
} from "./contracts/service-manager.contract.js";
import { Router } from "./router.js";

@resolvable()
export class ServiceDefinition
  extends Router
  implements ServiceDefinitionInterface
{
  protected _bootFns: ServiceBootFn[] = [];

  protected _installFns: ServiceInstallFn[] = [];

  protected _instances: Record<string, ServiceInstanceInterface> = {};

  protected _name: string;

  protected _shutdownFns: ServiceShutdownFn[] = [];

  protected _uninstallFns: ServiceUninstallFn[] = [];

  public constructor(
    @inject(ServiceManagerContract) manager: ServiceManagerInterface,
    name: string,
  ) {
    super(manager);
    this._name = name;
  }

  public get instances(): Record<string, ServiceInstanceInterface> {
    return this._instances;
  }

  public get name(): string {
    return this._name;
  }

  public get provider(): ProviderInterface {
    return {
      boot: async (container) => {
        for (const bootFn of this._bootFns) await bootFn(container);
      },
      install: (container) => {
        for (const installFn of this._installFns) installFn(container);
      },
      shutdown: async (container) => {
        for (const shutdownFn of this._shutdownFns) await shutdownFn(container);
      },
      uninstall: (container) => {
        for (const uninstallFn of this._uninstallFns) uninstallFn(container);
      },
    };
  }

  public boot(bootFn: ServiceBootFn): this {
    this._bootFns.push(bootFn);
    return this;
  }

  public configure(configureFn: ServiceConfigureFn): this {
    configureFn(this);
    return this;
  }

  public install(installFn: ServiceInstallFn): this {
    this._installFns.push(installFn);
    return this;
  }

  public restart(
    origin: string,
    store: Record<string, unknown> = {},
  ): ServiceInstanceInterface {
    return this._manager.restart(origin, this._name, store);
  }

  public shutdown(shutdownFn: ServiceShutdownFn): this {
    this._shutdownFns.push(shutdownFn);
    return this;
  }

  public start(
    origin: string,
    store: Record<string, unknown> = {},
  ): ServiceInstanceInterface {
    return this._manager.start(origin, this._name, store);
  }

  public stop(origin: string): ServiceInstanceInterface {
    return this._manager.stop(origin);
  }

  public uninstall(uninstallFn: ServiceUninstallFn): this {
    this._uninstallFns.push(uninstallFn);
    return this;
  }
}
