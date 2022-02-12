import { StatusCode } from "../contracts/response.contract.js";

export class ServiceError extends Error {
  public constructor(public statusCode: StatusCode, message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
