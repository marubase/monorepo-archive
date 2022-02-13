import { StatusCode } from "../contracts/service-response.contract.js";

export class ServiceRouterError extends Error {
  public constructor(public statusCode: StatusCode, message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
