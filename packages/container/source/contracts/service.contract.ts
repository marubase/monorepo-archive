export interface ServiceContract {
  onBoot?(): Promise<void>;
  onInstall?(): void;
  onShutdown?(): Promise<void>;
  onUninstall?(): void;
}
