import { Message } from "@marubase-tools/message";
import {
  ServiceResponseInterface,
  StatusCode,
  StatusText,
} from "./contracts/service-response.contract.js";

export class ServiceResponse
  extends Message
  implements ServiceResponseInterface
{
  protected _protocol = "HTTP/1.1";

  protected _statusCode: StatusCode = 200;

  protected _statusText = StatusText[200];

  public get protocol(): string {
    return this._protocol;
  }

  public get statusCode(): StatusCode {
    return this._statusCode;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public setProtocol(protocol: string): this {
    this._protocol = protocol;
    return this;
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
