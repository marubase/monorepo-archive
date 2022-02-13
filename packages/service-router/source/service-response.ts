import { resolvable } from "@marubase/container";
import {
  ServiceResponseInterface,
  StatusCode,
  StatusText,
} from "./contracts/service-response.contract.js";
import { ServiceMessage } from "./service-message.js";

@resolvable()
export class ServiceResponse
  extends ServiceMessage
  implements ServiceResponseInterface
{
  protected _statusCode: StatusCode = 200;

  protected _statusText = StatusText[200];

  public get statusCode(): StatusCode {
    return this._statusCode;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public setStatusCode(statusCode: StatusCode): this {
    this._statusCode = statusCode;
    this._statusText = StatusText[statusCode];
    return this;
  }

  public setStatusText(statusText: string): this {
    this._statusText = statusText;
    return this;
  }
}
