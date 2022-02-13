import { ContainerInterface, ProviderInterface } from "@marubase/container";
import { Context } from "./context.js";
import { ContextContract } from "./contracts/context.contract.js";
import { RequestContract } from "./contracts/request.contract.js";
import { ResponseContract } from "./contracts/response.contract.js";
import { ServiceDefinitionContract } from "./contracts/service-definition.contract.js";
import { ServiceInstanceContract } from "./contracts/service-instance.contract.js";
import { ServiceManagerContract } from "./contracts/service-manager.contract.js";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { ServiceDefinition } from "./service-definition.js";
import { ServiceInstance } from "./service-instance.js";

export class ServiceManagerProvider implements ProviderInterface {
  public install(container: ContainerInterface): void {
    container.bind(ContextContract).toClass(Context);
    container.bind(RequestContract).toClass(Request);
    container.bind(ResponseContract).toClass(Response);
    container.bind(ServiceDefinitionContract).toClass(ServiceDefinition);
    container.bind(ServiceInstanceContract).toClass(ServiceInstance);
    container.bind(ServiceManagerContract).toInstance(container);
  }

  public uninstall(container: ContainerInterface): void {
    container.unbind(ContextContract);
    container.unbind(RequestContract);
    container.unbind(ResponseContract);
    container.unbind(ServiceDefinitionContract);
    container.unbind(ServiceInstanceContract);
    container.unbind(ServiceManagerContract);
  }
}
