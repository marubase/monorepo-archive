import { ContainerInterface, ProviderInterface } from "@marubase/container";
import { ServiceContextContract } from "./contracts/service-context.contract.js";
import { ServiceManagerContract } from "./contracts/service-manager.contract.js";
import { ServiceRequestContract } from "./contracts/service-request.contract.js";
import { ServiceResponseContract } from "./contracts/service-response.contract.js";
import { ServiceRouterContract } from "./contracts/service-router.contract.js";
import { ServiceContext } from "./service-context.js";
import { ServiceRequest } from "./service-request.js";
import { ServiceResponse } from "./service-response.js";
import { ServiceRouter } from "./service-router.js";

export class ServiceManagerProvider implements ProviderInterface {
  public install(container: ContainerInterface): void {
    container.bind(ServiceManagerContract).toInstance(container);
    container.bind(ServiceRequestContract).toClass(ServiceRequest);
    container.bind(ServiceResponseContract).toClass(ServiceResponse);

    container
      .bind(ServiceContextContract)
      .toClass(ServiceContext)
      .setDependencies([ServiceManagerContract]);

    container
      .bind(ServiceRouterContract)
      .toClass(ServiceRouter)
      .setDependencies([ServiceManagerContract]);
  }

  public uninstall(container: ContainerInterface): void {
    container.unbind(ServiceContextContract);
    container.unbind(ServiceManagerContract);
    container.unbind(ServiceRequestContract);
    container.unbind(ServiceResponseContract);
    container.unbind(ServiceRouterContract);
  }
}
