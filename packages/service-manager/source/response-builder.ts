import {
  HttpResponseCode,
  ResponseBuilderContract,
} from "./contracts/response-builder.contract.js";
import { MessageBuilder } from "./message-builder.js";

export class ResponseBuilder
  extends MessageBuilder
  implements ResponseBuilderContract
{
  protected _status: keyof typeof HttpResponseCode = 200;

  protected _statusText = HttpResponseCode[200];

  public get status(): keyof typeof HttpResponseCode {
    return this._status;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public build(): Response {
    return this._container.resolve("lib:response", this._body, {
      headers: this._headers,
      status: this._status,
      statusText: this._statusText,
    });
  }

  public setStatus(status: keyof typeof HttpResponseCode): this {
    this._status = status;
    this._statusText = HttpResponseCode[status] || HttpResponseCode[500];
    return this;
  }

  public setStatusText(statusText: string): this {
    this._statusText = statusText;
    return this;
  }
}
