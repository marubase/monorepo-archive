import { ContainerInterface, ProviderInterface } from "@marubase/container";
import { RouterInterface } from "./router.contract.js";
import { ServiceInstanceInterface } from "./service-instance.contract.js";

export const ServiceDefinitionContract = Symbol("ServiceDefinitionContract");

export interface ServiceDefinitionInterface extends RouterInterface {
  readonly instances: Record<string, ServiceInstanceInterface>;

  readonly name: string;

  readonly provider: ProviderInterface;

  boot(bootFn: ServiceBootFn): this;

  configure(configureFn: ServiceConfigureFn): this;

  install(installFn: ServiceInstallFn): this;

  restart(
    origin: string,
    store?: Record<string, unknown>,
  ): ServiceInstanceInterface;

  shutdown(shutdownFn: ServiceShutdownFn): this;

  start(
    origin: string,
    store?: Record<string, unknown>,
  ): ServiceInstanceInterface;

  stop(origin: string): ServiceInstanceInterface;

  uninstall(uninstallFn: ServiceUninstallFn): this;
}

export type ServiceBootFn = (container: ContainerInterface) => Promise<void>;

export type ServiceConfigureFn = (service: ServiceDefinitionInterface) => void;

export type ServiceInstallFn = (container: ContainerInterface) => void;

export type ServiceShutdownFn = (
  container: ContainerInterface,
) => Promise<void>;

export type ServiceUninstallFn = (container: ContainerInterface) => void;
