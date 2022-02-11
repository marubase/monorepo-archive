import { ContainerContract, ProviderContract } from "@marubase/container";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { Router } from "./router.js";

export class FrameworkServiceProvider implements ProviderContract {
  public install(container: ContainerContract): void {
    container.bind(Request).toSelf();
    container.bind(Response).toSelf();
    container.bind(Router).toSelf();
  }

  public uninstall(container: ContainerContract): void {
    container.unbind(Request);
    container.unbind(Response);
    container.unbind(Router);
  }
}
