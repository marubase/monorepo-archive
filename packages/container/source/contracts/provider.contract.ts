import { ContainerContract } from "./container.contract.js";

export interface ProviderContract {
  boot?(container: ContainerContract): Promise<void>;

  install?(container: ContainerContract): void;

  shutdown?(container: ContainerContract): Promise<void>;

  uninstall?(container: ContainerContract): void;
}

export type ProviderName = string | symbol;
