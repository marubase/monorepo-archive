import { ContainerInterface } from "./container.contract.js";

export interface ProviderInterface {
  boot?(container: ContainerInterface): Promise<void>;

  install?(container: ContainerInterface): void;

  shutdown?(container: ContainerInterface): Promise<void>;

  uninstall?(container: ContainerInterface): void;
}

export type ProviderName = string | symbol;
