import {
  ResponseInterface,
  StatusCode,
  StatusText,
} from "./contracts/response.contract.js";
import { Message } from "./message.js";

export class Response extends Message implements ResponseInterface {
  protected _statusCode: StatusCode = 200;

  protected _statusText = StatusText[200];

  public constructor(statusCode: StatusCode, statusText?: string) {
    super();
    if (typeof statusText === "undefined") this.setStatusCode(statusCode);
    else this.setStatusCode(statusCode).setStatusText(statusText);
  }

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
