import { StatusCode } from "../contracts/response.contract.js";

export class FrameworkError extends Error {
  public constructor(public statusCode: StatusCode, message?: string) {
    super(message);
  }
}
