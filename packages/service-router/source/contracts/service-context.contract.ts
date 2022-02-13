import { ContainerInterface } from "@marubase/container";
import { StatusCode } from "../../../service-manager/source/contracts/response.contract.js";
import { ServiceManagerInterface } from "./service-manager.contract.js";
import { ServiceRequestMethod } from "./service-request.contract.js";
import { ServiceResponseInterface } from "./service-response.contract.js";

export const ServiceContextContract = Symbol("ContextContract");

export interface ServiceContextInterface extends Map<unknown, unknown> {
  readonly container: ContainerInterface;

  readonly credential?: [string, string] | string;

  readonly hash: string;

  readonly hostname: string;

  readonly manager: ServiceManagerInterface;

  readonly method: ServiceRequestMethod;

  readonly origin: string;

  readonly params: Record<string, string>;

  readonly path: string;

  readonly port: number;

  readonly queries: Record<string, string>;

  readonly scheme: string;

  replyWith(
    statusCode: StatusCode,
    statusText?: string,
  ): ServiceResponseInterface;
}
