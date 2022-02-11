import { StatusCode } from "../contracts/response.contract.js";

export class RouterError extends Error {
  public constructor(public status: StatusCode, message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
