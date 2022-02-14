import { StatusCode } from "../contracts/service-response.contract.js";

export class ServiceManagerError extends Error {
  public constructor(public statusCode: StatusCode, message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
